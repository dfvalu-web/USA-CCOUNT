import Decimal from 'decimal.js';

export interface SensitivityScenarioParams {
  revenueShockPercent: number; // -30 to +30
  dsoDelayDays: number; // 0 to 45
  fixedCostEscalationPercent: number; // 0 to 20
}

export interface AdvancedMonteCarloResult {
  iterations: number;
  currentLiquidity: number;
  adjustedMonthlyBurn: number;
  adjustedMonthlyInflow: number;
  insolvencyRiskPercent: number;
  cashAtRisk95Percent: number; // 95% Value at Risk
  projectedRunwayMonths: number;
  p10WorstCase30d: number;
  p50Median30d: number;
  p90BestCase30d: number;
  p10WorstCase90d: number;
  p50Median90d: number;
  p90BestCase90d: number;
}

export class AdvancedMonteCarloEngine {
  /**
   * Runs advanced 10,000 paths stochastic simulation with multi-factor sensitivity stress testing
   */
  public static runSensitivitySimulation(
    currentCash: number,
    baseMonthlyBurn: number,
    baseMonthlyInflow: number,
    params: SensitivityScenarioParams,
    iterations: number = 10000
  ): AdvancedMonteCarloResult {
    // Apply sensitivity adjustments
    const inflowMultiplier = 1 + params.revenueShockPercent / 100;
    const burnMultiplier = 1 + params.fixedCostEscalationPercent / 100;

    // DSO delay dampens month 1 & 2 cash flow velocity
    const dsoCollectionFactor = Math.max(0.5, 1 - (params.dsoDelayDays / 60));

    const adjInflow = baseMonthlyInflow * inflowMultiplier * dsoCollectionFactor;
    const adjBurn = baseMonthlyBurn * burnMultiplier;

    const sampleNormal = (mean: number, stdDev: number): number => {
      const u = Math.random() || 0.0001;
      const v = Math.random() || 0.0001;
      return mean + Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stdDev;
    };

    const results30: number[] = [];
    const results90: number[] = [];
    let insolventCount = 0;

    for (let i = 0; i < iterations; i++) {
      let cash = currentCash;

      // 30 Days
      const in30 = Math.max(0, sampleNormal(adjInflow, adjInflow * 0.18));
      const out30 = sampleNormal(adjBurn, adjBurn * 0.05);
      cash = cash + in30 - out30;
      results30.push(cash);

      // 60 & 90 Days
      const in60 = Math.max(0, sampleNormal(adjInflow, adjInflow * 0.18));
      const out60 = sampleNormal(adjBurn, adjBurn * 0.05);
      const in90 = Math.max(0, sampleNormal(adjInflow, adjInflow * 0.18));
      const out90 = sampleNormal(adjBurn, adjBurn * 0.05);

      cash = cash + (in60 - out60) + (in90 - out90);
      results90.push(cash);

      if (cash <= 0) insolventCount++;
    }

    results30.sort((a, b) => a - b);
    results90.sort((a, b) => a - b);

    const getPct = (arr: number[], pct: number) => parseFloat(arr[Math.floor((pct / 100) * arr.length)].toFixed(2));

    const p5VaR90d = getPct(results90, 5);
    const cashAtRisk95 = Math.max(0, parseFloat((currentCash - p5VaR90d).toFixed(2)));
    const insolvencyRisk = parseFloat(((insolventCount / iterations) * 100).toFixed(2));
    const runway = adjBurn > 0 ? parseFloat((currentCash / adjBurn).toFixed(1)) : 99;

    return {
      iterations,
      currentLiquidity: currentCash,
      adjustedMonthlyBurn: parseFloat(adjBurn.toFixed(2)),
      adjustedMonthlyInflow: parseFloat(adjInflow.toFixed(2)),
      insolvencyRiskPercent: insolvencyRisk,
      cashAtRisk95Percent: cashAtRisk95,
      projectedRunwayMonths: runway,
      p10WorstCase30d: getPct(results30, 10),
      p50Median30d: getPct(results30, 50),
      p90BestCase30d: getPct(results30, 90),
      p10WorstCase90d: getPct(results90, 10),
      p50Median90d: getPct(results90, 50),
      p90BestCase90d: getPct(results90, 90),
    };
  }
}
