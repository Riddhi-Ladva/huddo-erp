import React, { useState } from 'react';
import { 
  TrendingUp, ShoppingCart, Archive, Percent, Users, Award, 
  ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { initialDepartmentsDetails } from '../mockData';

const ICONS_MAP = {
  TrendingUp: TrendingUp,
  ShoppingCart: ShoppingCart,
  Archive: Archive,
  Percent: Percent,
  Users: Users,
  Award: Award
};

export default function Departments({ showToast }) {
  const [departments, setDepartments] = useState(initialDepartmentsDetails);
  const [selectedDeptId, setSelectedDeptId] = useState(null); // id | null

  const handleToggleFeature = (deptId, featureKey) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        const currentVal = dept.features[featureKey];
        const updatedFeatures = {
          ...dept.features,
          [featureKey]: !currentVal
        };
        showToast(
          `${featureKey} feature has been ${!currentVal ? 'enabled' : 'disabled'} for ${dept.id} Department.`,
          "success"
        );
        return {
          ...dept,
          features: updatedFeatures
        };
      }
      return dept;
    }));
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId);

  if (selectedDept) {
    const IconComponent = ICONS_MAP[selectedDept.icon] || LayoutGrid;
    return (
      <div className="space-y-6">
        {/* Detail View Header */}
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Departments</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="p-3.5 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
              <IconComponent className="w-8 h-8" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Department Overview</span>
              <h1 className="text-xl font-bold text-slate-900 font-display mt-0.5">{selectedDept.name}</h1>
              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2 mt-1">
                <span>Head: <strong>{selectedDept.head}</strong></span>
                <span>•</span>
                <span>Members: <strong>{selectedDept.members}</strong></span>
                <span>•</span>
                <span>Teams: <strong>{selectedDept.teams}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Feature toggles list */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">Feature & Sub-Module Access Configuration</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Toggle operational sub-modules to configure which features are enabled for division representatives on-field or in-office.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {Object.entries(selectedDept.features).map(([featureKey, isEnabled]) => (
              <div 
                key={featureKey}
                className="flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="text-xs font-bold text-slate-700">{featureKey}</span>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => handleToggleFeature(selectedDept.id, featureKey)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    isEnabled ? 'bg-brand-orange' : 'bg-slate-300'
                  }`}
                >
                  <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isEnabled ? 'translate-x-6' : ''
                  }`}></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Department Management</h1>
        <p className="text-sm text-slate-500">Enable features, verify division heads, and customize core workflows for departmental staff.</p>
      </div>

      {/* Six Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
          const IconComponent = ICONS_MAP[dept.icon] || TrendingUp;
          return (
            <div 
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-orange hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="p-3 bg-slate-50 text-slate-700 border border-slate-100 rounded-xl group-hover:text-brand-orange transition-colors">
                  <IconComponent className="w-6 h-6 text-brand-orange" />
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{dept.members} Personnel Mapped</span>
              </div>
              
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-800 font-display">{dept.name}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Division Head: {dept.head}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Click to configure feature toggles...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Dummy Icon fallback
function LayoutGrid(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}
