import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from '../accounting/types';

export type WorkerType = 'W2_EMPLOYEE' | '1099_CONTRACTOR';
export type FilingStatus = 'SINGLE' | 'MARRIED_FILING_JOINTLY' | 'HEAD_OF_HOUSEHOLD';

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  type: WorkerType;
  ssnEin: string;
  state: string; // 2-letter US State code: 'CA', 'NY', 'TX', 'FL', 'DE', etc.
  filingStatus: FilingStatus;
  hourlyRate?: number;
  salaryAnnual?: number;
  preTaxDeductions?: number; // 401k, health insurance
  is1099: boolean;
}

export interface PaycheckCalculation {
  workerId: string;
  workerName: string;
  workerType: WorkerType;
  state: string;
  grossPay: number;
  preTaxDeductions: number;
  taxableWages: number;
  
  // Employee Withholdings (deducted from gross)
  employeeFederalIncomeTax: number;
  employeeSocialSecurity: number; // 6.2%
  employeeMedicare: number; // 1.45%
  employeeStateIncomeTax: number; // SIT
  totalEmployeeWithholdings: number;
  netPay: number; // Gross - Employee Withholdings - PreTax

  // Employer Taxes (Company expense)
  employerSocialSecurity: number; // 6.2%
  employerMedicare: number; // 1.45%
  employerFUTA: number; // 0.6%
  employerSUTA: number; // State Unemployment (e.g. 2.7% DE/CA)
  totalEmployerTaxes: number;
  totalCompanyCost: number; // Gross + Employer Taxes
}

export interface PayrollRunSummary {
  id: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentDate: string;
  paychecks: PaycheckCalculation[];
  totalGrossPay: number;
  totalNetPay: number;
  totalEmployeeWithholdings: number;
  totalEmployerTaxes: number;
  totalCashRequirement: number;
}

export class MultiStatePayrollEngine {
  // Statutory Tax Rates
  private static FICA_SS_RATE = new Decimal('0.062'); // 6.2%
  private static FICA_MED_RATE = new Decimal('0.0145'); // 1.45%
  private static FUTA_RATE = new Decimal('0.006'); // 0.6% effective rate
  private static SOCIAL_SECURITY_WAGE_CAP = 168600; // Annual cap

  /**
   * Approximate State Income Tax (SIT) rates by State for Service Businesses
   */
  public static getStateTaxRate(state: string, taxableGross: number): Decimal {
    const s = state.toUpperCase();
    // 0% State Income Tax States
    if (['TX', 'FL', 'WA', 'NV', 'WY', 'SD', 'TN', 'AK'].includes(s)) {
      return new Decimal(0);
    }
    // Flat or Graduated Estimates
    if (s === 'CA') {
      return taxableGross > 8000 ? new Decimal('0.066') : new Decimal('0.04');
    }
    if (s === 'NY') {
      return taxableGross > 8000 ? new Decimal('0.062') : new Decimal('0.045');
    }
    if (s === 'DE') {
      return new Decimal('0.052'); // Delaware flat estimate
    }
    return new Decimal('0.045'); // Default state standard
  }

  /**
   * SUTA (State Unemployment) Employer Rate by State
   */
  public static getStateSutaRate(state: string): Decimal {
    const s = state.toUpperCase();
    if (s === 'CA') return new Decimal('0.034');
    if (s === 'NY') return new Decimal('0.041');
    if (s === 'TX') return new Decimal('0.027');
    if (s === 'FL') return new Decimal('0.027');
    if (s === 'DE') return new Decimal('0.026');
    return new Decimal('0.027');
  }

