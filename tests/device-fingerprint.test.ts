import { describe, it, expect, beforeEach } from 'vitest';
import {
  getClientDeviceInfo,
  isCurrentDeviceTrusted,
  trustCurrentDevice,
  revokeTrustedDevice,
  revokeAllOtherDevices,
  validateNewDevicePin,
  getTrustedDevices,
  MASTER_DEVICE_SECURITY_PINS,
} from '../src/lib/auth/device-fingerprint';

describe('Adaptive Device Shield & Fingerprint Engine (FFIEC / NIST Compliant)', () => {
  const testEmail = 'liudmilabrandao@gmail.com';

  beforeEach(() => {
    // Clear mock storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should generate consistent device information and hash', () => {
    const info = getClientDeviceInfo();
    expect(info).toBeDefined();
    expect(info.fingerprintHash).toBeDefined();
    expect(info.fingerprintHash.startsWith('fp_')).toBe(true);
    expect(info.deviceName).toBeDefined();
    expect(info.browser).toBeDefined();
    expect(info.os).toBeDefined();
  });

  it('should recognize valid Master PINs for Step-Up verification', () => {
    expect(validateNewDevicePin('849201')).toBe(true);
    expect(validateNewDevicePin('Brpc@#2026')).toBe(true);
    expect(validateNewDevicePin('Brpc@-#2026')).toBe(true);
    expect(validateNewDevicePin('941029')).toBe(true);

    // Reject incorrect PINs
    expect(validateNewDevicePin('000000')).toBe(false);
    expect(validateNewDevicePin('123456')).toBe(false);
    expect(validateNewDevicePin('invalid-pin')).toBe(false);
  });

  it('should successfully trust, list, and revoke a device for an authorized partner', () => {
    // Trust device
    const trusted = trustCurrentDevice(testEmail, 30);
    expect(trusted).toBeDefined();
    expect(trusted.email).toBe(testEmail);
    expect(trusted.isCurrentDevice).toBe(true);

    // Verify current device is recognized
    const isTrusted = isCurrentDeviceTrusted(testEmail);
    expect(isTrusted).toBe(true);

    // List devices
    const list = getTrustedDevices(testEmail);
    expect(list.length).toBe(1);
    expect(list[0].email).toBe(testEmail);

    // Revoke device
    const revoked = revokeTrustedDevice(testEmail, trusted.id);
    expect(revoked).toBe(true);

    const listAfterRevoke = getTrustedDevices(testEmail);
    expect(listAfterRevoke.length).toBe(0);
  });
});
