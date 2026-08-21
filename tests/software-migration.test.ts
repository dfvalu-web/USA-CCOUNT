import { describe, it, expect } from 'vitest';
import {
  SoftwareMigrationEngine,
  SourceAccountRawLine,
} from '@/lib/migration/software-migration-engine';

describe('SoftwareMigrationEngine (US GAAP Smart Importer)', () => {
  it('should auto-map standard QuickBooks accounts with high confidence', () => {
    const rawBank: SourceAccountRawLine = {
      sourceAccountCode: '1000',
      sourceAccountName: 'Chase Business Checking Account',
      sourceAccountType: 'ASSET',
      debit: 150000,
      credit: 0,
      netBalance: 150000,
    };

    const mapping = SoftwareMigrationEngine.autoMapAccount(rawBank);
    expect(mapping.targetAccountCode).toBe('1010');
    expect(mapping.targetAccountType).toBe('ASSET');
    expect(mapping.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it('should auto-map Xero expense accounts correctly', () => {
    const rawPayroll: SourceAccountRawLine = {
      sourceAccountCode: '400',
      sourceAccountName: 'Wages Expense Direct Labor',
      sourceAccountType: 'EXPENSE',
      debit: 45000,
      credit: 0,
      netBalance: 45000,
    };

    const mapping = SoftwareMigrationEngine.autoMapAccount(rawPayroll);
    expect(mapping.targetAccountCode).toBe('5010');
    expect(mapping.targetAccountType).toBe('EXPENSE');
  });

  it('should accurately validate balanced trial balances (Debits == Credits)', () => {
    const balancedLines: SourceAccountRawLine[] = [
      { sourceAccountCode: '1000', sourceAccountName: 'Cash in Bank', sourceAccountType: 'ASSET', debit: 100000, credit: 0, netBalance: 100000 },
      { sourceAccountCode: '3000', sourceAccountName: 'Owners Capital Stock', sourceAccountType: 'EQUITY', debit: 0, credit: 100000, netBalance: -100000 },
    ];

    const pkg = SoftwareMigrationEngine.processUploadedStatement(
      'Acme Holdings Corp',
      'QUICKBOOKS_ONLINE',
      'TRIAL_BALANCE',
      balancedLines
    );

    expect(pkg.isBalanced).toBe(true);
    expect(pkg.varianceAmount).toBe(0);
    expect(pkg.status).toBe('READY_TO_POST');
    expect(pkg.totalDebits).toBe(100000);
    expect(pkg.totalCredits).toBe(100000);
  });

  it('should flag unbalanced trial balances and calculate variance amount', () => {
    const unBalancedLines: SourceAccountRawLine[] = [
      { sourceAccountCode: '1000', sourceAccountName: 'Cash in Bank', sourceAccountType: 'ASSET', debit: 100000, credit: 0, netBalance: 100000 },
      { sourceAccountCode: '3000', sourceAccountName: 'Owners Capital Stock', sourceAccountType: 'EQUITY', debit: 0, credit: 95000, netBalance: -95000 },
    ];

    const pkg = SoftwareMigrationEngine.processUploadedStatement(
      'Unbalanced Co',
      'UNIVERSAL_CSV_EXCEL',
      'TRIAL_BALANCE',
      unBalancedLines
    );

    expect(pkg.isBalanced).toBe(false);
    expect(pkg.varianceAmount).toBe(5000);
    expect(pkg.status).toBe('PENDING_MAPPING');
  });
});
