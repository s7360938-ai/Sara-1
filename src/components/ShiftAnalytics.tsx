import React, { useState } from 'react';
import { 
  BarChart3, 
  IndianRupee, 
  Fuel, 
  TrendingUp, 
  Download, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { RideOffer, ShiftStats } from '../types';
import { Language, translations } from '../utils/translations';
import { soundEffects } from '../utils/audio';

interface ShiftAnalyticsProps {
  language: Language;
  stats: ShiftStats;
  tripHistory: RideOffer[];
  onClearHistory: () => void;
}

export const ShiftAnalytics: React.FC<ShiftAnalyticsProps> = ({
  language,
  stats,
  tripHistory,
  onClearHistory,
}) => {
  const t = translations[language];
  const [filterType, setFilterType] = useState<'all' | 'accepted' | 'rejected'>('all');

  const acceptanceRate = stats.totalEvaluated > 0
    ? Math.round((stats.acceptedCount / stats.totalEvaluated) * 100)
    : 0;

  const averagePerKm = stats.totalKilometers > 0
    ? Math.round((stats.totalNetProfit / stats.totalKilometers) * 10) / 10
    : 0;

  const filteredTrips = tripHistory.filter((t) => {
    if (filterType === 'accepted') return t.status === 'auto_accepted' || t.status === 'manually_accepted';
    if (filterType === 'rejected') return t.status === 'rejected';
    return true;
  });

  const handleExportCSV = () => {
    soundEffects.playToggleClick();
    if (tripHistory.length === 0) return;

    const headers = ['ID', 'Platform', 'Pickup', 'Drop', 'Fare', 'Rate_Per_Km', 'Status', 'Net_Profit'];
    const rows = tripHistory.map((trip) => [
      trip.id,
      trip.platform,
      `"${trip.pickupLocation}"`,
      `"${trip.dropLocation}"`,
      trip.fare,
      trip.farePerKm,
      trip.status,
      trip.netProfit,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ridepilot_shift_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Shift KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 mb-1">{t.grossEarnings}</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ₹{stats.totalGrossEarnings}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.acceptedCount} {language === 'bn' ? 'টি সফল রাইড' : 'rides completed'}
          </div>
        </div>

        {/* Net Pocket Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 mb-1">{t.netTakeHome}</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            ₹{stats.totalNetProfit}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <span>{averagePerKm} ₹/km net</span>
          </div>
        </div>

        {/* Fuel Expense */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 mb-1">{t.fuelExpense}</div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            ₹{stats.totalFuelCost}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.totalKilometers} km driven
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 mb-1">
            {language === 'bn' ? 'অটো-এক্সেপ্ট হার' : 'Acceptance Rate'}
          </div>
          <div className="text-2xl font-bold text-sky-400 font-mono tabular-nums">
            {acceptanceRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats.acceptedCount} accepted / {stats.rejectedCount} declined
          </div>
        </div>
      </div>

      {/* Trips Table & Filter controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'সব ট্রিপ' : 'All'} ({tripHistory.length})
            </button>
            <button
              onClick={() => setFilterType('accepted')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'accepted'
                  ? 'bg-slate-800 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'গৃহীত' : 'Accepted'} ({stats.acceptedCount})
            </button>
            <button
              onClick={() => setFilterType('rejected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterType === 'rejected'
                  ? 'bg-slate-800 text-rose-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'bn' ? 'প্রত্যাখ্যাত' : 'Declined'} ({stats.rejectedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={tripHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportReport}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playToggleClick();
                onClearHistory();
              }}
              disabled={tripHistory.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearHistory}</span>
            </button>
          </div>
        </div>

        {/* Trips List */}
        {filteredTrips.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            {language === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি।' : 'No records found in this view.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">আইডি / অ্যাপ</th>
                  <th className="py-2.5 px-3 font-semibold">রুট (পিকআপ → ড্রপ)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">দূরত্ব</th>
                  <th className="py-2.5 px-3 font-semibold text-right">মোট ভাড়া</th>
                  <th className="py-2.5 px-3 font-semibold text-right">হার/কিমি</th>
                  <th className="py-2.5 px-3 font-semibold text-right">নিট লাভ</th>
                  <th className="py-2.5 px-3 font-semibold text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTrips.map((trip) => {
                  const isAccepted = trip.status === 'auto_accepted' || trip.status === 'manually_accepted';
                  return (
                    <tr key={trip.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-3 font-sans">
                        <div className="font-semibold text-white uppercase text-[11px]">{trip.platform}</div>
                        <div className="text-[10px] text-slate-400">{trip.id}</div>
                      </td>
                      <td className="py-3 px-3 font-sans max-w-xs">
                        <div className="text-slate-200 truncate">{trip.dropLocation}</div>
                        <div className="text-[11px] text-slate-400 truncate">from {trip.pickupLocation}</div>
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-300">
                        {trip.tripDistanceKm}km
                        <div className="text-[10px] text-slate-400">+{trip.pickupDistanceKm}km pickup</div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                        ₹{trip.fare}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">
                        ₹{trip.farePerKm}
                      </td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-amber-400">
                        ₹{trip.netProfit}
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        {trip.status === 'auto_accepted' && (
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            {language === 'bn' ? 'অটো-গৃহীত' : 'Auto'}
                          </span>
                        )}
                        {trip.status === 'manually_accepted' && (
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            {language === 'bn' ? 'গৃহীত' : 'Manual'}
                          </span>
                        )}
                        {trip.status === 'rejected' && (
                          <span className="text-rose-400 font-semibold text-[11px]">
                            {language === 'bn' ? 'প্রত্যাখ্যাত' : 'Declined'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
