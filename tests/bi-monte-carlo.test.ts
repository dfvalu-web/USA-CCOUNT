import { describe, it, expect } from 'vitest';
import { MonteCarloForecastEngine } from '../src/lib/bi/monte-carlo-forecast';
import { UnitEconomicsEngine } from '../src/lib/bi/unit-economics-engine';
import { AIFinancialInsightsEngine } from '../src/lib/bi/ai-insights-generator';

describe('BI Analytics, Unit Economics & Monte Carlo Engine (CFA Wall Street Standard)', () => {
  it('should calculate project contribution margin and realization rate accurately', () => {
    const proj = UnitEconomicsEngine.calculateProjectEconomics(
      'p-1',
      'Cloud Modernization',
      'Acme Global Corp',
      100000,
      20000, // Internal
      10000, // 1099
      5000, // Direct cloud
      400 // Hours
    );

    expect(proj.totalRevenue).toBe(100000);
    expect(proj.totalCostOfDelivery).toBe(35000); // 20k + 10k + 5k
    expect(proj.contributionMargin).toBe(65000); // 100k - 35k
    expect(proj.contributionMarginPercentage).toBe(65.0);
    expect(proj.effectiveHourlyRealizationRate).toBe(250); // 100k / 400 hrs
  });

  it('should calculate Client LTV and LTV/CAC ratio accurately', () => {
    const ltv = UnitEconomicsEngine.calculateClientLtv(
      'c-1',
      'Acme Global Corp',
      100000, // ACV
      70, // Gross margin %
      3, // Lifespan years
      10000 // CAC
    );

    expect(ltv.lifetimeValueLtv).toBe(210000); // 100k * 0.7 * 3 = 210k
    expect(ltv.ltvCacRatio).toBe(21.0); // 210k / 10k = 21x
    expect(ltv.healthStatus).toBe('EXCELLENT');
  });

  it('should run Monte Carlo simulation across 1,000 iterations and maintain P10 <= P50 <= P90 percentile ordering', () => {
    const sim = MonteCarloForecastEngine.runSimulation(
      400000, // Current cash
      25000, // Burn
      50000, // Inflows
      0.15,
      1000
    );

    expect(sim.iterationsCount).toBe(1000);
    expect(sim.forecast30Days.stressP10).toBeLessThanOrEqual(sim.forecast30Days.baseMedianP50);
    expect(sim.forecast30Days.baseMedianP50).toBeLessThanOrEqual(sim.forecast30Days.optimisticP90);
    expect(sim.forecast30Days.probabilityOfPositiveCash).toBe(100);
  });

  it('should generate strategic AI narrative recommendations based on financial thresholds', () => {
    const insights = AIFinancialInsightsEngine.generateInsights(14.8, 71.4, 24, 84.6);
    expect(insights.length).toBeGreaterThanOrEqual(3);
    expect(insights.some((i) => i.category === 'LIQUIDITY')).toBe(true);
    expect(insights.some((i) => i.category === 'MARGIN')).toBe(true);
  });
});
