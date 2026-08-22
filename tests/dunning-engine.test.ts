import { describe, it, expect } from 'vitest';
import { DunningEngine } from '../src/lib/ar/dunning-engine';

describe('DunningEngine — A/R Aging, Statutory Interest & Formal Demand Notices', () => {
  it('should return correct statutory interest rates per state', () => {
    expect(DunningEngine.getStatutoryInterestRate('GA')).toBe(1.5);
    expect(DunningEngine.getStatutoryInterestRate('TX')).toBe(1.0);
    expect(DunningEngine.getStatutoryInterestRate('DE')).toBe(1.5);
  });

  it('should evaluate overdue accounts and calculate interest and late fees accurately', () => {
    const millaAccounts = DunningEngine.evaluateAgingAccounts('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(millaAccounts.length).toBeGreaterThan(0);

    millaAccounts.forEach((acc) => {
      expect(acc.totalBalanceDue).toBe(acc.originalAmount + acc.accruedInterestAmount + acc.lateFeePenalty);
      expect(acc.daysOverdue).toBeGreaterThan(0);
      expect(['0-30', '31-60', '61-90', '90+']).toContain(acc.agingBucket);
    });
  });

  it('should generate formal 3-tier dunning letters and WhatsApp messages', () => {
    const millaAccounts = DunningEngine.evaluateAgingAccounts('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    const notice1 = DunningEngine.generateDunningNotice(millaAccounts[2]); // Tier 1
    const notice2 = DunningEngine.generateDunningNotice(millaAccounts[0]); // Tier 2
    const notice3 = DunningEngine.generateDunningNotice(millaAccounts[1]); // Tier 3

    expect(notice1.tierLevel).toBe(1);
    expect(notice1.tierTitle).toContain('Lembrete');
    expect(notice1.whatsappMessageText).toContain('https://');

    expect(notice2.tierLevel).toBe(2);
    expect(notice2.formalLetterBody).toContain('Segunda Notificação');

    expect(notice3.tierLevel).toBe(3);
    expect(notice3.formalLetterBody).toContain('NOTIFICAÇÃO EXTRAJUDICIAL');
    expect(notice3.totalSettlementDue).toBeGreaterThan(notice3.principalAmount);
  });
});
