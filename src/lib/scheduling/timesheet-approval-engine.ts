import Decimal from 'decimal.js';

export interface WeeklyTimesheetDay {
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  date: string;
  hours: number;
}

export interface WeeklyTimesheet {
  id: string;
  workerId: string;
  workerName: string;
  workerTitle: string;
  internalCostRate: number; // e.g. $85/hr
  clientBillingRate: number; // e.g. $250/hr
  projectId: string;
  projectName: string;
  clientName: string;
  weekStartDate: string; // Monday
  weekEndDate: string; // Sunday
  dailyHours: WeeklyTimesheetDay[];
  totalWeeklyHours: number;
  totalLaborCost: number;
  totalClientRevenue: number;
  grossMarginAmount: number;
  grossMarginPercent: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  approvedByManagerName?: string;
  approvedAt?: string;
}

export class TimesheetApprovalEngine {
  /**
   * Calculates profitability metrics for a weekly timesheet
   */
  public static calculateTimesheetMetrics(
    dailyHours: WeeklyTimesheetDay[],
    costRate: number,
    billRate: number
  ): {
    totalHours: number;
    totalCost: number;
    totalRevenue: number;
    marginAmount: number;
    marginPercent: number;
  } {
    const totalHours = dailyHours.reduce((acc, d) => acc + d.hours, 0);
    const totalHoursDec = new Decimal(totalHours);
    const totalCostDec = totalHoursDec.times(new Decimal(costRate));
    const totalRevenueDec = totalHoursDec.times(new Decimal(billRate));
    const marginAmountDec = totalRevenueDec.minus(totalCostDec);
    const marginPercent =
      totalRevenueDec.toNumber() > 0
        ? parseFloat(marginAmountDec.dividedBy(totalRevenueDec).times(100).toFixed(1))
        : 0;

    return {
      totalHours,
      totalCost: parseFloat(totalCostDec.toFixed(2)),
      totalRevenue: parseFloat(totalRevenueDec.toFixed(2)),
      marginAmount: parseFloat(marginAmountDec.toFixed(2)),
      marginPercent,
    };
  }

  /**
   * Formal Manager Approval
   */
  public static approveTimesheet(
    timesheet: WeeklyTimesheet,
    managerName: string = 'Victoria Sterling (Director of Operations)'
  ): WeeklyTimesheet {
    return {
      ...timesheet,
      status: 'APPROVED',
      approvedByManagerName: managerName,
      approvedAt: new Date().toISOString(),
    };
  }
}
