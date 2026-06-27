import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const retailerVisitSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
  visited_at: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  notes: { type: String },
  order_taken: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional order taken during visit
  duration_minutes: { type: Number }
}, { timestamps: true });

retailerVisitSchema.plugin(softDeletePlugin);

retailerVisitSchema.index({ employee: 1 });
retailerVisitSchema.index({ retailer: 1 });

const RetailerVisit = mongoose.model('RetailerVisit', retailerVisitSchema);
export default RetailerVisit;
