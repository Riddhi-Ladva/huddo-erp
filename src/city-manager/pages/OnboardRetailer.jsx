// src/city-manager/pages/OnboardRetailer.jsx
import { useState } from 'react';
import { 
  Building, ShieldCheck, UserCheck, CheckCircle2, ChevronLeft, ChevronRight, Upload, Edit, Loader2
} from 'lucide-react';

export default function OnboardRetailer({ promoters, onOnboardRetailer, onNavigate, showToast, prefilledLead }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [formData, setFormData] = useState(() => {
    const cleanMobile = prefilledLead?.mobile ? prefilledLead.mobile.replace(/\D/g, '').slice(-10) : '';
    return {
      businessName: prefilledLead?.businessName || '',
      ownerName: prefilledLead?.ownerName || '',
      mobile: cleanMobile,
      email: prefilledLead?.email || '',
      shopAddress: prefilledLead?.area || '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '',
      pan: '',
      aadhaar: '',
      shopPhoto: null,
      shopPhotoPreview: null,
      declaration: false,
      category: 'Standard',
      assignedPromoter: promoters[0]?.name || 'Suresh Promoter',
      specialNotes: prefilledLead?.notes ? `Lead Notes: ${prefilledLead.notes}` : ''
    };
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
      if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
        newErrors.mobile = 'Valid 10-digit mobile number is required';
      }
      if (!formData.shopAddress.trim()) newErrors.shopAddress = 'Shop address is required';
    } else if (currentStep === 2) {
      if (!formData.gstin.trim() || formData.gstin.length !== 15) {
        newErrors.gstin = 'GSTIN must be exactly 15 characters';
      }
      if (!formData.pan.trim() || formData.pan.length !== 10) {
        newErrors.pan = 'PAN number must be exactly 10 characters';
      }
      if (!formData.aadhaar.trim() || formData.aadhaar.length !== 12) {
        newErrors.aadhaar = 'Aadhaar number must be exactly 12 digits';
      }
      if (!formData.declaration) {
        newErrors.declaration = 'You must accept the KYC declaration';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      showToast('Please correct errors in form fields.', 'error');
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Only image files are allowed', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          shopPhoto: file.name,
          shopPhotoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onOnboardRetailer({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        mobile: `+91 ${formData.mobile}`,
        email: formData.email,
        shopAddress: formData.shopAddress,
        city: formData.city,
        state: formData.state,
        gstin: formData.gstin.toUpperCase(),
        pan: formData.pan.toUpperCase(),
        aadhaar: formData.aadhaar,
        category: formData.category,
        assignedPromoter: formData.assignedPromoter,
        notes: formData.specialNotes
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Registration submitted for approval!', 'success');
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      businessName: '',
      ownerName: '',
      mobile: '',
      email: '',
      shopAddress: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      gstin: '',
      pan: '',
      aadhaar: '',
      shopPhoto: null,
      shopPhotoPreview: null,
      declaration: false,
      category: 'Standard',
      assignedPromoter: promoters[0]?.name || 'Suresh Promoter',
      specialNotes: ''
    });
    setStep(1);
    setIsSubmitted(false);
  };

  const stepIcons = [
    { num: 1, label: 'Profile', icon: Building },
    { num: 2, label: 'Compliance', icon: ShieldCheck },
    { num: 3, label: 'Assignment', icon: UserCheck },
    { num: 4, label: 'Review', icon: CheckCircle2 }
  ];

  if (isSubmitted) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-10 max-w-xl mx-auto shadow-sm text-center flex flex-col items-center justify-center space-y-4 animate-scale-up">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">Retailer Registration Submitted!</h2>
        <p className="text-xs font-semibold text-slate-550 max-w-sm leading-relaxed">
          <span className="font-bold text-slate-800">{formData.businessName}</span> has been submitted for State Manager approval. You will receive an alert once verification is completed.
        </p>
        
        <div className="flex items-center gap-3 pt-4">
          <button 
            onClick={resetForm}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Onboard Another
          </button>
          <button 
            onClick={() => onNavigate('My Retailers')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Go to Retailers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-wider">Onboard New Retailer</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">City Manager's exclusive function — retailer onboarding for Ahmedabad</p>
      </div>

      {/* Wizard Step Indicator */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex items-center justify-between select-none">
        {stepIcons.map((s, idx) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-black transition-all ${
                  isDone ? 'bg-orange-600 text-white border-orange-600' :
                  isCurrent ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                  'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <div className="hidden sm:block text-left">
                  <span className={`block text-[10px] font-bold uppercase ${isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                </div>
              </div>
              {idx < stepIcons.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 border-t ${step > s.num ? 'border-orange-500' : 'border-slate-100 border-dashed'}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Area */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* STEP 1: Business Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5"><Building className="w-4 h-4 text-orange-600" /> Business Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-500">Business Name*</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter retail store trade name"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                  />
                  {errors.businessName && <span className="text-[10px] text-rose-600 font-bold block">{errors.businessName}</span>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-slate-500">Owner Full Name*</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Enter proprietor name"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                  />
                  {errors.ownerName && <span className="text-[10px] text-rose-600 font-bold block">{errors.ownerName}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Mobile Number*</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                    maxLength={10}
                  />
                  {errors.mobile && <span className="text-[10px] text-rose-600 font-bold block">{errors.mobile}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="owner@store.com"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-slate-500">Shop Address*</label>
                  <textarea
                    value={formData.shopAddress}
                    onChange={(e) => handleInputChange('shopAddress', e.target.value)}
                    placeholder="Plot, street name, area/landmark, pincode"
                    rows="3"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                  />
                  {errors.shopAddress && <span className="text-[10px] text-rose-600 font-bold block">{errors.shopAddress}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">City Scope</label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">State Scope</label>
                  <input
                    type="text"
                    value={formData.state}
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 rounded-xl text-slate-400 focus:outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: KYC & Compliance */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange-600" /> Compliance & KYC</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-slate-500">GSTIN Number*</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="e.g. 24ABCDE1234F1Z5"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                    maxLength={15}
                  />
                  {errors.gstin && <span className="text-[10px] text-rose-600 font-bold block">{errors.gstin}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">PAN Number*</label>
                  <input
                    type="text"
                    value={formData.pan}
                    onChange={(e) => handleInputChange('pan', e.target.value)}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                    maxLength={10}
                  />
                  {errors.pan && <span className="text-[10px] text-rose-600 font-bold block">{errors.pan}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Aadhaar Number*</label>
                  <input
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    placeholder="12-digit UIDAI number"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                    maxLength={12}
                  />
                  {errors.aadhaar && <span className="text-[10px] text-rose-600 font-bold block">{errors.aadhaar}</span>}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Shop Facade Photo (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-slate-300 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-600 transition-all">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>{formData.shopPhoto ? 'Change Photo' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.shopPhoto && <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{formData.shopPhoto}</span>}
                  </div>
                  {formData.shopPhotoPreview && (
                    <div className="w-24 h-16 border border-slate-100 rounded-lg overflow-hidden mt-1 bg-slate-50 flex items-center justify-center">
                      <img src={formData.shopPhotoPreview} alt="Shop facade preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 pt-2 flex items-start gap-2 select-none">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={formData.declaration}
                    onChange={(e) => handleInputChange('declaration', e.target.checked)}
                    className="mt-0.5 cursor-pointer w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="declaration" className="text-slate-500 text-[11px] leading-tight cursor-pointer">
                    I confirm that the compliance documents (GSTIN, PAN, Aadhaar) provided for the retailer are genuine, and I have personally verified the shop's local existence.
                  </label>
                </div>
                {errors.declaration && <div className="col-span-1 md:col-span-2 text-[10px] text-rose-600 font-bold">{errors.declaration}</div>}

              </div>
            </div>
          )}

          {/* STEP 3: Assignment */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2 flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-orange-600" /> Assignment & Allocations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="text-slate-500">Retailer Category*</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold focus:outline-none"
                  >
                    <option value="Platinum">Platinum</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500">Assigned Promoter*</label>
                  <select
                    value={formData.assignedPromoter}
                    onChange={(e) => handleInputChange('assignedPromoter', e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-slate-800 font-bold focus:outline-none"
                  >
                    {promoters.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Assigned City Manager</label>
                  <input
                    type="text"
                    value="Arjun Patel (Ahmedabad)"
                    readOnly
                    className="w-full p-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-slate-500">Onboarding / Market Notes (Optional)</label>
                  <textarea
                    value={formData.specialNotes}
                    onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                    placeholder="Enter special requirements or shop layout observations"
                    rows="3"
                    className="w-full p-2 border border-slate-250 rounded-xl focus:outline-none focus:border-slate-350 bg-white text-slate-800"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Review Summary</h3>
              
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* Section 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100/80 pb-1">
                    <span className="text-[10px] text-slate-450 uppercase font-black">1. Business Profile</span>
                    <button onClick={() => setStep(1)} className="text-orange-600 font-bold hover:underline flex items-center gap-0.5"><Edit className="w-3 h-3" /> Edit</button>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p><span className="text-slate-400 font-medium block">Trade Name</span> {formData.businessName}</p>
                    <p><span className="text-slate-400 font-medium block">Owner</span> {formData.ownerName}</p>
                    <p><span className="text-slate-400 font-medium block">Mobile</span> +91 {formData.mobile}</p>
                    <p className="truncate"><span className="text-slate-400 font-medium block">Email</span> {formData.email || '-'}</p>
                    <p><span className="text-slate-400 font-medium block">Address</span> {formData.shopAddress}, {formData.city}, {formData.state}</p>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100/80 pb-1">
                    <span className="text-[10px] text-slate-450 uppercase font-black">2. Compliance & KYC</span>
                    <button onClick={() => setStep(2)} className="text-orange-600 font-bold hover:underline flex items-center gap-0.5"><Edit className="w-3 h-3" /> Edit</button>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p><span className="text-slate-400 font-medium block">GSTIN</span> {formData.gstin.toUpperCase()}</p>
                    <p><span className="text-slate-400 font-medium block">PAN</span> {formData.pan.toUpperCase()}</p>
                    <p><span className="text-slate-400 font-medium block">Aadhaar</span> {formData.aadhaar}</p>
                    <p><span className="text-slate-400 font-medium block">Facade photo</span> {formData.shopPhoto ? 'Uploaded ✓' : 'Not Uploaded'}</p>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="col-span-1 md:col-span-2 space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between border-b border-slate-100/80 pb-1">
                    <span className="text-[10px] text-slate-450 uppercase font-black">3. Assignment & Settings</span>
                    <button onClick={() => setStep(3)} className="text-orange-600 font-bold hover:underline flex items-center gap-0.5"><Edit className="w-3 h-3" /> Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-slate-700">
                    <p><span className="text-slate-400 font-medium block">Allocated Slab Category</span> {formData.category}</p>
                    <p><span className="text-slate-400 font-medium block">Promoter Mapped</span> {formData.assignedPromoter}</p>
                    <p className="col-span-2"><span className="text-slate-400 font-medium block">Special notes</span> {formData.specialNotes || 'None'}</p>
                  </div>
                </div>

              </div>

              {/* Warning Banner */}
              <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl text-[10px] font-bold text-amber-800 leading-relaxed">
                Submitted for Approval: The State Manager (Rajesh Mehta) will verify compliance, GST logs, and category eligibility before activating Sunrise Footwear in the active sales matrix.
              </div>
            </div>
          )}

        </div>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 select-none">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1 px-4 py-2 border border-slate-200 hover:bg-slate-55 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-orange-650 hover:bg-orange-750 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                'Submit for Approval'
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