  /**
   * Calculate a single paycheck for a W-2 employee or 1099 contractor
   */
  public static calculatePaycheck(
    worker: WorkerProfile,
    grossEarnings: number,
    ytdEarningsPrior: number = 0
  ): PaycheckCalculation {
    const grossDec = new Decimal(grossEarnings);
    const preTaxDec = new Decimal(worker.preTaxDeductions || 0);
    const taxableWagesDec = Decimal.max(0, grossDec.minus(preTaxDec));

    // 1099 Contractors do not have tax withholdings at source
    if (worker.type === '1099_CONTRACTOR') {
      return {
        workerId: worker.id,
        workerName: worker.name,
        workerType: '1099_CONTRACTOR',
        state: worker.state,
        grossPay: grossDec.toNumber(),
        preTaxDeductions: 0,
        taxableWages: grossDec.toNumber(),
        employeeFederalIncomeTax: 0,
        employeeSocialSecurity: 0,
        employeeMedicare: 0,
        employeeStateIncomeTax: 0,
        totalEmployeeWithholdings: 0,
        netPay: grossDec.toNumber(),
        employerSocialSecurity: 0,
        employerMedicare: 0,
        employerFUTA: 0,
        employerSUTA: 0,
        totalEmployerTaxes: 0,
        totalCompanyCost: grossDec.toNumber(),
      };
    }

    // W-2 Employee Calculation
    // Social Security (Check annual cap)
    const ssSubjectWages = Math.max(0, Math.min(grossDec.toNumber(), this.SOCIAL_SECURITY_WAGE_CAP - ytdEarningsPrior));
    const ssEmployeeDec = new Decimal(ssSubjectWages).times(this.FICA_SS_RATE);
    const ssEmployerDec = new Decimal(ssSubjectWages).times(this.FICA_SS_RATE);

    // Medicare (No wage cap)
    const medEmployeeDec = grossDec.times(this.FICA_MED_RATE);
    const medEmployerDec = grossDec.times(this.FICA_MED_RATE);

    // Federal Income Tax (Simplified bracket estimate based on filing status)
    let fitRate = new Decimal('0.12');
    if (worker.filingStatus === 'SINGLE') {
      fitRate = taxableWagesDec.greaterThan(8000) ? new Decimal('0.22') : new Decimal('0.12');
    } else if (worker.filingStatus === 'MARRIED_FILING_JOINTLY') {
      fitRate = taxableWagesDec.greaterThan(12000) ? new Decimal('0.22') : new Decimal('0.10');
    }
    const fitDec = taxableWagesDec.times(fitRate);

    // State Income Tax (SIT)
    const sitRate = this.getStateTaxRate(worker.state, taxableWagesDec.toNumber());
    const sitDec = taxableWagesDec.times(sitRate);

    // Total Employee Withholdings
    const totalWithholdingsDec = fitDec.plus(ssEmployeeDec).plus(medEmployeeDec).plus(sitDec);
    const netPayDec = grossDec.minus(preTaxDec).minus(totalWithholdingsDec);

    // Employer Unemployment Taxes (FUTA & SUTA)
    const futaDec = grossDec.times(this.FUTA_RATE);
    const sutaDec = grossDec.times(this.getStateSutaRate(worker.state));
    const totalEmployerTaxesDec = ssEmployerDec.plus(medEmployerDec).plus(futaDec).plus(sutaDec);
    const totalCostDec = grossDec.plus(totalEmployerTaxesDec);

    return {
      workerId: worker.id,
      workerName: worker.name,
      workerType: 'W2_EMPLOYEE',
      state: worker.state,
      grossPay: parseFloat(grossDec.toFixed(2)),
      preTaxDeductions: parseFloat(preTaxDec.toFixed(2)),
      taxableWages: parseFloat(taxableWagesDec.toFixed(2)),
      employeeFederalIncomeTax: parseFloat(fitDec.toFixed(2)),
      employeeSocialSecurity: parseFloat(ssEmployeeDec.toFixed(2)),
      employeeMedicare: parseFloat(medEmployeeDec.toFixed(2)),
      employeeStateIncomeTax: parseFloat(sitDec.toFixed(2)),
      totalEmployeeWithholdings: parseFloat(totalWithholdingsDec.toFixed(2)),
      netPay: parseFloat(netPayDec.toFixed(2)),
      employerSocialSecurity: parseFloat(ssEmployerDec.toFixed(2)),
      employerMedicare: parseFloat(medEmployerDec.toFixed(2)),
      employerFUTA: parseFloat(futaDec.toFixed(2)),
      employerSUTA: parseFloat(sutaDec.toFixed(2)),
      totalEmployerTaxes: parseFloat(totalEmployerTaxesDec.toFixed(2)),
      totalCompanyCost: parseFloat(totalCostDec.toFixed(2)),
    };
  }

