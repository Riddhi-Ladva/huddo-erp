// src/city-manager/pages/Dashboard.jsx
import { 
  TrendingUp, MapPin, Phone
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell
} from 'recharts';
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
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">City Revenue (June)</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-xl font-black text-slate-800">₹6,48,000</h3>
            <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> +11.3%
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">vs last month</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-xl font-black text-slate-800">{formatNumber(87)}</h3>
            <span className="text-blue-600 text-[10px] font-extrabold flex items-center gap-0.5">
              +12
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">vs last month</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-slate-350 transition-all" onClick={() => onNavigate('My Retailers')}>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">My Retailers</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-xl font-black text-slate-800">{formatNumber(retailers.length)}</h3>
          </div>
          <span className="text-[9px] text-indigo-500 font-extrabold mt-1 block">
            {retailers.filter(r => r.status === 'Active').length} Active | {retailers.filter(r => r.status !== 'Active').length} Pending
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-slate-350 transition-all" onClick={() => onNavigate('Approvals')}>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-bold text-rose-500">Pending Approvals</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-xl font-black text-rose-600">{formatNumber(pendingApprovals.length)}</h3>
            {pendingApprovals.length > 0 && (
              <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 text-[8px] font-extrabold rounded-full animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Orders & registrations</span>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-slate-350 transition-all" onClick={() => onNavigate('Visit Logs')}>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Today's Visits</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-xl font-black text-teal-600">{formatNumber(todayVisits.length)}</h3>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">2 retailers, 1 lead</span>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly revenue vs Target line chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Monthly Revenue vs Target — Last 12 Months</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="revenue" name="Achieved Revenue" stroke="#f97316" strokeWidth={3} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" name="Target Quota" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Retailers sales horizontal Bar chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Retailer Revenue This Month</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={retailerSalesData}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} width={80} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" name="Revenue Achieved" radius={[0, 4, 4, 0]} barSize={12}>
                  {retailerSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || '#ea580c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded"></span> Platinum</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded"></span> Gold</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-400 rounded"></span> Silver</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-200 rounded"></span> Standard</div>
          </div>
        </div>

      </div>

      {/* Panels Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Pending Approvals */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pending Approvals</h4>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{pendingApprovals.length} pending</span>
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
                        <span className="text-[10px] text-slate-400">Order {app.orderId} — {formatCurrency(app.amount)}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-800 font-bold block">{app.retailer}</span>
                        <span className="text-[10px] text-slate-400">Shop registration verification</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium">
                    <span>Submitted: {app.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => onReject(app.id)}
                        className="px-2 py-1 border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-lg font-bold transition-all text-slate-600"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleQuickApprove(app.id)}
                        className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-all"
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
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Visit Plan</h4>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{todayVisits.length} planned</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
            {todayVisits.length > 0 ? (
              todayVisits.map((log) => (
                <div key={log.id} className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl space-y-1 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{log.retailerName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold ${
                      log.gpsVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-450'
                    } flex items-center gap-0.5`}>
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      {log.gpsVerified ? 'GPS Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span>{log.area}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 text-[8px]">{log.purpose}</span>
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
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Retailer Alerts</h4>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Scoped Ahmedabad</span>
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
                className="p-1.5 bg-rose-100/50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-600 transition-all shrink-0"
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
                className="p-1.5 bg-amber-100/50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-600 transition-all shrink-0"
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
                className="p-1.5 bg-amber-100/50 hover:bg-amber-100 border border-amber-200 rounded-lg text-amber-600 transition-all shrink-0"
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
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg shrink-0">Active</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
