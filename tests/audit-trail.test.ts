import { describe, it, expect } from 'vitest';
import { CryptographicAuditTrailEngine, AuditLogBlock } from '../src/lib/security/audit-trail-engine';

describe('CryptographicAuditTrailEngine (SOC 1 / SOC 2 Merkle Tree Audit Trail)', () => {
  it('should create valid chained blocks and verify intact ledger integrity', () => {
    const b0 = CryptographicAuditTrailEngine.createAuditBlock(
      0,
      '00000000000000000000000000000000',
      'JOURNAL_ENTRY_POSTED',
      'u-1',
      'Victoria CFO',
      '198.51.100.42',
      'JE-1',
      'Initial Capital $325,000'
    );

    const b1 = CryptographicAuditTrailEngine.createAuditBlock(
      1,
      b0.currentHash,
      'DISBURSEMENT_APPROVED',
      'u-1',
      'Victoria CFO',
      '198.51.100.42',
      'D-1',
      'Payment Approved $4,800'
    );

    const verification = CryptographicAuditTrailEngine.verifyChainIntegrity([b0, b1]);
    expect(verification.isIntegrityIntact).toBe(true);
    expect(verification.totalBlocksVerified).toBe(2);
    expect(verification.merkleRootHash).toContain('sha256_');
  });

  it('should detect tampering if a past audit block payload was modified in the database', () => {
    const b0 = CryptographicAuditTrailEngine.createAuditBlock(
      0,
      '00000000000000000000000000000000',
      'JOURNAL_ENTRY_POSTED',
      'u-1',
      'Victoria CFO',
      '198.51.100.42',
      'JE-1',
      'Initial Capital $325,000'
    );

    // Tamper with payload
    const tamperedBlock0: AuditLogBlock = {
      ...b0,
      payloadSummary: 'TAMPERED ILLEGAL CAPITAL $999,999,999',
    };

    const verification = CryptographicAuditTrailEngine.verifyChainIntegrity([tamperedBlock0]);
    expect(verification.isIntegrityIntact).toBe(false);
    expect(verification.tamperedBlockIndex).toBe(0);
    expect(verification.merkleRootHash).toBe('TAMPERED_PAYLOAD');
  });
});