  /**
   * Generates a fully balanced US GAAP Journal Entry for a Payroll Run
   * Debit: 6010 / 5010 Salaries & Direct Labor ($TotalGross)
   * Debit: 6020 Employer Payroll Taxes ($TotalEmployerTaxes)
   * Credit: 2210 Federal Payroll Taxes Payable (FIT + Employee & Employer FICA + FUTA)
   * Credit: 2220 State Payroll Taxes Payable (SIT + SUTA)
   * Credit: 1020 Payroll Checking Account ($TotalNetPay)
   */
  public static generatePayrollJournalEntry(
    organizationId: string,
    summary: PayrollRunSummary
  ): CreateJournalEntryInput {
    let totalGrossW2 = new Decimal(0);
    let total1099Fees = new Decimal(0);
    let totalFIT = new Decimal(0);
    let totalFICA_FIT = new Decimal(0); // FIT + SS (ee+er) + Med (ee+er) + FUTA
    let totalStateTaxes = new Decimal(0); // SIT + SUTA
    let totalEmployerTaxExpense = new Decimal(0);
    let totalNetDisbursement = new Decimal(0);

    for (const p of summary.paychecks) {
      if (p.workerType === '1099_CONTRACTOR') {
        total1099Fees = total1099Fees.plus(new Decimal(p.grossPay));
        totalNetDisbursement = totalNetDisbursement.plus(new Decimal(p.netPay));
      } else {
        totalGrossW2 = totalGrossW2.plus(new Decimal(p.grossPay));
        totalEmployerTaxExpense = totalEmployerTaxExpense.plus(new Decimal(p.totalEmployerTaxes));
        totalNetDisbursement = totalNetDisbursement.plus(new Decimal(p.netPay));

        // Federal pool: FIT + Employee SS + Employee Med + Employer SS + Employer Med + Employer FUTA
        const fedTaxes = new Decimal(p.employeeFederalIncomeTax)
          .plus(new Decimal(p.employeeSocialSecurity))
          .plus(new Decimal(p.employeeMedicare))
          .plus(new Decimal(p.employerSocialSecurity))
          .plus(new Decimal(p.employerMedicare))
          .plus(new Decimal(p.employerFUTA));
        totalFICA_FIT = totalFICA_FIT.plus(fedTaxes);

        // State pool: SIT + SUTA
        const stTaxes = new Decimal(p.employeeStateIncomeTax).plus(new Decimal(p.employerSUTA));
        totalStateTaxes = totalStateTaxes.plus(stTaxes);
      }
    }

    const lines = [];

    // DR 6010 Wages
    if (totalGrossW2.greaterThan(0)) {
      lines.push({
        accountId: '6010',
        debit: totalGrossW2.toNumber(),
        credit: 0,
        description: `W-2 Gross Wages (Period ${summary.payPeriodStart} to ${summary.payPeriodEnd})`,
      });
    }

    // DR 5020 Contractor 1099 Fees
    if (total1099Fees.greaterThan(0)) {
      lines.push({
        accountId: '5020',
        debit: total1099Fees.toNumber(),
        credit: 0,
        description: `1099 Independent Contractor Disbursements`,
      });
    }

    // DR 6020 Employer Payroll Taxes
    if (totalEmployerTaxExpense.greaterThan(0)) {
      lines.push({
        accountId: '6020',
        debit: totalEmployerTaxExpense.toNumber(),
        credit: 0,
        description: `Employer FICA, FUTA, and SUTA Taxes`,
      });
    }

    // CR 2210 Federal Taxes Payable
    if (totalFICA_FIT.greaterThan(0)) {
      lines.push({
        accountId: '2210',
        debit: 0,
        credit: totalFICA_FIT.toNumber(),
        description: `Federal Withholdings & Employer FICA/FUTA Liability (Form 941/940)`,
      });
    }

    // CR 2220 State Taxes Payable
    if (totalStateTaxes.greaterThan(0)) {
      lines.push({
        accountId: '2220',
        debit: 0,
        credit: totalStateTaxes.toNumber(),
        description: `State SIT & SUTA Taxes Payable`,
      });
    }

    // CR 1020 Payroll Checking Account
    lines.push({
      accountId: '1020',
      debit: 0,
      credit: totalNetDisbursement.toNumber(),
      description: `Net Direct Deposits & ACH Payroll Disbursements`,
    });

    return {
      organizationId,
      date: new Date(summary.paymentDate),
      memo: `Payroll Run (${summary.paychecks.length} payees) - ${summary.payPeriodEnd}`,
      basis: 'BOTH',
      sourceType: 'PAYROLL',
      sourceId: summary.id,
      lines,
    };
  }
}
