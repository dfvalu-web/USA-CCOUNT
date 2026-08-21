import Decimal from 'decimal.js';

export interface MonteCarloForecastPoint {
  day: 30 | 60 | 90;
  baseMedianP50: number;
  optimisticP90: number;
  stressP10: number;
  probabilityOfPositiveCash: number;
}

export interface MonteCarloSimulationResult {
  currentCashBalance: number;
  monthlyFixedBurn: number;
  monthlyVariableReceiptsExpected: number;
  iterationsCount: number;
  forecast30Days: MonteCarloForecastPoint;
  forecast60Days: MonteCarloForecastPoint;
  forecast90Days: MonteCarloForecastPoint;
  minimumProjectedRunwayMonths: number;
}

export class MonteCarloForecastEngine {
  /**
   * Generates a Monte Carlo simulation for 30, 60, and 90 day cash flows
   * @param currentCash Current bank checking + high yield savings balance
   * @param monthlyBurn Fixed monthly SG&A + payroll disbursements
   * @param expectedMonthlyInflow Pipeline retainers + invoice collections
   * @param volatility Standard deviation of collection timing/amounts (0.15 to 0.30)
   * @param iterations Number of simulation paths (default 1,000)
   */
  public static runSimulation(
    currentCash: number,
    monthlyBurn: number,
    expectedMonthlyInflow: number,
    volatility: number = 0.20,
    iterations: number = 1000
  ): MonteCarloSimulationResult {
    const results30: number[] = [];
    const results60: number[] = [];
    const results90: number[] = [];

    // Simple pseudo-random normal distribution box-muller transform
    const sampleNormal = (mean: number, stdDev: number): number => {
      const u = Math.random() || 0.0001;
      const v = Math.random() || 0.0001;
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return mean + z * stdDev;
    };

    for (let i = 0; i < iterations; i++) {
      let cash = currentCash;

      // Month 1 (Day 30)
      const inflowM1 = Math.max(0, sampleNormal(expectedMonthlyInflow, expectedMonthlyInflow * volatility));
      const burnM1 = sampleNormal(monthlyBurn, monthlyBurn * 0.05);
      cash = cash + inflowM1 - burnM1;
      results30.push(cash);

      // Month 2 (Day 60)
      const inflowM2 = Math.max(0, sampleNormal(expectedMonthlyInflow, expectedMonthlyInflow * volatility));
      const burnM2 = sampleNormal(monthlyBurn, monthlyBurn * 0.05);
      cash = cash + inflowM2 - burnM2;
      results60.push(cash);

      // Month 3 (Day 90)
      const inflowM3 = Math.max(0, sampleNormal(expectedMonthlyInflow, expectedMonthlyInflow * volatility));
      const burnM3 = sampleNormal(monthlyBurn, monthlyBurn * 0.05);
      cash = cash + inflowM3 - burnM3;
      results90.push(cash);
    }

    // Sort to extract percentiles (P10 = 10th percentile, P50 = Median, P90 = 90th percentile)
    results30.sort((a, b) => a - b);
    results60.sort((a, b) => a - b);
    results90.sort((a, b) => a - b);

    const getPercentile = (arr: number[], pct: number) => {
      const index = Math.floor((pct / 100) * arr.length);
      return parseFloat(arr[index].toFixed(2));
    };

    const getProbPositive = (arr: number[]) => {
      const positiveCount = arr.filter((v) => v > 0).length;
      return parseFloat(((positiveCount / arr.length) * 100).toFixed(1));
    };

    const f30: MonteCarloForecastPoint = {
      day: 30,
      stressP10: getPercentile(results30, 10),
      baseMedianP50: getPercentile(results30, 50),
      optimisticP90: getPercentile(results30, 90),
      probabilityOfPositiveCash: getProbPositive(results30),
    };

    const f60: MonteCarloForecastPoint = {
      day: 60,
      stressP10: getPercentile(results60, 10),
      baseMedianP50: getPercentile(results60, 50),
      optimisticP90: getPercentile(results60, 90),
      probabilityOfPositiveCash: getProbPositive(results60),
    };

    const f90: MonteCarloForecastPoint = {
      day: 90,
      stressP10: getPercentile(results90, 10),
      baseMedianP50: getPercentile(results90, 50),
      optimisticP90: getPercentile(results90, 90),
      probabilityOfPositiveCash: getProbPositive(results90),
    };

    const minRunway = monthlyBurn > 0 ? parseFloat((currentCash / monthlyBurn).toFixed(1)) : 99;

    return {
      currentCashBalance: currentCash,
      monthlyFixedBurn: monthlyBurn,
      monthlyVariableReceiptsExpected: expectedMonthlyInflow,
      iterationsCount: iterations,
      forecast30Days: f30,
      forecast60Days: f60,
      forecast90Days: f90,
      minimumProjectedRunwayMonths: minRunway,
    };
  }
}
