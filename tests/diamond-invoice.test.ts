import { describe, it, expect } from 'vitest';
import { InvoicingService, CreateInvoiceDTO } from '../src/lib/accounting/invoicing-service';

describe('Diamond Corporate Invoice Standard & ASC 606 Compliance', () => {
  it('should generate a compliant US GAAP corporate invoice with items, subtotal, and tax', () => {
    const input: CreateInvoiceDTO = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-100',
      contactName: 'Manhattan Capital Partners LLC',
      invoiceNumber: 'INV-2026-0089',
      issueDate: '2026-08-01',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Commercial Janitorial & Deep Sanitization (50 hrs @ $160/hr)',
          quantity: 50,
          unitPrice: 160,
          pricingModel: 'HOURLY',
          revenueAccountCode: '4010',
        },
        {
          description: 'Eco-Friendly Disinfection Consumables & Supplies',
          quantity: 1,
          unitPrice: 850,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4020',
        },
      ],
    };

    const invoice = InvoicingService.createInvoice(input, 0.08); // 8% Sales Tax

    expect(invoice).toBeDefined();
    expect(invoice.invoiceNumber).toBe('INV-2026-0089');
    expect(invoice.subtotal).toBe(8850); // (50*160) + 850 = 8000 + 850 = 8850
    expect(invoice.taxAmount).toBe(708); // 8850 * 0.08 = 708
    expect(invoice.totalAmount).toBe(9558); // 8850 + 708 = 9558
    expect(invoice.balanceDue).toBe(9558);
    expect(invoice.status).toBe('ISSUED');
    expect(invoice.paymentLinkUrl).toBe('https://pay.mistercontabil.com/inv/INV-2026-0089');
  });

  it('should generate balanced double-entry accounting journal entries on invoice issue and payment', () => {
    const input: CreateInvoiceDTO = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-200',
      contactName: 'Buckhead Medical Center',
      invoiceNumber: 'INV-2026-0090',
      issueDate: '2026-08-01',
      paymentTerm: 'DUE_ON_RECEIPT',
      items: [
        {
          description: 'Monthly Specialized Medical Facility Cleaning',
          quantity: 1,
          unitPrice: 12500,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4010',
        },
      ],
    };

    const invoice = InvoicingService.createInvoice(input, 0);
    expect(invoice.totalAmount).toBe(12500);

    // Issue entry: DR 1200 A/R ($12,500) / CR 4010 Revenue ($12,500)
    const issueEntry = InvoicingService.generateIssueJournalEntry(invoice);
    expect(issueEntry).toBeDefined();
    expect(issueEntry.lines.length).toBeGreaterThanOrEqual(2);

    // Payment entry: DR 1010 Cash ($12,500) / CR 1200 A/R ($12,500)
    const paymentEntry = InvoicingService.generatePaymentJournalEntry(invoice, 12500, '1010');
    expect(paymentEntry).toBeDefined();
    expect(paymentEntry.lines[0].debit).toBe(12500);
    expect(paymentEntry.lines[1].credit).toBe(12500);
  });

  it('should calculate proper due dates for Net 15, Net 30, and Net 60', () => {
    const due15 = InvoicingService.calculateDueDate('2026-08-01', 'NET_15');
    expect(due15).toBe('2026-08-16');

    const due30 = InvoicingService.calculateDueDate('2026-08-01', 'NET_30');
    expect(due30).toBe('2026-08-31');

    const dueReceipt = InvoicingService.calculateDueDate('2026-08-01', 'DUE_ON_RECEIPT');
    expect(dueReceipt).toBe('2026-08-01');
  });
});
