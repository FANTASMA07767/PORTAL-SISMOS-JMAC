import React from 'react';
import { ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenSourcesModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSourcesModal }) => {
  return (
    <footer className="w-full bg-[#080b0f] border-t border-[#223040] py-4 px-4 lg:px-6">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left font-mono-code text-[11px] text-[#7f93a3]">
        {/* Sources tags with clickable button */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[#4d6070] uppercase tracking-wider text-[10px] font-bold">
              Red Oficial:
            </span>
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="px-2 py-0.5 bg-[#141b23] hover:bg-[#1f2937] border border-[#223040] text-[#ffd23d] rounded text-[10px] font-semibold transition-colors cursor-pointer"
            >
              IGEPN (EC)
            </button>
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="px-2 py-0.5 bg-[#2a1c0e] hover:bg-[#382613] border border-[#4a3418] text-[#ff8a3d] rounded text-[10px] font-semibold transition-colors cursor-pointer"
            >
              USGS (US)
            </button>
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="px-2 py-0.5 bg-[#211a3a] hover:bg-[#312654] border border-[#3a2f5a] text-[#a78bfa] rounded text-[10px] font-semibold transition-colors cursor-pointer"
            >
              EMSC (EU)
            </button>
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="px-2 py-0.5 bg-[#141b23] hover:bg-[#1f2937] border border-[#223040] text-[#5b8def] rounded text-[10px] font-semibold transition-colors cursor-pointer"
            >
              IRIS / PB2002
            </button>
          </div>

          {onOpenSourcesModal && (
            <button
              type="button"
              onClick={onOpenSourcesModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#16222f] hover:bg-[#203142] border border-[#2e4258] text-[#38bdf8] text-[10px] font-bold transition-all shadow-xs"
            >
              <BookOpen className="w-3 h-3 text-[#38bdf8]" />
              <span>Ver Todas las Fuentes & Guía Científica</span>
            </button>
          )}
        </div>

        {/* Legal, Copyright & JMAC-SECURITY Administration Notice */}
        <div className="text-center md:text-right text-[10px] text-[#4d6070] space-y-1.5">
          <p className="text-[#8ea1b2]">
            Plataforma Científica de Alerta Temprana & Red Sismológica del Ecuador
          </p>
          <p>
            Telemetría geofísica para investigación y protección civil •
            Actualización continua satelital
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2 pt-1 text-[11px]">
            <span className="text-[#a0b0be] font-medium">
              © {new Date().getFullYear()} GeoMonitor Ecuador • Todos los derechos de autor reservados.
            </span>
            <span className="hidden sm:inline text-[#223040]">|</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121a24] border border-[#ff8a3d]/50 text-[#ffd23d] font-bold tracking-wide shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>Administrado por JMAC-SECURITY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
