import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const stockRecordSchema = new mongoose.Schema({
  product_variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, default: 0, min: 0 },
  min_threshold: { type: Number, default: 5, min: 0 } // min quantity for low stock alert
}, { timestamps: true });

stockRecordSchema.plugin(softDeletePlugin);

// Unique combination of product variant in a warehouse
stockRecordSchema.index({ product_variant: 1, warehouse: 1 }, { unique: true });

const StockRecord = mongoose.model('StockRecord', stockRecordSchema);
export default StockRecord;
