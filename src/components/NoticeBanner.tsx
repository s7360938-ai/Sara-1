import { Info, Sparkles, Sliders, Radio, Smartphone, Calculator, ArrowRight, Download } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface NoticeBannerProps {
  language: Language;
  onSelectFeature: (feature: string) => void;
  onOpenGuide: () => void;
  onOpenDownload: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  language,
  onSelectFeature,
  onOpenGuide,
  onOpenDownload,
}) => {
  const t = translations[language];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                {t.disclaimerBadge}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Uber · Rapido · Ola · InDrive</span>
            </div>
            <p className="text-sm font-medium text-slate-200">
              {t.simulatorDisclaimer}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'APK / ZIP ফাইল ডাউনলোড' : 'Download APK / ZIP'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenGuide}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 whitespace-nowrap"
          >
            {t.learnMore} →
          </button>
        </div>
      </div>

      {/* Choice quick triggers for "আপনি কোনটি চান?" */}
      <div className="pt-3">
        <div className="text-xs font-semibold text-slate-400 mb-2">
          {language === 'bn' ? 'সরাসরি অভিজ্ঞতা নিন (দ্রুত নির্বাচন করুন):' : 'Select an experience to explore:'}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => onSelectFeature('settings')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 truncate">
                {language === 'bn' ? '১. ফিল্টার টিউনিং' : '1. Filter Rules'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {language === 'bn' ? 'ভাড়া ও কিমি রেট' : 'Fare & rate/km'}
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('radar')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 truncate">
                {language === 'bn' ? '২. লাইভ রাইড রাডার' : '2. Live Ride Radar'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {language === 'bn' ? 'অডিও অ্যালার্ট ও পিং' : 'Audio ping & alerts'}
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('overlay')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 truncate">
                {language === 'bn' ? '৩. ফোন ওভারলে HUD' : '3. Screen Overlay'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {language === 'bn' ? 'কার-মাউন্ট প্রিভিউ' : 'Floating widget'}
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectFeature('calculator')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <Calculator className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-400 truncate">
                {language === 'bn' ? '৪. তেল ও লাভ হিসাব' : '4. Net Profit Math'}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {language === 'bn' ? 'আসল নিট আয়' : 'Fuel & Commission'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
