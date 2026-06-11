import React from 'react';
import { 
  TrendingUp, ShoppingCart, Store, Award, AlertCircle, Users, ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { monthlyRevenueTrends, statePerformanceData, orderStatusDistribution, initialRetailers, initialOrders } from '../mockData';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard({ onNavigate }) {
  // Stat Card Details
  const stats = [
    { title: "Total Revenue", value: "₹1.24 Cr", icon: TrendingUp, delta: "+14.2% MoM", color: "text-emerald-600 bg-emerald-50" },
    { title: "Total Orders", value: "48", icon: ShoppingCart, delta: "+8% this week", color: "text-brand-orange bg-orange-50" },
    { title: "Total Retailers", value: "5", icon: Store, delta: "1 Pending Verification", color: "text-blue-600 bg-blue-50" },
    { title: "Total Promoters", value: "3", icon: Award, delta: "2 Active now", color: "text-purple-600 bg-purple-50" },
    // HUDDO-UPDATE: Dashboard — Label renamed from Outstanding to Total Payment
    { title: "Total Payment", value: "₹2.34 L", icon: AlertCircle, delta: "2 Overdue reminders sent", color: "text-rose-600 bg-rose-50" },
    { title: "Active Employees", value: "3", icon: Users, delta: "Across 6 Departments", color: "text-slate-600 bg-slate-100" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Founder Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, Rohan. Here is the operational distribution overview for Huddo Shoes today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">{stat.title}</span>
                <span className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 font-display">{stat.value}</h3>
                <span className="text-[10px] text-slate-400 font-medium">{stat.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Monthly Revenue Trend (₹)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueTrends} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Order Status Distribution</h3>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800 font-display">96</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1 mt-4 text-center">
            {orderStatusDistribution.map((entry, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full mb-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-[10px] text-slate-500 font-medium">{entry.name}</span>
                <span className="text-xs font-bold text-slate-700">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Country/State Performance Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">State Revenue Ranking (₹)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statePerformanceData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val / 100000}L`} />
                <YAxis dataKey="state" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {statePerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f97316' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Retailers Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">Top Retailers</h3>
            <button onClick={() => onNavigate("Retailers")} className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">City</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialRetailers.slice(0, 4).map((ret, idx) => (
                  <tr key={idx} className="text-xs text-slate-700">
                    <td className="py-2.5 font-semibold text-slate-800">{ret.shopName}</td>
                    <td className="py-2.5 text-slate-500">{ret.city}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">₹{ret.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Preview Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">Recent Orders</h3>
            <button onClick={() => onNavigate("Orders")} className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialOrders.slice(0, 4).map((ord, idx) => (
                  <tr key={idx} className="text-xs text-slate-700">
                    <td className="py-2.5 font-semibold text-slate-800">{ord.id}</td>
                    <td className="py-2.5 font-bold text-slate-900">₹{ord.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        ord.status === 'Approved' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
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
