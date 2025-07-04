import mongoose, { Schema, Document } from 'mongoose';

export interface INudge extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  type: 'inactivity' | 'custom' | 'prompt';
  createdAt: Date;
  updatedAt: Date;
}

const NudgeSchema = new Schema<INudge>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['inactivity', 'custom', 'prompt'], required: true },
}, { timestamps: true });

export const Nudge = mongoose.model<INudge>('Nudge', NudgeSchema); 