import Decimal from 'decimal.js';

export interface W4EmployeeOnboarding {
  workerId: string;
  fullName: string;
  ssn: string;
  address: string;
  filingStatus: 'SINGLE' | 'MARRIED_FILING_JOINTLY' | 'HEAD_OF_HOUSEHOLD';
  multipleJobsStep2: boolean;
  qualifyingChildrenCountStep3: number; // $2,000 each
  otherDependentsCountStep3: number; // $500 each
  extraWithholdingPerPayPeriodStep4c: number;
}

export interface W9ContractorOnboarding {
  contractorId: string;
  businessName: string;
  tinOrEin: string;
  taxClassification: 'INDIVIDUAL_SOLE_PROP' | 'LLC_SINGLE_MEMBER' | 'LLC_PARTNERSHIP' | 'C_CORP' | 'S_CORP';
  isExemptFromBackupWithholding: boolean;
  address: string;
  certifiedSignatureDate: string;
}

export interface ItemizedPaystubBreakdown {
  paystubNumber: string;
  employeeName: string;
  ssnMasked: string;
  payPeriod: string;
  payDate: string;
  grossWages: number;
  preTaxDeductions: {
    section125HealthInsurance: number;
    retirement401k: number;
    totalPreTax: number;
  };
  taxableWages: {
    federalIncomeTaxWages: number;
    socialSecurityWages: number;
    medicareWages: number;
  };
  employeeTaxesWithheld: {
    federalIncomeTax: number;
    socialSecurityTax: number;
    medicareTax: number;
    stateIncomeTax: number;
    totalEmployeeTaxes: number;
  };
  employerTaxesPaid: {
    socialSecurityMatch: number;
    medicareMatch: number;
    futaTax: number;
    sutaTax: number;
    totalEmployerTaxes: number;
  };
  netPay: number;
}

export class OnboardingEngine {
  /**
   * Validates US Social Security Number (SSN) formatting and basic IRS rules
   */
  public static validateSSN(ssn: string): { isValid: boolean; cleaned: string; error?: string } {
    const cleaned = ssn.replace(/[^0-9]/g, '');
    if (cleaned.length !== 9) {
      return { isValid: false, cleaned, error: 'SSN must be exactly 9 digits' };
    }
    // IRS SSN Validation Rules: Area cannot be 000, 666, or 900-999
    const area = parseInt(cleaned.substring(0, 3));
    const group = parseInt(cleaned.substring(3, 5));
    const serial = parseInt(cleaned.substring(5, 9));

    if (area === 0 || area === 666 || area >= 900) {
      return { isValid: false, cleaned, error: 'Invalid SSN Area code (cannot be 000, 666, or 900+)' };
    }
    if (group === 0 || serial === 0) {
      return { isValid: false, cleaned, error: 'Invalid SSN Group or Serial number (cannot be 00 or 0000)' };
    }

    return { isValid: true, cleaned };
  }

  /**
   * Validates Employer Identification Number (EIN)
   */
  public static validateEIN(ein: string): { isValid: boolean; cleaned: string; error?: string } {
    const cleaned = ein.replace(/[^0-9]/g, '');
    if (cleaned.length !== 9) {
      return { isValid: false, cleaned, error: 'EIN must be exactly 9 digits' };
    }
    return { isValid: true, cleaned };
  }

  /**
   * Generates official itemized paystub with pre-tax benefits, 401(k) and multi-state withholdings
   */
  public static generateItemizedPaystub(
    employeeName: string,
    ssn: string,
    grossSalary: number,
    state: string = 'CA',
    healthInsurancePreTax: number = 250,
    retirement401kPercent: number = 5 // 5% 401k
  ): ItemizedPaystubBreakdown {
    const grossDec = new Decimal(grossSalary);
    const healthDec = new Decimal(healthInsurancePreTax);
    const k401Dec = grossDec.times(retirement401kPercent / 100);
    const totalPreTaxDec = healthDec.plus(k401Dec);

    // FIT wages are reduced by Section 125 Health & 401(k)
    const fitWagesDec = grossDec.minus(totalPreTaxDec);
    // FICA (Social Security & Medicare) wages are reduced by Section 125 Health ONLY (not 401k)
    const ficaWagesDec = grossDec.minus(healthDec);

    // Employee FICA
    const ssEeDec = ficaWagesDec.times('0.062');
    const medEeDec = ficaWagesDec.times('0.0145');

    // Approximate FIT (12% effective on taxable)
    const fitDec = fitWagesDec.times('0.12');

    // State SIT (CA ~6%, TX 0%)
    const sitRate = state === 'TX' || state === 'FL' ? 0 : 0.06;
    const sitDec = fitWagesDec.times(sitRate);

    const totalEeTaxesDec = fitDec.plus(ssEeDec).plus(medEeDec).plus(sitDec);
    const netPayDec = grossDec.minus(totalPreTaxDec).minus(totalEeTaxesDec);

    // Employer Matching Taxes
    const ssErDec = ficaWagesDec.times('0.062');
    const medErDec = ficaWagesDec.times('0.0145');
    const futaDec = ficaWagesDec.times('0.006');
    const sutaDec = ficaWagesDec.times('0.025');
    const totalErTaxesDec = ssErDec.plus(medErDec).plus(futaDec).plus(sutaDec);

    const cleanSsn = ssn.replace(/[^0-9]/g, '');
    const maskedSsn = `•••-••-${cleanSsn.slice(-4)}`;

    return {
      paystubNumber: `PS-${Math.floor(100000 + Math.random() * 900000)}`,
      employeeName,
      ssnMasked: maskedSsn,
      payPeriod: '2026-08-01 to 2026-08-15',
      payDate: '2026-08-15',
      grossWages: parseFloat(grossDec.toFixed(2)),
      preTaxDeductions: {
        section125HealthInsurance: parseFloat(healthDec.toFixed(2)),
        retirement401k: parseFloat(k401Dec.toFixed(2)),
        totalPreTax: parseFloat(totalPreTaxDec.toFixed(2)),
      },
      taxableWages: {
        federalIncomeTaxWages: parseFloat(fitWagesDec.toFixed(2)),
        socialSecurityWages: parseFloat(ficaWagesDec.toFixed(2)),
        medicareWages: parseFloat(ficaWagesDec.toFixed(2)),
      },
      employeeTaxesWithheld: {
        federalIncomeTax: parseFloat(fitDec.toFixed(2)),
        socialSecurityTax: parseFloat(ssEeDec.toFixed(2)),
        medicareTax: parseFloat(medEeDec.toFixed(2)),
        stateIncomeTax: parseFloat(sitDec.toFixed(2)),
        totalEmployeeTaxes: parseFloat(totalEeTaxesDec.toFixed(2)),
      },
      employerTaxesPaid: {
        socialSecurityMatch: parseFloat(ssErDec.toFixed(2)),
        medicareMatch: parseFloat(medErDec.toFixed(2)),
        futaTax: parseFloat(futaDec.toFixed(2)),
        sutaTax: parseFloat(sutaDec.toFixed(2)),
        totalEmployerTaxes: parseFloat(totalErTaxesDec.toFixed(2)),
      },
      netPay: parseFloat(netPayDec.toFixed(2)),
    };
  }
}
