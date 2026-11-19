import React, { useState } from 'react';
import {
  ShieldCheck,
  Waves,
  Layers,
  FileCode,
  FileSpreadsheet,
  FileText,
  Activity,
  History,
  MessageSquarePlus,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Earthquake } from '../types/seismic';
import { TELEMETRY_STATIONS } from '../data/mockData';
import { CitizenReportModal } from './CitizenReportModal';
import { OfficialBulletinModal } from './OfficialBulletinModal';

interface EventDetailViewProps {
  currentQuake: Earthquake;
  allQuakes: Earthquake[];
  onSelectQuake: (q: Earthquake) => void;
  onNavigateToTectonic: () => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  currentQuake,
  allQuakes,
  onSelectQuake,
  onNavigateToTectonic,
}) => {
  const [citizenReportsCount, setCitizenReportsCount] = useState(
    currentQuake.feltReportsCount || 3428
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);

  const handleCitizenReportSubmit = () => {
    setCitizenReportsCount(prev => prev + 1);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportQuakeML = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<quakeml xmlns="http://quakeml.org/xmlns/quakeml/1.2">
  <eventParameters publicID="smi:org.igepn.ec/eventparameters/${currentQuake.id}">
    <event publicID="smi:org.igepn.ec/event/${currentQuake.id}">
      <type>earthquake</type>
      <origin publicID="smi:org.igepn.ec/origin/${currentQuake.id}">
        <time><value>${currentQuake.time}</value></time>
        <latitude><value>${currentQuake.lat}</value></latitude>
        <longitude><value>${currentQuake.lon}</value></longitude>
        <depth><value>${currentQuake.depth * 1000}</value></depth>
        <evaluationMode>manual</evaluationMode>
        <evaluationStatus>final</evaluationStatus>
      </origin>
      <magnitude publicID="smi:org.igepn.ec/magnitude/${currentQuake.id}">
        <mag><value>${currentQuake.mag}</value></mag>
        <type>${currentQuake.magType}</type>
      </magnitude>
    </event>
  </eventParameters>
</quakeml>`;
    downloadFile(`${currentQuake.id}_quakeml.xml`, xml, 'application/xml');
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [currentQuake.lon, currentQuake.lat, -currentQuake.depth],
          },
          properties: {
            id: currentQuake.id,
            mag: currentQuake.mag,
            magType: currentQuake.magType,
            place: currentQuake.place,
            time: currentQuake.time,
            mmi: currentQuake.maxIntensityMMI,
            pgaG: currentQuake.pgaG,
            source: currentQuake.source,
          },
        },
      ],
    };
    downloadFile(`${currentQuake.id}_shakemap.geojson`, JSON.stringify(geojson, null, 2), 'application/geo+json');
  };

  const handleExportSAC = () => {
    const sacHeader = `# SAC (Seismic Analysis Code) ASCII Header
DELTA      0.01
NPTS       6000
B          0.0
O          ${currentQuake.time}
KZDATE     2025059
KZTIME     14:32:18
KSTNM      PEDE
KCMPNM     HHE
MAG        ${currentQuake.mag}
EVLA       ${currentQuake.lat}
EVLO       ${currentQuake.lon}
EVDP       ${currentQuake.depth}
# [Data records follow in binary SAC format]`;
    downloadFile(`${currentQuake.id}_PEDE_HHE.sac.txt`, sacHeader, 'text/plain');
  };

  return (
    <div className="flex flex-col w-full flex-1 bg-[#101419]">
      {/* TOP TELEMETRY STATUS BAR */}
      <section className="w-full bg-[#0a0e13] px-4 lg:px-6 py-2.5 border-b border-[#223040] flex flex-wrap items-center justify-between gap-2.5 font-mono-code text-xs">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff8a3d] live-pulse" />
            <span className="text-[11px] text-[#ffb4a3] uppercase tracking-widest font-bold">
              EVENT ID: {currentQuake.id}
            </span>
          </div>

          <span className="text-[#4d6070] hidden sm:inline">|</span>
          <span className="text-[#7f93a3] text-[11px] hidden md:inline">
            SOLUCIÓN HIPOCENTRAL REVISADA (NIVEL 1)
          </span>

          <span className="px-2 py-0.5 rounded bg-[#141b23] border border-[#223040] text-[10px] text-[#2dd4bf] font-semibold">
            ESTADO: {currentQuake.status}
          </span>

          {/* Quick Earthquake Selector Dropdown */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[#4d6070] text-[10px] uppercase">Cambiar Sismo:</span>
            <select
              value={currentQuake.id}
              onChange={e => {
                const found = allQuakes.find(q => q.id === e.target.value);
                if (found) onSelectQuake(found);
              }}
              className="bg-[#141b23] border border-[#223040] rounded px-2 py-0.5 text-[#ffd23d] text-[11px] outline-none"
            >
              {allQuakes.map(q => (
                <option key={q.id} value={q.id}>
                  M {q.mag.toFixed(1)} — {q.place}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#4d6070] text-[11px]">
            LATENCIA: <span className="text-[#e8eef2] font-bold">1.4s</span>
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#ffd23d] bg-[#141b23] border border-[#223040] px-2.5 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span className="font-semibold">VALIDADO POR SISMÓLOGO DE GUARDIA</span>
          </div>
        </div>
      </section>

      {/* HERO EVENT MATRIX SPLIT (5 cols + 7 cols) */}
      <section className="w-full bg-[#10161d] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Primary Magnitude & Key Metric Tile (5 cols) */}
          <div className="lg:col-span-5 bg-[#141b23] border border-[#223040] rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#ff8a3d]/10 blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-1 rounded bg-[#2a1310] border border-[#ff8a3d]/30 text-[#ff8a3d] font-mono-code text-[11px] uppercase tracking-wider font-bold">
                  ZONA DE SUBDUCCIÓN COSTERA
                </span>
                <span className="font-mono-code text-xs text-[#7f93a3]">
                  {currentQuake.region}
                </span>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-[#ff8a3d]/20 border border-[#ff8a3d]/50 shadow-inner">
                  <span className="font-display text-4xl text-[#ff8a3d] font-bold tracking-tighter">
                    {currentQuake.mag.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display font-bold text-lg sm:text-xl text-[#e8eef2] tracking-tight">
                    {currentQuake.magType} (Magnitud de Momento)
                  </span>
                  <span className="font-sans-body text-sm text-[#7f93a3]">
                    {currentQuake.place}
                  </span>
                </div>
              </div>
            </div>

            {/* Hypocentral Parameters Sub-Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 bg-[#161f2b] border border-[#223040] rounded-lg p-3 font-mono-code">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-[#4d6070]">PROFUNDIDAD (h)</span>
                <span className="text-lg font-bold text-[#ff8a3d]">
                  {currentQuake.depth.toFixed(1)} <span className="text-xs text-[#7f93a3]">km</span>
                </span>
                <span className="text-[10px] text-[#2dd4bf]">
                  {currentQuake.depth < 30 ? 'Superficial (< 30km)' : 'Profundo (> 70km)'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-[#4d6070]">COORDENADAS</span>
                <span className="text-base font-bold text-[#e8eef2]">
                  {Math.abs(currentQuake.lat).toFixed(3)}° {currentQuake.lat >= 0 ? 'N' : 'S'}
                </span>
                <span className="text-xs text-[#7f93a3]">
                  {Math.abs(currentQuake.lon).toFixed(3)}° {currentQuake.lon >= 0 ? 'E' : 'W'}
                </span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[10px] uppercase text-[#4d6070]">HORA LOCAL (ECT)</span>
                <span className="text-sm font-semibold text-[#e8eef2]">
                  {currentQuake.localTimeECT}
                </span>
                <span className="text-[10px] text-[#4d6070]">UTC -05:00</span>
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[10px] uppercase text-[#4d6070]">HORA UNIVERSAL (UTC)</span>
                <span className="text-sm font-semibold text-[#e8eef2] truncate">
                  {currentQuake.time.slice(11, 19)}
                </span>
                <span className="text-[10px] text-[#4d6070]">{currentQuake.time.slice(0, 10)}</span>
              </div>
            </div>

            {/* Tsunami Evaluation Banner */}
            <div className="mt-4 p-3 rounded-lg bg-[#0a0e13] border border-[#2dd4bf]/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[#2dd4bf]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans-body font-bold text-xs text-[#e8eef2] uppercase tracking-wide">
                  {currentQuake.tsunamiAlert
                    ? 'ALERTA DE TSUNAMI EN OBSERVACIÓN'
                    : 'NO GENERA ALERTA DE TSUNAMI'}
                </span>
                <span className="font-mono-code text-[10px] text-[#7f93a3]">
                  Evaluación Técnica Conjunta: INOCAR (Ecuador) / PTWC (Pacífico) • Cero riesgo de oleaje anómalo
                </span>
              </div>
            </div>
          </div>

          {/* ShakeMap & Regional Spatial Exposure (7 cols) */}
          <div className="lg:col-span-7 bg-[#141b23] border border-[#223040] rounded-xl p-5 flex flex-col justify-between shadow-xl relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#ff8a3d]" />
                <h2 className="font-display font-bold text-sm sm:text-base text-[#e8eef2] uppercase tracking-tight">
                  ShakeMap: Intensidad Instrumental MMI
                </h2>
              </div>
              <div className="flex items-center gap-1.5 font-mono-code text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#161f2b] border border-[#223040] text-[#ffd23d] font-semibold">
                  ISO-LÍNEAS PGA
                </span>
                <span className="px-2 py-0.5 rounded bg-[#161f2b] border border-[#223040] text-[#5b8def] font-semibold">
                  ZONA COSTERA
                </span>
              </div>
            </div>

            {/* Static Map Simulation Canvas with Satellite Imagery & Data Markers */}
            <div
              className="relative w-full h-80 rounded-lg overflow-hidden bg-[#0a0e13] border border-[#223040] shadow-inner"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDphWJw6fVi2Sra7PcmxW-bVJn6Y5wMBeR8IIDLium2sW6buKDYVY3KtGCvdXFmM04e-2MsdqG_LIJ_ZH9WPhNI2gflc6uQpbCLRY7kwEb2xuxr0St9XC--N_0VhjrUAoC0b64SIGkG0wjL7OEbVZ9wdgRx0Ybr8zFiTAtLk1N5kTa3NBHLpax3OBMHt2hd0_7d-LV0_TQAs8Ya7KX4q8KM_kSfXpcm3UpB6PFZEta8nmiWvU9Z7MP2XQ')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay for telemetry styling */}
              <div className="absolute inset-0 bg-black/40 backdrop-contrast-125" />

              {/* Epicenter Pin Overlay */}
              <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-[#ff8a3d]/25 live-pulse absolute" />
                <span className="w-6 h-6 rounded-full bg-[#ff8a3d] border-2 border-white shadow-[0_0_16px_#ff8a3d] flex items-center justify-center text-[#0a0e13] text-[11px] font-bold">
                  ★
                </span>
                <div className="absolute left-8 bg-[#161f2b]/95 backdrop-blur-md px-2.5 py-1 rounded border border-[#ff8a3d]/60 shadow-xl whitespace-nowrap font-mono-code">
                  <span className="text-[11px] text-[#ff8a3d] font-bold block">
                    EPICENTRO M{currentQuake.mag.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#7f93a3]">
                    MMI {currentQuake.maxIntensityMMI || 'VI (Fuerte)'}
                  </span>
                </div>
              </div>

              {/* Quito City Marker */}
              <div className="absolute top-1/4 right-1/4 flex items-center gap-1.5 font-mono-code">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd23d]" />
                <span className="bg-[#10161d]/90 border border-[#223040] px-2 py-0.5 rounded text-[10px] text-[#e8eef2]">
                  Quito (MMI IV)
                </span>
              </div>

              {/* Guayaquil City Marker */}
              <div className="absolute bottom-1/4 right-1/3 flex items-center gap-1.5 font-mono-code">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd23d]" />
                <span className="bg-[#10161d]/90 border border-[#223040] px-2 py-0.5 rounded text-[10px] text-[#e8eef2]">
                  Guayaquil (MMI IV)
                </span>
              </div>

              {/* Map Legend Gradient Strip (Mercalli) */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#10161d]/90 backdrop-blur-md p-2 rounded border border-[#223040] flex flex-col gap-1 font-mono-code">
                <div className="flex justify-between text-[10px] text-[#7f93a3]">
                  <span>I (Imperceptible)</span>
                  <span>IV (Moderado)</span>
                  <span>VI (Fuerte)</span>
                  <span>VIII (Destructivo)</span>
                </div>
                <div className="h-2 w-full rounded bg-gradient-to-r from-[#5b8def] via-[#2dd4bf] via-[#ffd23d] to-[#ff3b30]" />
              </div>
            </div>

            {/* Regional Felt Report Summary Below Map */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono-code">
              <div className="bg-[#161f2b] p-2.5 rounded border border-[#223040]">
                <span className="text-[9.5px] text-[#4d6070] block uppercase truncate">
                  PEDERNALES / COJIMÍES
                </span>
                <span className="text-xs font-bold text-[#ff8a3d]">VI • Fuerte</span>
              </div>
              <div className="bg-[#161f2b] p-2.5 rounded border border-[#223040]">
                <span className="text-[9.5px] text-[#4d6070] block uppercase truncate">
                  ESMERALDAS / MANTA
                </span>
                <span className="text-xs font-bold text-[#ffd23d]">V • Poco Fuerte</span>
              </div>
              <div className="bg-[#161f2b] p-2.5 rounded border border-[#223040]">
                <span className="text-[9.5px] text-[#4d6070] block uppercase truncate">
                  QUITO / SANTO DOMINGO
                </span>
                <span className="text-xs font-bold text-[#2dd4bf]">IV • Moderado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRIAXIAL ACCELEROGRAM & REAL-TIME WAVEFORM INSPECTOR */}
      <section className="w-full bg-[#101419] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-[#ff5a36]" />
              <h2 className="font-display font-bold text-base sm:text-lg text-[#e8eef2] tracking-tight">
                Acelerograma Triaxial y Fase Sísmica
              </h2>
            </div>
            <p className="font-sans-body text-xs text-[#7f93a3] mt-1">
              Registro de aceleración del suelo en la estación de campo cercano{' '}
              <strong className="text-[#e8eef2] font-mono-code">PEDE (Pedernales Centro)</strong> a 41.2 km del hipocentro.
            </p>
          </div>

          {/* Acceleration Metrics Cluster */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono-code">
            <div className="bg-[#141b23] border border-[#223040] px-3 py-1.5 rounded">
              <span className="text-[10px] text-[#4d6070] block uppercase">PGA MÁX (COMP. E-W)</span>
              <span className="text-sm font-bold text-[#ff5a36]">
                18.2% g <span className="text-xs text-[#7f93a3] font-normal">(178.5 cm/s²)</span>
              </span>
            </div>
            <div className="bg-[#141b23] border border-[#223040] px-3 py-1.5 rounded">
              <span className="text-[10px] text-[#4d6070] block uppercase">TIEMPO S - P (Δt)</span>
              <span className="text-sm font-bold text-[#ffd23d]">5.38 s</span>
            </div>
            <div className="bg-[#141b23] border border-[#223040] px-3 py-1.5 rounded">
              <span className="text-[10px] text-[#4d6070] block uppercase">DURACIÓN BRACKETED</span>
              <span className="text-sm font-bold text-[#2dd4bf]">19.4 s</span>
            </div>
          </div>
        </div>

        {/* 3-Component Trace Stack (Z, N-S, E-W) */}
        <div className="flex flex-col gap-2.5 bg-[#10161d] p-3.5 rounded-xl border border-[#223040] shadow-lg">
          {/* Component Z (Vertical) */}
          <div className="bg-[#161f2b] p-2.5 rounded-lg border border-[#223040]/70">
            <div className="flex items-center justify-between text-xs font-mono-code mb-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0a0e13] text-[#e8eef2] font-semibold text-[11px]">
                  COMP: Z (Vertical)
                </span>
                <span className="text-[#2dd4bf] text-[10px]">
                  Llegada Onda P: 14:32:24.12 ECT
                </span>
              </div>
              <span className="text-[#7f93a3] text-[11px]">PGA: 9.4% g</span>
            </div>
            <div className="w-full h-14 bg-[#0a0e13] rounded border border-[#223040]/50 relative overflow-hidden flex items-center">
              <svg className="w-full h-full text-[#2dd4bf]" preserveAspectRatio="none" viewBox="0 0 1000 60">
                <line x1="0" y1="30" x2="1000" y2="30" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <path
                  d="M 0,30 L 140,30 L 155,28 L 170,32 L 180,30 L 210,18 L 225,44 L 240,12 L 255,48 L 270,10 L 290,52 L 310,22 L 330,38 L 350,26 L 380,35 L 420,29 L 460,32 L 520,30 L 1000,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <line x1="210" y1="0" x2="210" y2="60" stroke="#2dd4bf" strokeWidth="1.2" strokeDasharray="2,2" />
              </svg>
              <span className="absolute left-[214px] top-1 font-mono-code text-[9px] text-[#2dd4bf] bg-[#10161d]/90 px-1 rounded">
                Fase P
              </span>
            </div>
          </div>

          {/* Component N-S (Horizontal) */}
          <div className="bg-[#161f2b] p-2.5 rounded-lg border border-[#223040]/70">
            <div className="flex items-center justify-between text-xs font-mono-code mb-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0a0e13] text-[#e8eef2] font-semibold text-[11px]">
                  COMP: N-S (Horizontal)
                </span>
                <span className="text-[#ffd23d] text-[10px]">
                  Filtro Band-Pass: 0.1 - 20 Hz
                </span>
              </div>
              <span className="text-[#7f93a3] text-[11px]">PGA: 14.1% g</span>
            </div>
            <div className="w-full h-14 bg-[#0a0e13] rounded border border-[#223040]/50 relative overflow-hidden flex items-center">
              <svg className="w-full h-full text-[#ffd23d]" preserveAspectRatio="none" viewBox="0 0 1000 60">
                <line x1="0" y1="30" x2="1000" y2="30" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <path
                  d="M 0,30 L 210,30 L 225,26 L 245,34 L 270,29 L 360,30 L 375,10 L 390,50 L 410,6 L 430,55 L 450,14 L 470,48 L 500,20 L 530,42 L 580,26 L 630,34 L 700,29 L 1000,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <line x1="375" y1="0" x2="375" y2="60" stroke="#ffd23d" strokeWidth="1.2" strokeDasharray="2,2" />
              </svg>
              <span className="absolute left-[380px] top-1 font-mono-code text-[9px] text-[#ffd23d] bg-[#10161d]/90 px-1 rounded">
                Fase S
              </span>
            </div>
          </div>

          {/* Component E-W (Transversal Principal) */}
          <div className="bg-[#161f2b] p-2.5 rounded-lg border border-[#223040]/70">
            <div className="flex items-center justify-between text-xs font-mono-code mb-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#0a0e13] text-[#e8eef2] font-semibold text-[11px]">
                  COMP: E-W (Transversal Principal)
                </span>
                <span className="text-[#ff5a36] text-[10px] font-bold">
                  Pico Crítico de Aceleración
                </span>
              </div>
              <span className="text-[#ff5a36] text-[11px] font-bold">PGA: 18.2% g</span>
            </div>
            <div className="w-full h-16 bg-[#0a0e13] rounded border border-[#223040]/50 relative overflow-hidden flex items-center">
              <svg className="w-full h-full text-[#ff5a36]" preserveAspectRatio="none" viewBox="0 0 1000 60">
                <line x1="0" y1="30" x2="1000" y2="30" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <path
                  d="M 0,30 L 210,30 L 220,28 L 240,32 L 270,30 L 375,30 L 388,4 L 402,58 L 416,2 L 432,59 L 450,6 L 470,54 L 490,12 L 520,48 L 560,18 L 600,42 L 660,25 L 740,35 L 820,28 L 1000,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="416" cy="2" r="4" fill="#ff3b30" />
              </svg>
              <span className="absolute left-[424px] top-1 font-mono-code text-[9px] text-[#ff3b30] bg-[#10161d]/90 px-1 rounded font-bold">
                18.2% g (PGA Máximo)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DEEP GEOPHYSICAL MATRIX: FOCAL MECHANISM, TELEMETRY STATIONS & CITIZEN REPORTS */}
      <section className="w-full bg-[#10161d] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Focal Mechanism / Beachball Stereonet (4 cols) */}
          <div className="lg:col-span-4 bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-[#e8eef2] uppercase tracking-tight">
                  Mecanismo Focal
                </h3>
                <span className="font-mono-code text-[10px] text-[#5b8def] bg-[#161f2b] border border-[#223040] px-2 py-0.5 rounded font-semibold">
                  TENSOR MOMENTO
                </span>
              </div>
              <p className="font-sans-body text-xs text-[#7f93a3]">
                Solución estéreo-proyectada de plano de falla (Fosa Colombo-Ecuatoriana).
              </p>
            </div>

            {/* Custom Beachball SVG Diagram (Thrust / Subduction Fault) */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="w-44 h-44 rounded-full bg-[#0a0e13] border border-[#223040] p-2 shadow-inner flex items-center justify-center relative">
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="#141b23" stroke="#223040" strokeWidth="2" />
                  {/* Shaded Compressional Quadrants (Thrust fault configuration) */}
                  <path d="M 50,2 A 48,48 0 0,1 98,50 C 75,50 65,30 50,2 Z" fill="#ff5a36" opacity="0.9" />
                  <path d="M 50,98 A 48,48 0 0,1 2,50 C 25,50 35,70 50,98 Z" fill="#ff5a36" opacity="0.9" />
                  {/* N-S / E-W crosshairs */}
                  <line x1="50" y1="2" x2="50" y2="98" stroke="#7f93a3" strokeWidth="0.6" strokeDasharray="2,2" />
                  <line x1="2" y1="50" x2="98" y2="50" stroke="#7f93a3" strokeWidth="0.6" strokeDasharray="2,2" />
                  {/* Center focal marker */}
                  <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
                </svg>
                <span className="absolute top-1 text-[9px] font-mono-code text-[#4d6070] font-bold">N</span>
              </div>

              <div className="mt-3 text-center">
                <span className="font-sans-body font-bold text-xs text-[#e8eef2] block">
                  FALLA INVERSA (CABALGAMIENTO)
                </span>
                <span className="font-mono-code text-[10px] text-[#7f93a3]">
                  Placa de Nazca subduciendo bajo Placa Sudamericana
                </span>
              </div>
            </div>

            {/* Plane Parameters Readout */}
            <div className="bg-[#161f2b] border border-[#223040] rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center font-mono-code">
              <div>
                <span className="text-[9px] text-[#4d6070] uppercase block">RUMBO (Strike)</span>
                <span className="text-sm font-bold text-[#e8eef2]">028°</span>
              </div>
              <div>
                <span className="text-[9px] text-[#4d6070] uppercase block">BUZAM. (Dip)</span>
                <span className="text-sm font-bold text-[#e8eef2]">18°</span>
              </div>
              <div>
                <span className="text-[9px] text-[#4d6070] uppercase block">DESLIZ. (Rake)</span>
                <span className="text-sm font-bold text-[#e8eef2]">102°</span>
              </div>
            </div>
          </div>

          {/* Station Telemetry Network Table (4 cols) */}
          <div className="lg:col-span-4 bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-[#e8eef2] uppercase tracking-tight">
                  Estaciones de Telemetría
                </h3>
                <span className="font-mono-code text-[10px] text-[#7f93a3]">
                  38 SENSORES ACTIVOS
                </span>
              </div>
              <p className="font-sans-body text-xs text-[#7f93a3]">
                Datos telemétricos de estaciones sismológicas de banda ancha de la RENSIG.
              </p>
            </div>

            <div className="flex flex-col gap-2 my-3 font-mono-code">
              {TELEMETRY_STATIONS.map(st => (
                <div
                  key={st.code}
                  className="bg-[#161f2b] border border-[#223040] p-2.5 rounded-lg flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2dd4bf] live-pulse" />
                      <span className="text-xs font-bold text-[#e8eef2]">
                        {st.code} ({st.name.split(' ')[0]})
                      </span>
                    </div>
                    <span className="text-[10px] text-[#4d6070]">
                      Dist. Epicentral: {st.distKm} km
                    </span>
                  </div>
                  <div className="flex flex-col items-end text-xs">
                    <span className="text-[#ff8a3d] font-bold">
                      Residuo: {st.residualSec > 0 ? `+${st.residualSec}s` : `${st.residualSec}s`}
                    </span>
                    <span className="text-[10px] text-[#7f93a3]">SNR: {st.snrDb} dB</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#223040]/50 text-[#4d6070] font-mono-code text-[10px]">
              <span>Gap Azimutal: 104°</span>
              <span>RMS: 0.28 seg</span>
            </div>
          </div>

          {/* Citizen Science: "Did You Feel It?" / Reportes Ciudadanos (4 cols) */}
          <div className="lg:col-span-4 bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-[#e8eef2] uppercase tracking-tight">
                  Reportes Ciudadanos
                </h3>
                <span className="font-mono-code text-[10px] text-[#ff8a3d] bg-[#2a1310] border border-[#ff8a3d]/30 px-2 py-0.5 rounded font-bold">
                  EN VIVO
                </span>
              </div>
              <p className="font-sans-body text-xs text-[#7f93a3]">
                Programa geofísico participativo “¿Sintió el Sismo?” en tiempo real.
              </p>
            </div>

            {/* Big Metric Callout */}
            <div className="my-3 bg-[#161f2b] border border-[#223040] p-3.5 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-[#e8eef2]">
                  {citizenReportsCount.toLocaleString()}
                </span>
                <span className="font-mono-code text-[10px] text-[#7f93a3] uppercase">
                  TESTIMONIOS VALIDADOS
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-[#ff8a3d]/20 border border-[#ff8a3d]/40 flex items-center justify-center text-[#ff8a3d]">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
            </div>

            {/* Intensity Distribution Bars */}
            <div className="flex flex-col gap-2 font-mono-code text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-[#7f93a3] mb-1">
                  <span>Fuerte a Muy Fuerte (58%)</span>
                  <span className="text-[#e8eef2] font-bold">
                    {Math.round(citizenReportsCount * 0.58).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[58%] h-full bg-[#ff5a36]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#7f93a3] mb-1">
                  <span>Moderado (32%)</span>
                  <span className="text-[#e8eef2] font-bold">
                    {Math.round(citizenReportsCount * 0.32).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[32%] h-full bg-[#ffd23d]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#7f93a3] mb-1">
                  <span>Leve / Ondulado (10%)</span>
                  <span className="text-[#e8eef2] font-bold">
                    {Math.round(citizenReportsCount * 0.10).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[10%] h-full bg-[#2dd4bf]" />
                </div>
              </div>
            </div>

            {/* Action Citizen Button */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="mt-4 w-full py-2.5 px-3 rounded-lg bg-[#ff5a36] hover:bg-[#ff704d] text-[#0a0e13] font-sans-body font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Enviar Mi Reporte de Percepción</span>
            </button>
          </div>
        </div>
      </section>

      {/* AFTERSHOCK FORECAST & SEISMIC SEQUENCE ANALYSIS */}
      <section className="w-full bg-[#101419] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <span className="font-mono-code text-[10px] text-[#ffd23d] uppercase tracking-widest font-bold">
                MODELO ESTADÍSTICO DE OMORI - GUTENBERG-RICHTER
              </span>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#e8eef2] tracking-tight mt-0.5">
                Secuencia de Réplicas y Pronóstico Probabilístico (72 Horas)
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono-code text-xs">
              <span className="px-2.5 py-1 bg-[#161f2b] border border-[#223040] rounded text-[#7f93a3]">
                RÉPLICAS DETECTADAS: <strong className="text-[#e8eef2]">14</strong>
              </span>
              <span className="px-2.5 py-1 bg-[#161f2b] border border-[#223040] rounded text-[#ff8a3d]">
                MÁXIMA RÉPLICA: <strong className="font-bold">M 4.2 Mw</strong>
              </span>
            </div>
          </div>

          {/* Probability Cards Mosaic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-code">
            <div className="bg-[#161f2b] border border-[#223040] p-3.5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#4d6070] uppercase">PROBABILIDAD M ≥ 4.0</span>
                <span className="text-xl font-bold text-[#ff8a3d]">82%</span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[82%] h-full bg-[#ff8a3d]" />
                </div>
                <p className="font-sans-body text-xs text-[#7f93a3] mt-2">
                  Muy alta probabilidad de réplicas moderadas en el cinturón de ruptura durante las próximas 48 horas.
                </p>
              </div>
            </div>

            <div className="bg-[#161f2b] border border-[#223040] p-3.5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#4d6070] uppercase">PROBABILIDAD M ≥ 5.0</span>
                <span className="text-xl font-bold text-[#ffd23d]">24%</span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[24%] h-full bg-[#ffd23d]" />
                </div>
                <p className="font-sans-body text-xs text-[#7f93a3] mt-2">
                  Probabilidad moderada de sismo sentido con fuerza similar en las inmediaciones costeras.
                </p>
              </div>
            </div>

            <div className="bg-[#161f2b] border border-[#223040] p-3.5 rounded-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#4d6070] uppercase">PROBABILIDAD M ≥ 6.0</span>
                <span className="text-xl font-bold text-[#2dd4bf]">4%</span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                  <div className="w-[4%] h-full bg-[#2dd4bf]" />
                </div>
                <p className="font-sans-body text-xs text-[#7f93a3] mt-2">
                  Baja probabilidad de un sismo de mayor magnitud según decaimiento de ley temporal de Omori.
                </p>
              </div>
            </div>
          </div>

          {/* Historical Context Card within Sector */}
          <div className="mt-4 p-3.5 rounded-lg bg-[#0a0e13] border border-[#223040] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5b8def]/15 flex items-center justify-center shrink-0">
                <History className="w-5 h-5 text-[#5b8def]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans-body font-bold text-xs text-[#e8eef2]">
                  Contexto Neotectónico: Segmento de Pedernales
                </span>
                <span className="font-sans-body text-xs text-[#7f93a3]">
                  Ubicado en la aspereza sismogénica de la zona de ruptura del megaterremoto de Pedernales del 16 de abril de 2016 (Mw 7.8).
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToTectonic}
              className="px-3.5 py-1.5 rounded bg-[#161f2b] hover:bg-[#1e2a3b] border border-[#223040] text-[#ffd23d] font-mono-code text-[11px] font-semibold transition"
            >
              Ver Análisis Tectónico de Brechas →
            </button>
          </div>
        </div>
      </section>

      {/* TECHNICAL EXPORT & OPERATIONAL ACTIONS TOOLBAR */}
      <section className="w-full bg-[#10161d] px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#141b23] border border-[#223040] p-4 sm:p-5 rounded-xl shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#ff5a36] text-[#0a0e13] flex items-center justify-center shrink-0 shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#e8eef2] tracking-tight">
                Exportación de Datos Geofísicos Oficiales
              </h3>
              <span className="font-sans-body text-xs text-[#7f93a3]">
                Formatos estandarizados para análisis sismológico, ingeniería forense e interoperabilidad FDSN.
              </span>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono-code text-xs">
            <button
              type="button"
              onClick={handleExportQuakeML}
              className="flex-1 md:flex-none px-3.5 py-2 rounded bg-[#161f2b] hover:bg-[#1e2a3b] border border-[#223040] text-[#e8eef2] uppercase flex items-center justify-center gap-1.5 transition"
              title="Descargar estándar QuakeML XML"
            >
              <FileCode className="w-4 h-4 text-[#ff8a3d]" />
              <span>QuakeML 1.2</span>
            </button>

            <button
              type="button"
              onClick={handleExportGeoJSON}
              className="flex-1 md:flex-none px-3.5 py-2 rounded bg-[#161f2b] hover:bg-[#1e2a3b] border border-[#223040] text-[#e8eef2] uppercase flex items-center justify-center gap-1.5 transition"
              title="Descargar GeoJSON ShakeMap"
            >
              <Layers className="w-4 h-4 text-[#2dd4bf]" />
              <span>GeoJSON ShakeMap</span>
            </button>

            <button
              type="button"
              onClick={handleExportSAC}
              className="flex-1 md:flex-none px-3.5 py-2 rounded bg-[#161f2b] hover:bg-[#1e2a3b] border border-[#223040] text-[#e8eef2] uppercase flex items-center justify-center gap-1.5 transition"
              title="Descargar trazas miniSEED / SAC"
            >
              <Activity className="w-4 h-4 text-[#ffd23d]" />
              <span>miniSEED (SAC)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulletinModalOpen(true)}
              className="w-full md:w-auto px-4 py-2 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#0a0e13] font-bold flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <FileText className="w-4 h-4" />
              <span>Boletín Oficial IGEPN (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Citizen Report Modal */}
      <CitizenReportModal
        quake={currentQuake}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleCitizenReportSubmit}
      />

      {/* Official Bulletin Modal */}
      <OfficialBulletinModal
        quake={currentQuake}
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
      />
    </div>
  );
};
