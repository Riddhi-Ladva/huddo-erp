import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const designationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  level: { type: Number, default: 1 }, // Hierarchy level (e.g. 1, 2, 3)
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

designationSchema.plugin(softDeletePlugin);

// Unique title per department
designationSchema.index({ title: 1, department: 1 }, { unique: true });

const Designation = mongoose.model('Designation', designationSchema);
export default Designation;
