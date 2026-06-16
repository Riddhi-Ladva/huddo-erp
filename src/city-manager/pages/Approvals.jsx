// src/city-manager/pages/Approvals.jsx
import { useState } from 'react';
import { 
  CheckSquare, AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../cityManagerUtils';

export default function Approvals({ 
  pendingApprovals, 
  approvalHistory, 
  onApproveApproval, 
  onRejectApproval, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('All');
  
  // Inline reject states
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (item) => {
    onApproveApproval(item.id);
    showToast(`Approved item: ${item.type === 'Large Order' ? item.orderId : item.retailer}`, 'success');
  };

  const handleRejectConfirm = (item) => {
    if (rejectReason.trim().length < 20) {
      showToast('Rejection reason must be at least 20 characters.', 'error');
      return;
    }
    onRejectApproval(item.id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
    showToast(`Rejected item: ${item.type === 'Large Order' ? item.orderId : item.retailer}`, 'info');
  };

  // Filter pending approvals
  const filteredApprovals = pendingApprovals.filter(item => {
    if (activeTab === 'Orders') return item.type === 'Large Order';
    if (activeTab === 'Registrations') return item.type === 'Retailer Registration';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Approvals — Pending Action</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Review orders exceeding category credit thresholds or verify onboarding compliance profiles</p>
      </div>

      {/* Summary Banner */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-xs font-bold text-amber-800">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{pendingApprovals.length} items require your attention. Action needed to clear operational queues.</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-0.5 self-start select-none">
        {['All', 'Orders', 'Registrations'].map((tab) => {
          const count = tab === 'All' ? pendingApprovals.length :
                        tab === 'Orders' ? pendingApprovals.filter(i => i.type === 'Large Order').length :
                        pendingApprovals.filter(i => i.type === 'Retailer Registration').length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab === 'Registrations' ? 'Retailer Registrations' : tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Pending Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <span className={`px-2 py-0.5 text-[8px] font-black border uppercase rounded-full ${
                  item.type === 'Large Order' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {item.type}
                </span>

                <span className={`px-2 py-0.5 text-[8px] font-black border uppercase rounded-full ${
                  item.urgency === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' : 'bg-slate-100 text-slate-650'
                }`}>
                  {item.urgency} Urgency
                </span>
              </div>

              {/* Body */}
              <div className="text-xs font-semibold text-slate-750 space-y-1">
                {item.type === 'Large Order' ? (
                  <>
                    <h3 className="text-sm font-black text-slate-800">Order {item.orderId}</h3>
                    <p className="text-slate-400">Retailer: <span className="text-slate-650 font-bold">{item.retailer}</span></p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-bold text-slate-500 uppercase">
                      <div>
                        <span className="block text-[8px] text-slate-400">Amount</span>
                        <span className="text-slate-750 block mt-0.5">{formatCurrency(item.amount)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400">Line Items</span>
                        <span className="text-slate-750 block mt-0.5">{item.items} Products</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-black text-slate-800">{item.retailer}</h3>
                    <p className="text-slate-400">City Scope: <span className="text-slate-650 font-bold">{item.city}</span></p>
                    <p className="text-[10px] text-slate-450 mt-1">GSTIN and compliance documents uploaded for review.</p>
                  </>
                )}
                
                <div className="text-[9px] text-slate-400 font-bold uppercase pt-1">
                  Submitted: {item.date}
                </div>
              </div>

              {/* Action buttons */}
              {rejectingId === item.id ? (
                <div className="pt-2 space-y-2 animate-fade-in">
                  <textarea
                    placeholder="Provide detailed rejection notes (minimum 20 characters)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2.5 border border-rose-200 rounded-xl text-xs font-semibold bg-white focus:outline-none"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setRejectingId(null)}
                      className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 rounded-lg text-slate-700 bg-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleRejectConfirm(item)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-rose-650 text-white rounded-lg cursor-pointer"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => setRejectingId(item.id)}
                    className="w-full py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(item)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {item.type === 'Large Order' ? 'Approve' : 'Approve & Activate'}
                  </button>
                </div>
              )}

            </div>
          ))
        ) : (
          <div className="md:col-span-2 bg-white p-12 text-center border border-slate-200/60 rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <CheckSquare className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
            <p className="text-xs font-bold">All approvals cleared! No items pending action.</p>
          </div>
        )}
      </div>

      {/* Approval History Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Recent Decisions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3">Item / Target</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Reason / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalHistory && approvalHistory.length > 0 ? (
                approvalHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-805">{hist.item}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 bg-slate-50 border rounded text-[9px] font-semibold">
                        {hist.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        hist.decision === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {hist.decision}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-bold">{hist.date}</td>
                    <td className="py-3 px-3 font-semibold text-slate-500 italic max-w-xs truncate" title={hist.reason || '-'}>
                      {hist.reason || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-slate-400 italic">No decisions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
