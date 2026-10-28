import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { FilterSettingsPanel } from './components/FilterSettingsPanel';
import { LiveDispatcherSimulator } from './components/LiveDispatcherSimulator';
import { FloatingOverlaySimulator } from './components/FloatingOverlaySimulator';
import { ProfitCalculator } from './components/ProfitCalculator';
import { ShiftAnalytics } from './components/ShiftAnalytics';
import { RealWorldGuideModal } from './components/RealWorldGuideModal';
import { AppDownloadModal } from './components/AppDownloadModal';
import { AiTripAdvisor } from './components/AiTripAdvisor';
import { FilterSettings, RideOffer, ShiftStats, VehicleProfile } from './types';
import { Language, translations } from './utils/translations';
import { soundEffects } from './utils/audio';
import { generateMockRide } from './utils/rideEngine';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('settings');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

  // Core user-requested settings
  const [settings, setSettings] = useState<FilterSettings>({
    autoAcceptEnabled: true,
    minFare: 120, // ₹
    minFarePerKm: 22, // ₹/km
    maxPickupDistance: 3.0, // km
    minPassengerRating: 4.5,
    allowedPlatforms: ['uber', 'rapido', 'ola', 'indrive'],
    allowedVehicleTypes: ['cab_mini'],
    allowCash: true,
    excludedDropAreas: [],
    preferredDropAreas: [],
  });

  // Vehicle Profile
  const [profile, setProfile] = useState<VehicleProfile>({
    type: 'cab_mini',
    name: 'Cab Mini (হ্যাচব্যাক / সুইফট)',
    fuelType: 'cng',
    fuelCostPerUnit: 85, // ₹ per kg
    mileagePerUnit: 20, // km per kg
    platformCommissionPercent: 20,
  });

  // Dispatcher & Live Offer State
  const [isRadarRunning, setIsRadarRunning] = useState<boolean>(false);
  const [currentOffer, setCurrentOffer] = useState<RideOffer | null>(null);
  const [tripHistory, setTripHistory] = useState<RideOffer[]>([]);

  // Shift Statistics
  const [stats, setStats] = useState<ShiftStats>({
    totalEvaluated: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    totalGrossEarnings: 0,
    totalNetProfit: 0,
    totalFuelCost: 0,
    totalKilometers: 0,
  });

  const radarIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger a ride offer and handle evaluation
  const dispatchRide = (isManualTrigger = false) => {
    const offer = generateMockRide(settings, profile, language, 'kolkata');
    setCurrentOffer(offer);

    // Play incoming audio ping
    soundEffects.playIncomingRidePing();

    if (settings.autoAcceptEnabled) {
      if (offer.status === 'auto_accepted') {
        // Successful auto accept!
        soundEffects.playAcceptedChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });

        recordTrip(offer);
      } else {
        // Auto rejected
        soundEffects.playRejectedSound();
        recordTrip(offer);
      }
    }

    if (isManualTrigger && activeTab !== 'radar' && activeTab !== 'overlay') {
      setActiveTab('radar');
    }
  };

  const recordTrip = (offer: RideOffer) => {
    setTripHistory((prev) => [offer, ...prev]);
    setStats((prev) => {
      const isAccepted = offer.status === 'auto_accepted' || offer.status === 'manually_accepted';
      return {
        totalEvaluated: prev.totalEvaluated + 1,
        acceptedCount: prev.acceptedCount + (isAccepted ? 1 : 0),
        rejectedCount: prev.rejectedCount + (isAccepted ? 0 : 1),
        totalGrossEarnings: prev.totalGrossEarnings + (isAccepted ? offer.fare : 0),
        totalNetProfit: prev.totalNetProfit + (isAccepted ? offer.netProfit : 0),
        totalFuelCost: prev.totalFuelCost + (isAccepted ? offer.fuelCost : 0),
        totalKilometers: prev.totalKilometers + (isAccepted ? offer.tripDistanceKm + offer.pickupDistanceKm : 0),
      };
    });
  };

  const handleAcceptOffer = (offerId: string) => {
    if (!currentOffer || currentOffer.id !== offerId) return;
    const updatedOffer: RideOffer = {
      ...currentOffer,
      status: 'manually_accepted',
    };
    setCurrentOffer(updatedOffer);
    recordTrip(updatedOffer);
  };

  const handleRejectOffer = (offerId: string) => {
    if (!currentOffer || currentOffer.id !== offerId) return;
    const updatedOffer: RideOffer = {
      ...currentOffer,
      status: 'rejected',
    };
    setCurrentOffer(updatedOffer);
    recordTrip(updatedOffer);
  };

  // Continuous radar interval
  useEffect(() => {
    if (isRadarRunning) {
      // dispatch first one right away if no current offer
      if (!currentOffer) {
        dispatchRide();
      }
      radarIntervalRef.current = setInterval(() => {
        dispatchRide();
      }, 14000);
    } else {
      if (radarIntervalRef.current) {
        clearInterval(radarIntervalRef.current);
        radarIntervalRef.current = null;
      }
    }

    return () => {
      if (radarIntervalRef.current) {
        clearInterval(radarIntervalRef.current);
      }
    };
  }, [isRadarRunning, settings, profile, language]);

  const handleClearHistory = () => {
    setTripHistory([]);
    setStats({
      totalEvaluated: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      totalGrossEarnings: 0,
      totalNetProfit: 0,
      totalFuelCost: 0,
      totalKilometers: 0,
    });
    setCurrentOffer(null);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* 3-zone Header */}
      <Header
        language={language}
        onLanguageToggle={() => setLanguage((l) => (l === 'bn' ? 'en' : 'bn'))}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((s) => !s)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* User Prompt Notice & Mode Selection Banner */}
        <NoticeBanner
          language={language}
          onSelectFeature={(tab) => setActiveTab(tab)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
        />

        {/* Tab Content Panes */}
        {activeTab === 'settings' && (
          <FilterSettingsPanel
            language={language}
            settings={settings}
            onUpdateSettings={setSettings}
            profile={profile}
            onUpdateProfile={setProfile}
            onTriggerTestRide={() => dispatchRide(true)}
            onOpenRadar={() => setActiveTab('radar')}
          />
        )}

        {activeTab === 'radar' && (
          <LiveDispatcherSimulator
            language={language}
            settings={settings}
            profile={profile}
            currentOffer={currentOffer}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onTriggerInstantRide={() => dispatchRide(true)}
            isRadarRunning={isRadarRunning}
            onToggleRadar={() => setIsRadarRunning((r) => !r)}
            tripHistory={tripHistory}
          />
        )}

        {activeTab === 'overlay' && (
          <FloatingOverlaySimulator
            language={language}
            settings={settings}
            profile={profile}
            currentOffer={currentOffer}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onTriggerTestRide={() => dispatchRide(true)}
          />
        )}

        {activeTab === 'calculator' && (
          <ProfitCalculator
            language={language}
            profile={profile}
            onUpdateProfile={setProfile}
          />
        )}

        {activeTab === 'analytics' && (
          <ShiftAnalytics
            language={language}
            stats={stats}
            tripHistory={tripHistory}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'ai' && (
          <AiTripAdvisor
            language={language}
            settings={settings}
            profile={profile}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Responsive ergonomics as per mobile touch app reference) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 px-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1 ${
            activeTab === 'settings' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <span className="text-[11px] mt-0.5 truncate max-w-[64px]">
            {language === 'bn' ? 'ফিল্টার' : 'Filters'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex flex-col items-center justify-center py-1 ${
            activeTab === 'radar' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <span className="text-[11px] mt-0.5 truncate max-w-[64px]">
            {language === 'bn' ? 'রাডার' : 'Radar'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('overlay')}
          className={`flex flex-col items-center justify-center py-1 ${
            activeTab === 'overlay' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <span className="text-[11px] mt-0.5 truncate max-w-[64px]">
            {language === 'bn' ? 'ওভারলে' : 'Overlay'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex flex-col items-center justify-center py-1 ${
            activeTab === 'calculator' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <span className="text-[11px] mt-0.5 truncate max-w-[64px]">
            {language === 'bn' ? 'লাভ' : 'Profit'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center py-1 ${
            activeTab === 'analytics' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <span className="text-[11px] mt-0.5 truncate max-w-[64px]">
            {language === 'bn' ? 'রিপোর্ট' : 'Report'}
          </span>
        </button>
      </nav>

      {/* Real-World Android Guide Modal */}
      <RealWorldGuideModal
        language={language}
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* App APK & ZIP Download Center Modal */}
      <AppDownloadModal
        language={language}
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}
