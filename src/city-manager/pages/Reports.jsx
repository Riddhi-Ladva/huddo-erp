// src/city-manager/pages/Reports.jsx
import { useState } from 'react';
import { 
  TrendingUp, Store, ShoppingCart, MapPin, Lightbulb, ArrowDownToLine
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { formatCurrency, formatDate } from '../cityManagerUtils';

export default function Reports({ 
  orders, 
  retailers, 
  leads, 
  visitLogs, 
  retailerSalesData,
  showToast 
}) {
  const [activeReportTab, setActiveReportTab] = useState('Sales');
  
  // Filters
  const [dateFilter, setDateFilter] = useState('June 2026');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleExport = (format) => {
    let filename = `city_manager_${activeReportTab.toLowerCase()}_report_${Date.now()}.${format.toLowerCase()}`;
    let content = `--- AHMEDABAD ${activeReportTab.toUpperCase()} REPORT ---\nGenerated: ${new Date().toLocaleDateString()}\nFormat: ${format.toUpperCase()}\n\n`;
    
    if (activeReportTab === 'Sales') {
      content += "Date,Revenue\n" + dailySalesTrend.map(item => `"${item.date}",${item.revenue}`).join("\n");
    } else {
      content += "Status,Details\nActive,Data compiled for regional city operations.";
    }

    const blobType = format.toLowerCase() === 'pdf' ? 'text/plain;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: blobType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully downloaded Ahmedabad ${activeReportTab} Report as ${format.toUpperCase()}.`, 'success');
  };

  const tabs = [
    { id: 'Sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'Retailers', label: 'Retailer Report', icon: Store },
    { id: 'Orders', label: 'Order Report', icon: ShoppingCart },
    { id: 'Visits', label: 'Field Visit Report', icon: MapPin },
    { id: 'Leads', label: 'Lead Report', icon: Lightbulb }
  ];

  // 1. Sales Report Mock Data
  const dailySalesTrend = [
    { date: '01 Jun', revenue: 15000 },
    { date: '03 Jun', revenue: 22000 },
    { date: '05 Jun', revenue: 45000 },
    { date: '08 Jun', revenue: 68000 },
    { date: '10 Jun', revenue: 125000 },
    { date: '12 Jun', revenue: 95000 },
    { date: '13 Jun', revenue: 110000 }
  ];

  const salesTableData = [
    { date: '13 Jun 2026', orders: 8, revenue: 110000, avgVal: 13750, vsPrev: 12.5 },
    { date: '12 Jun 2026', orders: 6, revenue: 95000, avgVal: 15833, vsPrev: 8.2 },
    { date: '10 Jun 2026', orders: 11, revenue: 125000, avgVal: 11363, vsPrev: 18.4 },
    { date: '08 Jun 2026', orders: 5, revenue: 68000, avgVal: 13600, vsPrev: -2.5 },
    { date: '05 Jun 2026', orders: 3, revenue: 45000, avgVal: 15000, vsPrev: 1.0 }
  ];

  // 2. Retailer Report Mock Data
  const retailerReportTable = retailers.filter(r => {
    const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchStat = statusFilter === 'All' || r.status === statusFilter;
    return matchCat && matchStat;
  });

  // 3. Order Report Mock Data
  const orderStatusMetrics = [
    { week: 'Wk 1', Delivered: 12, Processing: 3, Shipped: 2 },
    { week: 'Wk 2', Delivered: 15, Processing: 4, Shipped: 1 },
    { week: 'Wk 3', Delivered: 18, Processing: 2, Shipped: 3 },
    { week: 'Wk 4', Delivered: 4, Processing: 3, Shipped: 1 }
  ];

  // 4. Visit Report Mock Data
  const visitTrendData = [
    { day: '07 Jun', visits: 2 },
    { day: '08 Jun', visits: 0 },
    { day: '09 Jun', visits: 1 },
    { day: '10 Jun', visits: 3 },
    { day: '11 Jun', visits: 2 },
    { day: '12 Jun', visits: 3 },
    { day: '13 Jun', visits: 3 }
  ];

  // 5. Lead funnel stages mock data
  const leadFunnelData = [
    { name: 'Contacted', value: 2 },
    { name: 'Interested', value: 1 },
    { name: 'Meeting Scheduled', value: 1 },
    { name: 'Not Interested', value: 1 }
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
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Reports — Ahmedabad</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Compile sales summaries, retailer logs, visit durations, and pipelines</p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-center select-none">
          <button 
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-755 transition-all shadow-xs cursor-pointer"
          >
            Export PDF
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex border-b border-slate-200 select-none overflow-x-auto max-w-full whitespace-nowrap scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all shrink-0 whitespace-nowrap ${
                isActive 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters Area */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">
        <div className="space-y-0.5">
          <span className="text-[8px] text-slate-400 uppercase font-black">Date Period</span>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none"
          >
            <option value="June 2026">June 2026</option>
            <option value="Q1 FY26-27">Q1 FY26-27</option>
            <option value="Full FY26-27">Full FY26-27</option>
          </select>
        </div>

        {activeReportTab === 'Retailers' && (
          <>
            <div className="space-y-0.5 animate-fade-in">
              <span className="text-[8px] text-slate-400 uppercase font-black">Category</span>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
            
            <div className="space-y-0.5 animate-fade-in">
              <span className="text-[8px] text-slate-400 uppercase font-black">Status</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending Verification">Pending Verification</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Previews and Tables */}
      <div className="space-y-6">
        
        {/* TAB 1: SALES REPORT */}
        {activeReportTab === 'Sales' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4"> Ahmedabad Daily Sales Trend (June 2026)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesTrend} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Line type="monotone" dataKey="revenue" name="Daily Revenue" stroke="#f97316" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Sales Transaction Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/50">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-center">Orders Count</th>
                      <th className="py-2.5 px-3 text-right">Revenue Achieved</th>
                      <th className="py-2.5 px-3 text-right">Avg Ticket Size</th>
                      <th className="py-2.5 px-3 text-right">vs Previous Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650">
                    {salesTableData.map(row => (
                      <tr key={row.date} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-800">{row.date}</td>
                        <td className="py-3 px-3 text-center font-bold">{row.orders}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(row.revenue)}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-705">{formatCurrency(row.avgVal)}</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">
                          {row.vsPrev > 0 ? `+${row.vsPrev}%` : `${row.vsPrev}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RETAILERS REPORT */}
        {activeReportTab === 'Retailers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Ahmedabad Retailer Revenues</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retailerSalesData} layout="vertical" margin={{ top: 5, right: 5, left: 55, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} width={80} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Retailer Profile Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/50">
                      <th className="py-2.5 px-3">Retailer Outlet Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-center">Orders</th>
                      <th className="py-2.5 px-3 text-right">Revenue</th>
                      <th className="py-2.5 px-3 text-right">Outstanding Debt</th>
                      <th className="py-2.5 px-3">Last Active</th>
                      <th className="py-2.5 px-3">Last Visited Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {retailerReportTable.map(r => (
                      <tr key={r.id}>
                        <td className="py-3 px-3 font-bold text-slate-800">{r.businessName}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 border text-[9px] font-black uppercase rounded-full ${categoryColors[r.category]}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold">{r.totalOrders}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-805">{formatCurrency(r.totalRevenue)}</td>
                        <td className={`py-3 px-3 text-right font-black ${r.pendingPayment > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {formatCurrency(r.pendingPayment)}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-bold">{r.lastOrderDate ? formatDate(r.lastOrderDate) : '-'}</td>
                        <td className="py-3 px-3 text-slate-400 font-bold">{r.lastVisitDate ? formatDate(r.lastVisitDate) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS REPORT */}
        {activeReportTab === 'Orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Ahmedabad Orders Weekly Split</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusMetrics} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Bar dataKey="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="Processing" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="Shipped" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Ahmedabad Order Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/50">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Retailer</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 font-mono">UTR</th>
                      <th className="py-2.5 px-3">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="py-3 px-3 font-bold text-slate-800">{o.id}</td>
                        <td className="py-3 px-3 font-bold text-slate-700">{o.retailerName}</td>
                        <td className="py-3 px-3 text-slate-450 font-bold">{formatDate(o.orderDate)}</td>
                        <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(o.amount)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-1.5 py-0.5 bg-slate-50 border rounded text-[9px] font-extrabold uppercase">
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-450">{o.utr || '-'}</td>
                        <td className="py-3 px-3 text-slate-500">
                          {o.status === 'Pending Approval' ? 'Awaiting CM' : 'Arjun Patel'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VISITS REPORT */}
        {activeReportTab === 'Visits' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Daily Visits (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitTrendData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="visits" name="Visits Logged" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Field Check-In Sheets</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/50">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Entity Name</th>
                      <th className="py-2.5 px-3">Purpose</th>
                      <th className="py-2.5 px-3">Outcome Log</th>
                      <th className="py-2.5 px-3 text-center">GPS</th>
                      <th className="py-2.5 px-3 text-center">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitLogs.map(v => (
                      <tr key={v.id}>
                        <td className="py-3 px-3 font-bold text-slate-450">{v.date}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{v.retailerName}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 bg-slate-50 border rounded text-[9px] text-slate-550">
                            {v.purpose}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-450 truncate max-w-xs" title={v.outcome}>{v.outcome}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            v.gpsVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {v.gpsVerified ? 'Verified' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-400">45 mins</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEADS REPORT */}
        {activeReportTab === 'Leads' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Leads by Funnel Stage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadFunnelData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="Leads Count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Leads Pipeline Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/50">
                      <th className="py-2.5 px-3">Lead Name</th>
                      <th className="py-2.5 px-3">Owner</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Last Contact</th>
                      <th className="py-2.5 px-3">Pipeline Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map(l => (
                      <tr key={l.id}>
                        <td className="py-3 px-3 font-bold text-slate-800">{l.businessName}</td>
                        <td className="py-3 px-3">{l.ownerName}</td>
                        <td className="py-3 px-3 font-semibold text-slate-500">{l.source}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-slate-50 border rounded text-[9px] font-bold uppercase">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-bold">{l.lastContact}</td>
                        <td className="py-3 px-3 text-slate-400 italic truncate max-w-xs" title={l.notes}>{l.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
