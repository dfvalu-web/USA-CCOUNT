import { describe, it, expect } from 'vitest';
import { ClientInvoicePortalService } from '../src/lib/invoicing/client-invoice-portal-service';

describe('ClientInvoicePortalService — Public Portal & Payment Engine', () => {
  it('should retrieve public invoice details and company banking info', () => {
    const data = ClientInvoicePortalService.getPublicInvoice('inv-mila-2026-001');
    expect(data).toBeDefined();
    expect(data.company).toBeDefined();
    expect(data.company.ein).toBeDefined();
    expect(data.company.routingNumber).toBeDefined();
  });

  it('should process online card payment and generate cryptographic receipt with Merkle signature', () => {
    const receipt = ClientInvoicePortalService.processOnlinePayment(
      'inv-mila-2026-001',
      'STRIPE_CARD',
      'Acme Property Management',
      'ap@acmeproperties.com'
    );

    expect(receipt.receiptNumber).toMatch(/^REC-\d{4}-\d+$/);
    expect(receipt.status).toBe('SETTLED');
    expect(receipt.merkleSignature).toContain('0x');
    expect(receipt.amountPaid).toBeGreaterThan(0);
    expect(receipt.paymentMethod).toBe('STRIPE_CARD');
  });

  it('should process ACH bank direct debit payment successfully', () => {
    const receipt = ClientInvoicePortalService.processOnlinePayment(
      'inv-apx-2026-001',
      'ACH_TRANSFER',
      'Texas Distribution Center Hub',
      'treasury@texasdist.com'
    );

    expect(receipt.status).toBe('SETTLED');
    expect(receipt.paymentMethod).toBe('ACH_TRANSFER');
    expect(receipt.transactionReference).toContain('ch_stripe_');
  });
});
