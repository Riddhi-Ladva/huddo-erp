import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, Calendar, 
  FileText, ArrowDownToLine, Landmark, RefreshCw
} from 'lucide-react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';

export default function Profile({ showToast }) {
  const { currentEmployee, setCurrentEmployee } = useEmployeeAuth();

  // Local state for editable fields
  const [formData, setFormData] = useState({
    name: currentEmployee.name || "",
    email: currentEmployee.email || "",
    mobile: currentEmployee.mobile || "",
    address: currentEmployee.address || ""
  });

  const [profilePhoto, setProfilePhoto] = useState(
    currentEmployee.role === 'sales_executive' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfilePhoto(uploadEvent.target.result);
        showToast("Profile photo uploaded successfully!", "success");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setCurrentEmployee(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address
    }));
    showToast("Profile details updated successfully!", "success");
  };

  const handleBankEditRequest = () => {
    showToast("Bank details change request dispatched to HR Manager (Nisha Sen) for verification.", "success");
  };

  const handleDocumentDownload = (docName) => {
    showToast(`Downloading document: ${docName}... (Mock download successful)`, "success");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar: Photo and read-only details */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-center flex flex-col justify-between">
        <div>
          {/* Photo upload container */}
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-slate-200 shadow-sm group">
            <img 
              src={profilePhoto} 
              alt="Employee Profile" 
              className="w-full h-full object-cover" 
            />
            <label className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white font-bold cursor-pointer transition-opacity">
              <RefreshCw className="w-5 h-5 mb-1 text-brand-orange animate-spin-slow" />
              <span>Change Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <h2 className="text-base font-bold text-slate-800 mt-4 font-display">{currentEmployee.name}</h2>
          <p className="text-xs text-brand-orange font-bold font-display mt-0.5">{currentEmployee.designation}</p>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Read-only system metadata */}
          <div className="space-y-3.5 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Employee ID:</span>
              <span className="font-extrabold text-slate-700">{currentEmployee.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Department:</span>
              <span className="font-bold text-slate-700">{currentEmployee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Reporting Manager:</span>
              <span className="font-bold text-slate-700">{currentEmployee.reportingManagerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Joining Date:</span>
              <span className="font-bold text-slate-700">
                {new Date(currentEmployee.joiningDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 italic text-center border-t border-slate-100 pt-3 mt-4">
          All system credentials managed by IT Admin.
        </div>
      </div>

      {/* Main profile form and details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Editable info card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            General Contact Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleInputChange} 
                    className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    className="pl-9 pr-4 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Identity & Salary credit details card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Identity Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              Verified Identity (Masked)
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Aadhaar Card No:</span>
                <span className="font-extrabold text-slate-750">{currentEmployee.aadhaar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">PAN Card No:</span>
                <span className="font-extrabold text-slate-750">{currentEmployee.pan}</span>
              </div>
            </div>
          </div>

          {/* Salary Bank Accounts */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
                <Landmark className="w-4 h-4 text-slate-400" />
                Salary Credit Account
              </h3>
              
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Bank Name:</span>
                  <span className="font-bold text-slate-700">{currentEmployee.bankDetails?.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Account No:</span>
                  <span className="font-bold text-slate-700">{currentEmployee.bankDetails?.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">IFSC Code:</span>
                  <span className="font-bold text-slate-700">{currentEmployee.bankDetails?.ifsc}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBankEditRequest}
              className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Request Bank Info Change
            </button>
          </div>

        </div>

        {/* Verification Documents section */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-display flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Verification Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentEmployee.documents?.map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block truncate max-w-[100px]">{doc.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{doc.size}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDocumentDownload(doc.name)}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-850 transition-colors cursor-pointer"
                  title="Download File"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
