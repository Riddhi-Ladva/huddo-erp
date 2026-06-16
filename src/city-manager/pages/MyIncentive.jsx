// src/city-manager/pages/MyIncentive.jsx
import { 
  BadgePercent, DollarSign, Calendar, AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency } from '../cityManagerUtils';

export default function MyIncentive({ myIncentive }) {
  
  const statusColors = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Pending: 'bg-amber-50 text-amber-700 border-amber-100'
  };

  // Process history data for chart (Jun 2026 -> Jan 2026, let's reverse to show chronologically left-to-right)
  const chartData = [...myIncentive.history].reverse().map(h => ({
    month: h.month.replace(" 2026", "").replace(" 2025", ""),
    incentive: h.earned
  }));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">My Incentive — Arjun Patel</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Review bonus allocations, slab rules, and monthly performance payouts</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-450 uppercase block">This Month Earned</span>
            <h3 className="text-lg font-black text-slate-850 mt-2">{formatCurrency(myIncentive.thisMonthEarned)}</h3>
          </div>
          <div className="p-2 bg-orange-50 border border-orange-100 text-orange-600 rounded-xl">
            <BadgePercent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-450 uppercase block">Last Month Payout</span>
            <h3 className="text-lg font-black text-slate-850 mt-2">{formatCurrency(myIncentive.lastMonthEarned)}</h3>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-450 uppercase block">YTD Incentive (FY26-27)</span>
            <h3 className="text-lg font-black text-slate-850 mt-2">{formatCurrency(myIncentive.ytdEarned)}</h3>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Slabs and Math */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Slab Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Incentive Structure</span>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-800 uppercase block">{myIncentive.slab} Active Slab</span>
              <p className="text-xs text-slate-600 font-bold bg-slate-50 border border-slate-100 p-2.5 rounded-xl leading-relaxed">
                Rule: {myIncentive.rule}
              </p>
            </div>
            <span className="text-[9.5px] text-slate-450 font-bold block mt-2">Effective From: June 2022</span>
          </div>

          {/* Calculator Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">June 2026 Payout Ledger</span>
            
            <div className="space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center justify-between">
                <span>City Revenue (June 2026)</span>
                <span className="font-bold text-slate-800">{formatCurrency(myIncentive.thisMonthRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Base Threshold Deduction</span>
                <span className="text-rose-600 font-bold">- {formatCurrency(myIncentive.baseThreshold)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-2 font-bold text-slate-805">
                <span>Eligible Commission Revenue</span>
                <span>{formatCurrency(myIncentive.eligibleRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Royalty Rate Applied</span>
                <span className="text-orange-600 font-bold">3% (0.03)</span>
              </div>
              
              <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                <span className="font-black text-slate-800 uppercase tracking-wider">Incentive Earned</span>
                <span className="text-lg font-black text-orange-600">{formatCurrency(myIncentive.thisMonthEarned)}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5 text-[10px] font-bold text-amber-805 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="block font-black uppercase text-amber-850">Payout Status: PENDING</span>
                <span>Incentive payouts are disbursed on the {myIncentive.payoutDate} after audit checks.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Monthly Incentive — Last 12 Months</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }} />
                <Bar dataKey="incentive" name="Earned Incentive" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* History Ledger Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Incentive Payout Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3">Period Month</th>
                <th className="py-2.5 px-3 text-right">City Revenue</th>
                <th className="py-2.5 px-3 text-right">Eligible Revenue</th>
                <th className="py-2.5 px-3 text-center">Rate</th>
                <th className="py-2.5 px-3 text-right">Incentive Earned</th>
                <th className="py-2.5 px-3 text-right">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myIncentive.history.map((hist) => (
                <tr key={hist.month} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">{hist.month}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-650">{formatCurrency(hist.revenue)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-650">{formatCurrency(hist.eligible)}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-500">3.0%</td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(hist.earned)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusColors[hist.status]}`}>
                      {hist.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
