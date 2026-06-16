// src/city-manager/pages/TargetManagement.jsx
import { useState } from 'react';
import { 
  Target, Edit2, Save, X, ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';
import { formatCurrency } from '../cityManagerUtils';

export default function TargetManagement({ 
  cityTargets, 
  onSaveRetailerTargets, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('Monthly');
  const [isEditing, setIsEditing] = useState(false);
  const [editTargets, setEditTargets] = useState({});

  const handleEditClick = () => {
    const initial = {};
    cityTargets.retailerTargets.forEach(t => {
      initial[t.retailerId] = t.target;
    });
    setEditTargets(initial);
    setIsEditing(true);
  };

  const handleTargetChange = (id, val) => {
    setEditTargets(prev => ({
      ...prev,
      [id]: val === '' ? '' : Number(val)
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTargets({});
  };

  const handleSaveSubmit = () => {
    const invalid = Object.values(editTargets).some(v => v === '' || isNaN(v) || Number(v) < 0);
    if (invalid) {
      showToast('Targets must be non-negative numbers.', 'error');
      return;
    }
    onSaveRetailerTargets(editTargets);
    setIsEditing(false);
    showToast('Retailer targets saved successfully!', 'success');
  };

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

  // Radial chart data
  const radialData = [
    { name: 'Target', value: 100, fill: '#f1f5f9' },
    { name: 'Achieved', value: 86.4, fill: '#f97316' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Targets — Ahmedabad</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Configure quotas, adjust retailer milestones, and review sales performance coefficients</p>
        </div>
        
        <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-0.5 self-start sm:self-center select-none">
          {['Monthly', 'Quarterly', 'Yearly'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setIsEditing(false); }}
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

      {activeTab === 'Monthly' ? (
        <div className="space-y-6">
          
          {/* Main Dial Summary block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left dial */}
            <div className="md:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-450 uppercase block">June 2026 Target Goal</span>
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-slate-800 uppercase">Ahmedabad Target quota</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">Goal: {formatCurrency(750000)}</span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs text-slate-500">Achieved: {formatCurrency(648000)}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs font-semibold text-slate-600">
                  <p><span className="text-slate-400">Target Achievement:</span> 86.4%</p>
                  <p className="mt-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded inline-block">In Progress — 17 days in cycle</p>
                  <p className="mt-2 text-slate-400">Remaining needed: <span className="text-slate-800 font-bold">{formatCurrency(102000)}</span></p>
                </div>
              </div>

              {/* Radial Chart */}
              <div className="w-40 h-40 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={70} 
                    barSize={6} 
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar minAngle={15} background dataKey="value" cornerRadius={30}>
                      {radialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-slate-800">86.4%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">of June Target</span>
                </div>
              </div>

            </div>

            {/* Right KPIs details */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Orders Count</span>
                <h4 className="text-base font-black text-slate-800 mt-2">87 of 100</h4>
                <span className="text-[9px] font-bold text-slate-400 mt-1 block">87% Quota Achieved</span>
              </div>
              
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">New Retailers</span>
                <h4 className="text-base font-black text-slate-800 mt-2">1 of 2</h4>
                <span className="text-[9px] font-bold text-slate-400 mt-1 block">50% Quota Achieved</span>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Leads Generated</span>
                <h4 className="text-base font-black text-slate-800 mt-2">5 of 5</h4>
                <span className="text-[9px] font-extrabold text-emerald-600 mt-1 block">100% Target Met ✓</span>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Revenue Growth</span>
                <h4 className="text-base font-black text-slate-800 mt-2">+11.3%</h4>
                <span className="text-[9px] font-extrabold text-emerald-600 mt-1 block flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> Exceeded target</span>
              </div>
            </div>

          </div>

          {/* Retailer Targets Table */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Retailer Outlets Quotas</h3>
              
              {!isEditing ? (
                <button 
                  onClick={handleEditClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Set Retailer Targets
                </button>
              ) : (
                <div className="flex items-center gap-2 animate-fade-in">
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button 
                    onClick={handleSaveSubmit}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shadow-orange-100"
                  >
                    <Save className="w-3.5 h-3.5" /> Save All
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                    <th className="py-2.5 px-3">Retailer Outlet Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Target quota (₹)</th>
                    <th className="py-2.5 px-3 text-right">Achieved (₹)</th>
                    <th className="py-2.5 px-3">Achievement %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cityTargets.retailerTargets.map((row) => {
                    const currentVal = isEditing ? editTargets[row.retailerId] : row.target;
                    const achievedVal = row.achieved;
                    const achPct = row.target > 0 ? Math.round((achievedVal / row.target) * 100) : 0;

                    return (
                      <tr key={row.retailerId} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-805">{row.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 bg-slate-50 border text-[8px] rounded-full uppercase">
                            {row.category || 'Standard'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              value={currentVal}
                              onChange={(e) => handleTargetChange(row.retailerId, e.target.value)}
                              className="w-28 p-1 border border-slate-200 rounded-lg text-xs font-bold text-right text-slate-805 bg-white focus:outline-none"
                              min="0"
                            />
                          ) : (
                            <span className="font-bold text-slate-700">{formatCurrency(row.target)}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-800">{formatCurrency(achievedVal)}</td>
                        <td className="py-3 px-3">
                          {!isEditing ? (
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full ${getProgressColor(achPct)} rounded-full`}
                                  style={{ width: `${Math.min(achPct, 100)}%` }}
                                ></div>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-extrabold ${getProgressTextClass(achPct)}`}>
                                {achPct}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Updating...</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {!isEditing ? (
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                              achievedVal >= row.target 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {achievedVal >= row.target ? 'Achieved' : 'Deficit'}
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

          {/* Historical tab representation */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Historical Quota Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-right">Target</th>
                    <th className="py-2.5 px-3 text-right">Achieved</th>
                    <th className="py-2.5 px-3 text-center">Achievement %</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">May 2026</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(620000)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(627000)}</td>
                    <td className="py-3 px-3 text-center font-bold">101.1%</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold rounded-full border border-emerald-100">
                        Achieved
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Apr 2026</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(600000)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(580000)}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">96.6%</td>
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
          <span>The {activeTab} target configuration is set by State Managers at the regional level.</span>
          <span className="text-[10px] text-slate-400 font-medium mt-1">Please reference the regional workspace or switch roles to view/edit.</span>
        </div>
      )}

    </div>
  );
}
