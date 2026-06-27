import React, { useState } from 'react';
import { 
  Search, Eye, Clock, Download, XCircle, AlertCircle, FileText, 
  MapPin, CheckCircle, RefreshCw, Calendar, ArrowRight, User
} from 'lucide-react';

import { mockOrders } from '../mockData/mockOrders';
import StatusBadge from '../components/StatusBadge';
import CustomModal from '../components/CustomModal';

export default function MyOrders({ showToast }) {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Date range filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected order for details view modal
  const [viewingOrder, setViewingOrder] = useState(null);

  const statuses = [
    'All', 'Draft', 'Submitted', 'Approved', 'Processing', 
    'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
  ];

  // Filtering criteria
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.orderStatus === selectedStatus;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && (new Date(order.date) >= new Date(startDate));
    }
    if (endDate) {
      matchesDate = matchesDate && (new Date(order.date) <= new Date(endDate));
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleCancelOrder = (orderId) => {
    // Confirm cancel
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: 'Cancelled',
          timeline: [
            ...o.timeline,
            { status: 'Cancelled', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), description: 'Order cancelled by Retailer' }
          ]
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    // Close active modal or update viewing state
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder(updatedOrders.find(o => o.id === orderId));
    }
    showToast(`Order ${orderId} has been successfully cancelled.`, "success");
  };

  const handleDownloadInvoice = (orderId) => {
    console.log(`[Invoice Download triggered for Order: ${orderId}]`);
    showToast(`Downloading invoice for ${orderId}...`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">My Footwear Orders</h1>
        <p className="text-xs text-slate-500 font-medium">Search, filter, and inspect payment UTRs or status progression for all your past store orders.</p>
      </div>

      {/* Filters & Control Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        
        {/* Row 1: Search & Date Pickers */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium text-slate-700"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto text-xs font-semibold text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-200 rounded px-2.5 py-1 focus:outline-none bg-white text-slate-700"
            />
            <span>to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-200 rounded px-2.5 py-1 focus:outline-none bg-white text-slate-700"
            />
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-[10px] text-rose-600 hover:text-rose-700 hover:underline font-bold"
              >
                Reset Dates
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3 scrollbar-none">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-colors shrink-0 ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'border border-slate-200 text-slate-500 bg-white hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-750">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Items Count</th>
                <th className="px-5 py-3">Total Amount</th>
                <th className="px-5 py-3">Payment Status</th>
                <th className="px-5 py-3">Order Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/40">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{order.id}</td>
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{order.date}</td>
                      <td className="px-5 py-3.5">{itemsCount} pairs</td>
                      <td className="px-5 py-3.5 font-extrabold text-slate-850">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          order.paymentStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          order.paymentStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.paymentStatus === 'Verified' ? 'bg-emerald-500' :
                            order.paymentStatus === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={order.orderStatus} /></td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-all"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <AlertCircle className="w-10 h-10 text-slate-300" />
                      <p className="text-slate-500 text-xs font-semibold">No orders found matching criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <CustomModal
          isOpen={!!viewingOrder}
          onClose={() => setViewingOrder(null)}
          title={`Order Summary details: ${viewingOrder.id}`}
          size="lg"
          confirmText="Download Invoice"
          onConfirm={() => handleDownloadInvoice(viewingOrder.id)}
        >
          <div className="space-y-6 text-xs font-semibold text-slate-700">
            
            {/* Header info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div><span className="text-slate-400 font-bold">Order Date</span><p className="font-extrabold text-slate-800 mt-0.5">{viewingOrder.date}</p></div>
              <div><span className="text-slate-400 font-bold">Payment Status</span><p className="font-extrabold text-slate-800 mt-0.5">{viewingOrder.paymentStatus}</p></div>
              <div><span className="text-slate-400 font-bold">Order Status</span><div className="mt-0.5"><StatusBadge status={viewingOrder.orderStatus} /></div></div>
              <div><span className="text-slate-400 font-bold">Total Bill</span><p className="font-extrabold text-slate-900 mt-0.5">₹{viewingOrder.totalAmount.toLocaleString('en-IN')}</p></div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purchased Footwear Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-4 py-2">Item Description</th>
                      <th className="px-4 py-2">Variant</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2.5 font-bold text-slate-900">{item.productName}</td>
                        <td className="px-4 py-2.5 text-slate-450 uppercase">{item.variant}</td>
                        <td className="px-4 py-2.5 text-center">{item.quantity} pairs</td>
                        <td className="px-4 py-2.5 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-slate-950">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Details (Screenshot + UTR) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transaction References</h4>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">UTR / TRANSACTION NUMBER</span>
                    <p className="font-mono font-extrabold text-slate-800 tracking-wide text-sm">{viewingOrder.utr || "N/A"}</p>
                  </div>
                  {viewingOrder.notes && (
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">ORDER NOTES</span>
                      <p className="text-slate-550 font-normal mt-0.5">{viewingOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Cancel action */}
                {['Draft', 'Submitted'].includes(viewingOrder.orderStatus) && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleCancelOrder(viewingOrder.id)}
                      className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-full justify-center"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Entire Order</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Uploaded Receipt Screenshot</h4>
                {viewingOrder.paymentScreenshot ? (
                  <div className="border border-slate-200 rounded-lg p-2 bg-white flex justify-center items-center">
                    <img 
                      src={viewingOrder.paymentScreenshot} 
                      alt="UTR Receipt Screenshot" 
                      className="max-h-40 object-contain rounded border border-slate-150"
                    />
                  </div>
                ) : (
                  <div className="border border-slate-200 border-dashed rounded-lg p-6 bg-slate-50 text-center text-slate-450 font-medium">
                    No payment receipt uploaded for draft.
                  </div>
                )}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-3.5 border-t border-slate-100 pt-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Clock className="w-4 h-4 text-slate-300" /> Progression Timeline</h4>
              
              <div className="relative pl-6 border-l border-slate-200 space-y-4 font-sans">
                {viewingOrder.timeline?.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle bullet */}
                    <span className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                      step.status === 'Cancelled' ? 'bg-rose-500' :
                      step.status === 'Delivered' ? 'bg-emerald-500' :
                      'bg-brand-orange'
                    }`}></span>
                    
                    <div className="text-xs">
                      <span className="text-[10px] text-slate-400 font-bold block">{step.timestamp}</span>
                      <span className="font-extrabold text-slate-800 font-display block mt-0.5">{step.status}</span>
                      <p className="text-slate-450 font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CustomModal>
      )}

    </div>
  );
}
