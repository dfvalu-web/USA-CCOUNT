import { describe, it, expect } from 'vitest';
import { StateFranchiseTaxEngine } from '../src/lib/tax/state-franchise-tax-engine';

describe('StateFranchiseTaxEngine (Delaware, California & Texas Compliance)', () => {
  it('should calculate Delaware LLC flat franchise tax of $300', () => {
    const llc = StateFranchiseTaxEngine.calculateDelawareFranchiseTax(0, 0, 500000, true);
    expect(llc.minimalTaxPayable).toBe(300);
  });

  it('should optimize Delaware C-Corp tax selecting the cheaper Assumed Par Value Method for 10M share startup', () => {
    // 10M shares authorized would be $85,000+ under Authorized Shares, but $400 under Assumed Par Value Capital Method
    const corp = StateFranchiseTaxEngine.calculateDelawareFranchiseTax(10000000, 8000000, 500000, false);
    expect(corp.recommendedMethod).toBe('ASSUMED_PAR_VALUE');
    expect(corp.assumedParValueMethodTax).toBe(400);
    expect(corp.minimalTaxPayable).toBe(450); // $400 + $50 filing fee
  });

  it('should calculate California Form 568 with $800 minimum tax and graduated fee', () => {
    const ca = StateFranchiseTaxEngine.calculateCaliforniaLlcTax(350000);
    expect(ca.annualMinimumTax).toBe(800);
    expect(ca.graduatedLlcFee).toBe(900); // $250k - $499k tier
    expect(ca.totalCaliforniaTaxDue).toBe(1700);
  });

  it('should verify Texas Franchise Tax No-Tax-Due eligibility under $2.47M threshold', () => {
    const tx = StateFranchiseTaxEngine.calculateTexasFranchiseTax(450000);
    expect(tx.isNoTaxDueEligible).toBe(true);
  });
});
