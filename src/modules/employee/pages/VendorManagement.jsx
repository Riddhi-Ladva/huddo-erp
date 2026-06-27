import React, { useState } from 'react';
import { 
  Plus, Eye, Users, FileText, CheckCircle2, 
  MapPin, Landmark, Send, X
} from 'lucide-react';
import { mockVendors as initialVendors } from '../mockData/mockVendors';
import StatusBadge from '../components/StatusBadge';
import CustomDataTable from '../components/CustomDataTable';
import CustomModal from '../components/CustomModal';

export default function VendorManagement({ showToast }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Form states
  const [vendorName, setVendorName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [productsSupplied, setProductsSupplied] = useState("");

  const handleAddVendorSubmit = () => {
    if (!vendorName.trim() || !contactPerson.trim() || !mobile || !email || !gst) {
      showToast("Please fill all required supplier fields.", "error");
      return;
    }

    const newVendor = {
      id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
      name: vendorName,
      contactPerson,
      mobile,
      email,
      gst,
      products: productsSupplied || "Shoe Accessories",
      status: "Active",
      history: []
    };

    setVendors([...vendors, newVendor]);
    setIsAddOpen(false);
    setVendorName("");
    setContactPerson("");
    setMobile("");
    setEmail("");
    setGst("");
    setProductsSupplied("");
    showToast(`Supplier ${newVendor.name} successfully registered.`, "success");
  };

  const columns = [
    { header: "Vendor ID", accessor: "id" },
    { header: "Company Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800">{val}</span> },
    { header: "Contact Person", accessor: "contactPerson" },
    { header: "Mobile Number", accessor: "mobile" },
    { header: "Email Address", accessor: "email" },
    { header: "GST Number", accessor: "gst", render: (val) => <span className="font-mono font-bold text-[10px] text-slate-500">{val}</span> },
    { header: "Supplies Category", accessor: "products" },
    { header: "Status", accessor: "status", render: (val) => <StatusBadge status={val} /> },
    { 
      header: "Action", 
      accessor: "id", 
      sortable: false, 
      render: (_, row) => (
        <button 
          onClick={() => setSelectedVendor(row)}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-205 hover:bg-slate-50 transition-colors text-slate-650 cursor-pointer"
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
          <h1 className="text-xl font-bold text-slate-900 font-display">Supplier Registry</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage vendor contact databases, log raw materials category, and audit order ledgers.</p>
        </div>

        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Roster table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Active suppliers directory</h3>
        
        <CustomDataTable 
          columns={columns}
          data={vendors}
          searchKeys={["id", "name", "contactPerson", "gst", "products"]}
          searchPlaceholder="Search supplier database..."
        />
      </div>

      {/* View Vendor Detail Drawer Overlay */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Landmark className="w-6 h-6 text-brand-orange" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-display">{selectedVendor.name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">Vendor ID: {selectedVendor.id} &bull; GST: {selectedVendor.gst}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contents */}
              <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                {/* Contact profiles */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-650 font-medium">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary contact info</span>
                  <div className="flex justify-between"><span>Contact Person:</span><span className="font-bold text-slate-800">{selectedVendor.contactPerson}</span></div>
                  <div className="flex justify-between"><span>Mobile Number:</span><span className="font-bold text-slate-800">{selectedVendor.mobile}</span></div>
                  <div className="flex justify-between"><span>Email Address:</span><span className="font-semibold text-slate-800">{selectedVendor.email}</span></div>
                  <div className="flex justify-between"><span>Material Category:</span><span className="font-bold text-slate-800">{selectedVendor.products}</span></div>
                </div>

                {/* Purchase History */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider border-b border-slate-100 pb-1">Purchase orders history</span>
                  {selectedVendor.history && selectedVendor.history.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                            <th className="p-2.5 pl-3">PO Number</th>
                            <th className="p-2.5">Date</th>
                            <th className="p-2.5 text-right">Amount</th>
                            <th className="p-2.5 text-center pr-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          {selectedVendor.history.map((h, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 pl-3 font-semibold">{h.poNumber}</td>
                              <td className="p-2.5">{h.date}</td>
                              <td className="p-2.5 text-right">₹{h.amount.toLocaleString()}</td>
                              <td className="p-2.5 text-center pr-3">
                                <StatusBadge status={h.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-450 font-bold italic py-4 text-center">No past purchase orders found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close Vendor Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal Form */}
      <CustomModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Supplier Form"
        confirmText="Register Vendor"
        onConfirm={handleAddVendorSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Company / Vendor Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Supreme Rubber Products" 
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Contact Person *</label>
              <input 
                type="text" 
                placeholder="Rajesh Singhania" 
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">GST Number *</label>
              <input 
                type="text" 
                placeholder="27AAACS1234A1Z1" 
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-755 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile Number *</label>
              <input 
                type="text" 
                placeholder="+91 98220 12345" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address *</label>
              <input 
                type="email" 
                placeholder="rajesh@supremerubber.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Supplied Raw Materials / Category *</label>
            <input 
              type="text" 
              placeholder="e.g. Premium Outsoles, Rubber Sheets" 
              value={productsSupplied}
              onChange={(e) => setProductsSupplied(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white font-medium text-slate-750 focus:outline-none"
            />
          </div>
        </div>
      </CustomModal>

    </div>
  );
}
