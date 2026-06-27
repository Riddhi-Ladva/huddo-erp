import React, { useState, useEffect } from 'react';
import { Target as TargetIcon, Plus, Award, AlertTriangle, TrendingUp, ShieldAlert, BarChart2 } from 'lucide-react';
import { DataTable, Modal } from '../components/Common';

export default function Targets({ showToast }) {
  const [timeframeTab, setTimeframeTab] = useState('monthly'); // daily | weekly | monthly | quarterly | yearly | custom
  const [entityTab, setEntityTab] = useState('State'); // Country | State | City | Retailer | Team
  const [targets, setTargets] = useState([]);
  const [users, setUsers] = useState([]);

  // Set Target modal
  const [isSetOpen, setIsSetOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Maharashtra Zone',
    type: 'State',
    target: '5000000',
    orderTarget: '100',
    acquisitionTarget: '10'
  });

  const mapTarget = (t) => ({
    id: t._id,
    name: t.title,
    type: t.scope_level,
    target: t.target_value || 0,
    achieved: t.achieved_value || 0,
    orderTarget: t.kpi_type === 'OrderCount' ? t.target_value : 100,
    orderAchieved: t.kpi_type === 'OrderCount' ? t.achieved_value : 80,
    acquisitionTarget: t.kpi_type === 'RetailerAcquisition' ? t.target_value : 10,
    acquisitionAchieved: t.kpi_type === 'RetailerAcquisition' ? t.achieved_value : 8,
    timeframe: t.period_type?.toLowerCase() || 'monthly'
  });

  const loadTargets = () => {
    fetch('/api/targets')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setTargets(resData.data.map(mapTarget));
        } else if (Array.isArray(resData)) {
          setTargets(resData.map(mapTarget));
        }
      })
      .catch(err => console.error("Error loading targets:", err));

    fetch('/api/users')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setUsers(resData.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const handleSetTargetSubmit = (e) => {
    e.preventDefault();
    if (!formData.target || !formData.name) {
      showToast("Please enter target title and monetary value.", "error");
      return;
    }

    const cachedUser = localStorage.getItem('huddo_user');
    const currentUser = cachedUser ? JSON.parse(cachedUser) : null;
    const userId = currentUser?._id || (users[0]?._id || '');

    const payload = {
      title: formData.name,
      assigned_to: userId,
      period_type: timeframeTab.charAt(0).toUpperCase() + timeframeTab.slice(1), // e.g. Monthly
      period_start: new Date(),
      period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      scope_level: formData.type,
      target_value: Number(formData.target),
      kpi_type: 'Revenue',
      status: 'Active'
    };

    fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          showToast(`Target configured for ${formData.name}.`, "success");
          setIsSetOpen(false);
          loadTargets();
        } else {
          showToast(resData.message || "Failed to configure target.", "error");
        }
      })
      .catch(err => {
        console.error(err);
        showToast("Error connecting to server.", "error");
      });
  };

  const filteredTargets = targets.filter(t => t.type === entityTab && t.timeframe === timeframeTab);

  // Compute stats dynamically
  const totalTarget = targets.reduce((sum, t) => sum + (t.target || 0), 0);
  const totalAchieved = targets.reduce((sum, t) => sum + (t.achieved || 0), 0);
  const overallAchievement = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
  
  const totalAcquired = targets.reduce((sum, t) => sum + (t.acquisitionAchieved || 0), 0);
  const marketExpansion = totalTarget > 0 ? (totalAchieved / (totalTarget * 1.2) * 10).toFixed(1) : '0.0';

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
            <TargetIcon className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Achievement</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">{overallAchievement}%</h3>
            <span className="text-[9px] text-emerald-600 font-bold">On track for active targets</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">MoM Growth Rate</span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">+14.2%</h3>
            <span className="text-[9px] text-brand-orange font-bold">Regional expansion metrics</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Award className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">New Retailers Mapped</span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalAcquired} Accounts</h3>
            <span className="text-[9px] text-blue-600 font-bold">Direct store acquisitions</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            <BarChart2 className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Market Expansion Score</span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{marketExpansion} / 10</h3>
            <span className="text-[9px] text-indigo-600 font-bold">Distribution coverage efficiency</span>
          </div>
        </div>
      </div>

      {/* Main Filter Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 font-display">Target List Ledger Registry</h3>
            <p className="text-xs text-slate-400 font-semibold font-sans">View, track, and configure sales performance indicators and coverage target structures.</p>
          </div>
          <button 
            onClick={() => setIsSetOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Configure Mapped Target</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col gap-4">
          {/* Timeframe Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Timeframe</span>
            <div className="flex flex-wrap gap-2">
              {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframeTab(tf)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border uppercase transition-all ${
                    timeframeTab === tf 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Entity Filter */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Territory / Entity Level Scope</span>
            <div className="flex flex-wrap gap-2">
              {['Country', 'State', 'City', 'Retailer', 'Team'].map(ent => (
                <button
                  key={ent}
                  onClick={() => setEntityTab(ent)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    entityTab === ent 
                      ? 'bg-brand-orange border-brand-orange text-white' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {ent} Level Target
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable 
          columns={columns} 
          data={filteredTargets} 
          searchKeys={["name"]}
          searchPlaceholder={`Search ${entityTab} targets...`}
        />
      </div>

      {/* Set Target Modal */}
      <Modal
        isOpen={isSetOpen}
        onClose={() => setIsSetOpen(false)}
        title="Configure Mapped Target"
        onConfirm={handleSetTargetSubmit}
      >
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Entity Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Entity Scope</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="Country">Country</option>
                <option value="State">State</option>
                <option value="City">City</option>
                <option value="Retailer">Retailer Account</option>
                <option value="Team">Operations Team</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sales Volume Target (₹)</label>
              <input 
                type="number" 
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Order Volume Target (Units)</label>
              <input 
                type="number" 
                value={formData.orderTarget}
                onChange={(e) => setFormData({ ...formData, orderTarget: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Retailer Acquisition Target</label>
              <input 
                type="number" 
                value={formData.acquisitionTarget}
                onChange={(e) => setFormData({ ...formData, acquisitionTarget: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
