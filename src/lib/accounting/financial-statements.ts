import Decimal from 'decimal.js';
import {
  AccountCategory,
  IncomeStatementReport,
  BalanceSheetReport,
  CashFlowStatementReport,
  StatementOfEquityReport,
  FinancialNotesReport,
} from './types';

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
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL',
    selectedMonths?: number[],
    fiscalYear?: number
  ): IncomeStatementReport {
    let totalRevenue = new Decimal(0);
    const revenues: { code: string; name: string; amount: number }[] = [];

    let totalCostOfServices = new Decimal(0);
    const costOfServices: { code: string; name: string; amount: number }[] = [];

    let totalOperatingExpenses = new Decimal(0);
    const operatingExpenses: { code: string; name: string; amount: number }[] = [];

    for (const acc of accounts) {
      const filteredLines = this.filterLinesByBasis(acc.lines, basis).filter(line => {
        const lineDateStr = typeof line.date === 'string' ? line.date : line.date.toISOString().split('T')[0];
        const lineYear = parseInt(lineDateStr.substring(0, 4), 10);
        const lineMonth = parseInt(lineDateStr.substring(5, 7), 10);

        if (fiscalYear && lineYear !== fiscalYear) return false;
        if (selectedMonths && selectedMonths.length > 0 && !selectedMonths.includes(lineMonth)) return false;
        if (!fiscalYear && (lineDateStr < startDate || lineDateStr > endDate)) return false;

        return true;
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
      } else if (acc.type === 'COST_OF_SERVICE' || acc.subType?.startsWith('COST_OF_SERVICE')) {
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
        const lineDateStr = typeof line.date === 'string' ? line.date : line.date.toISOString().split('T')[0];
        return lineDateStr <= asOfDate;
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
        const isDrawAccount =
          acc.subType === 'OWNERS_DRAW' ||
          acc.name.toLowerCase().includes('draw') ||
          acc.name.toLowerCase().includes('distribution') ||
          acc.name.toLowerCase().includes('retirada');

        if (isDrawAccount) {
          netEq = netDebit.minus(netCredit).negated(); // Draws reduce equity
        } else {
          netEq = netCredit.minus(netDebit);
        }
        equityItems.push({ code: acc.code, name: acc.name, amount: netEq.toNumber() });
        totalEquity = totalEquity.plus(netEq);
      }
    }

    // Calculate cumulative net income from inception up to asOfDate across all revenue and expense accounts
    let cumulativeNetIncome = new Decimal(0);
    for (const acc of accounts) {
      const filteredLines = this.filterLinesByBasis(acc.lines, basis).filter(line => {
        const lineDateStr = typeof line.date === 'string' ? line.date : line.date.toISOString().split('T')[0];
        return lineDateStr <= asOfDate;
      });

      if (filteredLines.length === 0) continue;

      let netCredit = new Decimal(0);
      let netDebit = new Decimal(0);
      for (const line of filteredLines) {
        netDebit = netDebit.plus(new Decimal(line.debit.toString()));
        netCredit = netCredit.plus(new Decimal(line.credit.toString()));
      }

      if (acc.type === 'REVENUE') {
        cumulativeNetIncome = cumulativeNetIncome.plus(netCredit.minus(netDebit));
      } else if (
        acc.type === 'COST_OF_SERVICE' ||
        acc.type === 'EXPENSE' ||
        acc.subType?.startsWith('COST_OF_SERVICE')
      ) {
        cumulativeNetIncome = cumulativeNetIncome.minus(netDebit.minus(netCredit));
      }
    }

    // Add cumulative net income to retained earnings in equity section
    totalEquity = totalEquity.plus(cumulativeNetIncome);

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
      retainedEarnings: cumulativeNetIncome.toNumber(),
      totalEquity: totalEquity.toNumber(),
      totalLiabilitiesAndEquity: totalLiabilitiesAndEquity.toNumber(),
      isBalanced,
    };
  }

  /**
   * Generates a US GAAP Statement of Cash Flows (ASC 230).
   * Operating, Investing, and Financing Activities.
   */
  public static generateStatementOfCashFlows(
    accounts: AccountWithLines[],
    fiscalYear: number,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL'
  ): CashFlowStatementReport {
    // 1. Calculate Net Income for the fiscal year
    const incomeStatement = this.generateIncomeStatement(
      accounts,
      `${fiscalYear}-01-01`,
      `${fiscalYear}-12-31`,
      basis,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      fiscalYear
    );

    // 2. Identify Cash Flow adjustments from accounts
    let deprAddBack = 0;
    let changeInAr = 0;
    let changeInAp = 0;
    let changeInSalesTax = 0;
    let fleetAndEquipPurchase = 0;
    let capitalContributed = 0;
    let partnerDraws = 0;

    let beginningCash = 0;
    let endingCash = 0;

    for (const acc of accounts) {
      for (const line of acc.lines) {
        const lineDateStr = typeof line.date === 'string' ? line.date : line.date.toISOString().split('T')[0];
        const lineYear = parseInt(lineDateStr.substring(0, 4), 10);
        const deb = Number(line.debit) || 0;
        const cred = Number(line.credit) || 0;

        // Cash account (1010)
        if (acc.code === '1010' || acc.subType === 'CASH_AND_CASH_EQUIVALENTS') {
          if (lineYear < fiscalYear) {
            beginningCash += deb - cred;
          }
          if (lineYear <= fiscalYear) {
            endingCash += deb - cred;
          }
        }

        // Only consider current fiscal year lines for flow adjustments
        if (lineYear === fiscalYear) {
          if (acc.code === '1590' || acc.code === '6060' || acc.subType.includes('DEPRECIATION')) {
            if (deb > 0) deprAddBack += deb;
          } else if (acc.code === '1200' || acc.subType === 'ACCOUNTS_RECEIVABLE') {
            changeInAr += (deb - cred); // Increase in AR is a cash drain (negative)
          } else if (acc.code === '2010' || acc.subType === 'ACCOUNTS_PAYABLE') {
            changeInAp += (cred - deb); // Increase in AP is cash saved (positive)
          } else if (acc.code === '2210' || acc.subType === 'SALES_TAX_PAYABLE') {
            changeInSalesTax += (cred - deb);
          } else if (acc.code === '1510' || acc.subType === 'PROPERTY_PLANT_EQUIPMENT') {
            fleetAndEquipPurchase += deb;
          } else if (acc.code === '3010' || acc.subType === 'COMMON_STOCK') {
            capitalContributed += cred;
          } else if (acc.code === '3030' || acc.subType === 'OWNERS_DRAW') {
            partnerDraws += deb;
          }
        }
      }
    }

    // Operating Cash Flow
    const netCashOperating =
      incomeStatement.netIncome +
      deprAddBack -
      changeInAr +
      changeInAp +
      changeInSalesTax;

    // Investing Cash Flow
    const netCashInvesting = -fleetAndEquipPurchase;

    // Financing Cash Flow
    const netCashFinancing = capitalContributed - partnerDraws;

    const netChangeInCash = netCashOperating + netCashInvesting + netCashFinancing;
    const isReconciled = Math.abs(beginningCash + netChangeInCash - endingCash) < 0.05;

    return {
      fiscalYear,
      basis,
      operatingActivities: {
        netIncome: parseFloat(incomeStatement.netIncome.toFixed(2)),
        depreciationAddBack: parseFloat(deprAddBack.toFixed(2)),
        changeInAccountsReceivable: parseFloat((-changeInAr).toFixed(2)),
        changeInAccountsPayable: parseFloat(changeInAp.toFixed(2)),
        changeInSalesTaxPayable: parseFloat(changeInSalesTax.toFixed(2)),
        netCashFromOperating: parseFloat(netCashOperating.toFixed(2)),
      },
      investingActivities: {
        fleetAndEquipmentPurchase: parseFloat((-fleetAndEquipPurchase).toFixed(2)),
        netCashFromInvesting: parseFloat(netCashInvesting.toFixed(2)),
      },
      financingActivities: {
        capitalContributions: parseFloat(capitalContributed.toFixed(2)),
        partnerDrawsAndDistributions: parseFloat((-partnerDraws).toFixed(2)),
        netCashFromFinancing: parseFloat(netCashFinancing.toFixed(2)),
      },
      netChangeInCash: parseFloat(netChangeInCash.toFixed(2)),
      beginningCashBalance: parseFloat(beginningCash.toFixed(2)),
      endingCashBalance: parseFloat(endingCash.toFixed(2)),
      isReconciled,
    };
  }

  /**
   * Generates Statement of Changes in Members' Equity & Schedule M-2 (US GAAP ASC 505 / IRS Form 1065).
   */
  public static generateStatementOfEquity(
    accounts: AccountWithLines[],
    fiscalYear: number,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL'
  ): StatementOfEquityReport {
    // Beginning balance before this fiscal year
    let beginningCapital = 0;
    let priorContributions = 0;
    let priorNetIncome = 0;
    let priorDraws = 0;

    let capitalContributed = 0;
    let partnerDraws = 0;

    for (const acc of accounts) {
      for (const line of acc.lines) {
        const lineDateStr = typeof line.date === 'string' ? line.date : line.date.toISOString().split('T')[0];
        const lineYear = parseInt(lineDateStr.substring(0, 4), 10);
        const deb = Number(line.debit) || 0;
        const cred = Number(line.credit) || 0;

        if (lineYear < fiscalYear) {
          if (acc.code === '3010' || acc.subType === 'COMMON_STOCK') {
            priorContributions += cred - deb;
          } else if (acc.code === '3030' || acc.subType === 'OWNERS_DRAW') {
            priorDraws += deb - cred;
          } else if (acc.type === 'REVENUE') {
            priorNetIncome += cred - deb;
          } else if (acc.type === 'EXPENSE' || acc.type === 'COST_OF_SERVICE' || acc.subType?.startsWith('COST_OF_SERVICE')) {
            priorNetIncome -= deb - cred;
          }
        } else if (lineYear === fiscalYear) {
          if (acc.code === '3010' || acc.subType === 'COMMON_STOCK') {
            capitalContributed += cred - deb;
          } else if (acc.code === '3030' || acc.subType === 'OWNERS_DRAW') {
            partnerDraws += deb - cred;
          }
        }
      }
    }

    beginningCapital = priorContributions - priorDraws + priorNetIncome;

    const incomeStatement = this.generateIncomeStatement(
      accounts,
      `${fiscalYear}-01-01`,
      `${fiscalYear}-12-31`,
      basis,
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      fiscalYear
    );

    const netIncomeOrLoss = incomeStatement.netIncome;
    const endingBalance = beginningCapital + capitalContributed + netIncomeOrLoss - partnerDraws;

    return {
      fiscalYear,
      basis,
      beginningBalance: parseFloat(beginningCapital.toFixed(2)),
      capitalContributed: parseFloat(capitalContributed.toFixed(2)),
      netIncomeOrLoss: parseFloat(netIncomeOrLoss.toFixed(2)),
      partnerDraws: parseFloat(partnerDraws.toFixed(2)),
      endingBalance: parseFloat(endingBalance.toFixed(2)),
      scheduleM2: {
        line1BeginningCapital: parseFloat(beginningCapital.toFixed(2)),
        line2CapitalContributed: parseFloat(capitalContributed.toFixed(2)),
        line3NetIncome: parseFloat(netIncomeOrLoss.toFixed(2)),
        line4OtherIncreases: 0,
        line5TotalLines1Through4: parseFloat((beginningCapital + capitalContributed + netIncomeOrLoss).toFixed(2)),
        line6Distributions: parseFloat(partnerDraws.toFixed(2)),
        line7OtherDecreases: 0,
        line8TotalLines6And7: parseFloat(partnerDraws.toFixed(2)),
        line9EndingCapital: parseFloat(endingBalance.toFixed(2)),
      },
    };
  }

  /**
   * Generates Official Notes to Financial Statements (US GAAP ASC 235).
   */
  public static generateNotesToFinancialStatements(
    companyName: string,
    fiscalYear: number,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL'
  ): FinancialNotesReport {
    return {
      entityName: companyName,
      fiscalYear,
      basis,
      notes: [
        {
          noteNumber: 1,
          title: 'Organization, Nature of Operations & Summary of Significant Accounting Policies',
          titlePt: 'Organização, Natureza das Operações e Resumo das Políticas Contábeis Significativas',
          usGaapCodification: 'FASB ASC 205 & ASC 235',
          content: `${companyName} is a legal entity organized under the state laws of the United States, providing commercial and residential cleaning, sanitation, and janitorial services. The accompanying financial statements have been prepared in conformity with accounting principles generally accepted in the United States of America (US GAAP) under the ${basis.toLowerCase()} basis of accounting.`,
        },
        {
          noteNumber: 2,
          title: 'Revenue from Contracts with Customers',
          titlePt: 'Reconhecimento de Receita de Contratos com Clientes',
          usGaapCodification: 'FASB ASC 606',
          content: `Revenue is recognized upon the performance and completion of janitorial and cleaning services when the customer receives and consumes the benefits provided. Invoices are generally issued upon completion or on a monthly retainer basis with standard terms of Net 15 to Net 30 days.`,
        },
        {
          noteNumber: 3,
          title: 'Cash and Cash Equivalents & Concentration of Credit Risk',
          titlePt: 'Caixa, Equivalentes de Caixa e Risco de Crédito',
          usGaapCodification: 'FASB ASC 305 & ASC 825',
          content: `Cash consists of demand deposits, commercial checking accounts, and money market instruments maintained with major FDIC-insured commercial financial institutions (Truist Bank and JPMorgan Chase). Accounts are federally insured up to $250,000 per depositor.`,
        },
        {
          noteNumber: 4,
          title: 'Property, Plant and Equipment (Fleet & Machinery)',
          titlePt: 'Imobilizado, Veículos da Frota e Depreciação',
          usGaapCodification: 'FASB ASC 360',
          content: `Commercial cleaning vans, equipment, and extractors are recorded at historical cost less accumulated depreciation. Depreciation is computed using the straight-line method over the estimated useful life of the assets (5 years for service vehicles and machinery).`,
        },
        {
          noteNumber: 5,
          title: 'Income Taxes & Pass-Through Partnership Status',
          titlePt: 'Tributação sobre a Renda e Regime Pass-Through',
          usGaapCodification: 'FASB ASC 740 & IRC § 701',
          content: `The Company is treated as a pass-through entity (Partnership / Form 1065 / Georgia Form 700) for Federal and Georgia State income tax purposes. Consequently, taxable income or loss flows directly to the individual members on Schedule K-1, and no corporate income tax provision is recognized by the entity.`,
        },
        {
          noteNumber: 6,
          title: 'Partners’ Capital Accounts & IRC § 704(b) Allocations',
          titlePt: 'Contas de Capital dos Sócios e Alocações IRC § 704(b)',
          usGaapCodification: 'FASB ASC 505 & IRC § 704(b)',
          content: `Capital contributions, member distributions (draws), and allocation of annual profits/losses are maintained in accordance with the Operating Agreement and Internal Revenue Code Section 704(b). Member distributions are recognized when disbursed.`,
        },
        {
          noteNumber: 7,
          title: 'Subsequent Events Evaluation',
          titlePt: 'Avaliação de Eventos Subsequentes',
          usGaapCodification: 'FASB ASC 855',
          content: `Management has evaluated all subsequent events through the date of these financial statements and concluded that no subsequent events require adjustment to or disclosure in the financial statements.`,
        },
      ],
    };
  }
}

