// src/state-manager/pages/FieldForce.jsx
import { useState } from 'react';
import { 
  MapPin, Users, Eye, X, Milestone, AlertCircle, SlidersHorizontal
} from 'lucide-react';

export default function FieldForce({ 
  fieldForceData 
}) {
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [selectedFF, setSelectedFF] = useState(null);

  // Dynamic calculations
  const totalEmployees = fieldForceData.length;
  const checkedInToday = fieldForceData.filter(f => f.status === 'Active').length;
  const totalVisits = fieldForceData.reduce((sum, f) => sum + f.todayVisits, 0);
  const totalDistance = fieldForceData.reduce((sum, f) => sum + f.distanceKm, 0);
  
  // Find employees not checked in
  const notCheckedInList = fieldForceData.filter(f => f.status !== 'Active');
  const notCheckedInNames = notCheckedInList.map(f => f.name).join(', ') || 'None';

  // Filter list
  const filteredForce = fieldForceData.filter(f => {
    return cityFilter === 'All Cities' || f.city.toLowerCase() === cityFilter.toLowerCase();
  });

  // Mock timeline for detail drawer
  const getTimelineVisits = (city) => {
    return [
      { time: "09:05", event: "Checked In", details: `GPS Lock: ${city} Head Office` },
      { time: "10:30", event: "Visited Shop", details: "Patel Footwear, CG Road" },
      { time: "11:45", event: "Visited Shop", details: "Star Shoes, Navrangpura" },
      { time: "14:15", event: "Visited Shop", details: "Classic Comfort, Satellite" },
      { time: "15:50", event: "Collected Order", details: "ORD-2026-0541 (₹32,500)" }
    ];
  };

  // Mock route history
  const getRouteHistory = () => {
    return [
      "Head Office, Ahmedabad",
      "CG Road, Patel Footwear",
      "Navrangpura, Star Shoes",
      "Satellite, Classic Comfort"
    ];
  };

  // Mock attendance dates (last 7 days)
  const attendanceDates = ["08 Jun", "09 Jun", "10 Jun", "11 Jun", "12 Jun", "13 Jun", "14 Jun"];

  const getMockAttendance = (name, date) => {
    if (date === "14 Jun" && name === "Mihir Trivedi") return "✗"; // Not checked in today
    if (date === "14 Jun") return "✓";
    if (date === "13 Jun") return "✓";
    if (date === "12 Jun" && name === "Swati Raval") return "✗";
    if (date === "08 Jun" || date === "09 Jun") return "-"; // Weekend
    return "✓";
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Field Force tracking</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Monitor city manager live activities, GPS locations, clock-ins, and shop visits</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All Cities">All Cities</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Surat">Surat</option>
            <option value="Vadodara">Vadodara</option>
            <option value="Rajkot">Rajkot</option>
            <option value="Morbi">Morbi</option>
            <option value="Bhavnagar">Bhavnagar</option>
          </select>
        </div>
      </div>

      {/* Summary Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In Today</span>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">{checkedInToday} of {totalEmployees}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Visits Today</span>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">{totalVisits} Shops</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Distance</span>
            <h3 className="text-lg font-black text-slate-800 mt-0.5">{totalDistance} km</h3>
          </div>
        </div>

        {/* Card 4: Red highlight if anyone not checked in */}
        <div className={`border rounded-2xl p-4 shadow-sm flex items-center gap-4 ${
          notCheckedInList.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-white border-slate-200/60'
        }`}>
          <div className={`p-3 rounded-xl ${notCheckedInList.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-50 text-slate-500'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider block">Not Checked In</span>
            <p className="text-sm font-black truncate mt-0.5" title={notCheckedInNames}>
              {notCheckedInList.length > 0 ? notCheckedInNames : "All Present"}
            </p>
          </div>
        </div>

      </div>

      {/* Field Force Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Clock In</th>
                <th className="py-3 px-4">Clock Out</th>
                <th className="py-3 px-4 text-center">Today's Visits</th>
                <th className="py-3 px-4 text-center">Distance (km)</th>
                <th className="py-3 px-4">Last Known Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredForce.length > 0 ? (
                filteredForce.map((ff) => (
                  <tr key={ff.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{ff.name}</td>
                    <td className="py-3 px-4">{ff.role}</td>
                    <td className="py-3 px-4">{ff.city}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{ff.clockIn || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{ff.clockOut || '-'}</td>
                    <td className="py-3 px-4 text-center font-bold">{ff.todayVisits}</td>
                    <td className="py-3 px-4 text-center font-bold">{ff.distanceKm}</td>
                    <td className="py-3 px-4 font-semibold text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate max-w-xs">{ff.lastLocation || '-'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        ff.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {ff.status === 'Active' ? 'Active' : 'Not Checked In'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedFF(ff)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-slate-400 font-semibold">No field employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Summary Section (below table) */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">7-Day Attendance Logs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-4 text-left">Employee Name</th>
                {attendanceDates.map(d => (
                  <th key={d} className="py-2.5 px-3">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {fieldForceData.map((ff) => (
                <tr key={ff.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 text-left">{ff.name}</td>
                  {attendanceDates.map(d => {
                    const mark = getMockAttendance(ff.name, d);
                    let color = 'text-slate-400';
                    if (mark === '✓') color = 'text-emerald-600 font-black';
                    if (mark === '✗') color = 'text-rose-600 font-black';

                    return (
                      <td key={d} className={`py-3 px-3 font-semibold ${color}`}>
                        {mark}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: Employee Activity Detail */}
      {selectedFF && (
        <div className="fixed inset-0 z-45 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300">
          
          <div className="flex-1" onClick={() => setSelectedFF(null)}></div>
          
          <div className="w-full max-w-md bg-white h-screen shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
            
            <div className="space-y-6 text-xs font-semibold text-slate-600">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Field Force Dossier</h3>
                <button 
                  onClick={() => setSelectedFF(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Employee Header info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm rounded-xl shadow-inner">
                  {selectedFF.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{selectedFF.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{selectedFF.role} — {selectedFF.city}</p>
                </div>
              </div>

              {/* Today's aggregated metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-bold text-slate-500">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <span className="text-[8px] text-slate-400 uppercase block">Visits Completed</span>
                  <span className="text-slate-800 mt-1 block text-sm font-black">{selectedFF.todayVisits} Shops</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <span className="text-[8px] text-slate-400 uppercase block">Distance Traveled</span>
                  <span className="text-slate-800 mt-1 block text-sm font-black">{selectedFF.distanceKm} km</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <span className="text-[8px] text-slate-400 uppercase block">Orders Collected</span>
                  <span className="text-slate-800 mt-1 block text-sm font-black">1 Order</span>
                </div>
              </div>

              {/* Today's Vertical Timeline */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Activity log</h5>
                
                {selectedFF.status === 'Active' ? (
                  <div className="relative pl-6 border-l border-slate-100 ml-3 space-y-4">
                    {getTimelineVisits(selectedFF.city).map((visit, i) => (
                      <div key={i} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 bg-orange-500 border-2 border-white rounded-full"></div>
                        
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-[11px]">{visit.event}</span>
                            <span className="text-[9px] text-slate-400 font-bold">{visit.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">{visit.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400 italic">
                    Employee has not checked in today. No timeline logs recorded.
                  </div>
                )}
              </div>

              {/* Route History (Numbered List) */}
              {selectedFF.status === 'Active' && (
                <div className="space-y-2.5">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Chronological Route Mappings</h5>
                  <ol className="list-decimal list-inside space-y-1 text-[10px] font-semibold text-slate-500">
                    {getRouteHistory().map((loc, i) => (
                      <li key={i} className="py-1 border-b border-slate-50 last:border-0 pl-1">
                        {loc}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            </div>

            {/* Actions footer */}
            <div className="border-t border-slate-100 pt-4 mt-6">
              <button 
                onClick={() => setSelectedFF(null)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
