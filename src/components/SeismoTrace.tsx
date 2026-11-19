import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Activity,
  Radio,
  Sliders,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  Eye,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { playAlertBeep } from '../services/seismicApi';

interface SeismoStation {
  id: string;
  name: string;
  code: string;
  channel: string;
  location: string;
  sensorType: string;
  basePga: number;
}

const AVAILABLE_STATIONS: SeismoStation[] = [
  {
    id: 'otavalo',
    name: 'ESTACIÓN OTAVALO',
    code: 'OTAV.EC',
    channel: 'CANAL HHZ (BANDA ANCHA)',
    location: 'Imbabura, Ecuador • Red RENSIG/FDSN',
    sensorType: 'Nanometrics Trillium 120QA (Banda Ancha)',
    basePga: 0.048,
  },
  {
    id: 'pedernales',
    name: 'ESTACIÓN PEDERNALES',
    code: 'PEDE.EC',
    channel: 'CANAL HNZ (ACELERACIÓN FUERTE)',
    location: 'Manabí, Ecuador • Epicentro Subducción',
    sensorType: 'Kinemetrics Episensor (Fuerte Movimiento)',
    basePga: 0.092,
  },
  {
    id: 'cotopaxi',
    name: 'ESTACIÓN COTOPAXI 1',
    code: 'CO1V.EC',
    channel: 'CANAL EHZ (SÍSMICA VOLCÁNICA)',
    location: 'Flanco Norte Cotopaxi • Red RENSIG-IGEPN',
    sensorType: 'Sismómetro de Periodo Corto Mark L-4C',
    basePga: 0.024,
  },
  {
    id: 'esmeraldas',
    name: 'ESTACIÓN ESMERALDAS',
    code: 'ESME.EC',
    channel: 'CANAL HHZ (SUBDUCCIÓN MARINA)',
    location: 'Esmeraldas Costa Norte • Red Alerta Tsunami',
    sensorType: 'Streckeisen STS-2 Broadband',
    basePga: 0.065,
  },
];

interface SeismoTraceProps {
  stationName?: string;
  stationCode?: string;
  channel?: string;
  pga?: number;
}

