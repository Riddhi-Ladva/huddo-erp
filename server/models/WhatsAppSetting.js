import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const whatsappSettingSchema = new mongoose.Schema({
  provider: { type: String, required: true }, // Twilio, Meta, Gupshup, etc.
  phone_number_id: { type: String },
  business_phone_number: { type: String },
  access_token: { type: String }, // encrypted
  api_version: { type: String, default: 'v19.0' },
  webhook_url: { type: String },
  is_enabled: { type: Boolean, default: true }
}, { timestamps: true });

whatsappSettingSchema.plugin(softDeletePlugin);

const WhatsAppSetting = mongoose.model('WhatsAppSetting', whatsappSettingSchema);
export default WhatsAppSetting;
