import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['OrderUpdate', 'TargetReminder', 'CommissionAlert', 'ApprovalRequest', 'SystemAnnouncement'], 
    required: true 
  },
  channel: { 
    type: String, 
    enum: ['InApp', 'Email', 'SMS', 'WhatsApp'], 
    default: 'InApp' 
  },
  is_read: { type: Boolean, default: false },
  sent_at: { type: Date, default: Date.now }
}, { timestamps: true });

notificationSchema.plugin(softDeletePlugin);

notificationSchema.index({ recipient: 1, is_read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
