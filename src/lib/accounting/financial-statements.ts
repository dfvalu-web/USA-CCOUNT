import Decimal from 'decimal.js';
import { AccountCategory, IncomeStatementReport, BalanceSheetReport } from './types';

export interface AccountWithLines {
  code: string;
  name: string;
  type: AccountCategory;
  subType: string;
  lines: Array<{
    debit: number | Decimal;
    credit: number | Decimal;
    basis?: 'ACCRUAL' | 'CASH' | 'BOTH';
    date: Date | string;
  }>;
}

export class FinancialStatementsEngine {
  /**
   * Filter lines based on accounting basis (ACCRUAL vs CASH)
   */
  private static filterLinesByBasis(
    lines: AccountWithLines['lines'],
    targetBasis: 'ACCRUAL' | 'CASH'
  ) {
    if (targetBasis === 'ACCRUAL') {
      return lines; // Accrual includes all recognized entries
    }
    // In cash basis, filter out uncollected A/R or unpaid A/P lines unless settled
    return lines.filter(l => l.basis === 'CASH' || l.basis === 'BOTH' || l.basis === undefined);
  }

  /**
   * Generates a US GAAP Income Statement (P&L / Statement of Operations) for Service Businesses.
   */
  public static generateIncomeStatement(
    accounts: AccountWithLines[],
    startDate: string,
    endDate: string,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL'
  ): IncomeStatementReport {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let totalRevenue = new Decimal(0);
    const revenues: { code: string; name: string; amount: number }[] = [];

    let totalCostOfServices = new Decimal(0);
    const costOfServices: { code: string; name: string; amount: number }[] = [];

    let totalOperatingExpenses = new Decimal(0);
    const operatingExpenses: { code: string; name: string; amount: number }[] = [];

    for (const acc of accounts) {
      const filteredLines = this.filterLinesByBasis(acc.lines, basis).filter(line => {
        const lineDate = new Date(line.date);
        return lineDate >= start && lineDate <= end;
      });

      if (filteredLines.length === 0) continue;

      let netAmount = new Decimal(0);

      if (acc.type === 'REVENUE') {
        // Revenue is normal credit balance: Credit - Debit
        for (const line of filteredLines) {
          netAmount = netAmount.plus(new Decimal(line.credit.toString())).minus(new Decimal(line.debit.toString()));
        }
        if (!netAmount.isZero()) {
          revenues.push({ code: acc.code, name: acc.name, amount: netAmount.toNumber() });
          totalRevenue = totalRevenue.plus(netAmount);
        }
      } else if (acc.type === 'COST_OF_SERVICE') {
        // Cost of services is normal debit balance: Debit - Credit
        for (const line of filteredLines) {
          netAmount = netAmount.plus(new Decimal(line.debit.toString())).minus(new Decimal(line.credit.toString()));
        }
        if (!netAmount.isZero()) {
          costOfServices.push({ code: acc.code, name: acc.name, amount: netAmount.toNumber() });
          totalCostOfServices = totalCostOfServices.plus(netAmount);
        }
      } else if (acc.type === 'EXPENSE') {
        // Expense is normal debit balance: Debit - Credit
        for (const line of filteredLines) {
          netAmount = netAmount.plus(new Decimal(line.debit.toString())).minus(new Decimal(line.credit.toString()));
        }
        if (!netAmount.isZero()) {
          operatingExpenses.push({ code: acc.code, name: acc.name, amount: netAmount.toNumber() });
          totalOperatingExpenses = totalOperatingExpenses.plus(netAmount);
        }
      }
    }

    const grossProfit = totalRevenue.minus(totalCostOfServices);
    const grossMarginPercentage = totalRevenue.greaterThan(0)
      ? grossProfit.dividedBy(totalRevenue).times(100).toNumber()
      : 0;

    const operatingIncome = grossProfit.minus(totalOperatingExpenses);
    const netIncome = operatingIncome; // In Phase 1 services, net operating income

    return {
      startDate,
      endDate,
      basis,
      revenues: revenues.sort((a, b) => a.code.localeCompare(b.code)),
      totalRevenue: totalRevenue.toNumber(),
      costOfServices: costOfServices.sort((a, b) => a.code.localeCompare(b.code)),
      totalCostOfServices: totalCostOfServices.toNumber(),
      grossProfit: grossProfit.toNumber(),
      grossMarginPercentage: parseFloat(grossMarginPercentage.toFixed(2)),
      operatingExpenses: operatingExpenses.sort((a, b) => a.code.localeCompare(b.code)),
      totalOperatingExpenses: totalOperatingExpenses.toNumber(),
      operatingIncome: operatingIncome.toNumber(),
      netIncome: netIncome.toNumber(),
    };
  }

