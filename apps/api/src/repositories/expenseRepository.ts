import { Expense, IExpense } from '../models/Expense';
import mongoose from 'mongoose';

export const ExpenseRepository = {
  async addExpense(data: {
    user: string;
    partner?: string;
    title: string;
    amount: number;
    category: string;
    tags: string[];
    shared: boolean;
    date: Date;
  }): Promise<IExpense> {
    const expense = new Expense({
      user: data.user,
      partner: data.partner,
      title: data.title,
      amount: data.amount,
      category: data.category,
      tags: data.tags,
      shared: data.shared,
      date: data.date,
    });
    await expense.save();
    return expense;
  },

  async getExpenses(userId: string, filters: { category?: string; month?: string }) {
    const query: any = {
      $or: [{ user: userId }, { partner: userId }],
    };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.month) {
      // Match expenses in the given month (YYYY-MM)
      const start = new Date(`${filters.month}-01T00:00:00.000Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Breakdown for summary charts
    const summary = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return { expenses, summary };
  },
}; 