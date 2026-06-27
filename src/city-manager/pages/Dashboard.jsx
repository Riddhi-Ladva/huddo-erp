// src/city-manager/pages/Dashboard.jsx
import React from 'react';
import { 
  TrendingUp, MapPin, Phone, ShoppingCart, Store, CheckSquare, Calendar
} from 'lucide-react';
import { 
  StatWidget, 
  DashboardCard, 
  DashboardLineChart, 
  DashboardBarChart 
} from '../../components/DesignSystem';
import { formatCurrency, formatNumber } from '../cityManagerUtils';

export default function Dashboard({ 
  retailers, 
  pendingApprovals, 
  visitLogs, 
  monthlyRevenueData, 
  retailerSalesData, 
  onApprove, 
  onReject, 
  onNavigate,
  showToast 
}) {
  
  // Handlers
  const handleQuickApprove = (id) => {
    onApprove(id);
    showToast(`Approved item: ${id}`, 'success');
  };

  const handleQuickCall = (name) => {
    showToast(`Calling ${name}...`, 'info');
  };

  const categoryColors = {
    Platinum: '#fbbf24', // Gold yellow
    Gold: '#f59e0b',     // Amber
    Silver: '#94a3b8',   // Slate
    Standard: '#cbd5e1'  // Light Slate
  };

  // Filter visit plan for today (2026-06-13 in mockData)
  const todayVisits = visitLogs.filter(v => v.date === '2026-06-13');

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatWidget 
          title="City Revenue (June)" 
          value="₹6,48,000"
          delta={
            <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> +11.3% vs last month
            </span>
          }
          icon={TrendingUp}
          colorClass="text-emerald-600 bg-emerald-50"
          onClick={() => onNavigate("Sales Monitoring")}
        />
        <StatWidget 
          title="Total Orders" 
          value={formatNumber(87)}
          delta="+12 vs last month"
          icon={ShoppingCart}
          colorClass="text-blue-600 bg-blue-50"
          onClick={() => onNavigate("Orders")}
        />
        <StatWidget 
          title="My Retailers" 
          value={formatNumber(retailers.length)}
          delta={`${retailers.filter(r => r.status === 'Active').length} Active | ${retailers.filter(r => r.status !== 'Active').length} Pending`}
          icon={Store}
          colorClass="text-purple-600 bg-purple-50"
          onClick={() => onNavigate("My Retailers")}
        />
        <StatWidget 
          title="Pending Approvals" 
          value={formatNumber(pendingApprovals.length)}
          delta={pendingApprovals.length > 0 ? "Action Required" : "All clear"}
          icon={CheckSquare}
          colorClass="text-rose-600 bg-rose-50"
          onClick={() => onNavigate("Approvals")}
        />
        <StatWidget 
          title="Today's Visits" 
          value={formatNumber(todayVisits.length)}
          delta="2 retailers, 1 lead"
          icon={Calendar}
          colorClass="text-teal-600 bg-teal-50"
          onClick={() => onNavigate("Visit Logs")}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly revenue vs Target line chart */}
        <DashboardCard 
          title="Monthly Revenue vs Target" 
          subtitle="Plots achieved city revenue against target quota over the last 12 months."
          className="lg:col-span-7"
        >
          <DashboardLineChart 
            data={monthlyRevenueData}
            xKey="month"
            lineKey="revenue"
            tickFormatter={(v) => `₹${v/1000}k`}
            formatter={(val) => [formatCurrency(val), 'Revenue']}
          />
        </DashboardCard>

        {/* Right: Retailers sales horizontal Bar chart */}
        <DashboardCard 
          title="Retailer Revenue This Month" 
          subtitle="Ranks active retailer store payouts in this city boundary."
          className="lg:col-span-5"
        >
          <DashboardBarChart
            data={retailerSalesData}
            layout="vertical"
            yKey="name"
            barKey="revenue"
            tickFormatter={(v) => `₹${v/1000}k`}
            formatter={(val) => [formatCurrency(val), 'Revenue']}
          />
          <div className="flex items-center justify-center gap-4 mt-4 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded"></span> Platinum</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded"></span> Gold</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-400 rounded"></span> Silver</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-200 rounded"></span> Standard</div>
          </div>
        </DashboardCard>

      </div>

      {/* Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Pending Approvals */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Pending Approvals</h4>
            <span className="text-[9px] text-slate-450 font-bold uppercase">{pendingApprovals.length} pending</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((app) => (
                <div key={app.id} className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
                      app.type === 'Large Order' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {app.type}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                      app.urgency === 'High' ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {app.urgency}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700">
                    {app.type === 'Large Order' ? (
                      <div>
                        <span className="text-slate-800 font-bold block">{app.retailer}</span>
                        <span className="text-[10px] text-slate-400">Order {app.orderId} • {formatCurrency(app.amount)}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-800 font-bold block">{app.retailer}</span>
                        <span className="text-[10px] text-slate-400">Shop registration verification</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                    <span>Submitted: {app.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => onReject(app.id)}
                        className="px-2 py-1 border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-lg font-bold transition-all text-slate-600 cursor-pointer"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleQuickApprove(app.id)}
                        className="px-2 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg font-bold transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 italic text-xs font-semibold">
                No items pending approval.
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Today's Visit Plan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Today's Visit Plan</h4>
            <span className="text-[9px] text-slate-450 font-bold uppercase">{todayVisits.length} planned</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
            {todayVisits.length > 0 ? (
              todayVisits.map((log) => (
                <div key={log.id} className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl space-y-1 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{log.retailerName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold ${
                      log.gpsVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-105 text-slate-450'
                    } flex items-center gap-0.5`}>
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      {log.gpsVerified ? 'GPS Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span>{log.area}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-655 text-[8px]">{log.purpose}</span>
                    <span>•</span>
                    <span>In: {log.checkIn}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold italic">{log.outcome}</p>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 italic text-xs font-semibold">
                No visits planned for today.
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Retailer Alerts */}
        <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Retailer Alerts</h4>
            <span className="text-[9px] text-slate-455 font-bold uppercase">Scoped Ahmedabad</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1 text-xs">
            
            {/* Alert 1 */}
            <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="font-bold text-slate-850 block truncate">Classic Comfort</span>
                </div>
                <p className="text-[10px] text-rose-700 font-bold mt-1">₹19,000 outstanding for 14 days</p>
              </div>
              <button 
                onClick={() => handleQuickCall('Classic Comfort')}
                className="p-1.5 bg-rose-100/50 hover:bg-rose-105 border border-rose-200 rounded-lg text-rose-600 transition-all shrink-0 cursor-pointer"
                title="Call Retailer"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alert 2 */}
            <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="font-bold text-slate-850 block truncate">Urban Sole</span>
                </div>
                <p className="text-[10px] text-amber-700 font-bold mt-1">No order placed in 29 days</p>
              </div>
              <button 
                onClick={() => handleQuickCall('Urban Sole')}
                className="p-1.5 bg-amber-100/50 hover:bg-amber-105 border border-amber-200 rounded-lg text-amber-600 transition-all shrink-0 cursor-pointer"
                title="Call Retailer"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alert 3 */}
            <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="font-bold text-slate-850 block truncate">Footstep Fashion</span>
                </div>
                <p className="text-[10px] text-amber-700 font-bold mt-1">₹5,500 outstanding payment</p>
              </div>
              <button 
                onClick={() => handleQuickCall('Footstep Fashion')}
                className="p-1.5 bg-amber-100/50 hover:bg-amber-105 border border-amber-200 rounded-lg text-amber-600 transition-all shrink-0 cursor-pointer"
                title="Call Retailer"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alert 4 */}
            <div className="p-3 bg-emerald-50/40 border border-emerald-100/40 rounded-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-bold text-slate-850 block truncate">Patel Footwear</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">Platinum • Active status</p>
              </div>
              <span className="text-[9px] font-black text-emerald-705 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">Active</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
