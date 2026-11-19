export type SeismicSource = 'IGEPN' | 'USGS' | 'EMSC' | 'PB2002';

export interface Earthquake {
  id: string;
  mag: number;
  magType: string;
  place: string;
  region: string;
  depth: number;
  time: string;
  localTimeECT: string;
  lat: number;
  lon: number;
  source: SeismicSource;
  status: 'REVISADO' | 'DEFINITIVO' | 'AUTOMÁTICO';
  maxIntensityMMI?: string;
  feltReportsCount?: number;
  pgaG?: number;
  tsunamiAlert?: boolean;
  tsunamiMessage?: string;
  url?: string;
  coordinatesString?: string;
}

export interface TelemetryStation {
  code: string;
  name: string;
  lat: number;
  lon: number;
  distKm: number;
  residualSec: number;
  snrDb: number;
  status: 'ACTIVE' | 'CALIBRATING' | 'OFFLINE';
}

export interface VolcanoMonitor {
  id: string;
  name: string;
  altMeters: number;
  alertLevel: 'VERDE' | 'AMARILLA' | 'NARANJA' | 'ROJA';
  alertLabel: string;
  statusSubtitle: string;
  lat: number;
  lon: number;
  vtQuakes24h: number; // Fractura
  lpQuakes24h: number; // Fluidos
  so2TonsDay: number;
  tremorText: string;
  explosions24h?: number;
  ashColumnKm?: number;
  dispersionZone?: string;
  fumaroleTemp?: string;
  gnssDeformMm?: number;
  imageUrl: string;
}

export interface HistoricMegathrust {
  id: string;
  date: string;
  location: string;
  mag: number;
  magType: string;
  tag: string;
  tagColor: string;
  description: string;
  ruptureKm?: number;
  slipMeters?: number;
  depthKm?: number;
  fatalities?: string;
}

export interface SeismicGap {
  id: string;
  name: string;
  status: string;
  isLocked: boolean;
  color: string;
  percentage: number;
}

export interface EarlyWarningCity {
  city: string;
  tag: string;
  tagColor: string;
  sWaveSec: number;
  distKm: number;
  effect: string;
  effectNote: string;
  sirensActive?: number;
}

export interface SirenZone {
  name: string;
  active: number;
  total: number;
  detail: string;
}
