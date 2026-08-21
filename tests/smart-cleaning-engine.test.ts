import { describe, it, expect } from 'vitest';
import {
  SmartCleaningEngine,
  SmartCleaningBooking,
} from '../src/lib/scheduling/smart-cleaning-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('SmartCleaningEngine (Scheduling ➔ Fiscal ➔ Contábil ➔ Member-Get-Member)', () => {
  it('should calculate end time correctly given start time and duration', () => {
    expect(SmartCleaningEngine.calculateEndTime('09:00', 2.0)).toBe('11:00');
    expect(SmartCleaningEngine.calculateEndTime('09:00', 2.5)).toBe('11:30');
    expect(SmartCleaningEngine.calculateEndTime('08:30', 5.0)).toBe('13:30');
  });

  it('should calculate booking financials with Member-Get-Member discount and state sales tax', () => {
    // Texas Commercial Janitorial ($220 gross, $20 referral discount, TX 8.25% sales tax)
    const fin = SmartCleaningEngine.calculateBookingFinancials(
      220.00,
      75.00,
      20.00,
      20.00, // $20 discount
      'TX',
      true
    );

    expect(fin.grossPrice).toBe(220.00);
    expect(fin.discountApplied).toBe(20.00);
    expect(fin.finalBilledPrice).toBe(200.00);
    expect(fin.laborCost).toBe(75.00);
    expect(fin.suppliesCost).toBe(20.00);
    expect(fin.totalCOGS).toBe(95.00);
    expect(fin.estimatedMarginAmount).toBe(105.00); // $200 - $95
    expect(fin.salesTaxRate).toBe(0.0825);
    expect(fin.salesTaxAmount).toBe(16.50); // 8.25% of $200
    expect(fin.totalWithTax).toBe(216.50);
  });

  it('should execute completion and generate official invoice, balanced US GAAP ledger entry and referrer credit', () => {
    const booking: SmartCleaningBooking = {
      id: 'CLN-990011',
      clientId: 'cnt-acme',
      clientName: 'Austin Tech Hub Suites',
      clientEmail: 'facilities@austintechhub.io',
      clientPhone: '(512) 555-0192',
      propertyAddress: '401 Congress Ave',
      city: 'Austin',
      stateCode: 'TX',
      zipCode: '78701',
      servicePackageId: 'pkg-commercial-janitorial',
      servicePackageName: 'Manutenção Comercial Corporativa',
      isCommercial: true,
      cleanerId: 'cln-1',
      cleanerName: 'Maria Santos',
      cleanerPayRate: 75.00,
      scheduledDate: '2026-08-21',
      startTime: '18:00',
      durationHours: 3.0,
      endTime: '21:00',
      tasks: SmartCleaningEngine.DEFAULT_TASKS.filter((t) => t.isSelected),
      referralDiscountApplied: 20.00,
      referrerBonusEarned: 20.00,
      referredByClientId: 'cnt-harrison',
      referredByClientName: 'Dr. Robert Harrison',
      grossPrice: 220.00,
      finalBilledPrice: 200.00,
      laborCost: 75.00,
      suppliesCost: 20.00,
      estimatedMarginAmount: 105.00,
      estimatedMarginPercent: 52.5,
      salesTaxRate: 0.0825,
      salesTaxAmount: 16.50,
      totalInvoiceAmountWithTax: 216.50,
      status: 'AGENDADO',
    };

    const res = SmartCleaningEngine.executeBookingCompletion(
      '11111111-1111-1111-1111-111111111111',
      booking,
      '2026-08-21'
    );

    // 1. Verify Booking Status
    expect(res.completedBooking.status).toBe('CONCLUIDO_FATURADO');
    expect(res.completedBooking.invoiceNumber).toBe('INV-CLN-990011');

    // 2. Verify Invoice
    expect(res.invoice.totalAmount).toBe(216.50);
    expect(res.invoice.subtotal).toBe(200.00);
    expect(res.invoice.taxAmount).toBe(16.50);
    expect(res.invoice.status).toBe('PAID');

    // 3. Verify US GAAP Ledger Balance (Debits = Credits)
    const val = DoubleEntryLedgerEngine.validateJournalEntry(res.journalEntry);
    expect(val.isValid).toBe(true);

    // 4. Verify Referrer Wallet Update
    expect(res.updatedReferrerWallet).toBeDefined();
    expect(res.updatedReferrerWallet?.accumulatedCreditBalance).toBe(20.00);
    expect(res.updatedReferrerWallet?.clientId).toBe('cnt-harrison');
  });
});
