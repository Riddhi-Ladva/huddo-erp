import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, ShoppingBag, Landmark, 
  HelpCircle, SlidersHorizontal, ShieldAlert
} from 'lucide-react';
import { mockPurchaseOrders } from '../mockData/mockPurchaseOrders';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function MaterialTracking({ showToast }) {
  // Filter POs that have status Received
  const [materials, setMaterials] = useState(() => {
    return mockPurchaseOrders.filter(po => po.status === 'Received');
  });

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [qcNotes, setQcNotes] = useState("");

  const handleQualityCheck = (poNo, passed) => {
    setMaterials(prev => prev.map(m => 
      m.poNumber === poNo 
        ? { ...m, qcStatus: passed ? "Passed QC" : "Failed QC", qcNotes: qcNotes || (passed ? "Passed inspection" : "Failed inspection") } 
        : m
    ));
    showToast(`Material batch for ${poNo} marked as Quality Check ${passed ? "Passed" : "Failed"}.`, "success");
    setSelectedMaterial(null);
    setQcNotes("");
  };

  const columns = [
    { header: "PO Number", accessor: "poNumber", render: (val) => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { header: "Supplier / Vendor", accessor: "vendorName", render: (val) => <span className="font-bold text-slate-700">{val}</span> },
    { header: "Date Received", accessor: "deliveryDate" },
    { 
      header: "Materials Items", 
      accessor: "items", 
      render: (val) => val.map(item => `${item.product} (Qty: ${item.quantity})`).join(', ')
    },
    { 
      header: "QC Status", 
      accessor: "qcStatus", 
      render: (val, row) => {
        const status = val === 'Passed' ? 'Passed QC' : (val === 'Failed' ? 'Failed QC' : val);
        return <StatusBadge status={status} />;
      }
    },
    { header: "Audit Remarks", accessor: "qcNotes", render: (val) => val || <span className="text-slate-400 italic text-[11px]">Pending inspection</span> },
    { 
      header: "Actions", 
      accessor: "poNumber", 
      sortable: false, 
      render: (val, row) => {
        if (row.qcStatus === 'Pending') {
          return (
            <button 
              onClick={() => setSelectedMaterial(row)}
              className="flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-brand-orange bg-brand-orange text-white hover:bg-brand-orange-hover transition-colors cursor-pointer"
            >
              <span>Quality Check</span>
            </button>
          );
        }
        return (
          <span className="text-[10px] text-slate-400 font-bold italic">Audited</span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top dashboard control headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Material QA Tracking</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Inspect raw materials received at warehouses and sign off quality passes.</p>
        </div>
      </div>

      {/* Roster table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-805 uppercase tracking-wider font-display flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-slate-450" />
          Received Raw Materials logs
        </h3>

        <CustomDataTable 
          columns={columns}
          data={materials}
          searchKeys={["poNumber", "vendorName", "qcStatus", "qcNotes"]}
          searchPlaceholder="Search materials inventory..."
        />
      </div>

      {/* QC Form Modal Dialog */}
      {selectedMaterial && (
        <CustomModal
          isOpen={selectedMaterial !== null}
          onClose={() => setSelectedMaterial(null)}
          title={`Quality Check Inspection Form: ${selectedMaterial.poNumber}`}
          confirmText="Approve QC (Pass)"
          onConfirm={() => handleQualityCheck(selectedMaterial.poNumber, true)}
        >
          <div className="space-y-4 font-semibold text-xs text-slate-655">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-2 gap-4">
              <div>
                <span>Supplier / Vendor</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedMaterial.vendorName}</p>
              </div>
              <div>
                <span>Delivery Date</span>
                <p className="font-bold text-slate-850 mt-0.5">{selectedMaterial.deliveryDate}</p>
              </div>
              <div className="col-span-2">
                <span>Received Items list</span>
                <p className="font-bold text-slate-700 mt-0.5">
                  {selectedMaterial.items.map(item => `${item.product} (Qty: ${item.quantity})`).join(', ')}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">QA Audit notes *</label>
              <textarea 
                rows="2"
                value={qcNotes}
                onChange={(e) => setQcNotes(e.target.value)}
                placeholder="Include remarks on material condition or thread tensile testing..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleQualityCheck(selectedMaterial.poNumber, false)}
                className="flex-1 py-2 bg-rose-605 hover:bg-rose-700 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer text-center bg-rose-50"
              >
                Fail Quality Check
              </button>
            </div>
          </div>
        </CustomModal>
      )}

    </div>
  );
}
