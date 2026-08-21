export interface WorkerPaystub {
  id: string;
  payPeriod: string;
  payDate: string;
  grossPay: number;
  totalWithholdings: number;
  netPay: number;
  directDepositAccountLast4: string;
}

export interface PtoBalance {
  totalAccruedHours: number;
  usedHours: number;
  availableHours: number;
  pendingRequests: Array<{
    id: string;
    startDate: string;
    endDate: string;
    hours: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
}

export interface WorkerSelfServiceProfile {
  workerId: string;
  name: string;
  email: string;
  workerType: 'W2_EMPLOYEE' | 'CONTRACTOR_1099';
  title: string;
  pto: PtoBalance;
  paystubs: WorkerPaystub[];
}

export class WorkerPortalEngine {
  public static getWorkerProfile(workerId: string): WorkerSelfServiceProfile {
    return {
      workerId,
      name: 'Sarah Jenkins',
      email: 'sarah.j@apexcloud.io',
      workerType: 'W2_EMPLOYEE',
      title: 'Principal Cloud Architect',
      pto: {
        totalAccruedHours: 120,
        usedHours: 40,
        availableHours: 80,
        pendingRequests: [
          {
            id: 'pto-1',
            startDate: '2026-09-01',
            endDate: '2026-09-05',
            hours: 40,
            status: 'APPROVED',
          },
        ],
      },
      paystubs: [
        {
          id: 'ps-2026-08',
          payPeriod: '2026-08-01 to 2026-08-15',
          payDate: '2026-08-15',
          grossPay: 6250.00,
          totalWithholdings: 1475.25,
          netPay: 4774.75,
          directDepositAccountLast4: '4102',
        },
        {
          id: 'ps-2026-07-2',
          payPeriod: '2026-07-16 to 2026-07-31',
          payDate: '2026-07-31',
          grossPay: 6250.00,
          totalWithholdings: 1475.25,
          netPay: 4774.75,
          directDepositAccountLast4: '4102',
        },
      ],
    };
  }

  public static requestPto(
    profile: WorkerSelfServiceProfile,
    startDate: string,
    endDate: string,
    hours: number
  ): { success: boolean; error?: string; updatedProfile?: WorkerSelfServiceProfile } {
    if (hours > profile.pto.availableHours) {
      return {
        success: false,
        error: `Insufficient PTO balance: Requested ${hours}h, but only ${profile.pto.availableHours}h available.`,
      };
    }

    const newReq = {
      id: `pto-${Math.random().toString(36).substring(7)}`,
      startDate,
      endDate,
      hours,
      status: 'PENDING' as const,
    };

    const updated: WorkerSelfServiceProfile = {
      ...profile,
      pto: {
        ...profile.pto,
        pendingRequests: [...profile.pto.pendingRequests, newReq],
      },
    };

    return { success: true, updatedProfile: updated };
  }
}
