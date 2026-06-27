import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const coordinateSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true }, // e.g. Start of the day
  check_in: { type: Date },
  check_out: { type: Date },
  check_in_location: coordinateSchema,
  check_out_location: coordinateSchema,
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'HalfDay', 'Leave'], 
    required: true,
    default: 'Present'
  }
}, { timestamps: true });

attendanceSchema.plugin(softDeletePlugin);

// Unique attendance index for an employee on a specific date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
