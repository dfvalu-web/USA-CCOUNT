import { describe, it, expect } from 'vitest';
import { BudgetVarianceEngine } from '@/lib/budget/budget-variance-engine';

describe('BudgetVarianceEngine (Budget vs. Actuals)', () => {
  it('should list initial departmental budget goals with valid calculations', () => {
    const list = BudgetVarianceEngine.INITIAL_BUDGETS;
    expect(list.length).toBeGreaterThan(0);
    const eng = list.find((b) => b.id === 'bdg-003');
    expect(eng).toBeDefined();
    expect(eng?.annualBudget).toBe(48000);
    expect(eng?.monthlyBudget).toBe(4000);
    expect(eng?.varianceAmount).toBeGreaterThan(0);
  });

  it('should accurately calculate variance amount and flag over-budget breaches', () => {
    const over = BudgetVarianceEngine.calculateVariance(10000, 11500);
    expect(over.status).toBe('OVER_BUDGET');
    expect(over.varianceAmount).toBe(-1500);

    const warn = BudgetVarianceEngine.calculateVariance(10000, 9500);
    expect(warn.status).toBe('WARNING_90');

    const ok = BudgetVarianceEngine.calculateVariance(10000, 7000);
    expect(ok.status).toBe('ON_TRACK');
    expect(ok.varianceAmount).toBe(3000);
  });

  it('should create a new budget goal successfully', () => {
    const goal = BudgetVarianceEngine.createBudgetGoal(
      'Marketing & Growth',
      '6040',
      'Sales & Digital Marketing Expenses',
      72000,
      'Elena Rostova'
    );

    expect(goal.id).toMatch(/^bdg-\d+/);
    expect(goal.annualBudget).toBe(72000);
    expect(goal.monthlyBudget).toBe(6000);
    expect(goal.status).toBe('ON_TRACK');
  });
});
