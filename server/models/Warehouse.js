import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  location: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

warehouseSchema.plugin(softDeletePlugin);

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
