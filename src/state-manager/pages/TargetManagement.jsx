// src/state-manager/pages/TargetManagement.jsx
import { useState } from 'react';
import { 
  Target, Edit2, Save, X, ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../utils';

export default function TargetManagement({ 
  cityManagers, 
  onSaveTargets, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('Monthly'); // Monthly | Quarterly | Yearly
  const [isEditing, setIsEditing] = useState(false);
  const [editTargets, setEditTargets] = useState({}); // CM.id -> target value

  // State aggregates for June 2026
  const stateTarget = 1300000;
  const stateAchieved = 1507000;
  const statePct = Math.round((stateAchieved / stateTarget) * 1000) / 10;

  const handleEditClick = () => {
    // Populate editing state
    const initialEdits = {};
    cityManagers.forEach(cm => {
      initialEdits[cm.id] = cm.monthlyTarget;
    });
    setEditTargets(initialEdits);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditTargets({});
  };

  const handleSaveClick = () => {
    // Basic verification
    const invalid = Object.values(editTargets).some(val => val === '' || isNaN(val) || Number(val) < 0);
    if (invalid) {
      showToast("Targets must be non-negative numbers.", "error");
      return;
    }

    onSaveTargets(editTargets);
    setIsEditing(false);
    showToast("City targets updated successfully!", "success");
  };

  const handleTargetChange = (cmId, value) => {
    setEditTargets({
      ...editTargets,
      [cmId]: value === '' ? '' : Number(value)
    });
  };

  // Progress bar helpers
  const getProgressColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getProgressTextClass = (pct) => {
    if (pct >= 90) return 'text-emerald-700 bg-emerald-50';
    if (pct >= 60) return 'text-amber-700 bg-amber-50';
    return 'text-rose-700 bg-rose-50';
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Target Administration</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Configure quotas, adjust monthly milestones, and evaluate sales performance coefficients</p>
        </div>
        <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-0.5 self-start sm:self-center">
          {['Monthly', 'Quarterly', 'Yearly'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsEditing(false);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Tab Content */}
      {activeTab === 'Monthly' ? (
        <div className="space-y-6">
          
          {/* Top Panel: June 2026 Aggregates */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Period</span>
              <h2 className="text-sm font-black text-slate-800 uppercase">June 2026 Quota Ledger</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-semibold">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase">State target</span>
                <p className="font-bold text-slate-800 text-sm">{formatCurrency(stateTarget)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase">State achieved</span>
                <p className="font-black text-slate-800 text-sm">{formatCurrency(stateAchieved)}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase">Quota Achieved</span>
                <p className="font-black text-slate-800 text-sm">{statePct}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 uppercase block">Status</span>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full">
                  Exceeded
                </span>
              </div>
            </div>

          </div>

          {/* City Targets Table with Inline Edits */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">City Manager Target Quotas</h3>
              
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Set / Edit Targets
                </button>
              ) : (
                <div className="flex items-center gap-2 animate-fade-in">
                  <button
                    onClick={handleCancelClick}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-all"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Save All Targets
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                    <th className="py-2.5 px-3">City</th>
                    <th className="py-2.5 px-3">City Manager</th>
                    <th className="py-2.5 px-3 text-right">Target (₹)</th>
                    <th className="py-2.5 px-3 text-right">Achieved (₹)</th>
                    <th className="py-2.5 px-3">Achievement %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cityManagers.map((cm) => {
                    const currentVal = isEditing ? editTargets[cm.id] : cm.monthlyTarget;
                    const achievedVal = cm.achieved;
                    const achPct = cm.monthlyTarget > 0 ? Math.round((achievedVal / cm.monthlyTarget) * 10) / 10 : 0;
                    const displayPct = isEditing ? '-' : `${Math.round(achPct * 10)}%`;

                    return (
                      <tr key={cm.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-800">{cm.city}</td>
                        <td className="py-3 px-3">{cm.name}</td>
                        <td className="py-3 px-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              value={currentVal}
                              onChange={(e) => handleTargetChange(cm.id, e.target.value)}
                              className="w-32 p-1.5 border border-slate-200 rounded-lg text-xs font-bold text-right text-slate-800 focus:outline-none focus:border-slate-300"
                              min="0"
                            />
                          ) : (
                            <span className="font-bold text-slate-700">{formatCurrency(cm.monthlyTarget)}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(achievedVal)}</td>
                        <td className="py-3 px-3">
                          {!isEditing ? (
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(Math.round(achPct * 10))} rounded-full`}
                                  style={{ width: `${Math.min(Math.round(achPct * 10), 100)}%` }}
                                ></div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-extrabold ${getProgressTextClass(Math.round(achPct * 10))}`}>
                                {displayPct}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Recalculating...</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {!isEditing ? (
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                              achievedVal >= cm.monthlyTarget 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {achievedVal >= cm.monthlyTarget ? 'Achieved' : 'Deficit'}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Editing</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* KPI Dashboard section (4 cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* KPI 1 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Aggregate Achieved</span>
              <h4 className="text-lg font-black text-slate-800 mt-2">115.9%</h4>
              <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-extrabold rounded-full mt-2">
                Quota Achieved
              </span>
            </div>

            {/* KPI 2 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Revenue Growth</span>
              <h4 className="text-lg font-black text-slate-800 mt-2">+21.5%</h4>
              <span className="text-[8px] font-bold text-emerald-600 mt-2 block flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Exceeded Prior Month
              </span>
            </div>

            {/* KPI 3 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">New Retailers</span>
              <h4 className="text-lg font-black text-slate-800 mt-2">3 Shops</h4>
              <span className="text-[8px] text-slate-400 font-bold mt-2 block">
                Acquired in Gujarat
              </span>
            </div>

            {/* KPI 4 */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Expansion Coefficient</span>
              <h4 className="text-lg font-black text-slate-800 mt-2">+2 Cities</h4>
              <span className="text-[8px] text-slate-400 font-bold mt-2 block">
                Capacity strengthened
              </span>
            </div>

          </div>

          {/* Target History Section */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Historical Quota Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-right">State Target</th>
                    <th className="py-2.5 px-3 text-right">State Achieved</th>
                    <th className="py-2.5 px-3 text-center">Achievement %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">May 2026</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(1200000)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(1240000)}</td>
                    <td className="py-3 px-3 text-center font-bold">103.3%</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full border border-emerald-100">
                        Achieved
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Apr 2026</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(1200000)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(1180000)}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">98.3%</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-extrabold rounded-full border border-rose-100">
                        Deficit
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Mar 2026</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(1100000)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(1010000)}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">91.8%</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-extrabold rounded-full border border-rose-100">
                        Deficit
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-sm text-center text-slate-400 font-semibold flex flex-col items-center justify-center">
          <Target className="w-12 h-12 text-slate-300 stroke-1 mb-2 animate-pulse" />
          <span>The {activeTab} target configuration is set by Country Managers at the national level.</span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Please reference the country manager workspace or switch roles to view/edit.</span>
        </div>
      )}

    </div>
  );
}
