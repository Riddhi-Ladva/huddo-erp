// src/state-manager/pages/Approvals.jsx
import { useState } from 'react';
import { 
  CheckSquare, Store, ShoppingBag, Clock, Check, X, History
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils';

export default function Approvals({ 
  pendingApprovals, 
  approvalHistory, 
  onApproveApproval, 
  onRejectApproval, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('All'); // All | Large Orders | Retailer Registration | Discounts | Other
  const [rejectionTexts, setRejectionTexts] = useState({}); // cmId/orderId -> string (for inline rejection textboxes)
  const [activeRejectId, setActiveRejectId] = useState(null); // ID of card with active inline reject textbox

  const totalPending = pendingApprovals.length;
  const orderApprovalsCount = pendingApprovals.filter(a => a.type === 'Large Order').length;
  const registrationApprovalsCount = pendingApprovals.filter(a => a.type === 'Retailer Registration').length;

  // Filter pending approvals
  const filteredApprovals = pendingApprovals.filter(app => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Large Orders') return app.type === 'Large Order';
    if (activeTab === 'Retailer Registration') return app.type === 'Retailer Registration';
    // No mock data for Discounts or Other but they are filters
    if (activeTab === 'Discounts') return app.type === 'Discount';
    return app.type === 'Other';
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Large Order':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Retailer Registration':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const handleInlineRejectConfirm = (id) => {
    const reason = rejectionTexts[id];
    if (!reason || !reason.trim()) {
      showToast("Please provide a rejection reason.", "error");
      return;
    }
    onRejectApproval(id, reason);
    setActiveRejectId(null);
    setRejectionTexts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast("Request rejected.", "error");
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">State Approval Workspace</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Review state-level exemptions, retail onboarding authorizations, and order value overruns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pending</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{totalPending}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Orders Awaiting</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{orderApprovalsCount}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registrations Awaiting</span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">{registrationApprovalsCount}</h3>
          </div>
        </div>

      </div>

      {/* Tabs / Filters */}
      <div className="overflow-x-auto select-none">
        <div className="flex border-b border-slate-200 min-w-max">
          {['All', 'Large Orders', 'Retailer Registration', 'Discounts', 'Other'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveRejectId(null);
                }}
                className={`py-3 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 ${
                  isActive 
                    ? 'border-orange-500 text-orange-600 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List view (Not table) */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Awaiting Action</h3>
        
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((app) => {
            const isRejecting = activeRejectId === app.id;
            return (
              <div 
                key={app.id} 
                className="bg-white border border-slate-200/60 hover:border-slate-300 rounded-2xl p-5 shadow-sm space-y-4 transition-all"
              >
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getTypeBadge(app.type)}`}>
                      {app.type}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getUrgencyBadge(app.urgency)}`}>
                      {app.urgency} Urgency
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{formatDate(app.date)}</span>
                </div>

                {/* Middle Description */}
                <div className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {app.type === 'Large Order' ? (
                    <div className="flex items-start gap-3">
                      <ShoppingBag className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-800 font-black">Large Order Verification Request ({app.orderId})</p>
                        <p className="text-slate-500 mt-1">
                          Retailer <strong>{app.retailer}</strong> in <strong>{app.city}</strong> requested shipping authorization for order amounting to <strong className="text-orange-600">{formatCurrency(app.amount)}</strong>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-800 font-black">Shop Registry Verification Request</p>
                        <p className="text-slate-500 mt-1">
                          Retailer <strong>{app.retailer}</strong> in <strong>{app.city}</strong> requires onboarding verification to receive promotional inventory and start purchase transactions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 font-bold">
                    Requested by: <span className="text-slate-600">{app.requestedBy}</span>
                  </span>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={() => {
                        onApproveApproval(app.id);
                        showToast("Request approved successfully!", "success");
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 flex items-center gap-1 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button 
                      onClick={() => {
                        if (isRejecting) {
                          setActiveRejectId(null);
                        } else {
                          setActiveRejectId(app.id);
                        }
                      }}
                      className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>

                {/* Rejection Flow Inline Input */}
                {isRejecting && (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 space-y-3 animate-slide-down">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-rose-800 uppercase tracking-wide">Rejection Reason (Required)</label>
                      <textarea
                        placeholder="Specify reason for reject..."
                        value={rejectionTexts[app.id] || ''}
                        onChange={(e) => setRejectionTexts({ ...rejectionTexts, [app.id]: e.target.value })}
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-rose-200 rounded-lg p-2 h-20 focus:outline-none focus:border-rose-300"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveRejectId(null)}
                        className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInlineRejectConfirm(app.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-sm text-center text-slate-400 font-semibold flex flex-col items-center justify-center">
            <CheckSquare className="w-12 h-12 text-slate-300 stroke-1 mb-2" />
            <span>No pending approvals under the {activeTab} filter!</span>
          </div>
        )}
      </div>

      {/* Approval History Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Approval Audit History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3">Resolution Date</th>
                <th className="py-2.5 px-3">Resolution Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalHistory.length > 0 ? (
                approvalHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">{hist.item}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getTypeBadge(hist.type)}`}>
                        {hist.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${
                        hist.decision === 'Approved' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                        {hist.decision}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-semibold">{formatDate(hist.date)}</td>
                    <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate" title={hist.reason || 'Approved'}>
                      {hist.reason || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400 italic">No decisions logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
