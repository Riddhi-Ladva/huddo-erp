// src/state-manager/pages/MyIncentive.jsx
import { 
  BadgePercent, DollarSign, CreditCard
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils';

export default function MyIncentive({ 
  monthlyRevenueData, 
  myIncentive 
}) {

  // Derive historical incentive data from monthlyRevenueData
  // Rule: 4% of state revenue above ₹1,00,000 per month
  const derivedHistory = monthlyRevenueData.map((data) => {
    const revenue = data.revenue;
    const threshold = 1000000;
    const eligible = Math.max(0, revenue - threshold);
    const earned = eligible * 0.04;
    const isCurrentMonth = data.month === "Jun'26";
    
    return {
      month: data.month,
      revenue,
      eligible,
      rate: "4%",
      earned,
      status: isCurrentMonth ? "Pending" : "Paid"
    };
  });

  // Derived history reversed to show latest first
  const reversedHistory = [...derivedHistory].reverse();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">My Commission Ledger</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Review active incentive structures, threshold calculations, and monthly payout logs</p>
      </div>

      {/* Top Section: Structure & Current Month Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Structure Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <BadgePercent className="absolute right-4 bottom-4 w-32 h-32 text-slate-800/40 stroke-1 pointer-events-none" />
          
          <div className="space-y-4 relative">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-orange-500 text-white rounded-lg">
                <BadgePercent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400">Commission Slab</span>
            </div>

            <div>
              <h2 className="text-lg font-black text-white">{myIncentive.slab}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed">
                {myIncentive.rule}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>Effective Date: March 2022</span>
              <span>Updated: Bi-Annually</span>
            </div>
          </div>
        </div>

        {/* Right: June 2026 Math Breakdown */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">June 2026 Math Breakdown</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs font-semibold text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">State Revenue</span>
              <p className="font-bold text-slate-800 text-sm">{formatCurrency(myIncentive.thisMonthRevenue)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Base Threshold</span>
              <p className="font-bold text-slate-800 text-sm">{formatCurrency(1000000)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[9px] text-slate-400 uppercase">Eligible Revenue</span>
              <p className="font-bold text-slate-800 text-sm">{formatCurrency(myIncentive.thisMonthRevenue - 1000000)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Incentive Rate</span>
              <p className="font-bold text-slate-800 text-sm">4.0%</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl space-y-0.5 border border-orange-100">
              <span className="text-[9px] text-orange-600 uppercase">Incentive Earned</span>
              <p className="font-black text-orange-600 text-sm">{formatCurrency(myIncentive.thisMonthEarned)}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl space-y-0.5 border border-amber-100 col-span-2 sm:col-span-1">
              <span className="text-[9px] text-amber-600 uppercase">Payout Status</span>
              <p className="font-bold text-amber-600 text-[10px] truncate leading-none mt-1">Pending — End of June</p>
            </div>
          </div>
        </div>

      </div>

      {/* Three Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">This Month Earned</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(myIncentive.thisMonthEarned)}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Month Earned</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(myIncentive.lastMonthEarned)}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">YTD Earned (FY26-27)</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(myIncentive.ytdEarned)}</h3>
          </div>
        </div>

      </div>

      {/* Bar Chart: Monthly Incentive Earned — Last 12 Months */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Monthly Incentive Earned — Last 12 Months</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={derivedHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
              <Tooltip 
                formatter={(val) => [formatCurrency(val), '']}
                contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }}
              />
              <Bar dataKey="earned" name="Incentive Earned" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incentive History Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Payout Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3 text-right">State Revenue</th>
                <th className="py-2.5 px-3 text-right">Eligible Revenue</th>
                <th className="py-2.5 px-3 text-center">Rate</th>
                <th className="py-2.5 px-3 text-right">Earned</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reversedHistory.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">{row.month}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(row.eligible)}</td>
                  <td className="py-3 px-3 text-center font-bold">{row.rate}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(row.earned)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                      row.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {row.status}
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
