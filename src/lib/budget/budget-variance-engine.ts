import Decimal from 'decimal.js';

export interface DepartmentBudgetGoal {
  id: string;
  departmentName: string; // e.g. "Engineering & Cloud", "Commercial Operations", "Sales & Marketing", "General & Admin"
  accountCode: string;
  accountName: string;
  annualBudget: number;
  monthlyBudget: number;
  actualSpentYtd: number;
  varianceAmount: number; // Budget - Actual (Positive = Under Budget, Negative = Over Budget)
  variancePercentage: number;
  status: 'ON_TRACK' | 'WARNING_90' | 'OVER_BUDGET';
  responsibleLeader: string;
}

export class BudgetVarianceEngine {
  public static INITIAL_BUDGETS: DepartmentBudgetGoal[] = [
    {
      id: 'bdg-001',
      departmentName: 'Direct Operations & Labor',
      accountCode: '5010',
      accountName: 'Direct Labor Salaries (W-2 Wages)',
      annualBudget: 360000.0,
      monthlyBudget: 30000.0,
      actualSpentYtd: 184000.0,
      varianceAmount: 176000.0,
      variancePercentage: -4.2,
      status: 'ON_TRACK',
      responsibleLeader: 'Sarah Jenkins (VP Operations)',
    },
    {
      id: 'bdg-002',
      departmentName: 'Subcontractors & Contractors',
      accountCode: '5020',
      accountName: '1099 Independent Contractor Fees',
      annualBudget: 120000.0,
      monthlyBudget: 10000.0,
      actualSpentYtd: 68500.0,
      varianceAmount: 51500.0,
      variancePercentage: 14.1,
      status: 'WARNING_90',
      responsibleLeader: 'Marcus Sterling (Field Lead)',
    },
    {
      id: 'bdg-003',
      departmentName: 'Engineering & Cloud SaaS',
      accountCode: '6010',
      accountName: 'Cloud Infrastructure & SaaS Software',
      annualBudget: 48000.0,
      monthlyBudget: 4000.0,
      actualSpentYtd: 24200.0,
      varianceAmount: 23800.0,
      variancePercentage: 0.8,
      status: 'ON_TRACK',
      responsibleLeader: 'Lucas Vance (Principal Architect)',
    },
    {
      id: 'bdg-004',
      departmentName: 'Facilities & Office Rent',
      accountCode: '6020',
      accountName: 'Facility Lease & Office Rent',
      annualBudget: 36000.0,
      monthlyBudget: 3000.0,
      actualSpentYtd: 18000.0,
      varianceAmount: 18000.0,
      variancePercentage: 0.0,
      status: 'ON_TRACK',
      responsibleLeader: 'Victoria Sterling (CFO)',
    },
  ];

  /**
   * Calculates variance for a budget goal
   */
  public static calculateVariance(budget: number, actual: number): {
    varianceAmount: number;
    variancePercentage: number;
    status: 'ON_TRACK' | 'WARNING_90' | 'OVER_BUDGET';
  } {
    const bDec = new Decimal(budget);
    const aDec = new Decimal(actual);
    const diff = bDec.minus(aDec);
    const pct = bDec.greaterThan(0) ? aDec.dividedBy(bDec).times(100).toNumber() : 0;

    let status: 'ON_TRACK' | 'WARNING_90' | 'OVER_BUDGET' = 'ON_TRACK';
    if (pct > 100) {
      status = 'OVER_BUDGET';
    } else if (pct >= 90) {
      status = 'WARNING_90';
    }

    return {
      varianceAmount: diff.toNumber(),
      variancePercentage: parseFloat((pct - 100).toFixed(1)),
      status,
    };
  }

  /**
   * Creates a new departmental budget goal
   */
  public static createBudgetGoal(
    departmentName: string,
    accountCode: string,
    accountName: string,
    annualBudget: number,
    responsibleLeader: string
  ): DepartmentBudgetGoal {
    const monthly = annualBudget / 12;
    const actual = 0;
    const { varianceAmount, variancePercentage, status } = this.calculateVariance(annualBudget, actual);

    return {
      id: `bdg-${Math.floor(100 + Math.random() * 900)}`,
      departmentName,
      accountCode,
      accountName,
      annualBudget,
      monthlyBudget: monthly,
      actualSpentYtd: actual,
      varianceAmount,
      variancePercentage,
      status,
      responsibleLeader,
    };
  }
}
