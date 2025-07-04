import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  targetAmount: number;
  contributors: mongoose.Types.ObjectId[];
  progress: number;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  contributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  progress: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema); 