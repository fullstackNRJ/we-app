import mongoose, { Schema, Document } from 'mongoose';

interface IncomeSource {
  name: string;
  amount: number;
}

interface Category {
  name: string;
  limit: number;
  spent: number;
}

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  month: string;
  income: IncomeSource[];
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  income: [
    {
      name: String,
      amount: Number,
    },
  ],
  categories: [
    {
      name: String,
      limit: Number,
      spent: { type: Number, default: 0 },
    },
  ],
}, { timestamps: true });

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema); 