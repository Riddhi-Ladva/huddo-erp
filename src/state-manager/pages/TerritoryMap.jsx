// src/state-manager/pages/TerritoryMap.jsx
import { Map, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../utils';

export default function TerritoryMap({ 
  cityPerformanceData, 
  cityManagers, 
  onNavigate,
  onNavigateWithFilter 
}) {
  
  const getCMName = (cityName) => {
    const cm = cityManagers.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    return cm ? cm.name : "Not Assigned";
  };

  const getCMStatus = (cityName) => {
    const cm = cityManagers.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    return cm ? cm.status : "Inactive";
  };

  const getStrokeColor = (pct) => {
    if (pct >= 90) return '#10b981'; // emerald-500
    if (pct >= 60) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Territory Map — Gujarat</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Structured state topology dashboard including performance aggregates and city targets</p>
      </div>

      {/* State Overview Card */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        {/* Background decorative logo */}
        <Map className="absolute right-6 bottom-4 w-36 h-36 text-slate-800/40 stroke-1 pointer-events-none" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400">Territory Scope</span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-[10px] font-bold text-slate-300">Gujarat (GJ)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-semibold">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Covered Cities</span>
              <p className="text-lg font-black text-white">6 Cities</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Active Retailers</span>
              <p className="text-lg font-black text-white">159 Shops</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Total Orders (June)</span>
              <p className="text-lg font-black text-white">304 Orders</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 uppercase">Aggregate Revenue</span>
              <p className="text-lg font-black text-orange-400">{formatCurrency(1507000)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Territory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cityPerformanceData.map((cityData) => {
          const cmName = getCMName(cityData.city);
          const cmStatus = getCMStatus(cityData.city);
          const achPct = cityData.target > 0 ? Math.round((cityData.revenue / cityData.target) * 100) : 0;
          
          // SVG circular path calculations
          const radius = 32;
          const strokeWidth = 6;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (Math.min(achPct, 100) / 100) * circumference;

          return (
            <div key={cityData.city} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{cityData.city}</h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">State: Gujarat</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                    cmStatus === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {cmStatus}
                  </span>
                </div>

                {/* Manager Name */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lead: {cmName}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-50 text-[10px] font-bold text-slate-500">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Retailers</span>
                    <span className="text-slate-800 mt-0.5 block">{cityData.retailers}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Orders</span>
                    <span className="text-slate-800 mt-0.5 block">{cityData.orders}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Revenue</span>
                    <span className="text-slate-800 mt-0.5 block truncate">{formatCurrency(cityData.revenue)}</span>
                  </div>
                </div>
              </div>

              {/* Progress representation */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  {/* Circle SVG */}
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Trail circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="stroke-slate-100"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke={getStrokeColor(achPct)}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                      {achPct}%
                    </div>
                  </div>
                  
                  <div className="text-xs font-semibold">
                    <span className="text-[8px] text-slate-400 uppercase block">Target Target</span>
                    <span className="text-slate-700 block">{formatCurrency(cityData.target)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (onNavigateWithFilter) {
                      onNavigateWithFilter("City Managers", cityData.city);
                    } else {
                      onNavigate("City Managers");
                    }
                  }}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-extrabold text-slate-700 transition-all"
                >
                  View Details
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Territory Performance Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Territory Performance comparative matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase bg-slate-50/20">
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-3">City Manager</th>
                <th className="py-2.5 px-3 text-center">Retailers</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Target</th>
                <th className="py-2.5 px-3 text-center">Achievement %</th>
                <th className="py-2.5 px-3 text-right">Trend vs Last Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cityPerformanceData.map((cityData) => {
                const cmName = getCMName(cityData.city);
                const achPct = cityData.target > 0 ? Math.round((cityData.revenue / cityData.target) * 100) : 0;
                
                // Mocks growth trend triggers
                const isPositive = cityData.city !== "Morbi" && cityData.city !== "Bhavnagar";
                const isNeutral = cityData.city === "Bhavnagar";

                return (
                  <tr key={cityData.city} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{cityData.city}</td>
                    <td className="py-3 px-3">{cmName}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{cityData.retailers}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{formatCurrency(cityData.revenue)}</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(cityData.target)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${
                        achPct >= 90 ? 'bg-emerald-50 text-emerald-700' :
                        achPct >= 60 ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {achPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isNeutral ? (
                        <span className="text-[10px] text-slate-400 font-bold">- Neutral</span>
                      ) : isPositive ? (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                          <ArrowUp className="w-3.5 h-3.5" /> Growth
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center justify-end gap-0.5">
                          <ArrowDown className="w-3.5 h-3.5" /> Decline
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
