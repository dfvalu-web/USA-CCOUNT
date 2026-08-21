import { describe, it, expect } from 'vitest';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';
import { US_GAAP_SERVICE_CHART_OF_ACCOUNTS } from '../src/lib/accounting/chart-of-accounts-template';

describe('DoubleEntryLedgerEngine (US GAAP Invariant Validation)', () => {
  it('should accept a perfectly balanced journal entry', () => {
    const validEntry = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: '2026-03-15',
      memo: 'Consulting Retainer Received from Acme Corp',
      basis: 'ACCRUAL',
      lines: [
        { accountId: '1010', debit: 15000, credit: 0, description: 'Cash received' },
        { accountId: '2100', debit: 0, credit: 15000, description: 'Unearned retainer liability' },
      ],
    };

    const result = DoubleEntryLedgerEngine.validateJournalEntry(validEntry);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data?.lines.length).toBe(2);
  });

  it('should strictly reject an unbalanced journal entry where Debits != Credits', () => {
    const unbalancedEntry = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: '2026-03-15',
      memo: 'Unbalanced Attempt',
      basis: 'ACCRUAL',
      lines: [
        { accountId: '1010', debit: 15000, credit: 0, description: 'Cash' },
        { accountId: '2100', debit: 0, credit: 14500, description: 'Short credit' },
      ],
    };

    const result = DoubleEntryLedgerEngine.validateJournalEntry(unbalancedEntry);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Double-entry invariant violated');
  });

  it('should reject a journal line with both debit and credit greater than zero', () => {
    const invalidLineEntry = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: '2026-03-15',
      memo: 'Invalid line data',
      basis: 'ACCRUAL',
      lines: [
        { accountId: '1010', debit: 1000, credit: 500, description: 'Invalid dual line' },
        { accountId: '2100', debit: 0, credit: 500, description: 'Liability' },
      ],
    };

    const result = DoubleEntryLedgerEngine.validateJournalEntry(invalidLineEntry);
    expect(result.isValid).toBe(false);
  });

  it('should generate a balanced Trial Balance report', () => {
    const sampleAccounts = [
      {
        code: '1010',
        name: 'Operating Checking',
        type: 'ASSET' as const,
        lines: [{ debit: 50000, credit: 0 }],
      },
      {
        code: '3010',
        name: "Owner's Equity",
        type: 'EQUITY' as const,
        lines: [{ debit: 0, credit: 50000 }],
      },
    ];

    const tb = DoubleEntryLedgerEngine.generateTrialBalance(sampleAccounts);
    expect(tb.isBalanced).toBe(true);
    expect(tb.totalDebits).toBe(50000);
    expect(tb.totalCredits).toBe(50000);
  });
});
