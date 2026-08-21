import { describe, it, expect } from 'vitest';
import { MultiCurrencyEngine } from '../src/lib/fx/multi-currency-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('MultiCurrencyEngine (ASC 830 / FASB 52 FX Revaluation)', () => {
  it('should calculate Realized FX Gain when foreign currency appreciates against USD at settlement', () => {
    // 20,000 EUR invoiced at 1.075 ($21,500 USD), settled at 1.085 ($21,700 USD)
    const result = MultiCurrencyEngine.calculateRealizedFx(20000, 1.075, 1.085);
    expect(result.usdAtIssue).toBe(21500);
    expect(result.usdAtSettlement).toBe(21700);
    expect(result.realizedGainLoss).toBe(200); // +$200 Realized FX Gain
    expect(result.isGain).toBe(true);
  });

  it('should calculate Realized FX Loss when foreign currency depreciates at settlement', () => {
    // 15,000 GBP invoiced at 1.295 ($19,425 USD), settled at 1.285 ($19,275 USD)
    const result = MultiCurrencyEngine.calculateRealizedFx(15000, 1.295, 1.285);
    expect(result.usdAtIssue).toBe(19425);
    expect(result.usdAtSettlement).toBe(19275);
    expect(result.realizedGainLoss).toBe(-150); // -$150 Realized FX Loss
    expect(result.isGain).toBe(false);
  });

  it('should generate a strictly balanced US GAAP Journal Entry for month-end Unrealized FX Revaluation', () => {
    const openInvoices = [
      { foreignAmount: 85000, issueRate: 0.180, foreignCurrency: 'BRL' as const }, // Current rate is 0.182 -> +$170 Gain
    ];

    const result = MultiCurrencyEngine.generateMonthEndRevaluationJournalEntry(
      '11111111-1111-1111-1111-111111111111',
      openInvoices,
      '2026-08-31'
    );

    expect(result.totalUnrealizedFxGainLoss).toBe(170);
    expect(result.isGain).toBe(true);

    const validation = DoubleEntryLedgerEngine.validateJournalEntry(result.journalEntry);
    expect(validation.isValid).toBe(true);
    expect(result.journalEntry.lines[0].accountId).toBe('1200'); // DR 1200 A/R
    expect(result.journalEntry.lines[0].debit).toBe(170);
    expect(result.journalEntry.lines[1].accountId).toBe('4900'); // CR 4900 FX Gain
    expect(result.journalEntry.lines[1].credit).toBe(170);
  });
});
