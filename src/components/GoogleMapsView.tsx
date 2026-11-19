import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Earthquake, VolcanoMonitor } from '../types/seismic';
import { VOLCANOES_DATA } from '../data/mockData';
import { getDepthColor } from '../services/seismicApi';
import { Activity, Flame, ExternalLink } from 'lucide-react';

interface GoogleMapsViewProps {
  earthquakes: Earthquake[];
  selectedQuake: Earthquake | null;
  onSelectQuake: (q: Earthquake) => void;
  scope: 'ecuador' | 'latam';
  layers: {
    trench: boolean;
    faults: boolean;
    volcanoes: boolean;
    gnss: boolean;
  };
  mapType: 'hybrid' | 'terrain' | 'roadmap';
  onOpenEventDetail?: (q: Earthquake) => void;
}

// Controller to handle programmatic camera pan/zoom smoothly
const MapCameraController: React.FC<{
  selectedQuake: Earthquake | null;
  scope: 'ecuador' | 'latam';
}> = ({ selectedQuake, scope }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedQuake) {
      map.panTo({ lat: selectedQuake.lat, lng: selectedQuake.lon });
      const currentZoom = map.getZoom() || 6;
      if (currentZoom < 8) {
        map.setZoom(8);
      }
    } else {
      if (scope === 'ecuador') {
        map.panTo({ lat: -1.2, lng: -79.8 });
        map.setZoom(6);
      } else {
        map.panTo({ lat: -12.0, lng: -77.0 });
        map.setZoom(4);
      }
    }
  }, [map, selectedQuake, scope]);

  return null;
};

