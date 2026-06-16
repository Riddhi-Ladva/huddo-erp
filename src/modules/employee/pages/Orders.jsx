import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Eye, CheckCircle2, XCircle, 
  Trash2, DollarSign, Calendar, SlidersHorizontal, Image
} from 'lucide-react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { mockOrders as initialOrders } from '../mockData/mockOrders';
import { mockRetailers } from '../mockData/mockRetailers';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function Orders({ showToast }) {
  const { currentEmployee, activeRole } = useEmployeeAuth();
  
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Create New Order states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [retailerId, setRetailerId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [productsList, setProductsList] = useState([]);
  
  // Selected single product build state
  const [prodName, setProdName] = useState("Huddo Running Shoes Blue");
  const [prodQty, setProdQty] = useState(1);
  const [prodSize, setProdSize] = useState("9");
  const [prodColor, setProdColor] = useState("Blue");
  const [prodPrice, setProdPrice] = useState(1500);

  const isManager = activeRole === 'sales_manager';

  // Filter orders based on role + status filter
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];
    
    // If executive, only show their own orders
    if (!isManager) {
      result = result.filter(o => o.collectedById === currentEmployee.id);
    }
    
    if (filterStatus !== "All") {
      result = result.filter(o => o.status === filterStatus);
    }
    
    return result;
  }, [orders, filterStatus, isManager, currentEmployee]);

  // Product helper pricing
  const updateProductPrice = (name) => {
    setProdName(name);
    if (name.includes("Boots")) setProdPrice(3000);
    else if (name.includes("Slides")) setProdPrice(1000);
    else if (name.includes("Grip")) setProdPrice(1600);
    else setProdPrice(1500); // Running / Sneakers
  };

  const handleAddProductItem = () => {
    if (prodQty <= 0) return;
    const newItem = {
      name: prodName,
      quantity: Number(prodQty),
      size: prodSize,
      color: prodColor,
      price: Number(prodPrice)
    };
    setProductsList([...productsList, newItem]);
    // reset form fields
    setProdQty(1);
  };

  const handleRemoveProductItem = (idx) => {
    setProductsList(productsList.filter((_, i) => i !== idx));
  };

  const calculatedTotal = productsList.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Submit collected order
  const handleCollectNewOrderSubmit = () => {
    if (!retailerId) {
      showToast("Please select a retailer.", "error");
      return;
    }
    if (productsList.length === 0) {
      showToast("Please add at least one product line item.", "error");
      return;
    }
    if (!utrNumber) {
      showToast("Please log the payment UTR number.", "error");
      return;
    }

    const retName = mockRetailers.find(r => r.id === retailerId)?.name || "Unknown Retailer";

    const newOrder = {
      id: `ORD-${String(9000 + orders.length + 1)}`,
      retailerName: retName,
      date: new Date().toISOString().split('T')[0],
      amount: calculatedTotal,
      paymentStatus: "Pending",
      status: "Submitted",
      collectedBy: currentEmployee.name,
      collectedById: currentEmployee.id,
      utr: utrNumber,
      paymentScreenshot: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
      items: productsList
    };

    setOrders([newOrder, ...orders]);
    setIsCreateOpen(false);
    setRetailerId("");
    setUtrNumber("");
    setProductsList([]);
    showToast(`Order ${newOrder.id} collected and submitted for manager approval.`, "success");
  };

  // Manager actions
  const handleOrderApproval = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus, paymentStatus: newStatus === 'Approved' ? 'Verified' : o.paymentStatus } 
        : o
    ));
    showToast(`Order ${orderId} has been successfully ${newStatus.toLowerCase()}.`, "success");
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const tableColumns = [
    { header: "Order ID", accessor: "id" },
    { header: "Retailer Name", accessor: "retailerName", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Date", accessor: "date" },
    { header: "Amount", accessor: "amount", render: (val) => `₹${val.toLocaleString('en-IN')}` },
    { 
      header: isManager ? "Collected By" : "Payment Status", 
      accessor: isManager ? "collectedBy" : "paymentStatus",
      render: (val) => isManager ? <span className="font-semibold text-slate-600">{val}</span> : <StatusBadge status={val} />
    },
    { header: "Order Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Actions", 
      accessor: "id", 
      sortable: false, 
      render: (val, row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedOrder(row)}
            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isManager && row.status === 'Submitted' && (
            <>
              <button 
                onClick={() => handleOrderApproval(row.id, "Approved")}
                className="p-1 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-800 rounded transition-colors cursor-pointer"
                title="Approve Order"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleOrderApproval(row.id, "Cancelled")}
                className="p-1 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded transition-colors cursor-pointer"
                title="Reject Order"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">
            {isManager ? "Team Orders Workspace" : "My Collected Orders"}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isManager ? "Review and approve/reject orders collected by your regional sales executives." : "Create and log orders collected directly from distributors."}
          </p>
        </div>

        {!isManager && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Collect New Order</span>
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500">Filters:</span>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
        
        <div className="text-[10px] text-slate-400 font-bold">
          Found {filteredOrders.length} records matching parameters
        </div>
      </div>

      {/* Orders Table */}
      <CustomDataTable 
        columns={tableColumns}
        data={filteredOrders}
        searchKeys={["id", "retailerName", "status", "collectedBy"]}
        searchPlaceholder="Search order database..."
      />

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <CustomModal
          isOpen={selectedOrder !== null}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.id}`}
          size="lg"
          confirmText={isManager && selectedOrder.status === 'Submitted' ? "Approve Order" : undefined}
          onConfirm={isManager && selectedOrder.status === 'Submitted' ? () => handleOrderApproval(selectedOrder.id, "Approved") : undefined}
        >
          <div className="space-y-6">
            
            {/* Meta status info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Retailer Name</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{selectedOrder.retailerName}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
                <span className="text-xs font-extrabold text-brand-orange mt-1 block">₹{selectedOrder.amount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Collected By</span>
                <span className="text-xs font-bold text-slate-700 mt-1 block">{selectedOrder.collectedBy}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Order Status</span>
                <div className="mt-1 block">
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Line Items</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                      <th className="p-3">Product Name</th>
                      <th className="p-3 text-center">Specs</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {selectedOrder.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold">{item.name}</td>
                        <td className="p-3 text-center text-[10px] text-slate-400 font-bold">Size: {item.size} / {item.color}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-bold text-slate-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment screenshot preview and UTR details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400 font-semibold">Payment Status:</span>
                    <StatusBadge status={selectedOrder.paymentStatus} />
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-slate-400 font-semibold">UTR Number:</span>
                    <span className="font-extrabold text-slate-800">{selectedOrder.utr || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">Collect Date:</span>
                    <span className="font-semibold text-slate-700">{selectedOrder.date}</span>
                  </div>
                </div>
                
                {isManager && selectedOrder.status === 'Submitted' && (
                  <div className="flex gap-3 pt-3">
                    <button 
                      onClick={() => handleOrderApproval(selectedOrder.id, "Approved")}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                    >
                      Approve Order
                    </button>
                    <button 
                      onClick={() => handleOrderApproval(selectedOrder.id, "Cancelled")}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                    >
                      Reject / Decline
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Receipt Preview</h4>
                {selectedOrder.paymentScreenshot ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden h-36 relative bg-slate-50 flex items-center justify-center">
                    <img 
                      src={selectedOrder.paymentScreenshot} 
                      alt="Payment Slip Screenshot" 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors flex items-center justify-center">
                      <span className="px-2 py-1 bg-black/50 text-white rounded text-[8px] font-extrabold uppercase tracking-wider">Screenshot Verified</span>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl h-36 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold">
                    <Image className="w-8 h-8 mb-1" />
                    <span>No Screenshot uploaded</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </CustomModal>
      )}

      {/* Collect Order Wizard Modal */}
      <CustomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Collect New Order Wizard"
        size="lg"
        confirmText="Submit Collected Order"
        onConfirm={handleCollectNewOrderSubmit}
      >
        <div className="space-y-5">
          
          {/* Step 1: Select Retailer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Retailer *</label>
              <select
                value={retailerId}
                onChange={(e) => setRetailerId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="">-- Choose Retailer --</option>
                {mockRetailers.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Payment UTR Code *</label>
              <input 
                type="text" 
                placeholder="UTR1234567890" 
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Line items selector */}
          <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-xl space-y-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Add Product Line Item</span>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Product Name</label>
                <select
                  value={prodName}
                  onChange={(e) => updateProductPrice(e.target.value)}
                  className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="Huddo Running Shoes Blue">Huddo Running Shoes Blue</option>
                  <option value="Huddo Casual Sneakers White">Huddo Casual Sneakers White</option>
                  <option value="Huddo Leather Boots Black">Huddo Leather Boots Black</option>
                  <option value="Huddo Comfort Slides Grey">Huddo Comfort Slides Grey</option>
                  <option value="Huddo Sports Grip Yellow">Huddo Sports Grip Yellow</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Size</label>
                  <select
                    value={prodSize}
                    onChange={(e) => setProdSize(e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Color</label>
                  <select
                    value={prodColor}
                    onChange={(e) => setProdColor(e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="Blue">Blue</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Grey">Grey</option>
                    <option value="Yellow">Yellow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  value={prodQty}
                  onChange={(e) => setProdQty(e.target.value)}
                  className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddProductItem}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold transition-all cursor-pointer text-center"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Added list */}
            {productsList.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mt-3">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                      <th className="p-2 pl-3">Product</th>
                      <th className="p-2 text-center">Specs</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2 text-center pr-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {productsList.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 pl-3 font-semibold">{item.name}</td>
                        <td className="p-2 text-center text-[9px] text-slate-400">Size: {item.size} / {item.color}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.price.toLocaleString()}</td>
                        <td className="p-2 text-right font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                        <td className="p-2 text-center pr-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveProductItem(idx)}
                            className="p-1 hover:bg-rose-50 text-rose-600 hover:text-rose-800 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment screenshot simulation */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Simulated Payment Receipt Upload *</label>
            <div className="border border-dashed border-slate-200 rounded-lg p-3 bg-slate-50/50 text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100/50 transition-colors">
              <Image className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-600">Simulate Upload Payment Screenshot</span>
              <span className="text-[8px] text-slate-450">PNG, JPG, PDF up to 4MB</span>
            </div>
          </div>

          {/* Total display */}
          <div className="flex justify-between items-center bg-slate-900 text-white px-4 py-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Calculated Order Total:</span>
            <span className="text-lg font-extrabold text-brand-orange font-display">₹{calculatedTotal.toLocaleString('en-IN')}</span>
          </div>

        </div>
      </CustomModal>

    </div>
  );
}
