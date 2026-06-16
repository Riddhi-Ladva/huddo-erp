// PROMO-MODULE: All Promoters Analytics page implementation containing regional distribution, KPI indicators, and charts.

import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, BarChart3, PieChart, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { DataTable } from '../../../components/Common';
import { GEOGRAPHY } from '../../../mockData';

export default function PromoterAnalytics({ onNavigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Filters State
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [status, setStatus] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        state: selectedState,
        city: selectedCity,
        status,
        payment_status: paymentStatus
      });
      const res = await fetch(`/api/promoters/analytics?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      showToast("Failed to fetch analytics statistics.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedState, selectedCity, status, paymentStatus]);

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-sm font-semibold text-slate-500">Loading aggregate analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('list')}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Promoter Performance Analytics</h1>
            <p className="text-sm text-slate-500">Review organization-wide promoter activations, payout statuses, top performers, and regional summaries.</p>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Total Promoters</span>
          <span className="text-xl font-extrabold text-slate-800 mt-2 font-display">{analytics.total_promoters}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Active Profiles</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-2 font-display">{analytics.active_promoters}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Verified</span>
          <span className="text-xl font-extrabold text-blue-600 mt-2 font-display">{analytics.verified_promoters}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Total Revenue Generated</span>
          <span className="text-xl font-extrabold text-slate-800 mt-2 font-display">₹{analytics.total_revenue_generated.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          {/* PROMO-MODULE: Earned Royalty label strictly updated to show 5% */}
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Total Royalty Earned (5%)</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-2 font-display">₹{analytics.total_royalty_earned.toLocaleString('en-IN')}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Outstanding Payouts</span>
          <span className="text-xl font-extrabold text-rose-600 mt-2 font-display">₹{analytics.total_royalty_pending.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Filters & Visual Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Filters */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Analytics Filters</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('All');
                }}
                className="text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-bold"
              >
                <option value="All">All States</option>
                {GEOGRAPHY.states.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-bold"
              >
                <option value="All">All Cities</option>
                {GEOGRAPHY.cities
                  .filter(c => selectedState === 'All' || c.state === selectedState)
                  .map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Promoter Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-bold"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Payment Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 font-display">Payment Status Breakdown</h3>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Fully Paid Promoters</span>
                <span className="text-slate-800 font-bold">{analytics.payment_status_breakdown.Paid} accounts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2" style={{ width: `${(analytics.payment_status_breakdown.Paid / (analytics.total_promoters || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Unpaid Promoters</span>
                <span className="text-slate-800 font-bold">{analytics.payment_status_breakdown.Unpaid} accounts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-2" style={{ width: `${(analytics.payment_status_breakdown.Unpaid / (analytics.total_promoters || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Partially Paid Promoters</span>
                <span className="text-slate-800 font-bold">{analytics.payment_status_breakdown.Partial} accounts</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2" style={{ width: `${(analytics.payment_status_breakdown.Partial / (analytics.total_promoters || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Percentages calculated based on active registered partners.</span>
        </div>

        {/* Section D: Monthly New Promoters Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 font-display mb-3">Onboarding Trends (12 Months)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={analytics.monthly_new_promoters}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="count" name="New Promoters" fill="#ff6b00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance rankings and distributions tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section C: Top Performers Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">Top Performers Leaderboard</h3>
          <div className="overflow-x-auto text-xs font-semibold text-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="py-2">Rank</th>
                  <th className="py-2">Promoter</th>
                  <th className="py-2">Code</th>
                  <th className="py-2 text-right">Retailers</th>
                  <th className="py-2 text-right">Total Revenue</th>
                  {/* PROMO-MODULE: Earned Royalty label strictly updated to show 5% */}
                  <th className="py-2 text-right">Royalty Earned (5%)</th>
                  <th className="py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.top_performers.map((p, idx) => (
                  <tr key={p.promoter_id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-800">#{idx + 1}</td>
                    <td className="py-3 font-bold text-slate-800">{p.full_name}</td>
                    <td className="py-3">
                      <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[10px]">{p.promoter_code}</code>
                    </td>
                    <td className="py-3 text-right font-bold">{p.retailers} shops</td>
                    <td className="py-3 text-right font-bold text-slate-900">₹{p.revenue.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-bold text-emerald-600">₹{p.royalty_earned.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
                {analytics.top_performers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">No promoter performance records loaded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section E: City-wise Distribution Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">Geographic Distribution Breakdown</h3>
          <div className="overflow-x-auto text-xs font-semibold text-slate-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                  <th className="py-2">City</th>
                  <th className="py-2">State</th>
                  <th className="py-2 text-right">Promoters count</th>
                  <th className="py-2 text-right">Mapped Retailers</th>
                  <th className="py-2 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.city_wise_distribution.map((c, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-800">{c.city}</td>
                    <td className="py-3">{c.state}</td>
                    <td className="py-3 text-right font-bold text-slate-900">{c.promoter_count}</td>
                    <td className="py-3 text-right font-bold text-slate-700">{c.retailers} shops</td>
                    <td className="py-3 text-right font-bold text-slate-900">₹{c.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
