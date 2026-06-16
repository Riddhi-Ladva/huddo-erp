// src/city-manager/pages/SalesMonitoring.jsx
import { useState } from 'react';
import { 
  ArrowDownToLine, ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { formatCurrency, formatNumber, formatDate } from '../cityManagerUtils';

export default function SalesMonitoring({ 
  retailers, 
  monthlyRevenueData, 
  retailerSalesData, 
  showToast 
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState('revenue');
  const [sortDir, setSortDir] = useState('desc');

  const handleExport = () => {
    showToast('Exporting sales performance metrics to CSV...', 'success');
  };

  // Sort helper
  const sortData = (data, field, direction) => {
    return [...data].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (typeof valA === 'string') {
        return direction === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return direction === 'asc' ? valA - valB : valB - valA;
    });
  };

  const handleToggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Process donut categories data
  const pieData = [
    { name: 'Platinum', value: 187000, color: '#6366f1' },
    { name: 'Gold', value: 236000, color: '#f59e0b' },
    { name: 'Silver', value: 110000, color: '#94a3b8' },
    { name: 'Standard', value: 26000, color: '#cbd5e1' },
  ];

  // Process retailer table data (combining category filter)
  const baseRows = retailerSalesData.map(r => {
    const orig = retailers.find(o => o.businessName === r.name);
    
    // Mocks vs last month percentages
    const varianceMocks = {
      'Patel Footwear': 4.5,
      'Classic Comfort': 8.2,
      'Star Shoes': -2.1,
      'Metro Walk': 5.0,
      'Footstep Fashion': 1.8,
      'Urban Sole': 0
    };

    return {
      name: r.name,
      category: r.category,
      orders: r.orders,
      revenue: r.revenue,
      avgOrder: r.orders > 0 ? Math.round(r.revenue / r.orders) : 0,
      vsLastMonth: varianceMocks[r.name] || 0,
      lastOrder: orig ? orig.lastOrderDate : '2026-05-15'
    };
  }).filter(r => {
    if (categoryFilter !== 'All') {
      return r.category === categoryFilter;
    }
    return true;
  });

  const sortedRows = sortData(baseRows, sortField, sortDir);

  // Status order summary
  const orderStatusSummary = [
    { status: 'Delivered', count: 49, fill: '#10b981' },
    { status: 'Processing', count: 12, fill: '#6366f1' },
    { status: 'Approved', count: 8, fill: '#3b82f6' },
    { status: 'Shipped', count: 7, fill: '#06b6d4' },
    { status: 'Packed', count: 5, fill: '#a855f7' },
    { status: 'Pending Approval', count: 2, fill: '#f59e0b' },
    { status: 'Cancelled', count: 3, fill: '#f43f5e' }
  ];

  const categoryColors = {
    Platinum: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Gold: 'bg-amber-50 text-amber-700 border-amber-100',
    Silver: 'bg-slate-100 text-slate-700 border-slate-200',
    Standard: 'bg-zinc-100 text-zinc-650 border-zinc-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Sales — Ahmedabad</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Audit billing aggregates, category statistics, and ticket averages</p>
        </div>
        
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-650 hover:bg-orange-750 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center"
        >
          <ArrowDownToLine className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">City Revenue (June)</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-lg font-black text-slate-800">₹6,48,000</h3>
            <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-750 text-[8px] font-extrabold rounded-full">
              86.4% of Target
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Below June quota target</span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">vs Last Month</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-lg font-black text-slate-850">+₹21,000</h3>
            <span className="text-emerald-600 text-[10px] font-extrabold flex items-center gap-0.5">
              <ArrowUp className="w-3.5 h-3.5" /> +3.3%
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Incremental growth trend</span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Volume</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{formatNumber(87)} Orders</h3>
          <span className="text-[9px] text-slate-450 font-semibold mt-1 block">June cycles</span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Avg Order Value</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{formatCurrency(7448)}</h3>
          <span className="text-[9px] text-slate-450 font-semibold mt-1 block">Per transaction ticket size</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase">Scoped State: Gujarat</span>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Revenue vs Target — 12 Months</h3>
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

        {/* Donut Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Revenue by Retailer Category</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ahmedabad</span>
              <span className="text-sm font-black text-slate-800">{formatCurrency(559000)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-[8.5px] font-bold text-slate-500 uppercase tracking-wider mt-2">
            {pieData.map(it => (
              <div key={it.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: it.color }}></span>
                <span>{it.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Retailer comparative matrix */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Retailer Performance This Month</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => handleToggleSort('name')}>
                  <span className="flex items-center gap-1">Retailer <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => handleToggleSort('category')}>
                  <span className="flex items-center gap-1">Category <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-center cursor-pointer select-none" onClick={() => handleToggleSort('orders')}>
                  <span className="flex items-center justify-center gap-1">Orders <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => handleToggleSort('revenue')}>
                  <span className="flex items-center justify-end gap-1 font-bold text-slate-850">Revenue <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => handleToggleSort('avgOrder')}>
                  <span className="flex items-center justify-end gap-1">Avg Order <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => handleToggleSort('vsLastMonth')}>
                  <span className="flex items-center justify-end gap-1">vs Last Month <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3">Last Order Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRows.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-805">{row.name}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded-full ${categoryColors[row.category]}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">{row.orders}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-705">{formatCurrency(row.avgOrder)}</td>
                  <td className="py-3 px-3 text-right font-bold">
                    {row.vsLastMonth > 0 ? (
                      <span className="text-[10px] text-emerald-600 flex items-center justify-end gap-0.5">
                        <ArrowUp className="w-3 h-3" /> +{row.vsLastMonth}%
                      </span>
                    ) : row.vsLastMonth < 0 ? (
                      <span className="text-[10px] text-rose-650 flex items-center justify-end gap-0.5">
                        <ArrowDown className="w-3 h-3" /> {row.vsLastMonth}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">- 0.0%</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-bold">{row.lastOrder ? formatDate(row.lastOrder) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders This Month by Status */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Orders This Month — by Status</h3>
        
        {/* Stacked bar placeholder visual */}
        <div className="space-y-4">
          <div className="h-6 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200/50">
            {orderStatusSummary.map(item => (
              <div 
                key={item.status} 
                className="h-full hover:opacity-90 transition-all relative group"
                style={{ 
                  width: `${(item.count / 87) * 100}%`,
                  backgroundColor: item.fill 
                }}
                title={`${item.status}: ${item.count} orders`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs font-semibold">
            {orderStatusSummary.map(item => (
              <div key={item.status} className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">
                <span className="w-2.5 h-2.5 rounded-full inline-block mr-1.5" style={{ backgroundColor: item.fill }}></span>
                <span className="text-slate-500 font-bold block mt-1">{item.status}</span>
                <span className="text-sm font-black text-slate-800 block mt-0.5">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
