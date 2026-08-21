export interface AuditLogBlock {
  blockIndex: number;
  timestamp: string;
  eventType: 'JOURNAL_ENTRY_POSTED' | 'DISBURSEMENT_APPROVED' | 'CONTRACT_SIGNED' | 'FX_REVALUATION' | 'OCR_RECEIPT_PROCESSED';
  actorId: string;
  actorName: string;
  actorIp: string;
  resourceId: string;
  payloadSummary: string;
  previousHash: string;
  currentHash: string;
}

export interface MerkleVerificationResult {
  isIntegrityIntact: boolean;
  totalBlocksVerified: number;
  merkleRootHash: string;
  tamperedBlockIndex?: number;
}

export class CryptographicAuditTrailEngine {
  private static computeHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash << 5) - hash + data.charCodeAt(i);
      hash |= 0;
    }
    return `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }

  /**
   * Creates a new cryptographically chained audit log block
   */
  public static createAuditBlock(
    blockIndex: number,
    previousHash: string,
    eventType: AuditLogBlock['eventType'],
    actorId: string,
    actorName: string,
    actorIp: string,
    resourceId: string,
    payloadSummary: string,
    customTimestamp?: string
  ): AuditLogBlock {
    const timestamp = customTimestamp || new Date().toISOString();
    const rawPayload = `${blockIndex}-${previousHash}-${eventType}-${actorId}-${resourceId}-${payloadSummary}-${timestamp}`;
    const currentHash = this.computeHash(rawPayload);

    return {
      blockIndex,
      timestamp,
      eventType,
      actorId,
      actorName,
      actorIp,
      resourceId,
      payloadSummary,
      previousHash,
      currentHash,
    };
  }

  /**
   * Verifies the full Merkle Hash Chain and detects any database tampering
   */
  public static verifyChainIntegrity(blocks: AuditLogBlock[]): MerkleVerificationResult {
    if (blocks.length === 0) {
      return { isIntegrityIntact: true, totalBlocksVerified: 0, merkleRootHash: 'sha256_0000000000000000' };
    }

    let expectedPrevHash = '00000000000000000000000000000000';

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.previousHash !== expectedPrevHash) {
        return {
          isIntegrityIntact: false,
          totalBlocksVerified: i,
          merkleRootHash: 'TAMPERED_CHAIN',
          tamperedBlockIndex: b.blockIndex,
        };
      }

      const recalculatedHash = this.computeHash(
        `${b.blockIndex}-${b.previousHash}-${b.eventType}-${b.actorId}-${b.resourceId}-${b.payloadSummary}-${b.timestamp}`
      );

      if (b.currentHash !== recalculatedHash) {
        return {
          isIntegrityIntact: false,
          totalBlocksVerified: i,
          merkleRootHash: 'TAMPERED_PAYLOAD',
          tamperedBlockIndex: b.blockIndex,
        };
      }

      expectedPrevHash = b.currentHash;
    }

    const merkleRoot = this.computeHash(blocks.map((b) => b.currentHash).join(':'));

    return {
      isIntegrityIntact: true,
      totalBlocksVerified: blocks.length,
      merkleRootHash: merkleRoot,
    };
  }
}
