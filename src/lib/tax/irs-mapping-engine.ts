import Decimal from 'decimal.js';
import { AccountWithLines, FinancialStatementsEngine } from '../accounting/financial-statements';

export type TaxEntityType = 'LLC_PARTNERSHIP_1065' | 'SCORP_1120S' | 'CCORP_1120' | 'SOLE_PROP_SCHED_C';

export interface IRSTaxLineMapping {
  formNumber: string;
  lineNumber: string;
  lineDescription: string;
  amount: number;
  sourceAccounts: string[]; // Codes e.g. ['4010', '4020']
}

export interface IRSTaxReportSummary {
  formName: string;
  entityType: TaxEntityType;
  taxYear: number;
  grossReceipts: number;
  costOfLaborServices: number;
  grossProfit: number;
  totalDeductions: number;
  ordinaryBusinessIncome: number;
  lines: IRSTaxLineMapping[];
}

export class IRSMappingEngine {
  /**
   * Generates a direct, continuous mapping from the General Ledger to IRS Tax Forms
   */
  public static mapToIRSForm(
    accounts: AccountWithLines[],
    entityType: TaxEntityType,
    taxYear: number = 2026
  ): IRSTaxReportSummary {
    const is = FinancialStatementsEngine.generateIncomeStatement(
      accounts,
      `${taxYear}-01-01`,
      `${taxYear}-12-31`,
      'ACCRUAL'
    );

    let formName = '';
    const lines: IRSTaxLineMapping[] = [];

    if (entityType === 'LLC_PARTNERSHIP_1065') {
      formName = 'Form 1065 (U.S. Return of Partnership Income)';
      lines.push(
        {
          formNumber: '1065',
          lineNumber: 'Line 1a',
          lineDescription: 'Gross receipts or sales',
          amount: is.totalRevenue,
          sourceAccounts: ['4010', '4020', '4030', '4040'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 2',
          lineDescription: 'Returns and allowances',
          amount: 0,
          sourceAccounts: [],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 3',
          lineDescription: 'Gross profit',
          amount: is.grossProfit,
          sourceAccounts: ['Revenues - Cost of Services'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 9',
          lineDescription: 'Salaries and wages (other than to partners)',
          amount: is.operatingExpenses.find((e) => e.code === '6010')?.amount || 0,
          sourceAccounts: ['6010'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 10',
          lineDescription: 'Guaranteed payments to partners',
          amount: 0,
          sourceAccounts: ['3020'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 14',
          lineDescription: 'Taxes and licenses (Payroll & State)',
          amount: is.operatingExpenses.find((e) => e.code === '6020')?.amount || 0,
          sourceAccounts: ['6020'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 20',
          lineDescription: 'Other deductions (Software, Legal, Admin)',
          amount: is.totalOperatingExpenses - (is.operatingExpenses.find((e) => e.code === '6010')?.amount || 0) - (is.operatingExpenses.find((e) => e.code === '6020')?.amount || 0),
          sourceAccounts: ['6100', '6200', '6300', '6400', '6500'],
        },
        {
          formNumber: '1065',
          lineNumber: 'Line 22',
          lineDescription: 'Ordinary business income (loss)',
          amount: is.netIncome,
          sourceAccounts: ['Line 3 - Total Deductions'],
        }
      );
    } else if (entityType === 'SCORP_1120S') {
      formName = 'Form 1120-S (U.S. Income Tax Return for an S Corporation)';
      lines.push(
        {
          formNumber: '1120-S',
          lineNumber: 'Line 1a',
          lineDescription: 'Gross receipts or sales',
          amount: is.totalRevenue,
          sourceAccounts: ['4010', '4020', '4030', '4040'],
        },
        {
          formNumber: '1120-S',
          lineNumber: 'Line 7',
          lineDescription: 'Compensation of officers',
          amount: is.operatingExpenses.find((e) => e.code === '6010')?.amount || 0,
          sourceAccounts: ['6010'],
        },
        {
          formNumber: '1120-S',
          lineNumber: 'Line 12',
          lineDescription: 'Taxes and licenses',
          amount: is.operatingExpenses.find((e) => e.code === '6020')?.amount || 0,
          sourceAccounts: ['6020'],
        },
        {
          formNumber: '1120-S',
          lineNumber: 'Line 19',
          lineDescription: 'Ordinary business income (loss)',
          amount: is.netIncome,
          sourceAccounts: ['Net Operating Income'],
        }
      );
    } else if (entityType === 'CCORP_1120') {
      formName = 'Form 1120 (U.S. Corporation Income Tax Return)';
      const federalTaxEstimate = new Decimal(is.netIncome).times('0.21').toNumber(); // 21% flat corporate tax
      lines.push(
        {
          formNumber: '1120',
          lineNumber: 'Line 1a',
          lineDescription: 'Gross receipts or sales',
          amount: is.totalRevenue,
          sourceAccounts: ['4010', '4020', '4030'],
        },
        {
          formNumber: '1120',
          lineNumber: 'Line 28',
          lineDescription: 'Taxable income before NOL',
          amount: is.netIncome,
          sourceAccounts: ['Operating Income'],
        },
        {
          formNumber: '1120',
          lineNumber: 'Line 31',
          lineDescription: 'Total tax (21% Federal Corporate Rate)',
          amount: Math.max(0, federalTaxEstimate),
          sourceAccounts: ['IRC Sec. 11'],
        }
      );
    } else {
      formName = 'Schedule C / Form 1040 (Profit or Loss From Business)';
      lines.push(
        {
          formNumber: 'Schedule C',
          lineNumber: 'Line 1',
          lineDescription: 'Gross receipts or sales',
          amount: is.totalRevenue,
          sourceAccounts: ['4010', '4020', '4030'],
        },
        {
          formNumber: 'Schedule C',
          lineNumber: 'Line 4',
          lineDescription: 'Cost of goods/services',
          amount: is.totalCostOfServices,
          sourceAccounts: ['5010', '5020', '5030'],
        },
        {
          formNumber: 'Schedule C',
          lineNumber: 'Line 7',
          lineDescription: 'Gross income',
          amount: is.grossProfit,
          sourceAccounts: ['Line 1 - Line 4'],
        },
        {
          formNumber: 'Schedule C',
          lineNumber: 'Line 28',
          lineDescription: 'Total expenses',
          amount: is.totalOperatingExpenses,
          sourceAccounts: ['6000 series'],
        },
        {
          formNumber: 'Schedule C',
          lineNumber: 'Line 31',
          lineDescription: 'Net profit or (loss)',
          amount: is.netIncome,
          sourceAccounts: ['Line 7 - Line 28'],
        }
      );
    }

    return {
      formName,
      entityType,
      taxYear,
      grossReceipts: is.totalRevenue,
      costOfLaborServices: is.totalCostOfServices,
      grossProfit: is.grossProfit,
      totalDeductions: is.totalOperatingExpenses,
      ordinaryBusinessIncome: is.netIncome,
      lines,
    };
  }
}
