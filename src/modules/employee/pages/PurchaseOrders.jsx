import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Eye, CheckCircle2, Trash2, 
  Landmark, ClipboardList, Send, Calendar, X
} from 'lucide-react';
import { mockPurchaseOrders as initialPOs } from '../mockData/mockPurchaseOrders';
import { mockVendors } from '../mockData/mockVendors';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function PurchaseOrders({ showToast }) {
  const [pos, setPos] = useState(initialPOs);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [vendorId, setVendorId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState([]);
  
  // Single line item states
  const [itemProduct, setItemProduct] = useState("Premium Rubber Outsoles (Size 9)");
  const [itemQty, setItemQty] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const handleAddLineItem = () => {
    if (!itemQty || !itemPrice) return;
    const newItem = {
      product: itemProduct,
      quantity: Number(itemQty),
      unitPrice: Number(itemPrice),
      total: Number(itemQty) * Number(itemPrice)
    };
    setLineItems([...lineItems, newItem]);
    setItemQty("");
    setItemPrice("");
  };

  const handleRemoveLineItem = (idx) => {
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const calculatedTotal = lineItems.reduce((acc, item) => acc + item.total, 0);

  const handleCreatePOSubmit = () => {
    if (!vendorId || !deliveryDate) {
      showToast("Please select a vendor and delivery date.", "error");
      return;
    }
    if (lineItems.length === 0) {
      showToast("Please add at least one line item.", "error");
      return;
    }

    const vName = mockVendors.find(v => v.id === vendorId)?.name || "Unknown Supplier";

    const newPO = {
      poNumber: `PO-2026-${String(pos.length + 1).padStart(3, '0')}`,
      vendorName: vName,
      vendorId,
      date: new Date().toISOString().split('T')[0],
      deliveryDate,
      totalAmount: calculatedTotal,
      status: "Submitted",
      requestedBy: "Karan Johar", // Purchase Manager
      items: lineItems,
      notes,
      timeline: [
        { status: "Draft", date: new Date().toISOString().split('T')[0], note: "Created by Karan Johar" },
        { status: "Submitted", date: new Date().toISOString().split('T')[0], note: "Submitted for manager review" }
      ],
      qcStatus: "Pending",
      qcNotes: ""
    };

    setPos([newPO, ...pos]);
    setIsCreateOpen(false);
    setVendorId("");
    setDeliveryDate("");
    setNotes("");
    setLineItems([]);
    showToast(`Purchase Order ${newPO.poNumber} successfully drafted and submitted.`, "success");
  };

  const columns = [
    { header: "PO Number", accessor: "poNumber", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Supplier / Vendor", accessor: "vendorName", render: (val) => <span className="font-bold text-slate-700">{val}</span> },
    { header: "Date Raised", accessor: "date" },
    { header: "Delivery Date", accessor: "deliveryDate" },
    { header: "Total Value", accessor: "totalAmount", render: (val) => `₹${val.toLocaleString()}` },
    { header: "PO Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Action", 
      accessor: "poNumber", 
      sortable: false, 
      render: (_, row) => (
        <button 
          onClick={() => setSelectedPO(row)}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-650 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Purchase Orders (PO)</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage raw materials procurement orders and track status pipelines.</p>
        </div>

        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Purchase Order</span>
        </button>
      </div>

      {/* PO table registry */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Procurement PO Roster database</h3>
        
        <CustomDataTable 
          columns={columns}
          data={pos}
          searchKeys={["poNumber", "vendorName", "status"]}
          searchPlaceholder="Search purchase orders..."
        />
      </div>

      {/* PO Details Drawer Overlay */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between font-medium">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-brand-orange" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-display">Details PO: {selectedPO.poNumber}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Vendor: {selectedPO.vendorName} &bull; Date: {selectedPO.date}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedPO(null)}
                  className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contents */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto text-xs">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div><span className="text-slate-400 font-semibold">Delivery Due Date</span><p className="font-bold text-slate-800 mt-0.5">{selectedPO.deliveryDate}</p></div>
                  <div><span className="text-slate-400 font-semibold">Total Amount</span><p className="font-extrabold text-brand-orange mt-0.5">₹{selectedPO.totalAmount.toLocaleString()}</p></div>
                  <div><span className="text-slate-400 font-semibold">Requested By</span><p className="font-bold text-slate-805 mt-0.5">{selectedPO.requestedBy}</p></div>
                  <div><span className="text-slate-400 font-semibold">Filing Status</span><div className="mt-0.5"><StatusBadge status={selectedPO.status} /></div></div>
                </div>

                {/* Line Items Table */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">PO Line items list</span>
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                          <th className="p-2.5 pl-3">Product Description</th>
                          <th className="p-2.5 text-center">Qty</th>
                          <th className="p-2.5 text-right">Unit Price</th>
                          <th className="p-2.5 text-right pr-3">Total Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {selectedPO.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 pl-3 font-semibold">{item.product}</td>
                            <td className="p-2.5 text-center">{item.quantity}</td>
                            <td className="p-2.5 text-right">₹{item.unitPrice.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-extrabold text-slate-800 pr-3">₹{item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-1">Order workflow timeline</span>
                  <div className="relative border-l border-slate-150 pl-4 space-y-3">
                    {selectedPO.timeline?.map((t, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[20.5px] top-1 w-2 h-2 bg-brand-orange border border-white rounded-full"></span>
                        <span className="text-[9px] font-bold text-slate-400">{t.date}</span>
                        <span className="font-bold text-slate-800 block">{t.status}</span>
                        {t.note && <p className="text-[10px] text-slate-500 mt-0.5">{t.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedPO(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close PO Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PO Create Modal Form */}
      <CustomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Purchase Order Form"
        size="lg"
        confirmText="Submit Purchase Order"
        onConfirm={handleCreatePOSubmit}
      >
        <div className="space-y-4">
          
          {/* Vendor and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Supplier *</label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="">-- Choose Vendor --</option>
                {mockVendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expected Delivery Date *</label>
              <input 
                type="date" 
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Add item interface */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Line Item</span>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Product Description</label>
                <select
                  value={itemProduct}
                  onChange={(e) => setItemProduct(e.target.value)}
                  className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="Premium Rubber Outsoles (Size 9)">Premium Rubber Outsoles (Size 9)</option>
                  <option value="Printed Shoeboxes - Standard Blue">Printed Shoeboxes - Standard Blue</option>
                  <option value="Suede Leather - Premium Black">Suede Leather - Premium Black</option>
                  <option value="Polyester Shoelaces (1.2m White)">Polyester Shoelaces (1.2m White)</option>
                  <option value="EVA Insoles Comfort Cushion">EVA Insoles Comfort Cushion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Quantity</label>
                  <input 
                    type="number" 
                    placeholder="1000" 
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded p-1 focus:outline-none bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="80" 
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full text-[11px] border border-slate-200 rounded p-1 focus:outline-none bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddLineItem}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer text-center"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Line items list */}
            {lineItems.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white mt-3 text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                      <th className="p-2 pl-3">Product</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2 text-center pr-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {lineItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 pl-3 font-semibold">{item.product}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.unitPrice}</td>
                        <td className="p-2 text-right font-bold">₹{item.total.toLocaleString()}</td>
                        <td className="p-2 text-center pr-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(idx)}
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

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Procurement Notes / Remarks</label>
            <textarea 
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Include supplier directions or instructions..."
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center bg-slate-900 text-white px-4 py-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider font-display">Estimated PO total outlay:</span>
            <span className="text-lg font-extrabold text-brand-orange font-display">₹{calculatedTotal.toLocaleString()}</span>
          </div>

        </div>
      </CustomModal>

    </div>
  );
}
