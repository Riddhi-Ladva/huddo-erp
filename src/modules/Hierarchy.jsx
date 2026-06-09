import React, { useState } from 'react';
import { GitBranch, MapPin, Award, User, Layers, Plus, ExternalLink, ShieldAlert } from 'lucide-react';
import { GEOGRAPHY, STANDARD_ROLES } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function Hierarchy({ showToast }) {
  const [activeTab, setActiveTab] = useState('tree'); // tree | countries | states | cities
  const [countries, setCountries] = useState(GEOGRAPHY.countries);
  const [states, setStates] = useState(GEOGRAPHY.states);
  const [cities, setCities] = useState(GEOGRAPHY.cities);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState(''); // Country | State | City
  const [formData, setFormData] = useState({ name: '', manager: '', parent: '', stateName: '', countryName: '' });

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null); // { type, name, currentManager }
  const [assignedManagerName, setAssignedManagerName] = useState('');

  // Node expand state in the visual tree
  const [expandedNodes, setExpandedNodes] = useState({ founder: true, country: true, state: true });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.manager) {
      showToast("Please complete the form.", "error");
      return;
    }

    if (addType === 'Country') {
      const newCountry = {
        id: `C${countries.length + 1}`,
        name: formData.name,
        manager: formData.manager,
        statesCount: 0,
        retailersCount: 0,
        revenue: 0
      };
      setCountries([...countries, newCountry]);
    } else if (addType === 'State') {
      const newState = {
        id: `S${states.length + 1}`,
        name: formData.name,
        country: formData.countryName || 'India',
        manager: formData.manager,
        citiesCount: 0,
        retailersCount: 0,
        revenue: 0
      };
      setStates([...states, newState]);
      // increment parent country states count
      setCountries(countries.map(c => c.name === (formData.countryName || 'India') ? { ...c, statesCount: c.statesCount + 1 } : c));
    } else if (addType === 'City') {
      const newCity = {
        id: `CT${cities.length + 1}`,
        name: formData.name,
        state: formData.stateName || 'Maharashtra',
        manager: formData.manager,
        retailersCount: 0,
        revenue: 0
      };
      setCities([...cities, newCity]);
      // increment state cities count
      setStates(states.map(s => s.name === (formData.stateName || 'Maharashtra') ? { ...s, citiesCount: s.citiesCount + 1 } : s));
    }

    setIsAddOpen(false);
    setFormData({ name: '', manager: '', parent: '', stateName: '', countryName: '' });
    showToast(`${addType} added to organizational database.`, "success");
  };

  const handleAssignManager = (e) => {
    e.preventDefault();
    if (!assignedManagerName) return;

    if (assignTarget.type === 'Country') {
      setCountries(countries.map(c => c.id === assignTarget.id ? { ...c, manager: assignedManagerName } : c));
    } else if (assignTarget.type === 'State') {
      setStates(states.map(s => s.id === assignTarget.id ? { ...s, manager: assignedManagerName } : s));
    } else if (assignTarget.type === 'City') {
      setCities(cities.map(ct => ct.id === assignTarget.id ? { ...ct, manager: assignedManagerName } : ct));
    }

    setIsAssignOpen(false);
    showToast(`Assigned ${assignedManagerName} as ${assignTarget.type} Manager.`, "success");
  };

  const triggerAssign = (row, type) => {
    setAssignTarget({ id: row.id, type, name: row.name, currentManager: row.manager });
    setAssignedManagerName(row.manager);
    setIsAssignOpen(true);
  };

  // Define Columns
  const countryColumns = [
    { header: "Country", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Country Manager", accessor: "manager", render: (val) => <span className="font-medium text-slate-700 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" />{val}</span> },
    { header: "Total States", accessor: "statesCount" },
    { header: "Mapped Retailers", accessor: "retailersCount" },
    { header: "Annual Revenue", accessor: "revenue", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button onClick={() => triggerAssign(row, 'Country')} className="text-xs font-bold text-brand-orange hover:underline">Assign Manager</button>
        <button onClick={() => showToast(`Editing details for ${row.name}`, "success")} className="text-xs font-bold text-slate-500 hover:underline">Edit</button>
      </div>
    )}
  ];

  const stateColumns = [
    { header: "State / UT", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Country Link", accessor: "country" },
    { header: "State Manager", accessor: "manager", render: (val) => <span className="font-medium text-slate-700 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" />{val}</span> },
    { header: "Total Cities", accessor: "citiesCount" },
    { header: "Retailers", accessor: "retailersCount" },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button onClick={() => triggerAssign(row, 'State')} className="text-xs font-bold text-brand-orange hover:underline">Assign Manager</button>
        <button onClick={() => showToast(`Editing state ${row.name}`, "success")} className="text-xs font-bold text-slate-500 hover:underline">Edit</button>
      </div>
    )}
  ];

  const cityColumns = [
    { header: "City", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "State Region", accessor: "state" },
    { header: "City Manager", accessor: "manager", render: (val) => <span className="font-medium text-slate-700 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" />{val}</span> },
    { header: "Retailers", accessor: "retailersCount" },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button onClick={() => triggerAssign(row, 'City')} className="text-xs font-bold text-brand-orange hover:underline">Assign Manager</button>
        <button onClick={() => showToast(`Editing city ${row.name}`, "success")} className="text-xs font-bold text-slate-500 hover:underline">Edit</button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Organizational Hierarchy</h1>
          <p className="text-sm text-slate-500">Configure distribution tiers, map territorial layers, and delegate managerial coverage controls.</p>
        </div>
        
        {activeTab !== 'tree' && (
          <button 
            onClick={() => {
              setAddType(activeTab === 'countries' ? 'Country' : activeTab === 'states' ? 'State' : 'City');
              setIsAddOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'countries' ? 'Country' : activeTab === 'states' ? 'State' : 'City'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('tree')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'tree' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Visual Hierarchy Tree
        </button>
        <button 
          onClick={() => setActiveTab('countries')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'countries' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Countries List ({countries.length})
        </button>
        <button 
          onClick={() => setActiveTab('states')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'states' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          States / Regions ({states.length})
        </button>
        <button 
          onClick={() => setActiveTab('cities')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'cities' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Cities Database ({cities.length})
        </button>
      </div>

      {/* Contents */}
      {activeTab === 'tree' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 font-display mb-6">Interactive Channel Node Mapping</h2>
          
          <div className="flex flex-col items-center gap-6 w-full max-w-lg">
            {/* FOUNDER */}
            <div className="flex flex-col items-center">
              <div className="bg-brand-dark text-white px-6 py-3 rounded-lg border-2 border-brand-orange shadow-md text-center">
                <span className="text-[10px] uppercase font-bold text-brand-orange">Founder</span>
                <h4 className="font-bold text-sm font-display mt-0.5">Rohan Hudda</h4>
                <p className="text-[10px] text-slate-400">Owner side controls active</p>
              </div>
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* COUNTRY MANAGER */}
            <div className="flex flex-col items-center w-full">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-lg border border-slate-700 shadow-md text-center relative group w-64">
                <span className="text-[9px] uppercase font-bold text-blue-400">Country Manager (India)</span>
                <h4 className="font-bold text-sm font-display mt-0.5">{countries[0]?.manager || "Rajesh Sharma"}</h4>
                <p className="text-[10px] text-slate-400">Coverage: 5 Active States</p>
              </div>
              <div className="w-0.5 h-6 bg-slate-300"></div>
            </div>

            {/* STATE MANAGERS (Multiple Nodes Grid) */}
            <div className="grid grid-cols-2 gap-4 w-full justify-items-center">
              {states.slice(0, 2).map((st, i) => (
                <div key={st.id} className="flex flex-col items-center w-full">
                  <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm w-full text-center relative">
                    <span className="text-[9px] uppercase font-bold text-slate-500">State Manager ({st.name})</span>
                    <h4 className="font-bold text-xs text-slate-800 font-display mt-0.5">{st.manager}</h4>
                    <p className="text-[10px] text-slate-400">{st.citiesCount} Cities Managed</p>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-300"></div>

                  {/* CITY MANAGERS (Level down mapped to state) */}
                  <div className="space-y-3 w-4/5">
                    {cities.filter(ct => ct.state === st.name).slice(0, 1).map(ct => (
                      <div key={ct.id} className="bg-orange-50/50 border border-orange-200 p-3 rounded-lg text-center">
                        <span className="text-[8px] uppercase font-bold text-brand-orange">City Manager ({ct.name})</span>
                        <h5 className="font-bold text-xs text-slate-800 font-display mt-0.5">{ct.manager}</h5>
                        <p className="text-[9px] text-slate-500">8 Retailer Mapped</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      ) : activeTab === 'countries' ? (
        <DataTable 
          columns={countryColumns} 
          data={countries} 
          searchKeys={["name", "manager"]} 
          searchPlaceholder="Search countries..."
        />
      ) : activeTab === 'states' ? (
        <DataTable 
          columns={stateColumns} 
          data={states} 
          searchKeys={["name", "country", "manager"]} 
          searchPlaceholder="Search states..."
        />
      ) : (
        <DataTable 
          columns={cityColumns} 
          data={cities} 
          searchKeys={["name", "state", "manager"]} 
          searchPlaceholder="Search cities..."
        />
      )}

      {/* Add Geo Level Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={`Add New ${addType}`}
        onConfirm={handleAddSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{addType} Name</label>
            <input 
              type="text" 
              placeholder={`e.g., ${addType === 'Country' ? 'Nepal' : addType === 'State' ? 'Rajasthan' : 'Jaipur'}`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
            />
          </div>

          {addType === 'State' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parent Country</label>
              <select 
                value={formData.countryName}
                onChange={(e) => setFormData({...formData, countryName: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="">Select country...</option>
                {countries.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}

          {addType === 'City' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parent State</label>
              <select 
                value={formData.stateName}
                onChange={(e) => setFormData({...formData, stateName: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
              >
                <option value="">Select state...</option>
                {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign {addType} Manager</label>
            <input 
              type="text" 
              placeholder="e.g., Devendra Singh"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
        </form>
      </Modal>

      {/* Assign Manager Modal */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title={`Assign Manager to ${assignTarget?.name}`}
        onConfirm={handleAssignManager}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Updating the assigned manager transfers control privileges for that territory immediately. Please confirm details.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Manager Name</label>
            <input 
              type="text" 
              value={assignedManagerName}
              onChange={(e) => setAssignedManagerName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}
