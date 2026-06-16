import React, { useState } from 'react';
import { 
  CreditCard, Plus, CheckCircle2, XCircle, SlidersHorizontal, 
  FileText, Send, Image, AlertCircle
} from 'lucide-react';
import { mockExpenses as initialExpenses } from '../mockData/mockExpenses';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function ExpenseTracking({ showToast }) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form states
  const [category, setCategory] = useState("Travel");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [receiptName, setReceiptName] = useState(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredExpenses = React.useMemo(() => {
    if (filterCategory === "All") return expenses;
    return expenses.filter(e => e.category === filterCategory);
  }, [expenses, filterCategory]);

  const handleAddExpenseSubmit = () => {
    if (!description.trim() || !amount || !expenseDate) {
      showToast("Please fill all required expense fields.", "error");
      return;
    }

    const newExpense = {
      id: `EXP-${String(900 + expenses.length + 1)}`,
      date: expenseDate,
      category,
      description,
      amount: Number(amount),
      submittedBy: "Sanjay Joshi", // Finance Manager
      status: "Approved", // Auto-approved if submitted by Finance Manager
      receipt: receiptName || "receipt_default.jpg"
    };

    setExpenses([newExpense, ...expenses]);
    setIsAddOpen(false);
    setDescription("");
    setAmount("");
    setExpenseDate("");
    setReceiptName(null);
    showToast(`Expense claim ${newExpense.id} successfully recorded.`, "success");
  };

  const handleApproveExpense = (expId, isApproved) => {
    setExpenses(prev => prev.map(e => 
      e.id === expId ? { ...e, status: isApproved ? "Approved" : "Rejected" } : e
    ));
    showToast(`Reimbursement claim ${expId} has been ${isApproved ? "Approved" : "Rejected"}.`, "success");
  };

  const columns = [
    { header: "Date", accessor: "date" },
    { header: "Category", accessor: "category" },
    { header: "Description", accessor: "description", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { header: "Amount", accessor: "amount", render: (val) => `₹${val.toLocaleString()}` },
    { header: "Submitted By", accessor: "submittedBy" },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => {
        if (row.status === 'Pending') {
          return (
            <div className="flex gap-2">
              <button 
                onClick={() => handleApproveExpense(val, true)}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-[10px] font-bold cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              
              <button 
                onClick={() => handleApproveExpense(val, false)}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded border border-rose-250 bg-rose-50 text-rose-750 hover:bg-rose-100 transition-colors text-[10px] font-bold cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          );
        }
        return (
          <span className="text-[10px] text-slate-400 font-bold italic">Settled</span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action control header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Expense Claims tracking</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit employee reimbursement claims and log company outlays.</p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Claim</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Filter Category:</span>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Travel">Travel</option>
            <option value="Office">Office</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="text-[10px] text-slate-400 font-bold">
          Found {filteredExpenses.length} expense logs
        </div>
      </div>

      {/* Expense ledger list table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Reimbursements Register ledger</h3>
        
        <CustomDataTable 
          columns={columns}
          data={filteredExpenses}
          searchKeys={["id", "category", "description", "submittedBy", "status"]}
          searchPlaceholder="Search expense register..."
        />
      </div>

      {/* Add Expense Modal Form */}
      <CustomModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Expense Claim Form"
        confirmText="Submit Expense Claim"
        onConfirm={handleAddExpenseSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="Travel">Travel Allowance</option>
                <option value="Office">Office Supplies</option>
                <option value="Marketing">Marketing Campaigns</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Receipt Date</label>
              <input 
                type="date" 
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-705 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Claim Amount (₹) *</label>
              <input 
                type="number" 
                placeholder="2500" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Receipt File Upload</label>
              <div className="border border-dashed border-slate-200 rounded-lg p-2 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer">
                <Image className="w-5 h-5 text-slate-400" />
                <span className="text-[9px] font-semibold text-slate-650">
                  {receiptName ? receiptName : "Attach bill screenshot"}
                </span>
                <input 
                  type="file" 
                  onChange={(e) => setReceiptName(e.target.files[0]?.name || null)}
                  className="hidden" 
                  id="expense-file-input"
                />
                <label htmlFor="expense-file-input" className="text-[8px] text-slate-400 cursor-pointer hover:underline">Select JPEG, PDF</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description / Remarks *</label>
            <textarea 
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or purchase particulars..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
