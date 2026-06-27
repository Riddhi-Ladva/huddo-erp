import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const leadSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  ownerName: { type: String, trim: true },
  mobile: { type: String, required: true, trim: true },
  area: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['Contacted', 'Interested', 'Meeting Scheduled', 'Not Interested'], 
    default: 'Contacted' 
  },
  notes: { type: String },
  lastContact: { type: String },
  source: { type: String }
}, { timestamps: true });

leadSchema.plugin(softDeletePlugin);

leadSchema.index({ businessName: 1 });
leadSchema.index({ mobile: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
