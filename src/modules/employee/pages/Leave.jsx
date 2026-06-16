import React, { useState } from 'react';
import { 
  Calendar, FileText, Send, XCircle, AlertCircle
} from 'lucide-react';
import { mockLeaves as initialLeaves } from '../mockData/mockLeaves';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function Leave({ showToast }) {
  const [leavesData, setLeavesData] = useState(initialLeaves);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileAttached, setFileAttached] = useState(null);

  // Auto calculate duration in days
  const leaveDays = React.useMemo(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        return diffDays;
      }
    }
    return 0;
  }, [fromDate, toDate]);

  // Form submission handler
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) {
      showToast("Please fill in all required form inputs.", "error");
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      showToast("To Date cannot be before From Date.", "error");
      return;
    }

    const newRequest = {
      id: `LR-${String(100 + leavesData.requests.length + 1)}`,
      type: leaveType,
      from: fromDate,
      to: toDate,
      days: leaveDays,
      reason: reason,
      status: "Pending"
    };

    setLeavesData(prev => ({
      ...prev,
      requests: [newRequest, ...prev.requests]
    }));

    // Reset form
    setFromDate("");
    setToDate("");
    setReason("");
    setFileAttached(null);
    showToast(`Leave request submitted successfully for ${leaveDays} day(s).`, "success");
  };

  // Cancel pending leave request handler
  const handleCancelLeave = (reqId) => {
    setLeavesData(prev => ({
      ...prev,
      requests: prev.requests.map(req => 
        req.id === reqId ? { ...req, status: "Cancelled" } : req
      )
    }));
    showToast("Leave request cancelled successfully.", "success");
  };

  const columns = [
    { header: "Request ID", accessor: "id" },
    { header: "Leave Type", accessor: "type" },
    { header: "From Date", accessor: "from" },
    { header: "To Date", accessor: "to" },
    { header: "Days", accessor: "days", render: (val) => `${val} Day(s)` },
    { header: "Reason", accessor: "reason", render: (val) => <span className="truncate max-w-[150px] block" title={val}>{val}</span> },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        row.status === 'Pending' ? (
          <button
            onClick={() => handleCancelLeave(val)}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors text-[10px] font-bold cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        ) : null
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Leave balance cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Casual Leave */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-800 font-display">Casual Leave (CL)</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Yearly Quota: 12</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center mt-4">
            <div>
              <span className="text-lg font-bold text-slate-800 font-display block">{leavesData.balances.casual.total}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
            </div>
            <div>
              <span className="text-lg font-bold text-brand-orange font-display block">{leavesData.balances.casual.used}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Availed</span>
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-600 font-display block">{leavesData.balances.casual.remaining}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Balance</span>
            </div>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-800 font-display">Sick Leave (SL)</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Yearly Quota: 6</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center mt-4">
            <div>
              <span className="text-lg font-bold text-slate-800 font-display block">{leavesData.balances.sick.total}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
            </div>
            <div>
              <span className="text-lg font-bold text-brand-orange font-display block">{leavesData.balances.sick.used}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Availed</span>
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-600 font-display block">{leavesData.balances.sick.remaining}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Balance</span>
            </div>
          </div>
        </div>

        {/* Earned Leave */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <span className="text-xs font-bold text-slate-800 font-display">Earned Leave (EL)</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Yearly Quota: 15</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center mt-4">
            <div>
              <span className="text-lg font-bold text-slate-800 font-display block">{leavesData.balances.earned.total}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
            </div>
            <div>
              <span className="text-lg font-bold text-brand-orange font-display block">{leavesData.balances.earned.used}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Availed</span>
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-600 font-display block">{leavesData.balances.earned.remaining}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Balance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main page body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Application Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            Apply For Leave
          </h3>

          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">From Date</label>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">To Date</label>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {leaveDays > 0 && (
              <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-emerald-800 text-[10px] font-bold">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Calculated Duration: {leaveDays} Day(s) leave request</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reason/Remarks</label>
              <textarea 
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief description of reasoning..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supporting Documentation (Optional)</label>
              <div className="border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100/50 transition-colors">
                <FileText className="w-6 h-6 text-slate-400" />
                <span className="text-[10px] font-semibold text-slate-600">
                  {fileAttached ? fileAttached : "Attach files (medical etc.)"}
                </span>
                <input 
                  type="file" 
                  onChange={(e) => setFileAttached(e.target.files[0]?.name || null)}
                  className="hidden" 
                  id="leave-file-input"
                />
                <label htmlFor="leave-file-input" className="text-[8px] text-slate-400 cursor-pointer hover:underline">PDF, JPG up to 2MB</label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>
          </form>
        </div>

        {/* Requests Table List */}
        <div className="lg:col-span-2 space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              My Leaves Roster history
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Track your submitted requests and cancellation updates.</p>
          </div>

          <CustomDataTable 
            columns={columns}
            data={leavesData.requests}
            searchPlaceholder="Search leave logs..."
            searchKeys={["type", "reason", "status"]}
          />
        </div>

      </div>

    </div>
  );
}
