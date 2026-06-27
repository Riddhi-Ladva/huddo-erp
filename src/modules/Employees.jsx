import React, { useState } from 'react';
import { User, ShieldAlert, Plus, Grid, List, Eye, Settings, Briefcase, FileText, CheckCircle2, ChevronRight, UserCheck, X } from 'lucide-react';
import { initialEmployees } from '../mockData';
import { DataTable, Modal } from '../components/Common';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Employees({ showToast }) {
  const [employees, setEmployees] = useState([]);

  React.useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(emp => ({
            id: emp.employee_code || emp._id,
            name: emp.full_name,
            avatar: emp.profile_photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            email: emp.email,
            mobile: emp.mobile,
            department: emp.department?.name || emp.department || "Sales",
            designation: emp.designation?.title || emp.designation || "Sales Executive",
            manager: emp.reporting_manager?.full_name || emp.reporting_manager || "Sanjay Joshi",
            joiningDate: emp.joining_date ? new Date(emp.joining_date).toISOString().split('T')[0] : "2024-01-15",
            status: emp.is_active ? "Active" : "Inactive",
            personalInfo: { address: emp.residential_address, aadhaar: emp.aadhaar_number, pan: emp.pan_number },
            jobInfo: { salary: `₹${emp.salary_structure?.basic?.toLocaleString('en-IN') || '45,000'} / month` },
            bankInfo: { bankName: emp.bank_details?.bank_name, accountNo: emp.bank_details?.account_no, ifsc: emp.bank_details?.ifsc },
            performance: [ { month: "Apr", target: 500000, achieved: 450000 } ],
            history: [ { date: emp.joining_date ? new Date(emp.joining_date).toISOString().split('T')[0] : "2024-01-15", event: "Joined Huddo Shoes distribution network." } ]
          }));
          setEmployees(mapped);
        } else if (Array.isArray(resData)) {
          // Handle direct array returns if any
          setEmployees(resData);
        } else {
          setEmployees(initialEmployees);
        }
      })
      .catch(err => {
        console.error("Error loading employees from database, falling back to mock data:", err);
        setEmployees(initialEmployees);
      });
  }, []);

  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Multi-step form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', mobile: '', address: '', aadhaar: '', pan: '',
    department: 'Sales', designation: 'Sales Executive', manager: 'Sanjay Joshi', joiningDate: '', salary: '',
    bankName: '', accountNo: '', ifsc: ''
  });

  // Profile View Drawer state
  const [viewingEmp, setViewingEmp] = useState(null);
  const [profileTab, setProfileTab] = useState('info'); // info | performance | history

  // Toggle Confirm State
  const [confirmToggleEmp, setConfirmToggleEmp] = useState(null); // employee record

  // Form Submitter
  const handleAddSubmit = () => {
    if (!newEmp.name || !newEmp.email || !newEmp.mobile || !newEmp.joiningDate) {
      showToast("Please fill all required fields in the workflow.", "error");
      return;
    }
    const createdEmp = {
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      name: newEmp.name,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      email: newEmp.email,
      mobile: newEmp.mobile,
      department: newEmp.department,
      designation: newEmp.designation,
      manager: newEmp.manager,
      joiningDate: newEmp.joiningDate,
      status: "Active",
      personalInfo: { address: newEmp.address, aadhaar: newEmp.aadhaar, pan: newEmp.pan },
      jobInfo: { salary: `₹${Number(newEmp.salary).toLocaleString('en-IN')} / month` },
      bankInfo: { bankName: newEmp.bankName, accountNo: newEmp.accountNo, ifsc: newEmp.ifsc },
      performance: [ { month: "Apr", target: 500000, achieved: 450000 } ],
      history: [ { date: newEmp.joiningDate, event: "Joined Huddo Shoes distribution network." } ]
    };

    // Save to real backend database asynchronously
    fetch('/api/employees', {
      method: 'POST',
      body: JSON.stringify({
        full_name: newEmp.name,
        email: newEmp.email,
        mobile: newEmp.mobile,
        employee_code: createdEmp.id,
        joining_date: newEmp.joiningDate,
        residential_address: newEmp.address,
        aadhaar_number: newEmp.aadhaar,
        pan_number: newEmp.pan,
        bank_details: { bank_name: newEmp.bankName, account_no: newEmp.accountNo, ifsc: newEmp.ifsc },
        department: newEmp.department,
        designation: newEmp.designation,
        is_active: true
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("[Seeder] New employee saved to MongoDB:", data);
    })
    .catch(err => console.error("Failed to save employee to database:", err));

    setEmployees([...employees, createdEmp]);
    setIsAddOpen(false);
    setStep(1);
    setNewEmp({
      name: '', email: '', mobile: '', address: '', aadhaar: '', pan: '',
      department: 'Sales', designation: 'Sales Executive', manager: 'Sanjay Joshi', joiningDate: '', salary: '',
      bankName: '', accountNo: '', ifsc: ''
    });
    showToast(`Employee "${createdEmp.name}" added successfully.`, "success");
  };

  const handleToggleConfirm = () => {
    setEmployees(employees.map(e => e.id === confirmToggleEmp.id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e));
    showToast(`Status toggled for ${confirmToggleEmp.name}`, "success");
    setConfirmToggleEmp(null);
  };

  // Filter Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
    return matchesDept && matchesStatus;
  });

  const columns = [
    { header: "Photo", accessor: "avatar", sortable: false, render: (val, row) => (
      <img src={val} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
    )},
    { header: "Employee ID", accessor: "id" },
    { header: "Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Department", accessor: "department" },
    { header: "Designation", accessor: "designation" },
    { header: "Reporting Manager", accessor: "manager" },
    { header: "Joining Date", accessor: "joiningDate" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
        {val}
      </span>
    )},
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button onClick={() => setViewingEmp(row)} className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors" title="View Profile">
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setConfirmToggleEmp(row)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
            row.status === 'Active' 
              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          {row.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Employee Management</h1>
          <p className="text-sm text-slate-500">Manage organizational roster, track performance rankings, and configure bank payroll documentation.</p>
        </div>
        
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Directory Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
          <select 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg p-2 bg-white"
          >
            <option value="All">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Inventory">Inventory</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg p-2 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Roster table */}
      <DataTable 
        columns={columns} 
        data={filteredEmployees}
        searchKeys={["name", "id", "designation", "manager"]}
        searchPlaceholder="Search by name, ID or designation..."
      />

      {/* Add Employee Multi-step Wizard Modal */}
      <Modal
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
          {/* Timeline tracker */}
          <div className="flex justify-between items-center px-6 py-2 bg-slate-50 border-b border-slate-100 rounded-lg mb-4">
            <span className={`text-xs font-bold ${step >= 1 ? 'text-brand-orange' : 'text-slate-400'}`}>1. Personal Info</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`text-xs font-bold ${step >= 2 ? 'text-brand-orange' : 'text-slate-400'}`}>2. Job Info</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`text-xs font-bold ${step >= 3 ? 'text-brand-orange' : 'text-slate-400'}`}>3. Bank & Docs</span>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Full Name *</label>
                <input type="text" placeholder="Aakash Verma" value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Mobile *</label>
                  <input type="text" placeholder="98765xxxxx" value={newEmp.mobile} onChange={(e) => setNewEmp({...newEmp, mobile: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Email *</label>
                  <input type="email" placeholder="aakash@huddo.com" value={newEmp.email} onChange={(e) => setNewEmp({...newEmp, email: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Address</label>
                <textarea rows="2" placeholder="Street details, City state..." value={newEmp.address} onChange={(e) => setNewEmp({...newEmp, address: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Aadhaar No</label>
                  <input type="text" placeholder="xxxx-xxxx-xxxx" value={newEmp.aadhaar} onChange={(e) => setNewEmp({...newEmp, aadhaar: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">PAN Card No</label>
                  <input type="text" placeholder="ABCDE1234F" value={newEmp.pan} onChange={(e) => setNewEmp({...newEmp, pan: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Department</label>
                  <select value={newEmp.department} onChange={(e) => setNewEmp({...newEmp, department: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Designation</label>
                  <input type="text" placeholder="e.g., Executive" value={newEmp.designation} onChange={(e) => setNewEmp({...newEmp, designation: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Reporting Manager</label>
                  <select value={newEmp.manager} onChange={(e) => setNewEmp({...newEmp, manager: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="Sanjay Joshi">Sanjay Joshi</option>
                    <option value="Vikram Malhotra">Vikram Malhotra</option>
                    <option value="Preeti Verma">Preeti Verma</option>
                    <option value="Neha Sen">Neha Sen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Joining Date *</label>
                  <input type="date" value={newEmp.joiningDate} onChange={(e) => setNewEmp({...newEmp, joiningDate: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Monthly Base Salary (₹) *</label>
                <input type="number" placeholder="42000" value={newEmp.salary} onChange={(e) => setNewEmp({...newEmp, salary: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Bank Name</label>
                <input type="text" placeholder="ICICI Bank" value={newEmp.bankName} onChange={(e) => setNewEmp({...newEmp, bankName: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Account Number</label>
                  <input type="text" placeholder="50100234xxxx" value={newEmp.accountNo} onChange={(e) => setNewEmp({...newEmp, accountNo: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">IFSC Code</label>
                  <input type="text" placeholder="ICIC0000010" value={newEmp.ifsc} onChange={(e) => setNewEmp({...newEmp, ifsc: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Uploads (Simulated)</label>
                <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <FileText className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Click to select files</span>
                  <span className="text-[9px] text-slate-400">PDF, JPG up to 5MB (Aadhaar, PAN, Bank Statement)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* View Employee Profile Drawer/Overlay */}
      {viewingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
              <img src={viewingEmp.avatar} alt={viewingEmp.name} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{viewingEmp.name}</h3>
                <p className="text-xs text-slate-500">{viewingEmp.designation} — ID: {viewingEmp.id}</p>
              </div>
              <button 
                onClick={() => setViewingEmp(null)}
                className="ml-auto p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50/30">
              <button 
                onClick={() => setProfileTab('info')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${profileTab === 'info' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
              >
                Profile Info
              </button>
              <button 
                onClick={() => setProfileTab('performance')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${profileTab === 'performance' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
              >
                Performance Tracking
              </button>
              <button 
                onClick={() => setProfileTab('history')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${profileTab === 'history' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
              >
                Joining & Events Log
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {profileTab === 'info' && (
                <div className="space-y-4">
                  {/* Job Information */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> Employment Job Info</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-slate-400 font-medium">Department</span><p className="font-bold text-slate-800">{viewingEmp.department}</p></div>
                      <div><span className="text-slate-400 font-medium">Designation</span><p className="font-bold text-slate-800">{viewingEmp.designation}</p></div>
                      <div><span className="text-slate-400 font-medium">Reporting Manager</span><p className="font-bold text-slate-800">{viewingEmp.manager}</p></div>
                      <div><span className="text-slate-400 font-medium">Monthly Salary</span><p className="font-bold text-emerald-600">{viewingEmp.jobInfo.salary}</p></div>
                    </div>
                  </div>

                  {/* Personal info */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Personal Identity Info</h4>
                    <div className="space-y-2 text-xs">
                      <div><span className="text-slate-400 font-medium">Address</span><p className="font-semibold text-slate-800">{viewingEmp.personalInfo.address}</p></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><span className="text-slate-400 font-medium">Aadhaar Card No</span><p className="font-bold text-slate-800">{viewingEmp.personalInfo.aadhaar}</p></div>
                        <div><span className="text-slate-400 font-medium">PAN Card No</span><p className="font-bold text-slate-800">{viewingEmp.personalInfo.pan}</p></div>
                      </div>
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Bank & Document Verification</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-slate-400 font-medium">Bank Name</span><p className="font-bold text-slate-800">{viewingEmp.bankInfo.bankName}</p></div>
                      <div><span className="text-slate-400 font-medium">Account No</span><p className="font-bold text-slate-800">{viewingEmp.bankInfo.accountNo}</p></div>
                      <div><span className="text-slate-400 font-medium">IFSC Code</span><p className="font-bold text-slate-800">{viewingEmp.bankInfo.ifsc}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'performance' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Targets vs Achieved (Last Quarter)</h4>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viewingEmp.performance} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" />
                        <YAxis fontSize={11} stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="target" fill="#cbd5e1" name="Target" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="achieved" fill="#f97316" name="Achieved" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {profileTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Employment Milestones & Logs</h4>
                  <div className="relative border-l-2 border-slate-100 pl-4 space-y-4">
                    {viewingEmp.history.map((evt, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 bg-brand-orange border-2 border-white rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-400">{evt.date}</span>
                        <p className="text-xs font-semibold text-slate-800 mt-0.5">{evt.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal for deactivation */}
      <Modal
        isOpen={confirmToggleEmp !== null}
        onClose={() => setConfirmToggleEmp(null)}
        title="Confirm Status Alteration"
        onConfirm={handleToggleConfirm}
        isDestructive={confirmToggleEmp?.status === 'Active'}
      >
        <div className="flex gap-3 text-sm">
          <ShieldAlert className="w-10 h-10 text-rose-500 shrink-0" />
          <div>
            <p className="font-bold text-slate-800">Toggle active credentials status?</p>
            <p className="text-xs text-slate-500 mt-1">Are you sure you want to change the status of <strong>{confirmToggleEmp?.name}</strong> to {confirmToggleEmp?.status === 'Active' ? 'Inactive' : 'Active'}? Inactive employees will be restricted from portal logins.</p>
          </div>
        </div>
      </Modal>

    </div>
  );
}
