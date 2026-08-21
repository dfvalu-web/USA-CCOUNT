import { describe, it, expect } from 'vitest';
import { YearEndTaxEngine } from '@/lib/tax/year-end-tax-engine';

describe('YearEndTaxEngine (IRS Forms 1099-NEC, W-2 and W-3)', () => {
  it('should list contractors with nonemployee compensation >= $600', () => {
    const list1099 = YearEndTaxEngine.INITIAL_1099_NEC;
    expect(list1099.length).toBeGreaterThan(0);
    list1099.forEach((r) => {
      expect(r.box1NonemployeeCompensation).toBeGreaterThanOrEqual(600);
      expect(r.taxYear).toBe(2026);
    });
  });

  it('should generate accurate Form W-3 transmittal summary from W-2s', () => {
    const w2List = YearEndTaxEngine.INITIAL_W2;
    const w3 = YearEndTaxEngine.generateW3Transmittal(w2List, 2026);

    expect(w3.totalW2FormsCount).toBe(w2List.length);
    expect(w3.totalBox1Wages).toBe(120000); // 68k + 52k
    expect(w3.totalBox2FederalTax).toBe(12160); // 7480 + 4680
    expect(w3.controlNumber).toContain('W3-TX-2026');
  });

  it('should generate valid IRS FIRE formatted electronic transmission file', () => {
    const list1099 = YearEndTaxEngine.INITIAL_1099_NEC;
    const file = YearEndTaxEngine.generateIrsFireElectronicFile(list1099);

    expect(file).toContain('IRS_FIRE_FORMAT');
    expect(file).toContain('APEX CLEANOPS LLC');
    expect(file).toContain('Lucas Vance');
  });
});
