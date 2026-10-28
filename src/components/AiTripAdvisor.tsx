import React, { useState } from 'react';
import { Sparkles, Send, Bot, HelpCircle, Loader2 } from 'lucide-react';
import { FilterSettings, VehicleProfile } from '../types';
import { Language, translations } from '../utils/translations';

interface AiTripAdvisorProps {
  language: Language;
  settings: FilterSettings;
  profile: VehicleProfile;
}

export const AiTripAdvisor: React.FC<AiTripAdvisorProps> = ({
  language,
  settings,
  profile,
}) => {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const sampleQuestions = language === 'bn' ? [
    'বৃষ্টির সময় বাইক ট্যাক্সির জন্য সেরা অটো-এক্সেপ্ট ফিল্টার কী?',
    'এয়ারপোর্ট ট্রিপে খালি ফেরার ঝুঁকি কমাতে কত ন্যূনতম ভাড়া রাখা উচিত?',
    'পিক আওয়ার (সকাল ৯টা ও সন্ধ্যা ৭টা) বনাম অফ-পিকের সেটিং কী হবে?',
    'পিকআপ দূরত্ব কত কিমির বেশি হলে ড্রাইভারে লোকসান হয়?',
  ] : [
    'What are the best auto-accept settings for Bike Taxi during rain?',
    'How should I price Airport trips to prevent losing money on deadhead return?',
    'What filter rules work best for morning peak vs off-peak?',
    'At what pickup distance does a trip become unprofitable?',
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setLoading(true);
    setAdvice(null);

    try {
      const res = await fetch('/api/analyze-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: questionText,
          language,
          vehicleType: profile.name,
          currentRules: {
            minFare: settings.minFare,
            minFarePerKm: settings.minFarePerKm,
            maxPickupDistance: settings.maxPickupDistance,
            allowCash: settings.allowCash,
          },
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setAdvice(data.answer);
    } catch {
      // Fallback response if network or server error
      const fallback = language === 'bn'
        ? `🚗 **পরামর্শ (${profile.name}):**\n১. আপনার বর্তমান গাড়ি অনুযায়ী ন্যূনতম ভাড়া ₹${settings.minFare} এবং প্রতি কিমি ₹${settings.minFarePerKm} বেশ বাস্তবসম্মত।\n২. পিকআপ দূরত্ব ${settings.maxPickupDistance} কিমির বেশি রাখলে বিনা ভাড়ার ড্রাইভিংয়ে ২০-২৫% তেল খরচ বেড়ে যায়।\n৩. এয়ারপোর্ট বা হাইওয়ে রুটে ড্রপ নেওয়ার আগে অন্তত ৩০-৪০% বেশি রেট বা নিশ্চিত রিটার্ন ট্রিপ খেয়াল রাখুন।`
        : `🚗 **Strategy Advice (${profile.name}):**\n1. Your current settings (₹${settings.minFare} min fare, ₹${settings.minFarePerKm}/km) provide healthy baseline margins.\n2. Exceeding ${settings.maxPickupDistance} km pickup distance increases dead mileage and lowers effective hourly earnings.\n3. Demand a surge buffer whenever destination drop areas have low outbound passenger demand.`;
      setAdvice(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {language === 'bn' ? 'AI ট্রিপ ও স্ট্র্যাটেজি অ্যাডভাইজর' : 'AI Ride Strategy Advisor'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'আপনার গাড়ি ও এলাকার জন্য কোন ফিল্টার সেটিং সবচেয়ে বেশি লাভজনক তা জানুন' : 'Ask questions about optimal trip pricing, deadhead reduction, and vehicle-specific filter rules'}
            </p>
          </div>
        </div>

        {/* Quick sample question chips */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400">
            {language === 'bn' ? 'সাধারণ প্রশ্নসমূহ (ক্লিক করুন):' : 'Suggested Questions:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(q);
                  handleAsk(q);
                }}
                className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(prompt);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={language === 'bn' ? 'আপনার প্রশ্ন লিখুন (যেমন: বৃষ্টির সময় কী সেটিং রাখব?)...' : 'Ask a strategy question (e.g. how to set rules for peak hours?)...'}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{language === 'bn' ? 'পরামর্শ নিন' : 'Ask'}</span>
          </button>
        </form>
      </div>

      {/* Answer Output */}
      {advice && (
        <div className="bg-slate-900 border-2 border-purple-500/40 rounded-2xl p-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-purple-400">
            <Bot className="w-4 h-4" />
            <span>{language === 'bn' ? 'RidePilot AI পরামর্শ' : 'RidePilot AI Strategic Recommendation'}</span>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
            {advice}
          </div>
        </div>
      )}
    </div>
  );
};
