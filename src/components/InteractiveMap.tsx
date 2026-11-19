import React, { useState } from 'react';
import { Layers, Plus, Minus, Crosshair, Map as MapIcon, Globe, Compass } from 'lucide-react';
import { Earthquake } from '../types/seismic';
import { getDepthColor } from '../services/seismicApi';
import { GoogleMapsView } from './GoogleMapsView';

interface InteractiveMapProps {
  earthquakes: Earthquake[];
  selectedQuake: Earthquake | null;
  onSelectQuake: (q: Earthquake) => void;
  onOpenEventDetail?: (q: Earthquake) => void;
  scope: 'ecuador' | 'latam';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  earthquakes,
  selectedQuake,
  onSelectQuake,
  onOpenEventDetail,
  scope,
}) => {
  const [mapEngine, setMapEngine] = useState<'google-hybrid' | 'google-terrain' | 'vector'>('google-hybrid');
  const [layers, setLayers] = useState({
    trench: true,
    faults: true,
    volcanoes: true,
    gnss: true,
  });

  // Vector map state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.7, prev + delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full flex-1 bg-[#0a0e13] flex flex-col min-h-[520px] select-none overflow-hidden">
      {/* MODE TOGGLE HUD (Google Maps Satélite / Terreno vs Vector Táctico) */}
      <div className="absolute top-3 right-3 z-30 flex items-center bg-[#10161d]/95 backdrop-blur-md rounded-lg p-1 border border-[#223040] shadow-xl">
        <button
          type="button"
          onClick={() => setMapEngine('google-hybrid')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code rounded transition-all ${
            mapEngine === 'google-hybrid'
              ? 'bg-[#ff5a36] text-[#0a0e13] font-bold shadow'
              : 'text-[#7f93a3] hover:text-[#e8eef2]'
          }`}
          title="Google Maps con imágenes satelitales de alta resolución y etiquetas"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>GOOGLE MAPS (SATÉLITE)</span>
        </button>

        <button
          type="button"
          onClick={() => setMapEngine('google-terrain')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code rounded transition-all ${
            mapEngine === 'google-terrain'
              ? 'bg-[#ff5a36] text-[#0a0e13] font-bold shadow'
              : 'text-[#7f93a3] hover:text-[#e8eef2]'
          }`}
          title="Google Maps con curvas de nivel y relieve topográfico andino"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>RELIEVE TOPOGRÁFICO</span>
        </button>

        <button
          type="button"
          onClick={() => setMapEngine('vector')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code rounded transition-all ${
            mapEngine === 'vector'
              ? 'bg-[#ff5a36] text-[#0a0e13] font-bold shadow'
              : 'text-[#7f93a3] hover:text-[#e8eef2]'
          }`}
          title="Esquema geodinámico vectorial del margen tectónico"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>TÁCTICO VECTORIAL</span>
        </button>
      </div>

      {/* GOOGLE MAPS PLATFORM ENGINE (Hybrid / Terrain) */}
      {mapEngine.startsWith('google-') ? (
        <GoogleMapsView
          earthquakes={earthquakes}
          selectedQuake={selectedQuake}
          onSelectQuake={onSelectQuake}
          scope={scope}
          layers={layers}
          mapType={mapEngine === 'google-hybrid' ? 'hybrid' : 'terrain'}
          onOpenEventDetail={onOpenEventDetail}
        />
      ) : (
        /* VECTOR TACTICAL GEODYNAMIC SVG VIEW (Faithful to Image 5 & Image 3) */
        <div className="relative w-full h-full min-h-[520px] bg-[#070b10] flex items-center justify-center overflow-hidden">
          <svg
            className="w-full h-full min-h-[520px] object-cover transition-transform duration-300"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid slice"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          >
            <defs>
              <linearGradient id="trench-gradient-vector" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#04080e" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#081424" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0a121a" stopOpacity="0.3" />
              </linearGradient>

              <pattern id="geodetic-grid-pat" width="50" height="50" patternUnits="userSpaceOnUse">
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#162230"
                  strokeWidth="0.7"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
              </pattern>
            </defs>

            <rect width="1000" height="700" fill="url(#geodetic-grid-pat)" />
            <rect x="0" y="0" width="560" height="700" fill="url(#trench-gradient-vector)" />

            {/* Subduction Trench Line */}
            {layers.trench && (
              <g>
                <path
                  d="M 430 0 C 420 120, 395 240, 410 360 C 425 480, 440 600, 460 700"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.2"
                  strokeDasharray="9 4"
                  opacity="0.85"
                />
                <text
                  x="280"
                  y="260"
                  fill="#5b8def"
                  className="font-mono-code text-[10px] tracking-widest opacity-80"
                  transform="rotate(-76 280 260)"
                >
                  FOSA DE SUBDUCCIÓN (ZONA SISMOGÉNICA COSTERA)
                </text>
              </g>
            )}

            {/* Carnegie Ridge Inflow */}
            {layers.trench && (
              <g>
                <path
                  d="M 120 380 C 230 370, 320 395, 415 390"
                  fill="none"
                  stroke="#35c7a6"
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  opacity="0.75"
                />
                <text
                  x="160"
                  y="368"
                  fill="#35c7a6"
                  className="font-mono-code text-[9px] tracking-wider uppercase opacity-85 font-semibold"
                >
                  Dorsal Asísmica de Carnegie (Colisión)
                </text>
              </g>
            )}

            {/* Landmass */}
            <path
              d="M 470 50 L 530 80 L 570 110 L 610 90 L 690 140 L 730 200 L 710 320 L 750 420 L 730 520 L 660 620 L 560 650 L 510 590 L 490 530 L 450 460 L 485 410 L 455 350 L 460 280 L 480 220 L 450 160 Z"
              fill="#131d27"
              stroke="#2a3d52"
              strokeWidth="2"
            />

            {/* Galapagos Archipelago */}
            <g transform="translate(80, 240)">
              <rect
                x="-10"
                y="-10"
                width="135"
                height="105"
                rx="4"
                fill="#0d141d"
                stroke="#223040"
                strokeWidth="1"
                opacity="0.9"
              />
              <text x="5" y="10" fill="#7f93a3" className="font-mono-code text-[9px] tracking-wider font-bold">
                GALÁPAGOS (EC)
              </text>
              <path
                d="M 30 40 C 35 30, 50 35, 45 50 C 40 60, 25 55, 30 40 Z"
                fill="#202d3d"
                stroke="#3cddc7"
                strokeWidth="1"
              />
              <circle cx="75" cy="45" r="7" fill="#202d3d" stroke="#3cddc7" strokeWidth="1" />
              <circle cx="95" cy="55" r="5" fill="#202d3d" stroke="#3cddc7" strokeWidth="1" />
              <circle cx="34" cy="45" r="5" fill="#ff8a3d" opacity="0.9" />
              <circle cx="34" cy="45" r="10" fill="none" stroke="#ff8a3d" strokeWidth="1" className="live-pulse" />
              <text x="10" y="80" fill="#ffb4a3" className="font-mono-code text-[8.5px]">
                M 3.8 Sierra Negra
              </text>
            </g>

            {/* Faults */}
            {layers.faults && (
              <g>
                <path
                  d="M 580 140 Q 560 260 540 380 T 500 510"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
                <text
                  x="590"
                  y="270"
                  fill="#f59e0b"
                  className="font-mono-code text-[8px] tracking-wider uppercase font-semibold opacity-90"
                  transform="rotate(78 590 270)"
                >
                  Falla Pallatanga - Cosanga
                </text>
              </g>
            )}

            {/* Volcanoes */}
            {layers.volcanoes && (
              <g id="volcano-group">
                <g className="cursor-pointer group" transform="translate(565, 250)">
                  <polygon points="0,-12 10,7 -10,7" fill="#ff5a36" stroke="#ffd799" strokeWidth="1.4" />
                  <circle cx="0" cy="-13" r="2.5" fill="#ffd23d" className="animate-ping" />
                  <text x="14" y="2" fill="#e8eef2" className="font-mono-code text-[10px] font-bold">
                    Cotopaxi [5897m]
                  </text>
                  <text x="14" y="13" fill="#ff8a3d" className="font-mono-code text-[8px] font-semibold">
                    ESTADO: AMARILLO (VAPOR)
                  </text>
                </g>

                <g className="cursor-pointer group" transform="translate(568, 305)">
                  <polygon points="0,-9 8,6 -8,6" fill="#ff8a3d" stroke="#161f2b" strokeWidth="1" />
                  <text x="12" y="2" fill="#7f93a3" className="font-mono-code text-[9px]">
                    Tungurahua
                  </text>
                </g>

                <g className="cursor-pointer group" transform="translate(615, 200)">
                  <polygon points="0,-12 10,7 -10,7" fill="#ff3b30" stroke="#ffd799" strokeWidth="1.4" />
                  <circle cx="0" cy="-13" r="3" fill="#ff3b30" className="live-pulse" />
                  <text x="14" y="0" fill="#ffb4a3" className="font-mono-code text-[10px] font-bold">
                    El Reventador
                  </text>
                  <text x="14" y="11" fill="#ff3b30" className="font-mono-code text-[8px] font-bold uppercase">
                    Erupción Continua
                  </text>
                </g>

                <g className="cursor-pointer group" transform="translate(585, 360)">
                  <polygon points="0,-12 10,7 -10,7" fill="#ff3b30" stroke="#ffd799" strokeWidth="1.4" />
                  <circle cx="0" cy="-13" r="2.5" fill="#ff3b30" className="live-pulse" />
                  <text x="14" y="2" fill="#ffb4a3" className="font-mono-code text-[9px] font-bold">
                    Sangay [Activo]
                  </text>
                </g>
              </g>
            )}

            {/* Earthquakes */}
            <g id="hypocenter-group">
              {earthquakes.map(quake => {
                const latFrac = (2.2 - quake.lat) / 8.2;
                const lonFrac = (quake.lon - (-92.0)) / 17.0;

                const cx = Math.max(80, Math.min(920, lonFrac * 1000));
                const cy = Math.max(60, Math.min(640, latFrac * 700));

                const isSelected = selectedQuake?.id === quake.id;
                const color = getDepthColor(quake.depth);
                const radius = Math.max(9, quake.mag * 2.6);

                return (
                  <g
                    key={quake.id}
                    className="cursor-pointer group transition-all"
                    transform={`translate(${cx}, ${cy})`}
                    onClick={() => onSelectQuake(quake)}
                  >
                    {(quake.mag >= 4.5 || isSelected) && (
                      <circle
                        cx="0"
                        cy="0"
                        r={radius * 2.2}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.2"
                        opacity="0.35"
                        className="live-pulse"
                      />
                    )}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r={radius * 1.5}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        opacity="0.8"
                      />
                    )}

                    <circle
                      cx="0"
                      cy="0"
                      r={radius}
                      fill={color}
                      stroke={isSelected ? '#ffffff' : '#161f2b'}
                      strokeWidth={isSelected ? 2.2 : 1.4}
                      className="shadow-lg transition-transform group-hover:scale-110"
                    />

                    <text
                      x="0"
                      y="3.5"
                      fill={quake.depth < 10 || quake.mag >= 5.5 ? '#ffffff' : '#101419'}
                      className="font-display font-bold text-[9px]"
                      textAnchor="middle"
                    >
                      {quake.mag.toFixed(1)}
                    </text>

                    <g
                      className={`pointer-events-none transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      transform="translate(18, -32)"
                    >
                      <rect
                        width="180"
                        height="52"
                        rx="3"
                        fill="#141b23"
                        stroke={color}
                        strokeWidth="1.2"
                        className="shadow-2xl"
                      />
                      <text x="8" y="15" fill="#ffb4a3" className="font-display font-bold text-[10px]">
                        {quake.place.toUpperCase()}
                      </text>
                      <text x="8" y="29" fill="#e8eef2" className="font-mono-code text-[9.5px]">
                        M {quake.mag.toFixed(1)} {quake.magType} • Prof: {quake.depth.toFixed(1)} km
                      </text>
                      <text x="8" y="43" fill="#ffd23d" className="font-mono-code text-[8.5px]">
                        {quake.source} • {quake.localTimeECT}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            <text x="120" y="100" fill="#5b8def" className="font-display font-bold text-[17px] opacity-70">
              PLACA DE NAZCA
            </text>
            <text x="120" y="122" fill="#7f93a3" className="font-mono-code text-[9.5px] opacity-75">
              VELOCIDAD CONVERGENCIA: ~56 mm/año al ENE
            </text>
            <text x="730" y="100" fill="#a78bfa" className="font-display font-bold text-[17px] opacity-70">
              PLACA SUDAMERICANA
            </text>
            <text x="730" y="122" fill="#7f93a3" className="font-mono-code text-[9.5px] opacity-75">
              BLOQUE NORANDINO COLISIONAL
            </text>

            <g transform="translate(35, 620)">
              <circle cx="18" cy="18" r="16" fill="#10161d" stroke="#223040" strokeWidth="1" />
              <path d="M 18 5 L 22 18 L 18 15 L 14 18 Z" fill="#ff5a36" />
              <path d="M 18 31 L 22 18 L 18 21 L 14 18 Z" fill="#7f93a3" />
              <text x="16" y="4" fill="#ff5a36" className="font-mono-code text-[8px] font-bold">
                N
              </text>
              <text x="44" y="20" fill="#7f93a3" className="font-mono-code text-[9.5px]">
                WGS84 • EPSG:4326
              </text>
              <rect x="44" y="26" width="65" height="3" fill="#ff8a3d" />
              <text x="115" y="30" fill="#7f93a3" className="font-mono-code text-[8.5px]">
                100 km
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* FLOATING HUD: LAYER CONTROLS (Top-Left) */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 max-w-[260px]">
        <div className="bg-[#10161d]/95 backdrop-blur-md px-3 py-2 rounded-lg border border-[#223040] shadow-xl text-xs font-mono-code">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#223040]">
            <span className="text-[10px] text-[#7f93a3] uppercase tracking-wider font-semibold">
              CAPAS ACTIVAS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#e8eef2] hover:text-[#ffd23d]">
              <input
                type="checkbox"
                checked={layers.trench}
                onChange={e => setLayers(prev => ({ ...prev, trench: e.target.checked }))}
                className="accent-[#ff5a36] rounded"
              />
              <span>Fosa Tectónica</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#e8eef2] hover:text-[#ffd23d]">
              <input
                type="checkbox"
                checked={layers.faults}
                onChange={e => setLayers(prev => ({ ...prev, faults: e.target.checked }))}
                className="accent-[#ff5a36] rounded"
              />
              <span>Fallas PB2002</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#e8eef2] hover:text-[#ffd23d]">
              <input
                type="checkbox"
                checked={layers.volcanoes}
                onChange={e => setLayers(prev => ({ ...prev, volcanoes: e.target.checked }))}
                className="accent-[#ff5a36] rounded"
              />
              <span>Volcanes IGEPN</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#e8eef2] hover:text-[#ffd23d]">
              <input
                type="checkbox"
                checked={layers.gnss}
                onChange={e => setLayers(prev => ({ ...prev, gnss: e.target.checked }))}
                className="accent-[#ff5a36] rounded"
              />
              <span>Red GNSS/Acel.</span>
            </label>
          </div>
        </div>

        {/* Depth Color Key Badge */}
        <div className="bg-[#10161d]/90 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-[#223040] shadow-md flex items-center justify-between text-[10px] font-mono-code">
          <span className="text-[#4d6070] uppercase">Profundidad:</span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-[#ff3b30]">
              <span className="w-2 h-2 rounded-full bg-[#ff3b30]" />
              &lt;10k
            </span>
            <span className="flex items-center gap-0.5 text-[#ff8a3d]">
              <span className="w-2 h-2 rounded-full bg-[#ff8a3d]" />
              30k
            </span>
            <span className="flex items-center gap-0.5 text-[#ffd23d]">
              <span className="w-2 h-2 rounded-full bg-[#ffd23d]" />
              70k
            </span>
            <span className="flex items-center gap-0.5 text-[#35c7a6]">
              <span className="w-2 h-2 rounded-full bg-[#35c7a6]" />
              150k
            </span>
            <span className="flex items-center gap-0.5 text-[#5b8def]">
              <span className="w-2 h-2 rounded-full bg-[#5b8def]" />
              +150k
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING NAVIGATION HUD (Zoom / Center for Vector mode) */}
      {mapEngine === 'vector' && (
        <div className="absolute top-14 right-3 z-30 flex flex-col gap-1 bg-[#10161d]/90 backdrop-blur-md rounded-md p-1 border border-[#223040] shadow-xl">
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            className="w-8 h-8 flex items-center justify-center text-[#e8eef2] hover:bg-[#141b23] rounded transition-colors"
            title="Acercar mapa"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            className="w-8 h-8 flex items-center justify-center text-[#e8eef2] hover:bg-[#141b23] rounded transition-colors"
            title="Alejar mapa"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-[#223040] my-0.5" />
          <button
            type="button"
            onClick={resetView}
            className="w-8 h-8 flex items-center justify-center text-[#ffd23d] hover:bg-[#141b23] rounded transition-colors"
            title="Centrar Ecuador Continental"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FLOATING SELECTED EVENT INSPECTOR (Bottom-Left) */}
      {selectedQuake && (
        <div className="absolute bottom-3 left-3 z-30 max-w-sm w-[calc(100%-24px)] bg-[#10161d]/95 backdrop-blur-xl p-3.5 rounded-lg border-l-4 border-l-[#ff3b30] border border-[#223040] shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center font-display font-bold text-base shrink-0 shadow-inner"
                style={{
                  backgroundColor: `${getDepthColor(selectedQuake.depth)}25`,
                  color: getDepthColor(selectedQuake.depth),
                }}
              >
                {selectedQuake.mag.toFixed(1)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-sm text-[#e8eef2] leading-tight truncate">
                  {selectedQuake.place}
                </span>
                <span className="font-mono-code text-[10px] text-[#7f93a3] truncate">
                  {selectedQuake.region} • {selectedQuake.depth < 30 ? 'Superficial' : 'Profundo'}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 bg-[#2a1c0e] text-[#ff8a3d] border border-[#4a3418] rounded font-mono-code text-[9px] font-semibold">
              {selectedQuake.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 bg-[#0a0e13]/70 p-2 rounded border border-[#223040]/50 font-mono-code text-center">
            <div>
              <div className="text-[9px] text-[#4d6070] uppercase">Profundidad</div>
              <div className="text-xs text-[#e8eef2] font-semibold">
                {selectedQuake.depth.toFixed(1)} km
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#4d6070] uppercase">Tiempo Local</div>
              <div className="text-[11px] text-[#e8eef2] font-semibold truncate">
                {selectedQuake.localTimeECT}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-[#4d6070] uppercase">Intensidad</div>
              <div className="text-[11px] text-[#ff5a36] font-semibold truncate">
                {selectedQuake.maxIntensityMMI || 'V (Fuerte)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
