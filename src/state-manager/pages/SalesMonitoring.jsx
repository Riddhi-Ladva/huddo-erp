// src/state-manager/pages/SalesMonitoring.jsx
import { useState } from 'react';
import { 
  ArrowDownToLine, ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar
} from 'recharts';
import { formatCurrency, formatNumber, formatDate } from '../utils';

export default function SalesMonitoring({ 
  retailers, 
  cityManagers, 
  monthlyRevenueData, 
  cityPerformanceData, 
  showToast 
}) {
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  // Sort states
  const [citySortField, setCitySortField] = useState('revenue');
  const [citySortDir, setCitySortDir] = useState('desc');
  const [retailerSortField, setRetailerSortField] = useState('revenue');
  const [retailerSortDir, setRetailerSortDir] = useState('desc');

  // Pagination states
  const [retailerPage, setRetailerPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getCMName = (cityName) => {
    return cityManagers.find(cm => cm.city.toLowerCase() === cityName.toLowerCase())?.name || "Not Assigned";
  };

  const handleExport = () => {
    showToast("Exporting sales analysis view...", "success");
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

  // 1. Process City-wise Sales Data (Sortable)
  const citySalesRows = cityPerformanceData.map(cityData => {
    const targetVal = cityData.target;
    const revVal = cityData.revenue;
    const vsTargetPct = targetVal > 0 ? Math.round((revVal / targetVal) * 100) : 0;
    
    // Growth mocks
    const growthMocks = {
      "Ahmedabad": 24.5,
      "Surat": 18.2,
      "Vadodara": 15.6,
      "Rajkot": 12.1,
      "Morbi": -5.4,
      "Bhavnagar": 0
    };

    return {
      city: cityData.city,
      manager: getCMName(cityData.city),
      retailers: cityData.retailers,
      orders: cityData.orders,
      revenue: revVal,
      vsTarget: vsTargetPct,
      growth: growthMocks[cityData.city] || 0
    };
  });

  const sortedCitySales = sortData(citySalesRows, citySortField, citySortDir);

  const toggleCitySort = (field) => {
    if (citySortField === field) {
      setCitySortDir(citySortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setCitySortField(field);
      setCitySortDir('desc');
    }
  };

  // 2. Process Retailer-wise Sales Data (Top Retailers, Paginated, Sortable)
  const retailerSalesRows = retailers.map(ret => {
    const totalRev = ret.totalRevenue;
    const totalOrds = ret.totalOrders;
    const avgOrd = totalOrds > 0 ? Math.round(totalRev / totalOrds) : 0;

    return {
      id: ret.id,
      name: ret.businessName,
      city: ret.city,
      category: ret.category,
      orders: totalOrds,
      revenue: totalRev,
      avgOrder: avgOrd,
      lastOrder: ret.lastOrderDate
    };
  }).filter(r => {
    const matchesCity = cityFilter === 'All Cities' || r.city.toLowerCase() === cityFilter.toLowerCase();
    const matchesCat = categoryFilter === 'All Categories' || r.category === categoryFilter;
    return matchesCity && matchesCat;
  });

  const sortedRetailerSales = sortData(retailerSalesRows, retailerSortField, retailerSortDir);
  
  // Pagination slice
  const paginatedRetailers = sortedRetailerSales.slice(retailerPage * pageSize, (retailerPage + 1) * pageSize);
  const totalRetailersCount = sortedRetailerSales.length;
  const totalPages = Math.ceil(totalRetailersCount / pageSize);

  const toggleRetailerSort = (field) => {
    if (retailerSortField === field) {
      setRetailerSortDir(retailerSortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setRetailerSortField(field);
      setRetailerSortDir('desc');
    }
    setRetailerPage(0); // Reset page
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Sales Analytics & Monitoring</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Drill down into revenue streams, city metrics, and retailer contribution profiles</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center"
        >
          <ArrowDownToLine className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Top Filter Bar */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Range:</span>
            <span className="text-xs font-bold text-slate-700">June 2026</span>
          </div>

          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setRetailerPage(0);
            }}
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
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setRetailerPage(0);
            }}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All Categories">All Categories</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <span className="text-[10px] text-slate-400 font-bold uppercase">Scoped Scope: Gujarat State</span>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Aggregate Revenue</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{formatCurrency(1507000)}</h3>
          <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full mt-2">
            115.9% vs Target
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Variance</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">115.9%</h3>
          <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full mt-2">
            Above Target
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Increments</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">+₹2,67,000</h3>
          <span className="text-[9px] font-bold text-emerald-600 mt-2 block flex items-center gap-0.5">
            <ArrowUp className="w-3.5 h-3.5" /> +21.5% MoM Growth
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{formatNumber(304)}</h3>
          <span className="text-[9px] text-slate-400 font-bold mt-2 block">
            Average Volume: 10.1 per day
          </span>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Avg Order Ticket</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{formatCurrency(4957)}</h3>
          <span className="text-[9px] text-slate-400 font-bold mt-2 block">
            High order size ratio: 15%
          </span>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Revenue Trend — Last 12 Months</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="revenue" name="Achieved Revenue" stroke="#ea580c" strokeWidth={3} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" name="Target Curve" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">City-wise Revenue This Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityPerformanceData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="city" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), '']}
                  contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="revenue" name="Revenue Achieved" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* City-wise Sales Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">City Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleCitySort('city')}>
                  <span className="flex items-center gap-1">City <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3">City Manager</th>
                <th className="py-2.5 px-3 text-center cursor-pointer select-none" onClick={() => toggleCitySort('retailers')}>
                  <span className="flex items-center justify-center gap-1">Retailers <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-center cursor-pointer select-none" onClick={() => toggleCitySort('orders')}>
                  <span className="flex items-center justify-center gap-1">Orders <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleCitySort('revenue')}>
                  <span className="flex items-center justify-end gap-1 font-bold text-slate-700">Revenue <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-center cursor-pointer select-none" onClick={() => toggleCitySort('vsTarget')}>
                  <span className="flex items-center justify-center gap-1">vs Target <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleCitySort('growth')}>
                  <span className="flex items-center justify-end gap-1">Growth MoM <ArrowUpDown className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedCitySales.map((row) => (
                <tr key={row.city} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">{row.city}</td>
                  <td className="py-3 px-3">{row.manager}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">{row.retailers}</td>
                  <td className="py-3 px-3 text-center">{row.orders}</td>
                  <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${
                      row.vsTarget >= 90 ? 'bg-emerald-50 text-emerald-700' :
                      row.vsTarget >= 60 ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {row.vsTarget}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {row.growth > 0 ? (
                      <span className="text-[10px] font-extrabold text-emerald-600 flex items-center justify-end gap-0.5">
                        <ArrowUp className="w-3 h-3" /> +{row.growth}%
                      </span>
                    ) : row.growth < 0 ? (
                      <span className="text-[10px] font-extrabold text-rose-600 flex items-center justify-end gap-0.5">
                        <ArrowDown className="w-3 h-3" /> {row.growth}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-0.5">
                        - 0.0%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Retailers Table (below, paginated) */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Retailers by Revenue</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Filtered count: {totalRetailersCount}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleRetailerSort('name')}>
                  <span className="flex items-center gap-1">Business Name <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleRetailerSort('city')}>
                  <span className="flex items-center gap-1">City <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleRetailerSort('category')}>
                  <span className="flex items-center gap-1">Category <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-center cursor-pointer select-none" onClick={() => toggleRetailerSort('orders')}>
                  <span className="flex items-center justify-center gap-1">Orders <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleRetailerSort('revenue')}>
                  <span className="flex items-center justify-end gap-1 font-bold text-slate-700">Revenue <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleRetailerSort('avgOrder')}>
                  <span className="flex items-center justify-end gap-1">Avg Order <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleRetailerSort('lastOrder')}>
                  <span className="flex items-center gap-1">Last Order Date <ArrowUpDown className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRetailers.length > 0 ? (
                paginatedRetailers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{row.name}</td>
                    <td className="py-3 px-3">{row.city}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        row.category === 'Platinum' ? 'bg-indigo-50 text-indigo-700' :
                        row.category === 'Gold' ? 'bg-amber-50 text-amber-700' :
                        row.category === 'Silver' ? 'bg-blue-50 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>{row.category}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">{row.orders}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(row.revenue)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-700">{formatCurrency(row.avgOrder)}</td>
                    <td className="py-3 px-3 text-slate-400 font-semibold">{formatDate(row.lastOrder)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400 italic">No retailers found mapping filter parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setRetailerPage(0);
                }}
                className="border border-slate-200 rounded p-1 font-bold focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>per page</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                disabled={retailerPage === 0}
                onClick={() => setRetailerPage(prev => prev - 1)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Prev
              </button>
              <span>Page {retailerPage + 1} of {totalPages}</span>
              <button
                disabled={retailerPage >= totalPages - 1}
                onClick={() => setRetailerPage(prev => prev + 1)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
