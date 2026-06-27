// src/city-manager/pages/Retailers.jsx
import { useState } from 'react';
import { 
  Store, Search, Grid, List, Phone, Plus, X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../cityManagerUtils';

export default function Retailers({ 
  retailers, 
  orders, 
  onApproveRetailer, 
  onRejectRetailer, 
  onAddCommunication,
  onLogVisitClick,
  onPlaceOrderClick,
  onMarkPaid,
  onNavigate,
  showToast,
  initialCategoryTab = 'All'
}) {
  const [activeCategoryTab, setActiveCategoryTab] = useState(initialCategoryTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // grid | table

  // Drawer State
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [newCommType, setNewCommType] = useState('Visit');
  const [newCommNote, setNewCommNote] = useState('');
  const [isCommLoading, setIsCommLoading] = useState(false);

  // KYC Reject State
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Category Colors
  const categoryColors = {
    Platinum: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Gold: 'bg-amber-50 text-amber-700 border-amber-100',
    Silver: 'bg-slate-100 text-slate-700 border-slate-200',
    Standard: 'bg-zinc-100 text-zinc-650 border-zinc-200'
  };

  const statusColors = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pending Verification': 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  // Copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  // Onboard Action redirect
  const handleOnboardRedirect = () => {
    onNavigate('Onboard Retailer');
  };

  // Verification Approvals
  const handleApproveKYC = (retailer) => {
    onApproveRetailer(retailer.id);
    showToast(`Approved & Activated retailer: ${retailer.businessName}`, 'success');
  };

  const handleRejectKYCSubmit = (id, name) => {
    if (rejectReason.trim().length < 10) {
      showToast('Please enter a rejection reason (min 10 characters).', 'error');
      return;
    }
    onRejectRetailer(id, rejectReason);
    showToast(`Rejected onboarding for: ${name}`, 'info');
    setRejectingId(null);
    setRejectReason('');
  };

  // New Communication submit
  const handleSaveCommunication = (retailerId) => {
    if (newCommNote.trim().length < 5) {
      showToast('Please enter a valid note (min 5 characters).', 'error');
      return;
    }
    setIsCommLoading(true);
    setTimeout(() => {
      onAddCommunication(retailerId, {
        date: new Date().toISOString().split('T')[0],
        type: newCommType,
        note: newCommNote
      });
      setIsCommLoading(false);
      setNewCommNote('');
      showToast('Communication log added!', 'success');
    }, 300);
  };

  // Filter retailers
  const filteredRetailers = retailers.filter(r => {
    // Category filter
    if (activeCategoryTab !== 'All') {
      if (activeCategoryTab === 'Pending') {
        if (r.status !== 'Pending Verification') return false;
      } else {
        if (r.category !== activeCategoryTab) return false;
      }
    }

    // Status filter
    if (statusFilter !== 'All') {
      if (r.status !== statusFilter) return false;
    }

    // Search query
    const matchesSearch = 
      r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mobile.includes(searchQuery);

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">My Retailers — Ahmedabad</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage, onboard, and verify retail shop profiles scoped to your city</p>
        </div>
        
        <button 
          onClick={handleOnboardRedirect}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Onboard New Retailer
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-0.5 self-start overflow-x-auto max-w-full">
        {['All', 'Platinum', 'Gold', 'Silver', 'Standard', 'Pending'].map((tab) => {
          const count = tab === 'All' ? retailers.length :
                        tab === 'Pending' ? retailers.filter(r => r.status === 'Pending Verification').length :
                        retailers.filter(r => r.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveCategoryTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                activeCategoryTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by business, owner name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold w-full bg-white text-slate-700 focus:outline-none focus:border-slate-350"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* View toggler */}
        <div className="flex border border-slate-200 rounded-xl overflow-hidden self-start">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'bg-white text-slate-450 hover:text-slate-700'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 transition-all ${viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'bg-white text-slate-450 hover:text-slate-700'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRetailers.length > 0 ? (
            filteredRetailers.map((r) => (
              <div 
                key={r.id} 
                className="bg-white border border-slate-200/60 hover:border-slate-300 transition-all rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-800 truncate" title={r.businessName}>{r.businessName}</h3>
                    <span className={`px-2 py-0.5 text-[8px] font-black border uppercase rounded-full shrink-0 ${categoryColors[r.category] || 'bg-slate-50 text-slate-600'}`}>
                      {r.category}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-500">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Owner: {r.ownerName}</span>
                      <button 
                        onClick={() => handleCopy(r.mobile)}
                        className="text-[10px] hover:text-orange-600 font-bold"
                      >
                        {r.mobile}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visit info */}
                <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-50 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <div>
                    <span className="block text-[8px]">Last Order</span>
                    <span className="text-slate-700 mt-0.5 block">{r.lastOrderDate ? formatDate(r.lastOrderDate) : 'No Orders'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px]">Last Visit</span>
                    <span className="text-slate-700 mt-0.5 block">{r.lastVisitDate ? formatDate(r.lastVisitDate) : '-'}</span>
                  </div>
                </div>

                {/* Sales info */}
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Revenue</span>
                    <span className="font-extrabold text-slate-800">{formatCurrency(r.totalRevenue)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Outstanding</span>
                    <span className={`font-black ${r.pendingPayment > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {formatCurrency(r.pendingPayment)}
                    </span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[r.status]}`}>
                    {r.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onLogVisitClick(r)}
                      className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-bold text-slate-700 transition-all"
                    >
                      Log Visit
                    </button>
                    <button 
                      onClick={() => setSelectedRetailer(r)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Verification card helper directly in list */}
                {r.status === 'Pending Verification' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    {rejectingId === r.id ? (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Reason for rejection (GST invalid, KYC defect)..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full p-2 border border-rose-200 rounded-lg text-xs font-semibold focus:outline-none"
                          rows="2"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => setRejectingId(null)}
                            className="px-2 py-1 text-[10px] font-bold border border-slate-200 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleRejectKYCSubmit(r.id, r.businessName)}
                            className="px-2 py-1 text-[10px] font-bold bg-rose-600 text-white rounded-lg"
                          >
                            Reject Onboarding
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setRejectingId(r.id)}
                          className="w-full py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-[10px] font-bold"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleApproveKYC(r)}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                        >
                          Approve KYC
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))
          ) : (
            <div className="md:col-span-3 bg-white p-12 text-center border border-slate-200/60 rounded-2xl flex flex-col items-center justify-center text-slate-400">
              <Store className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
              <p className="text-xs font-bold">No retailers found mapping filter parameters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-4">Business Name</th>
                <th className="py-2.5 px-4">Owner</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Orders</th>
                <th className="py-2.5 px-4 text-right">Revenue</th>
                <th className="py-2.5 px-4 text-right">Outstanding</th>
                <th className="py-2.5 px-4">Last Order</th>
                <th className="py-2.5 px-4">Last Visit</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRetailers.length > 0 ? (
                filteredRetailers.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{r.businessName}</td>
                    <td className="py-3 px-4">{r.ownerName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black border uppercase rounded-full ${categoryColors[r.category]}`}>
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{r.totalOrders}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-800">{formatCurrency(r.totalRevenue)}</td>
                    <td className={`py-3 px-4 text-right font-black ${r.pendingPayment > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatCurrency(r.pendingPayment)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-450">{r.lastOrderDate ? formatDate(r.lastOrderDate) : '-'}</td>
                    <td className="py-3 px-4 font-semibold text-slate-450">{r.lastVisitDate ? formatDate(r.lastVisitDate) : '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleCopy(r.mobile)}
                          className="p-1 hover:bg-slate-105 border border-slate-100 hover:border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-all"
                          title="Copy Mobile"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => setSelectedRetailer(r)}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-6 text-center text-slate-400 italic">No retailers found mapping filter parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* RETAILER DETAILS DRAWER (Slide from right, 480px wide) */}
      {selectedRetailer && (
        <div className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs flex justify-end transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedRetailer(null)} />
          <div className="bg-white w-full max-w-[480px] h-full shadow-2xl relative z-10 flex flex-col justify-between animate-slide-in-right border-l border-slate-200">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">{selectedRetailer.businessName}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`px-2 py-0.5 text-[8px] font-black border uppercase rounded-full ${categoryColors[selectedRetailer.category]}`}>
                    {selectedRetailer.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[8px] font-extrabold border rounded-full ${statusColors[selectedRetailer.status]}`}>
                    {selectedRetailer.status}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedRetailer(null)}
                className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile details */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Shop Profile</span>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Owner Name</span>
                    <span className="text-slate-800 font-bold">{selectedRetailer.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Mobile</span>
                    <span className="text-slate-800 font-bold">{selectedRetailer.mobile}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block uppercase">Email</span>
                    <span className="text-slate-800 truncate block font-bold">{selectedRetailer.email || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block uppercase">Shop Address</span>
                    <span className="text-slate-700 text-[11px] block">{selectedRetailer.shopAddress}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">GSTIN</span>
                    <span className="text-slate-800 font-bold">{selectedRetailer.gstin}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">PAN</span>
                    <span className="text-slate-800 font-bold">{selectedRetailer.pan}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Assigned Promoter</span>
                    <span className="text-slate-800 font-bold">{selectedRetailer.assignedPromoter || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Joined Date</span>
                    <span className="text-slate-800 font-bold">{formatDate(selectedRetailer.joinedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200/50 rounded-2xl text-center">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Total Orders</span>
                  <span className="text-sm font-black text-slate-800 mt-1 block">{selectedRetailer.totalOrders}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Total Revenue</span>
                  <span className="text-sm font-black text-slate-800 mt-1 block truncate">{formatCurrency(selectedRetailer.totalRevenue)}</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Outstanding</span>
                  <span className={`text-sm font-black mt-1 block truncate ${selectedRetailer.pendingPayment > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formatCurrency(selectedRetailer.pendingPayment)}
                  </span>
                </div>
              </div>

              {/* Orders History */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Order History (Last 5)</span>
                <div className="border border-slate-100 rounded-xl overflow-x-auto text-[11px] font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[9px] text-slate-400 font-bold uppercase">
                        <th className="py-2 px-3">Order ID</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {orders.filter(o => o.retailerId === selectedRetailer.id).slice(0, 5).map(o => (
                        <tr key={o.id}>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{o.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{formatDate(o.orderDate)}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-700">{formatCurrency(o.amount)}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-1.5 py-0.5 bg-slate-50 border rounded text-[8px] font-extrabold uppercase">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.filter(o => o.retailerId === selectedRetailer.id).length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-4 text-center text-slate-400 italic">No orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline communication notes */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Communication History</span>
                
                {/* Log new timeline action */}
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Log New Communication</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-450 uppercase">Type:</span>
                    {['Visit', 'Call', 'Message'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setNewCommType(t)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          newCommType === t ? 'bg-orange-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <textarea
                      placeholder="Type details (e.g. GST verified, payment follow-up info)..."
                      value={newCommNote}
                      onChange={(e) => setNewCommNote(e.target.value)}
                      rows="2"
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                    />
                    <button 
                      onClick={() => handleSaveCommunication(selectedRetailer.id)}
                      disabled={isCommLoading}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isCommLoading ? 'Saving...' : 'Save Log'}
                    </button>
                  </div>
                </div>

                {/* Timeline display */}
                <div className="space-y-4 relative border-l border-slate-100 pl-4 ml-2.5 mt-2">
                  {selectedRetailer.communicationHistory && selectedRetailer.communicationHistory.length > 0 ? (
                    selectedRetailer.communicationHistory.map((h, i) => (
                      <div key={i} className="relative text-xs">
                        <span className={`w-3 h-3 rounded-full absolute -left-[22.5px] top-1 border-2 border-white ${
                          h.type === 'Visit' ? 'bg-blue-500' : h.type === 'Call' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}></span>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[10px] text-slate-450">{formatDate(h.date)}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            h.type === 'Visit' ? 'bg-blue-50 text-blue-700' : h.type === 'Call' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-650'
                          }`}>{h.type}</span>
                        </div>
                        <p className="text-slate-600 font-semibold mt-1 leading-relaxed">{h.note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[11px] font-semibold py-2">No past logs available.</div>
                  )}
                </div>

              </div>

            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              {selectedRetailer.pendingPayment > 0 ? (
                <button 
                  onClick={() => { onMarkPaid(selectedRetailer.id); setSelectedRetailer(null); showToast('Outstanding marked as paid!', 'success'); }}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Mark Paid
                </button>
              ) : (
                <div></div>
              )}
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { onLogVisitClick(selectedRetailer); setSelectedRetailer(null); }}
                  className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Log Visit
                </button>
                <button 
                  onClick={() => { onPlaceOrderClick(selectedRetailer); setSelectedRetailer(null); }}
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Place Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
