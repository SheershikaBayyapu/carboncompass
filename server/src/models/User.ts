import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  sustainabilityScore: { type: Number, default: 100 },
  streak: { type: Number, default: 1 },
  badges: { type: [String], default: ['Eco Recruit'] }
}, { timestamps: true });

export const User = model('User', userSchema);