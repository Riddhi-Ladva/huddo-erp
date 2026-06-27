import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const smsSettingSchema = new mongoose.Schema({
  provider_name: { type: String, required: true },
  api_url: { type: String, required: true },
  api_key: { type: String, required: true },
  api_secret_token: { type: String, required: true },
  sender_id: { type: String },
  country_code: { type: String, default: '+91' },
  is_enabled: { type: Boolean, default: true }
}, { timestamps: true });

smsSettingSchema.plugin(softDeletePlugin);

const SMSSetting = mongoose.model('SMSSetting', smsSettingSchema);
export default SMSSetting;