// Tectonic Overlays (Subduction Trench & Faults polylines) on Google Maps
const TectonicOverlays: React.FC<{
  showTrench: boolean;
  showFaults: boolean;
}> = ({ showTrench, showFaults }) => {
  const map = useMap();
  const trenchPolylineRef = useRef<google.maps.Polyline | null>(null);
  const carnegiePolylineRef = useRef<google.maps.Polyline | null>(null);
  const faultPolylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Fosa de Subducción Ecuador-Perú coordinates
    const trenchCoords = [
      { lat: 2.5, lng: -81.0 },
      { lat: 1.2, lng: -81.4 },
      { lat: 0.2, lng: -81.6 },
      { lat: -1.0, lng: -81.8 },
      { lat: -2.2, lng: -81.9 },
      { lat: -3.5, lng: -81.7 },
      { lat: -5.0, lng: -81.5 },
      { lat: -6.5, lng: -81.3 },
    ];

    // Dorsal de Carnegie (Carnegie Ridge Inflow)
    const carnegieCoords = [
      { lat: -0.8, lng: -85.5 },
      { lat: -1.0, lng: -84.0 },
      { lat: -1.2, lng: -82.8 },
      { lat: -1.4, lng: -81.8 },
    ];

    // Falla Pallatanga - Cosanga
    const faultCoords = [
      { lat: 0.3, lng: -77.8 },
      { lat: -0.3, lng: -78.3 },
      { lat: -1.2, lng: -78.6 },
      { lat: -1.9, lng: -79.0 },
      { lat: -2.8, lng: -79.8 },
      { lat: -3.4, lng: -80.2 },
    ];

    if (!trenchPolylineRef.current) {
      trenchPolylineRef.current = new google.maps.Polyline({
        path: trenchCoords,
        geodesic: true,
        strokeColor: '#2563eb',
        strokeOpacity: 0.9,
        strokeWeight: 3.5,
      });
    }

    if (!carnegiePolylineRef.current) {
      carnegiePolylineRef.current = new google.maps.Polyline({
        path: carnegieCoords,
        geodesic: true,
        strokeColor: '#35c7a6',
        strokeOpacity: 0.85,
        strokeWeight: 2.5,
      });
    }

    if (!faultPolylineRef.current) {
      faultPolylineRef.current = new google.maps.Polyline({
        path: faultCoords,
        geodesic: true,
        strokeColor: '#f59e0b',
        strokeOpacity: 0.85,
        strokeWeight: 2.2,
      });
    }

    if (showTrench) {
      trenchPolylineRef.current.setMap(map);
      carnegiePolylineRef.current.setMap(map);
    } else {
      trenchPolylineRef.current.setMap(null);
      carnegiePolylineRef.current.setMap(null);
    }

    if (showFaults) {
      faultPolylineRef.current.setMap(map);
    } else {
      faultPolylineRef.current.setMap(null);
    }

    return () => {
      trenchPolylineRef.current?.setMap(null);
      carnegiePolylineRef.current?.setMap(null);
      faultPolylineRef.current?.setMap(null);
    };
  }, [map, showTrench, showFaults]);

  return null;
};

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  earthquakes,
  selectedQuake,
  onSelectQuake,
  scope,
  layers,
  mapType,
  onOpenEventDetail,
}) => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCmYy_vIIcfgqQB862yHvTpd0IspVtcJoQ';

  const [activeInfoWindow, setActiveInfoWindow] = useState<Earthquake | null>(null);
  const [selectedVolcano, setSelectedVolcano] = useState<VolcanoMonitor | null>(null);

  // Sync info window with external selected quake
  useEffect(() => {
    if (selectedQuake) {
      setActiveInfoWindow(selectedQuake);
      setSelectedVolcano(null);
    }
  }, [selectedQuake]);

  return (
    <div className="w-full h-full min-h-[520px] relative overflow-hidden bg-[#0a0e13]">
      <APIProvider apiKey={apiKey} libraries={['marker', 'geometry']}>
        <Map
          id="main-geomonitor-map"
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={{ lat: -1.3, lng: -79.8 }}
          defaultZoom={6}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%', minHeight: '520px' }}
        >
          {/* Camera sync controller */}
          <MapCameraController selectedQuake={selectedQuake} scope={scope} />

          {/* Tectonic plate boundary polylines */}
          <TectonicOverlays
            showTrench={layers.trench}
            showFaults={layers.faults}
          />

          {/* Earthquakes Advanced Markers */}
          {earthquakes.map(quake => {
            const isSelected = selectedQuake?.id === quake.id;
            const color = getDepthColor(quake.depth);
            const radius = Math.max(28, Math.min(54, quake.mag * 8));

            return (
              <AdvancedMarker
                key={quake.id}
                position={{ lat: quake.lat, lng: quake.lon }}
                onClick={() => {
                  onSelectQuake(quake);
                  setActiveInfoWindow(quake);
                  setSelectedVolcano(null);
                }}
                title={`M ${quake.mag.toFixed(1)} - ${quake.place}`}
                zIndex={isSelected ? 999 : Math.round(quake.mag * 10)}
              >
                <div
                  className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                  style={{ width: `${radius}px`, height: `${radius}px` }}
                >
                  {/* Expanding shockwave pulse ring for major/selected quakes */}
                  {(quake.mag >= 4.5 || isSelected) && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
                      style={{ backgroundColor: color }}
                    />
                  )}

                  {/* Core Magnitude Disc */}
                  <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center font-display font-bold text-white shadow-xl border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: isSelected ? '#ffffff' : 'rgba(10, 14, 19, 0.8)',
                      fontSize: quake.mag >= 5.0 ? '13px' : '11px',
                    }}
                  >
                    <span>{quake.mag.toFixed(1)}</span>
                    <span className="text-[7.5px] font-mono-code -mt-1 font-normal opacity-90">
                      {quake.magType}
                    </span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Active Volcanoes Advanced Markers */}
          {layers.volcanoes &&
            VOLCANOES_DATA.map(volc => (
              <AdvancedMarker
                key={volc.id}
                position={{ lat: volc.lat, lng: volc.lon }}
                onClick={() => {
                  setSelectedVolcano(volc);
                  setActiveInfoWindow(null);
                }}
                title={`${volc.name} [${volc.altMeters}m]`}
                zIndex={850}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="px-1.5 py-0.5 rounded bg-[#10161d]/90 border border-[#ffd23d] text-[9px] font-mono-code text-[#ffd23d] font-bold shadow-md whitespace-nowrap mb-0.5 group-hover:scale-110 transition-transform">
                    {volc.name}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#ff3b30] border-2 border-white flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
              </AdvancedMarker>
            ))}

          {/* Earthquake InfoWindow */}
          {activeInfoWindow && (
            <InfoWindow
              position={{ lat: activeInfoWindow.lat, lng: activeInfoWindow.lon }}
              onCloseClick={() => setActiveInfoWindow(null)}
              headerContent={
                <div className="font-display font-bold text-xs text-[#0a0e13]">
                  M {activeInfoWindow.mag.toFixed(1)} {activeInfoWindow.magType} — {activeInfoWindow.place}
                </div>
              }
            >
              <div className="p-1 font-mono-code text-xs text-[#161f2b] space-y-1.5 min-w-[220px]">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500 text-[10px]">Profundidad:</span>
                  <span className="font-bold text-[#b52603]">{activeInfoWindow.depth.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500 text-[10px]">Hora Local:</span>
                  <span className="font-semibold">{activeInfoWindow.localTimeECT}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span className="text-gray-500 text-[10px]">Fuente:</span>
                  <span className="font-semibold text-blue-700">{activeInfoWindow.source} ({activeInfoWindow.status})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px]">Intensidad:</span>
                  <span className="font-bold text-amber-700">{activeInfoWindow.maxIntensityMMI || 'V (Fuerte)'}</span>
                </div>

                {onOpenEventDetail && (
                  <button
                    type="button"
                    onClick={() => onOpenEventDetail(activeInfoWindow)}
                    className="w-full mt-2 py-1.5 px-2 bg-[#ff5a36] hover:bg-[#e04523] text-white rounded font-sans-body font-bold text-[11px] flex items-center justify-center gap-1 shadow transition-colors"
                  >
                    <span>Ver Ficha de Evento</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </InfoWindow>
          )}

          {/* Volcano InfoWindow */}
          {selectedVolcano && (
            <InfoWindow
              position={{ lat: selectedVolcano.lat, lng: selectedVolcano.lon }}
              onCloseClick={() => setSelectedVolcano(null)}
              headerContent={
                <div className="font-display font-bold text-xs text-[#0a0e13]">
                  Volcán {selectedVolcano.name} [{selectedVolcano.altMeters} msnm]
                </div>
              }
            >
              <div className="p-1 font-mono-code text-xs text-[#161f2b] space-y-1 min-w-[220px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[10px]">Nivel de Alerta:</span>
                  <span className="font-bold text-red-700">{selectedVolcano.alertLabel}</span>
                </div>
                <div className="text-[11px] text-gray-700">{selectedVolcano.statusSubtitle}</div>
                <div className="text-[10px] text-gray-500">
                  Sismos VT: <b>{selectedVolcano.vtQuakes24h}/24h</b> • LP: <b>{selectedVolcano.lpQuakes24h}/24h</b>
                </div>
                <div className="text-[10px] text-gray-500">
                  Emisión SO₂: <b>{selectedVolcano.so2TonsDay} ton/d</b>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
