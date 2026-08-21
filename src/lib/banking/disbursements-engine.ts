import Decimal from 'decimal.js';

export interface DisbursementRequest {
  id: string;
  payeeName: string;
  payeeRoutingNumber: string;
  payeeAccountNumber: string;
  amount: number;
  paymentType: 'ACH_CCD' | 'ACH_PPD' | 'DOMESTIC_WIRE';
  memo: string;
  createdByMakerId: string;
  createdByMakerName: string;
  createdAt: string;
  approvedByCheckerId?: string;
  approvedByCheckerName?: string;
  approvedAt?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'RELEASED' | 'REJECTED';
}

export interface VirtualCard {
  id: string;
  cardholderName: string;
  last4: string;
  monthlySpendLimit: number;
  currentSpendMonth: number;
  status: 'ACTIVE' | 'FROZEN' | 'TERMINATED';
  purpose: string;
}

export class DisbursementsEngine {
  /**
   * Generates official NACHA formatted text for batch ACH payments
   */
  public static generateNachaFile(
    disbursements: DisbursementRequest[],
    companyEin: string = '123456789',
    companyName: string = 'APEX CLOUD'
  ): string {
    const header = `101 021000021 1${companyEin.padEnd(9, ' ')}2608200000A094101BANK OF AMERICA        ${companyName.padEnd(16, ' ')}00000001`;
    const batchHeader = `5200${companyName.padEnd(16, ' ')}                  ${companyEin}CCDSERVICES   260820260820   1021000020000001`;

    let totalAmountCents = 0;
    const detailRecords = disbursements.map((d, idx) => {
      const cents = Math.round(d.amount * 100);
      totalAmountCents += cents;
      const traceNum = `02100002${(idx + 1).toString().padStart(7, '0')}`;
      return `622${d.payeeRoutingNumber.substring(0, 8)}${d.payeeRoutingNumber.substring(8, 9)}${d.payeeAccountNumber.padEnd(17, ' ')}${cents.toString().padStart(10, '0')}${d.id.padEnd(15, ' ')}${d.payeeName.padEnd(22, ' ')}  0${traceNum}`;
    });

    const batchControl = `8200${disbursements.length.toString().padStart(6, '0')}000000000000${totalAmountCents.toString().padStart(12, '0')}${companyEin}                         021000020000001`;
    const fileControl = `9000001000001${disbursements.length.toString().padStart(6, '0')}000000000000${totalAmountCents.toString().padStart(12, '0')}                                       `;

    return [header, batchHeader, ...detailRecords, batchControl, fileControl].join('\n');
  }

  /**
   * Validates Maker-Checker dual authorization security rule
   * A transaction CANNOT be approved by the same user who created it (Fraud Prevention)
   */
  public static approveDisbursement(
    disbursement: DisbursementRequest,
    checkerId: string,
    checkerName: string
  ): { success: boolean; error?: string; updatedDisbursement?: DisbursementRequest } {
    if (disbursement.createdByMakerId === checkerId) {
      return {
        success: false,
        error: 'Dual Authorization Violation: Approver (Checker) cannot be the same person as the Initiator (Maker).',
      };
    }

    if (disbursement.status !== 'PENDING_APPROVAL') {
      return {
        success: false,
        error: `Cannot approve disbursement in status: ${disbursement.status}`,
      };
    }

    const updated: DisbursementRequest = {
      ...disbursement,
      approvedByCheckerId: checkerId,
      approvedByCheckerName: checkerName,
      approvedAt: new Date().toISOString(),
      status: 'APPROVED',
    };

    return {
      success: true,
      updatedDisbursement: updated,
    };
  }
}
