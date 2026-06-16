// CM-MODULE: Frontend component for Country Manager Dashboard overview
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingCart, Store, Award, CheckSquare, Bell, ArrowUpRight, 
  MapPin, CheckCircle, XCircle, RefreshCw, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Cell 
} from 'recharts';
import { Modal } from '../../../components/Common';

export default function CountryManagerDashboard({ cmId, isTab = false, onNavigate, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approval action modal states
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalAction, setApprovalAction] = useState('Approved');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [actioning, setActioning] = useState(false);

  // Fallback cmId if not supplied (e.g. read from localStorage for logged-in CM)
  const resolvedCmId = cmId || 1;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/country-managers/${resolvedCmId}/dashboard`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Failed to compile dashboard metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [resolvedCmId]);

  const handleApprovalSubmit = async () => {
    if (!selectedApproval) return;
    setActioning(true);
    try {
      const res = await fetch(`/api/country-managers/${resolvedCmId}/approvals/${selectedApproval.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: approvalAction, remarks: approvalRemarks })
      });
      if (res.ok) {
        if (showToast) showToast(`Request ${approvalAction.toLowerCase()} successfully`, "success");
        setSelectedApproval(null);
        fetchDashboardData();
      }
    } catch (err) {
      if (showToast) showToast("Approval action failed", "error");
    } finally {
      setActioning(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
          <span>Synchronizing territorial metrics...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 bg-white border border-slate-200 rounded-xl">
        <p className="text-slate-500 font-bold">Failed to load dashboard metrics.</p>
      </div>
    );
  }

  const { profile_snapshot, kpi_cards, current_period_targets, state_performance, city_performance_top10, retailer_performance, revenue_analysis, sales_trends, recent_approvals } = data;

  const kpis = [
    { title: "Territory States", value: kpi_cards.total_states, delta: "Active coverage", icon: LayersIcon, color: "text-blue-600 bg-blue-50" },
    { title: "Cities Covered", value: kpi_cards.total_cities, delta: "Retail nodes", icon: MapPin, color: "text-emerald-600 bg-emerald-50" },
    { title: "Total Retailers", value: kpi_cards.total_retailers, delta: `${kpi_cards.active_retailers} Active`, icon: Store, color: "text-orange-600 bg-orange-50" },
    { title: "Total Promoters", value: kpi_cards.total_promoters, delta: "Active fields", icon: Award, color: "text-purple-600 bg-purple-50" },
    { title: "Pending Approvals", value: kpi_cards.pending_approvals, delta: "Action required", icon: CheckSquare, color: "text-rose-600 bg-rose-50" },
    { title: "Unread Alerts", value: kpi_cards.unread_notifications, delta: "System notifications", icon: Bell, color: "text-slate-600 bg-slate-100" }
  ];

  return (
    <div className="space-y-6 cm-dashboard-view">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <span className={`p-1.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 font-display">{stat.value}</h3>
                <span className="text-[9px] text-slate-400 font-semibold">{stat.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Progress Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wide">Current Target cycle (June 2026)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Target */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Revenue Target Progress</span>
              <span className="text-slate-800 font-bold">₹{current_period_targets.revenue.achieved.toLocaleString('en-IN')} / ₹{current_period_targets.revenue.target.toLocaleString('en-IN')} ({current_period_targets.revenue.pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${Math.min(current_period_targets.revenue.pct, 100)}%` }}></div>
            </div>
          </div>

          {/* Order Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Wholesale Orders count</span>
              <span className="text-slate-800 font-bold">{current_period_targets.orders.achieved} / {current_period_targets.orders.target} orders ({current_period_targets.orders.pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(current_period_targets.orders.pct, 100)}%` }}></div>
            </div>
          </div>

          {/* Retailer Acquisition */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-500">Retailer Acquisition</span>
              <span className="text-slate-800 font-bold">{current_period_targets.retailer_acquisition.achieved} / {current_period_targets.retailer_acquisition.target} stores ({current_period_targets.retailer_acquisition.pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(current_period_targets.retailer_acquisition.pct, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display uppercase tracking-wide">Monthly Revenue Trend (₹)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue_analysis.monthly_trend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Performance Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display uppercase tracking-wide">State Performance Ranking</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state_performance} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 100000}L`} />
                <YAxis dataKey="state_name" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {state_performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Cities by Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wide">Top Cities in Country</h3>
            {onNavigate && (
              <button onClick={() => onNavigate("Reports")} className="text-[10px] font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-0.5 transition-colors cursor-pointer">
                <span>View report</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">City</th>
                  <th className="pb-2">State</th>
                  <th className="pb-2 text-right">Orders</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {city_performance_top10.slice(0, 5).map((city, idx) => (
                  <tr key={idx} className="text-xs text-slate-700">
                    <td className="py-2.5 font-bold text-slate-800">{city.city_name}</td>
                    <td className="py-2.5 text-slate-550 font-semibold">{city.state_name}</td>
                    <td className="py-2.5 text-right font-bold text-slate-600">{city.orders}</td>
                    <td className="py-2.5 text-right font-extrabold text-slate-900">₹{city.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Approvals Queue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wide">Pending Approvals</h3>
            {onNavigate && (
              <button onClick={() => onNavigate("Approvals")} className="text-[10px] font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-0.5 transition-colors cursor-pointer">
                <span>Go to Inbox</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Reference</th>
                  <th className="pb-2">Submitted By</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent_approvals.length > 0 ? (
                  recent_approvals.slice(0, 5).map((app, idx) => (
                    <tr key={idx} className="text-xs text-slate-700">
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-bold ${
                          app.approval_type === 'Large_Order' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>{app.approval_type.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="py-2.5 font-bold text-slate-800">{app.reference_id}</td>
                      <td className="py-2.5 text-slate-500 font-semibold">{app.submitted_by_role}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => { setSelectedApproval(app); setApprovalAction('Approved'); setApprovalRemarks(''); }}
                          className="px-2 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[10px] font-bold rounded cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 font-bold">
                      No pending approvals in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sales Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales Trend Last 7 Days */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display uppercase tracking-wide">Daily Sales Trend (Last 7 Days)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales_trends.daily_this_week} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Products Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display uppercase tracking-wide">Top Products by Qty</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales_trends.top_products.map((prod, idx) => (
                  <tr key={idx} className="text-xs text-slate-700">
                    <td className="py-2.5 font-bold text-slate-800">{prod.name}</td>
                    <td className="py-2.5 text-right font-bold text-slate-600">{prod.quantity}</td>
                    <td className="py-2.5 text-right font-extrabold text-slate-950">₹{prod.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review overlay modal */}
      {selectedApproval && (
        <Modal
          isOpen={selectedApproval !== null}
          onClose={() => setSelectedApproval(null)}
          title={`Action Approval: ${selectedApproval.reference_label}`}
          onConfirm={handleApprovalSubmit}
          isDestructive={approvalAction === 'Rejected'}
        >
          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Decision Action</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input type="radio" checked={approvalAction === 'Approved'} onChange={() => setApprovalAction('Approved')} />
                  <span className="text-emerald-600">Approve Request</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                  <input type="radio" checked={approvalAction === 'Rejected'} onChange={() => setApprovalAction('Rejected')} />
                  <span className="text-rose-600">Reject Request</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Comments / Remarks</label>
              <textarea 
                rows="3" 
                placeholder="Enter audit remarks..." 
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Simple Layers icon replacement
function LayersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
