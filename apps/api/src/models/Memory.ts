import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  note?: string;
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  note: String,
  photos: [String],
}, { timestamps: true });

export const Memory = mongoose.model<IMemory>('Memory', MemorySchema); 