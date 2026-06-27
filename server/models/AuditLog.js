import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g. create, update, delete
  module: { type: String, required: true }, // e.g. orders, users
  record_id: { type: mongoose.Schema.Types.ObjectId },
  old_value: { type: mongoose.Schema.Types.Mixed },
  new_value: { type: mongoose.Schema.Types.Mixed },
  ip_address: { type: String },
  user_agent: { type: String },
  performed_at: { type: Date, default: Date.now }
}, { timestamps: true });

auditLogSchema.plugin(softDeletePlugin);

auditLogSchema.index({ module: 1 });
auditLogSchema.index({ performed_at: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
