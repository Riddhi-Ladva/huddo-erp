import React, { useState } from 'react';
import { MapPin, Search, Calendar, CheckCircle2, Navigation, Clock, User, Eye, Layers } from 'lucide-react';
import { fieldTrackingList, visitLogs } from '../mockData';
import { DataTable } from '../components/Common';

export default function FieldTracking({ showToast }) {
  const [activeTab, setActiveTab] = useState('tracker'); // tracker | visitLog | attendance | activity
  const [representatives] = useState(fieldTrackingList);
  const [logs] = useState(visitLogs);

  // Filter selections for reports
  const [selectedRep, setSelectedRep] = useState('Amit Kumar');
  const [selectedDate, setSelectedDate] = useState('2026-06-08');

  // Attendance mock summary data
  const mockAttendanceData = [
    { rep: 'Amit Kumar', role: 'Sales Executive', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: '8.5 hrs', status: 'Present' },
    { rep: 'Suresh Gowda', role: 'Sales Rep', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: '8.5 hrs', status: 'Present' },
    { rep: 'Rohit Verma', role: 'Sales Executive', checkIn: '10:00 AM', checkOut: '04:30 PM', hours: '6.5 hrs', status: 'Present' }
  ];

  // Daily Activity mock checklist data
  const mockDailyActivity = {
    "Amit Kumar": { clockIn: true, visitsCompleted: 4, ordersCollected: 2, amount: 235000, leads: 1 },
    "Suresh Gowda": { clockIn: true, visitsCompleted: 5, ordersCollected: 1, amount: 49990, leads: 3 },
    "Rohit Verma": { clockIn: true, visitsCompleted: 2, ordersCollected: 0, amount: 0, leads: 0 }
  };

  const activity = mockDailyActivity[selectedRep] || { clockIn: false, visitsCompleted: 0, ordersCollected: 0, amount: 0, leads: 0 };

  const repColumns = [
    { header: "Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Role", accessor: "role", render: (val) => <span className="text-slate-400 font-semibold">{val}</span> },
    { header: "Last Location Ping", accessor: "lastLocation", render: (val) => <span className="text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />{val}</span> },
    { header: "Last Active", accessor: "lastActive" },
    { header: "Today's Visits", accessor: "visitsToday" },
    { header: "Distance Travelled", accessor: "distance" }
  ];

  const logColumns = [
    { header: "Representative", accessor: "representative", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Retailer Outlet", accessor: "retailer", render: (val) => <span className="font-semibold text-slate-700">{val}</span> },
    { header: "Visit Time", accessor: "time" },
    { header: "Duration", accessor: "duration" },
    { header: "Discussion Notes", accessor: "notes" },
    { header: "GPS Verified", accessor: "gpsVerified", render: (val) => (
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold inline-flex items-center gap-0.5">
        ✓ GPS Verified
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Field Force Tracking</h1>
          <p className="text-sm text-slate-500">Monitor representative live locations, audit retailer visit logs, and inspect clock-in sheets.</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'tracker' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Real-time Tracker Map
        </button>
        <button 
          onClick={() => setActiveTab('visitLog')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'visitLog' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Retailer Visit Log
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'attendance' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Attendance Summary Sheet
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'activity' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Daily Activity Report
        </button>

      </div>

      {/* Contents */}
      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Live Tracking Node Grid</h3>
            
            {/* SVG/Map Mock UI */}
            <div className="w-full h-80 bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200 flex items-center justify-center">
              {/* Map grid lines layout */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              {/* Map Pins */}
              {representatives.map((rep, idx) => (
                <div 
                  key={rep.id} 
                  className="absolute cursor-pointer flex flex-col items-center group animate-pulse"
                  style={{ 
                    left: `${30 + idx * 22}%`, 
                    top: `${40 + (idx % 2 === 0 ? 15 : -15)}%` 
                  }}
                  onClick={() => {
                    setSelectedRep(rep.name);
                    showToast(`Selected representative: ${rep.name}`, "success");
                  }}
                >
                  <div className="bg-slate-900 border border-slate-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap mb-1">
                    {rep.name} ({rep.visitsToday} visits)
                  </div>
                  <MapPin className="w-6 h-6 text-rose-500 shrink-0" />
                </div>
              ))}

              <span className="text-[10px] text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs absolute bottom-3 right-3 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-rose-500 animate-spin" /> Live feed connected
              </span>
            </div>
          </div>

          {/* Location details side roster */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 font-display">Active Representatives</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {representatives.map(rep => (
                <div key={rep.id} className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800 font-display">{rep.name}</span>
                    <span className="text-[9px] text-emerald-600 font-bold uppercase">{rep.lastActive}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {rep.lastLocation}</span>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200/50 pt-2 mt-2 font-semibold">
                    <span>Visits: {rep.visitsToday}</span>
                    <span>Distance: {rep.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visitLog' && (
        <DataTable 
          columns={logColumns} 
          data={logs} 
          searchKeys={["representative", "retailer", "notes"]}
          searchPlaceholder="Search visit discussions..."
        />
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">Daily Attendance Clock-In Sheet</h3>
            <div className="flex gap-2">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-xs border border-slate-200 rounded p-1.5 focus:outline-none" />
            </div>
          </div>

          <div className="border border-slate-100 rounded-lg overflow-x-auto text-xs">
            <table className="w-full text-left font-semibold text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Clock-In Time</th>
                  <th className="px-4 py-3">Clock-Out Time</th>
                  <th className="px-4 py-3">Total Working Hours</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockAttendanceData.map((att, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-bold text-slate-800">{att.rep}</td>
                    <td className="px-4 py-3 text-slate-400">{att.role}</td>
                    <td className="px-4 py-3 flex items-center gap-1 text-slate-600"><Clock className="w-3.5 h-3.5 text-slate-400" />{att.checkIn}</td>
                    <td className="px-4 py-3 text-slate-600">{att.checkOut}</td>
                    <td className="px-4 py-3 text-slate-600">{att.hours}</td>
                    <td className="px-4 py-3 text-right"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold">{att.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Select Representative</label>
              <select value={selectedRep} onChange={(e) => setSelectedRep(e.target.value)} className="text-xs border border-slate-200 rounded p-2 bg-white">
                <option value="Amit Kumar">Amit Kumar</option>
                <option value="Suresh Gowda">Suresh Gowda</option>
                <option value="Rohit Verma">Rohit Verma</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Report Date</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-xs border border-slate-200 rounded p-2 bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* KPI Cards */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">Daily Achievements Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Orders Value Secured</span>
                  <p className="text-lg font-bold text-slate-800 font-display mt-0.5">₹{activity.amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">New Leads Acquired</span>
                  <p className="text-lg font-bold text-slate-800 font-display mt-0.5">{activity.leads} Leads</p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase">Daily Task Checklist</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${activity.clockIn ? 'text-emerald-500' : 'text-slate-300'}`} /> Clock-In Registration Completed</div>
                <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${activity.visitsCompleted >= 3 ? 'text-emerald-500' : 'text-slate-300'}`} /> Complete minimum 3 retailer outlet visits</div>
                <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${activity.ordersCollected > 0 ? 'text-emerald-500' : 'text-slate-300'}`} /> Secure minimum 1 order collection sheet</div>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
