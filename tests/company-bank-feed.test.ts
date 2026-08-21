import { describe, it, expect } from 'vitest';
import { CompanyBankFeedEngine } from '@/lib/accounting/company-bank-feed';

describe('Company Bank Feed & Forensic Reconciliation Engine', () => {
  it('should load real bank accounts for Milla Maid Services LLC (Truist & Chase GA)', () => {
    const banks = CompanyBankFeedEngine.getConnectedBanks('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(banks.length).toBe(2);

    const truist = banks.find((b) => b.id === 'truist');
    expect(truist).toBeDefined();
    expect(truist?.name).toContain('Truist Bank');
    expect(truist?.balance).toBe(118500.00);

    const chase = banks.find((b) => b.id === 'chase-ga');
    expect(chase).toBeDefined();
    expect(chase?.balance).toBe(57595.84);

    const totalCash = banks.reduce((sum, b) => sum + b.balance, 0);
    expect(totalCash).toBe(176095.84); // Exact cash balance for Milla Maid
  });

  it('should filter bank feed transactions strictly for 2025 for Milla Maid Services LLC', () => {
    const tx2025 = CompanyBankFeedEngine.getBankFeedTransactions(
      'cmp-milla-maid-ga',
      'Milla Maid Services LLC',
      2025,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    );

    expect(tx2025.length).toBe(6);
    expect(tx2025.every((t) => t.date.startsWith('2025'))).toBe(true);

    const revTx = tx2025.find((t) => t.amount === 364061.65);
    expect(revTx).toBeDefined();
    expect(revTx?.institutionName).toContain('Truist');

    const payrollTx = tx2025.find((t) => t.amount === -108667.00);
    expect(payrollTx).toBeDefined();
    expect(payrollTx?.institutionName).toContain('Chase');
  });

  it('should filter bank feed transactions strictly for 2022 for Milla Maid Services LLC', () => {
    const tx2022 = CompanyBankFeedEngine.getBankFeedTransactions(
      'cmp-milla-maid-ga',
      'Milla Maid Services LLC',
      2022,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    );

    expect(tx2022.length).toBe(6);
    expect(tx2022.every((t) => t.date.startsWith('2022'))).toBe(true);
  });

  it('should return 0 bank transactions for inactive years (e.g. 2018 or 2008)', () => {
    const tx2018 = CompanyBankFeedEngine.getBankFeedTransactions(
      'cmp-milla-maid-ga',
      'Milla Maid Services LLC',
      2018,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    );

    expect(tx2018.length).toBe(0);
  });
});
