import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

countrySchema.plugin(softDeletePlugin);

const Country = mongoose.model('Country', countrySchema);
export default Country;
