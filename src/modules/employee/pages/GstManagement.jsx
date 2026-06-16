import React, { useState } from 'react';
import { 
  Percent, DollarSign, Landmark, ArrowDownToLine, 
  FileText, ShieldCheck, HelpCircle
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function GstManagement({ showToast }) {
  // Mock GST invoice records
  const [invoices, setInvoices] = useState([
    { invoiceNo: "INV-2026-8801", partyName: "Apex Sole Distributors", date: "2026-06-16", taxable: 38135, cgst: 3432, sgst: 3432, total: 45000, status: "Pending" },
    { invoiceNo: "INV-2026-8802", partyName: "Metro Footwear", date: "2026-06-15", taxable: 10170, cgst: 915, sgst: 915, total: 12000, status: "Pending" },
    { invoiceNo: "INV-2026-8803", partyName: "Red Tape Plaza", date: "2026-06-14", taxable: 21186, cgst: 1907, sgst: 1907, total: 25000, status: "Filed" },
    { invoiceNo: "INV-2026-8804", partyName: "Bata Shoppe Surat", date: "2026-06-12", taxable: 29661, cgst: 2669, sgst: 2669, total: 35000, status: "Filed" },
    { invoiceNo: "INV-2026-8805", partyName: "Apex Sole Distributors", date: "2026-06-11", taxable: 50847, cgst: 4576, sgst: 4576, total: 60000, status: "Filed" },
    { invoiceNo: "INV-2026-8806", partyName: "Royal Sandals", date: "2026-06-10", taxable: 15254, cgst: 1373, sgst: 1373, total: 18000, status: "Filed" }
  ]);

  // GST stats calculation
  const stats = React.useMemo(() => {
    const totalTaxable = invoices.reduce((acc, inv) => acc + inv.taxable, 0);
    const totalCGST = invoices.reduce((acc, inv) => acc + inv.cgst, 0);
    const totalSGST = invoices.reduce((acc, inv) => acc + inv.sgst, 0);
    const totalGST = totalCGST + totalSGST;
    return { totalTaxable, totalCGST, totalSGST, totalGST };
  }, [invoices]);

  const handleExportFiling = () => {
    console.log("Exporting GSTR-1 filings for June 2026:", invoices);
    showToast("GSTR-1 filing ledger exported successfully. Ready for GST portal upload.", "success");
  };

  const handleFileInvoice = (invNo) => {
    setInvoices(prev => prev.map(inv => 
      inv.invoiceNo === invNo ? { ...inv, status: "Filed" } : inv
    ));
    showToast(`Invoice ${invNo} status changed to Filed.`, "success");
  };

  const columns = [
    { header: "Invoice Number", accessor: "invoiceNo", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Party Name", accessor: "partyName", render: (val) => <span className="font-bold text-slate-700">{val}</span> },
    { header: "Invoice Date", accessor: "date" },
    { header: "Taxable Amount", accessor: "taxable", render: (val) => `₹${val.toLocaleString()}` },
    { header: "CGST (9%)", accessor: "cgst", render: (val) => `₹${val.toLocaleString()}` },
    { header: "SGST (9%)", accessor: "sgst", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Total Value", accessor: "total", render: (val) => <span className="font-bold text-slate-850">₹{val.toLocaleString()}</span> },
    { header: "Filing Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Action", 
      accessor: "invoiceNo", 
      sortable: false, 
      render: (val, row) => (
        row.status === 'Pending' ? (
          <button 
            onClick={() => handleFileInvoice(val)}
            className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Mark Filed</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold italic">Filed</span>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">GST Invoice Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit SGST/CGST breakdown margins and export GSTR-1 files.</p>
        </div>

        <button 
          onClick={handleExportFiling}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Export GSTR-1 filing ledger</span>
        </button>
      </div>

      {/* GST Ticker summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Taxable Value</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">₹{Math.round(stats.totalTaxable).toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium">Out of ₹{(stats.totalTaxable + stats.totalGST).toLocaleString()} gross</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total GST Collected</span>
          <span className="text-xl font-bold text-brand-orange mt-1 block">₹{Math.round(stats.totalGST).toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-bold">18% Flat rate (shoes)</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Collected GST Breakdown</span>
          <div className="space-y-1.5 text-slate-650 font-medium">
            <div className="flex justify-between"><span>CGST (Central):</span><span className="font-bold text-slate-800">₹{Math.round(stats.totalCGST).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>SGST (State):</span><span className="font-bold text-slate-800">₹{Math.round(stats.totalSGST).toLocaleString()}</span></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GST Filing Compliance</span>
            <span className="text-xl font-bold text-emerald-600 mt-1 block">100% compliant</span>
            <span className="text-[10px] text-slate-500 font-medium">4 Invoices filed / 2 pending</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-650">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Invoice list table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Filing Invoices ledger</h3>
        
        <CustomDataTable 
          columns={columns}
          data={invoices}
          searchKeys={["invoiceNo", "partyName", "status"]}
          searchPlaceholder="Search invoices ledger..."
        />
      </div>

    </div>
  );
}
