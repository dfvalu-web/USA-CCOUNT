import { describe, it, expect } from 'vitest';
import { CleaningServiceEngine, CleaningJobSchedule } from '../src/lib/scheduling/cleaning-service-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('CleaningServiceEngine (Cleaning Services Scheduling, Tax & Accounting Bridge)', () => {
  it('should apply 8.25% Sales Tax on Texas Commercial Janitorial and Residential Cleaning', () => {
    const taxTX = CleaningServiceEngine.evaluateCleaningSalesTax('TX', true, 450);
    expect(taxTX.taxApplicable).toBe(true);
    expect(taxTX.rate).toBe(0.0825);
    expect(taxTX.taxAmount).toBe(37.13);
    expect(taxTX.totalAmount).toBe(487.13);
  });

  it('should exempt Florida residential maid cleaning while taxing Florida commercial janitorial', () => {
    const resFL = CleaningServiceEngine.evaluateCleaningSalesTax('FL', false, 320);
    expect(resFL.taxApplicable).toBe(false);
    expect(resFL.taxAmount).toBe(0);

    const commFL = CleaningServiceEngine.evaluateCleaningSalesTax('FL', true, 1000);
    expect(commFL.taxApplicable).toBe(true);
    expect(commFL.rate).toBe(0.07);
    expect(commFL.taxAmount).toBe(70);
  });

  it('should complete cleaning job and generate strictly balanced US GAAP double-entry journal entry with direct cleaner wages and supplies', () => {
    const job: CleaningJobSchedule = CleaningServiceEngine.createCleaningJob({
      clientName: 'Austin Tech Hub Suites',
      clientEmail: 'facilities@austin.io',
      clientPhone: '5125550192',
      propertyAddress: '401 Congress Ave',
      city: 'Austin',
      stateCode: 'TX',
      zipCode: '78701',
      isCommercial: true,
      serviceType: 'COMMERCIAL_JANITORIAL',
      scheduledDate: '2026-08-21',
      scheduledTimeWindow: '06:00 PM - 09:00 PM',
      squareFootage: 4500,
      quotedServicePrice: 450,
      estimatedSuppliesCost: 25,
      crew: [
        { cleanerId: 'cln-1', cleanerName: 'Maria Santos', cleanerType: 'W2_EMPLOYEE', payRatePerHour: 22, estimatedHours: 3 }, // $66
        { cleanerId: 'cln-2', cleanerName: 'Carlos Gomez', cleanerType: 'W2_EMPLOYEE', payRatePerHour: 22, estimatedHours: 3 }, // $66
      ],
    });

    const result = CleaningServiceEngine.completeCleaningJobAndPostAccounting(
      '11111111-1111-1111-1111-111111111111',
      job,
      '2026-08-21',
      true
    );

    expect(result.completedJob.status).toBe('COMPLETED_POSTED');
    expect(result.profitability.directLaborCost).toBe(132); // 2 cleaners * 3h * $22 = $132
    expect(result.profitability.suppliesCost).toBe(25);
    expect(result.profitability.totalCOGS).toBe(157); // $132 + $25
    expect(result.profitability.grossProfit).toBe(293); // $450 - $157
    expect(result.profitability.grossMarginPercent).toBe(65.1);

    // Validate US GAAP Ledger Equilibrium
    const validation = DoubleEntryLedgerEngine.validateJournalEntry(result.journalEntry);
    expect(validation.isValid).toBe(true);

    // Verify invoice generated with payment link
    expect(result.invoice.totalAmount).toBe(487.13); // $450 + $37.13 TX tax
    expect(result.invoice.paymentLinkUrl).toContain('https://pay.uas-accounting.io');
  });
});
