import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LiveMonitoringView } from './components/LiveMonitoringView';
import { EventDetailView } from './components/EventDetailView';
import { TectonicAnalysisView } from './components/TectonicAnalysisView';
import { SeismicSourcesModal } from './components/SeismicSourcesModal';
import { Earthquake } from './types/seismic';
import { INITIAL_EARTHQUAKES } from './data/mockData';
import { fetchLiveQuakes, playAlertBeep } from './services/seismicApi';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'monitoreo-en-vivo' | 'ficha-de-evento' | 'analisis-tectonico'
  >('monitoreo-en-vivo');
  const [scope, setScope] = useState<'ecuador' | 'latam'>('ecuador');
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(INITIAL_EARTHQUAKES);
  const [selectedQuake, setSelectedQuake] = useState<Earthquake>(INITIAL_EARTHQUAKES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Load live earthquakes from USGS & EMSC with graceful baseline fallback
  const loadData = useCallback(async (activeScope: 'ecuador' | 'latam') => {
    try {
      const quakes = await fetchLiveQuakes(activeScope);
      if (quakes && quakes.length > 0) {
        setEarthquakes(quakes);
        // If current selection is not in list, pick the first
        setSelectedQuake(prev => {
          const match = quakes.find(q => q.id === prev.id);
          return match || quakes[0];
        });
      }
    } catch (err) {
      console.warn('Error loading quakes:', err);
    }
  }, []);

  useEffect(() => {
    loadData(scope);
    const interval = setInterval(() => {
      loadData(scope);
    }, 5 * 60 * 1000); // 5-minute refresh
    return () => clearInterval(interval);
  }, [scope, loadData]);

  const handleSelectQuake = (quake: Earthquake) => {
    setSelectedQuake(quake);
  };

  const handleOpenEventDetail = (quake: Earthquake) => {
    setSelectedQuake(quake);
    setCurrentTab('ficha-de-evento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectScope = (newScope: 'ecuador' | 'latam') => {
    setScope(newScope);
    setToastMessage(`Alcance sismológico actualizado a ${newScope === 'ecuador' ? 'Ecuador' : 'Latinoamérica'}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#101419] text-[#e0e2ea] flex flex-col selection:bg-[#ff5a36] selection:text-[#0a0e13]">
      {/* Sticky Google Maps Quota Warning Banner (if Demo Key quota reached) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161f2b] border border-[#ff8a3d]/50 shadow-2xl px-4 py-2.5 rounded-lg flex items-center gap-2 font-mono-code text-xs text-[#e8eef2] animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#ff5a36] live-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Persistent Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        scope={scope}
        onSelectScope={handleSelectScope}
        sensorHealth={98.4}
        onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="w-full pt-16 flex-1 flex flex-col bg-[#101419]">
        {currentTab === 'monitoreo-en-vivo' && (
          <LiveMonitoringView
            earthquakes={earthquakes}
            selectedQuake={selectedQuake}
            onSelectQuake={handleSelectQuake}
            onOpenEventDetail={handleOpenEventDetail}
            scope={scope}
            onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
          />
        )}

        {currentTab === 'ficha-de-evento' && (
          <EventDetailView
            currentQuake={selectedQuake}
            allQuakes={earthquakes}
            onSelectQuake={handleSelectQuake}
            onNavigateToTectonic={() => setCurrentTab('analisis-tectonico')}
          />
        )}

        {currentTab === 'analisis-tectonico' && <TectonicAnalysisView />}
      </main>

      {/* Persistent Official Footer */}
      <Footer onOpenSourcesModal={() => setIsSourcesModalOpen(true)} />

      {/* Seismic Sources & Scientific Guide Modal */}
      <SeismicSourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />
    </div>
  );
}
