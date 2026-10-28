import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  MapPin, 
  Navigation, 
  IndianRupee, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import { FilterSettings, RideOffer, VehicleProfile } from '../types';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface LiveDispatcherSimulatorProps {
  language: Language;
  settings: FilterSettings;
  profile: VehicleProfile;
  currentOffer: RideOffer | null;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onTriggerInstantRide: () => void;
  isRadarRunning: boolean;
  onToggleRadar: () => void;
  tripHistory: RideOffer[];
}

export const LiveDispatcherSimulator: React.FC<LiveDispatcherSimulatorProps> = ({
  language,
  settings,
  profile,
  currentOffer,
  onAcceptOffer,
  onRejectOffer,
  onTriggerInstantRide,
  isRadarRunning,
  onToggleRadar,
  tripHistory,
}) => {
  const t = translations[language];
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    if (!currentOffer || currentOffer.status !== 'pending') {
      setCountdown(15);
      return;
    }

    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRejectOffer(currentOffer.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentOffer?.id, currentOffer?.status]);

  const platformBadge = (platform: string) => {
    switch (platform) {
      case 'uber':
        return <span className="bg-black text-white px-2 py-0.5 rounded text-[11px] font-bold border border-slate-700">Uber</span>;
      case 'rapido':
        return <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-extrabold">Rapido</span>;
      case 'ola':
        return <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">Ola</span>;
      case 'indrive':
        return <span className="bg-teal-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">inDrive</span>;
      default:
        return <span>{platform}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${
              isRadarRunning
                ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse'
                : 'bg-slate-700'
            }`}
          />
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {isRadarRunning ? t.dispatcherStatusActive : t.dispatcherStatusPaused}
            </h3>
            <p className="text-xs text-slate-400">
              {settings.autoAcceptEnabled
                ? (language === 'bn' ? 'অটো-এক্সেপ্ট সক্রিয় · শর্ত মিললে স্বয়ংক্রিয় গ্রহণ' : 'Auto-Accept ON · Compliant rides will auto-accept')
                : (language === 'bn' ? 'অটো-এক্সেপ্ট বন্ধ · ম্যানুয়ালি যাচাই করতে হবে' : 'Auto-Accept OFF · Manual driver confirmation needed')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onToggleRadar}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm ${
              isRadarRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRadarRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>{t.stopSimulation}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t.startSimulation}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onTriggerInstantRide}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{t.generateSampleRide}</span>
          </button>
        </div>
      </div>

      {/* Active Ride Offer Card (Or Idle State) */}
      {currentOffer ? (
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {platformBadge(currentOffer.platform)}
              <div className="text-xs text-slate-400 font-mono">
                {currentOffer.id}
              </div>
              {currentOffer.surgeMultiplier > 1.0 && (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ⚡ {currentOffer.surgeMultiplier}x Surge
                </span>
              )}
            </div>

            {/* Countdown timer */}
            {currentOffer.status === 'pending' && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs font-bold tabular-nums">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{countdown}s</span>
              </div>
            )}

            {currentOffer.status === 'auto_accepted' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
                {t.autoAcceptedBanner}
              </span>
            )}

            {currentOffer.status === 'manually_accepted' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
                {t.manuallyAcceptedBanner}
              </span>
            )}

            {currentOffer.status === 'rejected' && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
                <XCircle className="w-4 h-4" />
                {t.rejectedBanner}
              </span>
            )}
          </div>

          {/* Financial Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-1">{t.estFare}</div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                ₹{currentOffer.fare}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 uppercase">
                {currentOffer.paymentMode === 'cash' ? 'Cash Trip' : 'Online / UPI'}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-1">{t.ratePerKm}</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
                ₹{currentOffer.farePerKm}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {language === 'bn' ? 'প্রতি কিমি মোট ভাড়া' : 'Gross rate per km'}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-1">{t.pickupDist}</div>
              <div className="text-2xl font-extrabold text-sky-400 font-mono tabular-nums">
                {currentOffer.pickupDistanceKm} <span className="text-xs">km</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ~{Math.round(currentOffer.pickupDistanceKm * 3.5)} mins to rider
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-1">{t.profitEstimate}</div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                ₹{currentOffer.netProfit}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                -₹{currentOffer.fuelCost} fuel
              </div>
            </div>
          </div>

          {/* Route details */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400">{t.pickupDist} ({currentOffer.pickupDistanceKm} km)</div>
                <div className="text-sm font-semibold text-slate-100 truncate">{currentOffer.pickupLocation}</div>
              </div>
            </div>

            <div className="ml-2.5 h-4 border-l border-dashed border-slate-700" />

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-400">{t.tripDist} ({currentOffer.tripDistanceKm} km · ~{currentOffer.estimatedDurationMins} mins)</div>
                <div className="text-sm font-semibold text-slate-100 truncate">{currentOffer.dropLocation}</div>
              </div>
            </div>

            {/* Passenger */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-slate-300 font-medium">{currentOffer.passengerName}</span>
                <span className="flex items-center text-amber-400 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                  {currentOffer.passengerRating}★
                </span>
              </span>
              <span>{profile.name}</span>
            </div>
          </div>

          {/* Rule Evaluation Breakdown */}
          {currentOffer.rejectionReasons.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3.5 mb-5 space-y-1.5">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.reasonsFailed}:</span>
              </div>
              <ul className="text-xs text-rose-200/90 space-y-1 list-disc list-inside">
                {currentOffer.rejectionReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Manual Action Buttons (If Pending) */}
          {currentOffer.status === 'pending' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playAcceptedChime();
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
                  onAcceptOffer(currentOffer.id);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t.acceptRide} (₹{currentOffer.fare})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playRejectedSound();
                  onRejectOffer(currentOffer.id);
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
              >
                {t.rejectRide}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Radar Scanning Idle Visual */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-75" />
            <div className="absolute inset-3 rounded-full border border-amber-500/30" />
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1 max-w-md">
            <h4 className="text-base font-bold text-white">
              {isRadarRunning ? t.dispatcherStatusActive : (language === 'bn' ? 'রাডার স্ট্যান্ডবাই অবস্থায় রয়েছে' : 'Radar on Standby')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'রাডার চালু রাখলে নির্ধারিত ব্যবধানে নতুন ট্রিপ আসবে। অথবা "টেস্ট রিকোয়েস্ট পাঠান" বাটনে ক্লিক করে তাৎক্ষণিক টেস্ট করুন।'
                : 'Keep radar running to receive automated simulated trip pings, or click "Send Test Request" to trigger one instantly.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onTriggerInstantRide}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{t.generateSampleRide}</span>
          </button>
        </div>
      )}

      {/* Dispatched Trips History Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'bn' ? 'সাম্প্রতিক মূল্যায়িত ট্রিপসমূহ' : 'Recent Dispatched Trips'}
          </h4>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {tripHistory.length} {language === 'bn' ? 'টি ট্রিপ' : 'trips'}
          </span>
        </div>

        {tripHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            {language === 'bn' ? 'এখনো কোনো ট্রিপ মূল্যায়ন করা হয়নি।' : 'No trips evaluated in this session yet.'}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {tripHistory.map((trip) => {
              const isAccepted = trip.status === 'auto_accepted' || trip.status === 'manually_accepted';
              return (
                <div
                  key={trip.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isAccepted ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 truncate">
                          {trip.dropLocation}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {trip.tripDistanceKm}km
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {trip.pickupLocation} · {trip.pickupDistanceKm}km away
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-white font-mono tabular-nums">
                      ₹{trip.fare}
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isAccepted ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {trip.status === 'auto_accepted' && (language === 'bn' ? 'অটো-গৃহীত' : 'Auto-Accepted')}
                      {trip.status === 'manually_accepted' && (language === 'bn' ? 'ম্যানুয়াল গৃহীত' : 'Accepted')}
                      {trip.status === 'rejected' && (language === 'bn' ? 'প্রত্যাখ্যাত' : 'Declined')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
