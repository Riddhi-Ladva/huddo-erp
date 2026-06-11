import React, { useState } from 'react';
import { Percent, Save, Plus, Trash2, CheckCircle, Calculator, Info } from 'lucide-react';
import { initialProducts, initialPromoters, initialEmployees, GEOGRAPHY } from '../mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

// HUDDO-UPDATE: Commissions — Added City, State, Country columns to employee commission ledger and renamed manager terms to employee
export default function Commissions({ showToast }) {
  const [products, setProducts] = useState(initialProducts);
  const [promoters, setPromoters] = useState(initialPromoters);
  const [activeSubTab, setActiveSubTab] = useState('retailer'); // retailer | employee | promoter
  const [employeeRoleTab, setEmployeeRoleTab] = useState('city'); // city | state | country

  // Helper to resolve employee distribution details from Geography
  const getEmployeeGeography = (employeeName) => {
    const cityMatch = GEOGRAPHY.cities.find(c => c.manager && c.manager.toLowerCase() === employeeName.toLowerCase());
    if (cityMatch) {
      const stateMatch = GEOGRAPHY.states.find(s => s.name === cityMatch.state);
      return { city: cityMatch.name, state: cityMatch.state, country: stateMatch ? stateMatch.country : 'India' };
    }
    const stateMatch = GEOGRAPHY.states.find(s => s.manager && s.manager.toLowerCase() === employeeName.toLowerCase());
    if (stateMatch) {
      return { city: 'N/A', state: stateMatch.name, country: stateMatch.country };
    }
    const countryMatch = GEOGRAPHY.countries.find(c => c.manager && c.manager.toLowerCase() === employeeName.toLowerCase());
    if (countryMatch) {
      return { city: 'N/A', state: 'N/A', country: countryMatch.name };
    }
    const emp = initialEmployees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
    if (emp && emp.manager) {
      return getEmployeeGeography(emp.manager);
    }
    return { city: 'N/A', state: 'N/A', country: 'India' };
  };

  const commissionEmployees = [
    { name: "Rajesh Sharma", role: "Country Manager", revenue: 12450000, level: 'country' },
    { name: "Preeti Verma", role: "State Manager", revenue: 3200000, level: 'state' },
    { name: "Anil Deshmukh", role: "State Manager", revenue: 4500000, level: 'state' },
    { name: "Sanjay Joshi", role: "City Manager", revenue: 2800000, level: 'city' },
    { name: "Rahul Shinde", role: "City Manager", revenue: 1700000, level: 'city' },
    { name: "Amit Kumar", role: "Sales Executive", revenue: 950000, level: 'city' }
  ];

  const calculateEmployeeIncentive = (level, revenue) => {
    const roleSlabs = slabs[level] || [];
    let earnedPct = 0;
    for (let slab of roleSlabs) {
      if (revenue >= slab.from && revenue <= (slab.to || Infinity)) {
        earnedPct = slab.pct;
        break;
      }
    }
    return Math.round(revenue * (earnedPct / 100));
  };

  // Slabs state for Manager Incentives
  const [slabs, setSlabs] = useState({
    city: [{ from: 0, to: 500000, pct: 1 }, { from: 500001, to: 1500000, pct: 2 }],
    state: [{ from: 0, to: 1500000, pct: 0.5 }, { from: 1500001, to: 4000000, pct: 1 }],
    country: [{ from: 0, to: 5000000, pct: 0.25 }, { from: 5000001, to: 15000000, pct: 0.5 }]
  });

  const [incentiveType, setIncentiveType] = useState({
    city: 'Sales Volume',
    state: 'Sales Volume',
    country: 'Sales Volume'
  });

  // Preview calculator inputs
  const [previewVal, setPreviewVal] = useState('800000');
  const [calculatedReward, setCalculatedReward] = useState(null);

  const handleUpdateMargin = (id, newPct) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, retailerMargin: Number(newPct) } : p
    ));
  };

  const handleSaveMargins = () => {
    showToast("Wholesale retailer margin structure updated.", "success");
  };

  const handleAddSlab = (role) => {
    const updatedSlabs = [...slabs[role], { from: '', to: '', pct: '' }];
    setSlabs({ ...slabs, [role]: updatedSlabs });
  };

  const handleRemoveSlab = (role, idx) => {
    const updatedSlabs = slabs[role].filter((_, i) => i !== idx);
    setSlabs({ ...slabs, [role]: updatedSlabs });
  };

  const handleSlabChange = (role, idx, key, val) => {
    const updatedSlabs = slabs[role].map((s, i) => 
      i === idx ? { ...s, [key]: Number(val) } : s
    );
    setSlabs({ ...slabs, [role]: updatedSlabs });
  };

  const handleSaveSlabs = () => {
    showToast("Employee incentive slab structures updated.", "success");
  };

  const handleCalculatePreview = () => {
    const inputAmount = Number(previewVal);
    const roleSlabs = slabs[employeeRoleTab];
    let earnedPct = 0;
    
    // Find matching slab
    for (let slab of roleSlabs) {
      if (inputAmount >= slab.from && inputAmount <= (slab.to || Infinity)) {
        earnedPct = slab.pct;
        break;
      }
    }
    
    const reward = Math.round(inputAmount * (earnedPct / 100));
    setCalculatedReward({ amount: inputAmount, reward, percent: earnedPct });
  };

  const handleSettleRoyalty = (id) => {
    setPromoters(promoters.map(p => {
      if (p.id === id) {
        showToast(`Settled pending royalty ₹${p.royaltyPending} for ${p.name}.`, "success");
        return {
          ...p,
          royaltySettled: p.royaltySettled + p.royaltyPending,
          royaltyPending: 0
        };
      }
      return p;
    }));
  };

  // Commission bar chart data
  const commissionPaidData = [
    { role: 'Retailers', amount: 485000, fill: '#f97316' },
    { role: 'City Mgrs', amount: 78000, fill: '#3b82f6' },
    { role: 'State Mgrs', amount: 56000, fill: '#10b981' },
    { role: 'Country Mgrs', amount: 35000, fill: '#f59e0b' },
    { role: 'Promoters', amount: 101600, fill: '#8b5cf6' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Commission & Incentives</h1>
          <p className="text-sm text-slate-500">Configure retail trade margins, setup regional employee slab systems, and settle promoter royalties.</p>
        </div>
      </div>

      {/* Main Sections Navigation */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveSubTab('retailer')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'retailer' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          1. Retailer Trade Margins
        </button>
        <button 
          onClick={() => setActiveSubTab('employee')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'employee' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          2. Employee Incentive Slabs
        </button>
        <button 
          onClick={() => setActiveSubTab('promoter')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeSubTab === 'promoter' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          3. Promoter Royalty Settlements
        </button>
      </div>

      {/* Section 1: Retailer Margins */}
      {activeSubTab === 'retailer' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Category Trade Margins (%)</h3>
              <p className="text-xs text-slate-400 font-semibold">Modify base margins for retailers per model. Margins directly impact final wholesale payouts.</p>
            </div>
            <button 
              onClick={handleSaveMargins}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save All Margins</span>
            </button>
          </div>

          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                  <th className="px-4 py-3">Footwear Model</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Retailer Base Margin (Editable)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td className="px-4 py-3 text-slate-900">{prod.name}</td>
                    <td className="px-4 py-3 text-slate-500">{prod.category}</td>
                    <td className="px-4 py-3 text-right">
                      <input 
                        type="number"
                        value={prod.retailerMargin}
                        onChange={(e) => handleUpdateMargin(prod.id, e.target.value)}
                        className="border border-slate-200 text-slate-800 rounded p-1 w-20 text-right font-bold focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white"
                      />
                      <span className="ml-1 text-slate-400">%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Employee Incentives */}
      {activeSubTab === 'employee' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slabs configure panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Incentive Commission Slabs Configuration</h3>
                <p className="text-xs text-slate-400 font-semibold">Map payout ratios to sales volumes brackets reached by regional employees.</p>
              </div>
              <button 
                onClick={handleSaveSlabs}
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-dark text-white rounded text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Slabs</span>
              </button>
            </div>

            {/* Employee sub-tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              {['city', 'state', 'country'].map(role => (
                <button
                  key={role}
                  onClick={() => { setEmployeeRoleTab(role); setCalculatedReward(null); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border uppercase transition-all ${
                    employeeRoleTab === role 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} Employee
                </button>
              ))}
            </div>

            {/* Calculation base selector */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span>Performance Calculation Based On:</span>
              <select 
                value={incentiveType[employeeRoleTab]}
                onChange={(e) => setIncentiveType({ ...incentiveType, [employeeRoleTab]: e.target.value })}
                className="border border-slate-200 rounded p-1 bg-white focus:outline-none"
              >
                <option value="Sales Volume">Sales Volume (₹ Amount)</option>
                <option value="Order Count">Order Count (Total Units)</option>
                <option value="Retailer Acquisition">Retailer Acquisition (New Registered Shops)</option>
              </select>
            </div>

            {/* Slabs Editor table */}
            <div className="space-y-3">
              {slabs[employeeRoleTab].map((slab, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">From</label>
                    <input 
                      type="number"
                      placeholder="0"
                      value={slab.from}
                      onChange={(e) => handleSlabChange(employeeRoleTab, index, 'from', e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg w-full text-xs font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">To</label>
                    <input 
                      type="number"
                      placeholder="100000"
                      value={slab.to}
                      onChange={(e) => handleSlabChange(employeeRoleTab, index, 'to', e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg w-full text-xs font-bold focus:outline-none" 
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Payout %</label>
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="1.0"
                      value={slab.pct}
                      onChange={(e) => handleSlabChange(employeeRoleTab, index, 'pct', e.target.value)}
                      className="border border-slate-200 p-2 rounded-lg w-full text-xs font-bold text-right focus:outline-none" 
                    />
                  </div>
                  <button 
                    onClick={() => handleRemoveSlab(employeeRoleTab, index)}
                    className="p-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-lg mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => handleAddSlab(employeeRoleTab)}
                className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-hover mt-3"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Slab Tier</span>
              </button>
            </div>
          </div>

          {/* Calculator Preview Widget */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5"><Calculator className="w-4 h-4 text-brand-orange" /> Incentive Preview Tool</h3>
              <p className="text-xs text-slate-400 font-semibold">Test your config. Input a simulated sales volume value to preview commission outputs calculated on active slabs.</p>
              
              <div className="space-y-2 pt-2">
                <label className="block text-[9px] uppercase font-bold text-slate-400">Simulated Target Achieved (₹)</label>
                <input 
                  type="number" 
                  value={previewVal}
                  onChange={(e) => setPreviewVal(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-bold focus:outline-none"
                />
              </div>

              <button 
                onClick={handleCalculatePreview}
                className="w-full py-2 bg-slate-950 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors shadow-xs"
              >
                Calculate Incentive
              </button>

              {calculatedReward && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>Applicable Slab Margin:</span>
                    <span>{calculatedReward.percent}%</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-900 text-sm border-t border-emerald-100 pt-2">
                    <span>Earned Commission:</span>
                    <span>₹{calculatedReward.reward.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex gap-2 text-[10px] text-slate-500 font-semibold mt-4">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>Preview tools are simulated and do not persist transaction payouts inside general accounting database ledgers.</p>
            </div>
          </div>

          {/* Employee Commissions Ledger Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">Employee Commissions Ledger</h3>
            <p className="text-xs text-slate-400 font-semibold font-sans">Ledger showing regional employee distribution mappings from active geography node parameters.</p>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Designation / Role</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Country</th>
                    <th className="px-4 py-3 text-right">Simulated Revenue</th>
                    <th className="px-4 py-3 text-right">Calculated Incentive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {commissionEmployees.map((emp, idx) => {
                    const geo = getEmployeeGeography(emp.name);
                    const incentive = calculateEmployeeIncentive(emp.level, emp.revenue);
                    return (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-slate-900 font-bold">{emp.name}</td>
                        <td className="px-4 py-3 text-slate-500">{emp.role}</td>
                        <td className="px-4 py-3 text-slate-600">{geo.city}</td>
                        <td className="px-4 py-3 text-slate-600">{geo.state}</td>
                        <td className="px-4 py-3 text-slate-600">{geo.country}</td>
                        <td className="px-4 py-3 text-right text-slate-800">₹{emp.revenue.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-bold">₹{incentive.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Promoter Royalty */}
      {activeSubTab === 'promoter' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Promoter Royalty Settlement Queue</h3>
            <p className="text-xs text-slate-400 font-semibold">Audit accrued royalty records and flag balances as settled when payments are dispatched via bank ledger.</p>
          </div>

          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                  <th className="px-4 py-3">Promoter Name</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3 text-right">Royalty Earned</th>
                  <th className="px-4 py-3 text-right">Royalty Settled</th>
                  <th className="px-4 py-3 text-right">Royalty Pending</th>
                  <th className="px-4 py-3 text-right">Ledger Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {promoters.map(pr => (
                  <tr key={pr.id}>
                    <td className="px-4 py-3 text-slate-950 font-bold">{pr.name}</td>
                    <td className="px-4 py-3"><code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-slate-600 font-bold">{pr.code}</code></td>
                    <td className="px-4 py-3 text-right text-slate-800">₹{pr.royaltyEarned.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-slate-500">₹{pr.royaltySettled.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-rose-600 font-bold">₹{pr.royaltyPending.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      {pr.royaltyPending > 0 ? (
                        <button 
                          onClick={() => handleSettleRoyalty(pr.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px]"
                        >
                          Mark as Settled
                        </button>
                      ) : <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1"><CheckCircle className="w-3.5 h-3.5" /> Cleared</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Chart Footer */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Commission Payout Ratios (This Month)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commissionPaidData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="role" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" tickFormatter={(val) => `₹${val / 1000}K`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {commissionPaidData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
