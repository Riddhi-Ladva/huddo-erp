import React, { useState } from 'react';
import { FileText, Download, Filter, BarChart, Calendar, ChevronRight } from 'lucide-react';
import { DataTable } from '../components/Common';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Cell } from 'recharts';

export default function Reports({ showToast, userRole }) {
  const isCeo = userRole === 'CEO';
  const [selectedReportType, setSelectedReportType] = useState(isCeo ? 'employee' : 'sales'); // sales | revenue | commission | retailer | employee | team | product
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



  const handleExport = (format) => {
    let filename = `huddo_${selectedReportType}_report_${Date.now()}.${format}`;
    let csvContent = "";
    
    if (selectedReportType === 'sales') {
      csvContent = "Product Name,Category,Units Sold,Revenue\n" + 
        salesReportData.map(item => `"${item.name}","Sports Shoes",${item.sold},${item.amount}`).join("\n");
    } else {
      csvContent = "Report Type,Generated At,Format\n" + 
        `"${selectedReportType}","${new Date().toISOString()}","${format}"`;
    }
    
    const blobType = format === 'pdf' ? 'text/plain;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const finalContent = format === 'pdf' 
      ? `--- HUDDO SHOES ERP REPORT ---\nReport: ${selectedReportType.toUpperCase()}\nDate: ${new Date().toLocaleDateString()}\n\n${csvContent}` 
      : csvContent;
    
    const blob = new Blob([finalContent], { type: blobType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully downloaded ${selectedReportType.toUpperCase()} report as ${format.toUpperCase()}.`, "success");
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
            { id: 'product', label: 'Product Catalog Metrics' }
          ].filter(rpt => !isCeo || !['sales', 'revenue', 'commission', 'retailer'].includes(rpt.id)).map(rpt => (
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
          {isCeo && ['sales', 'revenue', 'commission', 'retailer'].includes(selectedReportType) ? (
            <div className="p-8 text-center text-rose-600 font-bold bg-white border border-slate-200 rounded-xl shadow-xs">
              Access Denied: CEO has no access to financial reports.
            </div>
          ) : (
            <>
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
                    <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={isCeo ? (val) => val : (val) => `₹${val / 1000}K`} />
                    <Tooltip formatter={isCeo ? (value) => value : (value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Bar dataKey={isCeo ? "sold" : "revenue"} fill="#3b82f6" radius={[4, 4, 0, 0]} name={isCeo ? "Total Pairs Sold" : "Accrued Revenue (₹)"} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}

              {!['sales', 'product'].includes(selectedReportType) && (
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
                    {!isCeo && <th className="px-6 py-3 text-right">Total Net Revenue</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productReportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3.5 text-slate-900 font-bold">{row.name}</td>
                      <td className="px-6 py-3.5 text-slate-400">{row.category}</td>
                      <td className="px-6 py-3.5 text-right text-slate-600">{row.sold} pairs</td>
                      {!isCeo && <td className="px-6 py-3.5 text-right text-slate-900 font-bold">₹{row.revenue.toLocaleString('en-IN')}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!['sales', 'product'].includes(selectedReportType) && (
              <div className="p-8 text-center text-slate-400 font-semibold">
                <span>Select Sales or Product reports to view active ledger metrics.</span>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
