// src/state-manager/pages/Reports.jsx
import { useState } from 'react';
import { 
  TrendingUp, DollarSign, Store, BarChart2, Users, ShoppingCart, 
  ArrowDownToLine, ArrowUp, ArrowDown
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, Cell
} from 'recharts';
import { formatCurrency, formatDate } from '../utils';

export default function Reports({ 
  retailers, 
  cityManagers, 
  cityPerformanceData, 
  fieldForceData, 
  showToast 
}) {
  const [activeReport, setActiveReport] = useState('sales'); // sales | revenue | retailer | city | employee | order
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [formatFilter, setFormatFilter] = useState('PDF');
  const dateRange = 'June 2026';

  const handleExport = () => {
    let format = formatFilter.toLowerCase();
    let filename = `state_manager_${activeReport}_report_${Date.now()}.${format}`;
    let content = `--- STATE OPERATION: ${activeReport.toUpperCase()} REPORT ---\nGenerated: ${new Date().toLocaleDateString()}\nFormat: ${formatFilter}\n\n`;
    
    if (activeReport === 'sales') {
      content += "Date,Revenue\n" + salesReportChart.map(item => `"${item.day}",${item.revenue}`).join("\n");
    } else {
      content += "Status,Details\nActive,Data compiled for state geographic operations.";
    }

    const blobType = format === 'pdf' ? 'text/plain;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const blob = new Blob([content], { type: blobType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`Successfully downloaded ${activeReport.toUpperCase()} report as ${formatFilter}.`, "success");
  };

  const REPORT_TYPES = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { id: 'retailer', label: 'Retailer Report', icon: Store },
    { id: 'city', label: 'City Performance', icon: BarChart2 },
    { id: 'employee', label: 'Employee / Field Force', icon: Users },
    { id: 'order', label: 'Order Report', icon: ShoppingCart }
  ];

  // Mock data calculations for specific reports
  
  // 1. Sales Report
  const salesReportChart = [
    { day: "05 Jun", revenue: 154000 },
    { day: "07 Jun", revenue: 215000 },
    { day: "09 Jun", revenue: 198000 },
    { day: "10 Jun", revenue: 245000 },
    { day: "11 Jun", revenue: 290000 },
    { day: "13 Jun", revenue: 405000 }
  ];
  
  const salesReportTable = [
    { date: "2026-06-13", city: "Ahmedabad", orders: 24, revenue: 405000 },
    { date: "2026-06-11", city: "Surat", orders: 19, revenue: 290000 },
    { date: "2026-06-10", city: "Ahmedabad", orders: 14, revenue: 245000 },
    { date: "2026-06-09", city: "Vadodara", orders: 12, revenue: 198000 },
    { date: "2026-06-07", city: "Ahmedabad", orders: 11, revenue: 215000 },
    { date: "2026-06-05", city: "Rajkot", orders: 8, revenue: 154000 }
  ];

  // 2. Revenue Report (Revenue share by city)
  const totalRevenueSum = cityPerformanceData.reduce((s, c) => s + c.revenue, 0);
  const revenueReportTable = cityPerformanceData.map(c => {
    const share = totalRevenueSum > 0 ? Math.round((c.revenue / totalRevenueSum) * 1000) / 10 : 0;
    const isDecline = c.city === "Morbi";
    return {
      city: c.city,
      revenue: c.revenue,
      share: `${share}%`,
      trend: isDecline ? "Decline" : "Growth"
    };
  });

  // 3. Retailer Report (Top retailers)
  const sortedRetailers = [...retailers]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const retailerReportTable = retailers.map(r => ({
    name: r.businessName,
    city: r.city,
    category: r.category,
    orders: r.totalOrders,
    revenue: r.totalRevenue,
    outstanding: r.pendingPayment,
    lastActive: r.lastOrderDate
  }));

  // 4. City Performance Report
  const getCMName = (city) => cityManagers.find(cm => cm.city.toLowerCase() === city.toLowerCase())?.name || "Not Assigned";
  const cityReportTable = cityPerformanceData.map(c => {
    const pct = c.target > 0 ? Math.round((c.revenue / c.target) * 100) : 0;
    return {
      city: c.city,
      manager: getCMName(c.city),
      target: c.target,
      achieved: c.revenue,
      pct: `${pct}%`,
      growth: c.city === "Morbi" ? "-4.2%" : "+18.5%"
    };
  });

  // 5. Employee/Field Force Report
  const employeeReportTable = fieldForceData.map(f => {
    const isActive = f.status === 'Active';
    return {
      name: f.name,
      city: f.city,
      daysActive: isActive ? 22 : 18,
      totalVisits: isActive ? 104 : 76,
      avgVisits: isActive ? 4.7 : 4.2,
      distance: isActive ? 640 : 480
    };
  });

  // 6. Order Report
  const orderReportTable = [
    { month: "June 2026", orders: 304, delivered: 284, pending: 15, cancelled: 5, returnRate: "1.6%" },
    { month: "May 2026", orders: 268, delivered: 250, pending: 0, cancelled: 18, returnRate: "2.1%" },
    { month: "April 2026", orders: 242, delivered: 232, pending: 0, cancelled: 10, returnRate: "1.9%" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Reports & Dossier Generator</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Compile comprehensive charts, extract performance metrics, and export files</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center"
        >
          <ArrowDownToLine className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* Report Type Selector — horizontal tab cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 select-none">
        {REPORT_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = activeReport === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-102' 
                  : 'bg-white border-slate-200/60 hover:border-slate-300 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter panel */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700">
            <span className="text-[9px] text-slate-400 uppercase">Period:</span>
            <span className="text-xs font-bold text-slate-700">{dateRange}</span>
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All Cities">All Cities</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Surat">Surat</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Rajkot">Rajkot</option>
            <option value="Morbi">Morbi</option>
            <option value="Bhavnagar">Bhavnagar</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All Categories">All Categories</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Format:</span>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="PDF">PDF Document</option>
            <option value="Excel">Excel Sheet</option>
            <option value="CSV">CSV File</option>
          </select>
        </div>

      </div>

      {/* Dynamic Report Content Layout */}
      <div className="space-y-6">
        
        {/* Render Chart (Top Section) */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            {activeReport.toUpperCase()} GRAPHICAL ANALYSIS
          </h3>
          
          <div className="h-60">
            {activeReport === 'sales' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesReportChart} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                  <Tooltip formatter={(val) => [formatCurrency(val), '']} contentStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="revenue" name="Daily Revenue" stroke="#ea580c" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'revenue' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityPerformanceData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="city" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                  <Tooltip formatter={(val) => [formatCurrency(val), '']} contentStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="revenue" name="City Revenue Share" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={16}>
                    {cityPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.revenue === 0 ? '#cbd5e1' : '#ea580c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'retailer' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedRetailers} layout="vertical" margin={{ top: 5, right: 5, left: 55, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                  <YAxis type="category" dataKey="businessName" stroke="#94a3b8" fontSize={9} tickLine={false} width={80} />
                  <Tooltip formatter={(val) => [formatCurrency(val), '']} contentStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="totalRevenue" name="Store Sales" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'city' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityPerformanceData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="city" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                  <Tooltip formatter={(val) => [formatCurrency(val), '']} contentStyle={{ fontSize: '10px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                  <Bar dataKey="revenue" name="Achieved Revenue" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="target" name="Target Quota" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'employee' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fieldForceData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                  <Bar dataKey="todayVisits" name="Visits Log" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="distanceKm" name="Distance (km)" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeReport === 'order' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderReportTable} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                  <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Data Table Preview */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Report Preview Data Table</h3>
          
          <div className="overflow-x-auto">
            {activeReport === 'sales' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">City Name</th>
                    <th className="py-2.5 px-3 text-center">Orders Placed</th>
                    <th className="py-2.5 px-3 text-right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-semibold">{formatDate(row.date)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.city}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{row.orders}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">{formatCurrency(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'revenue' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">City Name</th>
                    <th className="py-2.5 px-3 text-right">Revenue (₹)</th>
                    <th className="py-2.5 px-3 text-center">Percentage of State Total</th>
                    <th className="py-2.5 px-3 text-right">Growth vs Last Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revenueReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.city}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">{formatCurrency(row.revenue)}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.share}</td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        {row.trend === 'Growth' ? (
                          <span className="text-emerald-600 flex items-center justify-end gap-0.5"><ArrowUp className="w-3.5 h-3.5" /> Growth</span>
                        ) : row.revenue === 0 ? (
                          <span className="text-slate-400">- Neutral</span>
                        ) : (
                          <span className="text-rose-600 flex items-center justify-end gap-0.5"><ArrowDown className="w-3.5 h-3.5" /> Decline</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'retailer' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">Shop Business Name</th>
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Orders</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                    <th className="py-2.5 px-3 text-right">Outstanding</th>
                    <th className="py-2.5 px-3">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {retailerReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.name}</td>
                      <td className="py-2.5 px-3">{row.city}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[9px] font-bold">{row.category}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{row.orders}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-800">{formatCurrency(row.revenue)}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${row.outstanding > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                        {formatCurrency(row.outstanding)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-semibold">{row.lastActive ? formatDate(row.lastActive) : "Never"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'city' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">Manager Name</th>
                    <th className="py-2.5 px-3 text-right">Target (₹)</th>
                    <th className="py-2.5 px-3 text-right">Achieved (₹)</th>
                    <th className="py-2.5 px-3 text-center">Achievement %</th>
                    <th className="py-2.5 px-3 text-right">Growth Quotient</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cityReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.city}</td>
                      <td className="py-2.5 px-3">{row.manager}</td>
                      <td className="py-2.5 px-3 text-right">{formatCurrency(row.target)}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-800">{formatCurrency(row.achieved)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full">{row.pct}</span>
                      </td>
                      <td className={`py-2.5 px-3 text-right font-bold ${row.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {row.growth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'employee' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">Employee Name</th>
                    <th className="py-2.5 px-3">City Area</th>
                    <th className="py-2.5 px-3 text-center">Days Active</th>
                    <th className="py-2.5 px-3 text-center">Total Visits</th>
                    <th className="py-2.5 px-3 text-center">Avg Visits/Day</th>
                    <th className="py-2.5 px-3 text-center">Distance Logged (km)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.name}</td>
                      <td className="py-2.5 px-3">{row.city}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{row.daysActive} days</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.totalVisits}</td>
                      <td className="py-2.5 px-3 text-center">{row.avgVisits}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.distance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'order' && (
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-center">Total Orders</th>
                    <th className="py-2.5 px-3 text-center">Delivered</th>
                    <th className="py-2.5 px-3 text-center">Pending Approval</th>
                    <th className="py-2.5 px-3 text-center">Cancelled</th>
                    <th className="py-2.5 px-3 text-center">Return Rate %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderReportTable.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/20">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{row.month}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{row.orders}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{row.delivered}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-600">{row.pending}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-600">{row.cancelled}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{row.returnRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
