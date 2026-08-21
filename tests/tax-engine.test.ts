import { describe, it, expect } from 'vitest';
import { SalesTaxNexusEngine } from '../src/lib/tax/sales-tax-engine';
import { IRSMappingEngine } from '../src/lib/tax/irs-mapping-engine';
import { EstimatedTaxCalculator } from '../src/lib/tax/estimated-tax-calculator';
import { SAMPLE_LEDGER_ACCOUNTS } from '../src/lib/accounting/sample-data';

describe('Tax & Compliance Engine (US Jurisdiction)', () => {
  it('should calculate Sales Tax for SaaS in Texas applying the 80% statutory exemption rule', () => {
    const txTax = SalesTaxNexusEngine.calculateSalesTax('TX', 10000);
    expect(txTax.taxableAmount).toBe(8000); // 80% of $10,000
    expect(txTax.taxDue).toBe(660); // 8000 * 0.0825 = 660
  });

  it('should recognize 0% sales tax for Delaware (DE)', () => {
    const deTax = SalesTaxNexusEngine.calculateSalesTax('DE', 10000);
    expect(deTax.taxDue).toBe(0);
  });

  it('should accurately map GL accounts to IRS Form 1065 (Partnership / LLC)', () => {
    const report = IRSMappingEngine.mapToIRSForm(SAMPLE_LEDGER_ACCOUNTS, 'LLC_PARTNERSHIP_1065', 2026);
    expect(report.formName).toContain('Form 1065');
    expect(report.grossReceipts).toBeGreaterThan(0);
    expect(report.lines.find((l) => l.lineNumber === 'Line 1a')?.amount).toBe(report.grossReceipts);
    expect(report.ordinaryBusinessIncome).toBe(report.grossProfit - report.totalDeductions);
  });

  it('should generate 4 quarterly estimated tax schedules with correct statutory deadlines', () => {
    const estimates = EstimatedTaxCalculator.calculateQuarterlyEstimatedTaxes(100000, 'CA', 'PASS_THROUGH', 2026);
    expect(estimates.length).toBe(4);
    expect(estimates[0].dueDate).toBe('2026-04-15');
    expect(estimates[1].dueDate).toBe('2026-06-15');
    expect(estimates[2].dueDate).toBe('2026-09-15');
    expect(estimates[3].dueDate).toBe('2027-01-15');
    expect(estimates[0].federalEstimatedTaxDue).toBe(6000); // (100k * 0.24) / 4
  });
});
