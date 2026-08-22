import { describe, it, expect } from 'vitest';
import { MASTER_CREDENTIALS, AUTHORIZED_ACCOUNTS, DEMO_USERS } from '../src/lib/auth/auth-context';

describe('Zero-Trust Authentication & Master Access Gate (Mister Contábil)', () => {
  it('should have master credentials strictly configured for dfvalu@gmail.com and liudmilabrandao@gmail.com', () => {
    expect(MASTER_CREDENTIALS.email).toBe('dfvalu@gmail.com');
    expect(AUTHORIZED_ACCOUNTS.length).toBe(2);

    const david = AUTHORIZED_ACCOUNTS.find((a) => a.email === 'dfvalu@gmail.com');
    expect(david).toBeDefined();
    expect(david?.passwords).toContain('Brpc@#2026');

    const liudmila = AUTHORIZED_ACCOUNTS.find((a) => a.email === 'liudmilabrandao@gmail.com');
    expect(liudmila).toBeDefined();
    expect(liudmila?.passwords).toContain('Brpc@-#2026');
  });

  it('should provide master owner session configuration for both authorized partners', () => {
    expect(DEMO_USERS.length).toBe(2);
    const master = DEMO_USERS[0].user;
    expect(master.email).toBe('dfvalu@gmail.com');
    expect(master.role).toBe('ADMIN_OWNER');
    expect(master.companyName).toBe('Milla Maid Services LLC');

    const liudmila = DEMO_USERS[1].user;
    expect(liudmila.email).toBe('liudmilabrandao@gmail.com');
    expect(liudmila.role).toBe('ADMIN_OWNER');
    expect(liudmila.companyName).toBe('Milla Maid Services LLC');
  });

  it('should strictly reject simple passwords like 123456 or generic strings', () => {
    const invalidPasswords = ['123456', 'password', 'admin', 'Mister@2026'];
    for (const pass of invalidPasswords) {
      for (const account of AUTHORIZED_ACCOUNTS) {
        expect(account.passwords.includes(pass)).toBe(false);
      }
    }
  });
});
