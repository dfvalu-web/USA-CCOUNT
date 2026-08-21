import { describe, it, expect } from 'vitest';
import { BankReconciliationEngine } from '../src/lib/accounting/bank-reconciliation';

describe('BankReconciliationEngine (Continuous Auto-Matching)', () => {
  it('should accurately auto-match deposit transactions with 100% confidence on exact date & amount', () => {
    const bankFeed = [
      {
        id: 'bt-1',
        date: '2026-08-16',
        amount: 15000,
        description: 'STRIPE PAYOUT RET-ACME CORP TR-8921',
        isReconciled: false,
      },
    ];

    const ledgerEntries = [
      {
        id: 'JE-2026-0042',
        date: '2026-08-16',
        memo: 'Client Monthly Retainer - Acme Global Corp',
        amount: 15000,
        type: 'RECEIPT' as const,
      },
    ];

    const matches = BankReconciliationEngine.autoMatchTransactions(bankFeed, ledgerEntries);
    expect(matches.length).toBe(1);
    expect(matches[0].confidence).toBe(100);
    expect(matches[0].bankTransactionId).toBe('bt-1');
    expect(matches[0].journalEntryId).toBe('JE-2026-0042');
  });

  it('should auto-match within settlement window (2 days diff) with high confidence', () => {
    const bankFeed = [
      {
        id: 'bt-2',
        date: '2026-08-18',
        amount: -4800,
        description: 'ACH DEBIT GUSTO CONTRACTOR 1099 ENG',
        isReconciled: false,
      },
    ];

    const ledgerEntries = [
      {
        id: 'JE-2026-0041',
        date: '2026-08-16',
        memo: 'Direct Contractor Engineering Fees (1099)',
        amount: 4800,
        type: 'DISBURSEMENT' as const,
      },
    ];

    const matches = BankReconciliationEngine.autoMatchTransactions(bankFeed, ledgerEntries, 5);
    expect(matches.length).toBe(1);
    expect(matches[0].confidence).toBeGreaterThanOrEqual(95);
    expect(matches[0].dateDifferenceDays).toBe(2);
  });
});
