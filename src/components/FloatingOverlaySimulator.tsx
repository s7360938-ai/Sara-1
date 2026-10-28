import React, { useState } from 'react';
import { 
  Smartphone, 
  Layers, 
  MapPin, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  CheckCircle, 
  X, 
  Zap, 
  SlidersHorizontal, 
  ShieldCheck 
} from 'lucide-react';
import { FilterSettings, RideOffer, VehicleProfile } from '../types';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface FloatingOverlaySimulatorProps {
  language: Language;
  settings: FilterSettings;
  profile: VehicleProfile;
  currentOffer: RideOffer | null;
  onAcceptOffer: (id: string) => void;
  onRejectOffer: (id: string) => void;
  onTriggerTestRide: () => void;
}

export const FloatingOverlaySimulator: React.FC<FloatingOverlaySimulatorProps> = ({
  language,
  settings,
  profile,
  currentOffer,
  onAcceptOffer,
  onRejectOffer,
  onTriggerTestRide,
}) => {
  const t = translations[language];
  const [activeDriverApp, setActiveDriverApp] = useState<'uber' | 'rapido'>('uber');
  const [isOverlayExpanded, setIsOverlayExpanded] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Intro info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <span>{language === 'bn' ? 'স্মার্টফোন স্ক্রিন ও ফ্লোটিং ওভারলে সিমুলেটর' : 'Phone Mount & Floating HUD Simulator'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {language === 'bn'
              ? 'অ্যান্ড্রয়েড ফোনে Uber বা Rapido চলার সময় RidePilot-এর ফ্লোটিং বাবল কীভাবে স্ক্রিনের উপরে ভেসে থাকে এবং রাইড রিকোয়েস্ট ফিল্টার করে তা নিচে দেখুন।'
              : 'See how the floating RidePilot widget hovers directly over the official driver app to evaluate and accept trips hands-free.'}
          </p>
        </div>

        {/* Switch app skin */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundEffects.playToggleClick();
              setActiveDriverApp('uber');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeDriverApp === 'uber'
                ? 'bg-black text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Uber Driver
          </button>
          <button
            type="button"
            onClick={() => {
              soundEffects.playToggleClick();
              setActiveDriverApp('rapido');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeDriverApp === 'rapido'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rapido Captain
          </button>
        </div>
      </div>

      {/* Mock Phone Display Container */}
      <div className="max-w-md mx-auto bg-slate-950 rounded-[40px] p-3 border-4 border-slate-800 shadow-2xl relative">
        {/* Phone Speaker Notch */}
        <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Phone Screen Canvas */}
        <div className="relative h-[580px] rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 flex flex-col justify-between select-none">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-[#12161f] pointer-events-none opacity-85">
            {/* SVG Roads and City Grid Simulation */}
            <svg className="w-full h-full opacity-30" viewBox="0 0 400 600" preserveAspectRatio="none">
              <path d="M 50,0 L 50,600 M 120,0 L 120,600 M 240,0 L 240,600 M 320,0 L 320,600" stroke="#475569" strokeWidth="4" />
              <path d="M 0,100 L 400,100 M 0,220 L 400,220 M 0,380 L 400,380 M 0,490 L 400,490" stroke="#475569" strokeWidth="4" />
              <path d="M 0,50 Q 200,300 400,550" stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="6,6" />
              <circle cx="200" cy="280" r="12" fill="#3b82f6" fillOpacity="0.3" />
              <circle cx="200" cy="280" r="6" fill="#3b82f6" />
            </svg>
          </div>

          {/* Simulated App Header (Uber or Rapido) */}
          <div className="relative z-10 p-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  activeDriverApp === 'uber' ? 'bg-white' : 'bg-amber-400'
                }`}
              />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                {activeDriverApp === 'uber' ? 'Uber Driver · Online' : 'Rapido Captain · Duty On'}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold font-mono">
              ₹1,450 Today
            </span>
          </div>

          {/* FLOATING OVERLAY WIDGET (The actual Auto-Accept Companion!) */}
          <div className="relative z-20 px-3 pt-2">
            <div className="bg-slate-950/95 border-2 border-amber-500/70 rounded-2xl shadow-2xl p-3 backdrop-blur-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Zap className="w-3 h-3 fill-amber-400" />
                  </div>
                  <span className="text-xs font-extrabold text-white">RidePilot HUD</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      settings.autoAcceptEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.autoAcceptEnabled ? 'AUTO-ACCEPT' : 'MANUAL'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOverlayExpanded(!isOverlayExpanded)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {isOverlayExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isOverlayExpanded && (
                <div className="pt-2 text-[11px] space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                    <div className="bg-slate-900/90 rounded-lg p-1 border border-slate-800">
                      <div className="text-[9px] text-slate-400">Min Fare</div>
                      <div className="font-bold text-amber-400">≥₹{settings.minFare}</div>
                    </div>
                    <div className="bg-slate-900/90 rounded-lg p-1 border border-slate-800">
                      <div className="text-[9px] text-slate-400">Per km</div>
                      <div className="font-bold text-emerald-400">≥₹{settings.minFarePerKm}</div>
                    </div>
                    <div className="bg-slate-900/90 rounded-lg p-1 border border-slate-800">
                      <div className="text-[9px] text-slate-400">Max Pickup</div>
                      <div className="font-bold text-sky-400">≤{settings.maxPickupDistance}k</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Cash Rides: {settings.allowCash ? 'Allowed' : 'Blocked'}</span>
                    <span>Rating: ≥{settings.minPassengerRating}★</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIMULATED INCOMING TRIP OVERLAY ON PHONE SCREEN */}
          <div className="relative z-10 p-3 mt-auto mb-2">
            {currentOffer ? (
              <div className="bg-slate-950 border-2 border-emerald-500 rounded-2xl p-3.5 shadow-2xl space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">
                    {currentOffer.platform} Request
                  </span>
                  <span className="text-sm font-extrabold text-amber-400 font-mono">
                    ₹{currentOffer.fare}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="truncate">
                    📍 {currentOffer.pickupLocation} ({currentOffer.pickupDistanceKm}km away)
                  </div>
                  <div className="truncate">
                    🏁 {currentOffer.dropLocation} ({currentOffer.tripDistanceKm}km)
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold">
                    ₹{currentOffer.farePerKm}/km
                  </span>
                  <span className="text-amber-300 font-medium">
                    Net Profit: ₹{currentOffer.netProfit}
                  </span>
                </div>

                {currentOffer.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onAcceptOffer(currentOffer.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectOffer(currentOffer.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Skip
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 text-center space-y-2">
                <div className="text-xs font-bold text-slate-200">
                  {language === 'bn' ? 'ড্রাইভার অ্যাপ প্রস্তুত' : 'Ready for Ride Requests'}
                </div>
                <button
                  type="button"
                  onClick={onTriggerTestRide}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{language === 'bn' ? 'টেস্ট রিকোয়েস্ট পাঠান' : 'Trigger Incoming Ping'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Phone Bottom Home Bar */}
          <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
        </div>
      </div>
    </div>
  );
};
