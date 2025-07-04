import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  phone?: string;
  pin?: string; // In production, hash this!
  inviteCode: string;
  role: 'admin' | 'user';
  used?: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: false },
  phone: { type: String, required: false, unique: true, sparse: true },
  pin: { type: String, required: false },
  inviteCode: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
  used: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>('User', UserSchema); 