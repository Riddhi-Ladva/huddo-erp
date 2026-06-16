import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Calendar, FileText, 
  HelpCircle, ShieldCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import { mockEmployeeDirectory } from '../mockData/mockEmployeeDirectory';

export default function HrLeaves({ showToast }) {
  // Local state for pending leave applications
  const [pendingLeaves, setPendingLeaves] = useState([
    { id: "LR-901", employeeName: "Arjun Mehta", employeeId: "EMP-001", type: "Casual Leave", from: "2026-06-25", to: "2026-06-26", days: 2, reason: "Urgent personal work at home" },
    { id: "LR-902", employeeName: "Suresh Rao", employeeId: "EMP-002", type: "Sick Leave", from: "2026-06-18", to: "2026-06-19", days: 2, reason: "Severe dental checkup extraction" },
    { id: "LR-903", employeeName: "Anjali Gupta", employeeId: "EMP-021", type: "Earned Leave", from: "2026-07-02", to: "2026-07-06", days: 5, reason: "Family trip outstation trip" }
  ]);

  const handleLeaveApproval = (reqId, isApproved) => {
    const target = pendingLeaves.find(l => l.id === reqId);
    showToast(`Leave request ${reqId} for ${target?.employeeName} has been ${isApproved ? "Approved" : "Rejected"}.`, "success");
    setPendingLeaves(prev => prev.filter(l => l.id !== reqId));
  };

  // Roster balances overview data mapping
  const balanceData = React.useMemo(() => {
    return mockEmployeeDirectory.slice(0, 10).map((emp, i) => ({
      id: emp.id,
      name: emp.name,
      department: emp.department,
      casual: 12 - (i % 3),
      sick: 6 - (i % 2),
      earned: 15 - (i % 4)
    }));
  }, []);

  const pendingColumns = [
    { header: "Employee Name", accessor: "employeeName", render: (val, row) => <span className="font-bold text-slate-800">{val} ({row.employeeId})</span> },
    { header: "Leave Type", accessor: "type" },
    { header: "Duration Dates", accessor: "from", render: (_, row) => `${row.from} to ${row.to}` },
    { header: "Days", accessor: "days", render: (val) => `${val} Day(s)` },
    { header: "Reason", accessor: "reason", render: (val) => <span className="truncate max-w-[150px] block" title={val}>{val}</span> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleLeaveApproval(val, true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
          
          <button 
            onClick={() => handleLeaveApproval(val, false)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-rose-250 bg-rose-50 text-rose-750 hover:bg-rose-100 transition-colors text-[10px] font-bold cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </div>
      )
    }
  ];

  const balanceColumns = [
    { header: "Employee ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (val) => <span className="font-bold text-slate-850">{val}</span> },
    { header: "Department", accessor: "department" },
    { header: "Casual (CL) Left", accessor: "casual", render: (val) => <span className="font-semibold text-slate-650">{val} / 12</span> },
    { header: "Sick (SL) Left", accessor: "sick", render: (val) => <span className="font-semibold text-slate-650">{val} / 6</span> },
    { header: "Earned (EL) Left", accessor: "earned", render: (val) => <span className="font-semibold text-slate-650">{val} / 15</span> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Overview grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Policy details card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3.5 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Company Leave Policy Rules
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-650 font-medium">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Casual Leave (CL) quota:</span>
                <span className="font-bold text-slate-800">12 Days / Year</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Sick Leave (SL) quota:</span>
                <span className="font-bold text-slate-800">6 Days / Year</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Earned Leave (EL) quota:</span>
                <span className="font-bold text-slate-800">15 Days / Year</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 font-bold italic pt-3 mt-4 border-t border-slate-100">
            Carry-forward policy: max 5 ELs roll over annually.
          </div>
        </div>

        {/* Pending approvals summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Pending Leave Approvals Queue ({pendingLeaves.length})
          </h3>

          <CustomDataTable 
            columns={pendingColumns}
            data={pendingLeaves}
            searchKeys={["employeeName", "type", "reason"]}
            searchPlaceholder="Search approvals queue..."
            emptyStateText="No pending leave applications."
          />
        </div>

      </div>

      {/* Employee balances ledger table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Employee Leave Balance Ledger
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Summary of total remaining leave balances across departments.</p>
        </div>

        <CustomDataTable 
          columns={balanceColumns}
          data={balanceData}
          searchKeys={["id", "name", "department"]}
          searchPlaceholder="Search employee balances..."
        />
      </div>

    </div>
  );
}
