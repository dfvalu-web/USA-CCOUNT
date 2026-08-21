import Decimal from 'decimal.js';
import { WorkerProfile, PaycheckCalculation } from './payroll-engine';

export interface FormW2Data {
  taxYear: number;
  employerEin: string;
  employerName: string;
  employerAddress: string;
  employeeSsn: string;
  employeeName: string;
  employeeAddress: string;
  box1WagesTips: number;
  box2FederalIncomeTax: number;
  box3SocialSecurityWages: number;
  box4SocialSecurityTax: number;
  box5MedicareWages: number;
  box6MedicareTax: number;
  box15State: string;
  box16StateWages: number;
  box17StateIncomeTax: number;
}

export interface Form1099NECData {
  taxYear: number;
  payerEin: string;
  payerName: string;
  recipientTin: string;
  recipientName: string;
  recipientAddress: string;
  box1NonemployeeCompensation: number;
  box4FederalIncomeTaxWithheld: number;
  box5StateTaxWithheld: number;
  box6State: string;
}

export interface Form941QuarterlySummary {
  quarter: 1 | 2 | 3 | 4;
  taxYear: number;
  numberOfEmployees: number;
  totalWagesPaid: number;
  federalIncomeTaxWithheld: number;
  taxableSocialSecurityWages: number;
  totalSocialSecurityTax: number; // 12.4% (ee + er)
  taxableMedicareWages: number;
  totalMedicareTax: number; // 2.9% (ee + er)
  totalTaxesBeforeAdjustments: number;
  totalDepositsMade: number;
  balanceDueOrOverpayment: number;
}

export class TaxFormsService {
  /**
   * Generates annual Form W-2 for an employee from aggregated paychecks
   */
  public static generateW2(
    worker: WorkerProfile,
    employerInfo: { ein: string; name: string; address: string },
    yearPaychecks: PaycheckCalculation[],
    taxYear: number = 2026
  ): FormW2Data {
    let gross = new Decimal(0);
    let fit = new Decimal(0);
    let ssTax = new Decimal(0);
    let medTax = new Decimal(0);
    let sit = new Decimal(0);

    for (const p of yearPaychecks) {
      gross = gross.plus(new Decimal(p.grossPay));
      fit = fit.plus(new Decimal(p.employeeFederalIncomeTax));
      ssTax = ssTax.plus(new Decimal(p.employeeSocialSecurity));
      medTax = medTax.plus(new Decimal(p.employeeMedicare));
      sit = sit.plus(new Decimal(p.employeeStateIncomeTax));
    }

    return {
      taxYear,
      employerEin: employerInfo.ein,
      employerName: employerInfo.name,
      employerAddress: employerInfo.address,
      employeeSsn: worker.ssnEin,
      employeeName: worker.name,
      employeeAddress: `${worker.state}, USA`,
      box1WagesTips: gross.toNumber(),
      box2FederalIncomeTax: fit.toNumber(),
      box3SocialSecurityWages: gross.toNumber(),
      box4SocialSecurityTax: ssTax.toNumber(),
      box5MedicareWages: gross.toNumber(),
      box6MedicareTax: medTax.toNumber(),
      box15State: worker.state,
      box16StateWages: gross.toNumber(),
      box17StateIncomeTax: sit.toNumber(),
    };
  }

  /**
   * Generates annual Form 1099-NEC for an independent contractor
   */
  public static generate1099NEC(
    contractor: WorkerProfile,
    payerInfo: { ein: string; name: string },
    annualPaymentsTotal: number,
    taxYear: number = 2026
  ): Form1099NECData {
    return {
      taxYear,
      payerEin: payerInfo.ein,
      payerName: payerInfo.name,
      recipientTin: contractor.ssnEin,
      recipientName: contractor.name,
      recipientAddress: `${contractor.state}, USA`,
      box1NonemployeeCompensation: annualPaymentsTotal,
      box4FederalIncomeTaxWithheld: 0,
      box5StateTaxWithheld: 0,
      box6State: contractor.state,
    };
  }

  /**
   * Generates IRS Form 941 Quarterly Report from quarter paychecks
   */
  public static generateForm941(
    quarter: 1 | 2 | 3 | 4,
    taxYear: number,
    quarterPaychecks: PaycheckCalculation[]
  ): Form941QuarterlySummary {
    let totalWages = new Decimal(0);
    let totalFit = new Decimal(0);

    const w2Paychecks = quarterPaychecks.filter((p) => p.workerType === 'W2_EMPLOYEE');

    for (const p of w2Paychecks) {
      totalWages = totalWages.plus(new Decimal(p.grossPay));
      totalFit = totalFit.plus(new Decimal(p.employeeFederalIncomeTax));
    }

    const ssTaxTotal = totalWages.times(new Decimal('0.124')); // 6.2% ee + 6.2% er
    const medTaxTotal = totalWages.times(new Decimal('0.029')); // 1.45% ee + 1.45% er
    const totalTaxes = totalFit.plus(ssTaxTotal).plus(medTaxTotal);

    return {
      quarter,
      taxYear,
      numberOfEmployees: new Set(w2Paychecks.map((p) => p.workerId)).size,
      totalWagesPaid: totalWages.toNumber(),
      federalIncomeTaxWithheld: totalFit.toNumber(),
      taxableSocialSecurityWages: totalWages.toNumber(),
      totalSocialSecurityTax: parseFloat(ssTaxTotal.toFixed(2)),
      taxableMedicareWages: totalWages.toNumber(),
      totalMedicareTax: parseFloat(medTaxTotal.toFixed(2)),
      totalTaxesBeforeAdjustments: parseFloat(totalTaxes.toFixed(2)),
      totalDepositsMade: parseFloat(totalTaxes.toFixed(2)),
      balanceDueOrOverpayment: 0,
    };
  }
}
