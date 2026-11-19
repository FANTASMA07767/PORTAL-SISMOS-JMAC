import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Radio,
  Globe,
  Waves,
  Activity,
  CheckCircle2,
  Info,
  HelpCircle,
  FileText,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface SeismicSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SourceCard {
  id: string;
  name: string;
  fullName: string;
  country: string;
  badge: string;
  color: string;
  description: string;
  url: string;
  coverage: string;
  dataTypes: string[];
  latency: string;
}

const OFFICIAL_SOURCES: SourceCard[] = [
  {
    id: 'igepn',
    name: 'IGEPN',
    fullName: 'Instituto Geofísico de la Escuela Politécnica Nacional',
    country: 'Ecuador',
    badge: 'Fuente Primaria Nacional',
    color: '#ffd23d',
    description:
      'Institución rectora del monitoreo sísmico y volcánico en Ecuador. Opera la Red Nacional de Sismógrafos (RENSIG) y la Red Nacional de Acelerógrafos (RENAC), generando los informes sismológicos oficiales y boletines de intensidad instrumental.',
    url: 'https://www.igepn.edu.ec',
    coverage: 'Ecuador Continental e Insular (Galápagos)',
    dataTypes: ['RENSIG Banda Ancha', 'RENAC Aceleración', 'Vigilancia Volcánica', 'ShakeMap Oficial'],
    latency: '< 60 segundos',
  },
  {
    id: 'usgs',
    name: 'USGS',
    fullName: 'United States Geological Survey - Earthquake Hazards Program',
    country: 'Estados Unidos / Global',
    badge: 'Referencia Global',
    color: '#ff8a3d',
    description:
      'Líder mundial en sismología cuantitativa. Provee soluciones globales de momento tensor de centroide (W-phase Mww), el catálogo unificado ComCat, estimaciones de pérdidas económicas PAGER y monitoreo de la zona de subducción sudamericana.',
    url: 'https://earthquake.usgs.gov',
    coverage: 'Global / Cuenca del Pacífico',
    dataTypes: ['GeoJSON Real-time', 'ComCat API', 'ShakeMap v4', 'PAGER Damage Model'],
    latency: '1 - 3 minutos',
  },
  {
    id: 'emsc',
    name: 'EMSC - CSEM',
    fullName: 'European-Mediterranean Seismological Centre',
    country: 'Europa / Internacional',
    badge: 'Testimonio Ciudadano',
    color: '#a78bfa',
    description:
      'Red pionera en sismología ciudadana mediante la plataforma "LastQuake". Detecta sismos en segundos analizando la concentración instantánea de tráfico en internet y recolecta cientos de miles de cuestionarios macrosísmicos.',
    url: 'https://www.emsc-csem.org',
    coverage: 'Global con alta densidad en Europa y Sudamérica',
    dataTypes: ['LastQuake App Feed', 'Intensidades Ciudadanas', 'QuakeML API'],
    latency: '< 30 segundos',
  },
  {
    id: 'iris',
    name: 'IRIS / EarthScope',
    fullName: 'Incorporated Research Institutions for Seismology & EarthScope',
    country: 'Internacional',
    badge: 'Repositorio Científico',
    color: '#5b8def',
    description:
      'El mayor archivo global de formas de onda sismológicas. Almacena trazas en formato SAC y miniSEED para estaciones de banda ancha (incluyendo OTAV en Imbabura y PAYG en Galápagos) para modelado de fuentes profundas.',
    url: 'https://www.iris.edu',
    coverage: 'Red Mundial FDSN',
    dataTypes: ['SeedLink Streaming', 'Trazas miniSEED', 'Filtros P/S', 'Modelos PREM'],
    latency: 'Sub-segundo (SeedLink)',
  },
  {
    id: 'isc',
    name: 'ISC',
    fullName: 'International Seismological Centre',
    country: 'Reino Unido / Global',
    badge: 'Catálogo Definitivo',
    color: '#34d399',
    description:
      'Organización intergubernamental sin fines de lucro encargada de elaborar el Boletín Internacional y el catálogo sismológico revisado y relocalizado más preciso del planeta, combinando datos de más de 130 países.',
    url: 'http://www.isc.ac.uk',
    coverage: 'Catálogo Histórico e Instrumental Global',
    dataTypes: ['ISC-GEM Global Catalog', 'Boletines Relocalizados', 'Mecanismos Focales'],
    latency: 'Revisión científica mensual',
  },
  {
    id: 'ptwc',
    name: 'NOAA / PTWC',
    fullName: 'Pacific Tsunami Warning Center & Inocar Ecuador',
    country: 'Estados Unidos / Ecuador',
    badge: 'Alerta de Maremotos',
    color: '#38bdf8',
    description:
      'Centro coordinador de alertas de tsunami en la cuenca del Pacífico. En conjunto con el INOCAR (Instituto Oceanográfico y Antártico de la Armada del Ecuador), monitorea la red de boyas de presión oceánica DART y mareógrafos costeros.',
    url: 'https://www.tsunami.gov',
    coverage: 'Océano Pacífico y Costas Ecuatorianas',
    dataTypes: ['Boyas DART II/III', 'Boletines de Tsunami', 'Tiempos de Viaje Onda Marina'],
    latency: '3 - 5 minutos tras el sismo',
  },
  {
    id: 'sngre',
    name: 'SNGRE',
    fullName: 'Secretaría de Gestión de Riesgos del Ecuador',
    country: 'Ecuador',
    badge: 'Protección Civil',
    color: '#f43f5e',
    description:
      'Organismo del Estado ecuatoriano para la prevención, mitigación y respuesta ante desastres geodinámicos. Administra el Sistema de Alerta Temprana (SAT) con 178 sirenas en las provincias de Esmeraldas, Manabí, Santa Elena y Guayas.',
    url: 'https://www.gestionderiesgos.gob.ec',
    coverage: 'Perfil Costero y Zonas de Riesgo Volcánico',
    dataTypes: ['Red de Sirenas SAT', 'Cartas de Inundación', 'Protocolos Evacuación'],
    latency: 'Activación satelital instantánea',
  },
];

