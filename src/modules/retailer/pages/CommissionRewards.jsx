import React, { useState } from 'react';
import { 
  Percent, Award, Landmark, TrendingUp, HelpCircle, 
  ArrowRight, ShieldCheck, AlertCircle, Clock, Calendar
} from 'lucide-react';

import { mockCommissionSummary, mockCommissions, mockRewardsHistory } from '../mockData/mockCommissions';

export default function CommissionRewards() {
  const [activeSubTab, setActiveSubTab] = useState('Commission'); // Commission | Rewards

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Commissions & Loyalty Rewards</h1>
          <p className="text-xs text-slate-500 font-medium">Track your shop commission settlements and loyalty point ledgers in real-time.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 self-start">
          <button
            onClick={() => setActiveSubTab('Commission')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'Commission' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-755'
            }`}
          >
            Commissions
          </button>
          <button
            onClick={() => setActiveSubTab('Rewards')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'Rewards' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-755'
            }`}
          >
            Loyalty Points Ledger
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Lifetime Earnings</span>
            <p className="text-lg font-extrabold text-slate-900 font-display mt-0.5">₹{mockCommissionSummary.lifetimeEarned.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">This Month's Earnings</span>
            <p className="text-lg font-extrabold text-slate-900 font-display mt-0.5">₹{mockCommissionSummary.thisMonthEarned.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Settlement</span>
            <p className="text-lg font-extrabold text-slate-900 font-display mt-0.5">₹{mockCommissionSummary.pendingSettlement.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-650 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Loyalty Points Balance</span>
            <p className="text-lg font-extrabold text-purple-700 font-display mt-0.5">{mockCommissionSummary.loyaltyPoints} PTS</p>
          </div>
        </div>

      </div>

      {/* Informative description banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-slate-650">
        <HelpCircle className="w-5 h-5 text-slate-450 shrink-0" />
        <p className="font-semibold text-slate-650">
          Commission payout percentages are determined by your dealer status. As a <span className="font-bold text-amber-600">Gold Dealer</span>, you receive a flat <span className="font-bold text-slate-800">5% commission</span> on all eligible stock purchases, settled directly into your billing account upon successful order delivery.
        </p>
      </div>

      {/* Tab Contents */}

      {/* Subtab 1: Commissions Table */}
      {activeSubTab === 'Commission' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 font-display">Commission Breakdown Log</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Date Logging</th>
                  <th className="px-4 py-2.5">Order ID</th>
                  <th className="px-4 py-2.5">Products Included</th>
                  <th className="px-4 py-2.5 text-right">Sale Value</th>
                  <th className="px-4 py-2.5 text-center">Comm. %</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-900">Commission Amount</th>
                  <th className="px-4 py-2.5 text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockCommissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/40">
                    <td className="px-4 py-3 text-slate-400 font-medium">{comm.date}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{comm.orderId}</td>
                    <td className="px-4 py-3 text-slate-550 font-medium line-clamp-1 max-w-[200px]">{comm.productName}</td>
                    <td className="px-4 py-3 text-right">₹{comm.saleAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-center">{comm.commissionRate}%</td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900">₹{comm.commissionAmount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                        comm.status === 'Settled' ? 'bg-emerald-50 text-emerald-705 border-emerald-200' :
                        'bg-amber-50 text-amber-705 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          comm.status === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                        {comm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Loyalty Points Ledger */}
      {activeSubTab === 'Rewards' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 font-display">Points Transaction History</h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Transaction Date</th>
                  <th className="px-4 py-2.5">Activity Description</th>
                  <th className="px-4 py-2.5 text-right">Transaction Type</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-900">Points Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRewardsHistory.map((rew, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40">
                    <td className="px-4 py-3 text-slate-400 font-medium">{rew.date}</td>
                    <td className="px-4 py-3 text-slate-750 font-bold">{rew.description}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        rew.type === 'credit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {rew.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-extrabold text-sm ${
                      rew.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {rew.points > 0 ? `+${rew.points}` : rew.points} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
