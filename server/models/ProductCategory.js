import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

productCategorySchema.plugin(softDeletePlugin);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
export default ProductCategory;
