import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownRight, Plus, Calendar, RefreshCw, 
  Eye, X, Filter, Pencil, Trash2, FileText, Image 
} from 'lucide-react';
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
    receipt: '',
    receipt_image_file: null
  });

  // Edit Entry modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    date: '',
    description: '',
    amount: '',
    type: 'expense',
    category: 'Stationery',
    notes: '',
    receipt: '',
    receipt_image_file: null,
    existing_receipt_image: null,
    delete_image: false
  });

  // Delete Confirmation modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      showToast("Please fill all required cash entry parameters.", "error");
      return;
    }
    if (Number(formData.amount) <= 0) {
      showToast("Amount must be greater than zero.", "error");
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('date', formData.date);
      dataToSend.append('description', formData.description);
      dataToSend.append('amount', formData.amount);
      dataToSend.append('type', formData.type);
      dataToSend.append('category', formData.category);
      dataToSend.append('notes', formData.notes);
      dataToSend.append('receipt', formData.receipt);

      if (formData.receipt_image_file) {
        dataToSend.append('receipt_image', formData.receipt_image_file);
      }

      const res = await fetch('/api/petty-cash/add', {
        method: 'POST',
        body: dataToSend
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
          receipt: '',
          receipt_image_file: null
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

  const handleEditClick = (entry) => {
    setEditFormData({
      id: entry.id,
      date: entry.date,
      description: entry.description,
      amount: entry.amount,
      type: entry.type,
      category: entry.category,
      notes: entry.notes || '',
      receipt: entry.receipt_url || '',
      receipt_image_file: null,
      existing_receipt_image: entry.receipt_image || null,
      delete_image: false
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleEditSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editFormData.description || !editFormData.amount || !editFormData.category) {
      showToast("Please fill all required cash entry parameters.", "error");
      return;
    }
    if (Number(editFormData.amount) <= 0) {
      showToast("Amount must be greater than zero.", "error");
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('date', editFormData.date);
      dataToSend.append('description', editFormData.description);
      dataToSend.append('amount', editFormData.amount);
      dataToSend.append('type', editFormData.type);
      dataToSend.append('category', editFormData.category);
      dataToSend.append('notes', editFormData.notes);
      dataToSend.append('receipt', editFormData.receipt);
      dataToSend.append('delete_image', editFormData.delete_image);

      if (editFormData.receipt_image_file) {
        dataToSend.append('receipt_image', editFormData.receipt_image_file);
      }

      const res = await fetch(`/api/petty-cash/${editFormData.id}`, {
        method: 'PUT',
        body: dataToSend
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Petty cash entry "${editFormData.description}" updated successfully.`, "success");
        setIsEditOpen(false);
        setEditFormData({
          id: '',
          date: '',
          description: '',
          amount: '',
          type: 'expense',
          category: 'Stationery',
          notes: '',
          receipt: '',
          receipt_image_file: null,
          existing_receipt_image: null,
          delete_image: false
        });
        fetchSummaryAndList();
      } else {
        showToast(data.error || "Failed to update cash entry", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating cash entry", "error");
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/petty-cash/${deletingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Petty cash transaction deleted successfully.", "success");
        setIsDeleteOpen(false);
        setDeletingId(null);
        fetchSummaryAndList();
      } else {
        showToast(data.error || "Failed to delete cash entry", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting cash entry", "error");
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
    { header: "Receipt Proof", accessor: "receipt_image", render: (val, row) => {
      const isPdf = (path) => path && (path.toLowerCase().endsWith('.pdf') || path.startsWith('data:application/pdf'));
      
      const renderThumbnail = (filePath, isUrl = false) => {
        const resolvedPath = isUrl ? filePath : (filePath.startsWith('data:') ? filePath : '/' + filePath);
        if (isPdf(filePath)) {
          return (
            <a href={resolvedPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 bg-blue-50 px-2 py-1 rounded-md transition-colors" title="Open PDF Receipt">
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Proof</span>
            </a>
          );
        } else {
          return (
            <img 
              src={resolvedPath} 
              alt="Receipt Thumbnail" 
              className="w-8 h-8 object-cover rounded-lg border border-slate-200 cursor-pointer shadow-xs hover:scale-105 transition-transform" 
              onClick={() => window.open(resolvedPath, '_blank')}
              title="Click to view full image"
            />
          );
        }
      };

      if (row.receipt_image) {
        return renderThumbnail(row.receipt_image, false);
      } else if (row.receipt_url) {
        return (
          <a href={row.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-orange hover:text-brand-orange-hover font-semibold text-xs border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-md transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>Link URL</span>
          </a>
        );
      } else {
        return <span className="text-slate-400 text-xs font-semibold">No Attachment</span>;
      }
    }},
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex items-center gap-1">
        <button 
          onClick={() => handleEditClick(row)} 
          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-brand-orange rounded transition-colors"
          title="Edit Entry"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDeleteClick(row.id)} 
          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded transition-colors"
          title="Delete Entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
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
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Receipt Image (JPEG, PNG, WEBP, PDF - Max 5MB)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    showToast("File size exceeds 5MB limit", "error");
                    e.target.value = null;
                    return;
                  }
                  setFormData({ ...formData, receipt_image_file: file });
                }
              }}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-700 font-sans"
            />
            {formData.receipt_image_file && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {formData.receipt_image_file.type === 'application/pdf' ? (
                    <FileText className="w-8 h-8 text-blue-500" />
                  ) : (
                    <img 
                      src={URL.createObjectURL(formData.receipt_image_file)} 
                      alt="Preview" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{formData.receipt_image_file.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{(formData.receipt_image_file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, receipt_image_file: null })}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
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

      {/* Edit Entry Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Petty Cash Transaction"
        onConfirm={handleEditSubmit}
      >
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Date *</label>
              <input 
                type="date" 
                value={editFormData.date} 
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Flow Type *</label>
              <select 
                value={editFormData.type} 
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
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
              value={editFormData.description} 
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Amount (₹) *</label>
              <input 
                type="number" 
                placeholder="₹450" 
                value={editFormData.amount} 
                onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Category *</label>
              <select 
                value={editFormData.category} 
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
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
              value={editFormData.receipt} 
              onChange={(e) => setEditFormData({ ...editFormData, receipt: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Receipt Image (JPEG, PNG, WEBP, PDF - Max 5MB)</label>
            
            {editFormData.existing_receipt_image && !editFormData.delete_image ? (
              <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editFormData.existing_receipt_image.toLowerCase().endsWith('.pdf') || editFormData.existing_receipt_image.startsWith('data:application/pdf') ? (
                    <FileText className="w-8 h-8 text-blue-500" />
                  ) : (
                    <img 
                      src={editFormData.existing_receipt_image.startsWith('data:') ? editFormData.existing_receipt_image : '/' + editFormData.existing_receipt_image} 
                      alt="Existing receipt" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-700">Current Receipt File</p>
                    <a 
                      href={editFormData.existing_receipt_image.startsWith('data:') ? editFormData.existing_receipt_image : '/' + editFormData.existing_receipt_image}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-brand-orange hover:underline font-bold"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditFormData({ ...editFormData, delete_image: true })}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Image</span>
                </button>
              </div>
            ) : null}

            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    showToast("File size exceeds 5MB limit", "error");
                    e.target.value = null;
                    return;
                  }
                  setEditFormData({ 
                    ...editFormData, 
                    receipt_image_file: file,
                    delete_image: true
                  });
                }
              }}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white text-slate-700 font-sans"
            />

            {editFormData.receipt_image_file && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editFormData.receipt_image_file.type === 'application/pdf' ? (
                    <FileText className="w-8 h-8 text-blue-500" />
                  ) : (
                    <img 
                      src={URL.createObjectURL(editFormData.receipt_image_file)} 
                      alt="New Preview" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-750 truncate max-w-[200px]">Replacement: {editFormData.receipt_image_file.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{(editFormData.receipt_image_file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditFormData({ ...editFormData, receipt_image_file: null, delete_image: editFormData.existing_receipt_image ? false : true })}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Additional Notes</label>
            <textarea 
              rows="2" 
              placeholder="Provide comments or manager approvals reference..." 
              value={editFormData.notes} 
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none bg-white"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Transaction"
        onConfirm={handleDeleteSubmit}
      >
        <div className="p-1">
          <p className="text-sm font-semibold text-slate-700">Are you sure you want to delete this petty cash transaction record?</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">This will permanently remove the record and delete any associated receipt files from the server. This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
