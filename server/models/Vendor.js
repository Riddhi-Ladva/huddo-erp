import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contact_person: { type: String },
  mobile: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  gst_number: { type: String },
  pan_number: { type: String },
  bank_details: {
    account_no: { type: String },
    ifsc: { type: String },
    bank_name: { type: String }
  },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

vendorSchema.plugin(softDeletePlugin);

vendorSchema.index({ name: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
