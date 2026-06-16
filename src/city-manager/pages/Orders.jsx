// src/city-manager/pages/Orders.jsx
import { useState } from 'react';
import { 
  ShoppingCart, Search, X, CheckSquare, Plus, FileText, AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../cityManagerUtils';

export default function Orders({ 
  orders, 
  retailers, 
  onApproveOrder, 
  onRejectOrder, 
  onPlaceOrder, 
  showToast,
  initialPlaceOrderOpen = false,
  initialBookingRetailerId = ''
}) {
  const [activeStatusTab, setActiveStatusTab] = useState('Pending Approval');
  const [searchQuery, setSearchQuery] = useState('');
  const [retailerFilter, setRetailerFilter] = useState('All');
  
  // Drawer & Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPlaceOrderModalOpen, setIsPlaceOrderModalOpen] = useState(initialPlaceOrderOpen);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  // Rejection Inline Form
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Booking Order States
  const [bookingRetailerId, setBookingRetailerId] = useState(initialBookingRetailerId || retailers[0]?.id || '');
  const [bookingItems, setBookingItems] = useState([
    { product: 'Huddo Sport X1', size: 8, color: 'Black', qty: 5, price: 2800 }
  ]);
  const [bookingUtr, setBookingUtr] = useState('');
  const [bookingFile, setBookingFile] = useState(null);

  const statusTabLabels = [
    { id: 'All', label: 'All', count: orders.length + 80 }, // Mock aggregate counts
    { id: 'Pending Approval', label: 'Pending Approval', count: orders.filter(o => o.status === 'Pending Approval').length },
    { id: 'Approved', label: 'Approved', count: orders.filter(o => o.status === 'Approved').length + 6 },
    { id: 'Processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length + 11 },
    { id: 'Packed', label: 'Packed', count: 5 },
    { id: 'Shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length + 6 },
    { id: 'Delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length + 47 },
    { id: 'Cancelled', label: 'Cancelled', count: 3 }
  ];

  const statusColors = {
    'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-100',
    Approved: 'bg-blue-50 text-blue-700 border-blue-100',
    Processing: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Packed: 'bg-purple-50 text-purple-700 border-purple-100',
    Shipped: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
    Returned: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  // Place Order handlers
  const handleAddItemRow = () => {
    setBookingItems(prev => [
      ...prev,
      { product: 'Huddo Sport X1', size: 9, color: 'Blue', qty: 1, price: 2800 }
    ]);
  };

  const handleRemoveItemRow = (idx) => {
    if (bookingItems.length === 1) return;
    setBookingItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const prices = {
      'Huddo Sport X1': 2800,
      'Huddo Classic W2': 1450,
      'Huddo Premium P1': 2750,
      'Huddo Kids K3': 950,
      'Huddo Formal F1': 1900,
      'Huddo Casual C2': 1200
    };

    setBookingItems(prev => prev.map((item, i) => {
      if (i === idx) {
        const updated = { ...item, [field]: value };
        if (field === 'product') {
          updated.price = prices[value] || 1500;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return bookingItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!bookingUtr.trim() || bookingUtr.length < 8) {
      showToast('Please enter a valid payment UTR number.', 'error');
      return;
    }
    const ret = retailers.find(r => r.id === bookingRetailerId);
    if (!ret) return;

    const newOrder = {
      id: `ORD-2026-0${Math.floor(545 + Math.random() * 50)}`, // random ORD id
      retailerId: bookingRetailerId,
      retailerName: ret.businessName,
      amount: calculateTotal(),
      status: 'Pending Approval',
      paymentStatus: 'Paid',
      utr: bookingUtr.toUpperCase(),
      orderDate: new Date().toISOString().split('T')[0],
      items: bookingItems,
      requiresCityApproval: true,
      paymentScreenshot: bookingFile
    };

    onPlaceOrder(newOrder);
    setIsPlaceOrderModalOpen(false);
    showToast(`Order booked successfully on behalf of ${ret.businessName}!`, 'success');
    
    // reset form
    setBookingItems([{ product: 'Huddo Sport X1', size: 8, color: 'Black', qty: 5, price: 2800 }]);
    setBookingUtr('');
    setBookingFile(null);
  };

  // Approval actions
  const handleApproveConfirmSubmit = () => {
    onApproveOrder(selectedOrder.id);
    setIsApproveConfirmOpen(false);
    setSelectedOrder(null);
    showToast(`Order ${selectedOrder.id} has been approved.`, 'success');
  };

  const handleRejectSubmit = () => {
    if (rejectReason.trim().length < 20) {
      showToast('Rejection reason must be at least 20 characters.', 'error');
      return;
    }
    onRejectOrder(selectedOrder.id, rejectReason);
    setIsRejecting(false);
    setRejectReason('');
    setSelectedOrder(null);
    showToast(`Order ${selectedOrder.id} has been rejected.`, 'info');
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (activeStatusTab !== 'All') {
      if (o.status !== activeStatusTab) return false;
    }
    if (retailerFilter !== 'All') {
      if (o.retailerId !== retailerFilter) return false;
    }
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Orders — Ahmedabad</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Manage purchase invoices, payment receipts, and dispatch flows</p>
        </div>
        
        <button 
          onClick={() => setIsPlaceOrderModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Place Order for Retailer
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex bg-slate-100 border border-slate-200/50 rounded-xl p-0.5 self-start overflow-x-auto max-w-full select-none">
        {statusTabLabels.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 whitespace-nowrap ${
              activeStatusTab === tab.id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Warning Alert Banner */}
      {activeStatusTab === 'Pending Approval' && orders.filter(o => o.status === 'Pending Approval').length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-xs font-bold text-amber-800 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>You have {orders.filter(o => o.status === 'Pending Approval').length} orders awaiting your approval. Review invoice details below.</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. ORD-2026-0541)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold w-full bg-white text-slate-700 focus:outline-none focus:border-slate-350"
            />
          </div>

          <select
            value={retailerFilter}
            onChange={(e) => setRetailerFilter(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="All">All Retailers</option>
            {retailers.map(r => (
              <option key={r.id} value={r.id}>{r.businessName}</option>
            ))}
          </select>
        </div>

        <span className="text-[10px] text-slate-400 font-bold uppercase">Scoped Territory: Ahmedabad</span>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-medium text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
              <th className="py-2.5 px-4">Order ID</th>
              <th className="py-2.5 px-4">Retailer</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4 text-center">Items</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
              <th className="py-2.5 px-4">UTR Number</th>
              <th className="py-2.5 px-4">Payment</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => {
                const totalItems = o.items.reduce((sum, i) => sum + i.qty, 0);
                return (
                  <tr key={o.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{o.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{o.retailerName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-450">{formatDate(o.orderDate)}</td>
                    <td className="py-3 px-4 text-center font-semibold">{totalItems}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-800">{formatCurrency(o.amount)}</td>
                    <td className="py-3 px-4 font-bold text-slate-500 font-mono">{o.utr || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColors[o.status] || 'bg-slate-50 text-slate-500'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-450 italic">No orders found mapping active tab parameters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAIL SIDE DRAWER (480px) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)} />
          <div className="bg-white w-full max-w-[480px] h-full shadow-2xl relative z-10 flex flex-col justify-between animate-slide-in-right border-l border-slate-200">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">{selectedOrder.id}</h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">Retailer: {selectedOrder.retailerName}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Order Date */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Ordered Date: {formatDate(selectedOrder.orderDate)}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Products Invoice</span>
                <div className="border border-slate-100 rounded-xl overflow-hidden text-[11px] font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[9px] text-slate-400 font-bold uppercase">
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3 text-center">Specs</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Price</th>
                        <th className="py-2 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-bold text-slate-800">{it.product}</td>
                          <td className="py-2 px-3 text-center text-slate-400">Sz {it.size} / {it.color}</td>
                          <td className="py-2 px-3 text-center font-bold">{it.qty}</td>
                          <td className="py-2 px-3 text-right">{formatCurrency(it.price)}</td>
                          <td className="py-2 px-3 text-right font-black text-slate-800">{formatCurrency(it.qty * it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end text-xs font-black text-slate-800 pr-3 pt-2">
                  <span>Grand Total: {formatCurrency(selectedOrder.amount)}</span>
                </div>
              </div>

              {/* Payment Receipt */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Payment Verification</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 text-xs font-semibold text-slate-700 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Transaction UTR</span>
                    <span className="font-mono font-bold text-slate-850">{selectedOrder.utr || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Payment Status</span>
                    <span className="text-emerald-700 font-bold">{selectedOrder.paymentStatus}</span>
                  </div>
                  <div className="col-span-2 pt-2">
                    <span className="text-[9px] text-slate-400 block uppercase mb-1">Receipt Attachment</span>
                    <div className="h-28 bg-slate-200 rounded-lg flex items-center justify-center text-slate-450 border border-slate-300 relative overflow-hidden">
                      <FileText className="w-8 h-8 stroke-1 mb-1.5" />
                      <span className="absolute bottom-2 text-[8px] font-bold uppercase">UTR-RECEIPT-IMAGE.jpg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval chain status */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-50 pb-1">Hierarchy Approval Chain</span>
                <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-450 text-center uppercase tracking-wider">
                  
                  <div className="space-y-1">
                    <div className={`w-3.5 h-3.5 rounded-full mx-auto flex items-center justify-center text-[7px] text-white ${
                      selectedOrder.status === 'Pending Approval' && selectedOrder.requiresCityApproval ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                    }`}>
                      {selectedOrder.status !== 'Pending Approval' ? '✓' : '●'}
                    </div>
                    <span className="block text-slate-800">City Mgr</span>
                    <span className="text-[8px] text-slate-400">{selectedOrder.status !== 'Pending Approval' ? 'Approved' : 'Pending'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-3.5 h-3.5 rounded-full mx-auto ${
                      selectedOrder.status === 'Pending Approval' ? 'bg-slate-200' : 'bg-emerald-500 text-white flex items-center justify-center text-[7px]'
                    }`}>
                      {selectedOrder.status !== 'Pending Approval' ? '✓' : '○'}
                    </div>
                    <span>State Mgr</span>
                    <span className="text-[8px] text-slate-400">Waiting</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-3.5 h-3.5 rounded-full mx-auto bg-slate-200"></div>
                    <span>Country Mgr</span>
                    <span className="text-[8px] text-slate-400">Waiting</span>
                  </div>

                  <div className="space-y-1">
                    <div className="w-3.5 h-3.5 rounded-full mx-auto bg-slate-200"></div>
                    <span>Admin</span>
                    <span className="text-[8px] text-slate-400">Waiting</span>
                  </div>

                </div>
              </div>

              {/* Rejection Sequence */}
              {isRejecting && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl space-y-3 animate-fade-in">
                  <span className="text-[9px] font-black text-rose-800 uppercase block">Rejection Remark Details</span>
                  <textarea
                    placeholder="Provide detailed rejection notes (minimum 20 characters)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="3"
                    className="w-full p-2 border border-rose-200 rounded-xl text-xs bg-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setIsRejecting(false)}
                      className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 rounded-lg text-slate-700 bg-white"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRejectSubmit}
                      className="px-2.5 py-1 text-[10px] font-bold bg-rose-650 text-white rounded-lg"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              {selectedOrder.status === 'Pending Approval' && selectedOrder.requiresCityApproval && !isRejecting ? (
                <>
                  <button 
                    onClick={() => setIsRejecting(true)}
                    className="w-1/2 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Reject Order
                  </button>
                  <button 
                    onClick={() => setIsApproveConfirmOpen(true)}
                    className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Approve Order
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all"
                >
                  Close Drawer
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* APPROVAL CONFIRMATION DIALOG */}
      {isApproveConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Approve Invoice</h3>
            </div>
            
            <p className="text-xs font-semibold text-slate-550 leading-relaxed">
              Are you sure you want to approve order <span className="font-bold text-slate-800">{selectedOrder?.id}</span> for <span className="font-black text-slate-800">{formatCurrency(selectedOrder?.amount)}</span>? This will route the approval to the State Manager queue.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setIsApproveConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-700 bg-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleApproveConfirmSubmit}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLACE ORDER FOR RETAILER MODAL */}
      {isPlaceOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsPlaceOrderModalOpen(false)} />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-150 overflow-hidden flex flex-col relative z-10 animate-scale-up">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Book Order (On Behalf of Retailer)</h3>
              <button onClick={() => setIsPlaceOrderModalOpen(false)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-650 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePlaceOrderSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
              
              {/* Select Retailer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-550 block">Select Retailer*</label>
                  <select
                    value={bookingRetailerId}
                    onChange={(e) => setBookingRetailerId(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold focus:outline-none focus:border-slate-350"
                  >
                    {retailers.filter(r => r.status === 'Active').map(r => (
                      <option key={r.id} value={r.id}>{r.businessName} (Ahmedabad)</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-550 block">Transaction Payment UTR Number*</label>
                  <input
                    type="text"
                    placeholder="Enter UTR transaction receipt number"
                    value={bookingUtr}
                    onChange={(e) => setBookingUtr(e.target.value)}
                    className="w-full p-2 border border-slate-250 rounded-xl bg-white text-slate-800 font-bold focus:outline-none focus:border-slate-350"
                    maxLength={16}
                    required
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add Products</span>
                  <button 
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {bookingItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50/50 p-2 border border-slate-100 rounded-xl text-xs font-semibold">
                      
                      <div className="col-span-4 space-y-1">
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(idx, 'product', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none text-[11px]"
                        >
                          <option value="Huddo Sport X1">Huddo Sport X1 (₹2,800)</option>
                          <option value="Huddo Classic W2">Huddo Classic W2 (₹1,450)</option>
                          <option value="Huddo Premium P1">Huddo Premium P1 (₹2,750)</option>
                          <option value="Huddo Kids K3">Huddo Kids K3 (₹950)</option>
                          <option value="Huddo Formal F1">Huddo Formal F1 (₹1,900)</option>
                          <option value="Huddo Casual C2">Huddo Casual C2 (₹1,200)</option>
                        </select>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <select
                          value={item.size}
                          onChange={(e) => handleItemChange(idx, 'size', Number(e.target.value))}
                          className="w-full p-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none text-center text-[11px]"
                        >
                          {[6, 7, 8, 9, 10, 11].map(s => (
                            <option key={s} value={s}>Sz {s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <select
                          value={item.color}
                          onChange={(e) => handleItemChange(idx, 'color', e.target.value)}
                          className="w-full p-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none text-[11px]"
                        >
                          {['Black', 'White', 'Blue', 'Grey', 'Red', 'Pink', 'Brown', 'Beige'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', Number(e.target.value))}
                          className="w-full p-1.5 border border-slate-250 rounded-lg text-center bg-white text-slate-800 text-[11px] focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2 text-right flex items-center justify-end gap-1.5">
                        <span className="font-black text-slate-800 text-[11px]">{formatCurrency(item.qty * item.price)}</span>
                        {bookingItems.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold pt-2 border-t border-slate-50 items-center">
                <div className="space-y-1">
                  <label className="text-slate-550 block">Payment Screenshot (Optional)</label>
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-350 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-600 transition-all w-48">
                    <ShoppingCart className="w-4 h-4 text-slate-400" />
                    <span>{bookingFile ? 'Uploaded ✓' : 'Upload Receipt'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBookingFile(e.target.files[0]?.name || null)}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Total */}
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Total Order Value</span>
                  <span className="text-lg font-black text-slate-800">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlaceOrderModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-650 hover:bg-orange-750 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all cursor-pointer"
                >
                  Submit Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
