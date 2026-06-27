import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const gpsLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  recorded_at: { type: Date, default: Date.now },
  battery_level: { type: Number }
}, { timestamps: true });

gpsLogSchema.plugin(softDeletePlugin);

gpsLogSchema.index({ user: 1, recorded_at: -1 });

const GPSLog = mongoose.model('GPSLog', gpsLogSchema);
export default GPSLog;
