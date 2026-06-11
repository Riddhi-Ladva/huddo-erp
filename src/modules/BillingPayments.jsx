import React, { useState } from 'react';
import { CreditCard, FileText, CheckCircle2, AlertTriangle, Send, ShieldAlert, Plus, HelpCircle, Save } from 'lucide-react';
import { initialInvoices, initialTransactions, initialOutstandings, initialOrders, GEOGRAPHY } from '../mockData';
import { DataTable, Modal } from '../components/Common';

// HUDDO-UPDATE: Billing & Payment — Added retailer billing customer info logs, inline editable GST overrides with recalculations, and RBAC tab hiding
export default function BillingPayments({ showToast, userRole }) {
  const [activeTab, setActiveTab] = useState('invoices'); // invoices | payments | outstanding | transactions
  const [invoices, setInvoices] = useState(initialInvoices);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [outstandings, setOutstandings] = useState(initialOutstandings);

  // Modals state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyingRecord, setVerifyingRecord] = useState(null); // transaction record

  // Invoice generator state
  const [selectedOrderId, setSelectedOrderId] = useState('ORD-7391');
  const [billingType, setBillingType] = useState('Wholesale'); // Wholesale | Retailer
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('Mumbai');

  // Inline edit state
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [editingPercentage, setEditingPercentage] = useState('');

  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault();
    const matchedOrder = initialOrders.find(o => o.id === selectedOrderId);
    if (!matchedOrder) return;

    if (billingType === 'Retailer') {
      if (!customerName || !customerMobile || !customerCity) {
        showToast("Please fill all required customer fields.", "error");
        return;
      }
      if (!/^\d{10}$/.test(customerMobile)) {
        showToast("Please enter a valid 10-digit mobile number.", "error");
        return;
      }
    }

    const netVal = matchedOrder.amount;
    const gstVal = Math.round(netVal * 0.18);
    const grossVal = netVal + gstVal;

    const newInv = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      orderId: matchedOrder.id,
      shopName: matchedOrder.retailerName,
      amount: netVal,
      tax: gstVal,
      total: grossVal,
      date: new Date().toISOString().split('T')[0],
      status: "Unpaid"
    };

    setInvoices([newInv, ...invoices]);

    if (billingType === 'Retailer') {
      fetch('/api/billing/retailer/customer-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: newInv.id,
          customer_name: customerName,
          mobile: customerMobile,
          email: customerEmail,
          city: customerCity,
          amount: newInv.total
        })
      })
      .then(res => res.json())
      .then(data => {
        showToast(`Customer logged. Retailer Invoice ${newInv.id} generated.`, "success");
      })
      .catch(err => {
        console.error("Error logging customer details", err);
      });
    } else {
      showToast(`Invoice ${newInv.id} generated for order ${newInv.orderId}`, "success");
    }

    setIsGenerateOpen(false);
    // Reset forms
    setCustomerName('');
    setCustomerMobile('');
    setCustomerEmail('');
  };

  const handleVerifyPayment = (isApproved) => {
    const status = isApproved ? 'Verified' : 'Rejected';
    
    // update transaction
    setTransactions(transactions.map(t => 
      t.id === verifyingRecord.id ? { ...t, status: status } : t
    ));

    // update corresponding invoice status if verified
    if (isApproved) {
      setInvoices(invoices.map(inv => 
        inv.orderId === verifyingRecord.order ? { ...inv, status: "Paid" } : inv
      ));
      // update outstanding record
      setOutstandings(outstandings.filter(out => out.shopName !== verifyingRecord.shopName));
    }

    setIsVerifyOpen(false);
    showToast(`Transaction UTR verification completed. Status set: ${status}`, isApproved ? "success" : "error");
  };

  // Generate Invoices columns
  const invoiceColumns = [
    { header: "Invoice ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono">{val}</span> },
    { header: "Order Ref ID", accessor: "orderId" },
    { header: "Shop Name", accessor: "shopName", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Taxable Value", accessor: "amount", render: (val) => <span>₹{val.toLocaleString('en-IN')}</span> },
    { 
      header: "GST Tax %", 
      accessor: "overridePercentage", 
      render: (val, row) => {
        const isEditing = editingInvoiceId === row.id;
        return (
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              {isEditing ? (
                <>
                  <input 
                    type="number" 
                    className="w-12 border border-slate-300 rounded px-1 py-0.5 text-xs font-bold focus:outline-none" 
                    value={editingPercentage} 
                    onChange={(e) => setEditingPercentage(e.target.value)} 
                    min="0"
                    max="100"
                  />
                  <span className="font-semibold">%</span>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/billing/${row.id}/get-percentage`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ percentage: Number(editingPercentage) })
                        });
                        const updated = await res.json();
                        setInvoices(invoices.map(inv => inv.id === row.id ? updated : inv));
                        setEditingInvoiceId(null);
                        showToast(`GST percentage updated to ${editingPercentage}% for ${row.id}`, "success");
                      } catch (err) {
                        showToast("Failed to update percentage", "error");
                      }
                    }}
                    className="p-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-100 hover:bg-emerald-100"
                    title="Update"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setEditingInvoiceId(null)}
                    className="px-1 py-0.5 text-[9px] text-slate-400 hover:text-slate-600 border rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-700">{row.overridePercentage || 18}%</span>
                  <button 
                    onClick={() => {
                      setEditingInvoiceId(row.id);
                      setEditingPercentage(row.overridePercentage || 18);
                    }}
                    className="text-brand-orange hover:underline text-[10px]"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Auto: 18% | Override: {row.overridePercentage ? `${row.overridePercentage}%` : 'None'}
            </span>
          </div>
        );
      }
    },
    { 
      header: "GST Tax Amount", 
      accessor: "tax", 
      render: (val, row) => {
        if (editingInvoiceId === row.id) {
          const tempTax = Math.round(row.amount * (Number(editingPercentage) / 100)) || 0;
          return <span className="text-slate-500 font-semibold">₹{tempTax.toLocaleString('en-IN')} (Preview)</span>;
        }
        return <span className="text-slate-400">₹{val.toLocaleString('en-IN')}</span>;
      }
    },
    { 
      header: "Total Gross (₹)", 
      accessor: "total", 
      render: (val, row) => {
        if (editingInvoiceId === row.id) {
          const tempTax = Math.round(row.amount * (Number(editingPercentage) / 100)) || 0;
          const tempTotal = row.amount + tempTax;
          return <span className="font-bold text-indigo-600">₹{tempTotal.toLocaleString('en-IN')} (Preview)</span>;
        }
        return <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span>;
      }
    },
    { header: "Due Date", accessor: "date" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
        {val}
      </span>
    )}
  ];

  // Payments verification table columns
  // HUDDO-UPDATE: BillingPayments — Payment Matching holds a TODO for auto-settlement reconciliation
  const paymentColumns = [
    { header: "Txn ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono">{val}</span> },
    { header: "UTR Receipt No", accessor: "utr", render: (val) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-600">{val}</code> },
    { header: "Amount Deposited", accessor: "amount", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Timestamp", accessor: "date" },
    { header: "Order Link", accessor: "order" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        val === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
        val === 'Pending Verification' ? 'bg-amber-100 text-amber-800' :
        'bg-rose-100 text-rose-800'
      }`}>
        {val}
      </span>
    )},
    { header: "Action Gateway", accessor: "id", sortable: false, render: (val, row) => (
      row.status === 'Pending Verification' ? (
        <button 
          onClick={() => { setVerifyingRecord(row); setIsVerifyOpen(true); }}
          className="px-3 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded"
        >
          Verify Payment Receipt
        </button>
      ) : <span className="text-slate-400 font-semibold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Settled Ledger</span>
    )}
  ];

  // Outstanding checklist columns
  const outstandingColumns = [
    { header: "Shop Name", accessor: "shopName", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "City Region", accessor: "city" },
    { header: "Pending Amount (₹)", accessor: "pendingAmount", render: (val) => <span className="font-bold text-rose-600">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Days Overdue", accessor: "overdueDays", render: (val) => <span className="font-semibold text-slate-700">{val} Days Overdue</span> },
    { header: "Last Alert Sent", accessor: "lastReminder" },
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <button 
        onClick={() => showToast(`Outstanding Payment reminder broadcasted via WhatsApp to ${row.shopName}`, "success")}
        className="flex items-center gap-1 px-3 py-1 border border-slate-200 hover:border-slate-300 rounded text-xs font-bold text-slate-700 bg-white"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Broadcasting Reminder</span>
      </button>
    )}
  ];

  const canViewAuditAndOutstanding = ['Founder', 'CEO', 'Admin', 'Finance Manager'].includes(userRole || 'Founder');

  React.useEffect(() => {
    if (!canViewAuditAndOutstanding && (activeTab === 'outstanding' || activeTab === 'transactions')) {
      setActiveTab('invoices');
    }
  }, [userRole, activeTab, canViewAuditAndOutstanding]);

  return (
    <div className="space-y-6">
      {/* Scorecard cards at top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CreditCard className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Collections (This Month)</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">₹2.40 L</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Outstanding Dues</span>
            <h3 className="text-xl font-bold text-rose-600 font-display mt-0.5">₹2.34 L</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-slate-100 text-slate-600 rounded-xl border border-slate-200/50">
            <FileText className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Invoices Mapped</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">3 Generated</h3>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">Invoices & Collection Ledger</h1>
          <p className="text-xs text-slate-500 font-semibold">Track invoice payment verifications, audit receipts, and broadcast outstanding credit balances reminders.</p>
        </div>
        {activeTab === 'invoices' && (
          <button 
            onClick={() => setIsGenerateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Generate GST Invoice</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          GST Invoices ({invoices.length})
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'payments' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Payments Matching
        </button>
        {canViewAuditAndOutstanding && (
          <>
            <button 
              onClick={() => setActiveTab('outstanding')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'outstanding' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Outstanding Accounts ({outstandings.length})
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Audit Ledger History
            </button>
          </>
        )}
      </div>

      {/* Contents */}
      {activeTab === 'invoices' ? (
        <DataTable 
          columns={invoiceColumns} 
          data={invoices} 
          searchKeys={["id", "orderId", "shopName"]}
          searchPlaceholder="Search invoices..."
        />
      ) : activeTab === 'payments' ? (
        <DataTable 
          columns={paymentColumns} 
          data={transactions} 
          searchKeys={["id", "utr", "order"]}
          searchPlaceholder="Search transaction matching queue..."
        />
      ) : activeTab === 'outstanding' ? (
        <DataTable 
          columns={outstandingColumns} 
          data={outstandings} 
          searchKeys={["shopName", "city"]}
          searchPlaceholder="Search outstanding shop balances..."
        />
      ) : (
        <DataTable 
          columns={paymentColumns} 
          data={transactions} 
          searchKeys={["id", "utr", "order"]}
          searchPlaceholder="Search transaction logs..."
        />
      )}

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate GST Invoice"
        onConfirm={handleGenerateInvoiceSubmit}
      >
        <form className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Billing Type</label>
            <select 
              value={billingType} 
              onChange={(e) => setBillingType(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
            >
              <option value="Wholesale">Wholesale Billing (Standard Retailer Account)</option>
              <option value="Retailer">Retailer Billing (End Consumer Details)</option>
            </select>
          </div>

          {billingType === 'Retailer' && (
            <div className="border border-slate-100 bg-slate-50 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase">Captured Consumer Information</span>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Customer Full Name *</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="e.g. Ramesh Patel" 
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Mobile Number (10-Digit) *</label>
                <input 
                  type="text" 
                  maxLength={10} 
                  value={customerMobile} 
                  onChange={(e) => setCustomerMobile(e.target.value)} 
                  placeholder="e.g. 9876543210" 
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Email Address</label>
                <input 
                  type="email" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)} 
                  placeholder="e.g. ramesh@gmail.com" 
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">City *</label>
                <select 
                  value={customerCity} 
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                >
                  {GEOGRAPHY.cities.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Order Reference ID</label>
            <select 
              value={selectedOrderId} 
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
            >
              {initialOrders.filter(o => o.status === 'Approved').map(o => (
                <option key={o.id} value={o.id}>{o.id} — {o.retailerName} (₹{o.amount})</option>
              ))}
            </select>
          </div>
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-800">GST Invoice preview configurations:</span>
            <p>• Applied Central & State wholesale footwear GST tax rate: <strong>18%</strong></p>
            <p>• Bill details will be generated from active order items list.</p>
          </div>
        </form>
      </Modal>

      {/* Verify Payment Modal */}
      {isVerifyOpen && verifyingRecord && (
        <Modal
          isOpen={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
          title="Verify Deposited UTR Ledger Match"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-700">Transaction details</h4>
              <p>UTR Receipt No: <strong>{verifyingRecord.utr}</strong></p>
              <p>Registered Order ID: <strong>{verifyingRecord.order}</strong></p>
              <p>Net Deposit Amount: <strong className="text-slate-900 text-sm">₹{verifyingRecord.amount.toLocaleString('en-IN')}</strong></p>
            </div>
            
            {/* Mock screenshot proof mapping */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <span className="block text-[10px] uppercase font-bold text-slate-400 p-2 bg-slate-50">Retailer Deposit Receipt Preview</span>
              <img src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400" alt="Proof receipt" className="w-full h-40 object-cover" />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                onClick={() => handleVerifyPayment(false)} 
                className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded"
              >
                Reject Receipt
              </button>
              <button 
                onClick={() => handleVerifyPayment(true)} 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded"
              >
                Verify & Settle Accounts
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
