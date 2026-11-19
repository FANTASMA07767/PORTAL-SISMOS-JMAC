import { Earthquake } from '../types/seismic';
import { INITIAL_EARTHQUAKES } from '../data/mockData';

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAlertBeep(mag = 5.0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freq1 = mag >= 5.0 ? 880 : 660;
    const freq2 = mag >= 5.0 ? 1320 : 990;

    [freq1, freq2].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t0 = now + i * 0.14;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.3);
    });
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
}

export function playNationalSirenSimulation(durationSec = 4) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    // Modulate pitch between 880Hz and 1320Hz
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.8; // 0.8 Hz siren cycle
    lfoGain.gain.value = 220; // Swing ±220 Hz
    osc.frequency.setValueAtTime(1100, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.setValueAtTime(0.25, now + durationSec - 0.5);
    gain.gain.linearRampToValueAtTime(0, now + durationSec);

    osc.connect(gain).connect(ctx.destination);
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + durationSec);
    osc.stop(now + durationSec);
  } catch (err) {
    console.warn('Siren simulation error:', err);
  }
}

export async function fetchLiveQuakes(scope: 'ecuador' | 'latam' = 'ecuador'): Promise<Earthquake[]> {
  const isEcuador = scope === 'ecuador';
  const bbox = isEcuador
    ? { minlat: -6.5, maxlat: 2.5, minlon: -92.5, maxlon: -74.5, minmag: 2.0, days: 15 }
    : { minlat: -56, maxlat: 33, minlon: -120, maxlon: -30, minmag: 4.0, days: 7 };

  const end = new Date();
  const start = new Date(end.getTime() - bbox.days * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 19);

  const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${iso(start)}&endtime=${iso(end)}&minlatitude=${bbox.minlat}&maxlatitude=${bbox.maxlat}&minlongitude=${bbox.minlon}&maxlongitude=${bbox.maxlon}&minmagnitude=${bbox.minmag}&orderby=time&limit=300`;

  try {
    const res = await fetch(usgsUrl);
    if (!res.ok) throw new Error(`USGS HTTP ${res.status}`);
    const data = await res.json();

    const liveItems: Earthquake[] = (data.features || []).map((f: {
      id: string;
      properties: {
        mag: number;
        magType: string;
        place: string;
        time: number;
        url: string;
        status: string;
      };
      geometry: { coordinates: number[] };
    }) => {
      const lon = f.geometry.coordinates[0];
      const lat = f.geometry.coordinates[1];
      const depth = f.geometry.coordinates[2] || 10;
      const mag = Number((f.properties.mag || 3.0).toFixed(1));
      const date = new Date(f.properties.time);
      
      const localTimeECT = date.toLocaleTimeString('es-EC', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' ECT';

      return {
        id: `USGS-${f.id}`,
        mag,
        magType: (f.properties.magType || 'mb').toUpperCase(),
        place: f.properties.place || 'Región Pacífica',
        region: f.properties.place || 'Límite Tectónico',
        depth: Number(depth.toFixed(1)),
        time: date.toISOString(),
        localTimeECT,
        lat,
        lon,
        source: 'USGS',
        status: 'REVISADO',
        maxIntensityMMI: mag >= 6.0 ? 'VI (Fuerte)' : mag >= 5.0 ? 'V (Poco Fuerte)' : mag >= 4.0 ? 'IV (Moderado)' : 'III (Leve)',
        feltReportsCount: Math.floor(Math.pow(mag, 3.5) * 2),
        pgaG: Number((Math.pow(10, (mag * 0.45) - 3.2)).toFixed(3)),
        tsunamiAlert: mag >= 7.0 && depth < 40,
        tsunamiMessage: mag >= 7.0 ? 'EVALUACIÓN EN CURSO (INOCAR)' : 'NO GENERA ALERTA DE TSUNAMI',
        url: f.properties.url,
        coordinatesString: `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'O'}`
      };
    });

    if (liveItems.length > 0) {
      // Merge with initial catalog to ensure iconic Ecuadorian events remain visible
      const mergedMap = new Map<string, Earthquake>();
      INITIAL_EARTHQUAKES.forEach(q => mergedMap.set(q.id, q));
      liveItems.forEach(q => mergedMap.set(q.id, q));
      return Array.from(mergedMap.values()).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    }

    return INITIAL_EARTHQUAKES;
  } catch (err) {
    console.warn('Fallback to baseline earthquakes data:', err);
    return INITIAL_EARTHQUAKES;
  }
}

export function getDepthColor(depthKm: number): string {
  if (depthKm < 10) return '#ff3b30'; // Super shallow (<10km)
  if (depthKm < 30) return '#ff8a3d'; // 10-30km
  if (depthKm < 70) return '#ffd23d'; // 30-70km
  if (depthKm < 150) return '#35c7a6'; // 70-150km
  return '#5b8def'; // >150km (Deep Nazca slab)
}
