import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  repeat: 'none' | 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  repeat: { type: String, enum: ['none', 'daily', 'weekly'], default: 'none' },
}, { timestamps: true });

export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema); 