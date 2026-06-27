import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const performanceReviewSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  period: { type: String, required: true }, // e.g. "Q1-2026", "Annual-2026"
  rating: { type: Number, required: true, min: 1, max: 5 },
  remarks: { type: String },
  goals_achieved: { type: String }
}, { timestamps: true });

performanceReviewSchema.plugin(softDeletePlugin);

performanceReviewSchema.index({ employee: 1 });

const PerformanceReview = mongoose.model('PerformanceReview', performanceReviewSchema);
export default PerformanceReview;
