import { describe, it, expect } from 'vitest';
import { DisbursementsEngine, DisbursementRequest } from '../src/lib/banking/disbursements-engine';

describe('DisbursementsEngine (Maker-Checker & NACHA ACH Batch)', () => {
  it('should enforce Maker-Checker security rule preventing the initiator from approving their own disbursement', () => {
    const disb: DisbursementRequest = {
      id: 'D-1',
      payeeName: 'Elena Rostova',
      payeeRoutingNumber: '021000021',
      payeeAccountNumber: '123456789',
      amount: 4800,
      paymentType: 'ACH_CCD',
      memo: 'Engineering Services',
      createdByMakerId: 'user-maker-1',
      createdByMakerName: 'Maker User',
      createdAt: '2026-08-20',
      status: 'PENDING_APPROVAL',
    };

    // Attempt self-approval by Maker -> Must fail
    const selfApprove = DisbursementsEngine.approveDisbursement(disb, 'user-maker-1', 'Maker User');
    expect(selfApprove.success).toBe(false);
    expect(selfApprove.error).toContain('Dual Authorization Violation');

    // Approval by independent Checker -> Must succeed
    const validApprove = DisbursementsEngine.approveDisbursement(disb, 'user-cfo-2', 'CFO User');
    expect(validApprove.success).toBe(true);
    expect(validApprove.updatedDisbursement?.status).toBe('APPROVED');
    expect(validApprove.updatedDisbursement?.approvedByCheckerId).toBe('user-cfo-2');
  });

  it('should generate valid NACHA formatted text for batch ACH payments', () => {
    const approvedDisbursements: DisbursementRequest[] = [
      {
        id: 'DISB-881',
        payeeName: 'Elena Rostova',
        payeeRoutingNumber: '021000021',
        payeeAccountNumber: '984102941',
        amount: 4800,
        paymentType: 'ACH_CCD',
        memo: 'Services',
        createdByMakerId: 'm-1',
        createdByMakerName: 'Maker',
        createdAt: '2026-08-20',
        status: 'APPROVED',
      },
    ];

    const nachaText = DisbursementsEngine.generateNachaFile(approvedDisbursements);
    expect(nachaText).toContain('101 021000021');
    expect(nachaText).toContain('APEX CLOUD');
    expect(nachaText).toContain('Elena Rostova');
  });
});
