import React, { useState } from 'react';
import { 
  MapPin, LogIn, Calendar, Activity, Navigation, 
  Map, Compass, Plus, SlidersHorizontal, CheckSquare
} from 'lucide-react';
import { mockVisits as initialVisits } from '../mockData/mockVisits';
import { mockRetailers } from '../mockData/mockRetailers';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function FieldTracking({ showToast }) {
  const [visits, setVisits] = useState(initialVisits);
  const [isLogOpen, setIsLogOpen] = useState(false);
  
  // Log form states
  const [retailerId, setRetailerId] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("Order Collected");
  const [capturedGps, setCapturedGps] = useState("");

  // Filter states
  const [filterOutcome, setFilterOutcome] = useState("All");

  const filteredVisits = React.useMemo(() => {
    if (filterOutcome === "All") return visits;
    return visits.filter(v => v.outcome === filterOutcome);
  }, [visits, filterOutcome]);

  // Handle mock GPS Capture
  const handleCaptureGps = () => {
    // Generate a slightly offset location from central Rajkot
    const lat = (22.3039 + (Math.random() - 0.5) * 0.02).toFixed(4);
    const lng = (70.8022 + (Math.random() - 0.5) * 0.02).toFixed(4);
    setCapturedGps(`${lat}° N, ${lng}° E`);
    showToast("Mock GPS Coordinates captured successfully!", "success");
  };

  // Submit visit log
  const handleLogVisitSubmit = () => {
    if (!retailerId || !notes.trim()) {
      showToast("Please select a retailer and fill notes.", "error");
      return;
    }
    if (!capturedGps) {
      showToast("Please capture GPS coordinates prior to logging.", "error");
      return;
    }

    const retName = mockRetailers.find(r => r.id === retailerId)?.name || "Unknown Retailer";

    const newVisit = {
      id: `VST-${String(visits.length + 1).padStart(3, '0')}`,
      retailerId,
      retailerName: retName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outcome,
      notes,
      location: capturedGps
    };

    setVisits([newVisit, ...visits]);
    setIsLogOpen(false);
    setRetailerId("");
    setNotes("");
    setCapturedGps("");
    showToast(`Visit to ${retName} successfully logged in timeline.`, "success");
  };

  const columns = [
    { header: "Date / Time", accessor: "date", render: (_, row) => `${row.date} - ${row.time}` },
    { header: "Retailer Name", accessor: "retailerName", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Visit Outcome", accessor: "outcome", render: (val) => <StatusBadge status={val} /> },
    { header: "Notes", accessor: "notes", render: (val) => <span className="truncate max-w-[200px] block" title={val}>{val}</span> },
    { header: "Coordinates", accessor: "location", render: (val) => <span className="text-[10px] text-slate-500 font-bold font-mono">{val}</span> }
  ];

  // Daily summary metrics
  const travelDistance = "42 km today";
  const plannedVsCompleted = { planned: 5, completed: 3 };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Field Force tracking</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Log distributor site visits and record live coordinate check-ins.</p>
        </div>

        <button 
          onClick={() => setIsLogOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Visit</span>
        </button>
      </div>

      {/* Roster & tracking details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Route History & Mileage Summary */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Daily mileage & Planned counts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              Daily Tracking Summary
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold">Travel Distance:</span>
                <span className="font-extrabold text-brand-orange text-sm">{travelDistance}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold">Visits Planned:</span>
                <span className="font-bold text-slate-700">{plannedVsCompleted.planned} Visits</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400 font-semibold">Visits Completed:</span>
                <span className="font-bold text-emerald-600">{plannedVsCompleted.completed} Completed</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(plannedVsCompleted.completed / plannedVsCompleted.planned) * 100}%` }}></div>
            </div>
          </div>

          {/* Timeline Route History (view only) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
              <Navigation className="w-4 h-4 text-slate-400" />
              Route Timeline (Today)
            </h3>

            <div className="relative border-l border-slate-100 pl-4 space-y-4">
              {visits.filter(v => v.date === "2026-06-16").map((visit, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[20.5px] top-1 w-2 h-2 bg-brand-orange border-2 border-white rounded-full"></span>
                  <span className="text-[9px] font-bold text-slate-400">{visit.time}</span>
                  <span className="font-bold text-slate-800 block text-xs mt-0.5">{visit.retailerName}</span>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={visit.outcome} />
                    <span className="text-[8px] text-slate-400 font-mono font-bold">{visit.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Map placeholder and History table */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map placeholder */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 font-display flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-400" />
              Geo-Location Map (Mock Grid)
            </h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl h-48 relative flex flex-col items-center justify-center text-center overflow-hidden">
              {/* Mock map graphic style */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              
              <Compass className="w-10 h-10 text-slate-300 animate-spin-slow mb-2" />
              <div className="px-4 z-10">
                <span className="text-xs font-bold text-slate-850 block">Satellite GPS Tracking Active</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold block mt-1">
                  Location logged: 22.3039° N, 70.8022° E (Rajkot Central Office Hub)
                </span>
              </div>
            </div>
          </div>

          {/* Visits Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Visit Logs History Ledger
              </h3>
              
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select 
                  value={filterOutcome}
                  onChange={(e) => setFilterOutcome(e.target.value)}
                  className="text-[10px] border border-slate-200 rounded p-1 bg-white font-bold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Outcomes</option>
                  <option value="Order Collected">Order Collected</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Demo Given">Demo Given</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>

            <CustomDataTable 
              columns={columns}
              data={filteredVisits}
              searchKeys={["retailerName", "notes", "location", "outcome"]}
              searchPlaceholder="Search site visit logs..."
            />
          </div>

        </div>

      </div>

      {/* Log Visit Modal Form */}
      <CustomModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        title="Log Site Visit Form"
        confirmText="Save Visit Log"
        onConfirm={handleLogVisitSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Retailer *</label>
            <select
              value={retailerId}
              onChange={(e) => setRetailerId(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="">-- Choose Retailer --</option>
              {mockRetailers.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Visit Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="Order Collected">Order Collected</option>
                <option value="Follow-up Needed">Follow-up Needed</option>
                <option value="Demo Given">Demo Given</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">GPS Capture Verification *</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  placeholder="Capture coordinates..." 
                  value={capturedGps}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 font-mono font-bold text-slate-700 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg cursor-pointer shrink-0 transition-colors"
                >
                  Capture GPS
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Visit notes / Remarks *</label>
            <textarea 
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide brief notes on conversation outcome..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
