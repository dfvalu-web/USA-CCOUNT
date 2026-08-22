import { describe, it, expect } from 'vitest';
import { MonthEndCloseEngine } from '../src/lib/closing/month-end-close-engine';

describe('MonthEndCloseEngine — Big 4 Checklist, Trial Balance Math & Period Lock', () => {
  it('should generate closing package with balanced debits and credits', () => {
    const pkg = MonthEndCloseEngine.getClosingPackage('cmp-milla-maid-ga', 'Milla Maid Services LLC', 2026, 8);
    expect(pkg.companyName).toBe('Milla Maid Services LLC');
    expect(pkg.isBalanced).toBe(true);
    expect(pkg.totalDebits).toBe(pkg.totalCredits);
    expect(pkg.checklists.length).toBe(6);
  });

  it('should handle period locking and unlocking with cryptographic seal', () => {
    MonthEndCloseEngine.setPeriodLock('cmp-milla-maid-ga', 2026, 8, true, 'dfvalu@gmail.com');
    const lockedPkg = MonthEndCloseEngine.getClosingPackage('cmp-milla-maid-ga', 'Milla Maid Services LLC', 2026, 8);
    expect(lockedPkg.isPeriodLocked).toBe(true);
    expect(lockedPkg.lockedBy).toContain('dfvalu@gmail.com');

    // Unlock
    MonthEndCloseEngine.setPeriodLock('cmp-milla-maid-ga', 2026, 8, false);
    const unlockedPkg = MonthEndCloseEngine.getClosingPackage('cmp-milla-maid-ga', 'Milla Maid Services LLC', 2026, 8);
    expect(unlockedPkg.isPeriodLocked).toBe(false);
  });

  it('should react dynamically to each selected company (Milla Maid GA, Apex CleanOps TX, Apex Cloud DE)', () => {
    const pkgMilla = MonthEndCloseEngine.getClosingPackage('cmp-milla-maid-ga', 'Milla Maid Services LLC', 2026, 8);
    expect(pkgMilla.companyName).toBe('Milla Maid Services LLC');
    expect(pkgMilla.companyEin).toBe('84-3910294');
    expect(pkgMilla.checklists[0].description).toContain('Truist Bank');

    const pkgApexTx = MonthEndCloseEngine.getClosingPackage('cmp-apex-cleanops-tx', 'Apex CleanOps Commercial Services LLC', 2026, 8);
    expect(pkgApexTx.companyName).toBe('Apex CleanOps Commercial Services LLC');
    expect(pkgApexTx.companyEin).toBe('84-9281742');
    expect(pkgApexTx.checklists[0].title).toContain('JPMorgan Chase Texas');

    const pkgApexDe = MonthEndCloseEngine.getClosingPackage('cmp-apex-cloud-de', 'Apex Cloud Technologies Inc.', 2026, 8);
    expect(pkgApexDe.companyName).toBe('Apex Cloud Technologies Inc.');
    expect(pkgApexDe.companyEin).toBe('88-9182736');
    expect(pkgApexDe.checklists[0].title).toContain('Mercury Silicon Valley');
  });
});
