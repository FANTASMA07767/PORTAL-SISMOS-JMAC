import React, { useState, useMemo } from 'react';
import { Volume2, VolumeX, AlertTriangle, ArrowDown, Activity, Radio, ChevronRight, Layers, FileText } from 'lucide-react';
import { Earthquake, SeismicSource } from '../types/seismic';
import { InteractiveMap } from './InteractiveMap';
import { SeismoTrace } from './SeismoTrace';
import { getDepthColor, playAlertBeep } from '../services/seismicApi';

interface LiveMonitoringViewProps {
  earthquakes: Earthquake[];
  selectedQuake: Earthquake | null;
  onSelectQuake: (q: Earthquake) => void;
  onOpenEventDetail: (q: Earthquake) => void;
  scope: 'ecuador' | 'latam';
  onOpenSourcesModal?: () => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  earthquakes,
  selectedQuake,
  onSelectQuake,
  onOpenEventDetail,
  scope,
  onOpenSourcesModal,
}) => {
  const [minMag, setMinMag] = useState<number>(2.5);
  const [selectedSources, setSelectedSources] = useState<Record<SeismicSource, boolean>>({
    IGEPN: true,
    USGS: true,
    EMSC: true,
    PB2002: true,
  });
  const [feedMode, setFeedMode] = useState<'viva' | 'historico'>('viva');
  const [activeSideTab, setActiveSideTab] = useState<'events' | 'legend' | 'context' | 'sources'>('events');
  const [audioAlertEnabled, setAudioAlertEnabled] = useState<boolean>(true);

  // Filter earthquakes based on magnitude and sources
  const filteredQuakes = useMemo(() => {
    return earthquakes.filter(q => {
      const passesMag = q.mag >= minMag;
      const passesSource = selectedSources[q.source] ?? true;
      return passesMag && passesSource;
    });
  }, [earthquakes, minMag, selectedSources]);

  const toggleSource = (source: SeismicSource) => {
    setSelectedSources(prev => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  const handleToggleAudio = () => {
    const nextState = !audioAlertEnabled;
    setAudioAlertEnabled(nextState);
    if (nextState) {
      playAlertBeep(5.5);
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 min-h-[calc(100vh-64px)]">
      {/* TELEMETRY SUB-TICKER & QUICK KPIS BAR */}
      <section className="w-full bg-[#0a0e13] px-4 lg:px-6 py-2 border-b border-[#223040]">
        <div className="w-full flex flex-wrap items-center justify-between gap-2.5">
          {/* KPI Pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-0.5 font-mono-code text-xs">
            {/* Live Real-Time Detector Otavalo Pill */}
            <div className="flex items-center gap-1.5 bg-[#152332] px-3 py-1.5 rounded-lg border border-[#2d4663] shadow-sm shrink-0">
              <Activity className="w-4 h-4 text-[#ff5a36] animate-pulse" />
              <span className="text-[10px] text-[#7f93a3] uppercase font-bold">DETECTOR ACTIVO:</span>
              <span className="text-[#ffd23d] font-bold">OTAVALO (OTAV.EC)</span>
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
            </div>

            <div className="flex items-center gap-1.5 bg-[#10161d] px-3 py-1.5 rounded border border-[#223040] shadow-sm shrink-0">
              <Radio className="w-4 h-4 text-[#ffd23d]" />
              <span className="text-[10px] text-[#7f93a3] uppercase">TOTAL (30D):</span>
              <span className="text-[#e8eef2] font-bold">142 EVENTOS</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#10161d] px-3 py-1.5 rounded border border-[#223040] shadow-sm shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#ff3b30]" />
              <span className="text-[10px] text-[#7f93a3] uppercase">SISMO MAYOR:</span>
              <span className="text-[#ff5a36] font-bold">
                M 5.8 <span className="text-[#7f93a3] font-normal">• Costa Manabí</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#10161d] px-3 py-1.5 rounded border border-[#223040] shadow-sm shrink-0">
              <ArrowDown className="w-4 h-4 text-[#2dd4bf]" />
              <span className="text-[10px] text-[#7f93a3] uppercase">PROFUNDIDAD:</span>
              <span className="text-[#e8eef2] font-bold">24.3 KM</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#10161d] px-3 py-1.5 rounded border border-[#223040] shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#2dd4bf] live-pulse" />
              <span className="text-[10px] text-[#7f93a3] uppercase">RED IGEPN/USGS:</span>
              <span className="text-[#2dd4bf] font-bold">NOMINAL 100%</span>
            </div>
          </div>

          {/* Quick Controls Right */}
          <div className="flex items-center gap-2 ml-auto">
            {onOpenSourcesModal && (
              <button
                type="button"
                onClick={onOpenSourcesModal}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#152433] hover:bg-[#1f3246] border border-[#2f4965] rounded font-mono-code text-[10px] text-[#38bdf8] font-bold uppercase transition-colors shadow-sm"
                title="Ver fuentes oficiales y glosario sísmico"
              >
                <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="hidden sm:inline">FUENTES & GUÍA</span>
              </button>
            )}

            <div className="flex items-center bg-[#0a0e13] rounded p-0.5 border border-[#223040]">
              <button
                type="button"
                onClick={() => setFeedMode('viva')}
                className={`px-2.5 py-1 font-mono-code text-[10px] rounded transition-all font-semibold ${
                  feedMode === 'viva'
                    ? 'bg-[#2a1310] text-[#ff5a36] border border-[#ff5a36]/30'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                SISMICIDAD VIVA
              </button>
              <button
                type="button"
                onClick={() => setFeedMode('historico')}
                className={`px-2.5 py-1 font-mono-code text-[10px] rounded transition-all ${
                  feedMode === 'historico'
                    ? 'bg-[#141b23] text-[#ffd23d]'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                CATÁLOGO HISTÓRICO
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-2.5 py-1 bg-[#10161d] hover:bg-[#141b23] border border-[#223040] rounded font-mono-code text-[10px] uppercase transition-colors shadow-sm ${
                audioAlertEnabled ? 'text-[#f59e0b]' : 'text-[#4d6070]'
              }`}
              title="Alternar Alerta Sonora Telemétrica"
            >
              {audioAlertEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{audioAlertEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN GEOSPATIAL COMMAND DECK (Split View) */}
      <div className="w-full flex flex-col xl:flex-row flex-1 overflow-hidden min-h-[calc(100vh-140px)]">
        {/* LEFT / CENTER STAGE: Map & Waveform */}
        <div className="relative flex-1 bg-[#0a0e13] flex flex-col min-h-[540px] xl:min-h-auto">
          <InteractiveMap
            earthquakes={filteredQuakes}
            selectedQuake={selectedQuake}
            onSelectQuake={onSelectQuake}
            onOpenEventDetail={onOpenEventDetail}
            scope={scope}
          />
          <SeismoTrace
            stationName="ESTACIÓN OTAVALO"
            stationCode="OTAV.EC"
            channel="CANAL HHZ (BANDA ANCHA)"
            pga={selectedQuake?.pgaG || 0.048}
          />
        </div>

        {/* RIGHT SIDEBAR: Telemetry Dock & Event Feed */}
        <aside className="w-full xl:w-[420px] bg-[#10161d] border-t xl:border-t-0 xl:border-l border-[#223040] flex flex-col shadow-2xl xl:h-[calc(100vh-140px)]">
          {/* Panel Header & Navigation Tabs */}
          <div className="p-3.5 bg-[#181c21] border-b border-[#223040] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#ff8a3d]" />
                <h2 className="font-display font-bold text-sm sm:text-base text-[#e8eef2] tracking-tight">
                  TELEMETRÍA SÍSMICA
                </h2>
              </div>
              <span className="font-mono-code text-[10px] px-2 py-0.5 bg-[#2a1310] border border-[#ff3b30]/30 text-[#ff5a36] rounded font-bold">
                LIVE FEED
              </span>
            </div>

            {/* Filter Deck */}
            <div className="bg-[#0a0e13] p-2.5 rounded border border-[#223040]/70 flex flex-col gap-2 font-mono-code">
              {/* Magnitude Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7f93a3] uppercase text-[10px]">Magnitud Mínima</span>
                  <span className="text-[#ffd23d] font-bold">≥ M {minMag.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.5"
                  value={minMag}
                  onChange={e => setMinMag(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#161f2b] rounded appearance-none cursor-pointer accent-[#ff8a3d]"
                />
              </div>

              {/* Sources Multi-Select */}
              <div className="flex items-center justify-between pt-1 border-t border-[#223040]/50 text-[10px]">
                <span className="text-[#4d6070] uppercase">Fuentes Oficiales:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleSource('IGEPN')}
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-colors ${
                      selectedSources.IGEPN
                        ? 'bg-[#141b23] border-[#223040] text-[#ffd23d]'
                        : 'bg-transparent border-[#223040]/50 text-[#4d6070]'
                    }`}
                  >
                    IGEPN
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSource('USGS')}
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-colors ${
                      selectedSources.USGS
                        ? 'bg-[#2a1c0e] border-[#4a3418] text-[#ff8a3d]'
                        : 'bg-transparent border-[#223040]/50 text-[#4d6070]'
                    }`}
                  >
                    USGS
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSource('EMSC')}
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-colors ${
                      selectedSources.EMSC
                        ? 'bg-[#211a3a] border-[#3a2f5a] text-[#a78bfa]'
                        : 'bg-transparent border-[#223040]/50 text-[#4d6070]'
                    }`}
                  >
                    EMSC
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-[#0a0e13] p-0.5 rounded border border-[#223040] text-center font-mono-code text-[10px]">
              <button
                type="button"
                onClick={() => setActiveSideTab('events')}
                className={`py-1 rounded font-bold transition-all ${
                  activeSideTab === 'events'
                    ? 'bg-[#141b23] text-[#e8eef2] shadow-sm'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                EVENTOS ({filteredQuakes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab('legend')}
                className={`py-1 rounded transition-all ${
                  activeSideTab === 'legend'
                    ? 'bg-[#141b23] text-[#e8eef2] shadow-sm'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                LEYENDA
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab('context')}
                className={`py-1 rounded transition-all ${
                  activeSideTab === 'context'
                    ? 'bg-[#141b23] text-[#e8eef2] shadow-sm'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                GEOLOGÍA
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab('sources')}
                className={`py-1 rounded transition-all ${
                  activeSideTab === 'sources'
                    ? 'bg-[#141b23] text-[#38bdf8] font-bold shadow-sm'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                FUENTES
              </button>
            </div>
          </div>

          {/* TAB 1: Real-time Quake List Feed */}
          {activeSideTab === 'events' && (
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredQuakes.length === 0 ? (
                <div className="p-8 text-center text-[#7f93a3] font-mono-code text-xs">
                  No hay sismos que superen M {minMag.toFixed(1)} con los filtros activos.
                </div>
              ) : (
                filteredQuakes.map(quake => {
                  const isSelected = selectedQuake?.id === quake.id;
                  const color = getDepthColor(quake.depth);

                  return (
                    <div
                      key={quake.id}
                      onClick={() => onSelectQuake(quake)}
                      className={`group p-2.5 rounded border transition-all cursor-pointer flex flex-col gap-2 shadow-sm ${
                        isSelected
                          ? 'bg-[#161f2b] border-[#ff5a36]'
                          : 'bg-[#141b23] border-[#223040] hover:bg-[#182330] hover:border-[#324458]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* MagTile Badge */}
                          <div
                            className="w-11 h-11 rounded flex flex-col items-center justify-center font-display font-bold text-sm shrink-0 border"
                            style={{
                              backgroundColor: `${color}20`,
                              borderColor: `${color}40`,
                              color,
                            }}
                          >
                            <span>{quake.mag.toFixed(1)}</span>
                            <span className="text-[8px] font-mono-code -mt-1 font-normal opacity-80">
                              {quake.magType}
                            </span>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display text-xs text-[#e8eef2] truncate font-bold">
                                {quake.place}
                              </span>
                              <span
                                className={`px-1 py-0.2 rounded font-mono-code text-[9px] font-bold ${
                                  quake.source === 'USGS'
                                    ? 'bg-[#2a1c0e] text-[#ff8a3d]'
                                    : quake.source === 'EMSC'
                                    ? 'bg-[#211a3a] text-[#a78bfa]'
                                    : 'bg-[#141b23] text-[#ffd23d]'
                                }`}
                              >
                                {quake.source}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[#7f93a3] font-mono-code text-[11px] mt-0.5">
                              <span style={{ color }} className="font-semibold">
                                Prof: {quake.depth.toFixed(1)} km
                              </span>
                              <span>•</span>
                              <span className="truncate">{quake.localTimeECT}</span>
                            </div>

                            <span className="font-mono-code text-[9px] text-[#ffd23d] truncate">
                              {quake.coordinatesString || `${quake.lat}°, ${quake.lon}°`} • {quake.region}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-[#4d6070] group-hover:text-[#e8eef2] transition-colors shrink-0" />
                      </div>

                      {/* Quick Action Button for Event Detail */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#223040]/40 font-mono-code text-[10px]">
                        <span className="text-[#4d6070]">ID: {quake.id}</span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onOpenEventDetail(quake);
                          }}
                          className="flex items-center gap-1 text-[#ff8a3d] hover:text-[#ffd23d] hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Ver Ficha Completa</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Scientific Legend */}
          {activeSideTab === 'legend' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono-code">
              <div>
                <h3 className="font-display font-bold text-xs text-[#e8eef2] uppercase tracking-tight">
                  Escala de Profundidad Hipocentral
                </h3>
                <p className="font-sans-body text-xs text-[#7f93a3] mt-1">
                  La colorimetría geodésica estandarizada indica la profundidad focal de los eventos tectónicos en el margen de subducción ecuatoriano:
                </p>
                <div className="mt-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 bg-[#0a0e13] rounded border border-[#223040]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ff3b30]" />
                      <span className="text-[#e8eef2] font-semibold">0 a 10 km (Superficial Extremo)</span>
                    </div>
                    <span className="text-[#ff3b30] text-[10px]">Sismos corticales / Fallas activas</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#0a0e13] rounded border border-[#223040]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ff8a3d]" />
                      <span className="text-[#e8eef2] font-semibold">10 a 30 km (Acoplamiento)</span>
                    </div>
                    <span className="text-[#ff8a3d] text-[10px]">Interfaz Interplaca Nazca-Sudam.</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#0a0e13] rounded border border-[#223040]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ffd23d]" />
                      <span className="text-[#e8eef2] font-semibold">30 a 70 km (Intraplaca Media)</span>
                    </div>
                    <span className="text-[#ffd23d] text-[10px]">Losa Oceánica en deformación</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#0a0e13] rounded border border-[#223040]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#35c7a6]" />
                      <span className="text-[#e8eef2] font-semibold">70 a 150 km (Intermedia)</span>
                    </div>
                    <span className="text-[#35c7a6] text-[10px]">Bajo el Arco Volcánico Andino</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#0a0e13] rounded border border-[#223040]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#5b8def]" />
                      <span className="text-[#e8eef2] font-semibold">&gt; 150 km (Profundos)</span>
                    </div>
                    <span className="text-[#5b8def] text-[10px]">Amazonía / Plano Benioff</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-xs text-[#e8eef2] uppercase tracking-tight">
                  Simbología Geofísica
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#0a0e13] rounded border border-[#223040] flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#ff5a36] inline-block clip-triangle" />
                    <span className="text-[#e8eef2] text-[11px]">Volcán Activo IGEPN</span>
                  </div>
                  <div className="p-2 bg-[#0a0e13] rounded border border-[#223040] flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#2563eb] border-dashed" />
                    <span className="text-[#e8eef2] text-[11px]">Fosa de Subducción</span>
                  </div>
                  <div className="p-2 bg-[#0a0e13] rounded border border-[#223040] flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-[#f59e0b] border-dashed" />
                    <span className="text-[#e8eef2] text-[11px]">Falla Geológica PB2002</span>
                  </div>
                  <div className="p-2 bg-[#0a0e13] rounded border border-[#223040] flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    <span className="text-[#e8eef2] text-[11px]">Acelerógrafo GNSS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Tectonic Context Ecuador */}
          {activeSideTab === 'context' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans-body text-xs text-[#7f93a3]">
              <div>
                <h3 className="font-display font-bold text-xs text-[#e8eef2] uppercase tracking-tight font-mono-code">
                  Marco Geodinámico del Ecuador
                </h3>
                <p className="mt-1 leading-relaxed">
                  Ecuador se encuentra en una de las zonas tectónicas de más alta actividad del Cinturón de Fuego del Pacífico. La subducción frontal y oblicua de la Placa oceánica de Nazca bajo el Bloque Norandino (Placa Sudamericana) genera una velocidad de convergencia aproximada de <strong className="text-[#ffd23d]">56 mm/año</strong>.
                </p>
              </div>

              <div className="p-3 bg-[#0a0e13] rounded border border-[#223040] space-y-2">
                <div className="font-display font-bold text-xs text-[#ffd23d]">
                  Rasgos Principales:
                </div>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-[#e8eef2]">
                  <li>
                    <strong className="text-[#ff8a3d]">Fosa Ecuador-Perú:</strong> Origen de los grandes megaterremotos costeros (ej. 1906 Mw 8.8, 2016 Mw 7.8 Pedernales).
                  </li>
                  <li>
                    <strong className="text-[#35c7a6]">Dorsal de Carnegie:</strong> Relieve submarino asísmico que entra en colisión frontal frente a Manabí y modula asperezas sísmicas.
                  </li>
                  <li>
                    <strong className="text-[#f59e0b]">Falla Pallatanga-Puná:</strong> Sistema de desgarre dextral que transfiere deformación hacia el Golfo de Guayaquil.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: Official Informative Sources & Networks */}
          {activeSideTab === 'sources' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono-code text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-[#223040]">
                <span className="text-[#38bdf8] font-bold text-xs uppercase">Fuentes Oficiales Integradas</span>
                {onOpenSourcesModal && (
                  <button
                    type="button"
                    onClick={onOpenSourcesModal}
                    className="text-[10px] text-[#ffd23d] hover:underline font-bold"
                  >
                    Abrir Guía Completa →
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-[#0a0e13] rounded-lg border border-[#223040] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#ffd23d] font-bold">IGEPN (Ecuador)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#16212d] text-[#2dd4bf]">OFICIAL EC</span>
                  </div>
                  <p className="text-[10px] text-[#7f93a3] leading-relaxed">
                    Instituto Geofísico EPN. Red RENSIG (sismógrafos) y RENAC (acelerógrafos). FDSN Node Quito.
                  </p>
                  <a
                    href="https://www.igepn.edu.ec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] text-[#38bdf8] hover:underline"
                  >
                    igepn.edu.ec ↗
                  </a>
                </div>

                <div className="p-2.5 bg-[#0a0e13] rounded-lg border border-[#223040] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#ff8a3d] font-bold">USGS Earthquake Hazards</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2a1c0e] text-[#ff8a3d]">GLOBAL</span>
                  </div>
                  <p className="text-[10px] text-[#7f93a3] leading-relaxed">
                    United States Geological Survey. ComCat feeds en tiempo real y modelos ShakeMap/PAGER.
                  </p>
                  <a
                    href="https://earthquake.usgs.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] text-[#38bdf8] hover:underline"
                  >
                    earthquake.usgs.gov ↗
                  </a>
                </div>

                <div className="p-2.5 bg-[#0a0e13] rounded-lg border border-[#223040] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a78bfa] font-bold">EMSC - CSEM</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#211a3a] text-[#a78bfa]">CIUDADANO</span>
                  </div>
                  <p className="text-[10px] text-[#7f93a3] leading-relaxed">
                    Centro Sismológico Europeo-Mediterráneo. Detección rápida basada en red LastQuake.
                  </p>
                  <a
                    href="https://www.emsc-csem.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] text-[#38bdf8] hover:underline"
                  >
                    emsc-csem.org ↗
                  </a>
                </div>

                <div className="p-2.5 bg-[#0a0e13] rounded-lg border border-[#223040] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5b8def] font-bold">IRIS / EarthScope</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#141b23] text-[#93c5fd]">CIENCIA</span>
                  </div>
                  <p className="text-[10px] text-[#7f93a3] leading-relaxed">
                    Repositorio global de formas de onda miniSEED y estaciones de banda ancha (OTAV, PAYG).
                  </p>
                  <a
                    href="https://www.iris.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] text-[#38bdf8] hover:underline"
                  >
                    iris.edu ↗
                  </a>
                </div>
              </div>

              {onOpenSourcesModal && (
                <button
                  type="button"
                  onClick={onOpenSourcesModal}
                  className="w-full py-2 px-3 rounded-lg bg-[#16222f] hover:bg-[#203142] border border-[#2d4359] text-[#38bdf8] font-bold text-center transition-colors"
                >
                  Abrir Glosario & Guía de Tsunamis
                </button>
              )}
            </div>
          )}

          {/* Telemetry Footer Status */}
          <div className="p-2.5 bg-[#0a0e13] border-t border-[#223040] flex items-center justify-between text-[#4d6070] font-mono-code text-[11px]">
            <span>
              RED COMPLETA: <strong className="text-[#7f93a3]">48 ESTACIONES</strong>
            </span>
            <span>
              LATENCIA: <strong className="text-[#2dd4bf]">0.82 SEG</strong>
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};
