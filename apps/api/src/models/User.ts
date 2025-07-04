import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  pin: string; // In production, hash this!
  inviteCode: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
});

export const User = mongoose.model<IUser>('User', UserSchema); 