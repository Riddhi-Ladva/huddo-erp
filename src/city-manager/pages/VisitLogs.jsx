// src/city-manager/pages/VisitLogs.jsx
import { useState } from 'react';
import { 
  MapPin, Plus, X
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function VisitLogs({ 
  visitLogs, 
  retailers, 
  leads, 
  onLogVisit, 
  showToast,
  initialLogVisitOpen = false,
  initialTargetId = '',
  initialVisitType = 'Retailer Visit'
}) {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Modal & Drawer
  const [isLogModalOpen, setIsLogModalOpen] = useState(initialLogVisitOpen);
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Form State
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    visitType: initialVisitType,
    targetId: initialTargetId || (initialVisitType === 'Retailer Visit' ? (retailers[0]?.id || '') : (leads[0]?.id || '')),
    purpose: 'Relationship Visit',
    checkIn: '10:00',
    checkOut: '11:00',
    outcome: '',
    gpsVerified: true
  });

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (form.outcome.trim().length < 20) {
      showToast('Outcome description must be at least 20 characters.', 'error');
      return;
    }

    let targetName;
    let targetArea;

    if (form.visitType === 'Retailer Visit') {
      const retailer = retailers.find(r => r.id === form.targetId);
      targetName = retailer ? retailer.businessName : 'Unknown Shop';
      targetArea = retailer ? retailer.shopAddress.split(',')[1]?.trim() || 'Ahmedabad' : 'Ahmedabad';
    } else {
      const lead = leads.find(l => l.id === form.targetId);
      targetName = lead ? `${lead.businessName} (Lead)` : 'Unknown Lead';
      targetArea = lead ? lead.area.split(',')[0]?.trim() || 'Ahmedabad' : 'Ahmedabad';
    }

    const newLog = {
      id: `V-0${Math.floor(100 + Math.random() * 900)}`,
      date: form.date,
      visitType: form.visitType,
      retailerName: targetName,
      area: targetArea,
      purpose: form.purpose,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      outcome: form.outcome,
      gpsVerified: form.gpsVerified
    };

    onLogVisit(newLog);
    setIsLogModalOpen(false);
    showToast(`Visit logged successfully for ${targetName}`, 'success');
    
    // reset form
    setForm({
      date: new Date().toISOString().split('T')[0],
      visitType: 'Retailer Visit',
      targetId: retailers[0]?.id || '',
      purpose: 'Relationship Visit',
      checkIn: '10:00',
      checkOut: '11:00',
      outcome: '',
      gpsVerified: true
    });
  };

  // Mock chart data for weekly summary
  const weeklySummaryData = [
    { day: 'Mon', Retailer: 2, Lead: 1 },
    { day: 'Tue', Retailer: 3, Lead: 0 },
    { day: 'Wed', Retailer: 1, Lead: 2 },
    { day: 'Thu', Retailer: 2, Lead: 1 },
    { day: 'Fri', Retailer: 3, Lead: 1 },
    { day: 'Sat', Retailer: 2, Lead: 2 },
    { day: 'Sun', Retailer: 0, Lead: 0 },
  ];

  // Mock Attendance data
  const attendanceData = [
    { date: '13 Jun 2026', clockIn: '09:30', clockOut: '17:45', hours: '8.25 hrs', visits: 3, status: 'Present' },
    { date: '12 Jun 2026', clockIn: '09:40', clockOut: '18:00', hours: '8.33 hrs', visits: 2, status: 'Present' },
    { date: '11 Jun 2026', clockIn: '09:20', clockOut: '17:30', hours: '8.15 hrs', visits: 1, status: 'Present' },
    { date: '10 Jun 2026', clockIn: '09:30', clockOut: '17:50', hours: '8.33 hrs', visits: 2, status: 'Present' },
    { date: '09 Jun 2026', clockIn: '09:15', clockOut: '17:20', hours: '8.08 hrs', visits: 0, status: 'Present' },
    { date: '08 Jun 2026', clockIn: '-', clockOut: '-', hours: '0 hrs', visits: 0, status: 'Weekly Off' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Visit Logs & Field Activity</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Audit customer touchpoints, log route metrics, and submit GPS check-in logs</p>
        </div>
        
        <button 
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Log New Visit
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Visits Today</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">3 Visits</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Retailers Visited</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">2 Shops</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Leads Contacted</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">1 Lead</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Distance (Approx)</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">34 km</h3>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">GPS Verification</span>
          <h3 className="text-lg font-black text-slate-800 mt-2">2 of 3 Verified</h3>
        </div>
      </div>

      {/* Visit Filter Row */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-1 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Retailer Visit">Retailer Visits</option>
            <option value="Lead Visit">Lead Visits</option>
          </select>
        </div>

        <span className="text-[10px] text-slate-450 font-bold uppercase">Field Scope: Ahmedabad District</span>
      </div>

      {/* Visit Logs Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Entity Mapped</th>
              <th className="py-2.5 px-4">Area / Ward</th>
              <th className="py-2.5 px-4">Purpose</th>
              <th className="py-2.5 px-4 text-center">Check In</th>
              <th className="py-2.5 px-4 text-center">Check Out</th>
              <th className="py-2.5 px-4">Outcome</th>
              <th className="py-2.5 px-4 text-center">GPS</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitLogs.filter(log => {
              if (typeFilter !== 'All' && log.visitType !== typeFilter) return false;
              return true;
            }).map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-450">{log.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    log.visitType === 'Retailer Visit' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {log.visitType === 'Retailer Visit' ? 'Retailer' : 'Lead'}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-800">{log.retailerName}</td>
                <td className="py-3 px-4 font-semibold text-slate-650">{log.area}</td>
                <td className="py-3 px-4">
                  <span className="px-1.5 py-0.5 bg-slate-50 border rounded text-[9px] text-slate-550 font-bold">
                    {log.purpose}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-500">{log.checkIn}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-500">{log.checkOut || '-'}</td>
                <td className="py-3 px-4 font-semibold text-slate-400 max-w-xs truncate" title={log.outcome}>
                  {log.outcome}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    log.gpsVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-450'
                  }`}>
                    {log.gpsVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => setSelectedVisit(log)}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly summary bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Weekly Visits Activity Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySummaryData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold', borderRadius: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="Retailer" name="Retailer Visit" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Lead" name="Lead Visit" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance matrix */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
            Weekly Attendance & Logins
          </h3>
          <div className="overflow-y-auto max-h-56 pr-1">
            <table className="w-full text-left text-[11px] font-medium text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] text-slate-400 font-bold uppercase bg-slate-50/50">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">In/Out</th>
                  <th className="py-2 px-2 text-center">Visits</th>
                  <th className="py-2 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650">
                {attendanceData.map((att) => (
                  <tr key={att.date}>
                    <td className="py-2.5 px-2 font-bold text-slate-800">{att.date}</td>
                    <td className="py-2.5 px-2">{att.clockIn === '-' ? '-' : `${att.clockIn} - ${att.clockOut}`}</td>
                    <td className="py-2.5 px-2 text-center font-bold">{att.visits}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        att.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* VISIT DETAIL DRAWER */}
      {selectedVisit && (
        <div className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedVisit(null)} />
          <div className="bg-white w-full max-w-[480px] h-full shadow-2xl relative z-10 flex flex-col justify-between animate-slide-in-right border-l border-slate-200">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">{selectedVisit.retailerName}</h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">Visit Log ID: {selectedVisit.id}</span>
              </div>
              <button onClick={() => setSelectedVisit(null)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile details */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Check-In Summary</span>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Visit Date</span>
                    <span className="text-slate-800 font-bold">{selectedVisit.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Purpose Code</span>
                    <span className="text-slate-800 font-bold">{selectedVisit.purpose}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Check In Time</span>
                    <span className="text-slate-800 font-bold">{selectedVisit.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Check Out Time</span>
                    <span className="text-slate-800 font-bold">{selectedVisit.checkOut || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block uppercase">GPS Coordinates Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${
                      selectedVisit.gpsVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {selectedVisit.gpsVerified ? 'Verified ✓' : 'Unverified ✗'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Outcome Text */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Outcome Notes</span>
                <p className="text-xs text-slate-650 bg-slate-50 border border-slate-100 p-4 rounded-xl leading-relaxed italic">
                  "{selectedVisit.outcome}"
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">GPS Verification Map</span>
                <div className="h-44 bg-slate-200 border border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-450 relative overflow-hidden select-none">
                  <MapPin className="w-8 h-8 text-rose-500 animate-bounce" />
                  <span className="text-[10px] font-black uppercase mt-1">Verified Location</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-0.5">{selectedVisit.area}, Ahmedabad, GJ</span>
                  <div className="absolute inset-0 bg-slate-900/5 hover:bg-slate-900/0 transition-all pointer-events-none"></div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => setSelectedVisit(null)}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                Close Log Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOG VISIT MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsLogModalOpen(false)} />
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-150 overflow-hidden flex flex-col relative z-10 animate-scale-up">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Log New Field Visit</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4 text-xs font-semibold">
              
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500">Visit Date*</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-550 block">GPS Verification*</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={form.gpsVerified}
                        onChange={() => setForm(prev => ({ ...prev, gpsVerified: true }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>Verified</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!form.gpsVerified}
                        onChange={() => setForm(prev => ({ ...prev, gpsVerified: false }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>Unverified</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Visit Type */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Visit Entity Type*</label>
                <div className="flex items-center gap-4 mt-1 select-none">
                  {['Retailer Visit', 'Lead Visit'].map(t => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="visitType"
                        value={t}
                        checked={form.visitType === t}
                        onChange={(e) => setForm(prev => ({ 
                          ...prev, 
                          visitType: e.target.value,
                          targetId: e.target.value === 'Retailer Visit' ? (retailers[0]?.id || '') : (leads[0]?.id || '')
                        }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>{t === 'Retailer Visit' ? 'Registered Retailer' : 'Market Lead'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Dropdown */}
              <div className="space-y-1">
                <label className="text-slate-500 block">Select Entity*</label>
                <select
                  value={form.targetId}
                  onChange={(e) => setForm(prev => ({ ...prev, targetId: e.target.value }))}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {form.visitType === 'Retailer Visit' ? (
                    retailers.map(r => (
                      <option key={r.id} value={r.id}>{r.businessName} (Ahmedabad)</option>
                    ))
                  ) : (
                    leads.map(l => (
                      <option key={l.id} value={l.id}>{l.businessName} ({l.area})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Purpose & Times */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-slate-500">Purpose*</label>
                  <select
                    value={form.purpose}
                    onChange={(e) => setForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none text-[11px]"
                  >
                    <option value="Relationship Visit">Relationship</option>
                    <option value="Order Collection">Order Collection</option>
                    <option value="Payment Follow-up">Payment Recovery</option>
                    <option value="New Introduction">Prospecting</option>
                    <option value="Issue Resolution">Support Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-550 block">Check In*</label>
                  <input
                    type="time"
                    value={form.checkIn}
                    onChange={(e) => setForm(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-550 block">Check Out*</label>
                  <input
                    type="time"
                    value={form.checkOut}
                    onChange={(e) => setForm(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Outcome notes */}
              <div className="space-y-1">
                <label className="text-slate-550 block">Outcome Notes* (Min 20 characters)</label>
                <textarea
                  placeholder="Detail the discussion topics, pending orders committed, feedback received, outstanding updates..."
                  value={form.outcome}
                  onChange={(e) => setForm(prev => ({ ...prev, outcome: e.target.value }))}
                  rows="3"
                  className="w-full p-2 border border-slate-250 rounded-xl bg-white focus:outline-none"
                  required
                />
              </div>

              {/* Controls */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-650 hover:bg-orange-750 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all cursor-pointer"
                >
                  Save Visit Log
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
