import React from 'react';
import { 
  FileText, ArrowDownToLine, Archive, AlertTriangle, 
  Percent, TrendingUp, Landmark, ShieldCheck
} from 'lucide-react';
import { mockStock } from '../mockData/mockStock';
import CustomDataTable from '../components/CustomDataTable';

export default function InventoryReports({ showToast }) {
  // Calculations
  const stats = React.useMemo(() => {
    const totalSKUs = mockStock.length;
    const totalStockQty = mockStock.reduce((acc, s) => acc + s.currentStock, 0);
    const lowStockCount = mockStock.filter(s => s.status === 'Low Stock').length;
    const outOfStockCount = mockStock.filter(s => s.status === 'Out of Stock').length;
    
    // Mock valuation (unit prices averaged at ₹1,500)
    const valuation = totalStockQty * 1500;
    return { totalSKUs, valuation, lowStockCount, outOfStockCount, totalStockQty };
  }, []);

  const handleDownloadReport = () => {
    console.log("Compiling Inventory Valuation Report June 2026:", mockStock);
    showToast("Inventory report compiled and downloaded (Logs generated in console).", "success");
  };

  // Category summary breakdown
  const categorySummary = [
    { name: "Sports Shoes", skus: 5, stock: 745, value: 1117500, pct: 54.3 },
    { name: "Casual Sneakers", skus: 2, stock: 150, value: 225000, pct: 10.9 },
    { name: "Formal Boots", skus: 2, stock: 95, value: 285000, pct: 6.9 },
    { name: "Slides / Sandals", skus: 3, stock: 300, value: 450000, pct: 21.8 }
  ];

  const columns = [
    { header: "Inventory Category", accessor: "name", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Active SKUs Count", accessor: "skus" },
    { header: "Total Stock Volume", accessor: "stock", render: (val) => `${val} Units` },
    { header: "Estimated Value", accessor: "value", render: (val) => `₹${val.toLocaleString()}` },
    { 
      header: "Percentage Share", 
      accessor: "pct",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">{val}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-orange h-full rounded-full" style={{ width: `${val}%` }}></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Inventory Reports</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit stock valuations, SKU levels, and regional category volumes.</p>
        </div>

        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Download Inventory Ledger</span>
        </button>
      </div>

      {/* Stats ticker summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Active SKUs</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">{stats.totalSKUs} SKUs</span>
          <span className="text-[10px] text-slate-500 font-medium">Across 3 warehouses</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Assets Value</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">₹{stats.valuation.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium">Unit rate avg: ₹1,500</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alert Items</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">{stats.lowStockCount} SKUs</span>
          <span className="text-[10px] text-slate-500 font-medium">Restock levels flagged</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Out of Stock Count</span>
            <span className="text-xl font-bold text-rose-600 mt-1 block">{stats.outOfStockCount} SKUs</span>
            <span className="text-[10px] text-rose-600 font-bold">Needs immediate reorder</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Category summary table breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Inventory Category Valuations</h3>
        
        <CustomDataTable 
          columns={columns}
          data={categorySummary}
          searchKeys={["name"]}
          searchPlaceholder="Search categories ledger..."
        />
      </div>

    </div>
  );
}
