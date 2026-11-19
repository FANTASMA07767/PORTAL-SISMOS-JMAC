import { Earthquake, VolcanoMonitor, HistoricMegathrust, SeismicGap, EarlyWarningCity, SirenZone, TelemetryStation } from '../types/seismic';

export const INITIAL_EARTHQUAKES: Earthquake[] = [
  {
    id: 'IGEPN-2025-0488A',
    mag: 5.8,
    magType: 'Mw',
    place: '42 km al O de Esmeraldas',
    region: 'Costa Manabí - Esmeraldas (Interplaca)',
    depth: 12.0,
    time: '2025-02-28T14:04:12Z',
    localTimeECT: '09:04:12 ECT (Hace 18m)',
    lat: 0.98,
    lon: -79.95,
    source: 'IGEPN',
    status: 'DEFINITIVO',
    maxIntensityMMI: 'V (Fuerte)',
    feltReportsCount: 3428,
    pgaG: 0.182,
    tsunamiAlert: false,
    tsunamiMessage: 'NO GENERA ALERTA DE TSUNAMI • Evaluación conjunta INOCAR / PTWC',
    coordinatesString: '0.98° N, 79.95° O'
  },
  {
    id: 'USGS-2025-0224P',
    mag: 4.8,
    magType: 'mb',
    place: '18 km al NE de Pedernales, Manabí',
    region: 'Margen Costero Central',
    depth: 22.4,
    time: '2025-02-28T12:22:00Z',
    localTimeECT: '07:22 ECT (Hace 2h)',
    lat: 0.05,
    lon: -80.02,
    source: 'USGS',
    status: 'REVISADO',
    maxIntensityMMI: 'IV (Moderado)',
    feltReportsCount: 840,
    pgaG: 0.065,
    tsunamiAlert: false,
    coordinatesString: '0.05° N, 80.02° O'
  },
  {
    id: 'EMSC-2025-9921G',
    mag: 4.4,
    magType: 'MLv',
    place: 'Golfo de Guayaquil, Isla Puná',
    region: 'Falla Puná - Golfo de Guayaquil',
    depth: 38.0,
    time: '2025-02-28T09:15:00Z',
    localTimeECT: '04:15 ECT (Hace 5h)',
    lat: -2.82,
    lon: -80.28,
    source: 'EMSC',
    status: 'REVISADO',
    maxIntensityMMI: 'III (Leve)',
    feltReportsCount: 420,
    pgaG: 0.038,
    tsunamiAlert: false,
    coordinatesString: '2.82° S, 80.28° O'
  },
  {
    id: 'IGEPN-2025-0487P',
    mag: 3.9,
    magType: 'ML',
    place: '25 km al E de Puyo, Pastaza',
    region: 'Losa Nazca Subducida (Subandino)',
    depth: 142.1,
    time: '2025-02-28T06:48:00Z',
    localTimeECT: '01:48 ECT (Hace 7h)',
    lat: -1.49,
    lon: -77.78,
    source: 'IGEPN',
    status: 'REVISADO',
    maxIntensityMMI: 'II (Imperceptible)',
    feltReportsCount: 15,
    pgaG: 0.008,
    tsunamiAlert: false,
    coordinatesString: '1.49° S, 77.78° O'
  },
  {
    id: 'IGEPN-2025-0486Q',
    mag: 3.1,
    magType: 'ML',
    place: 'Quito Norte, Pichincha',
    region: 'Falla Inversa Quito (Cortical)',
    depth: 6.2,
    time: '2025-02-27T22:11:00Z',
    localTimeECT: 'Ayer 22:11 ECT',
    lat: -0.15,
    lon: -78.48,
    source: 'IGEPN',
    status: 'REVISADO',
    maxIntensityMMI: 'III (Sentido Leve)',
    feltReportsCount: 680,
    pgaG: 0.024,
    tsunamiAlert: false,
    coordinatesString: '0.15° S, 78.48° O'
  },
  {
    id: 'USGS-2025-0199G',
    mag: 3.8,
    magType: 'ML',
    place: 'Isla Isabela, Galápagos',
    region: 'Punto Caliente Galápagos / Caldera Sierra Negra',
    depth: 8.0,
    time: '2025-02-27T19:30:00Z',
    localTimeECT: 'Ayer 19:30 ECT',
    lat: -0.82,
    lon: -91.13,
    source: 'USGS',
    status: 'REVISADO',
    maxIntensityMMI: 'II (Local)',
    feltReportsCount: 4,
    pgaG: 0.012,
    tsunamiAlert: false,
    coordinatesString: '0.82° S, 91.13° O'
  },
  {
    id: 'IGEPN-2025-0485M',
    mag: 2.9,
    magType: 'ML',
    place: 'Macas, Morona Santiago',
    region: 'Zona Wadati-Benioff',
    depth: 85.0,
    time: '2025-02-27T14:10:00Z',
    localTimeECT: 'Ayer 09:10 ECT',
    lat: -2.31,
    lon: -78.12,
    source: 'IGEPN',
    status: 'AUTOMÁTICO',
    maxIntensityMMI: 'I (Instrumental)',
    feltReportsCount: 0,
    coordinatesString: '2.31° S, 78.12° O'
  }
];

