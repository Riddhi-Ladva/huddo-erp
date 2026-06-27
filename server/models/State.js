import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

// A state name should be unique within a country
stateSchema.index({ name: 1, country: 1 }, { unique: true });

stateSchema.plugin(softDeletePlugin);

const State = mongoose.model('State', stateSchema);
export default State;
