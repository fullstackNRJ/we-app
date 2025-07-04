import { BudgetRepository } from '../repositories/budgetRepository';

export const BudgetService = {
  async getSummary(userId: string, month: string) {
    return BudgetRepository.getSummary(userId, month);
  },
  async addIncome(userId: string, month: string, data: { source: string; amount: number; contributor: string }) {
    return BudgetRepository.addIncome(userId, month, data.source, data.amount, data.contributor);
  },
  async addOrEditCategory(userId: string, month: string, data: { name: string; limit: number }) {
    return BudgetRepository.addOrEditCategory(userId, month, data.name, data.limit);
  },
  async getInsights(userId: string, month: string) {
    return BudgetRepository.getInsights(userId, month);
  },
}; 