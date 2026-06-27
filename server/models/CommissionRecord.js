import mongoose from 'mongoose';
import { softDeletePlugin, amountSchemaType } from './plugins.js';

const commissionRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  commission_type: { 
    type: String, 
    enum: ['RetailerMargin', 'ManagerIncentive', 'PromoterRoyalty', 'Bonus'], 
    required: true 
  },
  amount: amountSchemaType,
  percentage: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Paid', 'Rejected'], 
    default: 'Pending' 
  },
  settlement_date: { type: Date }
}, { timestamps: true });

commissionRecordSchema.plugin(softDeletePlugin);

commissionRecordSchema.index({ user: 1 });
commissionRecordSchema.index({ order: 1 });
commissionRecordSchema.index({ status: 1 });

const CommissionRecord = mongoose.model('CommissionRecord', commissionRecordSchema);
export default CommissionRecord;
