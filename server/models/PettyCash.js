import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const pettyCashSchema = new mongoose.Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: amountSchemaType,
  created_by: { type: String, default: 'Rohan Hudda' },
  notes: { type: String },
  receipt_url: { type: String },
  receipt_image: { type: String, default: null }
}, { timestamps: true });

pettyCashSchema.plugin(softDeletePlugin);

pettyCashSchema.index({ date: -1 });
pettyCashSchema.index({ type: 1 });

const PettyCash = mongoose.model('PettyCash', pettyCashSchema);
export default PettyCash;