export const TELEMETRY_STATIONS: TelemetryStation[] = [
  {
    code: 'PEDE',
    name: 'Pedernales Centro',
    lat: 0.07,
    lon: -80.05,
    distKm: 41.2,
    residualSec: 0.04,
    snrDb: 42,
    status: 'ACTIVE'
  },
  {
    code: 'OTAV',
    name: 'Otavalo (USGS/RENSIG)',
    lat: 0.23,
    lon: -78.26,
    distKm: 178.6,
    residualSec: -0.08,
    snrDb: 36,
    status: 'ACTIVE'
  },
  {
    code: 'GYEC',
    name: 'Guayaquil Espol',
    lat: -2.15,
    lon: -79.96,
    distKm: 242.1,
    residualSec: 0.12,
    snrDb: 29,
    status: 'ACTIVE'
  },
  {
    code: 'PAYG',
    name: 'Galápagos / Puerto Ayora',
    lat: -0.74,
    lon: -90.31,
    distKm: 986.3,
    residualSec: 0.21,
    snrDb: 22,
    status: 'ACTIVE'
  }
];

export const VOLCANOES_DATA: VolcanoMonitor[] = [
  {
    id: 'cotopaxi',
    name: 'Cotopaxi',
    altMeters: 5897,
    alertLevel: 'AMARILLA',
    alertLabel: 'ALERTA AMARILLA',
    statusSubtitle: 'Tremor de emisión continuo',
    lat: -0.677,
    lon: -78.436,
    vtQuakes24h: 14,
    lpQuakes24h: 82,
    so2TonsDay: 1120,
    tremorText: 'Emisión continua de vapor y gases con carga baja de ceniza',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-195977935cf1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sangay',
    name: 'Sangay',
    altMeters: 5286,
    alertLevel: 'ROJA',
    alertLabel: 'ERUPCIÓN CONTINUA',
    statusSubtitle: 'Flujos piroclásticos SE',
    lat: -2.005,
    lon: -78.341,
    vtQuakes24h: 18,
    lpQuakes24h: 96,
    so2TonsDay: 2450,
    explosions24h: 342,
    ashColumnKm: 1.8,
    dispersionZone: 'Chimborazo / Guayas',
    tremorText: 'Explosiones estrombolianas constantes y descenso de piroclastos',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'reventador',
    name: 'Reventador',
    altMeters: 3562,
    alertLevel: 'NARANJA',
    alertLabel: 'ALTA ACTIVIDAD',
    statusSubtitle: 'Lava en flanco N-NE',
    lat: -0.077,
    lon: -77.656,
    vtQuakes24h: 22,
    lpQuakes24h: 68,
    so2TonsDay: 840,
    explosions24h: 48,
    tremorText: 'Temblores armónicos 3.4 h acum. • Afectación OCP: Bajo Riesgo Inmediato',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pichincha',
    name: 'G. Pichincha',
    altMeters: 4784,
    alertLevel: 'VERDE',
    alertLabel: 'NIVEL VERDE (REPOSO)',
    statusSubtitle: 'Línea de base normal',
    lat: -0.171,
    lon: -78.598,
    vtQuakes24h: 2,
    lpQuakes24h: 5,
    so2TonsDay: 45,
    fumaroleTemp: '74°C Estable',
    gnssDeformMm: 0.0,
    tremorText: 'Sismicidad de fractura mínima (2/sem). Domo Cristal estable sin inflación.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'
  }
];

