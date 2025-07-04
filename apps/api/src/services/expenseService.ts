import { ExpenseRepository } from '../repositories/expenseRepository';

export const ExpenseService = {
  async addExpense(userId: string, data: {
    title: string;
    amount: number;
    category: string;
    tags: string[];
    shared: boolean;
    addedBy: string;
    date?: Date;
  }) {
    // If shared, set partner as the other user (not implemented here, placeholder for future logic)
    // For now, just set user as the creator
    const expenseData = {
      user: userId,
      title: data.title,
      amount: data.amount,
      category: data.category,
      tags: data.tags,
      shared: data.shared,
      date: data.date || new Date(),
    };
    return ExpenseRepository.addExpense(expenseData);
  },

  async getExpenses(userId: string, filters: { category?: string; month?: string }) {
    return ExpenseRepository.getExpenses(userId, filters);
  },
}; 