import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const territoryAllocationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  allocated_at: { type: Date, default: Date.now },
  transferred_from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

territoryAllocationSchema.plugin(softDeletePlugin);

territoryAllocationSchema.index({ user: 1 });

const TerritoryAllocation = mongoose.model('TerritoryAllocation', territoryAllocationSchema);
export default TerritoryAllocation;
