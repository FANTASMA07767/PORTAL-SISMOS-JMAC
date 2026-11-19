import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Compass,
  Download,
  AlertTriangle,
  Radio,
  Flame,
  Volume2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import {
  VOLCANOES_DATA,
  HISTORICAL_MEGATHRUSTS,
  SEISMIC_GAPS,
  EARLY_WARNING_CITIES,
  SIREN_ZONES
} from '../data/mockData';
import { playNationalSirenSimulation } from '../services/seismicApi';

export const TectonicAnalysisView: React.FC = () => {
  const [isPlayingSiren, setIsPlayingSiren] = useState(false);
  const [selectedVolcano, setSelectedVolcano] = useState(VOLCANOES_DATA[0]);

  const handleTestSiren = () => {
    setIsPlayingSiren(true);
    playNationalSirenSimulation(4);
    setTimeout(() => {
      setIsPlayingSiren(false);
    }, 4200);
  };

  const handleDownloadCatalog = () => {
    const csvContent = `ID,FECHA,LUGAR,MAGNITUD,TIPO_MAG,PROFUNDIDAD_KM,MECANISMO,TSUNAMI
EC-1906-01-31,1906-01-31,Esmeraldas - Tumaco,8.8,Mw,25,Subduccion Interplaca,SI (5m)
EC-1949-08-05,1949-08-05,Ambato - Pelileo,6.8,Ms,15,Falla Inversa Cortical,NO
EC-1987-03-05,1987-03-05,Cordillera Real Reventador,7.1,Mw,10,Falla Cabalgamiento Subandino,NO
EC-2016-04-16,2016-04-16,Pedernales - Manabi,7.8,Mw,20,Subduccion Interplaca,LEVE (0.4m)
EC-2023-03-18,2023-03-18,Golfo de Guayaquil Puna,6.8,Mw,65,Falla Intraplaca Puna,NO
EC-2025-02-28,2025-02-28,Pedernales Manabi,5.8,Mw,12.4,Subduccion Interplaca,NO`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Catalogo_Sismico_Homogeneizado_Ecuador_1900_2025.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCartilla = () => {
    const cartillaText = `SECRETARÍA NACIONAL DE GESTIÓN DE RIESGOS (SNGRE) - ECUADOR
CARTILLA TÉCNICA DE EVACUACIÓN VERTICAL Y PREVENCIÓN ANTE TSUNAMI Y SISMOS 2025

1. REGLA DE ORO DE EVACUACIÓN COSTERA:
Si usted siente un sismo tan fuerte que no puede mantenerse en pie, o que dure más de 20 segundos, NO ESPERE ALERTA OFICIAL. Evacúe inmediatamente a zonas altas (+30 msnm) o a estructuras de evacuación vertical certificadas.

2. PUNTOS DE ENCUENTRO SEÑALIZADOS:
- Manabí: Pedernales Norte (Colina San José), Manta (Colina Universitaria ULEAM), Bahía (Mirador La Cruz).
- Esmeraldas: Las Palmas (Colina Panecillo), Atacames (Sector La Trece).
- Santa Elena: Salinas (Sector Punta Carnero Alto), Montañita (Cerro El Tigre).

3. MOCHILA DE EMERGENCIA (72 HORAS):
- Agua embotellada (2L por persona por día).
- Linterna LED y radio a pilas/dinamo.
- Botiquín de primeros auxilios y mascarillas N95 para ceniza volcánica.
- Documentos de identidad plastificados.
- Silbato de rescate y copia de llaves.

SISTEMA NACIONAL DE ALERTA TEMPRANA (SAT-ECUADOR)`;

    const blob = new Blob([cartillaText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cartilla_SNGRE_Evacuacion_2025.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full flex-1 bg-[#101419] text-[#e8eef2]">
      {/* MODULE SECTION 1: GEODINÁMICA DE SUBDUCCIÓN & PERFIL WADATI-BENIOFF */}
      <section className="w-full bg-[#10161d] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <span className="font-mono-code text-[10px] text-[#5b8def] uppercase tracking-widest font-bold">
              MÓDULO CIENTÍFICO IGEPN-PB2002 • ZONA DE SUBDUCCIÓN ANDINA
            </span>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#e8eef2] tracking-tight mt-0.5">
              Geodinámica de Subducción & Perfil Wadati-Benioff
            </h1>
            <p className="font-sans-body text-xs text-[#7f93a3] max-w-3xl mt-1">
              Corte transversal tridimensional de la litosfera oceánica de Nazca bajo la microplaca norandina. Modelo acoplado de convergencia, génesis de magmatismo de arco y sismicidad intraplaca.
            </p>
          </div>

          {/* GNSS Convergence Rate Badge */}
          <div className="bg-[#141b23] border border-[#223040] p-3 rounded-xl flex items-center gap-3 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-lg bg-[#ff8a3d]/20 border border-[#ff8a3d]/40 flex items-center justify-center text-[#ff8a3d]">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="font-mono-code">
              <span className="text-[9.5px] text-[#4d6070] uppercase block">TASA CONVERGENCIA GNSS</span>
              <span className="text-base font-bold text-[#ffd23d]">56.2 <span className="text-xs text-[#7f93a3]">mm/año</span></span>
              <span className="text-[10px] text-[#2dd4bf] block">Azimuth N78°E (Bloque Norandino)</span>
            </div>
          </div>
        </div>

        {/* 3D Cross-Section SVG Canvas + Geodesy Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Lithospheric Profile SVG (8 cols) */}
          <div className="lg:col-span-8 bg-[#0a0e13] border border-[#223040] rounded-xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 font-mono-code text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff8a3d]" />
                <span className="font-bold text-[#e8eef2]">
                  Perfil Litosférico 01°00&apos;S (Fosa de Ecuador a Cuenca Oriente)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-[#5b8def]">
                  <span className="w-2 h-2 rounded-full bg-[#5b8def]" /> Nazca
                </span>
                <span className="flex items-center gap-1 text-[#ff5a36]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5a36]" /> Magma
                </span>
                <span className="flex items-center gap-1 text-[#ffd23d]">
                  <span className="w-2 h-2 rounded-full bg-[#ffd23d]" /> Hipocentros
                </span>
              </div>
            </div>

            {/* Scientific Cross-Section SVG Diagram */}
            <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
                <defs>
                  {/* Oceanic Lithosphere Nazca Gradient */}
                  <linearGradient id="nazca-slab-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#1e3a8a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Asthenosphere / Mantle */}
                  <linearGradient id="mantle-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#141c28" />
                    <stop offset="100%" stopColor="#080c12" />
                  </linearGradient>

                  {/* Volcanic Plume Conduit */}
                  <linearGradient id="magma-plume" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#ff8a3d" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffd23d" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* Mantle wedge background */}
                <rect x="0" y="0" width="800" height="320" fill="url(#mantle-grad)" />

                {/* Oceanic Trench Surface Water */}
                <rect x="0" y="40" width="180" height="30" fill="#0c1e38" opacity="0.6" />
                <line x1="0" y1="40" x2="180" y2="40" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
                <text x="10" y="32" fill="#5b8def" className="font-mono-code text-[9px]">
                  FOSA ECUADOR-COLOMBIA (-4,800m)
                </text>

                {/* Continental Crust Wedge (South American Plate / Norandina) */}
                <polygon
                  points="180,45 800,45 800,120 420,180 180,45"
                  fill="#1c2734"
                  stroke="#2a3d52"
                  strokeWidth="1.5"
                />

                {/* Subducting Nazca Oceanic Slab plunging down at ~30 deg */}
                <polygon
                  points="0,60 180,60 480,240 800,290 800,320 460,320 160,110 0,110"
                  fill="url(#nazca-slab-grad)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Label on Nazca Plate */}
                <text x="25" y="85" fill="#93c5fd" className="font-mono-code text-[10px] font-bold">
                  Placa de Nazca
                </text>
                <text x="25" y="98" fill="#60a5fa" className="font-mono-code text-[8px]">
                  Litosfera Oceánica (8 cm/a)
                </text>

                {/* Continental Shelf and Mountain Peaks */}
                <path
                  d="M 180,45 L 260,45 L 340,43 L 420,40 L 460,20 L 480,42 L 530,15 L 550,42 L 680,44 L 800,45"
                  fill="none"
                  stroke="#ffd799"
                  strokeWidth="2.2"
                />

                {/* Volcano 1: Cotopaxi peak */}
                <polygon points="460,20 452,42 468,42" fill="#ff5a36" />
                <circle cx="460" cy="18" r="3" fill="#ff3b30" className="animate-ping" />
                <text x="430" y="12" fill="#ffd23d" className="font-mono-code text-[9px] font-bold">
                  Cotopaxi (5,897m)
                </text>

                {/* Volcano 2: Sangay peak */}
                <polygon points="530,15 522,42 538,42" fill="#ff3b30" />
                <circle cx="530" cy="13" r="3" fill="#ff3b30" className="animate-pulse" />
                <text x="505" y="7" fill="#ff8a3d" className="font-mono-code text-[9px] font-bold">
                  Sangay (5,286m)
                </text>

                {/* Magma Conduits ascending from dehydrated slab at ~120km depth */}
                <path
                  d="M 450,210 Q 455,120 460,25"
                  fill="none"
                  stroke="url(#magma-plume)"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
                <path
                  d="M 510,240 Q 520,130 530,20"
                  fill="none"
                  stroke="url(#magma-plume)"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />

                {/* Wadati-Benioff Zone Earthquakes along the dipping slab */}
                {/* Shallow coastal interplate */}
                <circle cx="210" cy="72" r="5" fill="#ff3b30" stroke="#ffffff" strokeWidth="1" className="live-pulse" />
                <circle cx="250" cy="95" r="4.5" fill="#ff8a3d" stroke="#101419" strokeWidth="1" />
                <circle cx="290" cy="120" r="4" fill="#ff8a3d" stroke="#101419" strokeWidth="1" />
                {/* Intermediate depth under volcanic arc */}
                <circle cx="360" cy="165" r="4.5" fill="#ffd23d" stroke="#101419" strokeWidth="1" />
                <circle cx="420" cy="205" r="4" fill="#ffd23d" stroke="#101419" strokeWidth="1" />
                <circle cx="480" cy="245" r="4.5" fill="#35c7a6" stroke="#101419" strokeWidth="1" />
                {/* Deep Amazonian sub-arc earthquakes (>150km) */}
                <circle cx="560" cy="275" r="5" fill="#5b8def" stroke="#ffffff" strokeWidth="1" />
                <circle cx="640" cy="295" r="4" fill="#5b8def" stroke="#101419" strokeWidth="1" />

                {/* Regional Geographic Labels */}
                <text x="210" y="60" fill="#7f93a3" className="font-mono-code text-[8.5px]">
                  Antearco Costero (Manta / Manabí)
                </text>
                <text x="600" y="60" fill="#2dd4bf" className="font-mono-code text-[8.5px]">
                  Cuenca Amazónica / Subandino
                </text>

                {/* Depth scale lines */}
                <line x1="770" y1="45" x2="800" y2="45" stroke="#4d6070" strokeWidth="1" />
                <text x="740" y="48" fill="#4d6070" className="font-mono-code text-[8px]">0 km</text>

                <line x1="770" y1="110" x2="800" y2="110" stroke="#4d6070" strokeWidth="1" />
                <text x="730" y="113" fill="#4d6070" className="font-mono-code text-[8px]">50 km</text>

                <line x1="770" y1="195" x2="800" y2="195" stroke="#4d6070" strokeWidth="1" />
                <text x="690" y="198" fill="#4d6070" className="font-mono-code text-[8px]">100 km (Fusión)</text>

                <line x1="770" y1="290" x2="800" y2="290" stroke="#4d6070" strokeWidth="1" />
                <text x="720" y="293" fill="#4d6070" className="font-mono-code text-[8px]">180 km</text>
              </svg>
            </div>

            {/* Bottom Geodynamic Indicators Readout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#223040] font-mono-code text-center text-xs">
              <div className="bg-[#141b23] p-2 rounded border border-[#223040]/70">
                <span className="text-[9px] text-[#4d6070] uppercase block">ÁNGULO DE SUBDUCCIÓN</span>
                <span className="text-sm font-bold text-[#e8eef2]">28° - 32°</span>
                <span className="text-[10px] text-[#7f93a3] block">Inclinación Este</span>
              </div>
              <div className="bg-[#141b23] p-2 rounded border border-[#223040]/70">
                <span className="text-[9px] text-[#4d6070] uppercase block">ACOPLAMIENTO INTERPLACA</span>
                <span className="text-sm font-bold text-[#ff5a36]">68% Bloqueado</span>
                <span className="text-[10px] text-[#ff8a3d] block">(Locked)</span>
              </div>
              <div className="bg-[#141b23] p-2 rounded border border-[#223040]/70">
                <span className="text-[9px] text-[#4d6070] uppercase block">PROFUNDIDAD MAGMATISMO</span>
                <span className="text-sm font-bold text-[#ffd23d]">115 - 138 km</span>
                <span className="text-[10px] text-[#7f93a3] block">Arco Frontal</span>
              </div>
              <div className="bg-[#141b23] p-2 rounded border border-[#223040]/70">
                <span className="text-[9px] text-[#4d6070] uppercase block">MÁXIMA PROFUNDIDAD SÍSMICA</span>
                <span className="text-sm font-bold text-[#5b8def]">210 km</span>
                <span className="text-[10px] text-[#7f93a3] block">(Pastaza / Morona)</span>
              </div>
            </div>
          </div>

          {/* Right Geodesy & Carnegie Ridge Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Geodesia Espacial GNSS */}
            <div className="bg-[#141b23] border border-[#223040] rounded-xl p-4 shadow-xl flex flex-col justify-between font-mono-code">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#7f93a3] uppercase tracking-wider font-semibold">
                    GEODESIA ESPACIAL GNSS
                  </span>
                  <span className="text-[10px] text-[#ffd23d] font-bold">
                    ESTACIÓN ISPT (ISLA DE LA PLATA)
                  </span>
                </div>

                {/* Circular Gauge Graphic */}
                <div className="flex flex-col items-center justify-center my-3">
                  <div className="w-28 h-28 rounded-full border-4 border-[#223040] border-t-[#ff8a3d] border-r-[#ffd23d] flex flex-col items-center justify-center bg-[#0a0e13] shadow-inner">
                    <span className="font-display font-bold text-2xl text-[#ffd23d]">5.6</span>
                    <span className="text-[9px] text-[#7f93a3]">cm / año</span>
                    <span className="text-[9px] text-[#2dd4bf] font-semibold">AZ 078°</span>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7f93a3]">Déficit de Deslizamiento Acumulado:</span>
                    <span className="text-[#ff3b30] font-bold">4.21 metros</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#4d6070]">
                    <span>Ventana de Recurrencia Post-1906:</span>
                    <span className="text-[#ffd23d]">78%</span>
                  </div>
                  <div className="w-full h-1.5 rounded bg-[#0a0e13] overflow-hidden">
                    <div className="w-[78%] h-full bg-gradient-to-r from-[#ffd23d] to-[#ff3b30]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cordillera Submarina Carnegie */}
            <div className="bg-[#141b23] border border-[#223040] rounded-xl p-4 shadow-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#5b8def] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="font-mono-code">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-xs text-[#e8eef2]">
                    Cordillera Submarina Carnegie
                  </h3>
                  <span className="px-1.5 py-0.2 bg-[#161f2b] text-[#5b8def] rounded text-[9px] font-bold">
                    ASÍSMICO
                  </span>
                </div>
                <p className="font-sans-body text-xs text-[#7f93a3] leading-relaxed">
                  La colisión de la cordillera asísmica frente a Manabí modula la alta aspereza tectónica de los grandes sismos de 1942, 1998 y 2016, concentrando la mayor tasa de acumulación de esfuerzo cortical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE SECTION 2: TABLERO DE VIGILANCIA VOLCÁNICA & SISMOS VT / LP */}
      <section className="w-full bg-[#101419] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] live-pulse" />
            <h2 className="font-display font-bold text-base sm:text-xl text-[#e8eef2] tracking-tight">
              Tablero de Vigilancia Volcánica & Sismos VT / LP
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono-code text-[10px]">
            <span className="px-2.5 py-1 bg-[#141b23] border border-[#223040] text-[#ffd23d] rounded font-semibold">
              RED INFRASONIDO (4 EST.)
            </span>
            <span className="px-2.5 py-1 bg-[#141b23] border border-[#223040] text-[#2dd4bf] rounded font-semibold">
              CÁMARAS TÉRMICAS HD
            </span>
          </div>
        </div>

        {/* 4 Volcanoes Cards Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VOLCANOES_DATA.map(volc => {
            const isAlertRed = volc.alertLevel === 'ROJA';
            const isAlertYellow = volc.alertLevel === 'AMARILLA';
            const isAlertOrange = volc.alertLevel === 'NARANJA';

            return (
              <div
                key={volc.id}
                onClick={() => setSelectedVolcano(volc)}
                className={`bg-[#141b23] border rounded-xl overflow-hidden shadow-xl transition-all cursor-pointer flex flex-col justify-between ${
                  selectedVolcano.id === volc.id
                    ? 'border-[#ff5a36] ring-1 ring-[#ff5a36]'
                    : 'border-[#223040] hover:border-[#324458]'
                }`}
              >
                {/* Card Header with Name & Alert Level */}
                <div className="p-3 bg-[#10161d] border-b border-[#223040] flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#e8eef2] leading-tight">
                      {volc.name}
                    </h3>
                    <span className="font-mono-code text-[9.5px] text-[#7f93a3]">
                      Lat: {volc.lat}° • Elev: {volc.altMeters} msnm
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-mono-code text-[9px] font-bold tracking-wider ${
                      isAlertRed
                        ? 'bg-[#2a1310] text-[#ff3b30] border border-[#ff3b30]/40'
                        : isAlertOrange
                        ? 'bg-[#2a1c0e] text-[#ff8a3d] border border-[#ff8a3d]/40'
                        : isAlertYellow
                        ? 'bg-[#2a260e] text-[#ffd23d] border border-[#ffd23d]/40'
                        : 'bg-[#10221c] text-[#2dd4bf] border border-[#2dd4bf]/40'
                    }`}
                  >
                    {volc.alertLabel}
                  </span>
                </div>

                {/* Volcano Photo with Thermal / Activity Overlay */}
                <div className="relative h-28 w-full overflow-hidden bg-[#0a0e13]">
                  <img
                    src={volc.imageUrl}
                    alt={volc.name}
                    className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141b23] via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="font-mono-code text-[10px] text-[#ffd23d] bg-[#0a0e13]/85 px-2 py-0.5 rounded border border-[#223040]/70 block truncate">
                      {volc.statusSubtitle}
                    </span>
                  </div>
                </div>

                {/* Telemetry Metrics Readout */}
                <div className="p-3 font-mono-code text-xs space-y-1.5 bg-[#141b23]">
                  <div className="flex justify-between">
                    <span className="text-[#7f93a3]">Sismos VT (Fractura):</span>
                    <span className="text-[#ff5a36] font-bold">{volc.vtQuakes24h} / 24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7f93a3]">Sismos LP (Fluidos):</span>
                    <span className="text-[#2dd4bf] font-bold">{volc.lpQuakes24h} / 24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7f93a3]">Emisión SO₂:</span>
                    <span className="text-[#ffd23d] font-bold">{volc.so2TonsDay.toLocaleString()} ton/d</span>
                  </div>
                  {volc.explosions24h && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-[#223040]/50 text-[#ff8a3d]">
                      <span>Explosiones Sísmicas:</span>
                      <span className="font-bold">{volc.explosions24h} / 24h</span>
                    </div>
                  )}
                  {volc.fumaroleTemp && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-[#223040]/50 text-[#2dd4bf]">
                      <span>Fumarolas Domo:</span>
                      <span className="font-bold">{volc.fumaroleTemp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Espectrograma de Sismicidad Volcánica Comparada (VT vs LP) */}
        <div className="mt-5 bg-[#0a0e13] border border-[#223040] rounded-xl p-4 shadow-xl font-mono-code">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-[#223040]">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-[#e8eef2] uppercase">
                Espectrograma de Sismicidad Volcánica Comparada
              </h3>
              <span className="text-[10px] text-[#7f93a3]">
                Diferenciación entre fracturamiento frágil (VT - Alta Frecuencia) y resonancia de fluidos/gases (LP - Baja Frecuencia)
              </span>
            </div>
            <span className="text-[10px] text-[#ffd23d] bg-[#141b23] border border-[#223040] px-2 py-0.5 rounded">
              ESTACIÓN SISMOLÓGICA BREF (BASE DEL REFUGIO COTOPAXI)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* VT Event */}
            <div className="bg-[#141b23] p-3 rounded-lg border border-[#ff8a3d]/40">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#ff8a3d] font-bold">
                  EVENTO VT (FRACTURAMIENTO DE ROCA)
                </span>
                <span className="text-[#7f93a3] text-[10px]">Freq: 8 - 14 Hz • Sharp P-onset</span>
              </div>
              <div className="w-full h-12 bg-[#0a0e13] rounded border border-[#223040] flex items-center px-1 overflow-hidden">
                <svg className="w-full h-10 text-[#ff8a3d]" preserveAspectRatio="none" viewBox="0 0 500 40">
                  <path
                    d="M 0,20 L 80,20 L 95,8 L 105,32 L 115,4 L 125,36 L 135,10 L 145,30 L 160,15 L 180,26 L 210,18 L 240,22 L 280,19 L 500,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-[#7f93a3] mt-1.5">
                <span>Amplitud Máx: 24 μm/s</span>
                <span className="text-[#ff8a3d]">Hipocentro: 4.8 km b.c.</span>
              </div>
            </div>

            {/* LP Event */}
            <div className="bg-[#141b23] p-3 rounded-lg border border-[#2dd4bf]/40">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#2dd4bf] font-bold">
                  EVENTO LP (MOVIMIENTO DE FLUIDOS / MAGMA)
                </span>
                <span className="text-[#7f93a3] text-[10px]">Freq: 0.8 - 2.2 Hz • Resonancia Lenta</span>
              </div>
              <div className="w-full h-12 bg-[#0a0e13] rounded border border-[#223040] flex items-center px-1 overflow-hidden">
                <svg className="w-full h-10 text-[#2dd4bf]" preserveAspectRatio="none" viewBox="0 0 500 40">
                  <path
                    d="M 0,20 L 60,20 L 90,14 L 130,26 L 170,12 L 210,28 L 250,15 L 290,25 L 340,17 L 390,23 L 440,19 L 500,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-[#7f93a3] mt-1.5">
                <span>Tremor Acústico: 1.2 Pa</span>
                <span className="text-[#2dd4bf]">Presurización conduit: +0.4 bar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE SECTION 3: MEGASISMOS HISTÓRICOS & BRECHAS SÍSMICAS (GAPS) */}
      <section className="w-full bg-[#10161d] px-4 lg:px-6 py-6 border-b border-[#223040]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display font-bold text-base sm:text-xl text-[#e8eef2] tracking-tight">
              Megasismos Históricos del Ecuador & Brechas Sísmicas (Gaps)
            </h2>
            <p className="font-sans-body text-xs text-[#7f93a3] mt-1">
              Historial de los mayores eventos sísmicos en la zona de subducción ecuatoriana y fallas corticales activas. Identificación de sectores con déficit de liberación de momento sísmico.
            </p>
          </div>
          <span className="font-mono-code text-[10px] text-[#ff3b30] bg-[#2a1310] border border-[#ff3b30]/30 px-3 py-1 rounded font-bold">
            ZONA DE BRECHA PRIORITARIA: Segmento Bahía - Esmeraldas Sur (Gap de 1906)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Historic Events List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {HISTORICAL_MEGATHRUSTS.map(mega => (
              <div
                key={mega.id}
                className="bg-[#141b23] border border-[#223040] p-3.5 rounded-xl flex items-start gap-3.5 shadow-md hover:border-[#324458] transition"
              >
                <div
                  className="w-12 h-12 rounded-lg flex flex-col items-center justify-center font-display font-bold text-base shrink-0 border"
                  style={{
                    backgroundColor: `${mega.tagColor}20`,
                    borderColor: `${mega.tagColor}50`,
                    color: mega.tagColor,
                  }}
                >
                  <span>{mega.mag.toFixed(1)}</span>
                  <span className="text-[8px] font-mono-code -mt-1">{mega.magType}</span>
                </div>

                <div className="flex-1 font-mono-code">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="font-display font-bold text-sm text-[#e8eef2]">
                      {mega.date} • {mega.location}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-bold"
                      style={{
                        backgroundColor: `${mega.tagColor}25`,
                        color: mega.tagColor,
                      }}
                    >
                      {mega.tag}
                    </span>
                  </div>
                  <p className="font-sans-body text-xs text-[#7f93a3] leading-relaxed">
                    {mega.description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-[#4d6070] mt-1.5 pt-1.5 border-t border-[#223040]/50">
                    {mega.ruptureKm && <span>Longitud Ruptura: {mega.ruptureKm} km</span>}
                    {mega.slipMeters && <span>Desplazamiento Co-sísmico: ~{mega.slipMeters} m</span>}
                    {mega.fatalities && <span className="text-[#ff8a3d]">{mega.fatalities}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seismic Gap Segmentation Deck (5 cols) */}
          <div className="lg:col-span-5 bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-xl flex flex-col justify-between font-mono-code">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-sm text-[#e8eef2] uppercase tracking-tight">
                  Segmentación de la Brecha Costera
                </h3>
                <span className="text-[10px] text-[#ffd23d]">ECUADOR MARGIN</span>
              </div>

              <div className="space-y-4 my-4">
                {SEISMIC_GAPS.map(gap => (
                  <div key={gap.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#e8eef2] font-semibold">{gap.name}</span>
                      <span style={{ color: gap.color }} className="font-bold text-[11px]">
                        {gap.status}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#0a0e13] overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000"
                        style={{
                          width: `${gap.percentage}%`,
                          backgroundColor: gap.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Geological Expert Statement */}
              <div className="p-3 bg-[#0a0e13] border border-[#223040] rounded-lg text-xs font-sans-body text-[#7f93a3] leading-relaxed mt-4">
                <span className="font-mono-code text-[10px] text-[#ffd23d] font-bold block uppercase mb-1">
                  DICTAMEN GEOLÓGICO SISMOTECTÓNICO:
                </span>
                El remanente de acoplamiento entre el segmento Manta y la Cordillera de Carnegie muestra un bloqueo continuo geodésico que no fue drenado en el terremoto de 2016. La probabilidad de evento Mw ≥ 7.2 en la próxima década se clasifica en <strong className="text-[#ff3b30]">Nivel Alto</strong> para el antearco central.
              </div>
            </div>

            {/* Catalog Download Button */}
            <button
              type="button"
              onClick={handleDownloadCatalog}
              className="mt-5 w-full py-2.5 px-4 rounded-lg bg-[#ff5a36] hover:bg-[#ff704d] text-[#0a0e13] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>DESCARGAR CATÁLOGO SÍSMICO HOMOGENEIZADO (1900-2025)</span>
            </button>
          </div>
        </div>
      </section>

      {/* MODULE SECTION 4: CENTRO DE ALERTA TEMPRANA (SAT) & TIEMPOS DE ONDA S */}
      <section className="w-full bg-[#101419] px-4 lg:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <span className="font-mono-code text-[10px] text-[#ffd23d] uppercase tracking-widest font-bold">
              SISTEMA INTEGRADO DE GESTIÓN DE RIESGOS SNGRE
            </span>
            <h2 className="font-display font-bold text-base sm:text-xl text-[#e8eef2] tracking-tight mt-0.5">
              Centro de Alerta Temprana (SAT) & Tiempos de Onda S
            </h2>
            <p className="font-sans-body text-xs text-[#7f93a3] mt-1">
              Estimación de arribo de ondas sísmicas destructivas (Onda S y Rayleigh) ante una hipotética ruptura de subducción en el Margen Costero Central.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-code text-[10px] text-[#ff3b30] bg-[#2a1310] border border-[#ff3b30]/30 px-3 py-1 rounded font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ff3b30] live-pulse" />
            <span>SAT TSUNAMI ACTIVO (178 SIRENAS)</span>
          </div>
        </div>

        {/* 5 City Arrival Countdown Cards Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono-code">
          {EARLY_WARNING_CITIES.map(city => (
            <div
              key={city.city}
              className="bg-[#141b23] border border-[#223040] p-3.5 rounded-xl flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-display font-bold text-sm text-[#e8eef2]">
                    {city.city}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                    style={{
                      backgroundColor: `${city.tagColor}20`,
                      color: city.tagColor,
                    }}
                  >
                    {city.tag}
                  </span>
                </div>

                <div className="my-2">
                  <span className="text-[9px] text-[#4d6070] block">TIEMPO ONDA S:</span>
                  <span className="text-xl font-bold" style={{ color: city.tagColor }}>
                    ~ {city.sWaveSec} seg
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#223040]/50 text-[10px] space-y-1">
                <div className="flex justify-between text-[#7f93a3]">
                  <span>Dist. Hipocentral:</span>
                  <span className="text-[#e8eef2] font-semibold">{city.distKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">{city.effect}:</span>
                  <span className="font-bold" style={{ color: city.tagColor }}>
                    {city.effectNote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Siren Network Grid + Evacuation Guidelines */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Tsunami Siren Zones (7 cols) */}
          <div className="lg:col-span-7 bg-[#141b23] border border-[#223040] rounded-xl p-4 shadow-xl flex flex-col justify-between font-mono-code">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#223040]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#ffd23d]" />
                  <span className="font-bold text-xs text-[#e8eef2]">
                    Red de Sirenas del SAT Tsunami Costa Ecuatoriana
                  </span>
                </div>
                <span className="text-[10px] text-[#2dd4bf]">97.8% ENLACE SATELITAL ACTIVO</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SIREN_ZONES.map(zone => (
                  <div key={zone.name} className="bg-[#0a0e13] p-2.5 rounded-lg border border-[#223040]">
                    <span className="text-[9.5px] text-[#4d6070] block uppercase">{zone.name}</span>
                    <span className="text-sm font-bold text-[#2dd4bf]">
                      {zone.active} <span className="text-xs text-[#7f93a3]">/ {zone.total}</span>
                    </span>
                    <span className="text-[9px] text-[#7f93a3] block mt-1 truncate">
                      {zone.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Siren Live Tone Button */}
            <div className="mt-4 pt-3 border-t border-[#223040]">
              <button
                type="button"
                onClick={handleTestSiren}
                disabled={isPlayingSiren}
                className={`w-full py-2.5 px-4 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-md ${
                  isPlayingSiren
                    ? 'bg-[#ff3b30] text-white border-white animate-pulse'
                    : 'bg-[#1a232d] hover:bg-[#223040] text-[#ffd23d] border-[#ffd23d]/40'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isPlayingSiren
                    ? 'EMITIENDO SIRENA DUAL 880Hz / 1320Hz EN CURSO...'
                    : 'Prueba Periódica de Frecuencia Sonora 880Hz / 1320Hz para Simulacro Nacional (ACTIVAR AUDIO)'}
                </span>
              </button>
            </div>
          </div>

          {/* Vertical Evacuation Guidelines (5 cols) */}
          <div className="lg:col-span-5 bg-[#141b23] border border-[#223040] rounded-xl p-4 shadow-xl flex flex-col justify-between font-sans-body">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#223040]">
                <span className="font-mono-code text-[10px] text-[#ffd23d] font-bold uppercase">
                  PROTOCOLO SNGRE ECUADOR
                </span>
                <span className="font-mono-code text-[10px] text-[#7f93a3]">NORMA INEN</span>
              </div>

              <h3 className="font-display font-bold text-sm text-[#e8eef2] mb-2">
                Rutas de Evacuación Vertical
              </h3>
              <p className="text-xs text-[#7f93a3] mb-3 leading-relaxed">
                En litorales con fosa cercana (tiempos de arribo de tsunami &lt;15 min), el protocolo ordena evacuación peatonal inmediata a cotas mayores a +30 msnm sin esperar boletín oficial.
              </p>

              <div className="space-y-2 text-xs text-[#e8eef2]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                  <span>Triángulo de Vida y Desconexión de Gas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                  <span>Puntos de Encuentro Señalizados en Manta/Pedernales</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2dd4bf] shrink-0" />
                  <span>Mochila de Emergencia para 72 Horas</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCartilla}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#223040] hover:bg-[#324458] border border-[#ffd23d]/40 text-[#ffd23d] font-mono-code text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <FileText className="w-4 h-4" />
              <span>DESCARGAR CARTILLA SNGRE 2025</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
