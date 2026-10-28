import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Navigation, Download } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenGuide: () => void;
  onOpenDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageToggle,
  soundEnabled,
  onSoundToggle,
  activeTab,
  onTabChange,
  onOpenGuide,
  onOpenDownload,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'settings', label: t.modeRules },
    { id: 'radar', label: t.modeSimulator },
    { id: 'overlay', label: t.modeOverlay },
    { id: 'calculator', label: t.modeCalculator },
    { id: 'analytics', label: t.modeAnalytics },
    { id: 'ai', label: t.modeAiAdvisor },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Navigation className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap leading-tight">
              RidePilot
            </span>
            <span className="text-[11px] text-amber-400 font-medium tracking-wide">
              {language === 'bn' ? 'রাইডপাইলট' : 'Driver Companion'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              soundEffects.setSoundEnabled(next);
              onSoundToggle();
              if (next) soundEffects.playToggleClick();
            }}
            title={soundEnabled ? t.soundOn : t.soundOff}
            className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Sound toggle"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onLanguageToggle}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
          >
            {language === 'bn' ? 'English' : 'বাংলা'}
          </button>

          {/* Download APK & ZIP Button */}
          <button
            type="button"
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'bn' ? 'APK / ZIP ডাউনলোড' : 'Download APK / ZIP'}
            </span>
            <span className="sm:hidden">
              {language === 'bn' ? 'APK' : 'APK'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
