import { describe, it, expect } from 'vitest';
import { ExecutiveReportsEngine } from '../src/lib/reports/executive-reports-engine';

describe('ExecutiveReportsEngine - SBA Banking & Certified Financial Package', () => {
  it('should generate a certified financial package for Milla Maid Services LLC (2024)', () => {
    const pkg = ExecutiveReportsEngine.generateCertifiedPackage('comp-001', 'Milla Maid Services LLC', 2024);

    expect(pkg).toBeDefined();
    expect(pkg.entityName).toBe('Milla Maid Services LLC');
    expect(pkg.fiscalYear).toBe(2024);
    expect(pkg.balanceSheet).toBeDefined();
    expect(pkg.incomeStatement).toBeDefined();
    expect(pkg.cashFlow).toBeDefined();
    expect(pkg.isBalanced).toBe(true);
    expect(pkg.variance).toBeLessThan(0.01);
  });

  it('should accurately calculate SBA Loan Banking Ratios (DSCR, Current Ratio, Working Capital)', () => {
    // Test for profitable year 2025
    const pkg2025 = ExecutiveReportsEngine.generateCertifiedPackage('comp-001', 'Milla Maid Services LLC', 2025);
    const metrics2025 = pkg2025.sbaMetrics;

    expect(metrics2025).toBeDefined();
    expect(metrics2025.currentRatio).toBeGreaterThan(1.0);
    expect(metrics2025.workingCapital).toBeGreaterThan(0);
    expect(metrics2025.dscr).toBeGreaterThan(1.0);
    expect(metrics2025.debtToEquity).toBeGreaterThanOrEqual(0);
    expect(['APPROVED', 'CONDITIONAL', 'REVIEW']).toContain(metrics2025.sbaStatus);
    expect(metrics2025.keyStrengths.length).toBeGreaterThan(0);

    // Test for 2024
    const pkg2024 = ExecutiveReportsEngine.generateCertifiedPackage('comp-001', 'Milla Maid Services LLC', 2024);
    expect(pkg2024.sbaMetrics.dscr).toBeGreaterThanOrEqual(0);
  });

  it('should support multi-year certified packages (2022, 2023, 2024, 2025)', () => {
    for (const year of [2022, 2023, 2024, 2025]) {
      const pkg = ExecutiveReportsEngine.generateCertifiedPackage('comp-001', 'Milla Maid Services LLC', year);
      expect(pkg.fiscalYear).toBe(year);
      expect(pkg.isBalanced).toBe(true);
      expect(pkg.balanceSheet.totalAssets).toBeGreaterThan(0);
      expect(pkg.balanceSheet.totalLiabilitiesAndEquity).toBeGreaterThan(0);
    }
  });

  it('should generate packages for secondary subsidiaries (Apex CleanOps LLC)', () => {
    const pkg = ExecutiveReportsEngine.generateCertifiedPackage('comp-002', 'Apex CleanOps Commercial Services LLC', 2025);
    expect(pkg.entityName).toBe('Apex CleanOps Commercial Services LLC');
    expect(pkg.isBalanced).toBe(true);
  });
});
