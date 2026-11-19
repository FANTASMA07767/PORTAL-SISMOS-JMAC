import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, MapPin } from 'lucide-react';
import { Earthquake } from '../types/seismic';

interface CitizenReportModalProps {
  quake: Earthquake;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (intensity: string, city: string) => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  quake,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [city, setCity] = useState('Pedernales');
  const [intensity, setIntensity] = useState('V - Fuerte (Vajillas vibraron, objetos cayeron)');
  const [locationType, setLocationType] = useState('interior');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(intensity, city);
    setSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#141b23] border border-[#223040] rounded-xl p-5 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-[#223040]">
          <div>
            <h3 className="font-display font-bold text-base text-[#e8eef2]">
              ¿Sintió el Sismo? — Reporte Comunitario
            </h3>
            <span className="font-mono-code text-[11px] text-[#ff8a3d]">
              Evento: M {quake.mag.toFixed(1)} • {quake.place}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7f93a3] hover:text-[#e8eef2] p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
            <CheckCircle2 className="w-14 h-14 text-[#2dd4bf] animate-bounce" />
            <h4 className="font-display font-bold text-lg text-[#e8eef2]">
              ¡Reporte Geofísico Validado!
            </h4>
            <p className="font-sans-body text-xs text-[#7f93a3] max-w-sm">
              Su percepción en <strong>{city}</strong> ha sido integrada al cálculo
              instrumental de intensidad Mercalli (ShakeMap) del IGEPN.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-mono-code text-xs">
            <div>
              <label className="block text-[#7f93a3] text-[10px] uppercase mb-1">
                Ciudad / Cantón donde se encontraba:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#ffd23d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-[#0a0e13] border border-[#223040] rounded-lg py-2 pl-9 pr-3 text-[#e8eef2] focus:border-[#ff5a36] outline-none"
                  placeholder="Ej. Pedernales, Quito, Manta, Guayaquil..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[#7f93a3] text-[10px] uppercase mb-1">
                ¿Dónde se encontraba durante el movimiento?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLocationType('interior')}
                  className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                    locationType === 'interior'
                      ? 'bg-[#223040] border-[#ff5a36] text-[#ffd23d]'
                      : 'bg-[#0a0e13] border-[#223040] text-[#7f93a3]'
                  }`}
                >
                  Dentro de edificación (Piso 1-4)
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('exterior')}
                  className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                    locationType === 'exterior'
                      ? 'bg-[#223040] border-[#ff5a36] text-[#ffd23d]'
                      : 'bg-[#0a0e13] border-[#223040] text-[#7f93a3]'
                  }`}
                >
                  Al aire libre / En vehículo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#7f93a3] text-[10px] uppercase mb-1">
                Grado de Percepción e Intensidad (Escala Mercalli):
              </label>
              <select
                value={intensity}
                onChange={e => setIntensity(e.target.value)}
                className="w-full bg-[#0a0e13] border border-[#223040] rounded-lg p-2.5 text-[#e8eef2] focus:border-[#ff5a36] outline-none"
              >
                <option value="II - Leve">II - Muy débil (Sentido sólo en reposo)</option>
                <option value="III - Leve / Ondulado">III - Leve (Vibración similar a camión liviano)</option>
                <option value="IV - Moderado">IV - Moderado (Ventanas y puertas crujieron)</option>
                <option value="V - Fuerte (Vajillas vibraron)">V - Fuerte (Objetos cayeron, cuadros oscilaron)</option>
                <option value="VI - Muy Fuerte (Dificultad para caminar)">VI - Muy Fuerte (Dificultad para mantenerse en pie)</option>
                <option value="VII - Destructivo">VII - Destructivo (Grietas en mampostería)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#223040] hover:bg-[#324458] text-[#e8eef2]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#ff5a36] hover:bg-[#ff704d] text-[#0a0e13] font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Percepción</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
