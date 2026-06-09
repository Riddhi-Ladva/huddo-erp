import React, { useState } from 'react';
import { Map, Plus, RefreshCw, Layers, Award, BarChart2, ShieldAlert } from 'lucide-react';
import { initialTerritoriesList } from '../mockData';
import { DataTable, Modal } from '../components/Common';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Territory({ showToast }) {
  const [territories, setTerritories] = useState(initialTerritoriesList);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Form states
  const [allocateData, setAllocateData] = useState({ name: '', type: 'State', manager: '', retailers: 0 });
  const [transferData, setTransferData] = useState({ territoryId: 'TFY01', fromManager: 'Anil Deshmukh', toManager: 'Preeti Verma' });

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!allocateData.name || !allocateData.manager) {
      showToast("Please enter territory name and assign manager.", "error");
      return;
    }
    const newT = {
      id: `TFY0${territories.length + 1}`,
      name: allocateData.name,
      type: allocateData.type,
      manager: allocateData.manager,
      retailersCount: Number(allocateData.retailers) || 0,
      revenue: 0
    };
    setTerritories([...territories, newT]);
    setIsAllocateOpen(false);
    setAllocateData({ name: '', type: 'State', manager: '', retailers: 0 });
    showToast(`Allocated territory "${newT.name}" to ${newT.manager}`, "success");
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setTerritories(territories.map(t => 
      t.id === transferData.territoryId ? { ...t, manager: transferData.toManager } : t
    ));
    setIsTransferOpen(false);
    showToast(`Transferred territory control to ${transferData.toManager}.`, "success");
  };

  const triggerTransfer = (row) => {
    setTransferData({ territoryId: row.id, fromManager: row.manager, toManager: 'Preeti Verma' });
    setIsTransferOpen(true);
  };

  const columns = [
    { header: "Territory ID", accessor: "id" },
    { header: "Territory / Region Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Level Type", accessor: "type", render: (val) => <span className="text-xs font-bold text-slate-500 uppercase">{val}</span> },
    { header: "Assigned Manager Cover", accessor: "manager" },
    { header: "No. of Retailers", accessor: "retailersCount" },
    { header: "Net Revenue Generated", accessor: "revenue", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button 
          onClick={() => triggerTransfer(row)}
          className="px-2.5 py-1 border border-slate-200 hover:border-slate-300 rounded text-xs font-bold text-slate-700 bg-white flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Transfer Territory</span>
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Visual map-like cards hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-slate-800 rounded-lg text-brand-orange">
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-brand-orange uppercase font-bold tracking-wider">Level 1 Coverage</span>
          <h3 className="text-base font-bold font-display mt-1">Country Zone (India)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manager Cover: Rajesh Sharma</p>
          <div className="border-t border-slate-800/80 pt-3 mt-4 text-[10px] text-slate-400 flex justify-between">
            <span>States Mapped: 5</span>
            <span>Est. Retailers: 48</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-slate-50 rounded-lg text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Level 2 Coverage</span>
          <h3 className="text-base font-bold text-slate-800 font-display mt-1">State Sub-Zones</h3>
          <p className="text-xs text-slate-500 mt-0.5">Managers Assigned: 5 Personnel</p>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 flex justify-between">
            <span>Regions Covered: North, West, South</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="absolute right-4 top-4 p-2 bg-slate-50 rounded-lg text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Level 3 Coverage</span>
          <h3 className="text-base font-bold text-slate-800 font-display mt-1">City Hub Nodes</h3>
          <p className="text-xs text-slate-500 mt-0.5">Managers Assigned: 6 Personnel</p>
          <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-400 flex justify-between">
            <span>Active Retailer Shops: 42</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">Territory Allocation Matrix</h1>
          <p className="text-xs text-slate-500 font-semibold">Allocate and transfer coverage regions to optimize distribution logistics.</p>
        </div>
        
        <button 
          onClick={() => setIsAllocateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate Geographic Cover</span>
        </button>
      </div>

      {/* Database Table */}
      <DataTable 
        columns={columns} 
        data={territories} 
        searchKeys={["name", "manager"]}
        searchPlaceholder="Search territories by region name or manager..."
      />

      {/* Performance reports bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Territory-wise Revenue Chart</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={territories} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display mb-2 flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-brand-orange" /> Performance Metrics</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">Top performing region is Maharashtra (West), leading distribution channel with net sales exceeding ₹45.00 L representing 36.1% overall capacity.</p>
          </div>
          <div className="border-t border-slate-100 pt-3 mt-4 text-xs font-semibold text-slate-700">
            <span>Average regional outlet density:</span>
            <p className="text-lg font-bold text-slate-800 font-display mt-0.5">10 shops / region</p>
          </div>
        </div>
      </div>

      {/* Allocate Territory Modal */}
      <Modal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        title="Allocate Geographic Cover"
        onConfirm={handleAllocateSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Region / Territory Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Rajasthan (North)" 
              value={allocateData.name}
              onChange={(e) => setAllocateData({ ...allocateData, name: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Territory Level</label>
              <select 
                value={allocateData.type}
                onChange={(e) => setAllocateData({ ...allocateData, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="Country">Country</option>
                <option value="State">State</option>
                <option value="City">City</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Active Retailers Count</label>
              <input 
                type="number" 
                placeholder="0" 
                value={allocateData.retailers}
                onChange={(e) => setAllocateData({ ...allocateData, retailers: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign Manager Roster Cover</label>
            <input 
              type="text" 
              placeholder="e.g., Vijay Patel" 
              value={allocateData.manager}
              onChange={(e) => setAllocateData({ ...allocateData, manager: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Transfer Territory Control Modal */}
      <Modal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Transfer Geographic Control"
        onConfirm={handleTransferSubmit}
      >
        <form className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p><strong>Confirm Audit Action:</strong> Transferring region authority overrides dashboard logging accesses for the original manager immediately.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Manager Recipient</label>
            <select 
              value={transferData.toManager}
              onChange={(e) => setTransferData({ ...transferData, toManager: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
            >
              <option value="Preeti Verma">Preeti Verma</option>
              <option value="Vijay Patel">Vijay Patel</option>
              <option value="Amit Bansal">Amit Bansal</option>
              <option value="Anil Deshmukh">Anil Deshmukh</option>
            </select>
          </div>
        </form>
      </Modal>

    </div>
  );
}
