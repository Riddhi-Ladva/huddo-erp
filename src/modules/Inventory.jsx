import React, { useState } from 'react';
import { Archive, Plus, RefreshCw, AlertTriangle, Layers, Save, HelpCircle } from 'lucide-react';
import { initialInventory, warehouses } from '../mockData';
import { DataTable, Modal } from '../components/Common';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// HUDDO-UPDATE: Inventory — Added Return Stock Workflow tab with selectors, API logs, and history list
export default function Inventory({ showToast }) {
  const [activeTab, setActiveTab] = useState('stock'); // stock | alerts | transfer | warehouses | returns | reports
  const [stock, setStock] = useState(initialInventory);
  const [whList, setWhList] = useState(warehouses);

  // Modals state
  const [isAddWhOpen, setIsAddWhOpen] = useState(false);
  const [newWh, setNewWh] = useState({ name: '', location: '', manager: '', capacity: '' });

  // Stock transfer state
  const [transferData, setTransferData] = useState({
    fromWh: 'Mumbai Central Whse',
    toWh: 'Delhi NCR Whse',
    product: 'Huddo Air Classic',
    qty: '50',
    date: '2026-06-08'
  });

  // Returns workflow state
  const [returnHistory, setReturnHistory] = useState([]);
  const [returnForm, setReturnForm] = useState({
    productId: '',
    qty: '',
    reason: 'Defective Product',
    refNo: '',
    notes: ''
  });

  React.useEffect(() => {
    fetch('/api/inventory/return-stock')
      .then(res => res.json())
      .then(data => setReturnHistory(data))
      .catch(err => console.error("Error loading return logs", err));
  }, []);

  React.useEffect(() => {
    if (stock.length > 0 && !returnForm.productId) {
      setReturnForm(prev => ({ ...prev, productId: stock[0].id }));
    }
  }, [stock, returnForm.productId]);

  const handleReturnStockSubmit = async (e) => {
    e.preventDefault();
    if (!returnForm.productId || !returnForm.qty) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    try {
      const res = await fetch('/api/inventory/return-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: returnForm.productId,
          quantity: Number(returnForm.qty),
          reason: returnForm.reason,
          reference_no: returnForm.refNo,
          notes: returnForm.notes,
          returned_by: "Rohan Hudda"
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Stock return registered. Stock level increased.", "success");
        // Reload history
        const histRes = await fetch('/api/inventory/return-stock');
        const histData = await histRes.json();
        setReturnHistory(histData);
        // Update local stock counts
        setStock(stock.map(item => {
          if (item.id === returnForm.productId) {
            const newLevel = item.stockLevel + Number(returnForm.qty);
            return {
              ...item,
              stockLevel: newLevel,
              status: newLevel <= item.reorderLevel ? (newLevel === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal'
            };
          }
          return item;
        }));
        // Reset form
        setReturnForm({
          productId: stock[0]?.id || '',
          qty: '',
          reason: 'Defective Product',
          refNo: '',
          notes: ''
        });
      } else {
        showToast(data.error || "Failed to process return", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error processing return", "error");
    }
  };

  const handleUpdateReorder = (id, newVal) => {
    setStock(stock.map(item => 
      item.id === id ? { 
        ...item, 
        reorderLevel: Number(newVal),
        status: item.stockLevel <= Number(newVal) ? (item.stockLevel === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal'
      } : item
    ));
  };

  const handleSaveReorder = () => {
    showToast("Reorder levels saved and sync'd to automation system.", "success");
  };

  const handleAddWarehouseSubmit = (e) => {
    e.preventDefault();
    if (!newWh.name || !newWh.location) {
      showToast("Please enter warehouse name and address location.", "error");
      return;
    }
    const newW = {
      id: `W${whList.length + 1}`,
      ...newWh
    };
    setWhList([...whList, newW]);
    setIsAddWhOpen(false);
    setNewWh({ name: '', location: '', manager: '', capacity: '' });
    showToast(`Warehouse "${newW.name}" added to logistics nodes.`, "success");
  };

  const handleStockTransferSubmit = (e) => {
    e.preventDefault();
    showToast(`Stock transfer request created: Dispatched ${transferData.qty} pairs from "${transferData.fromWh}".`, "success");
  };

  // Low stock filters
  const lowStockItems = stock.filter(item => item.stockLevel <= item.reorderLevel);

  const stockColumns = [
    { header: "Footwear Product", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "SKU Code", accessor: "sku", render: (val) => <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-slate-600 font-bold">{val}</code> },
    { header: "Category", accessor: "category" },
    { header: "Size/Color", accessor: "id", render: (val, row) => <span>UK {row.size} / {row.color}</span> },
    { header: "Stock Level", accessor: "stockLevel", render: (val) => <span className={`font-bold ${val === 0 ? 'text-rose-600' : val <= 40 ? 'text-amber-500' : 'text-slate-800'}`}>{val} pairs</span> },
    { header: "Warehouse Link", accessor: "warehouse" },
    { header: "Reorder Level (Editable)", accessor: "reorderLevel", render: (val, row) => (
      <div className="flex items-center gap-1">
        <input 
          type="number"
          value={val}
          onChange={(e) => handleUpdateReorder(row.id, e.target.value)}
          className="border border-slate-200 text-slate-800 rounded p-1 w-16 text-right font-bold focus:outline-none"
        />
        <span className="text-[10px] text-slate-400">units</span>
      </div>
    )},
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        val === 'Normal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
        val === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
        'bg-rose-50 text-rose-700 border-rose-200'
      }`}>
        {val}
      </span>
    )}
  ];

  const whColumns = [
    { header: "Warehouse ID", accessor: "id" },
    { header: "Warehouse Facility Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Address Location", accessor: "location" },
    { header: "Facility Head", accessor: "manager" },
    { header: "Inventory Capacity", accessor: "capacity" }
  ];

  // Stock tracking movement chart mock
  const mockStockMovement = [
    { day: '06-01', in: 1200, out: 950 },
    { day: '06-03', in: 1500, out: 1100 },
    { day: '06-05', in: 800, out: 1300 },
    { day: '06-07', in: 1900, out: 1200 }
  ];

  return (
    <div className="space-y-6">
      {/* Stock metrics dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200/50">
            <Archive className="w-6 h-6 text-brand-orange" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Stock SKUs</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">{stock.length} Active</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Low Stock Alerts</span>
            <h3 className="text-xl font-bold text-amber-600 font-display mt-0.5">{lowStockItems.filter(i => i.stockLevel > 0).length} Items</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Out of Stock SKU</span>
            <h3 className="text-xl font-bold text-rose-600 font-display mt-0.5">{stock.filter(i => i.stockLevel === 0).length} Models</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Layers className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Warehouses Mapped</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">{whList.length} Facilities</h3>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">Inventory Logs & Logistics</h1>
          <p className="text-xs text-slate-500 font-semibold">Perform warehouse balance checks, authorize inbound transfers, and update auto-reordering limits.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          {activeTab === 'stock' && (
            <button 
              onClick={handleSaveReorder}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Reorder Levels</span>
            </button>
          )}
          {activeTab === 'warehouses' && (
            <button 
              onClick={() => setIsAddWhOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'stock' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Stock Ledger Directory
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'alerts' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Low Stock Alerts ({lowStockItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('transfer')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'transfer' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Stock Transfer Form
        </button>
        <button 
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'warehouses' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Warehouse Facilities ({whList.length})
        </button>
        <button 
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'returns' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Return Stock Workflow
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'reports' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Inventory Analytics Charts
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'stock' && (
        <DataTable 
          columns={stockColumns} 
          data={stock} 
          searchKeys={["name", "sku", "warehouse"]}
          searchPlaceholder="Search inventory by model, SKU or warehouse..."
        />
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600">{lowStockItems.length} items currently below reorder levels.</span>
            <button 
              onClick={() => showToast("Simulated Bulk Purchase Order raised for low stock items.", "success")}
              className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded text-xs font-bold"
            >
              Raise Bulk Purchase Order
            </button>
          </div>

          <DataTable 
            columns={stockColumns} 
            data={lowStockItems} 
            searchKeys={["name", "sku"]}
            searchPlaceholder="Search low stock..."
          />
        </div>
      )}

      {activeTab === 'warehouses' && (
        <DataTable 
          columns={whColumns} 
          data={whList} 
          searchKeys={["name", "location", "manager"]}
          searchPlaceholder="Search facilities..."
        />
      )}

      {activeTab === 'transfer' && (
        <form onSubmit={handleStockTransferSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Inter-Warehouse Stock Transfer</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Dispatches batch models between regional warehouses nodes.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">From Facility Source *</label>
              <select 
                value={transferData.fromWh} 
                onChange={(e) => setTransferData({ ...transferData, fromWh: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                {whList.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To Facility Target *</label>
              <select 
                value={transferData.toWh} 
                onChange={(e) => setTransferData({ ...transferData, toWh: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                {whList.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Footwear Model *</label>
              <select 
                value={transferData.product} 
                onChange={(e) => setTransferData({ ...transferData, product: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                <option value="Huddo Air Classic">Huddo Air Classic</option>
                <option value="Huddo Flex Runner">Huddo Flex Runner</option>
                <option value="Huddo Elegant Derby">Huddo Elegant Derby</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity (Pairs) *</label>
              <input 
                type="number" 
                value={transferData.qty} 
                onChange={(e) => setTransferData({ ...transferData, qty: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Dispatch Transfer Order
          </button>
        </form>
      )}

      {activeTab === 'returns' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Return stock form */}
          <form onSubmit={handleReturnStockSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 h-fit">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Register Stock Return</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Increases product inventory count and logs reference tracking details.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Footwear SKU *</label>
              <select 
                value={returnForm.productId} 
                onChange={(e) => setReturnForm({ ...returnForm, productId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
              >
                {stock.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity (Pairs) *</label>
                <input 
                  type="number" 
                  value={returnForm.qty} 
                  onChange={(e) => setReturnForm({ ...returnForm, qty: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none" 
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Return Reason *</label>
                <select 
                  value={returnForm.reason} 
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                >
                  <option value="Defective Product">Defective Product</option>
                  <option value="Size Misalignment">Size Misalignment</option>
                  <option value="Cancel Order">Cancel Order</option>
                  <option value="Overstock Return">Overstock Return</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference No. (Invoice / Order)</label>
              <input 
                type="text" 
                value={returnForm.refNo} 
                onChange={(e) => setReturnForm({ ...returnForm, refNo: e.target.value })}
                placeholder="e.g. INV-2026-001" 
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Additional Notes</label>
              <textarea 
                rows="2" 
                value={returnForm.notes} 
                onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                placeholder="Detailed explanation..." 
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none" 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              Submit Return Stock
            </button>
          </form>

          {/* Return History table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Returned Stock History Logs</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Audit log of all processed stock return transactions.</p>
            </div>
            <DataTable 
              columns={[
                { header: "Log ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono">{val}</span> },
                { header: "Product Name", accessor: "productName", render: (val) => <span className="font-bold text-slate-800 font-display text-[11px]">{val}</span> },
                { header: "SKU", accessor: "sku", render: (val) => <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-slate-600 font-bold">{val}</code> },
                { header: "Qty", accessor: "quantity", render: (val) => <span className="font-bold text-emerald-600">+{val}</span> },
                { header: "Reason", accessor: "reason" },
                { header: "Reference ID", accessor: "reference_no" },
                { header: "Return Date", accessor: "created_at", render: (val) => <span>{new Date(val).toLocaleDateString()}</span> }
              ]} 
              data={returnHistory} 
              searchKeys={["id", "productName", "sku", "reason", "reference_no"]} 
              searchPlaceholder="Search return log history..."
            />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 font-display">Daily Inbound vs Outbound Stock Movement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockStockMovement} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="in" stroke="#10b981" fillOpacity={1} fill="url(#colorIn)" name="Inbound Stock" strokeWidth={2} />
                <Area type="monotone" dataKey="out" stroke="#ef4444" fillOpacity={1} fill="url(#colorOut)" name="Outbound Dispatch" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Warehouse Facility Modal */}
      <Modal
        isOpen={isAddWhOpen}
        onClose={() => setIsAddWhOpen(false)}
        title="Register Warehouse Facility"
        onConfirm={handleAddWarehouseSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facility Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Pune Depot Whse" 
              value={newWh.name}
              onChange={(e) => setNewWh({ ...newWh, name: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facility Head / Manager</label>
              <input 
                type="text" 
                placeholder="e.g., Sanjay Joshi" 
                value={newWh.manager}
                onChange={(e) => setNewWh({ ...newWh, manager: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Inventory Capacity</label>
              <input 
                type="text" 
                placeholder="e.g., 6,000 SKUs" 
                value={newWh.capacity}
                onChange={(e) => setNewWh({ ...newWh, capacity: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facility Address Location *</label>
            <textarea 
              rows="2" 
              placeholder="e.g., Pune-Bangalore highway, GIDC, Pune" 
              value={newWh.location}
              onChange={(e) => setNewWh({ ...newWh, location: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </form>
      </Modal>

    </div>
  );
}
