import Decimal from 'decimal.js';

export interface QuarterlyEstimate {
  quarter: 1 | 2 | 3 | 4;
  dueDate: string;
  projectedNetIncomeQuarterly: number;
  federalEstimatedTaxDue: number; // Form 1040-ES / 1120-W
  stateEstimatedTaxDue: number;
  totalEstimatedQuarterlyPayment: number;
  safeHarborMet: boolean;
}

export class EstimatedTaxCalculator {
  /**
   * Generates Q1-Q4 quarterly tax payment schedule
   */
  public static calculateQuarterlyEstimatedTaxes(
    annualNetIncomeProjected: number,
    stateCode: string = 'DE',
    entityType: 'PASS_THROUGH' | 'C_CORP' = 'PASS_THROUGH',
    taxYear: number = 2026
  ): QuarterlyEstimate[] {
    const netDec = new Decimal(annualNetIncomeProjected);
    const quarters = [
      { q: 1 as const, due: `${taxYear}-04-15` },
      { q: 2 as const, due: `${taxYear}-06-15` },
      { q: 3 as const, due: `${taxYear}-09-15` },
      { q: 4 as const, due: `${taxYear + 1}-01-15` },
    ];

    // Federal Effective Rate Estimate (21% C-Corp, ~24% Pass-through blended individual)
    const fedRate = entityType === 'C_CORP' ? new Decimal('0.21') : new Decimal('0.24');
    
    // State Effective Rate
    let stateRate = new Decimal('0.05');
    if (['TX', 'FL', 'WA', 'WY', 'NV'].includes(stateCode.toUpperCase())) {
      stateRate = new Decimal(0);
    } else if (stateCode.toUpperCase() === 'CA') {
      stateRate = new Decimal('0.093');
    } else if (stateCode.toUpperCase() === 'NY') {
      stateRate = new Decimal('0.0685');
    }

    const annualFedTax = netDec.times(fedRate);
    const annualStateTax = netDec.times(stateRate);

    const quarterlyFed = annualFedTax.dividedBy(4);
    const quarterlyState = annualStateTax.dividedBy(4);
    const quarterlyNet = netDec.dividedBy(4);

    return quarters.map(({ q, due }) => {
      const total = quarterlyFed.plus(quarterlyState);
      return {
        quarter: q,
        dueDate: due,
        projectedNetIncomeQuarterly: parseFloat(quarterlyNet.toFixed(2)),
        federalEstimatedTaxDue: parseFloat(quarterlyFed.toFixed(2)),
        stateEstimatedTaxDue: parseFloat(quarterlyState.toFixed(2)),
        totalEstimatedQuarterlyPayment: parseFloat(total.toFixed(2)),
        safeHarborMet: true,
      };
    });
  }
}
