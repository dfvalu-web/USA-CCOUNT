import { describe, it, expect } from 'vitest';
import { ContractEsignEngine, ServiceContractAgreement } from '../src/lib/contracts/contract-esign-engine';

describe('ContractEsignEngine (Digital Signatures & SOW Management)', () => {
  it('should digitally execute agreement and produce verifiable cryptographic hash', () => {
    const contract: ServiceContractAgreement = {
      id: 'SOW-1',
      contractTitle: 'Fintech Advisory',
      clientName: 'Horizon Fintech',
      clientContactEmail: 'cfo@horizon.com',
      contractType: 'MONTHLY_RETAINER',
      totalValue: 120000,
      effectiveDate: '2026-09-01',
      expirationDate: '2027-08-31',
      status: 'SENT_FOR_SIGNATURE',
    };

    const signed = ContractEsignEngine.executeDigitalSignature(contract, 'Marcus Vance', '198.51.100.42');
    expect(signed.status).toBe('EXECUTED_SIGNED');
    expect(signed.cryptographicSignatureHash).toContain('sig_sha256_');
    expect(signed.signerIpAddress).toBe('198.51.100.42');
    expect(signed.signatureTimestamp).toBeDefined();
  });
});
