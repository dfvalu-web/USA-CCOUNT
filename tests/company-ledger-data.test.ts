import { describe, it, expect } from 'vitest';
import { CompanyLedgerEngine } from '@/lib/accounting/company-ledger-data';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { FinancialStatementsEngine } from '@/lib/accounting/financial-statements';

describe('Multi-Company & Multi-Year Forensic Accounting Reports Engine', () => {
  it('should return exact 2025 P&L for Milla Maid Services LLC ($426k revenue)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2025 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2025-01-01',
      '2025-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2025
    );

    expect(is2025.totalRevenue).toBe(426461.65);
    expect(is2025.costOfServices.length).toBeGreaterThan(0);
    expect(is2025.operatingExpenses.length).toBeGreaterThan(0);
    expect(is2025.netIncome).toBeGreaterThan(50000);
  });

  it('should return exact 2024 P&L for Milla Maid Services LLC ($412k revenue)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2024 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2024-01-01',
      '2024-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2024
    );

    expect(is2024.totalRevenue).toBe(412313.30);
  });

  it('should return exact 2023 P&L for Milla Maid Services LLC ($477k revenue)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2023 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2023-01-01',
      '2023-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2023
    );

    expect(is2023.totalRevenue).toBe(477370.70);
  });

  it('should return exact 2022 P&L for Milla Maid Services LLC ($342k revenue)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2022 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2022-01-01',
      '2022-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2022
    );

    expect(is2022.totalRevenue).toBe(342851.75);
  });

  it('should return exact 2021 P&L for Milla Maid Services LLC ($5k revenue)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2021 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2021-01-01',
      '2021-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2021
    );

    expect(is2021.totalRevenue).toBe(5008.98);
  });

  it('should return 100% ZEROED reports for inactive years (e.g. 2018 or 2005)', () => {
    const accounts = CompanyLedgerEngine.getAccountsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const is2018 = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      '2018-01-01',
      '2018-12-31',
      'ACCRUAL',
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      2018
    );

    expect(is2018.totalRevenue).toBe(0);
    expect(is2018.totalCostOfServices).toBe(0);
    expect(is2018.totalOperatingExpenses).toBe(0);
    expect(is2018.netIncome).toBe(0);
    expect(is2018.revenues.length).toBe(0);
    expect(is2018.costOfServices.length).toBe(0);
    expect(is2018.operatingExpenses.length).toBe(0);
  });
});
