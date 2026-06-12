import React, { useState } from 'react';
import { 
  User, Store, Shield, Phone, Mail, MapPin, 
  FileText, Upload, Edit, Save, X, Star, CheckCircle, Info
} from 'lucide-react';

import { mockRetailer } from '../mockData/mockRetailer';

export default function Profile({ showToast }) {
  const [profile, setProfile] = useState(mockRetailer);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ ...profile });
  const [photoPreview, setPhotoPreview] = useState(profile.shopPhoto);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, shopPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
      showToast("Shop photo uploaded to draft.", "success");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.ownerName.trim() || !formData.mobileNumber.trim()) {
      showToast("Business name, Owner name, and Mobile number are required.", "error");
      return;
    }

    setProfile(formData);
    // Reflect changes globally in mockRetailer file for consistency in active session
    Object.assign(mockRetailer, formData);

    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setPhotoPreview(profile.shopPhoto);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Retailer Shop Profile</h1>
          <p className="text-xs text-slate-500 font-medium font-sans">View and edit your business details, verification credentials, and assigned local field staff.</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-colors self-start cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2 self-start">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-650 bg-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Photo upload & summary metrics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col items-center text-center space-y-4">
            
            {/* Shop Photo Frame */}
            <div className="relative w-44 h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={photoPreview || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300"} 
                alt="Shop Outlet Preview" 
                className="w-full h-full object-cover"
              />
              
              {isEditing && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                  <Upload className="w-6 h-6 mb-1 text-slate-200" />
                  <span className="text-[10px] font-bold">Replace Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* General Info */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-850 font-display text-base">{profile.businessName}</h3>
              <p className="text-xs text-slate-450 font-semibold">{profile.ownerName}</p>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-white" />
                {profile.category} Tier
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 fill-emerald-50" />
                {profile.accountStatus}
              </span>
            </div>

            {/* Read Only Prompt */}
            <div className="text-[10px] font-bold text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-1.5 text-left w-full">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Dossiers (GST/PAN/Aadhaar/Category) and assigned local managers can only be updated by City Managers or system admins.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <form className="space-y-5">
            
            {/* Section 1: Business profile */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <Store className="w-4 h-4" />
                <span>Shop Registration Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-bold text-slate-800"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Owner Full Name *</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    value={formData.mobileNumber}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-semibold text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-semibold text-slate-850"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Shop Address</label>
                <textarea
                  rows="2"
                  value={formData.shopAddress}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, shopAddress: e.target.value})}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City Location</label>
                  <input
                    type="text"
                    value={formData.city}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-semibold text-slate-800"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State Allocation</label>
                  <input
                    type="text"
                    value={formData.state}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:bg-slate-50 font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Documents */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <FileText className="w-4 h-4" />
                <span>Verification Credentials (Read-only)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">GST Identification No</label>
                  <p className="font-mono font-extrabold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.gstNumber}</p>
                </div>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">PAN Card Number</label>
                  <p className="font-mono font-extrabold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.panNumber}</p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Aadhaar Card Number</label>
                  <p className="font-mono font-extrabold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.aadhaarNumber}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Allocated Staff */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                <User className="w-4 h-4" />
                <span>Allocated field Managers & Code (Read-only)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Retailer Code</label>
                  <p className="font-bold text-slate-750 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.retailerCode}</p>
                </div>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Assigned City Manager</label>
                  <p className="font-bold text-slate-750 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.assignedCityManager}</p>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Assigned Promoter</label>
                  <p className="font-bold text-slate-750 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.assignedPromoter}</p>
                </div>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
