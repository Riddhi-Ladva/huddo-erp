import React from 'react';
import { 
  BarChart3, ArrowDownToLine, ShoppingBag, Landmark, 
  ShieldCheck, AlertTriangle
} from 'lucide-react';
import CustomDataTable from '../components/CustomDataTable';

export default function ProcurementReports({ showToast }) {
  // Mock performance metrics
  const vendorPerformance = [
    { name: "Supreme Rubber Products", posCount: 3, onTime: 95.5, qualityPass: 100 },
    { name: "Apex Packaging Solutions", posCount: 2, onTime: 90.0, qualityPass: 100 },
    { name: "Marvel Leather Tannery", posCount: 1, onTime: 88.0, qualityPass: 100 },
    { name: "Standard Threads & Laces", posCount: 1, onTime: 100, qualityPass: 50 }, // 1 batch failed QC in mock POs
    { name: "Elite Buckles & Accessories", posCount: 1, onTime: 100, qualityPass: 100 }
  ];

  const handleDownloadReport = () => {
    console.log("Compiling Procurement Performance Report June 2026:", vendorPerformance);
    showToast("Procurement report compiled and downloaded successfully (Logs in console).", "success");
  };

  const columns = [
    { header: "Supplier / Vendor", accessor: "name", render: (val) => <span className="font-bold text-slate-805">{val}</span> },
    { header: "Total POs Issued", accessor: "posCount" },
    { 
      header: "On-Time Delivery Rate", 
      accessor: "onTime",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">{val}%</span>
          <div className="w-16 bg-slate-105 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${val}%` }}></div>
          </div>
        </div>
      )
    },
    { 
      header: "Quality Pass Rate", 
      accessor: "qualityPass",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">{val}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${val >= 80 ? 'bg-indigo-600' : 'bg-rose-500'}`} style={{ width: `${val}%` }}></div>
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
          <h1 className="text-xl font-bold text-slate-900 font-display">Procurement Reports</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit raw materials spend budgets, supplier performance, and quality pass rates.</p>
        </div>

        <button 
          onClick={handleDownloadReport}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Download Performance report</span>
        </button>
      </div>

      {/* Stats ticker summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total POs Raised</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">8 POs</span>
          <span className="text-[10px] text-slate-500 font-medium">Month: June 2026</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spend outlay</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">₹5,93,000</span>
          <span className="text-[10px] text-slate-550 font-medium">Charged from capital accounts</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending PO Approvals</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">1 PO</span>
          <span className="text-[10px] text-slate-500 font-medium">Awaiting director sign-off</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Top Supplier (Spend)</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1">Supreme Rubber</span>
            <span className="text-[10px] text-slate-500 font-medium">Total: ₹2,45,000</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-650">
            <Landmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Vendor scorecard table breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-400" />
          Supplier Performance Scorecard
        </h3>
        
        <CustomDataTable 
          columns={columns}
          data={vendorPerformance}
          searchKeys={["name"]}
          searchPlaceholder="Search vendor scorecard..."
        />
      </div>

    </div>
  );
}
