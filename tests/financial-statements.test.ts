import { describe, it, expect } from 'vitest';
import { FinancialStatementsEngine, AccountWithLines } from '../src/lib/accounting/financial-statements';

describe('FinancialStatementsEngine (P&L and Balance Sheet)', () => {
  const mockAccounts: AccountWithLines[] = [
    {
      code: '1010',
      name: 'Cash',
      type: 'ASSET',
      subType: 'CASH_AND_CASH_EQUIVALENTS',
      lines: [{ debit: 100000, credit: 0, date: '2026-01-01', basis: 'BOTH' }],
    },
    {
      code: '2010',
      name: 'Accounts Payable',
      type: 'LIABILITY',
      subType: 'ACCOUNTS_PAYABLE',
      lines: [{ debit: 0, credit: 20000, date: '2026-01-10', basis: 'ACCRUAL' }],
    },
    {
      code: '3010',
      name: "Owner's Equity",
      type: 'EQUITY',
      subType: 'OWNERS_EQUITY',
      lines: [{ debit: 0, credit: 50000, date: '2026-01-01', basis: 'BOTH' }],
    },
    {
      code: '4010',
      name: 'Consulting Revenue',
      type: 'REVENUE',
      subType: 'SERVICE_REVENUE_HOURLY',
      lines: [{ debit: 0, credit: 50000, date: '2026-01-15', basis: 'BOTH' }],
    },
    {
      code: '5010',
      name: 'Direct Project Labor',
      type: 'COST_OF_SERVICE',
      subType: 'DIRECT_LABOR_SERVICE',
      lines: [{ debit: 15000, credit: 0, date: '2026-01-20', basis: 'BOTH' }],
    },
    {
      code: '6010',
      name: 'Admin Salary',
      type: 'EXPENSE',
      subType: 'PAYROLL_WAGES',
      lines: [{ debit: 5000, credit: 0, date: '2026-01-25', basis: 'BOTH' }],
    },
  ];

  it('should calculate Income Statement with correct gross margin and net income', () => {
    const is = FinancialStatementsEngine.generateIncomeStatement(
      mockAccounts,
      '2026-01-01',
      '2026-12-31',
      'ACCRUAL'
    );

    expect(is.totalRevenue).toBe(50000);
    expect(is.totalCostOfServices).toBe(15000);
    expect(is.grossProfit).toBe(35000);
    expect(is.grossMarginPercentage).toBe(70);
    expect(is.totalOperatingExpenses).toBe(5000);
    expect(is.netIncome).toBe(30000);
  });

  it('should verify the fundamental Balance Sheet equation: Assets = Liabilities + Equity', () => {
    const is = FinancialStatementsEngine.generateIncomeStatement(
      mockAccounts,
      '2026-01-01',
      '2026-12-31',
      'ACCRUAL'
    );

    const bs = FinancialStatementsEngine.generateBalanceSheet(
      mockAccounts,
      '2026-12-31',
      'ACCRUAL',
      is.netIncome
    );

    expect(bs.totalAssets).toBe(100000);
    expect(bs.totalLiabilities).toBe(20000);
    expect(bs.totalEquity).toBe(80000); // 50000 initial equity + 30000 net income
    expect(bs.totalLiabilitiesAndEquity).toBe(100000);
    expect(bs.isBalanced).toBe(true);
  });
});
