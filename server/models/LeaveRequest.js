import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const leaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leave_type: { 
    type: String, 
    enum: ['CL', 'SL', 'PL', 'LWP'], 
    required: true 
  },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

leaveRequestSchema.plugin(softDeletePlugin);

leaveRequestSchema.index({ employee: 1 });
leaveRequestSchema.index({ status: 1 });

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
