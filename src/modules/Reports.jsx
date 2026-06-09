import React, { useState } from 'react';
import { FileText, Download, Filter, BarChart, Calendar, ChevronRight } from 'lucide-react';
import { DataTable } from '../components/Common';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Cell } from 'recharts';

export default function Reports({ showToast }) {
  const [selectedReportType, setSelectedReportType] = useState('sales'); // sales | revenue | commission | retailer | employee | team | product | territory
  const [dateFilter, setDateFilter] = useState('2026-06-08');

  // Sales report mock data
  const salesReportData = [
    { name: 'Maharashtra Zone', amount: 4500000, orders: 85, target: 5000000 },
    { name: 'Delhi NCR Zone', amount: 3200000, orders: 60, target: 4000000 },
    { name: 'Karnataka Zone', amount: 2100000, orders: 45, target: 3000000 },
    { name: 'Gujarat Zone', amount: 1650000, orders: 35, target: 2000000 }
  ];

  // Product report mock data
  const productReportData = [
    { name: 'Huddo Air Classic', category: 'Sports Shoes', sold: 280, revenue: 839720 },
    { name: 'Huddo Flex Runner', category: 'Sports Shoes', sold: 240, revenue: 599760 },
    { name: 'Huddo Elegant Derby', category: 'Formal Shoes', sold: 180, revenue: 899820 },
    { name: 'Huddo Leather Loafer', category: 'Casual Shoes', sold: 150, revenue: 524850 }
  ];

  // Territory report mock data
  const territoryReportData = [
    { name: 'Maharashtra', retailers: 15, growth: 12.5, revenue: 4500000 },
    { name: 'Delhi NCR', retailers: 10, growth: 8.2, revenue: 3200000 },
    { name: 'Karnataka', retailers: 9, growth: 5.4, revenue: 2100000 },
    { name: 'Gujarat', retailers: 8, growth: 14.1, revenue: 1650000 }
  ];

  const handleExport = (format) => {
    showToast(`Exporting ${selectedReportType.toUpperCase()} Report to ${format.toUpperCase()} format...`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Layout Shell: Left Navigation + Main Output */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left reports menu panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 self-start">
          <span className="block text-[10px] uppercase font-bold text-slate-400 p-2">Reports Categories</span>
          {[
            { id: 'sales', label: 'Sales Reports' },
            { id: 'revenue', label: 'Revenue Analysis' },
            { id: 'commission', label: 'Commission Ledgers' },
            { id: 'retailer', label: 'Retailer Rankings' },
            { id: 'employee', label: 'Employee Performance' },
            { id: 'team', label: 'Team Progress' },
            { id: 'product', label: 'Product Catalog Metrics' },
            { id: 'territory', label: 'Territory Revenue' }
          ].map(rpt => (
            <button
              key={rpt.id}
              onClick={() => setSelectedReportType(rpt.id)}
              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-between ${
                selectedReportType === rpt.id 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{rpt.label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Main report output canvas */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="text-xs border border-slate-200 rounded p-1.5 focus:outline-none bg-white font-semibold" />
            </div>

            <div className="flex gap-2">
              {['csv', 'excel', 'pdf'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] font-bold uppercase text-slate-700 bg-white flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Charts preview section at top */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 font-display capitalize">{selectedReportType} Report Visualization</h3>
            <div className="h-56">
              {selectedReportType === 'sales' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={salesReportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                    <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]} name="Achieved Sales (₹)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}

              {selectedReportType === 'product' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={productReportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                    <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 1000}K`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Accrued Revenue (₹)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}

              {selectedReportType === 'territory' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={territoryReportData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                    <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} name="Total Sales (₹)" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {!['sales', 'product', 'territory'].includes(selectedReportType) && (
                <div className="h-full flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                  <span className="text-xs font-semibold text-slate-400">Loading custom visualizer matrix...</span>
                </div>
              )}
            </div>
          </div>

          {/* Tables section */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <span className="block px-6 py-4 border-b border-slate-100 font-bold text-slate-800 font-display capitalize">{selectedReportType} Report Output Ledger</span>
            
            {selectedReportType === 'sales' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Area / Entity Zone</th>
                    <th className="px-6 py-3 text-right">Orders Volume</th>
                    <th className="px-6 py-3 text-right">Target Amount (₹)</th>
                    <th className="px-6 py-3 text-right">Achieved Sales (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesReportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3.5 text-slate-900 font-bold">{row.name}</td>
                      <td className="px-6 py-3.5 text-right text-slate-600">{row.orders} orders</td>
                      <td className="px-6 py-3.5 text-right">₹{row.target.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-3.5 text-right text-slate-900 font-bold">₹{row.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedReportType === 'product' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Model Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-right">Total Pairs Sold</th>
                    <th className="px-6 py-3 text-right">Total Net Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productReportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3.5 text-slate-900 font-bold">{row.name}</td>
                      <td className="px-6 py-3.5 text-slate-400">{row.category}</td>
                      <td className="px-6 py-3.5 text-right text-slate-600">{row.sold} pairs</td>
                      <td className="px-6 py-3.5 text-right text-slate-900 font-bold">₹{row.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedReportType === 'territory' && (
              <table className="w-full text-left text-xs font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Territory</th>
                    <th className="px-6 py-3 text-right">Mapped Shops</th>
                    <th className="px-6 py-3 text-right">Growth Rate</th>
                    <th className="px-6 py-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {territoryReportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3.5 text-slate-900 font-bold">{row.name}</td>
                      <td className="px-6 py-3.5 text-right text-slate-600">{row.retailers} outlets</td>
                      <td className="px-6 py-3.5 text-right text-emerald-600 font-bold">+{row.growth}%</td>
                      <td className="px-6 py-3.5 text-right text-slate-900 font-bold">₹{row.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!['sales', 'product', 'territory'].includes(selectedReportType) && (
              <div className="p-8 text-center text-slate-400 font-semibold">
                <span>Select Sales, Product, or Territory reports to view active ledger metrics.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
