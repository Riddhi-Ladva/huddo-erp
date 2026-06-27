import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  description: { type: String },
  brand: { type: String, default: 'Huddo' },
  is_active: { type: Boolean, default: true },
  lifecycle_status: { 
    type: String, 
    enum: ['Active', 'Discontinued', 'ComingSoon'], 
    default: 'Active' 
  }
}, { timestamps: true });

productSchema.plugin(softDeletePlugin);

productSchema.index({ name: 1 });
productSchema.index({ sku: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
