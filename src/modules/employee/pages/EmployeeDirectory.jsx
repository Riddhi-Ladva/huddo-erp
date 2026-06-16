import React, { useState } from 'react';
import { 
  Users, Plus, Eye, UserCheck, ShieldAlert, 
  ChevronRight, Briefcase, User, FileText, X
} from 'lucide-react';
import { mockEmployeeDirectory as initialDirectory } from '../mockData/mockEmployeeDirectory';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function EmployeeDirectory({ showToast }) {
  const [directory, setDirectory] = useState(initialDirectory);
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState("info");

  // Add Employee Form Wizard states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', mobile: '', address: '', aadhaar: '', pan: '',
    department: 'Sales', designation: 'Sales Executive', manager: 'Vikram Shah', joiningDate: '', salary: '',
    bankName: '', accountNo: '', ifsc: ''
  });

  const filteredDirectory = React.useMemo(() => {
    let result = [...directory];
    if (filterDept !== "All") {
      result = result.filter(e => e.department === filterDept);
    }
    if (filterStatus !== "All") {
      result = result.filter(e => e.status === filterStatus);
    }
    return result;
  }, [directory, filterDept, filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmp(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = (empId) => {
    setDirectory(prev => prev.map(e => {
      if (e.id === empId) {
        const nextStatus = e.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Employee ${e.name} has been ${nextStatus === 'Active' ? 'activated' : 'deactivated'}.`, "success");
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  const handleAddSubmit = () => {
    if (!newEmp.name || !newEmp.email || !newEmp.mobile || !newEmp.joiningDate || !newEmp.salary) {
      showToast("Please fill all required inputs in the workflow.", "error");
      return;
    }

    const createdEmp = {
      id: `EMP-${String(directory.length + 1).padStart(3, '0')}`,
      name: newEmp.name,
      department: newEmp.department,
      designation: newEmp.designation,
      reportingManagerName: newEmp.manager,
      joiningDate: newEmp.joiningDate,
      status: "Active",
      email: newEmp.email,
      mobile: newEmp.mobile,
      address: newEmp.address,
      aadhaar: `XXXX-XXXX-${newEmp.aadhaar.slice(-4) || '1234'}`,
      pan: newEmp.pan || 'ABCDE1234F',
      salaryBand: `₹${Number(newEmp.salary).toLocaleString()} / month`,
      joiningHistory: [
        { date: newEmp.joiningDate, event: `Joined as ${newEmp.designation}` }
      ],
      bankDetails: {
        accountNumber: `XXXX-XXXX-${newEmp.accountNo.slice(-4) || '9999'}`,
        ifsc: newEmp.ifsc || 'HDFC0000001',
        bankName: newEmp.bankName || 'HDFC Bank'
      }
    };

    setDirectory([...directory, createdEmp]);
    setIsAddOpen(false);
    setStep(1);
    setNewEmp({
      name: '', email: '', mobile: '', address: '', aadhaar: '', pan: '',
      department: 'Sales', designation: 'Sales Executive', manager: 'Vikram Shah', joiningDate: '', salary: '',
      bankName: '', accountNo: '', ifsc: ''
    });
    showToast(`Employee profile for ${createdEmp.name} successfully registered in roster.`, "success");
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    { header: "Reporting Manager", accessor: "reportingManagerName" },
    { header: "Joining Date", accessor: "joiningDate" },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => { setSelectedEmp(row); setActiveProfileTab("info"); }}
            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-850 rounded transition-colors cursor-pointer"
            title="View Profile Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleToggleStatus(val)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
              row.status === 'Active' 
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Employee Directory</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit system rosters, access profile summaries, and manage employment status logs.</p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">HR</option>
              <option value="Inventory">Inventory</option>
              <option value="Purchase">Purchase</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-bold">
          Found {filteredDirectory.length} employees registered
        </div>
      </div>

      {/* Directory Table */}
      <CustomDataTable 
        columns={columns}
        data={filteredDirectory}
        searchKeys={["id", "name", "department", "designation", "reportingManagerName"]}
        searchPlaceholder="Search employee database..."
      />

      {/* View Details Drawer Overlay */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-display text-xl border border-slate-200">
                  {selectedEmp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">{selectedEmp.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedEmp.designation} &bull; ID: {selectedEmp.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="ml-auto p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex border-b border-slate-200 px-6 bg-slate-50/30">
                <button 
                  onClick={() => setActiveProfileTab("info")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeProfileTab === 'info' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
                >
                  Roster Details
                </button>
                <button 
                  onClick={() => setActiveProfileTab("history")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeProfileTab === 'history' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
                >
                  Employment History Log
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">
                {activeProfileTab === 'info' ? (
                  <div className="space-y-4">
                    {/* Employment job details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Employment Job Info
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-slate-400 font-semibold">Department</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.department}</p></div>
                        <div><span className="text-slate-400 font-semibold">Designation</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.designation}</p></div>
                        <div><span className="text-slate-400 font-semibold">Reporting Manager</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.reportingManagerName}</p></div>
                        <div><span className="text-slate-400 font-semibold">Salary Band (Private)</span><p className="font-bold text-emerald-650 mt-0.5">{selectedEmp.salaryBand}</p></div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Identity & Contact Info
                      </h4>
                      <div className="space-y-2.5 text-xs">
                        <div><span className="text-slate-400 font-semibold">Residential Address</span><p className="font-semibold text-slate-750 mt-0.5">{selectedEmp.address}</p></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><span className="text-slate-400 font-semibold">Email</span><p className="font-semibold text-slate-800 mt-0.5">{selectedEmp.email}</p></div>
                          <div><span className="text-slate-400 font-semibold">Mobile</span><p className="font-semibold text-slate-800 mt-0.5">{selectedEmp.mobile}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><span className="text-slate-400 font-semibold">Aadhaar (Masked)</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.aadhaar}</p></div>
                          <div><span className="text-slate-400 font-semibold">PAN (Masked)</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.pan}</p></div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Salary Credit Bank Details
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-700">
                        <div><span className="text-slate-400 text-[9px] font-bold uppercase block">Bank Name</span>{selectedEmp.bankDetails?.bankName}</div>
                        <div><span className="text-slate-400 text-[9px] font-bold uppercase block">Account No</span>{selectedEmp.bankDetails?.accountNumber}</div>
                        <div><span className="text-slate-400 text-[9px] font-bold uppercase block">IFSC Code</span>{selectedEmp.bankDetails?.ifsc}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase">Employment Milestones & Logs</h4>
                    <div className="relative border-l border-slate-150 pl-4 space-y-4 text-xs">
                      {selectedEmp.joiningHistory?.map((h, i) => (
                        <div key={i} className="relative">
                          <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 bg-brand-orange border-2 border-white rounded-full"></span>
                          <span className="text-[9px] font-bold text-slate-400">{h.date}</span>
                          <p className="font-bold text-slate-800 mt-0.5">{h.event}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedEmp(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal Wizard */}
      <CustomModal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); setStep(1); }}
        title={`Add Employee Wizard (Step ${step} of 3)`}
        confirmText={step === 3 ? "Complete Add" : "Next Step"}
        onConfirm={() => {
          if (step < 3) setStep(step + 1);
          else handleAddSubmit();
        }}
      >
        <div className="space-y-4">
          {/* Progress tracker */}
          <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border border-slate-150 rounded-xl mb-4 text-[10px] font-bold select-none">
            <span className={step >= 1 ? 'text-brand-orange' : 'text-slate-400'}>1. Personal Info</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className={step >= 2 ? 'text-brand-orange' : 'text-slate-400'}>2. Job Settings</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className={step >= 3 ? 'text-brand-orange' : 'text-slate-400'}>3. Bank & Roster</span>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name *</label>
                <input type="text" name="name" placeholder="Aakash Verma" value={newEmp.name} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile *</label>
                  <input type="text" name="mobile" placeholder="98765xxxxx" value={newEmp.mobile} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email *</label>
                  <input type="email" name="email" placeholder="aakash@huddo.com" value={newEmp.email} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Residential Address</label>
                <textarea rows="2" name="address" placeholder="Flat No, Street details..." value={newEmp.address} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Aadhaar Card No</label>
                  <input type="text" name="aadhaar" placeholder="xxxx-xxxx-xxxx" value={newEmp.aadhaar} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">PAN Card No</label>
                  <input type="text" name="pan" placeholder="ABCDE1234F" value={newEmp.pan} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
                  <select name="department" value={newEmp.department} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none">
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Designation</label>
                  <input type="text" name="designation" placeholder="e.g. Sales Executive" value={newEmp.designation} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reporting Manager</label>
                  <select name="manager" value={newEmp.manager} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none">
                    <option value="Vikram Shah">Vikram Shah</option>
                    <option value="Nisha Sen">Nisha Sen</option>
                    <option value="Sanjay Joshi">Sanjay Joshi</option>
                    <option value="Ramesh Patel">Ramesh Patel</option>
                    <option value="Karan Johar">Karan Johar</option>
                    <option value="Rohan Hudda">Rohan Hudda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Joining Date *</label>
                  <input type="date" name="joiningDate" value={newEmp.joiningDate} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Monthly base salary (₹) *</label>
                <input type="number" name="salary" placeholder="32000" value={newEmp.salary} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Bank Name</label>
                <input type="text" name="bankName" placeholder="ICICI Bank" value={newEmp.bankName} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Account Number</label>
                  <input type="text" name="accountNo" placeholder="50100xxxxx" value={newEmp.accountNo} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">IFSC Code</label>
                  <input type="text" name="ifsc" placeholder="ICIC0000102" value={newEmp.ifsc} onChange={handleInputChange} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-800" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Document Uploads (Simulated)</label>
                <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <FileText className="w-6 h-6 text-slate-400" />
                  <span className="text-[10px] font-semibold text-slate-650">Select PDF, JPG files</span>
                  <span className="text-[8px] text-slate-400">Identity proofs up to 5MB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomModal>

    </div>
  );
}
