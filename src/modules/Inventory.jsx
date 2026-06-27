import React, { useState, useEffect } from 'react';
import { Archive, Plus, RefreshCw, AlertTriangle, Layers, Save, HelpCircle, Send } from 'lucide-react';
import { DataTable, Modal } from '../components/Common';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Inventory({ showToast }) {
  const [activeTab, setActiveTab] = useState('stock'); // stock | alerts | transfer | warehouses | returns | reports
  const [stock, setStock] = useState([]);
  const [whList, setWhList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  // Modals state
  const [isAddWhOpen, setIsAddWhOpen] = useState(false);
  const [isRaiseBulkOpen, setIsRaiseBulkOpen] = useState(false);
  const [newWh, setNewWh] = useState({ name: '', location: '', manager: '', capacity: '' });

  // Stock transfer state
  const [transferData, setTransferData] = useState({
    fromWh: '',
    toWh: '',
    product: '',
    qty: '50'
  });

  const [transferHistory, setTransferHistory] = useState([]);

  // Returns workflow state
  const [returnHistory, setReturnHistory] = useState([]);
  const [returnForm, setReturnForm] = useState({
    productId: '',
    qty: '',
    reason: 'Defective Product',
    refNo: '',
    notes: ''
  });

  const mapStock = (s) => ({
    id: s._id,
    name: s.product_variant?.product?.name || s.sku || 'Footwear Model',
    sku: s.product_variant?.sku || s.sku || 'HDO-AC-RD-08',
    stockLevel: s.quantity || s.stockLevel || 0,
    warehouse: s.warehouse?.name || s.warehouse || 'Mumbai Central Whse',
    reorderLevel: s.reorder_level || 50,
    status: (s.quantity || s.stockLevel) <= (s.reorder_level || 50) ? ((s.quantity || s.stockLevel) === 0 ? 'Out of Stock' : 'Low Stock') : 'Normal',
    size: s.product_variant?.size || '8',
    color: s.product_variant?.colour || 'Red',
    category: s.product_variant?.product?.category?.name || 'Sports Shoes'
  });

  const mapWarehouse = (w) => ({
    id: w._id,
    name: w.name,
    location: w.location || 'Mumbai',
    manager: w.manager?.full_name || w.manager?.name || (typeof w.manager === 'string' ? w.manager : 'Rajesh Deshpande'),
    managerId: w.manager?._id || w.manager,
    capacity: w.capacity || '10,000 SKUs'
  });

  const mapTransfer = (t) => ({
    id: t.transfer_number || t._id,
    _id: t._id,
    product: t.product_variant?.sku || t.product || 'Footwear Model',
    fromWh: t.from_warehouse?.name || t.fromWh || 'Mumbai Warehouse',
    toWh: t.to_warehouse?.name || t.toWh || 'Delhi Warehouse',
    qty: t.quantity || t.qty || 50,
    date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '2026-06-08',
    status: t.status || 'Completed'
  });

  const loadInventoryData = () => {
    fetch('/api/stock-records')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(mapStock);
          setStock(mapped);
          if (mapped.length > 0) {
            setReturnForm(prev => ({ ...prev, productId: mapped[0].id }));
          }
        }
      })
      .catch(err => console.error("Error loading stocks:", err));

    fetch('/api/warehouses')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(mapWarehouse);
          setWhList(mapped);
          if (mapped.length > 1) {
            setTransferData(prev => ({ ...prev, fromWh: mapped[0].name, toWh: mapped[1].name }));
          }
        }
      })
      .catch(err => console.error("Error loading warehouses:", err));

    fetch('/api/stock-transfers')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setTransferHistory(resData.data.map(mapTransfer));
        }
      })
      .catch(err => console.error("Error loading transfers:", err));

    fetch('/api/employees')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setEmployees(resData.data);
          if (resData.data.length > 0) {
            setNewWh(prev => ({ ...prev, manager: resData.data[0].full_name || resData.data[0].name }));
          }
        }
      })
      .catch(err => console.error("Error loading employees:", err));

    fetch('/api/product-variants')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setProductVariants(resData.data);
          if (resData.data.length > 0) {
            setTransferData(prev => ({ ...prev, product: resData.data[0].sku }));
          }
        }
      })
      .catch(err => console.error("Error loading product variants:", err));

    fetch('/api/inventory/return-stock')
      .then(res => res.json())
      .then(data => setReturnHistory(data))
      .catch(err => console.error("Error loading return logs", err));
  };

  useEffect(() => {
    loadInventoryData();
  }, []);

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
        loadInventoryData();
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

  const handleSaveReorder = async () => {
    try {
      const promises = stock.map(item => 
        fetch(`/api/stock-records/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reorder_level: item.reorderLevel })
        })
      );
      await Promise.all(promises);
      showToast("Reorder levels saved and sync'd to database successfully.", "success");
      loadInventoryData();
    } catch (err) {
      console.error(err);
      showToast("Failed to save reorder levels.", "error");
    }
  };

  const handleAddWarehouseSubmit = (e) => {
    e.preventDefault();
    if (!newWh.name || !newWh.location) {
      showToast("Please enter warehouse name and address location.", "error");
      return;
    }

    const selectedEmp = employees.find(emp => (emp.full_name || emp.name) === newWh.manager) || employees[0];
    const payload = {
      name: newWh.name,
      location: newWh.location,
      manager: selectedEmp?._id,
      capacity: newWh.capacity || '10,000 SKUs'
    };

    fetch('/api/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          showToast(`Warehouse "${newWh.name}" added to logistics nodes.`, "success");
          setIsAddWhOpen(false);
          setNewWh({ name: '', location: '', manager: employees[0]?.full_name || '', capacity: '' });
          loadInventoryData();
        } else {
          showToast(resData.message || "Failed to create warehouse.", "error");
        }
      })
      .catch(err => console.error(err));
  };

  const handleStockTransferSubmit = (e) => {
    e.preventDefault();
    if (transferData.fromWh === transferData.toWh) {
      showToast("Source and target facilities cannot be the same.", "error");
      return;
    }
    if (!transferData.qty || Number(transferData.qty) <= 0) {
      showToast("Please enter a valid transfer quantity.", "error");
      return;
    }

    const selectedFromWhObj = whList.find(w => w.name === transferData.fromWh) || whList[0];
    const selectedToWhObj = whList.find(w => w.name === transferData.toWh) || whList[1];
    const selectedVariantObj = productVariants.find(pv => pv.sku === transferData.product) || productVariants[0];

    if (!selectedFromWhObj || !selectedToWhObj || !selectedVariantObj) {
      showToast("Please check warehouse and variant details.", "error");
      return;
    }

    const cachedUser = localStorage.getItem('huddo_user');
    const currentUser = cachedUser ? JSON.parse(cachedUser) : null;

    const payload = {
      from_warehouse: selectedFromWhObj.id,
      to_warehouse: selectedToWhObj.id,
      product_variant: selectedVariantObj._id,
      quantity: Number(transferData.qty),
      transferred_by: currentUser?._id
    };

    fetch('/api/stock-transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          showToast(`Stock transfer request created: Dispatched ${transferData.qty} pairs of ${transferData.product}.`, "success");
          setIsRaiseBulkOpen(false);
          loadInventoryData();
        } else {
          showToast(resData.message || "Transfer failed.", "error");
        }
      })
      .catch(err => console.error(err));
  };

  const transferColumns = [
    { header: "Transfer ID", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono text-[11px]">{val}</span> },
    { header: "Product Model", accessor: "product", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "From Facility", accessor: "fromWh" },
    { header: "To Facility", accessor: "toWh" },
    { header: "Quantity (Pairs)", accessor: "qty", cellClassName: "text-right font-bold text-slate-900" },
    { header: "Date Dispatched", accessor: "date" },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        val === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
      }`}>
        {val}
      </span>
    )}
  ];

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
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'stock' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Warehouse Stock Ledger ({stock.length})
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'alerts' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Low Stock Alerts ({lowStockItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('transfer')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'transfer' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Facility Stock Transfers ({transferHistory.length})
        </button>
        <button 
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'warehouses' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Logistics Facilities ({whList.length})
        </button>
        <button 
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'returns' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Stock Returns Queue ({returnHistory.length})
        </button>
      </div>

      {/* Control bar */}
      {(activeTab === 'warehouses' || activeTab === 'transfer') && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-2 items-center justify-between">
          <span className="text-xs text-slate-400 font-bold">Options</span>
          {activeTab === 'warehouses' ? (
            <button 
              onClick={() => setIsAddWhOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility Node</span>
            </button>
          ) : (
            <button 
              onClick={() => setIsRaiseBulkOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Transfer Request</span>
            </button>
          )}
        </div>
      )}

      {/* Contents */}
      {activeTab === 'stock' ? (
        <DataTable 
          columns={stockColumns} 
          data={stock} 
          searchKeys={["name", "sku", "warehouse"]}
          searchPlaceholder="Search warehouse stock ledger..."
        />
      ) : activeTab === 'alerts' ? (
        <DataTable 
          columns={stockColumns} 
          data={lowStockItems} 
          searchKeys={["name", "sku", "warehouse"]}
          searchPlaceholder="Search alert items..."
        />
      ) : activeTab === 'transfer' ? (
        <DataTable 
          columns={transferColumns} 
          data={transferHistory} 
          searchKeys={["id", "product", "fromWh", "toWh"]}
          searchPlaceholder="Search stock transfers..."
        />
      ) : activeTab === 'warehouses' ? (
        <DataTable 
          columns={whColumns} 
          data={whList} 
          searchKeys={["name", "location", "manager"]}
          searchPlaceholder="Search warehouses..."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 font-display">Stock Returns Ledger Queue</h3>
              <p className="text-xs text-slate-400 font-semibold font-sans">Process customer returns and defective shipments stock updates.</p>
            </div>
          </div>

          <form onSubmit={handleReturnStockSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-150">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Return Product SKU</label>
              <select
                value={returnForm.productId}
                onChange={(e) => setReturnForm({ ...returnForm, productId: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              >
                {stock.map(item => (
                  <option key={item.id} value={item.id}>{item.sku} — {item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Return Pairs Count</label>
              <input 
                type="number"
                value={returnForm.qty}
                onChange={(e) => setReturnForm({ ...returnForm, qty: e.target.value })}
                placeholder="Pairs count"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reason / Status</label>
              <select
                value={returnForm.reason}
                onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
              >
                <option value="Defective Product">Defective Product (Damaged Sole)</option>
                <option value="Wrong Size Ordered">Wrong Size Mapped</option>
                <option value="Customer Return">Customer Return (Sale Refund)</option>
              </select>
            </div>
            <button 
              type="submit"
              className="py-2.5 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Log Return Stock
            </button>
          </form>

          <DataTable 
            columns={[
              { header: "Return ID", accessor: "_id", render: (val) => <span className="font-bold text-slate-800 font-mono">{val}</span> },
              { header: "Product Variant", accessor: "product_id", render: (val) => {
                const target = stock.find(item => item.id === val);
                return <span className="font-bold text-slate-800">{target?.sku || val}</span>;
              }},
              { header: "Quantity Returned", accessor: "quantity", render: (val) => <span className="font-bold text-rose-600">+{val} pairs</span> },
              { header: "Reason", accessor: "reason" },
              { header: "Notes", accessor: "notes" },
              { header: "Returned By", accessor: "returned_by" },
              { header: "Timestamp", accessor: "createdAt", render: (val) => <span>{new Date(val).toLocaleString()}</span> }
            ]} 
            data={returnHistory} 
            searchKeys={["reason", "notes"]}
            searchPlaceholder="Search returned logs history..."
          />
        </div>
      )}

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddWhOpen}
        onClose={() => setIsAddWhOpen(false)}
        title="Add Facility Node"
        onConfirm={handleAddWarehouseSubmit}
      >
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Warehouse Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Chennai Regional Whse"
              value={newWh.name}
              onChange={(e) => setNewWh({...newWh, name: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address Location *</label>
            <input 
              type="text" 
              placeholder="e.g. Bhiwandi, Maharashtra"
              value={newWh.location}
              onChange={(e) => setNewWh({...newWh, location: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Facility Manager</label>
              <select
                value={newWh.manager}
                onChange={(e) => setNewWh({...newWh, manager: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
              >
                {employees.map(emp => (
                  <option key={emp._id} value={emp.full_name || emp.name}>{emp.full_name || emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max Capacity</label>
              <input 
                type="text" 
                placeholder="e.g. 15,000 SKUs"
                value={newWh.capacity}
                onChange={(e) => setNewWh({...newWh, capacity: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Stock Transfer Request Modal */}
      <Modal
        isOpen={isRaiseBulkOpen}
        onClose={() => setIsRaiseBulkOpen(false)}
        title="Raise Facility Stock Transfer Request"
        onConfirm={handleStockTransferSubmit}
      >
        <form className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Source Facility (From) *</label>
              <select
                value={transferData.fromWh}
                onChange={(e) => setTransferData({...transferData, fromWh: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
              >
                {whList.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Facility (To) *</label>
              <select
                value={transferData.toWh}
                onChange={(e) => setTransferData({...transferData, toWh: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
              >
                {whList.map(w => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Footwear Product SKU *</label>
              <select
                value={transferData.product}
                onChange={(e) => setTransferData({...transferData, product: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
              >
                {productVariants.map(pv => (
                  <option key={pv._id} value={pv.sku}>{pv.sku} — {pv.product?.name || 'Variant'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity Received (Pairs) *</label>
              <input 
                type="number" 
                value={transferData.qty}
                onChange={(e) => setTransferData({...transferData, qty: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white text-slate-800"
                required
              />
            </div>
          </div>
        </form>
      </Modal>

    </div>
  );
}
