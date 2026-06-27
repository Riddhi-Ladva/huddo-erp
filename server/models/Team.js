import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  description: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

teamSchema.plugin(softDeletePlugin);

const Team = mongoose.model('Team', teamSchema);
export default Team;
