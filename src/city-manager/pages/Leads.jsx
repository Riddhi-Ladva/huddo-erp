// src/city-manager/pages/Leads.jsx
import { useState } from 'react';
import { 
  Plus, Phone, Grid, List, X
} from 'lucide-react';

export default function Leads({ 
  leads, 
  onAddLead, 
  onUpdateLeadStage, 
  onConvertLead, 
  onNavigate, 
  showToast 
}) {
  const [viewMode, setViewMode] = useState('kanban'); // kanban | list
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    mobile: '',
    area: '',
    source: 'Field Visit',
    notes: ''
  });

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.ownerName.trim() || !form.mobile.trim() || !form.area.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const newLead = {
      id: `L-0${Math.floor(100 + Math.random() * 900)}`,
      businessName: form.businessName,
      ownerName: form.ownerName,
      mobile: `+91 ${form.mobile}`,
      area: form.area,
      status: 'Contacted',
      notes: form.notes,
      lastContact: new Date().toISOString().split('T')[0],
      source: form.source
    };

    onAddLead(newLead);
    setIsAddModalOpen(false);
    showToast(`Lead created: ${form.businessName}`, 'success');

    // reset
    setForm({
      businessName: '',
      ownerName: '',
      mobile: '',
      area: '',
      source: 'Field Visit',
      notes: ''
    });
  };

  const handleStageChange = (id, newStage) => {
    onUpdateLeadStage(id, newStage);
    showToast(`Lead stage updated to ${newStage}`, 'success');
  };

  const handleConvertClick = (lead) => {
    onConvertLead(lead);
    showToast(`Converting ${lead.businessName} to retailer...`, 'info');
    onNavigate('Onboard Retailer');
  };

  const handleCall = (name) => {
    showToast(`Calling lead: ${name}...`, 'info');
  };

  // Stage Categories
  const stages = ['Contacted', 'Interested', 'Meeting Scheduled', 'Not Interested'];

  const stageBadgeColors = {
    'Contacted': 'bg-blue-50 text-blue-700 border-blue-100',
    'Interested': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Meeting Scheduled': 'bg-amber-50 text-amber-700 border-amber-100',
    'Not Interested': 'bg-rose-50 text-rose-700 border-rose-100'
  };

  const sourceColors = {
    'Field Visit': 'bg-blue-50 text-blue-700',
    'Referral': 'bg-emerald-50 text-emerald-700',
    'Cold Call': 'bg-slate-100 text-slate-650'
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Leads Pipeline</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Acquire new shops, manage prospect pipelines, and review coverage scopes</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Lead
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Leads Mapped</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">{leads.length} leads</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Prospecting</span>
          <h3 className="text-lg font-black text-slate-850 mt-2">
            {leads.filter(l => l.status === 'Interested' || l.status === 'Meeting Scheduled').length} Interested
          </h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Converted This Month</span>
          <h3 className="text-lg font-black text-emerald-600 mt-2">0 shops</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase block">Not Interested Ratio</span>
          <h3 className="text-lg font-black text-rose-600 mt-2">
            {leads.filter(l => l.status === 'Not Interested').length} Lost
          </h3>
        </div>
      </div>

      {/* Toggle mode bar */}
      <div className="p-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex items-center justify-between">
        <span className="text-[10px] text-slate-450 font-bold uppercase">Territory Scope: Ahmedabad</span>
        
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button 
            onClick={() => setViewMode('kanban')}
            className={`p-2 transition-all ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-800' : 'bg-white text-slate-450 hover:text-slate-700'}`}
            title="Kanban Pipeline"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'bg-white text-slate-450 hover:text-slate-700'}`}
            title="List Table"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = leads.filter(l => l.status === stage);
            return (
              <div key={stage} className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 flex flex-col space-y-4 min-w-[250px] max-h-[600px]">
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-[10.5px] font-black text-slate-750 uppercase tracking-wider">{stage}</span>
                  <span className="px-2 py-0.5 bg-slate-200 rounded-full text-[9px] font-black text-slate-650">{stageLeads.length}</span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-extrabold text-[12px] text-slate-850 block">{lead.businessName}</span>
                          <button onClick={() => handleConvertClick(lead)} className="text-slate-400 hover:text-emerald-600 transition-all shrink-0" title="Convert to Retailer">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-500">
                          <span>{lead.ownerName}</span>
                          <button onClick={() => handleCall(lead.ownerName)} className="hover:text-orange-600 font-bold flex items-center gap-0.5">
                            <Phone className="w-3 h-3 text-slate-400" /> {lead.mobile}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[8.5px] font-black uppercase tracking-wider">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg">{lead.area}</span>
                          <span className={`px-1.5 py-0.5 rounded-lg border-0 ${sourceColors[lead.source] || 'bg-slate-100 text-slate-600'}`}>{lead.source}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-450 leading-relaxed italic border-t border-slate-50 pt-2 font-medium">"{lead.notes}"</p>

                      <div className="flex items-center justify-between pt-2 text-[9px] text-slate-400 font-bold border-t border-slate-50">
                        <span>Last Contact: {lead.lastContact}</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-0.5 rounded text-[8px] font-bold text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {stages.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="p-8 text-center text-slate-400 italic text-[11px] font-semibold">No prospects at this stage.</div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-4">Business Name</th>
                <th className="py-2.5 px-4">Owner Name</th>
                <th className="py-2.5 px-4">Mobile</th>
                <th className="py-2.5 px-4">Area / Gward</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Last Contact</th>
                <th className="py-2.5 px-4">Notes</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-805">{lead.businessName}</td>
                  <td className="py-3 px-4">{lead.ownerName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-500">{lead.mobile}</td>
                  <td className="py-3 px-4 font-semibold text-slate-500">{lead.area}</td>
                  <td className="py-3 px-4">
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${sourceColors[lead.source] || 'bg-slate-100'}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${stageBadgeColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-400">{lead.lastContact}</td>
                  <td className="py-3 px-4 font-semibold text-slate-400 italic max-w-xs truncate" title={lead.notes}>{lead.notes}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleConvertClick(lead)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-[10px] font-bold flex items-center gap-0.5"
                      >
                        Convert
                      </button>
                      <button
                        onClick={() => handleCall(lead.ownerName)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 border border-slate-100 hover:border-slate-200"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-150 overflow-hidden flex flex-col relative z-10 animate-scale-up">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Add Prospect Lead</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-550 block">Business Trade Name*</label>
                <input
                  type="text"
                  placeholder="Enter shop name"
                  value={form.businessName}
                  onChange={(e) => setForm(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-555 block">Proprietor Name*</label>
                  <input
                    type="text"
                    placeholder="Owner name"
                    value={form.ownerName}
                    onChange={(e) => setForm(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-555 block">Mobile Number*</label>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    value={form.mobile}
                    onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-555 block">Area / Ward*</label>
                  <input
                    type="text"
                    placeholder="e.g. Gota, Satellite"
                    value={form.area}
                    onChange={(e) => setForm(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-555 block">Lead Source*</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none text-[11px]"
                  >
                    <option value="Field Visit">Field Visit</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-555 block">Prospect Notes / Requirements</label>
                <textarea
                  placeholder="Enter initial discussion notes, target lines, summer stock interest..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-650 hover:bg-orange-750 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
