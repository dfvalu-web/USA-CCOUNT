import { describe, it, expect } from 'vitest';
import { DEMO_USERS } from '../src/lib/auth/auth-context';

describe('Authentication & RBAC System (Mister Contábil)', () => {
  it('should provide pre-configured demo users for all primary roles', () => {
    expect(DEMO_USERS.length).toBe(3);

    const admin = DEMO_USERS.find((u) => u.user.role === 'ADMIN_OWNER');
    expect(admin).toBeDefined();
    expect(admin?.user.email).toBe('milla@millamaidservices.com');
    expect(admin?.user.companyName).toBe('Milla Maid Services LLC');

    const cpa = DEMO_USERS.find((u) => u.user.role === 'CPA_ACCOUNTANT');
    expect(cpa).toBeDefined();
    expect(cpa?.user.title).toContain('CPA');

    const b2b = DEMO_USERS.find((u) => u.user.role === 'CLIENT_B2B');
    expect(b2b).toBeDefined();
    expect(b2b?.user.role).toBe('CLIENT_B2B');
  });

  it('should have 2FA and security tokens initialized for enterprise users', () => {
    const admin = DEMO_USERS[0].user;
    expect(admin.is2faEnabled).toBe(true);
    expect(admin.token).toContain('jwt_token');
  });
});
