import { describe, it, expect } from 'vitest';
import { InvoicingService } from '../src/lib/accounting/invoicing-service';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('InvoicingService & Double-Entry Journal Integration', () => {
  it('should create an invoice and generate a strictly balanced Issue Journal Entry (A/R vs Revenue)', () => {
    const invoice = InvoicingService.createInvoice({
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-10',
      contactName: 'Silicon Valley AI Labs',
      invoiceNumber: 'INV-2026-0099',
      issueDate: '2026-08-01',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Senior Fullstack Engineering (80 hrs @ $200/hr)',
          quantity: 80,
          unitPrice: 200,
          pricingModel: 'HOURLY',
          revenueAccountCode: '4020',
        },
      ],
    });

    expect(invoice.totalAmount).toBe(16000);
    expect(invoice.dueDate).toBe('2026-08-31');

    const issueJE = InvoicingService.generateIssueJournalEntry(invoice);
    const validation = DoubleEntryLedgerEngine.validateJournalEntry(issueJE);

    expect(validation.isValid).toBe(true);
    expect(issueJE.lines[0].debit).toBe(16000); // DR 1200 A/R
    expect(issueJE.lines[1].credit).toBe(16000); // CR 4020 Revenue
  });

  it('should generate a strictly balanced Payment Journal Entry upon collection', () => {
    const invoice = InvoicingService.createInvoice({
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-10',
      contactName: 'Silicon Valley AI Labs',
      invoiceNumber: 'INV-2026-0099',
      issueDate: '2026-08-01',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Consulting Retainer',
          quantity: 1,
          unitPrice: 10000,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4030',
        },
      ],
    });

    const paymentJE = InvoicingService.generatePaymentJournalEntry(invoice, 10000, '2026-08-15');
    const validation = DoubleEntryLedgerEngine.validateJournalEntry(paymentJE);

    expect(validation.isValid).toBe(true);
    expect(paymentJE.lines[0].debit).toBe(10000); // DR 1010 Cash
    expect(paymentJE.lines[1].credit).toBe(10000); // CR 1200 A/R
  });

  it('should compute late fees accurately for overdue invoices', () => {
    const invoice = InvoicingService.createInvoice({
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-10',
      contactName: 'Late Payer Inc',
      invoiceNumber: 'INV-2026-0050',
      issueDate: '2026-06-01',
      paymentTerm: 'NET_30', // Due: 2026-07-01
      items: [
        {
          description: 'Strategy Consulting',
          quantity: 1,
          unitPrice: 10000,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
    });

    // 30 days overdue as of 2026-07-31
    const lateFee = InvoicingService.calculateLateFee(invoice, '2026-07-31', 1.5);
    expect(lateFee).toBe(150); // 1.5% of 10000 for 1 month
  });
});
