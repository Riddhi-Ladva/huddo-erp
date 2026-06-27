import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const communicationSettingSchema = new mongoose.Schema({
  enable_emails: { type: Boolean, default: true },
  enable_sms: { type: Boolean, default: true },
  enable_whatsapp: { type: Boolean, default: true },
  enable_otp: { type: Boolean, default: true },
  enable_marketing: { type: Boolean, default: true },
  enable_transactional: { type: Boolean, default: true }
}, { timestamps: true });

communicationSettingSchema.plugin(softDeletePlugin);

const CommunicationSetting = mongoose.model('CommunicationSetting', communicationSettingSchema);
export default CommunicationSetting;
