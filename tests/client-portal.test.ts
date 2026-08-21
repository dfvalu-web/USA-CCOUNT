import { describe, it, expect } from 'vitest';
import { ClientPortalEngine } from '@/lib/portal/client-portal-engine';

describe('ClientPortalEngine (B2B Client Self-Service & Billing)', () => {
  it('should list client profiles with active monthly retainers and invoices', () => {
    const profiles = ClientPortalEngine.INITIAL_PROFILES;
    expect(profiles.length).toBeGreaterThan(0);
    const acme = profiles.find((p) => p.id === 'cli-acme-global');
    expect(acme).toBeDefined();
    expect(acme?.activeRetainerMonthly).toBe(15000);
    expect(acme?.invoices.length).toBeGreaterThan(0);
  });

  it('should process invoice payment and update outstanding balance to zero', () => {
    const updated = ClientPortalEngine.processInvoicePayment(
      'cli-acme-global',
      'inv-2026-088',
      'STRIPE_ACH'
    );

    const acme = updated.find((p) => p.id === 'cli-acme-global');
    const paidInv = acme?.invoices.find((i) => i.id === 'inv-2026-088');

    expect(paidInv?.status).toBe('PAID');
    expect(paidInv?.balanceDue).toBe(0);
    expect(paidInv?.paymentMethod).toBe('STRIPE_ACH');
    expect(acme?.totalOutstandingBalance).toBe(0);
  });
});
