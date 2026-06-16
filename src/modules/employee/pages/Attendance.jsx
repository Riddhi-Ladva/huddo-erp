import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, ArrowDownToLine, 
  ChevronLeft, ChevronRight, Activity, Smile
} from 'lucide-react';
import { mockAttendance as initialAttendance } from '../mockData/mockAttendance';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function Attendance({ showToast }) {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [selectedMonth, setSelectedMonth] = useState("2026-06");

  // Filter history table
  const filteredHistory = attendance.filter(record => record.date.startsWith(selectedMonth));

  // Calendar stats calculations
  const stats = React.useMemo(() => {
    const records = attendance.filter(r => r.date.startsWith(selectedMonth));
    const present = records.filter(r => r.status === 'Present' || r.status === 'Half Day').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const leaves = records.filter(r => r.status === 'Leave').length;
    const halfDays = records.filter(r => r.status === 'Half Day').length;
    return { present, absent, leaves, halfDays };
  }, [attendance, selectedMonth]);

  // Handle mock export action
  const handleExport = () => {
    console.log("Exporting Attendance Data:", filteredHistory);
    showToast("Attendance history downloaded successfully (Logs generated in console).", "success");
  };

  // Color mapper for calendar days
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/50';
      case 'Absent': return 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/50';
      case 'Half Day': return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/50';
      case 'Leave': return 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/50';
      case 'Holiday':
      case 'Weekend':
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50';
    }
  };

  const columns = [
    { header: "Date", accessor: "date", sortable: true },
    { header: "Day", accessor: "day" },
    { header: "Check-in Time", accessor: "checkIn", render: (val) => val || "--:--" },
    { header: "Check-out Time", accessor: "checkOut", render: (val) => val || "--:--" },
    { header: "Working Hours", accessor: "hours", render: (val) => val ? `${val} hrs` : "0.0 hrs" },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Ticker cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Present Days</span>
          <span className="text-xl font-bold text-slate-800 mt-1 block">{stats.present} Days</span>
          <span className="text-[10px] text-slate-500 font-medium">{stats.halfDays} half-day shifts included</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Absent Days</span>
          <span className="text-xl font-bold text-rose-600 mt-1 block">{stats.absent} Days</span>
          <span className="text-[10px] text-slate-500 font-medium">Lop deductions applied</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved Leaves</span>
          <span className="text-xl font-bold text-purple-600 mt-1 block">{stats.leaves} Days</span>
          <span className="text-[10px] text-slate-500 font-medium">Charged from balances</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Working Ratio</span>
            <span className="text-xl font-bold text-emerald-600 mt-1 block">
              {filteredHistory.length > 0 
                ? `${Math.round((stats.present / (filteredHistory.filter(r => r.status !== 'Weekend' && r.status !== 'Holiday').length || 1)) * 100)}%` 
                : '100%'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Smile className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Calendar Grid card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            Duty Calendar View
          </h3>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedMonth("2026-05")}
              className={`p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer ${selectedMonth === "2026-05" ? "bg-slate-100 opacity-50" : ""}`}
              disabled={selectedMonth === "2026-05"}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 min-w-[100px] text-center uppercase">
              {selectedMonth === "2026-06" ? "June 2026" : "May 2026"}
            </span>
            <button 
              onClick={() => setSelectedMonth("2026-06")}
              className={`p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer ${selectedMonth === "2026-06" ? "bg-slate-100 opacity-50" : ""}`}
              disabled={selectedMonth === "2026-06"}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Days Headers */}
        <div className="grid grid-cols-7 gap-2 text-center font-bold text-[9px] uppercase tracking-wider text-slate-400 mb-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* 30 Days Grid */}
        <div className="grid grid-cols-7 gap-2 min-h-[280px]">
          {/* Mock Offset days if needed - June 1, 2026 starts on Monday (no offset needed) */}
          {selectedMonth === "2026-05" && (
            // May 1, 2026 starts on Friday - 4 offset empty cards
            <>
              <div className="bg-slate-50/20 border border-dashed border-slate-100 rounded-lg min-h-[50px]"></div>
              <div className="bg-slate-50/20 border border-dashed border-slate-100 rounded-lg min-h-[50px]"></div>
              <div className="bg-slate-50/20 border border-dashed border-slate-100 rounded-lg min-h-[50px]"></div>
              <div className="bg-slate-50/20 border border-dashed border-slate-100 rounded-lg min-h-[50px]"></div>
            </>
          )}

          {filteredHistory.map((day, idx) => (
            <div 
              key={idx} 
              className={`border p-2 rounded-xl flex flex-col justify-between transition-colors min-h-[60px] ${getStatusColor(day.status)}`}
            >
              <span className="text-xs font-bold font-display">{new Date(day.date).getDate()}</span>
              <div className="flex flex-col text-[8px] font-bold mt-1 uppercase text-left tracking-wider">
                <span>{day.status}</span>
                {day.checkIn && (
                  <span className="text-[7px] text-slate-500 mt-0.5 font-medium tracking-normal">{day.checkIn} - {day.checkOut || "Active"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History table and actions */}
      <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-150 pb-3 mb-1">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Attendance History Ledger
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Filter by month and export duty rosters locally.</p>
          </div>

          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 bg-white transition-colors cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Export Roster</span>
          </button>
        </div>

        <CustomDataTable 
          columns={columns}
          data={filteredHistory}
          searchPlaceholder="Search days..."
          searchKeys={["date", "day", "status"]}
        />
      </div>

    </div>
  );
}
