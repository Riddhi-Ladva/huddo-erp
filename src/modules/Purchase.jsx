// HUDDO-UPDATE: Purchase — Barcode sticker generation & Mobile scanner (Phase 2 early implementation)
import React, { useState, useEffect } from 'react';
import { ShoppingCart, QrCode, Plus, Eye, Printer, Scan, AlertTriangle, ShieldCheck, Camera, Laptop } from 'lucide-react';
import { initialProducts, initialInventory } from '../mockData';
import { DataTable, Modal } from '../components/Common';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Purchase({ showToast }) {
  const [purchaseEntries, setPurchaseEntries] = useState([
    { id: "PO-2026-001", name: "Huddo Air Classic", sku: "HDO-AC-RD-08", article_no: "ART-AC-01", colour: "Red", qty: 250, vendor: "Standard Sole Manufacturers", date: "2026-06-05", status: "Confirmed" },
    { id: "PO-2026-002", name: "Huddo Flex Runner", sku: "HDO-FR-GR-09", article_no: "ART-FR-02", colour: "Grey", qty: 120, vendor: "Comfort Rubber Ltd", date: "2026-06-08", status: "Confirmed" },
    { id: "PO-2026-003", name: "Huddo Elegant Derby", sku: "HDO-ED-BK-10", article_no: "ART-ED-03", colour: "Brown", qty: 80, vendor: "Derby Leather Tannery", date: "2026-06-10", status: "Draft" }
  ]);

  const [productsList, setProductsList] = useState(initialProducts);
  const [stock, setStock] = useState(initialInventory);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isQrMovementOpen, setIsQrMovementOpen] = useState(false);
  const [qrMovementType, setQrMovementType] = useState('IN'); // IN | OUT

  // Form states
  const [newEntry, setNewEntry] = useState({
    sku: '', name: '', article_no: '', colour: '', qty: '', vendor: 'Standard Sole Manufacturers'
  });
  
  const [qrForm, setQrForm] = useState({
    product_id: initialInventory[0]?.id || '',
    quantity: '',
    reference_id: '',
    notes: ''
  });

  // Print Barcode Sticker layout
  const handlePrintBarcode = (item) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast("Pop-up blocker prevented opening print page. Please allow popups.", "error");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode Sticker - ${item.sku}</title>
          <style>
            body { font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; margin: 0; background-color: #fff; }
            .sticker { border: 2px solid #1e293b; padding: 15px; border-radius: 8px; text-align: center; width: 280px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            .title { font-size: 15px; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; color: #0b1329; }
            .sku { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
            .metadata { font-size: 10px; font-weight: bold; color: #334155; margin-bottom: 12px; display: flex; justify-content: space-around; }
            .date { font-size: 9px; color: #94a3b8; font-weight: bold; margin-top: 10px; border-t: 1px dashed #cbd5e1; padding-top: 8px; }
            #barcode { margin: 10px auto; max-width: 100%; }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        </head>
        <body>
          <div class="sticker">
            <div class="title">${item.name}</div>
            <div class="sku">SKU: ${item.sku}</div>
            <div class="metadata">
              <span>ART: ${item.article_no || "N/A"}</span>
              <span>COLOUR: ${item.colour || "N/A"}</span>
            </div>
            <svg id="barcode"></svg>
            <div class="date">PRINT DATE: ${new Date().toLocaleDateString()}</div>
          </div>
          <script>
            setTimeout(() => {
              try {
                JsBarcode("#barcode", "${item.sku}", {
                  format: "CODE128",
                  width: 1.8,
                  height: 50,
                  displayValue: true,
                  fontSize: 10
                });
                window.print();
                window.close();
              } catch (e) {
                console.error("Barcode generation failed", e);
                window.close();
              }
            }, 600);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast(`Dispatched barcode print layout for SKU: ${item.sku}`, "success");
  };

  // Submit new purchase entry
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEntry.name || !newEntry.sku || !newEntry.qty) {
      showToast("Please complete the required form inputs.", "error");
      return;
    }

    const created = {
      id: `PO-2026-${String(purchaseEntries.length + 1).padStart(3, '0')}`,
      name: newEntry.name,
      sku: newEntry.sku,
      article_no: newEntry.article_no || "N/A",
      colour: newEntry.colour || "N/A",
      qty: Number(newEntry.qty),
      vendor: newEntry.vendor,
      date: new Date().toISOString().split('T')[0],
      status: "Confirmed"
    };

    setPurchaseEntries([created, ...purchaseEntries]);
    setIsAddOpen(false);
    
    // Auto trigger QR In stock addition simulation
    fetch('/api/inventory/qr-in', {
      method: 'POST',
      body: JSON.stringify({
        product_id: "INV001", // Default matching product variant
        quantity: Number(newEntry.qty),
        purchase_id: created.id,
        notes: "Automated arrival from purchase entry"
      })
    }).then(res => res.json())
      .then(data => {
        showToast(`Purchase order saved and stock levels updated (+${newEntry.qty} pairs).`, "success");
        setNewEntry({ sku: '', name: '', article_no: '', colour: '', qty: '', vendor: 'Standard Sole Manufacturers' });
      })
      .catch(err => console.error(err));
  };

  // QR Stock In / Out Submit
  const handleQrMovementSubmit = (e) => {
    e.preventDefault();
    if (!qrForm.quantity) {
      showToast("Quantity is required", "error");
      return;
    }

    const endpoint = qrMovementType === 'IN' ? '/api/inventory/qr-in' : '/api/inventory/qr-out';
    const bodyObj = qrMovementType === 'IN' 
      ? { product_id: qrForm.product_id, quantity: Number(qrForm.quantity), purchase_id: qrForm.reference_id || `PO-${Date.now()}`, notes: qrForm.notes, timestamp: new Date().toISOString() }
      : { product_id: qrForm.product_id, quantity: Number(qrForm.quantity), reference_id: qrForm.reference_id || `REF-${Date.now()}`, notes: qrForm.notes, timestamp: new Date().toISOString() };

    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(bodyObj)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Movement request failed");
        }
        return data;
      })
      .then(data => {
        // Sync local stock representation
        const targetItem = stock.find(item => item.id === qrForm.product_id);
        const newLevel = qrMovementType === 'IN' 
          ? targetItem.stockLevel + Number(qrForm.quantity)
          : targetItem.stockLevel - Number(qrForm.quantity);
          
        setStock(stock.map(s => s.id === qrForm.product_id ? { ...s, stockLevel: newLevel } : s));
        setIsQrMovementOpen(false);
        setQrForm({ product_id: stock[0]?.id || '', quantity: '', reference_id: '', notes: '' });
        showToast(`QR Stock ${qrMovementType} recorded successfully. Updated stock: ${newLevel} pairs.`, "success");
      })
      .catch(err => {
        showToast(err.message, "error");
      });
  };

  // Initialize html5-qrcode scanner inside modal
  const [scannerTab, setScannerTab] = useState('sim'); // sim | camera
  useEffect(() => {
    let html5QrcodeScanner = null;
    if (isScanOpen && scannerTab === 'camera') {
      const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        handleBarcodeMatch(decodedText);
      };
      
      const onScanFailure = (error) => {
        // quiet fail
      };

      html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(err => console.error("Scanner clear error", err));
      }
    };
  }, [isScanOpen, scannerTab]);

  const handleBarcodeMatch = (code) => {
    // Match against our products database
    // We match by product's SKU or Article No
    const matched = productsList.find(p => p.sku === code || p.article_no === code || p.name.toLowerCase().includes(code.toLowerCase()));
    
    if (matched) {
      setNewEntry({
        ...newEntry,
        sku: matched.sku || "HDO-AC-RD-08",
        name: matched.name,
        article_no: matched.article_no || "ART-AC-01",
        colour: matched.colour || "Red"
      });
      setIsScanOpen(false);
      showToast(`Scanned product matched: ${matched.name}`, "success");
    } else {
      showToast(`Scanned code "${code}" does not match any registered product SKU.`, "error");
    }
  };

  const columns = [
    { header: "PO Number", accessor: "id", render: (val) => <span className="font-bold text-slate-800 font-mono">{val}</span> },
    { header: "Product Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "SKU Code", accessor: "sku", render: (val) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-bold text-slate-600 font-mono">{val}</code> },
    { header: "Article No.", accessor: "article_no" },
    { header: "Colour", accessor: "colour" },
    { header: "Qty Received", accessor: "qty", render: (val) => <span className="font-bold text-slate-800">{val} pairs</span> },
    { header: "Vendor Source", accessor: "vendor" },
    { header: "Date Entry", accessor: "date" },
    { header: "Label Actions", accessor: "id", sortable: false, render: (val, row) => (
      <button 
        onClick={() => handlePrintBarcode(row)}
        className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:border-brand-orange hover:text-brand-orange rounded text-xs font-bold text-slate-700 transition-colors shadow-xs"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Barcode</span>
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <ShoppingCart className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Purchases (This Month)</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">450 Pairs</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <QrCode className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">QR Inbound Audits</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">14 Successful</h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center gap-4">
          <span className="p-3 bg-orange-50 text-brand-orange rounded-xl border border-orange-100">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Quality Verified Tiers</span>
            <h3 className="text-xl font-bold text-slate-800 font-display mt-0.5">100% Passed</h3>
          </div>
        </div>
      </div>

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-display">Purchase & Inbound Operations</h1>
          <p className="text-xs text-slate-500 font-semibold">Track vendor wholesale deliveries, generate printable Code128 barcode stickers, and scan product credentials.</p>
        </div>
        <div className="flex gap-2 self-start">
          <button 
            onClick={() => { setQrMovementType('IN'); setIsQrMovementOpen(true); }}
            className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors"
          >
            QR Stock Inbound (In)
          </button>
          <button 
            onClick={() => { setQrMovementType('OUT'); setIsQrMovementOpen(true); }}
            className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors"
          >
            QR Stock Outbound (Out)
          </button>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Entry</span>
          </button>
        </div>
      </div>

      {/* Purchase Entries Table */}
      <DataTable 
        columns={columns} 
        data={purchaseEntries} 
        searchKeys={["id", "name", "sku", "vendor"]}
        searchPlaceholder="Search purchase entries..."
      />

      {/* Create Purchase Entry Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Purchase Entry"
        onConfirm={handleAddSubmit}
      >
        <form className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product SKU / Barcode *</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Scan or enter SKU (e.g. HDO-AC-RD-08)" 
                value={newEntry.sku}
                onChange={(e) => setNewEntry({...newEntry, sku: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 bg-white text-slate-800"
                required
              />
              <button 
                type="button"
                onClick={() => setIsScanOpen(true)}
                className="px-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors"
                title="Scan Barcode using Camera"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Product Name *</label>
              <input 
                type="text" 
                placeholder="Product Name" 
                value={newEntry.name}
                onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity Received *</label>
              <input 
                type="number" 
                placeholder="Pairs Count" 
                value={newEntry.qty}
                onChange={(e) => setNewEntry({...newEntry, qty: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Article No.</label>
              <input 
                type="text" 
                placeholder="Article Number" 
                value={newEntry.article_no}
                onChange={(e) => setNewEntry({...newEntry, article_no: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Colour</label>
              <input 
                type="text" 
                placeholder="Colour" 
                value={newEntry.colour}
                onChange={(e) => setNewEntry({...newEntry, colour: e.target.value})}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor Supplier *</label>
            <select
              value={newEntry.vendor}
              onChange={(e) => setNewEntry({...newEntry, vendor: e.target.value})}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="Standard Sole Manufacturers">Standard Sole Manufacturers</option>
              <option value="Comfort Rubber Ltd">Comfort Rubber Ltd</option>
              <option value="Derby Leather Tannery">Derby Leather Tannery</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Barcode Scanner popup Modal */}
      <Modal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        title="Mobile Barcode Scanner (Phase 2)"
      >
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 p-0.5 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setScannerTab('sim')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${scannerTab === 'sim' ? 'bg-white text-brand-orange shadow-xs' : 'text-slate-500'}`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Mock Scanner Simulator</span>
            </button>
            <button 
              onClick={() => setScannerTab('camera')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-md transition-all ${scannerTab === 'camera' ? 'bg-white text-brand-orange shadow-xs' : 'text-slate-500'}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Hardware</span>
            </button>
          </div>

          {scannerTab === 'sim' ? (
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-brand-orange flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Select a product to simulate a barcode camera scan on your desktop or simulator environment.</p>
              </div>
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {productsList.map(prod => (
                  <button 
                    key={prod.id}
                    type="button"
                    onClick={() => handleBarcodeMatch(prod.sku)}
                    className="w-full p-2.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between font-semibold"
                  >
                    <span className="text-slate-800">{prod.name} ({prod.colour})</span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">{prod.sku}</code>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <div id="reader" className="w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200"></div>
              <p className="text-[10px] text-slate-400 font-bold">Please allow camera permissions when requested by Vite dev server.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* QR Stock In / Out Modal */}
      <Modal
        isOpen={isQrMovementOpen}
        onClose={() => setIsQrMovementOpen(false)}
        title={`QR Stock Movement — QR ${qrMovementType}`}
        onConfirm={handleQrMovementSubmit}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Footwear Product variant *</label>
            <select
              value={qrForm.product_id}
              onChange={(e) => setQrForm({ ...qrForm, product_id: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none"
            >
              {stock.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (SKU: {item.sku}, Size: {item.size}, Color: {item.color}) — Current stock: {item.stockLevel}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity (Pairs) *</label>
              <input 
                type="number" 
                placeholder="e.g. 25"
                value={qrForm.quantity}
                onChange={(e) => setQrForm({ ...qrForm, quantity: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                {qrMovementType === 'IN' ? 'Purchase Order Ref' : 'Dispatched Ref'}
              </label>
              <input 
                type="text" 
                placeholder="e.g. PO-2026-001"
                value={qrForm.reference_id}
                onChange={(e) => setQrForm({ ...qrForm, reference_id: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Audit Notes / Comments</label>
            <textarea 
              rows="2" 
              placeholder="e.g. Returned due to minor packaging tears."
              value={qrForm.notes}
              onChange={(e) => setQrForm({ ...qrForm, notes: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none bg-white text-slate-800"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