export const HISTORICAL_MEGATHRUSTS: HistoricMegathrust[] = [
  {
    id: '1906',
    date: '31 Enero 1906',
    location: 'Esmeraldas - Tumaco',
    mag: 8.8,
    magType: 'Mw',
    tag: 'TSUNAMI PACÍFICO',
    tagColor: '#ff8a3d',
    description: 'Ruptura de ~500 km del megathrust costero. Uno de los 7 terremotos más grandes registrados en la historia de la humanidad. Generó olas de tsunami de hasta 5 metros que cruzaron el Pacífico.',
    ruptureKm: 500,
    slipMeters: 8.5
  },
  {
    id: '1949',
    date: '5 Agosto 1949',
    location: 'Ambato - Pelileo',
    mag: 6.8,
    magType: 'Ms',
    tag: 'FALLA CORTICAL ANDINA',
    tagColor: '#ff3b30',
    description: 'Evento intraplaca somero a lo largo del sistema de fallas inversas del callejón interandino. Destrucción total de Pelileo, licuefacción masiva y colapso de infraestructura en Tungurahua.',
    depthKm: 15,
    fatalities: '>5,000 víctimas fatales'
  },
  {
    id: '1987',
    date: '5 Marzo 1987',
    location: 'Cordillera Real (Reventador)',
    mag: 7.1,
    magType: 'Mw',
    tag: 'DESLIZAMIENTOS MASIVOS',
    tagColor: '#ffd23d',
    description: 'Duplete sísmico en el frente de cabalgamiento subandino. Disparó la mayor catástrofe por deslaves en la cuenca del Río Quijos y cortó el Oleoducto Transecuatoriano (SOTE) por meses.',
    ruptureKm: 45,
    fatalities: '~1,000 víctimas por flujo de lodo'
  },
  {
    id: '2016',
    date: '16 Abril 2016',
    location: 'Pedernales - Manabí',
    mag: 7.8,
    magType: 'Mw',
    tag: 'RUPTURA PARCIAL 1906',
    tagColor: '#ff5a36',
    description: 'Ruptura de aspereza interplaca a 20 km de profundidad. Ruptura de parche acoplado frente al cabo Pasado. Desplazó la línea costera varios centímetros y activó réplicas por más de 12 meses.',
    ruptureKm: 100,
    slipMeters: 3.2
  }
];

export const SEISMIC_GAPS: SeismicGap[] = [
  {
    id: 'gap-1',
    name: 'Esmeraldas Norte (Frontera Col.)',
    status: 'Liberado en 1979 (Mw 8.2)',
    isLocked: false,
    color: '#2dd4bf',
    percentage: 85
  },
  {
    id: 'gap-2',
    name: 'Pedernales - Bahía de Caráquez',
    status: 'Liberado en 2016 (Mw 7.8)',
    isLocked: false,
    color: '#35c7a6',
    percentage: 92
  },
  {
    id: 'gap-3',
    name: 'Bahía de Caráquez - Manta - La Plata',
    status: 'BRECHA ACTIVA (Sin ruptura >80a)',
    isLocked: true,
    color: '#ff3b30',
    percentage: 100
  },
  {
    id: 'gap-4',
    name: 'Golfo de Guayaquil / Puná',
    status: 'Eventos moderados 2023 (Mw 6.8)',
    isLocked: false,
    color: '#ffd23d',
    percentage: 70
  }
];

export const EARLY_WARNING_CITIES: EarlyWarningCity[] = [
  {
    city: 'Manta',
    tag: 'EPICENTRAL',
    tagColor: '#ff3b30',
    sWaveSec: 11,
    distKm: 42,
    effect: 'Sirenas SAT',
    effectNote: '18 Operativas',
    sirensActive: 18
  },
  {
    city: 'Portoviejo',
    tag: 'MUY CERCA',
    tagColor: '#ff8a3d',
    sWaveSec: 19,
    distKm: 71,
    effect: 'Riesgo Licuefacción',
    effectNote: 'Muy Alto'
  },
  {
    city: 'Guayaquil',
    tag: 'SUELO BLANDO',
    tagColor: '#ffd23d',
    sWaveSec: 48,
    distKm: 178,
    effect: 'Efecto de Sitio',
    effectNote: 'Amplificación x3.2'
  },
  {
    city: 'Quito DM',
    tag: 'INTERANDINO',
    tagColor: '#5b8def',
    sWaveSec: 67,
    distKm: 245,
    effect: 'Alerta Temprana',
    effectNote: 'Ventana Útil'
  },
  {
    city: 'Cuenca',
    tag: 'ROCA ANDINA',
    tagColor: '#2dd4bf',
    sWaveSec: 76,
    distKm: 285,
    effect: 'Atenuación',
    effectNote: 'Muy Favorable'
  }
];

export const SIREN_ZONES: SirenZone[] = [
  { name: 'ESMERALDAS', active: 37, total: 37, detail: 'Tono Inambú + Bocinas OK' },
  { name: 'MANABÍ', active: 61, total: 62, detail: '1 en mant. fotovoltaico' },
  { name: 'SANTA ELENA', active: 29, total: 29, detail: 'Salinas / Ayangue 100%' },
  { name: 'GUAYAS / EL ORO', active: 47, total: 50, detail: 'Canal Jambelí bajo prueba' }
];
