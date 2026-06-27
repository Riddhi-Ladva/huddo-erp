import React, { useState } from 'react';
import { 
  FileText, Landmark, Clock, Download, Eye, AlertTriangle, AlertCircle, 
  CheckCircle, ArrowRight, ShieldCheck, Printer, Calendar
} from 'lucide-react';

import { mockInvoices } from '../mockData/mockInvoices';
import { mockOrders } from '../mockData/mockOrders';
import { mockRetailer } from '../mockData/mockRetailer';
import StatusBadge from '../components/StatusBadge';
import CustomModal from '../components/CustomModal';

export default function BillingPayments({ showToast }) {
  const [activeTab, setActiveTab] = useState('Invoices'); // Invoices | Payments | Outstanding
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Outstanding amount calculation
  const outstandingInvoices = mockInvoices.filter(inv => 
    inv.status === 'Pending' || inv.status === 'Overdue'
  );
  
  const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = outstandingInvoices.filter(inv => inv.status === 'Overdue').length;

  // Extract payment history list from mockOrders
  // Only orders that have UTRs are submitted payments
  const paymentHistoryList = mockOrders
    .filter(order => order.utr)
    .map(order => ({
      date: order.date,
      utr: order.utr,
      amount: order.totalAmount,
      orderId: order.id,
      status: order.paymentStatus // Verified / Pending / Rejected
    }));

  const handleDownloadInvoice = (invNum) => {
    console.log(`[Invoice Download Triggered: ${invNum}]`);
    showToast(`Downloading invoice ${invNum}...`, "success");
  };

  const handlePrintMock = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-display">Billing & Payments</h1>
        <p className="text-xs text-slate-500 font-medium font-sans">Track invoice records, outstanding balances, and check verification statuses of bank UTR payments.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 pt-1 rounded-xl shadow-xs border overflow-x-auto whitespace-nowrap scrollbar-none">
        {['Invoices', 'Payment History', 'Outstanding Balance'].map(tab => {
          let badge = null;
          if (tab === 'Outstanding Balance' && outstandingInvoices.length > 0) {
            badge = (
              <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                overdueCount > 0 ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-850'
              }`}>
                {outstandingInvoices.length}
              </span>
            );
          }
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === 'Payment History' ? 'Payments' : tab === 'Outstanding Balance' ? 'Outstanding' : 'Invoices')}
              className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center relative ${
                (activeTab === 'Invoices' && tab === 'Invoices') ||
                (activeTab === 'Payments' && tab === 'Payment History') ||
                (activeTab === 'Outstanding' && tab === 'Outstanding Balance')
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab}</span>
              {badge}
            </button>
          );
        })}
      </div>

      {/* Main Sections */}

      {/* Section 1: Invoices */}
      {activeTab === 'Invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-750">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Invoice Number</th>
                  <th className="px-5 py-3">Order Reference</th>
                  <th className="px-5 py-3">Invoice Date</th>
                  <th className="px-5 py-3">Taxable Value</th>
                  <th className="px-5 py-3">GST Amount (18%)</th>
                  <th className="px-5 py-3">Total Amount</th>
                  <th className="px-5 py-3">Payment Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvoices.map(inv => (
                  <tr key={inv.invoiceNumber} className="hover:bg-slate-50/40">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-450">{inv.orderId}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{inv.date}</td>
                    <td className="px-5 py-3.5">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-slate-500">₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-850">₹{inv.total.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                        inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        inv.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === 'Paid' ? 'bg-emerald-500' :
                          inv.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></span>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="p-1 hover:bg-slate-105 rounded text-slate-550 hover:text-slate-900 transition-all"
                        title="Inspect GST Invoice Sheet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(inv.invoiceNumber)}
                        className="p-1 hover:bg-slate-105 rounded text-brand-orange hover:text-brand-orange-hover transition-all"
                        title="Download PDF Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Payments History */}
      {activeTab === 'Payments' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-750">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Payment Date</th>
                  <th className="px-5 py-3">UTR / Transaction ID</th>
                  <th className="px-5 py-3">Amount Deposited</th>
                  <th className="px-5 py-3">Linked Order ID</th>
                  <th className="px-5 py-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentHistoryList.length > 0 ? (
                  paymentHistoryList.map((pay, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40">
                      <td className="px-5 py-3.5 text-slate-400 font-medium">{pay.date}</td>
                      <td className="px-5 py-3.5 font-mono font-bold tracking-wide text-slate-800">{pay.utr}</td>
                      <td className="px-5 py-3.5 font-extrabold text-slate-850">₹{pay.amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-450">{pay.orderId}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          pay.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          pay.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {pay.status === 'Verified' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> :
                           pay.status === 'Pending' ? <Clock className="w-3.5 h-3.5 text-amber-500" /> :
                           <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                          <span>{pay.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-slate-500 font-medium">
                      No bank payments recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Outstanding Payments */}
      {activeTab === 'Outstanding' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Balance</span>
                <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">₹{totalOutstanding.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending Invoices</span>
                <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">{outstandingInvoices.filter(i => i.status === 'Pending').length} Sheets</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Overdue Invoices</span>
                <p className="text-xl font-extrabold text-rose-600 font-display mt-0.5">{overdueCount} Alerts</p>
              </div>
            </div>

          </div>

          {/* List of due invoices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 font-display">Unpaid Invoice Ledger</h3>
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-slate-700 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Invoice No</th>
                    <th className="px-4 py-2.5">Date Created</th>
                    <th className="px-4 py-2.5">Due Date</th>
                    <th className="px-4 py-2.5">Days Left/Overdue</th>
                    <th className="px-4 py-2.5 text-right">Outstanding Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outstandingInvoices.length > 0 ? (
                    outstandingInvoices.map((inv) => {
                      const today = new Date("2026-06-12"); // Local simulated time
                      const due = new Date(inv.dueDate);
                      const diffTime = due - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const isOverdue = diffDays < 0;

                      return (
                        <tr key={inv.invoiceNumber} className={isOverdue ? "bg-rose-50/15" : ""}>
                          <td className="px-4 py-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3 text-slate-400">{inv.date}</td>
                          <td className="px-4 py-3 font-medium text-slate-500">{inv.dueDate}</td>
                          <td className="px-4 py-3">
                            {isOverdue ? (
                              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-rose-150 inline-block animate-pulse">
                                Overdue by {Math.abs(diffDays)} days
                              </span>
                            ) : (
                              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {diffDays} days remaining
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-slate-950">₹{inv.total.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-slate-400 font-bold">
                        All payments cleared! No outstanding balances.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail GST Modal */}
      {viewingInvoice && (
        <CustomModal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`GST TAX INVOICE - ${viewingInvoice.invoiceNumber}`}
          size="lg"
          confirmText="Print Sheet"
          onConfirm={handlePrintMock}
        >
          {/* Printable GST Invoice Frame */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-6 text-xs text-slate-700 select-text">
            
            {/* Upper Company Logo & Invoice header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <span className="font-extrabold text-lg tracking-wider text-slate-900 font-display">HUDDO FOOTWEAR LTD.</span>
                <p className="text-slate-450 mt-0.5 font-medium">GSTIN: 27HUDDO8271A1ZB</p>
                <p className="text-slate-450 font-medium">Headquarters: Outer Ring Road, Bengaluru, Karnataka</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 uppercase block tracking-wider">TAX INVOICE</span>
                <p className="font-bold text-slate-800">Invoice: <span className="font-mono">{viewingInvoice.invoiceNumber}</span></p>
                <p className="text-slate-450 font-medium">Date: {viewingInvoice.date}</p>
                <p className="text-slate-450 font-medium">Due: {viewingInvoice.dueDate}</p>
              </div>
            </div>

            {/* Billing Addresses */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">BILLED TO (RETAILER)</span>
                <h4 className="font-extrabold text-slate-850 font-display mt-1">{mockRetailer.businessName}</h4>
                <p className="text-slate-550 font-semibold mt-0.5">{mockRetailer.ownerName}</p>
                <p className="text-slate-550 font-normal mt-0.5">{mockRetailer.shopAddress}, {mockRetailer.city}, {mockRetailer.state}</p>
                <p className="text-slate-450 mt-1 font-bold">GSTIN: {mockRetailer.gstNumber}</p>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SHIPPED VIA</span>
                  <p className="font-bold text-slate-750 mt-1">Order Ref: {viewingInvoice.orderId}</p>
                  <p className="text-slate-500 font-semibold mt-0.5">Courier Partner: BlueDart Express Logistics</p>
                </div>
                <p className="text-slate-450 font-bold">Status: {viewingInvoice.status}</p>
              </div>
            </div>

            {/* GST Items Table */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-[11px] font-semibold text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-2">HSN Code</th>
                    <th className="px-4 py-2">Product Description</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Taxable Val</th>
                    <th className="px-4 py-2 text-center">GST Rate</th>
                    <th className="px-4 py-2 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2.5 font-mono text-slate-400 font-medium">{item.hsn}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">{item.name}</td>
                      <td className="px-4 py-2.5 text-center">{item.quantity} pairs</td>
                      <td className="px-4 py-2.5 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2.5 text-center">{item.gstRate}%</td>
                      <td className="px-4 py-2.5 text-right font-extrabold text-slate-900">₹{item.total.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GST tax break up CGST & SGST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] space-y-1">
                <span className="font-extrabold text-slate-500 block uppercase tracking-wider mb-1.5">GST TAX SEGREGATION Breakdown</span>
                <div className="flex justify-between">
                  <span>Central GST (CGST @ 9%):</span>
                  <span className="font-bold">₹{(viewingInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>State GST (SGST @ 9%):</span>
                  <span className="font-bold">₹{(viewingInvoice.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-250/55 pt-1 flex justify-between font-extrabold text-slate-700">
                  <span>Total Tax Accrued:</span>
                  <span>₹{viewingInvoice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex flex-col items-end justify-center space-y-1 pr-2">
                <div className="flex justify-between w-full max-w-[200px] text-xs">
                  <span className="text-slate-450 font-bold">Taxable Amount:</span>
                  <span className="font-bold text-slate-750">₹{viewingInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] text-xs">
                  <span className="text-slate-450 font-bold">CGST + SGST (18%):</span>
                  <span className="font-bold text-slate-750">₹{viewingInvoice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] text-xs border-t border-slate-200 pt-1.5">
                  <span className="text-slate-800 font-extrabold">Grand Total:</span>
                  <span className="font-extrabold text-slate-950 text-sm">₹{viewingInvoice.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* GST Signature declaration */}
            <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
              This is a computer-generated GST tax receipt invoice. No physical signature is required.
            </div>

          </div>
        </CustomModal>
      )}

    </div>
  );
}
