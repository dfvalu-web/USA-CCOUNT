import { describe, it, expect } from 'vitest';
import { SystemAuditEngine } from '@/lib/audit/system-audit-engine';

describe('SystemAuditEngine (System Health & Integrity Hub)', () => {
  it('should run a deep diagnostic scan and compute health score', () => {
    const report = SystemAuditEngine.runDeepDiagnosticScan();

    expect(report.overallHealthScore).toBeGreaterThan(0);
    expect(report.overallHealthScore).toBeLessThanOrEqual(100);
    expect(report.totalAccountsAudited).toBeGreaterThan(0);
    expect(report.totalTransactionsAudited).toBeGreaterThan(0);
    expect(typeof report.isLedgerBalanced).toBe('boolean');
    expect(report.totalDebits).toBeGreaterThan(0);
    expect(report.totalCredits).toBeGreaterThan(0);
    expect(report.anomalies.length).toBeGreaterThan(0);
  });

  it('should resolve and auto-fix anomalies', () => {
    const report = SystemAuditEngine.runDeepDiagnosticScan();
    const firstAnomaly = report.anomalies[0];

    const updated = SystemAuditEngine.resolveAnomaly(firstAnomaly.id, 'AUTO_FIX');
    const fixed = updated.find((a) => a.id === firstAnomaly.id);

    expect(fixed?.status).toBe('AUTO_FIXED');
  });
});
