import Decimal from 'decimal.js';

export interface DelawareCorpTaxCalculation {
  authorizedShares: number;
  issuedShares: number;
  totalGrossAssets: number;
  authorizedSharesMethodTax: number;
  assumedParValueMethodTax: number;
  filingFee: number; // $50 flat
  recommendedMethod: 'AUTHORIZED_SHARES' | 'ASSUMED_PAR_VALUE';
  minimalTaxPayable: number;
}

export interface CaliforniaLlcTaxCalculation {
  annualMinimumTax: number; // $800
  californiaTotalIncome: number;
  graduatedLlcFee: number;
  totalCaliforniaTaxDue: number;
  filingForm: string; // "CA Form 568"
}

export interface TexasFranchiseTaxCalculation {
  totalGrossRevenue: number;
  noTaxDueThreshold: number; // $2,470,000
  isNoTaxDueEligible: boolean;
  requiredReport: string; // "Form 05-163 (No Tax Due Information Report)"
}

export class StateFranchiseTaxEngine {
  /**
   * Calculates Delaware Corporate Franchise Tax comparing both statutory methods
   */
  public static calculateDelawareFranchiseTax(
    authorizedShares: number,
    issuedShares: number,
    totalGrossAssets: number,
    isLLC: boolean = false
  ): DelawareCorpTaxCalculation {
    if (isLLC) {
      return {
        authorizedShares: 0,
        issuedShares: 0,
        totalGrossAssets,
        authorizedSharesMethodTax: 300, // Delaware LLC flat annual tax
        assumedParValueMethodTax: 300,
        filingFee: 0,
        recommendedMethod: 'AUTHORIZED_SHARES',
        minimalTaxPayable: 300,
      };
    }

    // 1. Authorized Shares Method
    let authTax = 175;
    if (authorizedShares > 5000 && authorizedShares <= 10000) {
      authTax = 250;
    } else if (authorizedShares > 10000) {
      const extraBlocks = Math.ceil((authorizedShares - 10000) / 10000);
      authTax = 250 + extraBlocks * 85;
    }

    // 2. Assumed Par Value Capital Method
    // Assumed Par Value = Total Gross Assets / Issued Shares
    // Assumed Capital = Assumed Par Value * Authorized Shares = Total Gross Assets * (Authorized / Issued)
    // Rate is $400 per $1,000,000 of Assumed Capital (min $400)
    let assumedTax = 400;
    if (issuedShares > 0 && totalGrossAssets > 0) {
      const assumedCapital = new Decimal(totalGrossAssets).times(new Decimal(authorizedShares)).dividedBy(new Decimal(issuedShares));
      const millionBlocks = Decimal.max(1, assumedCapital.dividedBy(1000000).ceil());
      assumedTax = Math.max(400, millionBlocks.times(400).toNumber());
    }

    const minTax = Math.min(authTax, assumedTax);
    const method = authTax <= assumedTax ? 'AUTHORIZED_SHARES' : 'ASSUMED_PAR_VALUE';

    return {
      authorizedShares,
      issuedShares,
      totalGrossAssets,
      authorizedSharesMethodTax: authTax,
      assumedParValueMethodTax: assumedTax,
      filingFee: 50,
      recommendedMethod: method,
      minimalTaxPayable: minTax + 50, // + $50 filing fee
    };
  }

  /**
   * Calculates California Form 568 & LLC Fee
   */
  public static calculateCaliforniaLlcTax(californiaGrossIncome: number): CaliforniaLlcTaxCalculation {
    let fee = 0;
    if (californiaGrossIncome >= 250000 && californiaGrossIncome < 500000) fee = 900;
    else if (californiaGrossIncome >= 500000 && californiaGrossIncome < 1000000) fee = 2500;
    else if (californiaGrossIncome >= 1000000 && californiaGrossIncome < 5000000) fee = 6000;
    else if (californiaGrossIncome >= 5000000) fee = 11790;

    return {
      annualMinimumTax: 800,
      californiaTotalIncome: californiaGrossIncome,
      graduatedLlcFee: fee,
      totalCaliforniaTaxDue: 800 + fee,
      filingForm: 'CA Form 568 (Limited Liability Company Return of Income)',
    };
  }

  /**
   * Evaluates Texas Franchise Tax No-Tax-Due eligibility
   */
  public static calculateTexasFranchiseTax(totalGrossRevenue: number): TexasFranchiseTaxCalculation {
    const threshold = 2470000;
    return {
      totalGrossRevenue,
      noTaxDueThreshold: threshold,
      isNoTaxDueEligible: totalGrossRevenue < threshold,
      requiredReport: 'Form 05-163 (Texas Franchise Tax No Tax Due Information Report)',
    };
  }
}
