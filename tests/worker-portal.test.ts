import { describe, it, expect } from 'vitest';
import { WorkerPortalEngine } from '../src/lib/portal/worker-portal-engine';

describe('WorkerPortalEngine (Employee & 1099 Self-Service)', () => {
  it('should retrieve worker profile with paystubs and PTO balance', () => {
    const profile = WorkerPortalEngine.getWorkerProfile('w-1');
    expect(profile.name).toBe('Sarah Jenkins');
    expect(profile.pto.availableHours).toBe(80);
    expect(profile.paystubs.length).toBeGreaterThan(0);
  });

  it('should submit PTO request when available hours are sufficient', () => {
    const profile = WorkerPortalEngine.getWorkerProfile('w-1');
    const result = WorkerPortalEngine.requestPto(profile, '2026-10-12', '2026-10-16', 40);

    expect(result.success).toBe(true);
    expect(result.updatedProfile?.pto.pendingRequests.length).toBe(2);
  });

  it('should reject PTO request if requested hours exceed available hours', () => {
    const profile = WorkerPortalEngine.getWorkerProfile('w-1');
    const result = WorkerPortalEngine.requestPto(profile, '2026-10-12', '2026-10-30', 200);

    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient PTO balance');
  });
});
