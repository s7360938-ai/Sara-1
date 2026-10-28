import React from 'react';
import { X, ShieldCheck, AlertTriangle, Cpu, Terminal, BookOpen, CheckCircle } from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface RealWorldGuideModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const RealWorldGuideModal: React.FC<RealWorldGuideModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {t.guideTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'বাস্তব টেকনোলজি, অ্যান্ড্রয়েড সিস্টেম ও প্ল্যাটফর্মের নিয়মাবলী' : 'Real-world Android architecture, accessibility & safety'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1 */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>{t.guideSection1Title}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {t.guideSection1Body}
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            <span>{t.guideSection2Title}</span>
          </h4>
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <p>{t.guideSection2Body}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-200 block text-[11px] mb-1">
                  1. Accessibility Node Provider:
                </span>
                <span className="text-slate-400 text-[10px]">
                  স্ক্রিনে প্রদর্শিত টেক্সট (যেমন `₹240`, `3.2 km`) রিড করে মেমরিতে আনে।
                </span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-200 block text-[11px] mb-1">
                  2. ACTION_CLICK Dispatch:
                </span>
                <span className="text-slate-400 text-[10px]">
                  শর্ত মিলে গেলে স্বয়ংক্রিয়ভাবে `Accept` বাটনের নোডে ট্যাপ পাঠায়।
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Safety & TOS */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{t.guideSection3Title}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-rose-950/20 p-4 rounded-xl border border-rose-900/40">
            {t.guideSection3Body}
          </p>
        </div>

        {/* Pro Driver Recommendations */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'অভিজ্ঞ ড্রাইভারদের জন্য সেরা অভ্যাস (Best Practice)' : 'Driver Best Practices'}</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>
              {language === 'bn'
                ? 'পিকআপ দূরত্ব ৩ কিমির মধ্যে সীমাবদ্ধ রাখা (দূরবর্তী প্যাসেঞ্জারদের কাছে যাওয়া সময় ও তেলের অপচয়)।'
                : 'Keep pickup distance under 3 km to prevent wasted uncompensated fuel.'}
            </li>
            <li>
              {language === 'bn'
                ? 'বাইকের জন্য ন্যূনতম ₹১২-১৫/কিমি এবং ক্যাবের জন্য ₹২৫-৩২/কিমি টার্গেট রাখা।'
                : 'Target ≥₹14/km for 2-wheelers and ≥₹26/km for 4-wheelers.'}
            </li>
            <li>
              {language === 'bn'
                ? 'ডেডহেড (খালি ফেরা) ঝুঁকিযুক্ত গন্তব্য এড়িয়ে চলা অথবা পর্যাপ্ত সার্জ নিশ্চিত করা।'
                : 'Account for deadhead return trip distances when taking highway drops.'}
            </li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            {language === 'bn' ? 'বুঝেছি, চালিয়ে যান' : 'Got it, Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
