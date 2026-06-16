import React, { useState } from 'react';
import { 
  Target, TrendingUp, TrendingDown, Users, 
  ShoppingBag, Award, Map, Calendar, SlidersHorizontal
} from 'lucide-react';
import { mockTargets } from '../mockData/mockTargets';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';

export default function Targets() {
  const [filterPeriodType, setFilterPeriodType] = useState("All");

  const filteredHistory = React.useMemo(() => {
    if (filterPeriodType === "All") return mockTargets.history;
    return mockTargets.history.filter(h => h.type === filterPeriodType);
  }, [filterPeriodType]);

  // Target card color mapper
  const getProgressBarColor = (percent) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-rose-500";
  };

  const columns = [
    { header: "Period", accessor: "period", sortable: true },
    { header: "Target Type", accessor: "type" },
    { header: "Target Value", accessor: "targetValue", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Achieved Value", accessor: "achieved", render: (val) => `₹${val.toLocaleString()}` },
    { 
      header: "Achievement %", 
      accessor: "achievementPercent", 
      render: (val, row) => {
        const pct = val || Math.round((row.achieved / row.targetValue) * 100);
        return (
          <div className="flex items-center gap-2">
            <span className="font-bold">{pct}%</span>
            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${getProgressBarColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
            </div>
          </div>
        );
      }
    },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Target cards (Monthly, Quarterly, Yearly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTargets.myTargets.map((t, i) => {
          const achievementPct = Math.round((t.achieved / t.targetValue) * 100);
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-800 font-display">{t.type} Target ({t.period})</span>
                  <StatusBadge status={t.status} />
                </div>
                
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Achieved Value</span>
                    <span className="text-lg font-extrabold text-slate-800 block mt-0.5">₹{t.achieved.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Limit</span>
                    <span className="text-xs font-bold text-slate-500 block mt-0.5">₹{t.targetValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Achievement Progress</span>
                  <span>{achievementPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getProgressBarColor(achievementPct)}`} style={{ width: `${Math.min(achievementPct, 100)}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI breakdown & Market expansion info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI metrics boxes */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400" />
            Key Performance Indicators (KPIs)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Achievement Ring */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 text-center flex flex-col justify-between items-center min-h-[140px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Achievement</span>
              <div className="relative w-16 h-16 flex items-center justify-center mt-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-brand-orange" strokeDasharray={`${mockTargets.kpis.achievementPercent}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-xs font-extrabold text-slate-800">{mockTargets.kpis.achievementPercent}%</span>
              </div>
              <span className="text-[9px] text-slate-400 font-bold block mt-2">Weighted regional avg</span>
            </div>

            {/* Growth delta */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Revenue Growth</span>
              <div className="my-2">
                <span className="text-2xl font-extrabold text-slate-800">+{mockTargets.kpis.revenueGrowth.value}%</span>
                <span className="text-[10px] text-slate-500 font-medium block mt-1">vs previous calendar month</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span>Upward Sales Trend</span>
              </div>
            </div>

            {/* Target counts */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex flex-col justify-between min-h-[140px]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Order Count Target</span>
              <div className="my-2">
                <span className="text-xl font-bold text-slate-800">
                  {mockTargets.kpis.orderCount.achieved} / {mockTargets.kpis.orderCount.target}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Orders logged</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>New Retailers:</span>
                <span className="text-slate-800 font-extrabold">{mockTargets.kpis.retailerAcquisition.achieved} / {mockTargets.kpis.retailerAcquisition.target}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Market expansion */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-400" />
              Territory Expansion Log
            </h3>
            
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[9px] font-bold text-brand-orange uppercase tracking-wider block font-display">Target Markets</span>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-2">
                {mockTargets.kpis.marketExpansion}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-medium mt-3 italic text-center">
            Expansion metrics updated by Sales Manager monthly.
          </div>
        </div>

      </div>

      {/* Historical logs table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" />
              Targets Achievements History
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Roster of previous cycles and compliance logs.</p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterPeriodType}
              onChange={(e) => setFilterPeriodType(e.target.value)}
              className="text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Cycles</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        <CustomDataTable 
          columns={columns}
          data={filteredHistory}
          searchKeys={["period", "type", "status"]}
          searchPlaceholder="Search historical target logs..."
        />
      </div>

    </div>
  );
}
