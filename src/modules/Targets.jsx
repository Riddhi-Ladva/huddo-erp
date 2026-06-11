import React, { useState } from 'react';
import { Target, Plus, Award, AlertTriangle, TrendingUp, ShieldAlert, BarChart2 } from 'lucide-react';
import { initialTargets } from '../mockData';
import { DataTable, Modal } from '../components/Common';

// HUDDO-UPDATE: Targets — Added Daily/Weekly timeframe tabs and filter logic with custom empty placeholder states
export default function Targets({ showToast }) {
  const [timeframeTab, setTimeframeTab] = useState('monthly'); // daily | weekly | monthly | quarterly | yearly | custom
  const [entityTab, setEntityTab] = useState('State'); // Country | State | City | Retailer | Team
  const [targets, setTargets] = useState(() => [
    ...initialTargets.map(t => ({ ...t, timeframe: 'monthly' })),
    { id: "TGT05", name: "Mumbai Retailer Daily Collection", type: "Retailer", target: 15000, achieved: 12000, orderTarget: 5, orderAchieved: 4, acquisitionTarget: 0, acquisitionAchieved: 0, timeframe: 'daily' },
    { id: "TGT06", name: "Delhi NCR Weekly Sales Focus", type: "State", target: 800000, achieved: 750000, orderTarget: 25, orderAchieved: 22, acquisitionTarget: 2, acquisitionAchieved: 1, timeframe: 'weekly' }
  ]);

  // Set Target modal
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Maharashtra Zone',
    type: 'State',
    target: '5000000',
    orderTarget: '100',
    acquisitionTarget: '10'
  });

  const handleSetTargetSubmit = (e) => {
    e.preventDefault();
    if (!formData.target) {
      showToast("Please enter target monetary value.", "error");
      return;
    }

    const newTarget = {
      id: `TGT0${targets.length + 1}`,
      name: formData.name,
      type: formData.type,
      target: Number(formData.target),
      achieved: 0,
      orderTarget: Number(formData.orderTarget) || 0,
      orderAchieved: 0,
      acquisitionTarget: Number(formData.acquisitionTarget) || 0,
      acquisitionAchieved: 0,
      timeframe: timeframeTab
    };

    setTargets([newTarget, ...targets]);
    setIsSetOpen(false);
    showToast(`Target configured for ${newTarget.name}.`, "success");
  };

  const filteredTargets = targets.filter(t => t.type === entityTab && t.timeframe === timeframeTab);

  const columns = [
    { header: "Entity Target Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Target Amount (₹)", accessor: "target", render: (val) => <span className="font-semibold text-slate-700">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Achieved Sales (₹)", accessor: "achieved", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Achievement Ratio", accessor: "id", sortable: false, render: (val, row) => {
      const ratio = Math.round((row.achieved / row.target) * 100) || 0;
      let colorClass = 'bg-rose-500';
      let textClass = 'text-rose-700 bg-rose-50 border-rose-200';
      if (ratio >= 80) {
        colorClass = 'bg-emerald-500';
        textClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (ratio >= 50) {
        colorClass = 'bg-amber-500';
        textClass = 'text-amber-700 bg-amber-50 border-amber-200';
      }
      return (
        <div className="flex items-center gap-3 w-48">
          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
            <div className={`h-full ${colorClass}`} style={{ width: `${Math.min(ratio, 100)}%` }}></div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${textClass}`}>{ratio}%</span>
        </div>
      );
    }},
    { header: "Orders Target", accessor: "orderTarget", render: (val, row) => <span className="text-xs font-semibold text-slate-600">{row.orderAchieved} / {val} units</span> },
    { header: "Retailers Acquisition", accessor: "acquisitionTarget", render: (val, row) => <span className="text-xs font-semibold text-slate-600">{row.acquisitionAchieved} / {val} new</span> }
  ];

  return (
    <div className="space-y-6">
      {/* KPI dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Target className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Achievement</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">82.5%</h3>
            <span className="text-[9px] text-emerald-600 font-bold">On track for Q2 targets</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">MoM Growth Rate</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">+14.2%</h3>
            <span className="text-[9px] text-slate-500 font-medium">Consistent volume expansion</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Award className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">New Retailers Mapped</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">8 Accounts</h3>
            <span className="text-[9px] text-slate-500 font-medium">Active verification pending</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <BarChart2 className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Market Expansion Score</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">7.8 / 10</h3>
            <span className="text-[9px] text-emerald-600 font-bold">High performance index</span>
          </div>
        </div>
      </div>

      {/* Timeframe selector tabs */}
      <div className="flex justify-between items-center border-t border-slate-200 pt-6">
        <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50">
          {['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'].map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframeTab(tf)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${timeframeTab === tf ? 'bg-white text-brand-orange shadow-xs' : 'text-slate-500'}`}
            >
              {tf}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsSetOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Configure Target</span>
        </button>
      </div>

      {/* Sub-tabs by entity */}
      <div className="flex border-b border-slate-200 gap-2">
        {['Country', 'State', 'City', 'Retailer', 'Team'].map(ent => (
          <button 
            key={ent}
            onClick={() => setEntityTab(ent)}
            className={`px-4 py-2.5 text-xs font-bold uppercase border-b-2 transition-colors ${entityTab === ent ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
          >
            {ent} Targets
          </button>
        ))}
      </div>

      {/* Targets Table Roster */}
      <DataTable 
        columns={columns} 
        data={filteredTargets}
        searchKeys={["name"]}
        searchPlaceholder="Search target sheets..."
        emptyStateText={timeframeTab === 'daily' ? "No active daily targets configured for this selection." : timeframeTab === 'weekly' ? "No weekly targets scheduled for the current week range." : "No targets found matching selection."}
      />

      {/* Set Target Modal */}
      <Modal
        isOpen={isSetOpen}
        onClose={() => setIsSetOpen(false)}
        title="Configure Operational Target"
        onConfirm={handleSetTargetSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Entity Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white"
            >
              <option value="Country">Country</option>
              <option value="State">State</option>
              <option value="City">City</option>
              <option value="Retailer">Retailer Account</option>
              <option value="Team">Operations Team</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Entity / Area Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Delhi NCR Hub"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Sales Target (₹)</label>
              <input type="number" placeholder="2500000" value={formData.target} onChange={(e) => setFormData({...formData, target: e.target.value})} className="w-full text-[11px] border border-slate-200 rounded p-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Order Target</label>
              <input type="number" placeholder="50" value={formData.orderTarget} onChange={(e) => setFormData({...formData, orderTarget: e.target.value})} className="w-full text-[11px] border border-slate-200 rounded p-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Acquisition Target</label>
              <input type="number" placeholder="5" value={formData.acquisitionTarget} onChange={(e) => setFormData({...formData, acquisitionTarget: e.target.value})} className="w-full text-[11px] border border-slate-200 rounded p-1.5 focus:outline-none" />
            </div>
          </div>
        </form>
      </Modal>

    </div>
  );
}
