import { describe, it, expect } from 'vitest';
import { CompanyLedgerEngine } from '@/lib/accounting/company-ledger-data';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { FinancialStatementsEngine } from '@/lib/accounting/financial-statements';

describe('Multi-Company Dynamic Accounting Reports Engine', () => {
  it('should load distinct and accurate accounts for Milla Maid Services LLC (GA)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(accounts.length).toBeGreaterThan(5);

    const revenueAcc = accounts.find((a) => a.code === '4010');
    expect(revenueAcc).toBeDefined();
    expect(revenueAcc?.name).toContain('Cleaning & Janitorial');
    const totalRev = revenueAcc?.lines.reduce((s, l) => s + l.credit, 0);
    expect(totalRev).toBe(426461.65);

    // Verify Trial Balance for Milla Maid
    const tb = DoubleEntryLedgerEngine.generateTrialBalance(accounts, 'ACCRUAL');
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalDebits).toBe(tb.totalCredits);

    // Verify Income Statement for Milla Maid
    const is = FinancialStatementsEngine.generateIncomeStatement(accounts, '2025-01-01', '2025-12-31', 'ACCRUAL');
    expect(is.totalRevenue).toBe(426461.65);
    expect(is.netIncome).toBeGreaterThan(50000);
  });

  it('should load distinct accounts for Horizon Fintech Labs Inc (FL)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-002', 'Horizon Fintech Labs Inc');
    const revenueAcc = accounts.find((a) => a.code === '4010');
    expect(revenueAcc?.name).toContain('SaaS Subscription');
    const totalRev = revenueAcc?.lines.reduce((s, l) => s + l.credit, 0);
    expect(totalRev).toBe(240000);

    const tb = DoubleEntryLedgerEngine.generateTrialBalance(accounts, 'ACCRUAL');
    expect(tb.isBalanced).toBe(true);

    const is = FinancialStatementsEngine.generateIncomeStatement(accounts, '2026-01-01', '2026-12-31', 'ACCRUAL');
    expect(is.totalRevenue).toBe(240000);
    expect(is.netIncome).toBe(140000);
  });

  it('should load distinct accounts for Apex CleanOps (TX)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-001', 'Apex CleanOps & Cloud Tech LLC');
    const revenueAcc = accounts.find((a) => a.code === '4010');
    const totalRev = revenueAcc?.lines.reduce((s, l) => s + l.credit, 0);
    expect(totalRev).toBe(185000);

    const tb = DoubleEntryLedgerEngine.generateTrialBalance(accounts, 'ACCRUAL');
    expect(tb.isBalanced).toBe(true);

    const is = FinancialStatementsEngine.generateIncomeStatement(accounts, '2026-01-01', '2026-12-31', 'ACCRUAL');
    expect(is.totalRevenue).toBe(185000);
    expect(is.netIncome).toBe(93800);
  });
});
