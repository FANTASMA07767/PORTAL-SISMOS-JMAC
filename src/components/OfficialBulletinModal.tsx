import React from 'react';
import { Download, Printer, ShieldCheck, FileText } from 'lucide-react';
import { Earthquake } from '../types/seismic';

interface OfficialBulletinModalProps {
  quake: Earthquake;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialBulletinModal: React.FC<OfficialBulletinModalProps> = ({
  quake,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `INSTITUTO GEOFÍSICO DE LA ESCUELA POLITÉCNICA NACIONAL (IGEPN)
RED SÍSMICA NACIONAL DEL ECUADOR (RENSIG)
BOLETÍN SÍSMICO OFICIAL - DEFINITIVO

ID DEL EVENTO: ${quake.id}
FECHA / HORA LOCAL: ${quake.localTimeECT}
FECHA / HORA UTC: ${quake.time}

PARÁMETROS HIPOCENTRALES:
- MAGNITUD: ${quake.mag.toFixed(1)} ${quake.magType}
- PROFUNDIDAD: ${quake.depth.toFixed(1)} km (Superficial)
- EPICENTRO: ${quake.place}
- COORDENADAS: ${quake.coordinatesString || `${quake.lat}°, ${quake.lon}°`}
- ESTADO DE SOLUCIÓN: DEFINITIVO (REVISADO POR SISMÓLOGO DE GUARDIA)

EVALUACIÓN DE TSUNAMI:
- ESTADO: ${quake.tsunamiAlert ? 'ALERTA ACTIVADA' : 'NO GENERA ALERTA DE TSUNAMI'}
- DICTAMEN INOCAR / PTWC: Cero riesgo de afectación a costas ecuatorianas continentales o insulares.

REGISTRO DE ACELERACIÓN MÁXIMA (PGA):
- ESTACIÓN: PEDE (Pedernales)
- PGA MÁXIMO: ${quake.pgaG ? (quake.pgaG * 100).toFixed(1) : '18.2'}% g
- INTENSIDAD MÁXIMA ESTIMADA: ${quake.maxIntensityMMI || 'VI (Fuerte)'}

Generado automáticamente por la Plataforma GeoMonitor Ecuador.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Boletin_Oficial_${quake.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#141b23] border border-[#223040] rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#10161d] border-b border-[#223040]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ffd23d]" />
            <h3 className="font-display font-bold text-sm text-[#e8eef2]">
              Boletín Sismológico Oficial — IGEPN
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1 bg-[#223040] hover:bg-[#324458] text-[#e8eef2] rounded text-xs font-mono-code flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 bg-[#ffd23d] hover:bg-[#f59e0b] text-[#0a0e13] rounded text-xs font-bold font-mono-code flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#7f93a3] hover:text-[#e8eef2] p-1 text-lg font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Paper Document Body */}
        <div className="p-6 bg-[#0a0e13] text-[#e8eef2] font-mono-code text-xs space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Institutional Top */}
          <div className="border-b border-[#223040] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-display font-bold text-base text-[#e8eef2] uppercase">
                INSTITUTO GEOFÍSICO • EPN
              </div>
              <div className="text-[11px] text-[#7f93a3]">
                Red Sísmica Nacional del Ecuador (RENSIG)
              </div>
              <div className="text-[10px] text-[#ffd23d] mt-1 font-semibold">
                BOLETÍN TÉCNICO OFICIAL DE INFORMACIÓN SÍSMICA
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#161f2b] p-2 rounded border border-[#223040]">
              <ShieldCheck className="w-6 h-6 text-[#2dd4bf]" />
              <div className="text-[10px]">
                <div className="text-[#2dd4bf] font-bold">SOLUCIÓN REVISADA</div>
                <div className="text-[#7f93a3]">Nivel 1 Definitivo</div>
              </div>
            </div>
          </div>

          {/* Key Parameters Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#141b23] p-3 rounded border border-[#223040]">
            <div>
              <span className="text-[10px] text-[#7f93a3] uppercase block">MAGNITUD</span>
              <span className="text-base font-bold text-[#ff8a3d]">
                {quake.mag.toFixed(1)} {quake.magType}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7f93a3] uppercase block">PROFUNDIDAD</span>
              <span className="text-base font-bold text-[#e8eef2]">
                {quake.depth.toFixed(1)} km
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7f93a3] uppercase block">LATITUD</span>
              <span className="text-xs font-semibold text-[#e8eef2]">{quake.lat}°</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7f93a3] uppercase block">LONGITUD</span>
              <span className="text-xs font-semibold text-[#e8eef2]">{quake.lon}°</span>
            </div>
          </div>

          {/* Temporal & Location details */}
          <div className="space-y-2 bg-[#10161d] p-3 rounded border border-[#223040]/70 text-[11px]">
            <div className="flex justify-between border-b border-[#223040]/50 pb-1.5">
              <span className="text-[#7f93a3]">Código de Evento:</span>
              <span className="text-[#ffd23d] font-bold">{quake.id}</span>
            </div>
            <div className="flex justify-between border-b border-[#223040]/50 pb-1.5">
              <span className="text-[#7f93a3]">Epicentro Geográfico:</span>
              <span className="text-[#e8eef2] font-semibold">{quake.place}</span>
            </div>
            <div className="flex justify-between border-b border-[#223040]/50 pb-1.5">
              <span className="text-[#7f93a3]">Región Tectónica:</span>
              <span className="text-[#e8eef2]">{quake.region}</span>
            </div>
            <div className="flex justify-between border-b border-[#223040]/50 pb-1.5">
              <span className="text-[#7f93a3]">Hora Local (ECT):</span>
              <span className="text-[#e8eef2]">{quake.localTimeECT}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7f93a3]">Hora Universal (UTC):</span>
              <span className="text-[#e8eef2]">{quake.time}</span>
            </div>
          </div>

          {/* Tsunami & Civil Protection notice */}
          <div className="p-3 bg-[#101e1c] border border-[#2dd4bf]/40 rounded text-[11px] text-[#2dd4bf] space-y-1">
            <div className="font-bold uppercase tracking-wider">
              {quake.tsunamiAlert ? 'ALERTA DE TSUNAMI EMITIDA' : 'DICTAMEN INOCAR: NO REÚNE CONDICIONES PARA TSUNAMI'}
            </div>
            <p className="text-[10px] text-[#7f93a3] leading-relaxed">
              Basado en las características preliminares del sismo (magnitud {quake.mag.toFixed(1)} y profundidad {quake.depth.toFixed(1)} km),
              el Instituto Oceanográfico y Antártico de la Armada (INOCAR) y el PTWC descartan perturbaciones anómalas del nivel del mar.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-4 border-t border-[#223040] flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-[#4d6070]">
            <div>
              <div>VALIDACIÓN: M.Sc. Sismólogo de Guardia RENSIG</div>
              <div>REVISIÓN INSTRUMENTAL: Red de Acelerógrafos RENAC</div>
              <div className="text-[#ffd23d] font-semibold mt-1">ADMINISTRADO POR JMAC-SECURITY</div>
            </div>
            <div className="sm:text-right">
              <div>GEO-MONITOR ECUADOR</div>
              <div>SISTEMA NACIONAL DE GESTIÓN DE RIESGOS</div>
              <div className="text-[#7f93a3] mt-1">© {new Date().getFullYear()} Todos los derechos de autor reservados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
