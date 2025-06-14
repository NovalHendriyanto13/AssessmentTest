import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  birthday:  { type: String, required: true }, // Format: YYYY-MM-DD
  timezone:  { type: String, required: true },
  lastSentYear: { type: Number, default: null },
});

export const UserModel = mongoose.model('User', userSchema);