import React, { useState } from 'react';
import { CheckSquare, CheckCircle, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, Settings, FileText } from 'lucide-react';
import { initialApprovals, initialWorkflowConfig } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function Approvals({ showToast }) {
  const [activeTab, setActiveTab] = useState('pending'); // pending | config | history
  const [approvals, setApprovals] = useState(initialApprovals);
  const [workflowConfig, setWorkflowConfig] = useState(initialWorkflowConfig);
  const [pendingFilter, setPendingFilter] = useState('All'); // request type filter

  // Comment Modal state
  const [selectedReq, setSelectedReq] = useState(null);
  const [reqAction, setReqAction] = useState('approve'); // approve | reject
  const [commentVal, setCommentVal] = useState('');

  const handleActionClick = (req, action) => {
    setSelectedReq(req);
    setReqAction(action);
    setCommentVal('');
  };

  const handleConfirmActionSubmit = () => {
    const isApprove = reqAction === 'approve';
    setApprovals(approvals.map(req => {
      if (req.id === selectedReq.id) {
        showToast(
          `Request ${selectedReq.id} has been ${isApprove ? 'Approved' : 'Rejected'}.`,
          isApprove ? "success" : "error"
        );
        return {
          ...req,
          status: isApprove ? 'Approved' : 'Rejected',
          comment: commentVal || (isApprove ? 'Approved by Admin' : 'Rejected by Admin')
        };
      }
      return req;
    }));
    setSelectedReq(null);
  };

  const handleToggleWorkflowLevel = (moduleKey, levelKey) => {
    setWorkflowConfig({
      ...workflowConfig,
      [moduleKey]: {
        ...workflowConfig[moduleKey],
        [levelKey]: !workflowConfig[moduleKey][levelKey]
      }
    });
    showToast(`Toggled ${levelKey.toUpperCase()} Manager approval step in ${moduleKey} routing rules.`, "success");
  };

  // Filter queues
  const pendingRequests = approvals.filter(req => {
    const isPending = req.status === 'Pending';
    const matchesFilter = pendingFilter === 'All' || req.type === pendingFilter;
    return isPending && matchesFilter;
  });

  const historyRequests = approvals.filter(req => req.status !== 'Pending');

  const pendingColumns = [
    { header: "Request ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono text-[13px]">{val}</span> },
    { header: "Requester / Outlet", accessor: "requester", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Type Category", accessor: "type", render: (val) => <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">{val}</span> },
    { header: "Details Summary", accessor: "details", render: (val) => <span className="text-xs text-slate-500 font-semibold">{val}</span> },
    { header: "Submitted Date", accessor: "date" },
    { header: "Action Options", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button 
          onClick={() => handleActionClick(row, 'approve')} 
          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-0.5"
        >
          <CheckCircle className="w-3.5 h-3.5" /> Approve
        </button>
        <button 
          onClick={() => handleActionClick(row, 'reject')} 
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold flex items-center gap-0.5"
        >
          <XCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    )}
  ];

  const historyColumns = [
    { header: "Request ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono text-[13px]">{val}</span> },
    { header: "Requester", accessor: "requester", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Type Category", accessor: "type" },
    { header: "Details Summary", accessor: "details" },
    { header: "Action Timestamp", accessor: "date" },
    { header: "Status Output", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
        {val}
      </span>
    )},
    { header: "Admin Remarks / Comments", accessor: "comment" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Approval Workflow System</h1>
          <p className="text-sm text-slate-500">Audit system requests pipelines, verify credit override waivers, and adjust automated approval flows.</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Pending Inbox ({pendingRequests.length})
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'config' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Workflow Configuration Panel
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'history' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Approval History Logs
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Quick Filters Row */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex gap-2 overflow-x-auto">
            {['All', 'Retailer Registration', 'Large Orders', 'Discounts', 'Commission Changes'].map(f => (
              <button
                key={f}
                onClick={() => setPendingFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-all ${
                  pendingFilter === f 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <DataTable 
            columns={pendingColumns} 
            data={pendingRequests} 
            searchKeys={["id", "requester", "details"]}
            searchPlaceholder="Search pending alerts..."
          />
        </div>
      )}

      {activeTab === 'history' && (
        <DataTable 
          columns={historyColumns} 
          data={historyRequests} 
          searchKeys={["id", "requester", "details", "comment"]}
          searchPlaceholder="Search historical approvals..."
        />
      )}

      {activeTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Approval Path Routing Engine</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Toggle checking levels per request type. Admin review is permanently mapped as the final mandatory gateway across all operations.</p>
          </div>

          <div className="space-y-6">
            {/* Orders Workflow */}
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-slate-800 font-display">Pipeline A: Wholesale Orders Approvals</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {['city', 'state', 'country'].map(level => {
                  const isEnabled = workflowConfig.orders[level];
                  return (
                    <div key={level} className="flex justify-between items-center p-3 bg-white border border-slate-200/60 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 capitalize">{level} Manager Check</span>
                      <button 
                        onClick={() => handleToggleWorkflowLevel('orders', level)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${isEnabled ? 'bg-brand-orange' : 'bg-slate-300'}`}
                      >
                        <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${isEnabled ? 'translate-x-5' : ''}`}></span>
                      </button>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl">
                  <span className="text-xs font-bold text-slate-300 uppercase">Corporate Admin</span>
                  <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded font-bold uppercase">Locked</span>
                </div>
              </div>
            </div>

            {/* Retailer Onboarding Workflow */}
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-slate-800 font-display">Pipeline B: Retailer Shop Registration Approvals</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {['city', 'state', 'country'].map(level => {
                  const isEnabled = workflowConfig.retailers[level];
                  return (
                    <div key={level} className="flex justify-between items-center p-3 bg-white border border-slate-200/60 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 capitalize">{level} Manager Check</span>
                      <button 
                        onClick={() => handleToggleWorkflowLevel('retailers', level)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${isEnabled ? 'bg-brand-orange' : 'bg-slate-300'}`}
                      >
                        <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${isEnabled ? 'translate-x-5' : ''}`}></span>
                      </button>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-xl">
                  <span className="text-xs font-bold text-slate-300 uppercase">Corporate Admin</span>
                  <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded font-bold uppercase">Locked</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Comment overlay modal */}
      {selectedReq && (
        <Modal
          isOpen={selectedReq !== null}
          onClose={() => setSelectedReq(null)}
          title={`${reqAction === 'approve' ? 'Approve' : 'Reject'} Request Alert`}
          onConfirm={handleConfirmActionSubmit}
          isDestructive={reqAction === 'reject'}
        >
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-1 text-xs">
              <span className="text-slate-400 font-semibold uppercase">Request Details</span>
              <p className="font-bold text-slate-800 text-sm font-display">{selectedReq.requester}</p>
              <p className="text-slate-500 font-medium">{selectedReq.details}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Authorization Comments / Remarks</label>
              <textarea 
                rows="3" 
                placeholder="Enter audit statement or review comment..." 
                value={commentVal}
                onChange={(e) => setCommentVal(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
