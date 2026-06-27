import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const stockTransferSchema = new mongoose.Schema({
  from_warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  to_warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  product_variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
  quantity: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['Requested', 'Approved', 'InTransit', 'Completed'], 
    default: 'Requested' 
  },
  transferred_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

stockTransferSchema.plugin(softDeletePlugin);

stockTransferSchema.index({ from_warehouse: 1 });
stockTransferSchema.index({ to_warehouse: 1 });

const StockTransfer = mongoose.model('StockTransfer', stockTransferSchema);
export default StockTransfer;
