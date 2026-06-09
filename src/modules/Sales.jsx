import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, Layers, Map, FileSpreadsheet } from 'lucide-react';
import { initialOrders, salesRepRanking, initialRetailers } from '../mockData';
import { DataTable } from '../components/Common';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function Sales({ showToast }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filterRegion, setFilterRegion] = useState('All');

  // Year on Year monthly comparison data
  const yoyComparisonData = [
    { month: 'Jan', lastYear: 8200000, thisYear: 9800000 },
    { month: 'Feb', lastYear: 8800000, thisYear: 10200000 },
    { month: 'Mar', lastYear: 11200000, thisYear: 13800000 },
    { month: 'Apr', lastYear: 10500000, thisYear: 11500000 },
    { month: 'May', lastYear: 11000000, thisYear: 12100000 },
    { month: 'Jun', lastYear: 11500000, thisYear: 12450000 }
  ];

  // Territory sales data
  const territorySalesData = [
    { name: 'Maharashtra', sales: 4500000 },
    { name: 'Delhi', sales: 3200000 },
    { name: 'Karnataka', sales: 2100000 },
    { name: 'Gujarat', sales: 1650000 },
    { name: 'Tamil Nadu', sales: 1000000 }
  ];

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    if (filterRegion === 'All') return true;
    return ord.city === filterRegion;
  });

  const columns = [
    { header: "Order ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono text-[13px]">{val}</span> },
    { header: "Retailer Outlet", accessor: "retailerName", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "City Region", accessor: "city" },
    { header: "Order Date", accessor: "date" },
    { header: "Total Value", accessor: "amount", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Payment Code", accessor: "paymentStatus", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${val === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
        {val}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Summary Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue (This Month)</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">₹1.24 Cr</h3>
            <span className="text-[10px] text-emerald-600 font-bold">+14.2% Growth vs Last Month</span>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Layers className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Territory Volume</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">Maharashtra Zone</h3>
            <span className="text-[10px] text-slate-500 font-medium">₹45.00 L contribution value</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Award className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Performing Rep</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">Amit Kumar</h3>
            <span className="text-[10px] text-emerald-600 font-bold">₹9.50 L Sales Record</span>
          </div>
        </div>
      </div>

      {/* Header and Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Filter By City Hub</label>
            <select 
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white"
            >
              <option value="All">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => showToast("Exporting sales spreadsheets...", "success")}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* YoY Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Sales Growth Chart (YoY Comparison)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yoyComparisonData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend fontSize={10} />
                <Line type="monotone" dataKey="thisYear" stroke="#f97316" name="This Year (2026)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="lastYear" stroke="#cbd5e1" name="Last Year (2025)" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Territory Sales Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={territorySalesData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rankings tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee sales rankings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Employee Sales Performance Rankings</h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Representative</th>
                  <th className="px-4 py-2.5">Region</th>
                  <th className="px-4 py-2.5 text-right">Revenue (₹)</th>
                  <th className="px-4 py-2.5 text-right">MoM Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesRepRanking.map((rep, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{rep.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{rep.location}</td>
                    <td className="px-4 py-2.5 text-right text-slate-900 font-bold">₹{rep.revenue.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-2.5 text-right font-bold ${rep.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{rep.growth >= 0 ? `+${rep.growth}` : rep.growth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Retailer growth rankings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Retailer Accounts Sales & Growth</h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Shop Name</th>
                  <th className="px-4 py-2.5">City Location</th>
                  <th className="px-4 py-2.5 text-right">Orders Volume</th>
                  <th className="px-4 py-2.5 text-right">Accrued Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialRetailers.slice(0, 4).map((ret, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{ret.shopName}</td>
                    <td className="px-4 py-2.5 text-slate-400">{ret.city}</td>
                    <td className="px-4 py-2.5 text-right text-slate-600">{ret.ordersCount} orders</td>
                    <td className="px-4 py-2.5 text-right text-slate-900 font-bold">₹{ret.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Order ledger list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <span className="block px-6 py-4 font-bold text-slate-800 border-b border-slate-100 font-display">Sales Transaction Ledger Logs</span>
        <DataTable 
          columns={columns} 
          data={filteredOrders} 
          searchKeys={["id", "retailerName", "city"]}
          searchPlaceholder="Search ledger details..."
        />
      </div>

    </div>
  );
}
