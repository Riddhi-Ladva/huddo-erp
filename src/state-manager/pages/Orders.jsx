// src/state-manager/pages/Orders.jsx
import { useState } from 'react';
import { 
  ShoppingCart, Search, SlidersHorizontal, ArrowDownToLine, X, 
  MapPin, FileText, CheckCircle, Clock, ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils';

export default function Orders({ 
  orders, 
  cityManagers, 
  onApproveOrder, 
  onRejectOrder, 
  showToast 
}) {
  const [activeTab, setActiveTab] = useState('All'); // All | Pending Approval | Approved | Processing | Packed | Shipped | Delivered | Cancelled | Returned
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  
  // Drawer & modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getCityManagerName = (cityName) => {
    return cityManagers.find(cm => cm.city.toLowerCase() === cityName.toLowerCase())?.name || "Not Assigned";
  };

  const getOrderStatusCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.retailerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = 
      cityFilter === 'All Cities' ||
      o.city.toLowerCase() === cityFilter.toLowerCase();

    const matchesStatus = 
      activeTab === 'All' ||
      o.status === activeTab;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Approved':
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Packed':
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled':
      case 'Returned':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const handleApproveConfirm = () => {
    if (!selectedOrder) return;
    onApproveOrder(selectedOrder.id);
    setIsApproveModalOpen(false);
    setSelectedOrder(prev => prev ? { ...prev, status: 'Approved', requiresStateApproval: false } : null);
    showToast(`Order ${selectedOrder.id} has been approved.`, "success");
  };

  const handleRejectConfirm = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!rejectReason.trim()) {
      showToast("Please provide a rejection reason.", "error");
      return;
    }
    onRejectOrder(selectedOrder.id, rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason('');
    setSelectedOrder(prev => prev ? { ...prev, status: 'Cancelled', requiresStateApproval: false } : null);
    showToast(`Order ${selectedOrder.id} has been rejected.`, "error");
  };

  // Progress Bar configuration
  const ORDER_STAGES = ["Pending Approval", "Approved", "Processing", "Packed", "Shipped", "Delivered"];
  
  const getStageIndex = (status) => {
    if (status === 'Cancelled' || status === 'Returned') return -1;
    return ORDER_STAGES.indexOf(status);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Orders Directory</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Review state purchases, validate transaction UTR credentials, and authorize large orders</p>
        </div>
        <button 
          onClick={() => showToast("Exporting orders ledger...", "success")}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 bg-white transition-all shadow-xs self-start sm:self-center"
        >
          <ArrowDownToLine className="w-4 h-4" /> Export Ledger
        </button>
      </div>

      {/* Tabs Row */}
      <div className="overflow-x-auto select-none">
        <div className="flex border-b border-slate-200 min-w-max">
          {['All', 'Pending Approval', 'Approved', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((tab) => {
            const count = getOrderStatusCount(tab);
            const isActive = activeTab === tab;
            const isHighlight = tab === 'Pending Approval' && count > 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 border-b-2 ${
                  isActive 
                    ? 'border-orange-500 text-orange-600 font-black' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-bold ${
                  isActive 
                    ? 'bg-orange-100 text-orange-700' 
                    : isHighlight 
                    ? 'bg-orange-500 text-white font-extrabold animate-pulse'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order ID, Retailer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold w-full text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-slate-100/30 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-center">
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

      {/* Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold tracking-wider uppercase bg-slate-50/20">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Retailer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">UTR Number</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium text-slate-600 divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-800">{o.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{o.retailerName}</td>
                    <td className="py-3 px-4">{o.city}</td>
                    <td className="py-3 px-4 text-center font-bold">{o.items}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{formatCurrency(o.amount)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold rounded-full">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">{o.utr || '-'}</td>
                    <td className="py-3 px-4">{formatDate(o.orderDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getStatusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-slate-400 font-semibold">
                    No orders match the selected parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer: Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-45 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300">
          
          <div className="flex-1" onClick={() => setSelectedOrder(null)}></div>
          
          <div className="w-full max-w-lg bg-white h-screen shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-left">
            
            <div className="space-y-6 text-xs font-semibold text-slate-600">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Order Verification Dossier</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Identity info */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-orange-500" /> {selectedOrder.id}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">Placed on {formatDate(selectedOrder.orderDate)}</p>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full border ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Entity Matrix */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20 grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">Retailer</span>
                  <span className="text-slate-800 font-bold block">{selectedOrder.retailerName}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">Location City</span>
                  <span className="text-slate-800 font-bold block flex items-center gap-0.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" /> {selectedOrder.city}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">Items Quantity</span>
                  <span className="text-slate-800 font-black block">{selectedOrder.items} Cartons</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">City Manager Lead</span>
                  <span className="text-slate-800 font-bold block">{getCityManagerName(selectedOrder.city)}</span>
                </div>
              </div>

              {/* Invoice calculation stats */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">Aggregate Value</span>
                  <p className="text-lg font-black text-slate-800">{formatCurrency(selectedOrder.amount)}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment Cleared
                  </span>
                </div>
              </div>

              {/* UTR Verification details */}
              <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Financial Settlement</h5>
                <div className="flex items-center justify-between text-xs">
                  <span>UTR Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedOrder.utr}</span>
                </div>
                {/* Transaction receipt screenshot placeholder */}
                <div className="border border-slate-200 border-dashed rounded-xl p-3 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 text-[9px] font-bold">
                  <FileText className="w-6 h-6 text-slate-300 stroke-1 mb-1" />
                  <span>UTR_RECEIPT_CAPTURE.pdf</span>
                </div>
              </div>

              {/* Order Status Progress Bar (Horizontal Timeline) */}
              {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Returned' && (
                <div className="space-y-3.5">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Fulfillment Progress</h5>
                  <div className="relative pt-2">
                    <div className="absolute top-4 left-4 right-4 bg-slate-100 h-1 z-0">
                      <div 
                        className="bg-emerald-500 h-1 transition-all duration-300"
                        style={{ width: `${(getStageIndex(selectedOrder.status) / (ORDER_STAGES.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="relative flex justify-between z-10">
                      {ORDER_STAGES.map((stage, i) => {
                        const isDone = i <= getStageIndex(selectedOrder.status);
                        const isCurrent = i === getStageIndex(selectedOrder.status);
                        return (
                          <div key={stage} className="flex flex-col items-center gap-1.5 w-12 text-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                              isCurrent 
                                ? 'bg-orange-500 border-orange-600 text-white font-extrabold scale-110 shadow-md' 
                                : isDone 
                                ? 'bg-emerald-500 border-emerald-600 text-white' 
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}>
                              {isDone ? '✓' : i + 1}
                            </div>
                            <span className={`text-[7px] font-bold tracking-tight uppercase leading-none max-w-full ${
                              isCurrent ? 'text-orange-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                            }`}>{stage.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Approval workflow timeline */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Approval Authority Matrix</h5>
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20 space-y-3">
                  
                  {/* City Manager step */}
                  <div className="flex items-start gap-2 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-800 font-bold">City Manager Validation</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Approved by {getCityManagerName(selectedOrder.city)} — Timestamp: 2026-06-13 11:20</p>
                    </div>
                  </div>

                  {/* State Manager step */}
                  <div className="flex items-start gap-2 text-xs font-semibold">
                    {selectedOrder.status === 'Pending Approval' ? (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-slate-800 font-bold">State Manager Verification</p>
                      {selectedOrder.status === 'Pending Approval' ? (
                        <p className="text-[10px] text-amber-600 mt-0.5 animate-pulse">Awaiting Rajesh Mehta's authorization (GJ scope)</p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5">Authorized by Rajesh Mehta — Timestamp: Just now</p>
                      )}
                    </div>
                  </div>

                  {/* Country Manager step */}
                  <div className="flex items-start gap-2 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-400">Country Manager Escrow</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Pending upper hierarchy validation</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-100 pt-4 mt-6 flex gap-3">
              {selectedOrder.requiresStateApproval && selectedOrder.status === 'Pending Approval' ? (
                <>
                  <button 
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-all"
                  >
                    Reject Order
                  </button>
                  <button 
                    onClick={() => setIsApproveModalOpen(true)}
                    className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all"
                  >
                    Approve Order
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Dismiss Drawer
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal: Approve */}
      {isApproveModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">Confirm Order Approval</h3>
              <button 
                onClick={() => setIsApproveModalOpen(false)} 
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs font-medium text-slate-600 leading-relaxed space-y-2">
              <p>Are you sure you want to approve this order for <strong>{selectedOrder.retailerName}</strong>?</p>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 font-bold">
                <p>Order ID: {selectedOrder.id}</p>
                <p>Items Count: {selectedOrder.items} Cartons</p>
                <p>Order Amount: <span className="text-orange-600">{formatCurrency(selectedOrder.amount)}</span></p>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleApproveConfirm}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-all"
              >
                Yes, Approve Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reject */}
      {isRejectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <form 
            onSubmit={handleRejectConfirm}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">Reject Order Request</h3>
              <button 
                type="button"
                onClick={() => setIsRejectModalOpen(false)} 
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 text-xs font-medium text-slate-600 leading-relaxed space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1 text-rose-950 font-bold">
                <p>Order ID: {selectedOrder.id}</p>
                <p>Retailer: {selectedOrder.retailerName}</p>
                <p>Value: {formatCurrency(selectedOrder.amount)}</p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 block uppercase text-[10px] tracking-wide font-bold">Rejection Reason (Required)</label>
                <textarea 
                  placeholder="Explain why this order was rejected (e.g. outstanding payments, pricing error, inventory shortage)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="p-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 text-xs text-slate-800 h-24"
                  required
                />
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-100 transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
