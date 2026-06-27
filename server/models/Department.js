import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const departmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    enum: ['Sales', 'Purchase', 'Inventory', 'Finance', 'HR', 'Marketing'], 
    required: true,
    unique: true
  },
  code: { type: String },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  features: { type: Map, of: Boolean, default: {} },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

departmentSchema.plugin(softDeletePlugin);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
