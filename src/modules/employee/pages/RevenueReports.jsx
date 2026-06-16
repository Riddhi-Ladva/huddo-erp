import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingBag, Landmark, Percent, 
  ArrowDownToLine, Globe, Layers, MapPin
} from 'lucide-react';
import CustomDataTable from '../components/CustomDataTable';

export default function RevenueReports({ showToast }) {
  const [breakdownType, setBreakdownType] = useState("city"); // country | state | city

  // Mock revenue breakdown statistics
  const breakdownData = {
    country: [
      { name: "India", revenue: 345000, orders: 12, growth: 12.4 },
      { name: "Nepal", revenue: 85000, orders: 3, growth: 8.5 }
    ],
    state: [
      { name: "Gujarat", revenue: 250000, orders: 8, growth: 14.2 },
      { name: "Maharashtra", revenue: 95000, orders: 4, growth: 9.8 },
      { name: "West Bengal", revenue: 85000, orders: 3, growth: 8.5 }
    ],
    city: [
      { name: "Rajkot", revenue: 165000, orders: 5, growth: 15.1 },
      { name: "Ahmedabad", revenue: 85000, orders: 3, growth: 12.3 },
      { name: "Surat", revenue: 95000, orders: 4, growth: 9.8 },
      { name: "Kolkata", revenue: 85000, orders: 3, growth: 8.5 }
    ]
  };

  // Mock product-wise revenue statistics
  const productData = [
    { name: "Huddo Running Shoes Blue", units: 50, revenue: 75000, pct: 21.7 },
    { name: "Huddo Casual Sneakers White", units: 64, revenue: 96000, pct: 27.8 },
    { name: "Huddo Leather Boots Black", units: 29, revenue: 87000, pct: 25.2 },
    { name: "Huddo Comfort Slides Grey", units: 39, revenue: 39000, pct: 11.3 },
    { name: "Huddo Sports Grip Yellow", units: 30, revenue: 48000, pct: 14.0 }
  ];

  const handleExportBreakdown = () => {
    console.log("Exporting Revenue Breakdown Report:", breakdownData[breakdownType]);
    showToast(`Revenue report by ${breakdownType} exported successfully.`, "success");
  };

  const handleExportProductRevenue = () => {
    console.log("Exporting Product-wise Revenue Report:", productData);
    showToast("Product revenue ledger exported successfully.", "success");
  };

  const breakdownColumns = [
    { header: "Location Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Revenue Generated", accessor: "revenue", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Total Orders Count", accessor: "orders" },
    { 
      header: "Monthly Growth", 
      accessor: "growth", 
      render: (val) => <span className="text-emerald-600 font-bold">+{val}%</span>
    }
  ];

  const productColumns = [
    { header: "Product Name", accessor: "name", render: (val) => <span className="font-bold text-slate-805">{val}</span> },
    { header: "Units Sold", accessor: "units" },
    { header: "Revenue Outlay", accessor: "revenue", render: (val) => `₹${val.toLocaleString()}` },
    { 
      header: "% of Total Sales", 
      accessor: "pct",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">{val}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${val}%` }}></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Revenue Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit geographical distributions, product metrics, and average order values.</p>
        </div>
      </div>

      {/* Summary ticker cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Monthly Revenue</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">₹3,45,000</span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
          </span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Order Count</span>
          <span className="text-xl font-bold text-slate-850 mt-1 block">15 Orders</span>
          <span className="text-xs text-slate-500 font-medium">12 Sales exec / 3 Promoters</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Order Value (AOV)</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">₹23,000</span>
          <span className="text-xs text-slate-500 font-medium">Higher margin ticket size</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filing Compliance</span>
            <span className="text-xl font-bold text-emerald-600 mt-1 block">100% Filed</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Landmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main breakdown grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographical breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Geographical Revenue Ratios</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Filter sales outputs by Country, State, or City belts.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold text-slate-500 border border-slate-200 select-none">
                <button
                  onClick={() => setBreakdownType("country")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${breakdownType === 'country' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                >
                  <Globe className="w-3 h-3 inline mr-1" /> Country
                </button>
                <button
                  onClick={() => setBreakdownType("state")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${breakdownType === 'state' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                >
                  <Layers className="w-3 h-3 inline mr-1" /> State
                </button>
                <button
                  onClick={() => setBreakdownType("city")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${breakdownType === 'city' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                >
                  <MapPin className="w-3 h-3 inline mr-1" /> City
                </button>
              </div>

              <button 
                onClick={handleExportBreakdown}
                className="p-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-500 hover:text-slate-850 bg-white transition-colors cursor-pointer"
                title="Export report"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <CustomDataTable 
            columns={breakdownColumns}
            data={breakdownData[breakdownType]}
            searchKeys={["name"]}
            searchPlaceholder="Search locations..."
          />
        </div>

        {/* Product ranking breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Product Revenue Ledger</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Summary of product sales quotas and units dispatched.</p>
            </div>

            <button 
              onClick={handleExportProductRevenue}
              className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white transition-colors cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Export Product stats</span>
            </button>
          </div>

          <CustomDataTable 
            columns={productColumns}
            data={productData}
            searchKeys={["name"]}
            searchPlaceholder="Search products..."
          />
        </div>

      </div>

    </div>
  );
}
