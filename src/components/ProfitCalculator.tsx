import React, { useState } from 'react';
import { Calculator, IndianRupee, Fuel, Percent, CheckCircle2, AlertOctagon, TrendingUp, Sparkles } from 'lucide-react';
import { VehicleProfile, VehicleType } from '../types';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface ProfitCalculatorProps {
  language: Language;
  profile: VehicleProfile;
  onUpdateProfile: (newProfile: VehicleProfile) => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  language,
  profile,
  onUpdateProfile,
}) => {
  const t = translations[language];

  const [testFare, setTestFare] = useState<number>(220);
  const [testTripKm, setTestTripKm] = useState<number>(10);
  const [testPickupKm, setTestPickupKm] = useState<number>(2.5);
  const [testDeadheadKm, setTestDeadheadKm] = useState<number>(2.0); // empty return distance

  // Total kilometers driven for this job
  const totalDrivenKm = testPickupKm + testTripKm + testDeadheadKm;

  // Platform cut
  const platformCut = Math.round(testFare * (profile.platformCommissionPercent / 100));

  // Fuel burned
  const fuelLiters = profile.mileagePerUnit > 0 ? totalDrivenKm / profile.mileagePerUnit : 0;
  const fuelCost = Math.round(fuelLiters * profile.fuelCostPerUnit);

  // Net Take-Home Pocket
  const netTakeHome = testFare - platformCut - fuelCost;

  // Real Net Rate Per Km (Total driven distance)
  const netRatePerKm = totalDrivenKm > 0 ? Math.round((netTakeHome / totalDrivenKm) * 10) / 10 : 0;
  const grossRatePerKm = testTripKm > 0 ? Math.round((testFare / testTripKm) * 10) / 10 : 0;

  // Profit health score
  const profitMarginPercent = testFare > 0 ? Math.round((netTakeHome / testFare) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-5 h-5 text-purple-400" />
          <span>{language === 'bn' ? 'তেল ও প্রকৃত নিট লাভ হিসাব ক্যালকুলেটর' : 'Real Net Profit & Fuel Expense Calculator'}</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          {language === 'bn'
            ? 'কোম্পানির দেওয়া মোট ভাড়া দেখেই সিদ্ধান্ত নেবেন না। পিকআপ দূরত্ব, প্ল্যাটফর্ম কমিশন এবং ফেরার খালি দূরত্ব হিসাব করে আপনার আসল পকেটের টাকা দেখুন।'
            : 'Gross fare from apps is deceptive. Factor in platform commission, pickup distance, and deadhead return fuel to discover actual take-home earnings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Trip parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'bn' ? '১. ট্রিপ প্যারামিটার' : '1. Trip Offer Parameters'}
            </h4>

            {/* Fare Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="calculatorFareInput" className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'ট্রিপের মোট ভাড়া (₹)' : 'Trip Gross Fare (₹)'}
                </label>
                <span className="text-base font-bold text-amber-400 font-mono">
                  ₹{testFare}
                </span>
              </div>
              <input
                id="calculatorFareInput"
                type="range"
                min={40}
                max={1200}
                step={10}
                value={testFare}
                onChange={(e) => setTestFare(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Trip Km */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="calculatorTripKmInput" className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'যাত্রী নিয়ে ভ্রমণের দূরত্ব (কিমি)' : 'Rider Trip Distance (km)'}
                </label>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {testTripKm} km
                </span>
              </div>
              <input
                id="calculatorTripKmInput"
                type="range"
                min={1}
                max={40}
                step={0.5}
                value={testTripKm}
                onChange={(e) => setTestTripKm(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Pickup Km */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="calculatorPickupKmInput" className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'প্যাসেঞ্জার পিকআপ দূরত্ব (বিনা ভাড়ার কিমি)' : 'Pickup Distance (Unpaid km)'}
                </label>
                <span className="text-sm font-bold text-sky-400 font-mono">
                  {testPickupKm} km
                </span>
              </div>
              <input
                id="calculatorPickupKmInput"
                type="range"
                min={0.2}
                max={10}
                step={0.2}
                value={testPickupKm}
                onChange={(e) => setTestPickupKm(Number(e.target.value))}
                className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Deadhead return Km */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="calculatorDeadheadKmInput" className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'ড্রপ এলাকা থেকে খালি ফেরার দূরত্ব (কিমি)' : 'Deadhead Empty Return Distance (km)'}
                </label>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  {testDeadheadKm} km
                </span>
              </div>
              <input
                id="calculatorDeadheadKmInput"
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={testDeadheadKm}
                onChange={(e) => setTestDeadheadKm(Number(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Vehicle & Fuel Rate Parameters */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'bn' ? '২. গাড়ির খরচ ও কমিশন' : '2. Fuel & Platform Cut'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="fuelPriceInput" className="text-[11px] text-slate-400 block mb-1">
                  {language === 'bn' ? 'জ্বালানি দর (₹/L)' : 'Fuel Price (₹/L)'}
                </label>
                <input
                  id="fuelPriceInput"
                  type="number"
                  value={profile.fuelCostPerUnit}
                  onChange={(e) =>
                    onUpdateProfile({
                      ...profile,
                      fuelCostPerUnit: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="vehicleMileageInput" className="text-[11px] text-slate-400 block mb-1">
                  {language === 'bn' ? 'মাইলেজ (কিমি/L)' : 'Mileage (km/L)'}
                </label>
                <input
                  id="vehicleMileageInput"
                  type="number"
                  value={profile.mileagePerUnit}
                  onChange={(e) =>
                    onUpdateProfile({
                      ...profile,
                      mileagePerUnit: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="platformCommissionInput" className="text-[11px] text-slate-400 block mb-1">
                  {language === 'bn' ? 'কমিশন (%)' : 'Platform Cut (%)'}
                </label>
                <input
                  id="platformCommissionInput"
                  type="number"
                  value={profile.platformCommissionPercent}
                  onChange={(e) =>
                    onUpdateProfile({
                      ...profile,
                      platformCommissionPercent: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'প্রকৃত নিট মুনাফা সারসংক্ষেপ' : 'Take-Home Net Breakdown'}
              </div>

              {/* Massive Net Amount */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center mb-4">
                <div className="text-xs text-slate-400 mb-1">
                  {language === 'bn' ? 'সব খরচ বাদে আপনার হাতে থাকবে' : 'Your Actual Pocket Profit'}
                </div>
                <div className={`text-4xl font-extrabold font-mono tabular-nums ${netTakeHome > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{netTakeHome}
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
                  <span>মার্জিন: <b className="text-white font-mono">{profitMarginPercent}%</b></span>
                  <span>·</span>
                  <span>কার্যকরী: <b className="text-emerald-400 font-mono">₹{netRatePerKm}/km</b></span>
                </div>
              </div>

              {/* Step-by-Step Waterfall */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-300">১. মোট ভাড়া (Gross Fare)</span>
                  <span className="font-bold text-white font-mono">+₹{testFare}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-rose-300">২. কোম্পানি কমিশন ({profile.platformCommissionPercent}%)</span>
                  <span className="font-bold text-rose-400 font-mono">-₹{platformCut}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-amber-300">
                    ৩. জ্বালানি খরচ ({totalDrivenKm} কিমির জন্য)
                  </span>
                  <span className="font-bold text-amber-400 font-mono">-₹{fuelCost}</span>
                </div>

                <div className="flex items-center justify-between py-2 text-sm font-bold border-t border-slate-700">
                  <span className="text-emerald-300">প্রকৃত নিট লাভ (Net Profit)</span>
                  <span className="text-emerald-400 font-mono">₹{netTakeHome}</span>
                </div>
              </div>
            </div>

            {/* Driver Recommendation */}
            <div className={`rounded-xl p-4 border text-xs leading-relaxed ${
              netTakeHome > 80 && netRatePerKm >= 14
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                : netTakeHome > 40
                ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
            }`}>
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {netTakeHome > 80 && netRatePerKm >= 14 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'অসাধারণ ট্রিপ! অবশ্যই গ্রহণ করুন' : 'Highly Profitable Trip! Accept'}</span>
                  </>
                ) : netTakeHome > 40 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>{language === 'bn' ? 'মাঝারি মানের ট্রিপ' : 'Fair Trip, Acceptable in Off-Peak'}</span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>{language === 'bn' ? 'লাভজনক নয়! প্রত্যাখ্যান করাই ভালো' : 'Low Profit! Better to Skip'}</span>
                  </>
                )}
              </div>
              <p>
                {language === 'bn'
                  ? `অ্যাপে মোট ভাড়া ₹${testFare} দেখালেও পিকআপ (${testPickupKm} কিমি) ও ফেরার খরচ যোগ করলে কার্যকর লাভ প্রতি কিমিতে ₹${netRatePerKm} দাঁড়ায়।`
                  : `Although the app shows gross ₹${testFare}, after driving ${totalDrivenKm} total km, your effective profit is ₹${netRatePerKm} per km.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
