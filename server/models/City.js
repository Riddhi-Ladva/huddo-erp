import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// A city name should be unique within a state
citySchema.index({ name: 1, state: 1 }, { unique: true });

citySchema.plugin(softDeletePlugin);

const City = mongoose.model('City', citySchema);
export default City;
