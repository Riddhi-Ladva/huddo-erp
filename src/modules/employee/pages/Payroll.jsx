import React, { useState } from 'react';
import { 
  Landmark, CreditCard, ChevronRight, ArrowDownToLine, 
  Eye, CheckCircle2, ClipboardList, Calendar, X
} from 'lucide-react';
import { mockPayroll as initialPayroll } from '../mockData/mockPayroll';
import { mockEmployeeDirectory } from '../mockData/mockEmployeeDirectory';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';

export default function Payroll({ showToast }) {
  const { activeRole } = useEmployeeAuth();
  
  const [payroll, setPayroll] = useState(initialPayroll);
  const [selectedMonth, setSelectedMonth] = useState("June 2026");
  const [viewingPayslip, setViewingPayslip] = useState(null);

  // Check if role is HR manager (has processing rights) vs Finance manager (read-only)
  const isHR = activeRole === 'hr_manager';

  // Stats calculation
  const stats = React.useMemo(() => {
    const totalGross = payroll.reduce((acc, p) => acc + p.gross, 0);
    const totalNet = payroll.reduce((acc, p) => acc + p.net, 0);
    const processedCount = payroll.filter(p => p.status === 'Processed').length;
    const pendingCount = payroll.filter(p => p.status === 'Pending').length;
    return { totalGross, totalNet, processedCount, pendingCount };
  }, [payroll]);

  // Settle single row payroll
  const handleProcessPayroll = (payId) => {
    setPayroll(prev => prev.map(p => 
      p.id === payId ? { ...p, status: "Processed" } : p
    ));
    const target = payroll.find(p => p.id === payId);
    showToast(`Payroll successfully processed for ${target?.name}.`, "success");
  };

  // Settle all pending payrolls
  const handleProcessAllPayroll = () => {
    setPayroll(prev => prev.map(p => ({ ...p, status: "Processed" })));
    showToast("Successfully processed payroll for all pending employees.", "success");
  };

  const handleDownloadPayslip = (empName) => {
    showToast(`Downloading payslip for ${empName} - June 2026. (Mock action successful)`, "success");
  };

  const columns = [
    { header: "Emp ID", accessor: "employeeId" },
    { header: "Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Department", accessor: "department" },
    { header: "Gross Salary", accessor: "gross", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Deductions (PF+TDS)", accessor: "gross", render: (_, row) => `₹${(row.pf + row.tds).toLocaleString()}` },
    { header: "Net Salary", accessor: "net", render: (val) => <span className="font-extrabold text-emerald-650">₹{val.toLocaleString()}</span> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => setViewingPayslip(row)}
            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-850 rounded transition-colors cursor-pointer"
            title="View Payslip"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {isHR && row.status === 'Pending' && (
            <button 
              onClick={() => handleProcessPayroll(val)}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Process</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">
            {isHR ? "Payroll System Workspace" : "Payroll Ledger View"}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isHR ? "Calculate employee deductions and process monthly salary dispatches." : "Audit payroll runs and download payslips."}
          </p>
        </div>

        {isHR && stats.pendingCount > 0 && (
          <button 
            onClick={handleProcessAllPayroll}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Process All Pending ({stats.pendingCount})</span>
          </button>
        )}
      </div>

      {/* Summary ticker cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Gross Salary Outlay</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">₹{stats.totalGross.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium">15 employees roster</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Dispatched Value</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">₹{stats.totalNet.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium">Credited to bank accounts</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Processed Accounts</span>
          <span className="text-xl font-bold text-indigo-650 mt-1 block">{stats.processedCount} / 15</span>
          <span className="text-[10px] text-slate-550 font-medium">Disbursed successfully</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Processing</span>
            <span className="text-xl font-bold text-rose-600 mt-1 block">{stats.pendingCount} Pending</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-650">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Roster database table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider font-display flex items-center gap-2">
            <Landmark className="w-4 h-4 text-slate-400" />
            Payroll Register Ledger ({selectedMonth})
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
              <option value="April 2026">April 2026</option>
            </select>
          </div>
        </div>

        <CustomDataTable 
          columns={columns}
          data={payroll}
          searchKeys={["employeeId", "name", "department", "status"]}
          searchPlaceholder="Search payroll registers..."
        />
      </div>

      {/* Individual Payslip View Drawer Overlay */}
      {viewingPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Landmark className="w-6 h-6 text-brand-orange" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-display">Payslip - June 2026</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{viewingPayslip.name} (ID: {viewingPayslip.employeeId})</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setViewingPayslip(null)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contents */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Bank details & department */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Department / Team</span>
                    <span className="font-bold text-slate-800 mt-1 block">{viewingPayslip.department}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Credit Bank Account</span>
                    <span className="font-bold text-slate-800 mt-1 block font-mono">{viewingPayslip.bank}</span>
                  </div>
                </div>

                {/* Earnings & Deductions breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>Earnings</span>
                      <span className="text-[8px] text-emerald-600 lowercase font-medium">Credit</span>
                    </h4>
                    
                    <div className="space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex justify-between">
                        <span>Basic Pay:</span>
                        <span>₹{Math.round(viewingPayslip.gross * 0.5).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>House Rent Allowance (HRA):</span>
                        <span>₹{Math.round(viewingPayslip.gross * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Special Allowance:</span>
                        <span>₹{Math.round(viewingPayslip.gross * 0.2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>Deductions</span>
                      <span className="text-[8px] text-rose-600 lowercase font-medium">Debit</span>
                    </h4>
                    
                    <div className="space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex justify-between">
                        <span>Provident Fund (PF):</span>
                        <span>₹{viewingPayslip.pf.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax (TDS):</span>
                        <span>₹{viewingPayslip.tds.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Tax:</span>
                        <span>₹200</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-150 my-6"></div>

                {/* Net pay summary */}
                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block font-display">Net Credited Amount</span>
                    <span className="text-lg font-extrabold font-display block mt-1">₹{viewingPayslip.net.toLocaleString()}</span>
                  </div>
                  
                  <span className="px-3.5 py-1 bg-emerald-600 border border-emerald-500 rounded text-xs font-bold uppercase tracking-wider">
                    {viewingPayslip.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => handleDownloadPayslip(viewingPayslip.name)}
                className="flex-1 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download PDF Payslip</span>
              </button>
              <button 
                onClick={() => setViewingPayslip(null)}
                className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Payslip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
