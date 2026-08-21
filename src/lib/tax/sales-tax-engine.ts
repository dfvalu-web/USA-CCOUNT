import Decimal from 'decimal.js';

export interface StateNexusStatus {
  stateCode: string;
  stateName: string;
  salesTotal: number;
  transactionCount: number;
  salesThreshold: number; // e.g. $100,000
  transactionThreshold: number; // e.g. 200
  hasEconomicNexus: boolean;
  salesPercentageToThreshold: number;
  isSaaSOrServiceTaxable: boolean;
  statutoryRate: number; // Combined state + avg local rate
}

export class SalesTaxNexusEngine {
  private static STATE_RULES: Record<
    string,
    { name: string; salesThreshold: number; txThreshold: number; isServiceTaxable: boolean; avgRate: number }
  > = {
    CA: { name: 'California', salesThreshold: 500000, txThreshold: 0, isServiceTaxable: false, avgRate: 0.0885 },
    NY: { name: 'New York', salesThreshold: 500000, txThreshold: 100, isServiceTaxable: true, avgRate: 0.0852 },
    TX: { name: 'Texas', salesThreshold: 500000, txThreshold: 0, isServiceTaxable: true, avgRate: 0.0825 },
    FL: { name: 'Florida', salesThreshold: 100000, txThreshold: 0, isServiceTaxable: false, avgRate: 0.0702 },
    DE: { name: 'Delaware', salesThreshold: 0, txThreshold: 0, isServiceTaxable: false, avgRate: 0 }, // 0% Sales Tax
    WA: { name: 'Washington', salesThreshold: 100000, txThreshold: 0, isServiceTaxable: true, avgRate: 0.0929 },
    IL: { name: 'Illinois', salesThreshold: 100000, txThreshold: 200, isServiceTaxable: true, avgRate: 0.0882 },
    PA: { name: 'Pennsylvania', salesThreshold: 100000, txThreshold: 0, isServiceTaxable: true, avgRate: 0.0634 },
  };

  /**
   * Evaluates Economic Nexus status across all US States based on sales feed
   */
  public static evaluateNexus(
    salesByState: Array<{ state: string; amount: number; transactionCount: number }>
  ): StateNexusStatus[] {
    const results: StateNexusStatus[] = [];

    for (const [code, rule] of Object.entries(this.STATE_RULES)) {
      const stateSales = salesByState.find((s) => s.state.toUpperCase() === code);
      const totalAmount = stateSales ? stateSales.amount : 0;
      const count = stateSales ? stateSales.transactionCount : 0;

      const salesPct =
        rule.salesThreshold > 0
          ? Math.min(100, (totalAmount / rule.salesThreshold) * 100)
          : 0;

      const hasNexus =
        (rule.salesThreshold > 0 && totalAmount >= rule.salesThreshold) ||
        (rule.txThreshold > 0 && count >= rule.txThreshold);

      results.push({
        stateCode: code,
        stateName: rule.name,
        salesTotal: totalAmount,
        transactionCount: count,
        salesThreshold: rule.salesThreshold,
        transactionThreshold: rule.txThreshold,
        hasEconomicNexus: hasNexus,
        salesPercentageToThreshold: parseFloat(salesPct.toFixed(1)),
        isSaaSOrServiceTaxable: rule.isServiceTaxable,
        statutoryRate: rule.avgRate,
      });
    }

    return results.sort((a, b) => b.salesTotal - a.salesTotal);
  }

  /**
   * Calculates Sales Tax to collect for a transaction based on state taxability rules
   */
  public static calculateSalesTax(state: string, grossServiceAmount: number): { taxableAmount: number; taxDue: number; rate: number } {
    const rule = this.STATE_RULES[state.toUpperCase()];
    if (!rule || !rule.isServiceTaxable || rule.avgRate === 0) {
      return { taxableAmount: 0, taxDue: 0, rate: 0 };
    }

    // Texas 80% SaaS exemption rule (only 80% is taxable)
    let taxableAmount = grossServiceAmount;
    if (state.toUpperCase() === 'TX') {
      taxableAmount = new Decimal(grossServiceAmount).times('0.8').toNumber();
    }

    const taxDue = new Decimal(taxableAmount).times(new Decimal(rule.avgRate));
    return {
      taxableAmount,
      taxDue: parseFloat(taxDue.toFixed(2)),
      rate: rule.avgRate,
    };
  }
}
