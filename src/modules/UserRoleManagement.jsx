import React, { useState } from 'react';
import { Shield, UserPlus, FileText, CheckSquare, XSquare, Plus } from 'lucide-react';
import { initialUsers, STANDARD_ROLES, MODULES_LIST, PERMISSIONS_LIST, initialRolePermissions } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function UserRoleManagement({ showToast }) {
  const [activeTab, setActiveTab] = useState('users'); // users | roles
  const [users, setUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);
  const [customRoles, setCustomRoles] = useState([]);

  React.useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            mobile: u.mobile,
            role: u.role?.name || u.role || 'Sales Executive',
            department: u.department || 'Sales',
            status: u.is_active ? 'Active' : 'Inactive'
          }));
          setUsers(mapped);
        } else {
          setUsers(initialUsers);
        }
      })
      .catch(err => {
        console.error("Error loading users:", err);
        setUsers(initialUsers);
      });
  }, []);

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', mobile: '', role: 'Sales Executive', department: 'Sales', status: 'Active' });

  // Custom Role Creator State
  const [isCustomRoleOpen, setIsCustomRoleOpen] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');

  // Edit Role Permission State
  const [editingRole, setEditingRole] = useState(null); // role name
  const [tempPermissions, setTempPermissions] = useState({}); // permissions copy

  // Create User Handler
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.mobile) {
      showToast("Please fill all fields.", "error");
      return;
    }
    const newUser = {
      id: `U-${Date.now()}`,
      ...newUserData
    };

    // Save to backend database
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: newUserData.name,
        email: newUserData.email,
        mobile: newUserData.mobile,
        roleName: newUserData.role,
        password: 'password123',
        is_active: newUserData.status === 'Active'
      })
    }).catch(err => console.error("Failed to save user to backend:", err));

    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    setNewUserData({ name: '', email: '', mobile: '', role: 'Sales Executive', department: 'Sales', status: 'Active' });
    showToast("User added successfully!", "success");
  };

  // Add Custom Role Handler
  const handleAddCustomRole = () => {
    if (!customRoleName.trim()) {
      showToast("Please enter a valid role name.", "error");
      return;
    }
    const sanitizedRoleName = customRoleName.trim();
    if (STANDARD_ROLES.includes(sanitizedRoleName) || customRoles.includes(sanitizedRoleName)) {
      showToast("Role already exists.", "error");
      return;
    }

    setCustomRoles([...customRoles, sanitizedRoleName]);
    
    // Seed blank permission matrix for this custom role
    const blankPerms = MODULES_LIST.reduce((acc, mod) => {
      acc[mod] = PERMISSIONS_LIST.reduce((pAcc, perm) => {
        pAcc[perm] = false;
        return pAcc;
      }, {});
      return acc;
    }, {});

    setRolePermissions({
      ...rolePermissions,
      [sanitizedRoleName]: blankPerms
    });

    setIsCustomRoleOpen(false);
    setCustomRoleName('');
    showToast(`Custom role "${sanitizedRoleName}" created successfully!`, "success");
  };

  // Open Permission Matrix editor
  const handleEditRole = (role) => {
    setEditingRole(role);
    setTempPermissions(JSON.parse(JSON.stringify(rolePermissions[role] || {})));
  };

  // Toggle single permission checkbox
  const handlePermissionToggle = (module, permission) => {
    const isReadOnly = ["Founder", "CEO", "Admin"].includes(editingRole);
    if (isReadOnly) {
      showToast("Standard system administration roles are locked as full-access (read-only override).", "error");
      return;
    }
    setTempPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission]
      }
    }));
  };

  // Save Role Permissions Matrix
  const handleSavePermissions = () => {
    setRolePermissions(prev => ({
      ...prev,
      [editingRole]: tempPermissions
    }));
    setEditingRole(null);
    showToast(`Permissions for "${editingRole}" updated.`, "success");
  };

  // User table columns configuration
  const userColumns = [
    { header: "User ID", accessor: "id" },
    { header: "Full Name", accessor: "name" },
    { header: "Email Address", accessor: "email" },
    { header: "Role Mapping", accessor: "role", render: (val) => (
      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-brand-orange" />
        {val}
      </span>
    )},
    { header: "Department", accessor: "department" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
        {val}
      </span>
    )},
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <button 
        onClick={() => {
          setUsers(users.map(u => u.id === val ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
          showToast(`Toggled status for ${row.name}`, "success");
        }}
        className="text-xs font-bold text-brand-orange hover:underline"
      >
        Toggle Status
      </button>
    )}
  ];

  // Map role list for Role Management table
  const allAvailableRoles = [...STANDARD_ROLES, ...customRoles];
  const roleListData = allAvailableRoles.map(role => {
    const permissions = rolePermissions[role] || {};
    let activeCount = 0;
    Object.values(permissions).forEach(modulesMap => {
      Object.values(modulesMap).forEach(val => {
        if (val) activeCount++;
      });
    });
    return { name: role, count: activeCount };
  });

  const roleColumns = [
    { header: "Role Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Permissions Count", accessor: "count", render: (val) => <span className="font-semibold text-slate-600">{val} total nodes active</span> },
    { header: "Configuration", accessor: "name", sortable: false, render: (val) => (
      <button 
        onClick={() => handleEditRole(val)}
        className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded hover:bg-slate-200 transition-colors"
      >
        Edit Permissions Matrix
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">User & Role Management</h1>
          <p className="text-sm text-slate-500">Configure administrative system access, custom permission nodes, and department assignment matrices.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'users' ? (
            <button 
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add System User</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsCustomRoleOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'users' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Users Directory ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'roles' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Roles & Permissions Matrix ({allAvailableRoles.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'users' ? (
        <DataTable 
          columns={userColumns} 
          data={users} 
          searchKeys={["name", "email", "role", "department"]} 
          searchPlaceholder="Search by name, email, role or department..."
        />
      ) : (
        <DataTable 
          columns={roleColumns} 
          data={roleListData} 
          searchKeys={["name"]}
          searchPlaceholder="Search roles..."
        />
      )}

      {/* Add User Modal */}
      <Modal 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        title="Add New System User"
        onConfirm={handleAddUserSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g., Ramesh Bhatia"
              value={newUserData.name}
              onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="ramesh@huddo.com"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
              <input 
                type="text" 
                placeholder="987654xxxx"
                value={newUserData.mobile}
                onChange={(e) => setNewUserData({...newUserData, mobile: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Role</label>
              <select 
                value={newUserData.role}
                onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              >
                {allAvailableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
              <select 
                value={newUserData.department}
                onChange={(e) => setNewUserData({...newUserData, department: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              >
                <option value="Executive">Executive</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Inventory">Inventory</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-semibold text-slate-700">Account Access Status</span>
            <button 
              type="button"
              onClick={() => setNewUserData({...newUserData, status: newUserData.status === 'Active' ? 'Inactive' : 'Active'})}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${newUserData.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${newUserData.status === 'Active' ? 'translate-x-6' : ''}`}></span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Custom Role Modal */}
      <Modal 
        isOpen={isCustomRoleOpen} 
        onClose={() => setIsCustomRoleOpen(false)} 
        title="Create Custom System Role"
        onConfirm={handleAddCustomRole}
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 uppercase">Custom Role Name</label>
          <input 
            type="text" 
            placeholder="e.g., Regional Logistic Supervisor"
            value={customRoleName}
            onChange={(e) => setCustomRoleName(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
          />
          <p className="text-[10px] text-slate-400 font-medium">Creating this role initializes a complete, unpopulated permission matrix. You can customize modules access controls immediately after adding.</p>
        </div>
      </Modal>

      {/* Permissions Matrix Detail Drawer/Editor */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-full shadow-2xl border-l border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Permissions Matrix: {editingRole}</h3>
                <p className="text-xs text-slate-500">Enable/disable module access codes across operations. Grayed items represent unavailable configurations.</p>
              </div>
              <button 
                onClick={() => setEditingRole(null)}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XSquare className="w-6 h-6" />
              </button>
            </div>

            {/* Matrix grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                      <th className="px-4 py-3">Module Name</th>
                      {PERMISSIONS_LIST.map(perm => (
                        <th key={perm} className="px-3 py-3 text-center">{perm}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {MODULES_LIST.map(mod => (
                      <tr key={mod} className="hover:bg-slate-50/30">
                        <td className="px-4 py-3 font-semibold text-slate-800">{mod}</td>
                        {PERMISSIONS_LIST.map(perm => {
                          const isChecked = tempPermissions[mod]?.[perm] || false;
                          const isLocked = ["Founder", "CEO", "Admin"].includes(editingRole);
                          return (
                            <td key={perm} className="px-3 py-3 text-center">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                disabled={isLocked}
                                onChange={() => handlePermissionToggle(mod, perm)}
                                className={`w-4 h-4 rounded text-brand-orange focus:ring-brand-orange/20 border-slate-300 ${isLocked ? 'cursor-not-allowed text-slate-400' : 'cursor-pointer'}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Matrix Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setEditingRole(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:border-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePermissions}
                disabled={["Founder", "CEO", "Admin"].includes(editingRole)}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Permissions Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