export const SeismicSourcesModal: React.FC<SeismicSourcesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'glossary' | 'protocols' | 'security'>('sources');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#10161d] border border-[#223040] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#141b23] px-5 py-4 border-b border-[#223040] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5a36]/15 border border-[#ff5a36]/40 flex items-center justify-center text-[#ff8a3d]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-[#e8eef2]">
                  Centro de Información Sísmica & Fuentes Oficiales
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-[#1e293b] text-[#ffd23d] border border-[#334155]">
                  GEOMONITOR ECUADOR
                </span>
              </div>
              <p className="text-xs text-[#7f93a3] font-mono-code">
                Bases de datos geofísicas verificadas, glosario científico y protocolos administrados por JMAC-SECURITY
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1c2734] hover:bg-[#28384b] text-[#7f93a3] hover:text-[#e8eef2] flex items-center justify-center transition-colors text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#223040] bg-[#0c1015] px-4 pt-2 gap-1 overflow-x-auto text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sources'
                ? 'border-[#ff5a36] text-[#ff8a3d] bg-[#141b23]/50'
                : 'border-transparent text-[#7f93a3] hover:text-[#e8eef2]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Fuentes de Datos Oficiales ({OFFICIAL_SOURCES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'border-[#ff5a36] text-[#ff8a3d] bg-[#141b23]/50'
                : 'border-transparent text-[#7f93a3] hover:text-[#e8eef2]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Glosario Sísmico Científico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protocols')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'protocols'
                ? 'border-[#ff5a36] text-[#ff8a3d] bg-[#141b23]/50'
                : 'border-transparent text-[#7f93a3] hover:text-[#e8eef2]'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            Guía de Alerta & Tsunami
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#ff5a36] text-[#ff8a3d] bg-[#141b23]/50'
                : 'border-transparent text-[#7f93a3] hover:text-[#e8eef2]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
            JMAC-SECURITY & Derechos
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: Fuentes Oficiales */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div className="bg-[#141b23] p-3.5 rounded-xl border border-[#223040] flex items-start gap-3 text-xs text-[#a0b0be]">
                <Info className="w-4 h-4 text-[#ffd23d] shrink-0 mt-0.5" />
                <p>
                  GeoMonitor Ecuador integra de forma cruzada catálogos de sensores de banda ancha y acelerógrafos
                  mediante protocolos estándar FDSN (Federation of Digital Seismograph Networks). Todas las fuentes son
                  científicamente reconocidas a nivel internacional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {OFFICIAL_SOURCES.map(source => (
                  <div
                    key={source.id}
                    className="bg-[#121922] border border-[#223040] rounded-xl p-4 flex flex-col justify-between hover:border-[#384c63] transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-display font-bold text-base px-2 py-0.5 rounded text-[#0a0e13]"
                            style={{ backgroundColor: source.color }}
                          >
                            {source.name}
                          </span>
                          <span className="font-mono-code text-[11px] text-[#7f93a3]">{source.country}</span>
                        </div>
                        <span className="font-mono-code text-[10px] px-2 py-0.5 rounded bg-[#1c2734] border border-[#2d3f54] text-[#ffd23d]">
                          {source.badge}
                        </span>
                      </div>

                      <h4 className="font-display font-semibold text-xs text-[#e8eef2] mb-1.5">
                        {source.fullName}
                      </h4>

                      <p className="text-[11px] text-[#8ea1b2] leading-relaxed mb-3">
                        {source.description}
                      </p>

                      <div className="space-y-1.5 text-[10px] font-mono-code bg-[#0a0e13]/60 p-2.5 rounded-lg border border-[#1e2a37]">
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Cobertura:</span>
                          <span className="text-[#cbd5e1]">{source.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Latencia Telemetría:</span>
                          <span className="text-[#2dd4bf] font-bold">{source.latency}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {source.dataTypes.map((dt, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded bg-[#141b23] border border-[#223040] text-[#93c5fd] text-[9px]"
                            >
                              {dt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#1e2a37] flex items-center justify-between">
                      <span className="text-[10px] font-mono-code text-[#475569] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2dd4bf]" /> Enlace Oficial Verificado
                      </span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#1e293b] hover:bg-[#334155] text-[#ffd23d] rounded text-xs font-mono-code font-semibold transition-colors"
                      >
                        <span>Visitar Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Glosario Sísmico */}
          {activeTab === 'glossary' && (
            <div className="space-y-3 font-mono-code text-xs">
              <div className="bg-[#121922] p-4 rounded-xl border border-[#223040] space-y-3">
                <div className="flex items-center gap-2 text-[#ffd23d]">
                  <HelpCircle className="w-4 h-4" />
                  <h3 className="font-display font-bold text-sm text-[#e8eef2]">
                    Conceptos Científicos Fundamentales
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#ff5a36] font-bold">Magnitud vs. Intensidad</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      La <strong>Magnitud (Mw)</strong> cuantifica el tamaño del sismo en términos de energía
                      física liberada en el foco (un solo valor por evento). La <strong>Intensidad (MMI)</strong>{' '}
                      mide los efectos y aceleraciones percibidas en la superficie en un sitio determinado (varía
                      según la distancia y el suelo).
                    </p>
                  </div>

                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#2dd4bf] font-bold">Ondas P (Primarias)</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      Ondas longitudinales compresionales. Son las más veloces (viajan a ~6 - 8 km/s en la corteza
                      andina) y las primeras registradas por sismógrafos como OTAVALO. Hacen posible la{' '}
                      <strong>alerta temprana</strong> antes de la llegada de las destructivas ondas S.
                    </p>
                  </div>

                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#ffd23d] font-bold">Ondas S (Secundarias / Cizalla)</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      Ondas transversales de cizallamiento (viajan a ~3.5 - 4.5 km/s). No se propagan a través de
                      líquidos. Provocan la mayor parte del daño estructural y el pico de aceleración máxima (PGA).
                    </p>
                  </div>

                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#a78bfa] font-bold">Algoritmo STA/LTA (Detector)</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      Relación entre el promedio de energía de corto plazo (Short-Term Average, ~0.5s) y el promedio
                      de largo plazo (Long-Term Average, ~30s). Cuando STA/LTA supera el umbral crítico (3.5 - 4.0),
                      el detector declara automáticamente el inicio de un evento sísmico.
                    </p>
                  </div>

                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#38bdf8] font-bold">Fosa de Subducción Ecuador-Colombia</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      Contacto tectónico donde la placa oceánica de Nazca se sumerge bajo la placa Sudamericana a
                      una tasa aproximada de 54 - 60 mm/año. Es la fuente de los grandes megaterremotos costeros (1906,
                      1942, 1958, 1979, 2016).
                    </p>
                  </div>

                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#f43f5e] font-bold">Aceleración Pico del Suelo (PGA)</span>
                    </div>
                    <p className="text-[11px] text-[#8ea1b2] leading-relaxed">
                      Máxima aceleración del terreno registrada durante el sismo, expresada como fracción de la gravedad
                      terrestre (g). Valores &gt; 0.15g pueden causar agrietamientos y daños moderados a severos en
                      edificaciones no sismorresistentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Guía de Tsunami y Alerta Temprana */}
          {activeTab === 'protocols' && (
            <div className="space-y-4 font-mono-code text-xs">
              <div className="bg-[#121922] p-4 rounded-xl border border-[#223040] space-y-3">
                <div className="flex items-center gap-2 text-[#ff5a36]">
                  <Waves className="w-4 h-4" />
                  <h3 className="font-display font-bold text-sm text-[#e8eef2]">
                    Protocolos Oficiales de Protección Civil (SNGRE / INOCAR)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37] text-center">
                    <div className="text-xl font-bold text-[#ffd23d] mb-1">1. AGACHARSE</div>
                    <p className="text-[11px] text-[#7f93a3]">
                      Evita caídas. Protégete bajo un mueble sólido o junto a una columna estructural.
                    </p>
                  </div>
                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37] text-center">
                    <div className="text-xl font-bold text-[#ff8a3d] mb-1">2. CUBRIRSE</div>
                    <p className="text-[11px] text-[#7f93a3]">
                      Cubre cabeza y cuello con ambos brazos. Aléjate de ventanas, repisas y cableado eléctrico.
                    </p>
                  </div>
                  <div className="bg-[#0a0e13] p-3 rounded-lg border border-[#1e2a37] text-center">
                    <div className="text-xl font-bold text-[#ff3b30] mb-1">3. SUJETARSE</div>
                    <p className="text-[11px] text-[#7f93a3]">
                      Mantén la posición hasta que el movimiento cese por completo antes de evacuar ordenadamente.
                    </p>
                  </div>
                </div>

                <div className="bg-[#1e1b18] border border-[#ff8a3d]/30 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#ff8a3d] font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Regla de Oro en Zonas Costeras (Esmeraldas, Manabí, Santa Elena, Guayas, El Oro):</span>
                  </div>
                  <p className="text-[#d5d5d5] text-[11px] leading-relaxed">
                    Si sientes un sismo fuerte que te impide mantenerte en pie, o dura más de 20 segundos, no
                    esperes una sirena oficial: <strong>evacúa de inmediato a pie hacia zonas altas (&gt; 30 m sobre el nivel del mar)</strong> o al menos a 1 km tierra adentro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JMAC-SECURITY & Derechos */}
          {activeTab === 'security' && (
            <div className="space-y-4 font-mono-code text-xs">
              <div className="bg-[#121922] p-5 rounded-xl border border-[#223040] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/15 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#e8eef2]">
                      Infraestructura y Administración JMAC-SECURITY
                    </h3>
                    <p className="text-xs text-[#2dd4bf]">
                      Ciberseguridad Geofísica & Monitoreo de Infraestructuras Críticas
                    </p>
                  </div>
                </div>

                <div className="bg-[#0a0e13] p-4 rounded-xl border border-[#1e2a37] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1e2a37]">
                    <span className="text-[#7f93a3]">Administrador General:</span>
                    <span className="text-[#ffd23d] font-bold text-sm">JMAC-SECURITY</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#1e2a37]">
                    <span className="text-[#7f93a3]">Protección y Propiedad Intelectual:</span>
                    <span className="text-[#e8eef2] font-semibold">Derechos de Autor Registrados</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#1e2a37]">
                    <span className="text-[#7f93a3]">Licencia de Datos Sísmicos:</span>
                    <span className="text-[#2dd4bf]">Uso Científico, Académico y de Protección Civil</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#1e2a37]">
                    <span className="text-[#7f93a3]">Protocolo de Cifrado:</span>
                    <span className="text-[#93c5fd]">TLS 1.3 / SHA-256 Telemetry Pipeline</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7f93a3]">Estado de la Plataforma:</span>
                    <span className="inline-flex items-center gap-1.5 text-[#2dd4bf] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
                      OPERATIVO 24/7 SIN INTERRUPCIÓN
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#8ea1b2] leading-relaxed">
                  GeoMonitor Ecuador opera bajo la supervisión tecnológica de <strong>JMAC-SECURITY</strong>,
                  garantizando la disponibilidad ininterrumpida de las alertas tempranas, la integridad criptográfica
                  de las trazas telemétricas y la resiliencia ante contingencias de red nacional. Todos los derechos
                  de autor de la interfaz, arquitectura de procesamiento y algoritmos de visualización están
                  plenamente protegidos.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#141b23] px-5 py-3 border-t border-[#223040] flex items-center justify-between font-mono-code text-xs">
          <div className="flex items-center gap-2 text-[#7f93a3] text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#ffd23d]" />
            <span>GeoMonitor Ecuador © {new Date().getFullYear()} • Administrado por JMAC-SECURITY</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#ff5a36] hover:bg-[#ff7354] text-[#0a0e13] font-bold text-xs transition-colors shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
