import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  employee_code: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  residential_address: { type: String },
  aadhaar_number: { type: String },
  pan_number: { type: String },
  profile_photo: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
  reporting_manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  joining_date: { type: Date },
  salary_structure: {
    basic: amountSchemaType,
    hra: amountSchemaType,
    allowances: amountSchemaType,
    deductions: amountSchemaType
  },
  bank_details: {
    account_no: { type: String },
    ifsc: { type: String },
    bank_name: { type: String },
    account_holder: { type: String }
  },
  documents: [{
    type: { type: String }, // e.g. Aadhaar, PAN, Resume
    url: { type: String },
    uploaded_at: { type: Date, default: Date.now }
  }],
  performance_records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PerformanceReview' }],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

employeeSchema.plugin(softDeletePlugin);

employeeSchema.index({ employee_code: 1 });
employeeSchema.index({ full_name: 1 });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
