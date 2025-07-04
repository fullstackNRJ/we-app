import { Budget } from '../models/Budget';
import mongoose from 'mongoose';

export const BudgetRepository = {
  async getSummary(userId: string, month: string) {
    // Find the budget for the user and month
    const budget = await Budget.findOne({ user: userId, month });
    if (!budget) return { month, categories: [] };
    return {
      month: budget.month,
      categories: budget.categories.map((cat: any) => ({
        name: cat.name,
        limit: cat.limit,
        spent: cat.spent,
      })),
    };
  },

  async addIncome(userId: string, month: string, source: string, amount: number, contributor: string) {
    let budget = await Budget.findOne({ user: userId, month });
    if (!budget) {
      budget = new Budget({ user: userId, month, income: [], categories: [] });
    }
    budget.income.push({ name: source, amount });
    await budget.save();
    return { success: true, income: budget.income };
  },

  async addOrEditCategory(userId: string, month: string, name: string, limit: number) {
    let budget = await Budget.findOne({ user: userId, month });
    if (!budget) {
      budget = new Budget({ user: userId, month, income: [], categories: [] });
    }
    const idx = budget.categories.findIndex((cat: any) => cat.name === name);
    if (idx >= 0) {
      budget.categories[idx].limit = limit;
    } else {
      budget.categories.push({ name, limit, spent: 0 });
    }
    await budget.save();
    return { success: true, category: budget.categories };
  },

  async getInsights(userId: string, month: string) {
    // Example: alert if spent > 90% of limit in any category
    const budget = await Budget.findOne({ user: userId, month });
    if (!budget) return { insights: [] };
    const insights: string[] = [];
    for (const cat of budget.categories) {
      if (cat.limit > 0 && cat.spent / cat.limit > 0.9) {
        insights.push(`High spending in ${cat.name}`);
      }
    }
    return { insights };
  },
}; 