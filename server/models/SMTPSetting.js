import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const smtpSettingSchema = new mongoose.Schema({
  sender_name: { type: String, required: true },
  sender_email: { type: String, required: true },
  smtp_host: { type: String, required: true },
  smtp_port: { type: Number, required: true },
  smtp_username: { type: String, required: true },
  smtp_password: { type: String, required: true },
  encryption: { 
    type: String, 
    enum: ['None', 'SSL', 'TLS'], 
    default: 'TLS' 
  },
  reply_to: { type: String },
  is_enabled: { type: Boolean, default: true }
}, { timestamps: true });

smtpSettingSchema.plugin(softDeletePlugin);

const SMTPSetting = mongoose.model('SMTPSetting', smtpSettingSchema);
export default SMTPSetting;
