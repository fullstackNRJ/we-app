import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  partner?: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  tags: string[];
  shared: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  partner: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  shared: { type: Boolean, default: false },
  date: { type: Date, required: true },
}, { timestamps: true });

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema); 