  /**
   * Generates a US GAAP Balance Sheet (Statement of Financial Position).
   * Verifies Assets = Liabilities + Equity
   */
  public static generateBalanceSheet(
    accounts: AccountWithLines[],
    asOfDate: string,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL',
    retainedEarningsNetIncome: number = 0
  ): BalanceSheetReport {
    const asOf = new Date(asOfDate);

    const currentAssets: { code: string; name: string; amount: number }[] = [];
    const nonCurrentAssets: { code: string; name: string; amount: number }[] = [];
    let totalAssets = new Decimal(0);

    const currentLiabilities: { code: string; name: string; amount: number }[] = [];
    const nonCurrentLiabilities: { code: string; name: string; amount: number }[] = [];
    let totalLiabilities = new Decimal(0);

    const equityItems: { code: string; name: string; amount: number }[] = [];
    let totalEquity = new Decimal(0);

    for (const acc of accounts) {
      const filteredLines = this.filterLinesByBasis(acc.lines, basis).filter(line => {
        const lineDate = new Date(line.date);
        return lineDate <= asOf;
      });

      if (filteredLines.length === 0) continue;

      let netDebit = new Decimal(0);
      let netCredit = new Decimal(0);

      for (const line of filteredLines) {
        netDebit = netDebit.plus(new Decimal(line.debit.toString()));
        netCredit = netCredit.plus(new Decimal(line.credit.toString()));
      }

      if (acc.type === 'ASSET') {
        const netAsset = netDebit.minus(netCredit);
        if (acc.subType.includes('EQUIPMENT') || acc.subType.includes('DEPRECIATION')) {
          nonCurrentAssets.push({ code: acc.code, name: acc.name, amount: netAsset.toNumber() });
        } else {
          currentAssets.push({ code: acc.code, name: acc.name, amount: netAsset.toNumber() });
        }
        totalAssets = totalAssets.plus(netAsset);
      } else if (acc.type === 'LIABILITY') {
        const netLiab = netCredit.minus(netDebit);
        if (acc.subType.includes('LONG_TERM')) {
          nonCurrentLiabilities.push({ code: acc.code, name: acc.name, amount: netLiab.toNumber() });
        } else {
          currentLiabilities.push({ code: acc.code, name: acc.name, amount: netLiab.toNumber() });
        }
        totalLiabilities = totalLiabilities.plus(netLiab);
      } else if (acc.type === 'EQUITY') {
        let netEq: Decimal;
        if (acc.subType === 'OWNERS_DRAW') {
          netEq = netDebit.minus(netCredit).negated(); // Draws reduce equity
        } else {
          netEq = netCredit.minus(netDebit);
        }
        equityItems.push({ code: acc.code, name: acc.name, amount: netEq.toNumber() });
        totalEquity = totalEquity.plus(netEq);
      }
    }

    // Add cumulative net income to retained earnings in equity section
    const retainedEarningsDec = new Decimal(retainedEarningsNetIncome);
    totalEquity = totalEquity.plus(retainedEarningsDec);

    const totalLiabilitiesAndEquity = totalLiabilities.plus(totalEquity);
    const isBalanced = totalAssets.equals(totalLiabilitiesAndEquity);

    return {
      asOfDate,
      basis,
      currentAssets: currentAssets.sort((a, b) => a.code.localeCompare(b.code)),
      nonCurrentAssets: nonCurrentAssets.sort((a, b) => a.code.localeCompare(b.code)),
      totalAssets: totalAssets.toNumber(),
      currentLiabilities: currentLiabilities.sort((a, b) => a.code.localeCompare(b.code)),
      nonCurrentLiabilities: nonCurrentLiabilities.sort((a, b) => a.code.localeCompare(b.code)),
      totalLiabilities: totalLiabilities.toNumber(),
      equityItems: equityItems.sort((a, b) => a.code.localeCompare(b.code)),
      retainedEarnings: retainedEarningsDec.toNumber(),
      totalEquity: totalEquity.toNumber(),
      totalLiabilitiesAndEquity: totalLiabilitiesAndEquity.toNumber(),
      isBalanced,
    };
  }
}
