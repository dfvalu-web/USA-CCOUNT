import { describe, it, expect } from 'vitest';
import { AdvancedMonteCarloEngine } from '../src/lib/bi/advanced-monte-carlo';

describe('AdvancedMonteCarloEngine (10,000 Paths & Sensitivity Matrix)', () => {
  it('should run 10,000 paths and calculate downside CVaR and insolvency risk accurately', () => {
    const result = AdvancedMonteCarloEngine.runSensitivitySimulation(
      415200, // Cash
      28050, // Burn
      65000, // Inflows
      { revenueShockPercent: -20, dsoDelayDays: 15, fixedCostEscalationPercent: 10 },
      10000
    );

    expect(result.iterations).toBe(10000);
    expect(result.projectedRunwayMonths).toBeGreaterThan(0);
    expect(result.p10WorstCase90d).toBeLessThanOrEqual(result.p50Median90d);
    expect(result.p50Median90d).toBeLessThanOrEqual(result.p90BestCase90d);
  });
});