export const SeismoTrace: React.FC<SeismoTraceProps> = ({
  stationName = 'ESTACIÓN OTAVALO',
  stationCode = 'OTAV.EC',
  channel = 'CANAL HHZ (BANDA ANCHA)',
  pga = 0.048,
}) => {
  const [selectedStation, setSelectedStation] = useState<SeismoStation>(
    AVAILABLE_STATIONS.find(s => s.code === stationCode) || AVAILABLE_STATIONS[0]
  );
  const [gain, setGain] = useState<number>(1.0);
  const [filterMode, setFilterMode] = useState<'butterworth' | 'raw'>('butterworth');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isStationMenuOpen, setIsStationMenuOpen] = useState<boolean>(false);

  // Live detector states
  const [detectorStatus, setDetectorStatus] = useState<'nominal' | 'triggered' | 'coda'>('nominal');
  const [staLtaRatio, setStaLtaRatio] = useState<number>(1.18);
  const [livePga, setLivePga] = useState<number>(pga);
  const [latencyMs, setLatencyMs] = useState<number>(142);
  const [packetCount, setPacketCount] = useState<number>(89412);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pointsRef = useRef<number[]>([]);
  const simStepRef = useRef<number>(0);
  const simActiveRef = useRef<boolean>(false);

  // Initialize canvas buffer points
  useEffect(() => {
    const totalPoints = 350;
    const initialPoints = new Array(totalPoints).fill(0);
    pointsRef.current = initialPoints;
  }, []);

  // Continuous real-time waveform generator loop
  useEffect(() => {
    let lastTime = performance.now();

    const renderWave = (currentTime: number) => {
      const delta = currentTime - lastTime;
      if (delta >= 30) {
        lastTime = currentTime;

        // Generate next sample
        let sample = 0;

        if (simActiveRef.current) {
          simStepRef.current += 1;
          const step = simStepRef.current;

          if (step < 25) {
            // P-Wave arrival (high frequency, moderate amplitude)
            sample = Math.sin(step * 0.8) * 16 + (Math.random() - 0.5) * 8;
            setDetectorStatus('triggered');
            setStaLtaRatio(prev => Math.min(8.5, Number((prev + 0.45).toFixed(2))));
            setLivePga(prev => Number(Math.max(prev, 0.124).toFixed(3)));
          } else if (step < 75) {
            // S-Wave peak (high amplitude, shear motion)
            const decay = Math.max(0.3, 1 - (step - 25) / 50);
            sample = (Math.sin(step * 0.45) * 32 + Math.cos(step * 0.9) * 18) * decay;
            setDetectorStatus('triggered');
            setStaLtaRatio(prev => Number((4.5 + Math.random() * 2).toFixed(2)));
            setLivePga(0.185);
          } else if (step < 140) {
            // Coda wave decay
            const codaDecay = Math.max(0.05, 1 - (step - 75) / 65);
            sample = (Math.sin(step * 0.3) * 12 + (Math.random() - 0.5) * 6) * codaDecay;
            setDetectorStatus('coda');
            setStaLtaRatio(prev => Math.max(1.4, Number((prev - 0.08).toFixed(2))));
            setLivePga(prev => Number(Math.max(0.048, prev - 0.003).toFixed(3)));
          } else {
            // Reset simulation
            simActiveRef.current = false;
            simStepRef.current = 0;
            setIsSimulatingEvent(false);
            setDetectorStatus('nominal');
            setStaLtaRatio(1.22);
            setLivePga(selectedStation.basePga);
          }
        } else {
          // Ambient microseismic background noise (Ecuadorian Andean crust)
          const microseism = Math.sin(currentTime * 0.003) * 1.5;
          const culturalNoise = (Math.random() - 0.5) * 3.2;
          sample = microseism + culturalNoise;

          // Subtle fluctuating baseline stats
          if (Math.random() > 0.8) {
            setStaLtaRatio(Number((1.05 + Math.random() * 0.35).toFixed(2)));
            setLatencyMs(Math.floor(130 + Math.random() * 35));
            setPacketCount(p => p + 1);
            setLivePga(Number((selectedStation.basePga + (Math.random() - 0.5) * 0.004).toFixed(3)));
          }
        }

        // Apply gain and filter factor
        const filteredSample = filterMode === 'butterworth' ? sample * gain : sample * gain * 1.25;

        // Shift buffer
        const buffer = pointsRef.current;
        buffer.shift();
        buffer.push(filteredSample);

        // Draw to Canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const width = canvas.width;
            const height = canvas.height;
            const midY = height / 2;

            ctx.clearRect(0, 0, width, height);

            // Draw oscilloscope background grid
            ctx.strokeStyle = '#182430';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // Horizontal grid lines
            ctx.moveTo(0, midY);
            ctx.lineTo(width, midY);
            ctx.moveTo(0, midY - 20);
            ctx.lineTo(width, midY - 20);
            ctx.moveTo(0, midY + 20);
            ctx.lineTo(width, midY + 20);
            ctx.stroke();

            // Zero line
            ctx.strokeStyle = '#223040';
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(0, midY);
            ctx.lineTo(width, midY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw waveform path
            ctx.beginPath();
            const stepX = width / (buffer.length - 1);

            for (let i = 0; i < buffer.length; i++) {
              const x = i * stepX;
              const y = midY - buffer[i];
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }

            // Glow and stroke styling
            if (detectorStatus === 'triggered') {
              ctx.strokeStyle = '#ff3b30';
              ctx.lineWidth = 2.4;
              ctx.shadowColor = '#ff3b30';
              ctx.shadowBlur = 10;
            } else if (detectorStatus === 'coda') {
              ctx.strokeStyle = '#ffd23d';
              ctx.lineWidth = 1.9;
              ctx.shadowColor = '#ffd23d';
              ctx.shadowBlur = 6;
            } else {
              ctx.strokeStyle = '#ff5a36';
              ctx.lineWidth = 1.5;
              ctx.shadowColor = '#ff5a36';
              ctx.shadowBlur = 4;
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // reset shadow

            // Draw Real-Time Scanner Laser / Playhead at the right edge
            const leadX = width - 4;
            ctx.strokeStyle = detectorStatus === 'triggered' ? '#ff3b30' : '#2dd4bf';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = detectorStatus === 'triggered' ? '#ff3b30' : '#2dd4bf';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(leadX, 4);
            ctx.lineTo(leadX, height - 4);
            ctx.stroke();

            // Playhead indicator dot
            const currentHeadY = midY - (buffer[buffer.length - 1] || 0);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(leadX, currentHeadY, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    animationFrameRef.current = requestAnimationFrame(renderWave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gain, filterMode, detectorStatus, selectedStation]);

  // Trigger synthetic seismic event test
  const handleTriggerSyntheticQuake = useCallback(() => {
    if (simActiveRef.current) return;
    simActiveRef.current = true;
    simStepRef.current = 0;
    setIsSimulatingEvent(true);
    setDetectorStatus('triggered');

    if (!isMuted) {
      playAlertBeep(5.8);
    }
  }, [isMuted]);

  const handleSelectStation = (station: SeismoStation) => {
    setSelectedStation(station);
    setLivePga(station.basePga);
    setIsStationMenuOpen(false);
  };

  return (
    <div className="w-full bg-[#0d131a] border-t border-[#223040] shadow-xl flex flex-col font-mono-code relative">
      {/* Top Banner: Real-Time Detector Alert & Station Bar */}
      <div className="px-3 sm:px-4 py-2 bg-[#10161d] border-b border-[#1f2d3d] flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Station identity and Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStationMenuOpen(prev => !prev)}
              className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#16212d] hover:bg-[#1d2c3c] border border-[#2b3c4f] text-[#e8eef2] transition-colors"
            >
              <Activity className="w-4 h-4 text-[#ff5a36] animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-bold font-display text-[#ffd23d] flex items-center gap-1.5">
                  <span>{selectedStation.name}</span>
                  <span className="text-[#a0b0be] text-[10px]">({selectedStation.code})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7f93a3]" />
                </div>
              </div>
            </button>

            {/* Station dropdown */}
            {isStationMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 bg-[#141b23] border border-[#2e4055] rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <div className="px-2 py-1 text-[10px] text-[#7f93a3] uppercase font-bold border-b border-[#223040]">
                  Seleccionar Sensor Sísmico Red RENSIG
                </div>
                {AVAILABLE_STATIONS.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleSelectStation(st)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                      selectedStation.id === st.id
                        ? 'bg-[#ff5a36]/20 border border-[#ff5a36]/40 text-[#ff8a3d]'
                        : 'hover:bg-[#1a232f] text-[#c0cad4]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{st.name}</span>
                      <span className="text-[10px] text-[#ffd23d]">{st.code}</span>
                    </div>
                    <span className="text-[10px] text-[#7f93a3]">{st.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden sm:inline-block font-mono-code text-[10px] px-2 py-0.5 bg-[#0a0e13] border border-[#223040] text-[#2dd4bf] rounded">
            {selectedStation.channel}
          </span>

          <span className="text-[10px] text-[#7f93a3] hidden md:inline">
            Sensor: <span className="text-[#c5d1dc]">{selectedStation.sensorType}</span>
          </span>
        </div>

        {/* Center: Live STA/LTA Detector Trigger Indicator */}
        <div className="flex items-center gap-2">
          {detectorStatus === 'triggered' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#3b1212] border border-[#ff3b30] text-[#ff3b30] animate-pulse">
              <Zap className="w-3.5 h-3.5 text-[#ff3b30] fill-[#ff3b30]" />
              <span className="text-[10px] font-bold tracking-wider">
                ¡DETECTOR STA/LTA ACTIVADO! (EVENTO EN VIVO)
              </span>
            </div>
          ) : detectorStatus === 'coda' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#2d2208] border border-[#ffd23d] text-[#ffd23d]">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold tracking-wider">
                REGISTRO DE CODA / DISIPACIÓN DE ONDA
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0a1715] border border-[#2dd4bf]/40 text-[#2dd4bf]">
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] live-pulse" />
              <span className="text-[10px] font-semibold tracking-wider">
                DETECTOR ACTIVO • ESCANEO CONTINUO
              </span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1 bg-[#0a0e13] px-2 py-0.5 rounded border border-[#223040] text-[10px]">
            <span className="text-[#7f93a3]">STA/LTA:</span>
            <span
              className={`font-bold ${
                staLtaRatio > 3.5 ? 'text-[#ff3b30]' : 'text-[#ffd23d]'
              }`}
            >
              {staLtaRatio.toFixed(2)}
            </span>
            <span className="text-[#475569]">(Umbral: 3.80)</span>
          </div>
        </div>

        {/* Right: Security & Administration Tag */}
        <div className="flex items-center gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#141b23] border border-[#ff8a3d]/30 text-[#ffd23d]">
            <ShieldCheck className="w-3 h-3 text-[#2dd4bf]" />
            <span className="font-bold">JMAC-SECURITY</span>
          </span>
        </div>
      </div>

      {/* Main Waveform Canvas Stage */}
      <div className="relative w-full h-16 sm:h-20 bg-[#070a0e] overflow-hidden flex items-center">
        {/* Canvas for Smooth High-Performance Waveform */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={80}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Real-time Watermark & Grid Legend */}
        <div className="absolute left-3 top-1.5 pointer-events-none flex items-center gap-3 text-[9px] text-[#4d6070]">
          <span className="text-[#ff5a36] font-bold">ESTACIÓN: {selectedStation.code}</span>
          <span>COMPONENTE Z</span>
          <span>BARRIDO: 25 mm/s</span>
          <span className="text-[#2dd4bf] hidden sm:inline">FILTRO: 0.1 - 10.0 Hz</span>
        </div>

        {/* Live Active Laser Scan Tag */}
        <div className="absolute right-3 top-1.5 pointer-events-none flex items-center gap-1.5 text-[9px] bg-[#0d131a]/90 px-2 py-0.5 rounded border border-[#223040]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping" />
          <span className="text-[#2dd4bf] font-bold">BARRIDO EN TIEMPO REAL</span>
        </div>

        {/* Floating PGA Pill */}
        <div className="absolute right-3 bottom-1.5 bg-[#0a0e13]/90 px-2.5 py-0.5 rounded-md border border-[#ff5a36]/40 flex items-center gap-2 shadow-lg">
          <span className="text-[9px] text-[#7f93a3]">ACEL. PICO:</span>
          <span className="font-display font-bold text-xs sm:text-sm text-[#ff5a36]">
            {livePga.toFixed(3)} g
          </span>
        </div>
      </div>

      {/* Bottom Control & Telemetry Strip */}
      <div className="px-3 sm:px-4 py-1.5 bg-[#0a0e13] border-t border-[#1a232d] flex flex-wrap items-center justify-between gap-2 text-[10px]">
        {/* Telemetry metrics */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#7f93a3] overflow-x-auto py-0.5">
          <div>
            Frecuencia: <span className="text-[#e8eef2] font-semibold">100 sps</span>
          </div>
          <div className="hidden sm:inline">
            Latencia: <span className="text-[#2dd4bf] font-semibold">{latencyMs} ms</span>
          </div>
          <div className="hidden md:inline">
            Paquetes FDSN: <span className="text-[#e8eef2]">{packetCount.toLocaleString()}</span>
          </div>
          <div>
            Canal: <span className="text-[#ffd23d]">{selectedStation.code}.HHZ</span>
          </div>
        </div>

        {/* Interactive Controls: Gain, Test Trigger, Audio */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Gain Selector */}
          <div className="flex items-center gap-1 bg-[#141b23] px-1.5 py-0.5 rounded border border-[#223040]">
            <span className="text-[#7f93a3]">Ganancia:</span>
            {[0.5, 1.0, 2.5].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGain(g)}
                className={`px-1.5 py-0.2 rounded font-bold transition-colors ${
                  gain === g
                    ? 'bg-[#ff5a36] text-[#0a0e13]'
                    : 'text-[#7f93a3] hover:text-[#e8eef2]'
                }`}
              >
                {g}x
              </button>
            ))}
          </div>

          {/* Synthetic Event Trigger Button */}
          <button
            type="button"
            onClick={handleTriggerSyntheticQuake}
            disabled={isSimulatingEvent}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-bold border transition-all ${
              isSimulatingEvent
                ? 'bg-[#3b1212] border-[#ff3b30] text-[#ff3b30] cursor-not-allowed'
                : 'bg-[#1e293b] hover:bg-[#334155] border-[#475569] text-[#ffd23d] hover:text-white'
            }`}
            title="Probar algoritmo detector de onda P y S con sismo simulado en tiempo real"
          >
            <Zap className="w-3 h-3 text-[#ffd23d]" />
            <span>{isSimulatingEvent ? 'ONDAS EN CURSO...' : 'PROBAR DETECTOR'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(prev => !prev)}
            className={`p-1 rounded border transition-colors ${
              !isMuted
                ? 'bg-[#141b23] border-[#223040] text-[#ff8a3d]'
                : 'bg-[#0a0e13] border-[#223040] text-[#4d6070]'
            }`}
            title={isMuted ? 'Activar sonido del detector' : 'Silenciar sonido'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
