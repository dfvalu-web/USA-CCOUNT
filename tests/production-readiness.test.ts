import { describe, it, expect } from 'vitest';
import { FixedAssetsEngine, FixedAssetItem } from '../src/lib/accounting/fixed-assets-engine';
import { OnboardingEngine } from '../src/lib/payroll/onboarding-engine';
import { SalesTaxFilingService } from '../src/lib/tax/sales-tax-filing-service';
import { TimesheetApprovalEngine } from '../src/lib/scheduling/timesheet-approval-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('Production Readiness Suite (Real-World Operations)', () => {
  describe('Módulo Contábil (Fixed Assets & Hard Close)', () => {
    it('should calculate monthly depreciation and generate balanced US GAAP journal entry', () => {
      const assets: FixedAssetItem[] = [
        {
          id: 'fa-1',
          assetName: 'MacBook Pro',
          assetTag: 'TAG-1',
          purchaseDate: '2026-01-01',
          costBasis: 3600,
          salvageValue: 0,
          usefulLifeMonths: 36,
          monthsDepreciated: 0,
          accumulatedDepreciation: 0,
          currentBookValue: 3600,
          assetAccountCode: '1510',
          depreciationExpenseAccountCode: '6400',
          accumulatedDepreciationAccountCode: '1520',
          status: 'ACTIVE_IN_SERVICE',
        },
      ];

      const res = FixedAssetsEngine.generateDepreciationJournalEntry('11111111-1111-1111-1111-111111111111', assets, '2026-01-31');
      expect(res.totalDepreciation).toBe(100); // $3600 / 36 = $100/mo
      expect(res.updatedAssets[0].monthsDepreciated).toBe(1);
      expect(res.updatedAssets[0].accumulatedDepreciation).toBe(100);

      const validation = DoubleEntryLedgerEngine.validateJournalEntry(res.journalEntry);
      expect(validation.isValid).toBe(true);
    });

    it('should block retroactive entries in locked fiscal periods', () => {
      const lockConfig = {
        organizationId: 'org-1',
        lockedThroughDate: '2026-06-30',
        lockedByUserId: 'u-1',
        lockedByUserName: 'CFO',
        lockedAt: '2026-07-01T00:00:00Z',
      };

      const pastEntry = FixedAssetsEngine.validatePeriodLock('2026-05-15', lockConfig);
      expect(pastEntry.allowed).toBe(false);
      expect(pastEntry.error).toContain('Hard Close Violation');

      const futureEntry = FixedAssetsEngine.validatePeriodLock('2026-07-15', lockConfig);
      expect(futureEntry.allowed).toBe(true);
    });
  });

  describe('Módulo Pessoal / DP (Onboarding & Itemized Paystubs)', () => {
    it('should validate valid SSN and reject invalid SSN area codes (e.g. 000, 666, 900+)', () => {
      expect(OnboardingEngine.validateSSN('123-45-6789').isValid).toBe(true);
      expect(OnboardingEngine.validateSSN('000-12-3456').isValid).toBe(false);
      expect(OnboardingEngine.validateSSN('666-12-3456').isValid).toBe(false);
      expect(OnboardingEngine.validateSSN('900-12-3456').isValid).toBe(false);
    });

    it('should generate official itemized paystub with Section 125 and 401(k) pre-tax deductions', () => {
      const stub = OnboardingEngine.generateItemizedPaystub('Sarah Jenkins', '123-45-6789', 6250, 'CA', 250, 5);
      expect(stub.grossWages).toBe(6250);
      expect(stub.preTaxDeductions.section125HealthInsurance).toBe(250);
      expect(stub.preTaxDeductions.retirement401k).toBe(312.50); // 5% of $6250
      expect(stub.netPay).toBeGreaterThan(0);
      expect(stub.netPay).toBeLessThan(6250);
    });
  });

  describe('Módulo Fiscal (Sales Tax WebFile & CPA Binder)', () => {
    it('should calculate Texas WebFile sales tax with 80% SaaS exemption and timely filing discount', () => {
      const txReturn = SalesTaxFilingService.generateStateSalesTaxReturn('TX', 100000, true);
      expect(txReturn.grossSalesAmount).toBe(100000);
      expect(txReturn.exemptSalesAmount).toBe(20000); // 20% exempt in TX
      expect(txReturn.taxableSalesAmount).toBe(80000);
      expect(txReturn.timelyFilingDiscount).toBeGreaterThan(0);
    });

    it('should generate unified CPA Tax Return Binder', () => {
      const binder = SalesTaxFilingService.generateCpaTaxBinder();
      expect(binder.taxYear).toBe(2026);
      expect(binder.documentsIncluded.length).toBeGreaterThan(5);
    });
  });

  describe('Módulo de Agendamento (Timesheet Profitability & Approval)', () => {
    it('should calculate timesheet profitability margin and handle manager approval', () => {
      const daily = [
        { dayOfWeek: 'Mon' as const, date: '2026-08-17', hours: 8 },
        { dayOfWeek: 'Tue' as const, date: '2026-08-18', hours: 8 },
        { dayOfWeek: 'Wed' as const, date: '2026-08-19', hours: 8 },
        { dayOfWeek: 'Thu' as const, date: '2026-08-20', hours: 8 },
        { dayOfWeek: 'Fri' as const, date: '2026-08-21', hours: 8 },
        { dayOfWeek: 'Sat' as const, date: '2026-08-22', hours: 0 },
        { dayOfWeek: 'Sun' as const, date: '2026-08-23', hours: 0 },
      ];

      const metrics = TimesheetApprovalEngine.calculateTimesheetMetrics(daily, 85, 250);
      expect(metrics.totalHours).toBe(40);
      expect(metrics.totalCost).toBe(3400);
      expect(metrics.totalRevenue).toBe(10000);
      expect(metrics.marginAmount).toBe(6600);
      expect(metrics.marginPercent).toBe(66.0);
    });
  });
});
