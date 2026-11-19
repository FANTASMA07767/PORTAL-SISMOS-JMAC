import React, { useState, useEffect } from 'react';
import { User, Activity, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: 'monitoreo-en-vivo' | 'ficha-de-evento' | 'analisis-tectonico';
  onSelectTab: (tab: 'monitoreo-en-vivo' | 'ficha-de-evento' | 'analisis-tectonico') => void;
  scope: 'ecuador' | 'latam';
  onSelectScope: (scope: 'ecuador' | 'latam') => void;
  sensorHealth?: number;
  onOpenSourcesModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  scope,
  onSelectScope,
  sensorHealth = 98.4,
  onOpenSourcesModal,
}) => {
  const [utcTime, setUtcTime] = useState('');
  const [ectTime, setEctTime] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setUtcTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setEctTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'America/Guayaquil',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#10161d]/90 backdrop-blur-xl border-b border-[#223040] shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('monitoreo-en-vivo')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c2734] to-[#0a0e13] border border-[#ff5a36]/40 flex items-center justify-center p-1 shadow-md shadow-red-950/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff5a36]/20 to-transparent pointer-events-none" />
              {/* Andean Mountain + Seismic Wave + Flag Accent Vector */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Flag micro-bars in top right */}
                <rect x="62" y="14" width="26" height="4" rx="1.5" fill="#ffd23d" />
                <rect x="62" y="20" width="26" height="4" rx="1.5" fill="#2563eb" />
                <rect x="62" y="26" width="26" height="4" rx="1.5" fill="#ff3b30" />
                {/* Volcano silhouette */}
                <polygon points="50,22 76,72 24,72" fill="#1e2c3d" stroke="#324458" strokeWidth="2.5" />
                {/* Waveform line glowing */}
                <path
                  d="M 12,50 L 32,50 L 40,36 L 46,60 L 50,18 L 56,66 L 62,38 L 70,50 L 88,50"
                  fill="none"
                  stroke="#ffb300"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="18" r="4.5" fill="#ffffff" stroke="#ff3b30" strokeWidth="2" className="animate-pulse" />
              </svg>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#e8eef2] uppercase">
                  GEOMONITOR
                </span>
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#ffd23d] uppercase">
                  ECUADOR
                </span>
              </div>
              <span className="font-mono-code text-[9px] sm:text-[10px] text-[#7f93a3] tracking-wider uppercase mt-0.5">
                Red Sísmica Nacional & Monitoreo Geofísico
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0a0e13]/80 p-1 rounded-md border border-[#223040]">
            <button
              type="button"
              onClick={() => onSelectTab('monitoreo-en-vivo')}
              className={`px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'monitoreo-en-vivo'
                  ? 'bg-[#ff5a36] text-[#0a0e13] font-semibold shadow-sm'
                  : 'text-[#7f93a3] hover:text-[#e8eef2] hover:bg-[#141b23]'
              }`}
            >
              Monitoreo en Vivo
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('ficha-de-evento')}
              className={`px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'ficha-de-evento'
                  ? 'bg-[#ff5a36] text-[#0a0e13] font-semibold shadow-sm'
                  : 'text-[#7f93a3] hover:text-[#e8eef2] hover:bg-[#141b23]'
              }`}
            >
              Ficha de Evento
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('analisis-tectonico')}
              className={`px-3.5 py-1.5 rounded text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'analisis-tectonico'
                  ? 'bg-[#ff5a36] text-[#0a0e13] font-semibold shadow-sm'
                  : 'text-[#7f93a3] hover:text-[#e8eef2] hover:bg-[#141b23]'
              }`}
            >
              Análisis Tectónico
            </button>
          </nav>

          {/* Controls & Telemetry Clocks */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Informative Sources & Guide Button */}
            {onOpenSourcesModal && (
              <button
                type="button"
                onClick={onOpenSourcesModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16212d] hover:bg-[#1f2e3f] border border-[#2b3c4f] text-[#38bdf8] hover:text-[#7dd3fc] font-mono-code text-[11px] font-bold transition-all shadow-xs"
                title="Centro de Fuentes Oficiales y Glosario Sísmico"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Fuentes & Guía</span>
              </button>
            )}

            {/* JMAC-SECURITY Security Badge */}
            <div className="hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#101923] border border-[#ff8a3d]/40 text-[#ffd23d] font-mono-code text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>JMAC-SECURITY</span>
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a1310] border border-[#ff3b30]/30">
              <div className="w-2 h-2 rounded-full bg-[#ff3b30] live-pulse" />
              <span className="font-mono-code text-[10px] text-[#ffb4a3] uppercase font-bold tracking-wider">
                EN VIVO
              </span>
            </div>

            {/* Scope Switcher */}
            <div className="hidden sm:flex items-center bg-[#0a0e13] rounded p-0.5 border border-[#223040]">
              <button
                type="button"
                onClick={() => onSelectScope('ecuador')}
                className={`px-2.5 py-1 font-mono-code text-[11px] rounded transition-colors ${
                  scope === 'ecuador'
                    ? 'bg-[#141b23] text-[#ffd23d] font-semibold shadow-xs'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                ECUADOR
              </button>
              <button
                type="button"
                onClick={() => onSelectScope('latam')}
                className={`px-2.5 py-1 font-mono-code text-[11px] rounded transition-colors ${
                  scope === 'latam'
                    ? 'bg-[#141b23] text-[#ffd23d] font-semibold shadow-xs'
                    : 'text-[#4d6070] hover:text-[#7f93a3]'
                }`}
              >
                LATAM
              </button>
            </div>

            {/* Sensor Health and UTC/ECT Telemetry Clock */}
            <div className="hidden lg:flex flex-col items-end font-mono-code text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
                <span className="text-[#7f93a3]">
                  SENSORES: <strong className="text-[#e8eef2]">{sensorHealth}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#4d6070]">
                <span>
                  UTC: <span className="text-[#7f93a3]">{utcTime}</span>
                </span>
                <span>•</span>
                <span>
                  ECT: <span className="text-[#7f93a3]">{ectTime}</span>
                </span>
              </div>
            </div>

            {/* User Profile Button */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full bg-[#1c2734] border border-[#223040] hover:border-[#ff8a3d] text-[#ff8a3d] flex items-center justify-center transition-colors shadow-sm"
              title="Operador Sismológico"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden border-t border-[#223040] bg-[#0d131a] px-3 py-1.5 justify-around text-xs">
          <button
            type="button"
            onClick={() => onSelectTab('monitoreo-en-vivo')}
            className={`px-2.5 py-1 rounded font-medium ${
              currentTab === 'monitoreo-en-vivo' ? 'bg-[#ff5a36] text-[#0a0e13]' : 'text-[#7f93a3]'
            }`}
          >
            Monitoreo
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('ficha-de-evento')}
            className={`px-2.5 py-1 rounded font-medium ${
              currentTab === 'ficha-de-evento' ? 'bg-[#ff5a36] text-[#0a0e13]' : 'text-[#7f93a3]'
            }`}
          >
            Ficha
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('analisis-tectonico')}
            className={`px-2.5 py-1 rounded font-medium ${
              currentTab === 'analisis-tectonico' ? 'bg-[#ff5a36] text-[#0a0e13]' : 'text-[#7f93a3]'
            }`}
          >
            Tectónico
          </button>
          {onOpenSourcesModal && (
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="px-2 py-1 rounded font-medium text-[#38bdf8] flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>Fuentes</span>
            </button>
          )}
        </div>
      </header>

      {/* Operator Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#223040]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#ff5a36]/20 border border-[#ff5a36]/40 flex items-center justify-center text-[#ff8a3d]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#e8eef2]">
                    Terminal Geofísica RENSIG
                  </h3>
                  <span className="font-mono-code text-[11px] text-[#2dd4bf]">
                    Operador Nivel 2 • Guardia Activa
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-[#7f93a3] hover:text-[#e8eef2] p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono-code text-xs">
              <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#223040]/70 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Administración:</span>
                  <span className="text-[#ffd23d] font-bold">JMAC-SECURITY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Derechos de Autor:</span>
                  <span className="text-[#2dd4bf]">Todos los derechos reservados</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Usuario:</span>
                  <span className="text-[#e8eef2]">sismologo.guardia@epn.edu.ec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Consola FDSN:</span>
                  <span className="text-[#ffd23d]">FDSN-WS Node Quito 01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Protocolo SeedLink:</span>
                  <span className="text-[#2dd4bf]">Conectado (TCP 18000)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7f93a3]">Alerta Temprana SAT:</span>
                  <span className="text-[#ff5a36]">Armado Automático</span>
                </div>
              </div>

              <div className="text-[11px] text-[#7f93a3] leading-relaxed">
                Esta plataforma procesa en tiempo real ondas primarias (P) y secundarias (S)
                de la Red Nacional de Sismógrafos del Ecuador e interfaces internacionales (USGS, EMSC, ISC).
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#223040] flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-1.5 rounded bg-[#223040] hover:bg-[#324458] text-[#e8eef2] text-xs font-medium"
              >
                Cerrar Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
