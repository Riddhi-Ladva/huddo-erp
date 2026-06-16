import React, { useState } from 'react';
import { 
  SlidersHorizontal, Edit, Package, Archive, 
  HelpCircle, Sparkles, CheckCircle2
} from 'lucide-react';
import { mockStock as initialStock } from '../mockData/mockStock';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function StockManagement({ showToast }) {
  const [stock, setStock] = useState(initialStock);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSize, setFilterSize] = useState("All");
  
  // Edit stock states
  const [selectedStock, setSelectedStock] = useState(null);
  const [editQty, setEditQty] = useState("");

  const handleEditStockSubmit = () => {
    if (editQty === "" || Number(editQty) < 0) {
      showToast("Please enter a valid stock quantity.", "error");
      return;
    }

    setStock(prev => prev.map(item => {
      if (item.id === selectedStock.id) {
        const nextQty = Number(editQty);
        let nextStatus = "In Stock";
        if (nextQty === 0) nextStatus = "Out of Stock";
        else if (nextQty < item.minLevel) nextStatus = "Low Stock";

        showToast(`Stock count for SKU ${item.sku} updated to ${nextQty}.`, "success");
        return { ...item, currentStock: nextQty, status: nextStatus };
      }
      return item;
    }));

    setSelectedStock(null);
    setEditQty("");
  };

  const filteredStock = React.useMemo(() => {
    let result = [...stock];
    if (filterCategory !== "All") {
      result = result.filter(s => s.category === filterCategory);
    }
    if (filterStatus !== "All") {
      result = result.filter(s => s.status === filterStatus);
    }
    if (filterSize !== "All") {
      result = result.filter(s => s.size === filterSize);
    }
    return result;
  }, [stock, filterCategory, filterStatus, filterSize]);

  const columns = [
    { header: "SKU Code", accessor: "sku", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Product Name", accessor: "productName", render: (val) => <span className="font-bold text-slate-850">{val}</span> },
    { header: "Category", accessor: "category" },
    { header: "Size", accessor: "size" },
    { header: "Color", accessor: "color" },
    { header: "Current Stock", accessor: "currentStock", render: (val) => <span className="font-extrabold text-slate-800">{val} Units</span> },
    { header: "Min Stock Limit", accessor: "minLevel", render: (val) => `${val} Units` },
    { header: "Stock Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Action", 
      accessor: "id", 
      sortable: false, 
      render: (_, row) => (
        <button 
          onClick={() => { setSelectedStock(row); setEditQty(row.currentStock); }}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-650 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Update</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Stock Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Audit SKU levels, log stock counts, and check inventory statuses.</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Slides">Slides</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] uppercase font-bold text-slate-400 mb-1">Size</label>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Sizes</option>
              <option value="8">Size 8</option>
              <option value="9">Size 9</option>
              <option value="10">Size 10</option>
            </select>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-bold">
          Found {filteredStock.length} SKUs matching parameters
        </div>
      </div>

      {/* Roster database table */}
      <CustomDataTable 
        columns={columns}
        data={filteredStock}
        searchKeys={["sku", "productName", "category", "status"]}
        searchPlaceholder="Search product stock levels..."
      />

      {/* Edit Stock count Modal Form */}
      {selectedStock && (
        <CustomModal
          isOpen={selectedStock !== null}
          onClose={() => setSelectedStock(null)}
          title={`Update SKU Stock Quantity: ${selectedStock.sku}`}
          confirmText="Update Quantity"
          onConfirm={handleEditStockSubmit}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-2 gap-4 text-xs font-semibold text-slate-655">
              <div>
                <span>Product Name</span>
                <p className="font-bold text-slate-850 mt-0.5">{selectedStock.productName}</p>
              </div>
              <div>
                <span>Current Stock level</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedStock.currentStock} Units</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">New Stock Count (Units) *</label>
              <input 
                type="number" 
                min="0"
                value={editQty}
                onChange={(e) => setEditQty(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>
          </div>
        </CustomModal>
      )}

    </div>
  );
}
