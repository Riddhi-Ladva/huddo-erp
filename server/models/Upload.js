import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins.js';

const uploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  data: { type: String, required: true }, // Base64 representation of file content
  size: { type: Number }
}, { timestamps: true });

uploadSchema.plugin(softDeletePlugin);

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
