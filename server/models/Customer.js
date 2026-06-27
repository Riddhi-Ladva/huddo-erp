import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const customerSchema = new mongoose.Schema({
  customer_name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  city: { type: String, trim: true },
  totalOrders: { type: Number, default: 0 },
  totalSpend: amountSchemaType,
  lastOrderDate: { type: String }
}, { timestamps: true });

customerSchema.plugin(softDeletePlugin);

customerSchema.index({ mobile: 1 });
customerSchema.index({ customer_name: 1 });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
