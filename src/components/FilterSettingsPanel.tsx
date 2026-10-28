import React from 'react';
import { 
  Check, 
  IndianRupee, 
  MapPin, 
  Gauge, 
  Car, 
  Bike, 
  Zap, 
  RotateCcw, 
  Play, 
  ShieldCheck, 
  Ban, 
  Star, 
  SlidersHorizontal 
} from 'lucide-react';
import { FilterSettings, PlatformType, VehicleProfile, VehicleType } from '../types';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface FilterSettingsPanelProps {
  language: Language;
  settings: FilterSettings;
  onUpdateSettings: (newSettings: FilterSettings) => void;
  profile: VehicleProfile;
  onUpdateProfile: (newProfile: VehicleProfile) => void;
  onTriggerTestRide: () => void;
  onOpenRadar: () => void;
}

export const FilterSettingsPanel: React.FC<FilterSettingsPanelProps> = ({
  language,
  settings,
  onUpdateSettings,
  profile,
  onUpdateProfile,
  onTriggerTestRide,
  onOpenRadar,
}) => {
  const t = translations[language];

  const handleToggleAutoAccept = () => {
    soundEffects.playToggleClick();
    onUpdateSettings({
      ...settings,
      autoAcceptEnabled: !settings.autoAcceptEnabled,
    });
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    soundEffects.playToggleClick();
    const exists = settings.allowedPlatforms.includes(platform);
    if (exists && settings.allowedPlatforms.length === 1) return; // keep at least 1
    const allowedPlatforms = exists
      ? settings.allowedPlatforms.filter((p) => p !== platform)
      : [...settings.allowedPlatforms, platform];
    onUpdateSettings({ ...settings, allowedPlatforms });
  };

  const handleVehicleTypeChange = (type: VehicleType) => {
    soundEffects.playToggleClick();
    let fuelCost = 106; // Petrol
    let mileage = 45; // Bike km/l
    let commission = 20;

    if (type === 'bike') {
      mileage = 45;
      fuelCost = 106;
      commission = 15;
    } else if (type === 'auto') {
      mileage = 28;
      fuelCost = 85; // CNG
      commission = 18;
    } else if (type === 'cab_mini') {
      mileage = 18;
      fuelCost = 85;
      commission = 20;
    } else if (type === 'cab_sedan') {
      mileage = 14;
      fuelCost = 94; // Diesel
      commission = 22;
    } else if (type === 'cab_ev') {
      mileage = 7; // km per kWh
      fuelCost = 12; // ₹ per kWh
      commission = 18;
    }

    onUpdateProfile({
      ...profile,
      type,
      mileagePerUnit: mileage,
      fuelCostPerUnit: fuelCost,
      platformCommissionPercent: commission,
    });

    onUpdateSettings({
      ...settings,
      allowedVehicleTypes: [type],
    });
  };

  // Quick Strategy Presets
  const applyPreset = (preset: 'high_profit' | 'balanced' | 'rain_surge') => {
    soundEffects.playToggleClick();
    if (preset === 'high_profit') {
      onUpdateSettings({
        ...settings,
        minFare: 160,
        minFarePerKm: profile.type === 'bike' ? 18 : 32,
        maxPickupDistance: 2.0,
        minPassengerRating: 4.6,
      });
    } else if (preset === 'balanced') {
      onUpdateSettings({
        ...settings,
        minFare: profile.type === 'bike' ? 50 : 100,
        minFarePerKm: profile.type === 'bike' ? 12 : 24,
        maxPickupDistance: 3.5,
        minPassengerRating: 4.4,
      });
    } else if (preset === 'rain_surge') {
      onUpdateSettings({
        ...settings,
        minFare: profile.type === 'bike' ? 80 : 180,
        minFarePerKm: profile.type === 'bike' ? 22 : 38,
        maxPickupDistance: 1.5,
        minPassengerRating: 4.5,
      });
    }
  };

  const platforms: { id: PlatformType; name: string; color: string }[] = [
    { id: 'uber', name: 'Uber', color: 'bg-black text-white border-slate-700' },
    { id: 'rapido', name: 'Rapido', color: 'bg-amber-400 text-slate-950 font-bold border-amber-300' },
    { id: 'ola', name: 'Ola', color: 'bg-emerald-600 text-white border-emerald-500' },
    { id: 'indrive', name: 'inDrive', color: 'bg-teal-600 text-white border-teal-500' },
  ];

  const vehicleOptions: { id: VehicleType; label: string; icon: React.ReactNode }[] = [
    { id: 'bike', label: t.bike, icon: <Bike className="w-4 h-4" /> },
    { id: 'auto', label: t.auto, icon: <Car className="w-4 h-4" /> },
    { id: 'cab_mini', label: t.cabMini, icon: <Car className="w-4 h-4" /> },
    { id: 'cab_sedan', label: t.cabSedan, icon: <Car className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Core Header & Auto-Accept Master Switch */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t.autoAcceptTitle}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  settings.autoAcceptEnabled
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {settings.autoAcceptEnabled ? (language === 'bn' ? 'সক্রিয় (ON)' : 'ACTIVE (ON)') : (language === 'bn' ? 'বন্ধ (OFF)' : 'OFF')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {t.autoAcceptDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleAutoAccept}
              className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                settings.autoAcceptEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.autoAcceptEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.autoAcceptEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Strategy Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {language === 'bn' ? 'দ্রুত স্ট্র্যাটেজি প্রিসেট:' : 'Quick Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {language === 'bn' ? '⚖️ স্বাভাবিক / ব্যালেন্সড' : '⚖️ Balanced'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high_profit')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {language === 'bn' ? '💰 হাই প্রফিট মোড' : '💰 High Profit'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rain_surge')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {language === 'bn' ? '⚡ বৃষ্টি ও সার্জ মোড' : '⚡ Rain & Surge'}
          </button>
        </div>
      </div>

      {/* 2. Primary 3 User-Requested Numeric Thresholds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Threshold 1: ন্যূনতম ভাড়া (₹) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="minFareInput" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                {t.minFareLabel}
              </label>
              <div className="text-base font-bold text-amber-400 font-mono tabular-nums">
                ₹{settings.minFare}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">
              {t.minFareHelp}
            </p>
          </div>

          <div className="space-y-3">
            <input
              id="minFareInput"
              type="range"
              min={30}
              max={500}
              step={10}
              value={settings.minFare}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  minFare: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>₹30</span>
              <span>₹250</span>
              <span>₹500</span>
            </div>
          </div>
        </div>

        {/* Threshold 2: ন্যূনতম ভাড়া প্রতি কিমি (₹) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="minFarePerKmInput" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                {t.minFarePerKmLabel}
              </label>
              <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                ₹{settings.minFarePerKm}<span className="text-xs text-slate-400">/কিমি</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">
              {t.minFarePerKmHelp}
            </p>
          </div>

          <div className="space-y-3">
            <input
              id="minFarePerKmInput"
              type="range"
              min={10}
              max={60}
              step={1}
              value={settings.minFarePerKm}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  minFarePerKm: Number(e.target.value),
                })
              }
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>₹10/km</span>
              <span>₹35/km</span>
              <span>₹60/km</span>
            </div>
          </div>
        </div>

        {/* Threshold 3: সর্বোচ্চ পিকআপ দূরত্ব (কিমি) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="maxPickupDistanceInput" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {t.maxPickupDistanceLabel}
              </label>
              <div className="text-base font-bold text-sky-400 font-mono tabular-nums">
                {settings.maxPickupDistance}<span className="text-xs text-slate-400"> কিমি</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-4 min-h-[32px]">
              {t.maxPickupDistanceHelp}
            </p>
          </div>

          <div className="space-y-3">
            <input
              id="maxPickupDistanceInput"
              type="range"
              min={0.5}
              max={10.0}
              step={0.5}
              value={settings.maxPickupDistance}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  maxPickupDistance: Number(e.target.value),
                })
              }
              className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>0.5 km</span>
              <span>5.0 km</span>
              <span>10.0 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Secondary Practical Controls: Vehicle Category, Platforms, Cash Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">
              {t.vehicleTypesLabel}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'জ্বালানি অনুযায়ী মাইলেজ এডজাস্ট হবে' : 'Affects fuel calculations'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {vehicleOptions.map((v) => {
              const isSelected = profile.type === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVehicleTypeChange(v.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {v.icon}
                  <span className="truncate">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platforms Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">
              {t.platformsLabel}
            </span>
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'যেসব অ্যাপে অটো-ফিল্টার চলবে' : 'Select active driver apps'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => {
              const isActive = settings.allowedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePlatformToggle(p.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isActive
                      ? `${p.color} ring-1 ring-white/10 shadow-sm`
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 opacity-50 hover:opacity-80'
                  }`}
                >
                  <span>{p.name}</span>
                  {isActive ? <Check className="w-3.5 h-3.5 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Passenger Rating & Payment Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="minRatingInput" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {t.minRatingLabel}
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono tabular-nums">
                {settings.minPassengerRating}★
              </span>
            </div>
            <input
              id="minRatingInput"
              type="range"
              min={4.0}
              max={4.9}
              step={0.1}
              value={settings.minPassengerRating}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  minPassengerRating: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">
              {t.paymentModeLabel}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playToggleClick();
                  onUpdateSettings({ ...settings, allowCash: true });
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  settings.allowCash
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                {t.allowCashOnly}
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playToggleClick();
                  onUpdateSettings({ ...settings, allowCash: false });
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  !settings.allowCash
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                {t.onlineOnly}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Test Trigger Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">
            {language === 'bn' ? 'সেটিংস যাচাই করুন:' : 'Verify your rules:'}
          </span>{' '}
          {language === 'bn'
            ? 'টেস্ট রিকোয়েস্ট পাঠিয়ে পরীক্ষা করুন আপনার ফিল্টার কীভাবে ট্রিপ বাছাই করে।'
            : 'Send an instant test request to watch how your auto-accept logic evaluates.'}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onTriggerTestRide}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{t.generateSampleRide}</span>
          </button>

          <button
            type="button"
            onClick={onOpenRadar}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{t.modeSimulator}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
