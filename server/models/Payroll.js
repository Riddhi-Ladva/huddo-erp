import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  basic: amountSchemaType,
  hra: amountSchemaType,
  allowances: amountSchemaType,
  deductions: amountSchemaType,
  gross: amountSchemaType,
  net_salary: amountSchemaType,
  paid_at: { type: Date },
  payment_mode: { type: String } // e.g. BankTransfer, Cheque, Cash
}, { timestamps: true });

payrollSchema.plugin(softDeletePlugin);

// Unique payroll record per employee for a specific month and year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
