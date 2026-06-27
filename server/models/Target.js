import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const targetSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period_type: { 
    type: String, 
    enum: ['Monthly', 'Quarterly', 'Yearly'], 
    required: true 
  },
  period_start: { type: Date, required: true },
  period_end: { type: Date, required: true },
  scope_level: { 
    type: String, 
    enum: ['Country', 'State', 'City', 'Retailer', 'Team', 'Employee'], 
    required: true 
  },
  scope_ref_id: { type: mongoose.Schema.Types.ObjectId }, // Dynamic ref ID depending on scope_level
  target_value: { type: Number, required: true }, // Can be in paise for Revenue, or simple count for OrderCount
  achieved_value: { type: Number, default: 0 },
  achievement_percentage: { 
    type: Number, 
    default: 0 
  },
  kpi_type: { 
    type: String, 
    enum: ['Revenue', 'OrderCount', 'RetailerAcquisition', 'MarketExpansion', 'RevenueGrowth'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'Missed'], 
    default: 'Active' 
  }
}, { timestamps: true });

targetSchema.plugin(softDeletePlugin);

// Pre-save hook to calculate achievement percentage
targetSchema.pre('save', function(next) {
  if (this.target_value > 0) {
    this.achievement_percentage = parseFloat(((this.achieved_value / this.target_value) * 100).toFixed(2));
  } else {
    this.achievement_percentage = 0;
  }
  next();
});

targetSchema.index({ assigned_to: 1 });
targetSchema.index({ kpi_type: 1 });
targetSchema.index({ status: 1 });

const Target = mongoose.model('Target', targetSchema);
export default Target;
