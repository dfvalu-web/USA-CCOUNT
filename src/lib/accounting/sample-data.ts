import { AccountWithLines } from './financial-statements';
import { DoubleEntryLedgerEngine } from './ledger-engine';
import { FinancialStatementsEngine } from './financial-statements';

export const SAMPLE_LEDGER_ACCOUNTS: AccountWithLines[] = [
  // Cash & Bank
  {
    code: '1010',
    name: 'Operating Checking Account (Mercury / Chase)',
    type: 'ASSET',
    subType: 'CASH_AND_CASH_EQUIVALENTS',
    lines: [
      { debit: 250000, credit: 0, date: '2026-01-01', basis: 'BOTH' }, // Initial capital
      { debit: 150000, credit: 0, date: '2026-03-15', basis: 'BOTH' }, // Client payments
      { debit: 0, credit: 45000, date: '2026-03-31', basis: 'BOTH' }, // Direct contractor & labor
      { debit: 0, credit: 18500, date: '2026-03-31', basis: 'BOTH' }, // SG&A expenses
    ],
  },
  {
    code: '1030',
    name: 'High-Yield Business Savings / Treasury',
    type: 'ASSET',
    subType: 'CASH_AND_CASH_EQUIVALENTS',
    lines: [
      { debit: 75000, credit: 0, date: '2026-01-15', basis: 'BOTH' },
      { debit: 3700, credit: 0, date: '2026-03-31', basis: 'BOTH' }, // Interest
    ],
  },
  // Accounts Receivable
  {
    code: '1200',
    name: 'Accounts Receivable (A/R)',
    type: 'ASSET',
    subType: 'ACCOUNTS_RECEIVABLE',
    lines: [
      { debit: 210000, credit: 0, date: '2026-02-01', basis: 'ACCRUAL' }, // Invoiced revenue
      { debit: 0, credit: 150000, date: '2026-03-15', basis: 'BOTH' },    // Collected
    ],
  },
  // Fixed Assets
  {
    code: '1510',
    name: 'Computer Equipment & Hardware',
    type: 'ASSET',
    subType: 'PROPERTY_PLANT_EQUIPMENT',
    lines: [
      { debit: 24000, credit: 0, date: '2026-01-05', basis: 'BOTH' },
    ],
  },
  {
    code: '1590',
    name: 'Accumulated Depreciation - Equipment',
    type: 'ASSET',
    subType: 'ACCUMULATED_DEPRECIATION',
    lines: [
      { debit: 0, credit: 2000, date: '2026-03-31', basis: 'BOTH' },
    ],
  },

  // Liabilities
  {
    code: '2010',
    name: 'Accounts Payable (A/P)',
    type: 'LIABILITY',
    subType: 'ACCOUNTS_PAYABLE',
    lines: [
      { debit: 0, credit: 12500, date: '2026-03-20', basis: 'ACCRUAL' },
    ],
  },
  {
    code: '2100',
    name: 'Unearned Revenue / Client Retainers',
    type: 'LIABILITY',
    subType: 'UNEARNED_REVENUE_RETAINERS',
    lines: [
      { debit: 0, credit: 35000, date: '2026-02-15', basis: 'BOTH' },
    ],
  },
  {
    code: '2210',
    name: 'Federal Payroll Taxes Payable (941 / FICA / FIT)',
    type: 'LIABILITY',
    subType: 'PAYROLL_TAXES_PAYABLE',
    lines: [
      { debit: 0, credit: 4200, date: '2026-03-31', basis: 'BOTH' },
    ],
  },

  // Equity
  {
    code: '3010',
    name: "Owner's Equity / Common Stock",
    type: 'EQUITY',
    subType: 'OWNERS_EQUITY',
    lines: [
      { debit: 0, credit: 325000, date: '2026-01-01', basis: 'BOTH' },
    ],
  },
  {
    code: '3020',
    name: "Owner's Draw / Distributions",
    type: 'EQUITY',
    subType: 'OWNERS_DRAW',
    lines: [
      { debit: 20000, credit: 0, date: '2026-03-28', basis: 'BOTH' },
    ],
  },

  // Revenues
  {
    code: '4010',
    name: 'Consulting & Advisory Services Revenue',
    type: 'REVENUE',
    subType: 'SERVICE_REVENUE_HOURLY',
    lines: [
      { debit: 0, credit: 95000, date: '2026-02-15', basis: 'BOTH' },
    ],
  },
  {
    code: '4020',
    name: 'Software Engineering & IT Services Revenue',
    type: 'REVENUE',
    subType: 'SERVICE_REVENUE_FIXED_FEE',
    lines: [
      { debit: 0, credit: 115000, date: '2026-03-10', basis: 'BOTH' },
    ],
  },
  {
    code: '4900',
    name: 'Interest & Treasury Income',
    type: 'REVENUE',
    subType: 'OTHER_INCOME',
    lines: [
      { debit: 0, credit: 3700, date: '2026-03-31', basis: 'BOTH' },
    ],
  },

  // Cost of Services
  {
    code: '5010',
    name: 'Direct Project Labor (Internal Team Billable Hours)',
    type: 'COST_OF_SERVICE',
    subType: 'DIRECT_LABOR_SERVICE',
    lines: [
      { debit: 32000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
    ],
  },
  {
    code: '5020',
    name: 'Subcontractor & 1099 Contractor Fees',
    type: 'COST_OF_SERVICE',
    subType: 'SUBCONTRACTOR_EXPENSE',
    lines: [
      { debit: 13000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
    ],
  },

  // Operating Expenses
  {
    code: '6010',
    name: 'Executive & Admin Salaries',
    type: 'EXPENSE',
    subType: 'PAYROLL_WAGES',
    lines: [
      { debit: 12000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
    ],
  },
  {
    code: '6100',
    name: 'Software, SaaS & Productivity Tools',
    type: 'EXPENSE',
    subType: 'SOFTWARE_AND_SAAS',
    lines: [
      { debit: 3500, credit: 0, date: '2026-03-31', basis: 'BOTH' },
    ],
  },
  {
    code: '6300',
    name: 'Legal, Accounting & CPA Professional Fees',
    type: 'EXPENSE',
    subType: 'PROFESSIONAL_FEES_LEGAL_CPA',
    lines: [
      { debit: 3000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
    ],
  },
];

export function getSampleReports(basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL') {
  const trialBalance = DoubleEntryLedgerEngine.generateTrialBalance(
    SAMPLE_LEDGER_ACCOUNTS.map((acc) => ({
      code: acc.code,
      name: acc.name,
      type: acc.type,
      lines: acc.lines.filter((l) => basis === 'ACCRUAL' || l.basis !== 'ACCRUAL'),
    })),
    basis
  );

  const incomeStatement = FinancialStatementsEngine.generateIncomeStatement(
    SAMPLE_LEDGER_ACCOUNTS,
    '2026-01-01',
    '2026-12-31',
    basis
  );

  const balanceSheet = FinancialStatementsEngine.generateBalanceSheet(
    SAMPLE_LEDGER_ACCOUNTS,
    '2026-12-31',
    basis,
    incomeStatement.netIncome
  );

  return {
    trialBalance,
    incomeStatement,
    balanceSheet,
  };
}
