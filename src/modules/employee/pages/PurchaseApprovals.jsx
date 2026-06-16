import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, ShoppingBag, ClipboardList, 
  HelpCircle, SlidersHorizontal, MessageSquare
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function PurchaseApprovals({ showToast }) {
  // Pending PO approvals
  const [approvals, setApprovals] = useState([
    { poNumber: "PO-2026-006", vendorName: "Apex Packaging Solutions", totalAmount: 30000, requestedBy: "Rohit Sharma", date: "2026-06-14", items: "Shipping Cartons (L) x 600" }
  ]);

  // Historical review log
  const [history, setHistory] = useState([
    { poNumber: "PO-2026-001", vendorName: "Supreme Rubber Products", totalAmount: 120000, requestedBy: "Karan Johar", date: "2026-06-01", status: "Approved", notes: "Approved for Q3 rubber outsoles production." },
    { poNumber: "PO-2026-008", vendorName: "Supreme Rubber Products", totalAmount: 40000, requestedBy: "Karan Johar", date: "2026-06-10", status: "Rejected", notes: "Order duplicates size requirements. Rejected." }
  ]);

  const [activeTab, setActiveTab] = useState("pending"); // pending | history
  const [selectedPO, setSelectedPO] = useState(null);
  const [approvalNote, setApprovalNote] = useState("");

  const handleAction = (poNo, isApprove) => {
    const target = approvals.find(p => p.poNumber === poNo);
    const newRecord = {
      ...target,
      status: isApprove ? "Approved" : "Rejected",
      notes: approvalNote || (isApprove ? "Approved" : "Rejected")
    };

    setHistory([newRecord, ...history]);
    setApprovals(prev => prev.filter(p => p.poNumber !== poNo));
    showToast(`Purchase Order ${poNo} has been successfully ${isApprove ? "Approved" : "Rejected"}.`, "success");
    setSelectedPO(null);
    setApprovalNote("");
  };

  const pendingColumns = [
    { header: "PO Number", accessor: "poNumber", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Supplier / Vendor", accessor: "vendorName", render: (val) => <span className="font-bold text-slate-700">{val}</span> },
    { header: "Total Value", accessor: "totalAmount", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Requested By", accessor: "requestedBy" },
    { header: "Items Summary", accessor: "items" },
    { header: "Date Raised", accessor: "date" },
    { 
      header: "Actions", 
      accessor: "poNumber", 
      sortable: false, 
      render: (val, row) => (
        <button 
          onClick={() => setSelectedPO(row)}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-brand-orange bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors cursor-pointer"
        >
          <span>Appraise PO</span>
        </button>
      )
    }
  ];

  const historyColumns = [
    { header: "PO Number", accessor: "poNumber", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Supplier / Vendor", accessor: "vendorName", render: (val) => <span className="font-bold text-slate-755">{val}</span> },
    { header: "Total Value", accessor: "totalAmount", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Review notes", accessor: "notes", render: (val) => <span className="truncate max-w-[150px] block" title={val}>{val}</span> },
    { header: "Decision", accessor: "status", render: (val) => <StatusBadge status={val} /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top dashboard control headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">PO approvals queue</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Review raw materials purchase orders raised by procurement officers.</p>
        </div>
      </div>

      {/* Sub tabs selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pending' ? 'border-brand-orange text-brand-orange bg-orange-50/10' : 'border-transparent text-slate-500 hover:text-slate-750'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Pending Approvals ({approvals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history' ? 'border-brand-orange text-brand-orange bg-orange-50/10' : 'border-transparent text-slate-500 hover:text-slate-750'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Review History Logs ({history.length})</span>
        </button>
      </div>

      {/* Roster list table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        {activeTab === 'pending' ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Purchase orders pending review</span>
            </div>

            <CustomDataTable 
              columns={pendingColumns}
              data={approvals}
              searchKeys={["poNumber", "vendorName", "requestedBy"]}
              searchPlaceholder="Search approvals database..."
              emptyStateText="No pending purchase orders to approve."
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Historical decision logs</span>
            </div>

            <CustomDataTable 
              columns={historyColumns}
              data={history}
              searchKeys={["poNumber", "vendorName", "notes"]}
              searchPlaceholder="Search historical decision logs..."
            />
          </>
        )}
      </div>

      {/* Appraisal form Modal Dialog */}
      {selectedPO && (
        <CustomModal
          isOpen={selectedPO !== null}
          onClose={() => setSelectedPO(null)}
          title={`Appraise Purchase Order: ${selectedPO.poNumber}`}
          confirmText="Approve Order"
          onConfirm={() => handleAction(selectedPO.poNumber, true)}
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-655">
              <div>
                <span>Supplier / Vendor</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedPO.vendorName}</p>
              </div>
              <div>
                <span>Total Outlay</span>
                <p className="font-extrabold text-brand-orange mt-0.5">₹{selectedPO.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <span>Line Items summary</span>
                <p className="font-bold text-slate-700 mt-0.5">{selectedPO.items}</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Approval Notes / Remarks *</label>
              <textarea 
                rows="2"
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Include explanation or audit notes for this PO decision..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleAction(selectedPO.poNumber, false)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
              >
                Reject Purchase Order
              </button>
            </div>
          </div>
        </CustomModal>
      )}

    </div>
  );
}
