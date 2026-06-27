import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const returnLogSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  productName: { type: String, required: true },
  sku: { type: String },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  reference_no: { type: String, default: 'N/A' },
  notes: { type: String },
  returned_by: { type: String, default: 'Rohan Hudda' }
}, { timestamps: true });

returnLogSchema.plugin(softDeletePlugin);

const ReturnLog = mongoose.model('ReturnLog', returnLogSchema);
export default ReturnLog;
