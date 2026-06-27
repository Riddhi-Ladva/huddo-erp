import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const promoterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  promoter_code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  aadhaar_number: { type: String },
  pan_number: { type: String },
  gst_number: { type: String },
  bank_details: {
    account_no: { type: String },
    ifsc: { type: String },
    bank_name: { type: String }
  },
  profile_photo: { type: String },
  territory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
  retailers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Retailer' }],
  royalty_percentage: { type: Number, default: 0 }, // e.g. 5 for 5%
  total_royalty_earned: amountSchemaType,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

promoterSchema.plugin(softDeletePlugin);

promoterSchema.index({ promoter_code: 1 });
promoterSchema.index({ name: 1 });

const Promoter = mongoose.model('Promoter', promoterSchema);
export default Promoter;
