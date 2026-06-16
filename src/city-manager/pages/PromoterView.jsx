// src/city-manager/pages/PromoterView.jsx
import { useState } from 'react';
import { 
  Award, Mail, Phone, Store, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../cityManagerUtils';

export default function PromoterView({ promoters, retailers }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getMappedRetailersDetails = (retailerIds) => {
    return retailers.filter(r => retailerIds.includes(r.id));
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Promoters — Ahmedabad</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Monitor promoter footprints, mapping distributions, and monthly royalty distributions</p>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3 text-xs font-bold text-orange-850">
        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          You can view promoter activity and mappings scoped to Ahmedabad. Promoter creation, royalty commission rates, and incentive config alterations are restricted to Admin/Founder levels.
        </p>
      </div>

      {/* Promoters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        {promoters.map((p) => {
          const mappedDetails = getMappedRetailersDetails(p.retailersMapped);
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4.5 h-4.5 text-orange-500" />
                      {p.name}
                    </h3>
                    <span className="inline-block px-1.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 text-[8px] font-extrabold rounded-lg mt-1 font-mono">
                      {p.code}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                    {p.status}
                  </span>
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5 truncate"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {p.mobile}</span>
                  <span className="flex items-center gap-1.5 truncate" title={p.email}><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {p.email}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-50 py-3 text-center">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Shops Mapped</span>
                    <span className="text-sm font-black text-slate-800 mt-1 block">{p.retailersMapped.length} Shops</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Mapped Sales</span>
                    <span className="text-sm font-black text-slate-800 mt-1 block truncate">{formatCurrency(p.revenueThisMonth)}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase block">Royalty Earned</span>
                    <span className="text-sm font-black text-orange-600 mt-1 block truncate">{formatCurrency(p.royaltyEarned)}</span>
                  </div>
                </div>
              </div>

              {/* Mapped list toggler */}
              <div className="pt-2">
                <button 
                  onClick={() => toggleExpand(p.id)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Store className="w-4 h-4 text-slate-450" /> Mapped Retailer Outlets</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-450" /> : <ChevronDown className="w-4 h-4 text-slate-450" />}
                </button>

                {/* Expandable Outlets List */}
                {isExpanded && (
                  <div className="mt-2 border border-slate-150 rounded-xl overflow-hidden text-[11px] font-semibold bg-white animate-fade-in">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[9px] text-slate-400 font-bold uppercase">
                          <th className="py-2 px-3">Business Name</th>
                          <th className="py-2 px-3 text-center">Category</th>
                          <th className="py-2 px-3 text-right">June Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-650">
                        {mappedDetails.map(r => (
                          <tr key={r.id}>
                            <td className="py-2 px-3 font-bold text-slate-800 truncate max-w-[120px]" title={r.businessName}>{r.businessName}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-1.5 py-0.5 bg-slate-50 border text-[8px] rounded-full uppercase">
                                {r.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-black text-slate-700">{formatCurrency(r.totalRevenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
