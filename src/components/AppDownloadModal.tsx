import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Package, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects } from '../utils/audio';

interface AppDownloadModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk' | 'zip' | 'guide'>('apk');

  const handleDownloadZip = async () => {
    soundEffects.playToggleClick();
    setDownloadingZip(true);
    try {
      // Trigger browser download via API
      const link = document.createElement('a');
      link.href = '/api/download-zip';
      link.download = 'RidePilot-App-Source-and-APK-Package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Direct window location fallback
      window.location.href = '/api/download-zip';
    } finally {
      setTimeout(() => {
        setDownloadingZip(false);
      }, 1500);
    }
  };

  const capacitorCommand = `npm run build && npm install @capacitor/core @capacitor/cli @capacitor/android && npx cap init RidePilot com.ridepilot.driver --web-dir dist && npx cap add android && npx cap open android`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(capacitorCommand);
    setCopiedCmd(true);
    soundEffects.playToggleClick();
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {language === 'bn' ? 'অ্যাপ ডাউনলোড ও ইনস্টলেশন সেন্টার' : 'App Download & Installation Center'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'Android APK, সরাসরি মোবাইল ইনস্টল ও সম্পূর্ণ ZIP ফাইল' : 'Android APK, PWA WebAPK & Full Project ZIP package'}
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

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === 'bn' ? 'অ্যান্ড্রয়েড ইনস্টল / APK' : 'Android Install / APK'}</span>
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'zip'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রোজেক্ট ZIP ডাউনলোড' : 'Download ZIP Package'}</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{language === 'bn' ? 'APK তৈরির নির্দেশিকা' : 'Build Standalone APK'}</span>
          </button>
        </div>

        {/* TAB 1: Android Install / APK */}
        {activeTab === 'apk' && (
          <div className="space-y-4">
            {/* Direct PWA / WebAPK Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' ? '১. সরাসরি ফোনে ইনস্টল করুন (WebAPK)' : '1. Instant Phone Install (WebAPK)'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'bn' ? 'কোনো কোডিং ছাড়া আপনার অ্যান্ড্রয়েড বা আইফোনে হোমস্ক্রিন অ্যাপ হিসেবে যোগ করুন' : 'Instantly installs as a standalone native app icon on your home screen'}
                    </p>
                  </div>
                </div>

                {isInstalled && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                    {language === 'bn' ? 'ইতিমধ্যে ইনস্টল্ড' : 'Already Installed'}
                  </span>
                )}
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'ফুল-স্ক্রিন মোড (ব্রাউজারের বার ছাড়া চলে)' : 'Standalone full-screen display (no browser bar)'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'হোম স্ক্রিনে নিজস্ব অ্যাপ আইকন ও স্প্ল্যাশ স্ক্রিন' : 'Custom App launcher icon & splash screen'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{language === 'bn' ? 'অফলাইনেও সম্পূর্ণ কাজ করে' : 'Offline caching with service worker'}</span>
                </div>
              </div>

              {/* Install trigger button */}
              {isInstallable ? (
                <button
                  type="button"
                  onClick={async () => {
                    soundEffects.playAcceptedChime();
                    await install();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অ্যান্ড্রয়েড ফোনে অ্যাপ ইনস্টল করুন' : 'Install App on Device Now'}</span>
                </button>
              ) : isIOS ? (
                <div className="bg-sky-950/30 border border-sky-800/40 rounded-xl p-3 text-xs text-sky-200">
                  <div className="font-bold mb-1">iPhone / iPad ইনস্টল করার নিয়ম:</div>
                  <div>1. Safari ব্রাউজারের নিচের <strong>Share (শেয়ার)</strong> বাটনে ট্যাপ করুন।</div>
                  <div>2. নিচে স্ক্রোল করে <strong>"Add to Home Screen" (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।</div>
                </div>
              ) : (
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">💡 টিপস:</span>
                    <span>
                      {language === 'bn'
                        ? 'অ্যান্ড্রয়েড মোবাইলে Chrome ব্রাউজারের মেনুতে (⋮) গিয়ে "Install App" বা "Add to Home Screen" চাপুন।'
                        : 'On Android Chrome, tap the menu (⋮) and select "Install app" or "Add to Home screen".'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Standalone APK online conversion */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? '২. ১-ক্লিকে অনলাইন APK তৈরি (PWABuilder)' : '2. 1-Click Online APK Generator'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'bn' ? 'মাইক্রোসফট PWABuilder দিয়ে গুগল প্লে-স্টোর উপযোগী সাইনড .apk বা .aab ডাউনলোড করুন' : 'Generate signed Android .APK and .AAB packages for direct sideloading or Play Store'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p>
                  {language === 'bn'
                    ? '১. এই অ্যাপের লাইভ লিংক কপি করুন।'
                    : '1. Copy this live application web URL.'}
                </p>
                <p>
                  {language === 'bn'
                    ? '২. pwabuilder.com ওয়েবসাইটে লিংকটি পেস্ট করে "Package for Android" বাটনে চাপুন।'
                    : '2. Visit pwabuilder.com, paste your URL, and tap "Package for Android".'}
                </p>
                <p>
                  {language === 'bn'
                    ? '৩. এটি স্বয়ংক্রিয়ভাবে আপনার জন্য ইনস্টলযোগ্য .apk ফাইল তৈরি করে ডাউনলোড করে দেবে!'
                    : '3. It generates an installable .apk package with custom icons and splash screen.'}
                </p>
              </div>

              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
              >
                <span>PWABuilder.com খুলুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: Download ZIP Package */}
        {activeTab === 'zip' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'সম্পূর্ণ প্রোজেক্ট ও APK প্যাকেজ ZIP ফাইল' : 'Complete App Source & Android APK Bundle (.ZIP)'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'bn' ? 'ফাইল সাইজ: ~২.৫ মেগাবাইট · সোর্স কোড ও অ্যান্ড্রয়েড কনফিগারেশন' : 'Includes full React/Node codebase, PWA assets, AndroidManifest.xml & Capacitor bundle'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
                <div className="font-bold text-amber-400 font-sans">
                  {language === 'bn' ? 'জিপ ফাইলে যা যা অন্তর্ভুক্ত:' : 'ZIP Contents:'}
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div>📁 /src — সমস্ত React স্ক্রিপ্ট, ফিল্টার ইঞ্জিন, রাডার, সাউন্ড ও ক্যালকুলেটর</div>
                  <div>📁 /public — PWA আইকনসমূহ (192px, 512px, Maskable, Apple Touch)</div>
                  <div>📁 /android-apk-package — AndroidManifest.xml ও capacitor.config.json</div>
                  <div>📄 server.ts, package.json, vite.config.ts, tsconfig.json</div>
                  <div>📄 HOW_TO_GENERATE_APK.md — বিস্তারিত অফলাইন APK বিল্ড নির্দেশিকা</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadingZip
                    ? (language === 'bn' ? 'জিপ ফাইল তৈরি ও ডাউনলোড হচ্ছে...' : 'Preparing ZIP Download...')
                    : (language === 'bn' ? 'RidePilot-App-Package.zip ডাউনলোড করুন' : 'Download Full App ZIP Package')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Standalone Android APK Build via CLI */}
        {activeTab === 'guide' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'Capacitor দিয়ে নিজস্ব APK বিল্ড করার কমান্ড' : 'Build Native APK via Capacitor'}</span>
              </h4>
              <p className="text-xs text-slate-400">
                {language === 'bn'
                  ? 'আপনার কম্পিউটারে টার্মিনালে নিচের এক লাইনের কমান্ড রান করলে সরাসরি Android Studio-তে সম্পূর্ণ অ্যান্ড্রয়েড প্রোজেক্ট খুলে যাবে:'
                  : 'Run this command in the extracted project folder to scaffold native Android project and compile an APK:'}
              </p>

              <div className="relative bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                {capacitorCommand}
              </div>

              <button
                type="button"
                onClick={handleCopyCmd}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? (language === 'bn' ? 'কমান্ড কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কমান্ড কপি করুন' : 'Copy Build Command')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PWA & Android Standard Compliant</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
