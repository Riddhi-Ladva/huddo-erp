import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const commissionStructureSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    required: true,
    enum: [
      'CEO', 'CountryManager', 'StateManager', 'CityManager', 
      'SalesManager', 'SalesExecutive', 'Promoter', 'Retailer'
    ]
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional product-specific structure
  percentage: { type: Number, required: true, min: 0, max: 100 },
  effective_from: { type: Date, required: true },
  effective_to: { type: Date },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

commissionStructureSchema.plugin(softDeletePlugin);

const CommissionStructure = mongoose.model('CommissionStructure', commissionStructureSchema);
export default CommissionStructure;
