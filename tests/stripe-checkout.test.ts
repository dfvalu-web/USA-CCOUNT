import { describe, it, expect } from 'vitest';
import { StripeAchCheckoutService } from '../src/lib/payments/stripe-ach-checkout';
import { InvoicingService } from '../src/lib/accounting/invoicing-service';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('StripeAchCheckoutService & Early Payment Discounts', () => {
  it('should apply 2% early payment discount when paid within 10 days', () => {
    const invoice = InvoicingService.createInvoice({
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-1',
      contactName: 'Acme',
      invoiceNumber: 'INV-10',
      issueDate: '2026-08-15',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Consulting',
          quantity: 1,
          unitPrice: 10000,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
    });

    // Paid on 2026-08-18 (3 days after issue, within 10 days)
    const session = StripeAchCheckoutService.createCheckoutSession(invoice, 'ACH_DIRECT_DEBIT', '2026-08-18');
    expect(session.grossAmountDue).toBe(10000);
    expect(session.earlyPaymentDiscountAmount).toBe(200); // 2% of 10k
    expect(session.finalSettlementAmount).toBe(9800);
  });

  it('should execute settlement and generate a strictly balanced payment journal entry', () => {
    const invoice = InvoicingService.createInvoice({
      organizationId: '11111111-1111-1111-1111-111111111111',
      contactId: 'c-1',
      contactName: 'Acme',
      invoiceNumber: 'INV-10',
      issueDate: '2026-08-15',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Consulting',
          quantity: 1,
          unitPrice: 10000,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
    });

    const session = StripeAchCheckoutService.createCheckoutSession(invoice, 'ACH_DIRECT_DEBIT', '2026-08-18');
    const result = StripeAchCheckoutService.executeSettlement(session, '2026-08-18');

    expect(result.settledSession.status).toBe('SUCCEEDED');
    const validation = DoubleEntryLedgerEngine.validateJournalEntry(result.journalEntry);
    expect(validation.isValid).toBe(true);
  });
});
