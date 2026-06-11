import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Plus, Calendar, RefreshCw, Eye, X, Filter } from 'lucide-react';
import { DataTable, Modal } from '../components/Common';

// HUDDO-UPDATE: Petty Cash — Brand new module for tracking cash flows, income, expenses, and receipt attachments
export default function PettyCash({ showToast }) {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ totalIn: 0, totalOut: 0, netBalance: 0 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Entry modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'Stationery',
    notes: '',
    receipt: ''
  });

  const fetchSummaryAndList = async () => {
    setLoading(true);
    try {
      // Summary
      let summaryUrl = `/api/petty-cash/summary?`;
      if (startDate) summaryUrl += `startDate=${startDate}&`;
      if (endDate) summaryUrl += `endDate=${endDate}&`;
      const sRes = await fetch(summaryUrl);
      const sData = await sRes.json();
      setSummary(sData);

      // List
      let listUrl = `/api/petty-cash?type=${typeFilter}&category=${categoryFilter}&`;
      if (startDate) listUrl += `startDate=${startDate}&`;
      if (endDate) listUrl += `endDate=${endDate}&`;
      const lRes = await fetch(listUrl);
      const lData = await lRes.json();
      setEntries(lData);
    } catch (e) {
      console.error(e);
      showToast("Error retrieving petty cash ledger data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryAndList();
  }, [typeFilter, categoryFilter, startDate, endDate]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      showToast("Please fill all required cash entry parameters.", "error");
      return;
    }
    if (Number(formData.amount) <= 0) {
      showToast("Amount must be greater than zero.", "error");
      return;
    }
    try {
      const res = await fetch('/api/petty-cash/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Petty cash entry "${formData.description}" registered successfully.`, "success");
        setIsAddOpen(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          description: '',
          amount: '',
          type: 'expense',
          category: 'Stationery',
          notes: '',
          receipt: ''
        });
        fetchSummaryAndList();
      } else {
        showToast(data.error || "Failed to add cash entry", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving cash entry", "error");
    }
  };

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Description", accessor: "description", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Type", accessor: "type", render: (val) => (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
        val === 'income' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}>
        {val === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {val}
      </span>
    )},
    { header: "Category", accessor: "category", render: (val) => <span className="font-semibold text-slate-600">{val}</span> },
    { header: "Amount (₹)", accessor: "amount", render: (val, row) => (
      <span className={`font-bold font-mono text-sm ${row.type === 'income' ? 'text-emerald-600' : 'text-slate-850'}`}>
        {row.type === 'income' ? '+' : '-'}₹{val.toLocaleString('en-IN')}
      </span>
    )},
    { header: "Logged By", accessor: "created_by" },
    { header: "Receipt Proof", accessor: "receipt_url", render: (val) => (
      val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline text-xs font-bold">View Receipt</a>
      ) : <span className="text-slate-400 text-xs font-semibold">No Attachment</span>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Petty Cash Management</h1>
          <p className="text-sm text-slate-500 font-medium font-sans">Audit office expenditure records, deposit budget cash allocations, and verify digital receipts.</p>
        </div>
        <div className="flex gap-2 self-start">
          <button 
            onClick={fetchSummaryAndList}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Ledger</span>
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cash Entry</span>
          </button>
        </div>
      </div>

      {/* Summary metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <ArrowUpRight className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Funds Deposited</span>
            <h3 className="text-xl font-bold text-emerald-600 font-display mt-0.5">₹{summary.totalIn.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <ArrowDownRight className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Cash Expenses</span>
            <h3 className="text-xl font-bold text-rose-600 font-display mt-0.5">₹{summary.totalOut.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-200/50">
            <CreditCard className="w-6 h-6 text-brand-orange" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Balance Remaining</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">₹{summary.netBalance.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Ledger Entries</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Flow Type</label>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-bold focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="income">Income (Deposits)</option>
              <option value="expense">Expense (Payouts)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-bold focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Stationery">Stationery</option>
              <option value="Travel">Travel</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Utilities">Utilities</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-semibold text-slate-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-semibold text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Main ledger list */}
      <DataTable 
        columns={columns} 
        data={entries} 
        searchKeys={["description", "category"]} 
        searchPlaceholder="Search petty cash register..."
        emptyStateText="No petty cash records matched query."
      />

      {/* Add Entry Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Petty Cash Transaction"
        onConfirm={handleAddSubmit}
      >
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Flow Type *</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white font-bold focus:outline-none"
              >
                <option value="expense">Expense (Payout)</option>
                <option value="income">Income (Deposit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Description *</label>
            <input 
              type="text" 
              placeholder="e.g. Courier charges for samples" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Amount (₹) *</label>
              <input 
                type="number" 
                placeholder="₹450" 
                value={formData.amount} 
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Category *</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white font-bold focus:outline-none"
              >
                <option value="Stationery">Stationery</option>
                <option value="Travel">Travel</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Utilities">Utilities</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Receipt Link / URL (e.g. Unsplash or Drive)</label>
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/..." 
              value={formData.receipt} 
              onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Additional Notes</label>
            <textarea 
              rows="2" 
              placeholder="Provide comments or manager approvals reference..." 
              value={formData.notes} 
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
