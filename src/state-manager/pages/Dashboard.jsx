// src/state-manager/pages/Dashboard.jsx
import React from 'react';
import { 
  TrendingUp, ShoppingCart, Store, Users, CheckSquare, 
  ArrowUpRight, MapPin, Check, X
} from 'lucide-react';
import { 
  StatWidget, 
  DashboardCard, 
  DashboardTable, 
  DashboardLineChart, 
  DashboardBarChart 
} from '../../components/DesignSystem';
import { formatCurrency, formatNumber } from '../utils';

export default function Dashboard({ 
  cityManagers = [], 
  monthlyRevenueData = [], 
  cityPerformanceData = [], 
  fieldForceData = [], 
  pendingApprovals = [], 
  onApprove, 
  onReject, 
  onNavigate 
}) {
  
  // Calculate stats
  const pendingApprovalsCount = pendingApprovals.length;
  const activeCityManagers = cityManagers.filter(cm => cm.status === 'Active').length;

  // Render helpers
  const getProgressColor = (pct) => {
    if (pct >= 90) return 'text-emerald-600 font-bold';
    if (pct >= 60) return 'text-amber-600 font-bold';
    return 'text-rose-600 font-bold';
  };

  const getProgressColorClass = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const tableColumns = [
    { header: "City", accessor: "city", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "City Manager", accessor: "name" },
    { header: "Retailers", accessor: "retailersCount" },
    { header: "Orders", accessor: "ordersThisMonth" },
    { header: "Target", accessor: "monthlyTarget", cellClassName: "text-right", render: (val) => <span>{formatCurrency(val)}</span> },
    { header: "Achieved", accessor: "achieved", cellClassName: "text-right font-bold text-slate-800", render: (val) => <span>{formatCurrency(val)}</span> },
    { header: "Achievement %", accessor: "monthlyTarget", render: (val, row) => {
      const achievementPct = val > 0 ? Math.round((row.achieved / val) * 100) : 0;
      return (
        <div className="flex items-center gap-3">
          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full ${getProgressColorClass(achievementPct)} rounded-full`}
              style={{ width: `${Math.min(achievementPct, 100)}%` }}
            ></div>
          </div>
          <span className={`text-[10px] ${getProgressColor(achievementPct)}`}>
            {achievementPct}%
          </span>
        </div>
      );
    }},
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${
        val === 'Active' 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
          : 'bg-slate-50 text-slate-500 border-slate-100'
      }`}>
        {val}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Gujarat Operations Overview</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Real-time state metrics, targets tracking and direct approval queues</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("Reports")}
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Generate State Report
          </button>
        </div>
      </div>

      {/* 1. Top Row: 5 KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatWidget 
          title="State Revenue (June)" 
          value={formatCurrency(1507000)}
          delta={
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +21.5% vs last month
            </span>
          }
          icon={TrendingUp}
          colorClass="text-emerald-600 bg-emerald-50"
          onClick={() => onNavigate("Sales Monitoring")}
        />
        <StatWidget 
          title="Total Orders" 
          value={formatNumber(304)}
          delta="+18 vs last month"
          icon={ShoppingCart}
          colorClass="text-blue-600 bg-blue-50"
          onClick={() => onNavigate("Orders")}
        />
        <StatWidget 
          title="Total Retailers" 
          value={formatNumber(159)}
          delta="3 new this month"
          icon={Store}
          colorClass="text-purple-600 bg-purple-50"
          onClick={() => onNavigate("Retailers")}
        />
        <StatWidget 
          title="City Managers" 
          value={formatNumber(cityManagers.length)}
          delta={`${activeCityManagers} active today`}
          icon={Users}
          colorClass="text-teal-600 bg-teal-50"
          onClick={() => onNavigate("City Managers")}
        />
        <StatWidget 
          title="Pending Approvals" 
          value={pendingApprovalsCount}
          delta="Action required"
          icon={CheckSquare}
          colorClass="text-orange-605 bg-orange-50"
          onClick={() => onNavigate("Approvals")}
        />
      </div>

      {/* 2. Second Row: Charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart (60% width on large screens) */}
        <DashboardCard 
          title="Monthly Revenue vs Target" 
          subtitle="Revenue trend comparison against target thresholds."
          className="lg:col-span-7"
        >
          <DashboardLineChart 
            data={monthlyRevenueData}
            xKey="month"
            lineKey="revenue"
            tickFormatter={(val) => `₹${val/100000}L`}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
          />
        </DashboardCard>

        {/* Right Chart (40% width on large screens) */}
        <DashboardCard 
          title="City Performance This Month" 
          subtitle="Ranks active cities target versus achievements."
          className="lg:col-span-5"
        >
          <DashboardBarChart 
            data={cityPerformanceData}
            layout="vertical"
            yKey="city"
            barKey="revenue"
            tickFormatter={(val) => `₹${val/100000}L`}
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          />
        </DashboardCard>

      </div>

      {/* 3. Third Row: City Manager Performance table */}
      <DashboardCard
        title="City Manager Performance"
        subtitle="Operational metrics tracked for all city managers."
        headerActions={
          <button 
            onClick={() => onNavigate("City Managers")}
            className="text-[11px] text-brand-orange font-bold hover:underline cursor-pointer"
          >
            Manage City Managers
          </button>
        }
      >
        <DashboardTable
          columns={tableColumns}
          data={cityManagers}
        />
      </DashboardCard>

      {/* 4. Fourth Row: Pending Approvals & Field Force Live */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Approvals list */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Approvals</h2>
              <button 
                onClick={() => onNavigate("Approvals")}
                className="text-[11px] text-brand-orange font-bold hover:underline cursor-pointer"
              >
                View Approvals Queue ({pendingApprovalsCount})
              </button>
            </div>
            
            <div className="space-y-3 min-h-[300px]">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.slice(0, 3).map((app) => {
                  const urgencyColors = app.urgency === 'High' 
                    ? 'bg-rose-50 text-rose-700 border-rose-100' 
                    : app.urgency === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-blue-50 text-blue-700 border-blue-100';

                  const typeColors = app.type === 'Large Order'
                    ? 'bg-orange-50 text-orange-700 border-orange-100'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100';

                  return (
                    <div key={app.id} className="p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${typeColors}`}>{app.type}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${urgencyColors}`}>{app.urgency} Urgency</span>
                        </div>
                        <p className="font-bold text-slate-800">
                          {app.type === 'Large Order' 
                            ? `${app.retailer} (${app.city}) — ${formatCurrency(app.amount)}` 
                            : `New Retailer Registration: ${app.retailer} in ${app.city}`
                          }
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Requested by {app.requestedBy} on {app.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button 
                          onClick={() => onApprove(app.id)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-100 cursor-pointer"
                          title="Approve Request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onReject(app.id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all border border-rose-100 cursor-pointer"
                          title="Reject Request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400">
                  <CheckSquare className="w-12 h-12 text-slate-300 stroke-1 mb-2" />
                  <p className="text-xs font-semibold">All approvals processed!</p>
                </div>
              )}
            </div>
          </div>
          
          {pendingApprovals.length > 3 && (
            <div className="text-center pt-2 border-t border-slate-50 mt-2">
              <button 
                onClick={() => onNavigate("Approvals")}
                className="text-[11px] text-slate-400 hover:text-slate-605 font-bold cursor-pointer"
              >
                + {pendingApprovals.length - 3} more pending approvals. Click to view all.
              </button>
            </div>
          )}
        </div>

        {/* Right: Field Force Live tracker */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Field Force Live</h2>
            <button 
              onClick={() => onNavigate("Field Force")}
              className="text-[11px] text-brand-orange font-bold hover:underline cursor-pointer"
            >
              Track Details
            </button>
          </div>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {fieldForceData.map((ff) => (
              <div key={ff.id} className="flex items-start justify-between gap-3 text-xs font-medium border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{ff.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{ff.city} Manager</p>
                  {ff.status === 'Active' ? (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1.5 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate max-w-[200px]">{ff.lastLocation}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic mt-1.5">Last active: {ff.lastActive || '-'}</p>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                    ff.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {ff.status === 'Active' ? 'Clocked In' : 'Not Clocked In'}
                  </span>
                  {ff.status === 'Active' && (
                    <p className="text-[10px] text-slate-555 font-bold">{ff.todayVisits} visits | {ff.distanceKm} km</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
