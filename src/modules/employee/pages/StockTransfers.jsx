import React, { useState } from 'react';
import { 
  RefreshCw, Plus, CheckCircle2, SlidersHorizontal, 
  MapPin, Landmark, Send, ArrowRightCircle
} from 'lucide-react';
import { mockWarehouses, mockTransfers as initialTransfers } from '../mockData/mockStock';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function StockTransfers({ showToast }) {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [productName, setProductName] = useState("Huddo Running Shoes Blue (Size 9)");
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreateTransferSubmit = () => {
    if (!fromWarehouse || !toWarehouse || !qty) {
      showToast("Please fill all required transfer fields.", "error");
      return;
    }
    if (fromWarehouse === toWarehouse) {
      showToast("Source and Destination warehouses cannot be the same.", "error");
      return;
    }

    const newTransfer = {
      id: `TR-${String(500 + transfers.length + 1)}`,
      fromWarehouse,
      toWarehouse,
      product: productName,
      quantity: Number(qty),
      status: "Requested",
      date: new Date().toISOString().split('T')[0]
    };

    setTransfers([newTransfer, ...transfers]);
    setIsCreateOpen(false);
    setFromWarehouse("");
    setToWarehouse("");
    setQty("");
    setNotes("");
    showToast(`Transfer request ${newTransfer.id} submitted successfully.`, "success");
  };

  const handleUpdateStatus = (transId, nextStatus) => {
    setTransfers(prev => prev.map(t => 
      t.id === transId ? { ...t, status: nextStatus } : t
    ));
    showToast(`Transfer request ${transId} status changed to ${nextStatus}.`, "success");
  };

  const columns = [
    { header: "Transfer ID", accessor: "id" },
    { header: "From Warehouse", accessor: "fromWarehouse", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { header: "To Warehouse", accessor: "toWarehouse", render: (val) => <span className="font-semibold text-slate-800">{val}</span> },
    { header: "Product Item", accessor: "product" },
    { header: "Quantity", accessor: "quantity", render: (val) => `${val} Units` },
    { header: "Date Requested", accessor: "date" },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => {
        if (row.status === 'Requested') {
          return (
            <button 
              onClick={() => handleUpdateStatus(val, "In Transit")}
              className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded border border-indigo-250 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <ArrowRightCircle className="w-3.5 h-3.5" />
              <span>Ship Goods</span>
            </button>
          );
        }
        if (row.status === 'In Transit') {
          return (
            <button 
              onClick={() => handleUpdateStatus(val, "Completed")}
              className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded border border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Receive Goods</span>
            </button>
          );
        }
        return (
          <span className="text-[10px] text-slate-400 font-bold italic">Closed</span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Inter-Warehouse Transfers</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Log and track stock transfer request parameters across regional depots.</p>
        </div>

        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Transfer</span>
        </button>
      </div>

      {/* Roster table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Stock Transfers Register ledger</h3>
        
        <CustomDataTable 
          columns={columns}
          data={transfers}
          searchKeys={["id", "fromWarehouse", "toWarehouse", "product", "status"]}
          searchPlaceholder="Search transfer request records..."
        />
      </div>

      {/* Create Stock Transfer Modal Form */}
      <CustomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Request Stock Transfer Form"
        confirmText="Submit Transfer Request"
        onConfirm={handleCreateTransferSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">From Warehouse *</label>
              <select
                value={fromWarehouse}
                onChange={(e) => setFromWarehouse(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="">-- Select Source --</option>
                {mockWarehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">To Warehouse *</label>
              <select
                value={toWarehouse}
                onChange={(e) => setToWarehouse(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="">-- Select Destination --</option>
                {mockWarehouses.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Product SKU *</label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="Huddo Running Shoes Blue (Size 9)">Huddo Running Shoes Blue (Size 9)</option>
                <option value="Huddo Casual Sneakers White (Size 8)">Huddo Casual Sneakers White (Size 8)</option>
                <option value="Huddo Leather Boots Black (Size 10)">Huddo Leather Boots Black (Size 10)</option>
                <option value="Huddo Comfort Slides Grey (Size 8)">Huddo Comfort Slides Grey (Size 8)</option>
                <option value="Huddo Sports Grip Yellow (Size 9)">Huddo Sports Grip Yellow (Size 9)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Transfer Quantity (Units) *</label>
              <input 
                type="number" 
                min="1"
                placeholder="100" 
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reason / Notes</label>
            <textarea 
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide context or comments for transfer requirements..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
