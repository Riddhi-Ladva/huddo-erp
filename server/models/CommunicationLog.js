import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const communicationLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['Email', 'SMS', 'WhatsApp'], 
    required: true 
  },
  recipient: { type: String, required: true },
  subject_template: { type: String, required: true }, // e.g. template name or email subject
  status: { 
    type: String, 
    enum: ['Sent', 'Failed'], 
    required: true 
  },
  provider_response: { type: String },
  sent_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

communicationLogSchema.plugin(softDeletePlugin);

communicationLogSchema.index({ timestamp: -1 });
communicationLogSchema.index({ type: 1 });
communicationLogSchema.index({ status: 1 });

const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);
export default CommunicationLog;
