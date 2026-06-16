// src/state-manager/pages/Dashboard.jsx
import { 
  TrendingUp, ShoppingCart, Store, Users, CheckSquare, 
  ArrowUpRight, MapPin, Check, X
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar
} from 'recharts';
import { formatCurrency, formatNumber } from '../utils';

export default function Dashboard({ 
  cityManagers, 
  monthlyRevenueData, 
  cityPerformanceData, 
  fieldForceData, 
  pendingApprovals, 
  onApprove, 
  onReject, 
  onNavigate 
}) {
  
  // Calculate stats
  const pendingApprovalsCount = pendingApprovals.length;
  const activeCityManagers = cityManagers.filter(cm => cm.status === 'Active').length;

  // Render helpers
  const getProgressColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getProgressTextClass = (pct) => {
    if (pct >= 90) return 'text-emerald-700 bg-emerald-50';
    if (pct >= 60) return 'text-amber-700 bg-amber-50';
    return 'text-rose-700 bg-rose-50';
  };

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
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all"
          >
            Generate State Report
          </button>
        </div>
      </div>

      {/* 1. Top Row: 5 KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">State Revenue (June)</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-800">{formatCurrency(1507000)}</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +21.5% vs last month
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Total Orders</span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-800">{formatNumber(304)}</h3>
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 mt-1">
              +18 vs last month
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Total Retailers</span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <Store className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-800">{formatNumber(159)}</h3>
            <span className="text-[10px] font-bold text-purple-600 flex items-center gap-0.5 mt-1">
              3 new this month
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">City Managers</span>
            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-800">{formatNumber(cityManagers.length)}</h3>
            <span className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5 mt-1">
              {activeCityManagers} active today
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold tracking-wider uppercase">Pending Approvals</span>
            <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-black text-slate-800">{pendingApprovalsCount}</h3>
            <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5 mt-1">
              Action required
            </span>
          </div>
        </div>

      </div>

      {/* 2. Second Row: Charts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart (60% width on large screens) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Monthly Revenue vs Target</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `₹${val/100000}L`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="revenue" name="Achieved Revenue" stroke="#ea580c" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" name="Monthly Target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart (40% width on large screens) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">City Performance This Month</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityPerformanceData} layout="vertical" margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `₹${val/100000}L`} />
                <YAxis type="category" dataKey="city" stroke="#94a3b8" fontSize={10} tickLine={false} width={70} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Achieved" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Third Row: City Manager Performance table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">City Manager Performance</h2>
          <button 
            onClick={() => onNavigate("City Managers")}
            className="text-[11px] text-orange-600 font-bold hover:underline"
          >
            Manage City Managers
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">City Manager</th>
                <th className="py-2.5 px-3">Retailers</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3 text-right">Target</th>
                <th className="py-2.5 px-3 text-right">Achieved</th>
                <th className="py-2.5 px-3">Achievement %</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium text-slate-600 divide-y divide-slate-100">
              {cityManagers.map((cm) => {
                const targetVal = cm.monthlyTarget;
                const achievedVal = cm.achieved;
                const achievementPct = targetVal > 0 ? Math.round((achievedVal / targetVal) * 100) : 0;
                
                return (
                  <tr key={cm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{cm.city}</td>
                    <td className="py-3 px-3">{cm.name}</td>
                    <td className="py-3 px-3">{cm.retailersCount}</td>
                    <td className="py-3 px-3">{cm.ordersThisMonth}</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(targetVal)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(achievedVal)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(achievementPct)} rounded-full`}
                            style={{ width: `${Math.min(achievementPct, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-extrabold ${getProgressTextClass(achievementPct)}`}>
                          {achievementPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        cm.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        {cm.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Fourth Row: Pending Approvals & Field Force Live */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Approvals list */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Approvals</h2>
              <button 
                onClick={() => onNavigate("Approvals")}
                className="text-[11px] text-orange-600 font-bold hover:underline"
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
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all border border-emerald-100"
                          title="Approve Request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onReject(app.id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all border border-rose-100"
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
                className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
              >
                + {pendingApprovals.length - 3} more pending approvals. Click to view all.
              </button>
            </div>
          )}
        </div>

        {/* Right: Field Force Live tracker */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Field Force Live</h2>
            <button 
              onClick={() => onNavigate("Field Force")}
              className="text-[11px] text-orange-600 font-bold hover:underline"
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
                    <p className="text-[10px] text-slate-500 font-bold">{ff.todayVisits} visits | {ff.distanceKm} km</p>
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
