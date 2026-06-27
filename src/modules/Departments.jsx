import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingCart, Archive, Percent, Users, Award, 
  ArrowLeft, CheckCircle2, AlertCircle, Plus 
} from 'lucide-react';
import { initialDepartmentsDetails, initialEmployees } from '../mockData';
import { Modal } from '../components/Common';

const ICONS_MAP = {
  TrendingUp: TrendingUp,
  ShoppingCart: ShoppingCart,
  Archive: Archive,
  Percent: Percent,
  Users: Users,
  Award: Award
};

export default function Departments({ showToast }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeptId, setSelectedDeptId] = useState(null); // id | null

  // HUDDO-UPDATE: Department — Employee list and selected checkboxes state
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  // Create Department modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({ name: '', code: '', head: '', description: '' });

  // Fetch departments and employees on mount
  React.useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = () => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(res => {
        const data = res.data || res;
        setDepartments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching departments", err);
        setLoading(false);
      });
  };

  const fetchEmployees = () => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(res => {
        const data = res.data || res;
        setEmployeesList(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching employees", err));
  };

  const handleCreateDeptSubmit = (e) => {
    e.preventDefault();
    if (!newDeptForm.name) {
      showToast("Department Name is required.", "error");
      return;
    }

    fetch('/api/departments', {
      method: 'POST',
      body: JSON.stringify(newDeptForm)
    })
      .then(res => {
        if (!res.ok) throw new Error("Creation failed");
        return res.json();
      })
      .then(res => {
        const newDept = res.data || res;
        setDepartments([...departments, newDept]);
        setIsCreateOpen(false);
        setNewDeptForm({ name: '', code: '', head: '', description: '' });
        showToast(`Department "${newDept.name}" created successfully.`, "success");
      })
      .catch(err => {
        showToast("Error creating department.", "error");
        console.error(err);
      });
  };

  const handleToggleFeature = (deptId, featureKey) => {
    const dept = departments.find(d => d.id === deptId || d._id === deptId);
    if (!dept) return;

    const currentVal = dept.features ? dept.features[featureKey] : false;
    const updatedFeatures = {
      ...(dept.features || {}),
      [featureKey]: !currentVal
    };

    fetch(`/api/departments/${deptId || dept._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features: updatedFeatures })
    })
      .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(res => {
        const updatedDept = res.data || res;
        setDepartments(departments.map(d => (d.id === deptId || d._id === deptId) ? updatedDept : d));
        showToast(
          `${featureKey} feature has been ${!currentVal ? 'enabled' : 'disabled'} for ${dept.name || dept.id} Department.`,
          "success"
        );
      })
      .catch(err => {
        showToast("Error updating department feature.", "error");
        console.error(err);
      });
  };

  // Helper to filter roster list by department
  const getDeptEmployees = (dept) => {
    if (!dept) return [];
    return employeesList.filter(emp => {
      const empDept = emp.department?._id || emp.department?.id || emp.department;
      const targetId = dept._id || dept.id;
      const empDeptName = emp.department?.name || emp.department;
      return empDept === targetId || empDeptName === dept.name || empDeptName === dept.id;
    });
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId || d._id === selectedDeptId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm font-semibold text-slate-500">Loading department configurations...</div>
      </div>
    );
  }

  if (selectedDept) {
    const IconComponent = ICONS_MAP[selectedDept.icon] || LayoutGrid;
    const deptEmps = getDeptEmployees(selectedDept);
    return (
      <div className="space-y-6">
        {/* Detail View Header */}
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Departments</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="p-3.5 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
              <IconComponent className="w-8 h-8" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Department Overview</span>
              <h1 className="text-xl font-bold text-slate-900 font-display mt-0.5">{selectedDept.name}</h1>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-1">
                <span>Head: <strong>{selectedDept.head?.full_name || selectedDept.head?.name || selectedDept.head || 'Not Assigned'}</strong></span>
                <span>•</span>
                <span>Members: <strong>{deptEmps.length || selectedDept.members || 0}</strong></span>
                <span>•</span>
                <span>Teams: <strong>{selectedDept.teams || 0}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Feature toggles list */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Feature & Sub-Module Access Configuration</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Toggle operational sub-modules to configure which features are enabled for division representatives on-field or in-office.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {selectedDept.features && Object.entries(selectedDept.features).map(([featureKey, isEnabled]) => (
              <div 
                key={featureKey}
                className="flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-xs font-bold text-slate-700">{featureKey}</span>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => handleToggleFeature(selectedDept.id || selectedDept._id, featureKey)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isEnabled ? 'bg-brand-orange' : 'bg-slate-300'
                  }`}
                >
                  <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isEnabled ? 'translate-x-6' : ''
                  }`}></span>
                </button>
              </div>
            ))}
            {(!selectedDept.features || Object.keys(selectedDept.features).length === 0) && (
              <div className="col-span-2 text-center py-6 text-slate-400 font-semibold">
                No feature switches configured for this department.
              </div>
            )}
          </div>
        </div>

        {/* HUDDO-UPDATE: Department — Individual checkboxes per employee list */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Department Employee Roster</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Roster list of personnel currently assigned to {selectedDept.name} department.</p>
            </div>
            {selectedEmployees.size > 0 && (
              <span className="text-xs font-bold text-brand-orange bg-orange-50 px-2.5 py-1 rounded-lg">
                {selectedEmployees.size} selected
              </span>
            )}
          </div>
          <div className="border border-slate-100 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox"
                      checked={deptEmps.length > 0 && selectedEmployees.size === deptEmps.length}
                      onChange={() => {
                        if (selectedEmployees.size === deptEmps.length) {
                          setSelectedEmployees(new Set());
                        } else {
                          setSelectedEmployees(new Set(deptEmps.map(emp => emp.id || emp._id)));
                        }
                      }}
                      className="w-4 h-4 rounded text-brand-orange border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptEmps.length > 0 ? (
                  deptEmps.map(emp => {
                    const empId = emp.id || emp._id;
                    const isChecked = selectedEmployees.has(empId);
                    return (
                      <tr key={empId} className="hover:bg-slate-50/20">
                        <td className="px-4 py-2.5">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const newSelected = new Set(selectedEmployees);
                              if (newSelected.has(empId)) {
                                newSelected.delete(empId);
                              } else {
                                newSelected.add(empId);
                              }
                              setSelectedEmployees(newSelected);
                            }}
                            className="w-4 h-4 rounded text-brand-orange border-slate-300 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <img src={emp.avatar || emp.profile_photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} alt={emp.full_name || emp.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">{emp.employee_code || emp.id || emp._id}</td>
                        <td className="px-4 py-2.5 text-slate-900 font-bold">{emp.full_name || emp.name}</td>
                        <td className="px-4 py-2.5 text-slate-500">{emp.designation?.title || emp.designation || 'Sales Executive'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'Active' || emp.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {emp.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">
                      No employees mapped to this department yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Department Management</h1>
          <p className="text-sm text-slate-500">Enable features, verify division heads, and customize core workflows for departmental staff.</p>
        </div>
        
        {/* HUDDO-UPDATE: Department — Add Create Department button */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Department</span>
        </button>
      </div>

      {/* Six Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
          const IconComponent = ICONS_MAP[dept.icon] || TrendingUp;
          const deptEmps = getDeptEmployees(dept);
          const deptId = dept.id || dept._id;
          return (
            <div 
              key={deptId}
              onClick={() => setSelectedDeptId(deptId)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-orange hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="p-3 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl group-hover:text-brand-orange transition-colors">
                  <IconComponent className="w-6 h-6 text-brand-orange" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{deptEmps.length || dept.members || 0} Personnel Mapped</span>
              </div>
              
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-800 font-display">{dept.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Division Head: {dept.head?.full_name || dept.head?.name || dept.head || 'Not Assigned'}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Click to configure feature toggles...</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* HUDDO-UPDATE: Department — Create Department Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Department"
        onConfirm={handleCreateDeptSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Marketing & Growth"
              value={newDeptForm.name}
              onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white text-slate-800"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department Code (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g., MKTG"
              value={newDeptForm.code}
              onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign Manager</label>
            <select
              value={newDeptForm.head}
              onChange={(e) => setNewDeptForm({ ...newDeptForm, head: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-slate-800"
            >
              <option value="">Select Manager...</option>
              {employeesList.map(emp => {
                const userId = emp.user?._id || emp.user || '';
                return (
                  <option key={emp.id || emp._id} value={userId}>{emp.full_name || emp.name} ({emp.designation?.title || emp.designation || 'Sales Executive'})</option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
            <textarea 
              rows="3" 
              placeholder="Describe department operations, goals, etc."
              value={newDeptForm.description}
              onChange={(e) => setNewDeptForm({ ...newDeptForm, description: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white text-slate-800"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Dummy Icon fallback
function LayoutGrid(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}
