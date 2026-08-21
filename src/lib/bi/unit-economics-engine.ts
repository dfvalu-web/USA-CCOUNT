import Decimal from 'decimal.js';

export interface ProjectUnitEconomics {
  projectId: string;
  projectName: string;
  clientName: string;
  totalRevenue: number;
  directInternalLaborCost: number;
  subcontractor1099Cost: number;
  directInfrastructureCost: number;
  totalCostOfDelivery: number;
  contributionMargin: number;
  contributionMarginPercentage: number;
  billableHours: number;
  effectiveHourlyRealizationRate: number; // Revenue / Billable Hours
}

export interface ClientLtvCacMetric {
  clientId: string;
  clientName: string;
  annualContractValue: number;
  estimatedLifespanYears: number;
  lifetimeValueLtv: number;
  acquisitionCostCac: number;
  ltvCacRatio: number;
  healthStatus: 'HEALTHY' | 'EXCELLENT' | 'AT_RISK';
}

export class UnitEconomicsEngine {
  /**
   * Calculates Project-level Contribution Margin & Effective Hourly Realization
   */
  public static calculateProjectEconomics(
    projectId: string,
    projectName: string,
    clientName: string,
    revenue: number,
    internalLabor: number,
    contractor1099: number,
    directInfra: number,
    billableHours: number
  ): ProjectUnitEconomics {
    const revDec = new Decimal(revenue);
    const directCostDec = new Decimal(internalLabor).plus(new Decimal(contractor1099)).plus(new Decimal(directInfra));
    const marginDec = revDec.minus(directCostDec);
    const marginPct = revDec.greaterThan(0)
      ? marginDec.dividedBy(revDec).times(100).toNumber()
      : 0;

    const realization = billableHours > 0
      ? revDec.dividedBy(new Decimal(billableHours)).toNumber()
      : 0;

    return {
      projectId,
      projectName,
      clientName,
      totalRevenue: revDec.toNumber(),
      directInternalLaborCost: internalLabor,
      subcontractor1099Cost: contractor1099,
      directInfrastructureCost: directInfra,
      totalCostOfDelivery: directCostDec.toNumber(),
      contributionMargin: marginDec.toNumber(),
      contributionMarginPercentage: parseFloat(marginPct.toFixed(1)),
      billableHours,
      effectiveHourlyRealizationRate: parseFloat(realization.toFixed(2)),
    };
  }

  /**
   * Calculates Client LTV vs CAC ratios
   */
  public static calculateClientLtv(
    clientId: string,
    clientName: string,
    acv: number,
    grossMarginPercent: number,
    lifespanYears: number,
    cac: number
  ): ClientLtvCacMetric {
    const marginRatio = new Decimal(grossMarginPercent).dividedBy(100);
    const ltvDec = new Decimal(acv).times(marginRatio).times(new Decimal(lifespanYears));
    const cacDec = new Decimal(cac);
    const ratio = cacDec.greaterThan(0) ? ltvDec.dividedBy(cacDec).toNumber() : 0;

    let healthStatus: 'HEALTHY' | 'EXCELLENT' | 'AT_RISK' = 'HEALTHY';
    if (ratio >= 4.0) healthStatus = 'EXCELLENT';
    else if (ratio < 2.0) healthStatus = 'AT_RISK';

    return {
      clientId,
      clientName,
      annualContractValue: acv,
      estimatedLifespanYears: lifespanYears,
      lifetimeValueLtv: parseFloat(ltvDec.toFixed(2)),
      acquisitionCostCac: cac,
      ltvCacRatio: parseFloat(ratio.toFixed(2)),
      healthStatus,
    };
  }
}
