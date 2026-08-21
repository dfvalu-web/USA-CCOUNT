import { describe, it, expect } from 'vitest';
import { ReceiptOcrEngine } from '../src/lib/ai/receipt-ocr-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('ReceiptOcrEngine (Multimodal Vision OCR & US GAAP Auto-Mapping)', () => {
  it('should parse receipt in English and map AWS cloud expense to 5030 Direct Cloud', () => {
    const rawText = 'AMAZON WEB SERVICES INC. INVOICE #12345 TOTAL AMOUNT: $1,420.50 DESCRIPTION: EC2 Servers';
    const parsed = ReceiptOcrEngine.parseReceiptText(rawText);

    expect(parsed.vendorName).toContain('AWS');
    expect(parsed.totalAmount).toBe(1420.50);
    expect(parsed.suggestedAccountCode).toBe('5030');
    expect(parsed.languageDetected).toBe('en');
  });

  it('should parse Portuguese receipt (Nota Fiscal) and map to US GAAP account', () => {
    const rawText = 'DELAWARE TECH CONSULTORIA LTDA. FATURA DE SERVICOS #991 DATA: 2026-08-16 VALOR TOTAL: $3,200.00 DESCRICAO: Desenvolvimento de API Slack';
    const parsed = ReceiptOcrEngine.parseReceiptText(rawText);

    expect(parsed.totalAmount).toBe(3200.00);
    expect(parsed.languageDetected).toBe('pt');
    expect(parsed.suggestedAccountCode).toBe('6100'); // Software/Slack
  });

  it('should generate a strictly balanced US GAAP Journal Entry from parsed receipt', () => {
    const parsed = ReceiptOcrEngine.parseReceiptText('FIGMA INC RECEIPT #11 TOTAL $480.00');
    const je = ReceiptOcrEngine.generateReceiptJournalEntry('11111111-1111-1111-1111-111111111111', parsed);

    const validation = DoubleEntryLedgerEngine.validateJournalEntry(je);
    expect(validation.isValid).toBe(true);
    expect(je.lines[0].accountId).toBe('6100'); // DR 6100 Software
    expect(je.lines[0].debit).toBe(480);
    expect(je.lines[1].accountId).toBe('2020'); // CR 2020 Credit Card Payable
    expect(je.lines[1].credit).toBe(480);
  });
});
