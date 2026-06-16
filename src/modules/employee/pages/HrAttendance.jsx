import React, { useState } from 'react';
import { 
  Users, Activity, Calendar, ArrowDownToLine, 
  ChevronRight, RefreshCw, AlertCircle, Edit
} from 'lucide-react';
import { mockEmployeeDirectory } from '../mockData/mockEmployeeDirectory';
import { mockAttendance } from '../mockData/mockAttendance';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function HrAttendance({ showToast }) {
  // Local state for tracking manual correction
  const [selectedDept, setSelectedDept] = useState(null); // String department name
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  
  // Correction Form States
  const [correctEmpId, setCorrectEmpId] = useState("");
  const [correctDate, setCorrectDate] = useState("2026-06-16");
  const [correctStatus, setCorrectStatus] = useState("Present");
  
  // Custom mock database for HR view
  const [departmentSummary, setDepartmentSummary] = useState([
    { department: "Sales", total: 4, present: 3, absent: 0, leave: 1 },
    { department: "Finance", total: 2, present: 1, absent: 1, leave: 0 },
    { department: "Human Resources", total: 2, present: 2, absent: 0, leave: 0 },
    { department: "Inventory", total: 2, present: 1, absent: 1, leave: 0 },
    { department: "Purchase", total: 2, present: 2, absent: 0, leave: 0 },
    { department: "Marketing", total: 1, present: 1, absent: 0, leave: 0 }
  ]);

  // Dynamic monthly grid (June 2026)
  const juneDates = Array.from({ length: 15 }, (_, i) => `2026-06-${String(i + 1).padStart(2, '0')}`); // show first 15 days for compactness
  
  // Drill down data mapping
  const drillDownData = React.useMemo(() => {
    if (!selectedDept) return [];
    return mockEmployeeDirectory.filter(e => e.department.toLowerCase().includes(selectedDept.toLowerCase()) || selectedDept.toLowerCase().includes(e.department.toLowerCase()));
  }, [selectedDept]);

  const handleExportRoster = () => {
    console.log("Exporting HR Roster Report June 2026");
    showToast("Monthly attendance report compiled and downloaded (Logs in console).", "success");
  };

  const handleCorrectionSubmit = () => {
    if (!correctEmpId) {
      showToast("Please select an employee.", "error");
      return;
    }
    const empName = mockEmployeeDirectory.find(e => e.id === correctEmpId)?.name || "Employee";
    showToast(`Manual correction logged: ${empName} status updated to ${correctStatus} on ${correctDate}.`, "success");
    setIsCorrectionOpen(false);
    setCorrectEmpId("");
  };

  const deptColumns = [
    { header: "Department Name", accessor: "department", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Roster Headcount", accessor: "total" },
    { header: "Present Today", accessor: "present", render: (val) => <span className="text-emerald-600 font-bold">{val}</span> },
    { header: "Absent Today", accessor: "absent", render: (val) => <span className="text-rose-600 font-bold">{val}</span> },
    { header: "On Approved Leave", accessor: "leave", render: (val) => <span className="text-purple-600 font-bold">{val}</span> },
    { 
      header: "Action", 
      accessor: "department", 
      sortable: false, 
      render: (val) => (
        <button 
          onClick={() => setSelectedDept(val)}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer"
        >
          <span>Drill Down</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  const drillColumns = [
    { header: "Employee ID", accessor: "id" },
    { header: "Employee Name", accessor: "name", render: (val) => <span className="font-bold text-slate-850">{val}</span> },
    { header: "Designation", accessor: "designation" },
    { 
      header: "Today Status", 
      accessor: "id", 
      render: (val, row) => {
        // Return a mock mix of statuses
        const statusMap = {
          "EMP-001": "Present",
          "EMP-002": "Present",
          "EMP-050": "Present",
          "EMP-020": "Present",
          "EMP-021": "Present",
          "EMP-030": "Present",
          "EMP-040": "Present",
          "EMP-045": "Present",
          "EMP-046": "Present"
        };
        const status = statusMap[val] || (val === 'EMP-102' ? 'Absent' : 'Leave');
        return <StatusBadge status={status} />;
      }
    },
    { 
      header: "Check-in log", 
      accessor: "id", 
      render: (val) => {
        const timeMap = {
          "EMP-001": "09:15 AM - 06:10 PM",
          "EMP-050": "09:02 AM - 06:05 PM",
          "EMP-020": "09:10 AM - 06:00 PM",
          "EMP-030": "09:20 AM - 06:30 PM"
        };
        return <span className="text-[10px] font-bold text-slate-500">{timeMap[val] || "--:--"}</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top dashboard control headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Roster Attendance Control</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Department breakdown stats, correction forms, and monthly reports.</p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsCorrectionOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 bg-white transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4 text-slate-400" />
            <span>Manual Correction</span>
          </button>
          
          <button 
            onClick={handleExportRoster}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Export Roster Report</span>
          </button>
        </div>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Roster Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            Department Daily Summaries
          </h3>

          <CustomDataTable 
            columns={deptColumns}
            data={departmentSummary}
            searchKeys={["department"]}
            searchPlaceholder="Search departments..."
          />
        </div>

        {/* Drill down drawer sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            Department Drill-Down
          </h3>
          
          {selectedDept ? (
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-xs font-extrabold text-slate-700">{selectedDept} Employees</span>
                <button 
                  onClick={() => setSelectedDept(null)}
                  className="text-[10px] text-brand-orange font-bold hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              <div className="overflow-x-auto max-h-[300px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400">
                      <th className="p-2">Employee</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {drillDownData.map((e, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold">
                          <span>{e.name}</span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">{e.designation}</span>
                        </td>
                        <td className="p-2 text-center">
                          <StatusBadge status={e.status === 'Active' ? 'Present' : 'Leave'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-slate-350" />
              <span>Click "Drill Down" on any department row to view specific employee check-ins.</span>
            </div>
          )}
        </div>

      </div>

      {/* Grid: Monthly grid calendar report matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          Roster Matrix Grid (June 1 - June 15)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 border-r border-slate-200 font-bold text-slate-500">Employee ID</th>
                <th className="p-3 border-r border-slate-200 font-bold text-slate-500 min-w-[140px]">Employee Name</th>
                {juneDates.map((d, i) => (
                  <th key={i} className="p-2 border-r border-slate-200 font-bold text-slate-400 text-center text-[10px]">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700 font-medium">
              {mockEmployeeDirectory.slice(0, 8).map((emp, empIdx) => (
                <tr key={empIdx} className="hover:bg-slate-50/50">
                  <td className="p-3 border-r border-slate-200 font-mono font-bold">{emp.id}</td>
                  <td className="p-3 border-r border-slate-200 font-semibold text-slate-800">{emp.name}</td>
                  {juneDates.map((_, dateIdx) => {
                    // Generate a semi-random grid cell status
                    let status = "P";
                    if (dateIdx === 5 || dateIdx === 6 || dateIdx === 12 || dateIdx === 13) status = "W"; // Weekends
                    else if (emp.id === 'EMP-102') status = "A"; // Inactive
                    else if ((empIdx + dateIdx) % 11 === 0) status = "L"; // Leaves
                    else if ((empIdx + dateIdx) % 8 === 0) status = "H"; // Half-day
                    
                    const colorMap = {
                      "P": "text-emerald-600 bg-emerald-50 border-emerald-100",
                      "A": "text-rose-600 bg-rose-50 border-rose-100",
                      "L": "text-purple-650 bg-purple-50 border-purple-100",
                      "H": "text-amber-600 bg-amber-50 border-amber-100",
                      "W": "text-slate-450 bg-slate-50 border-slate-200"
                    };

                    return (
                      <td key={dateIdx} className={`p-2 border-r border-slate-200 text-center font-extrabold text-[10px] ${colorMap[status]}`}>
                        {status}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 justify-center pt-2">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-center leading-none text-[8px] font-extrabold flex items-center justify-center rounded">P</span> Present</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-50 border border-rose-200 text-rose-700 text-center leading-none text-[8px] font-extrabold flex items-center justify-center rounded">A</span> Absent</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-50 border border-purple-200 text-purple-700 text-center leading-none text-[8px] font-extrabold flex items-center justify-center rounded">L</span> Approved Leave</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-50 border border-amber-200 text-amber-700 text-center leading-none text-[8px] font-extrabold flex items-center justify-center rounded">H</span> Half Day</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-50 border border-slate-200 text-slate-500 text-center leading-none text-[8px] font-extrabold flex items-center justify-center rounded">W</span> Weekend / Holiday</div>
        </div>
      </div>

      {/* Manual Correction Modal Form */}
      <CustomModal
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        title="Manual Attendance Correction Form"
        confirmText="Save Correction"
        onConfirm={handleCorrectionSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Employee *</label>
            <select
              value={correctEmpId}
              onChange={(e) => setCorrectEmpId(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            >
              <option value="">-- Choose Employee --</option>
              {mockEmployeeDirectory.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Date</label>
              <input 
                type="date" 
                value={correctDate}
                onChange={(e) => setCorrectDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Corrected Status</label>
              <select
                value={correctStatus}
                onChange={(e) => setCorrectStatus(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Leave">Leave</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
