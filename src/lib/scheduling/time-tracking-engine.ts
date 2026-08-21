import Decimal from 'decimal.js';

export interface TimeEntryDTO {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  workerId: string;
  workerName: string;
  date: string;
  hours: number;
  hourlyRate: number;
  isBillable: boolean;
  description: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'INVOICED' | 'AMORTIZED_FROM_RETAINER';
}

export interface ClientRetainerAccount {
  clientId: string;
  clientName: string;
  totalRetainerDeposited: number;
  unearnedBalanceRemaining: number;
  totalAmortizedToDate: number;
  monthlyAllocationAmount: number;
  effectiveHourlyRate: number;
}

export class TimeTrackingEngine {
  /**
   * Calculates billable amount from time entries
   */
  public static calculateBillableTotal(entries: TimeEntryDTO[]): {
    totalHours: number;
    billableHours: number;
    nonBillableHours: number;
    totalAmount: number;
    utilizationRate: number;
  } {
    let totalH = new Decimal(0);
    let billableH = new Decimal(0);
    let totalAmt = new Decimal(0);

    for (const e of entries) {
      const h = new Decimal(e.hours);
      totalH = totalH.plus(h);
      if (e.isBillable) {
        billableH = billableH.plus(h);
        totalAmt = totalAmt.plus(h.times(new Decimal(e.hourlyRate)));
      }
    }

    const nonBillableH = totalH.minus(billableH);
    const utilizationRate = totalH.greaterThan(0)
      ? billableH.dividedBy(totalH).times(100).toNumber()
      : 0;

    return {
      totalHours: totalH.toNumber(),
      billableHours: billableH.toNumber(),
      nonBillableHours: nonBillableH.toNumber(),
      totalAmount: totalAmt.toNumber(),
      utilizationRate: parseFloat(utilizationRate.toFixed(1)),
    };
  }
}
