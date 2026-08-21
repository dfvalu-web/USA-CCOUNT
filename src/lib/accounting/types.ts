import { z } from 'zod';
import Decimal from 'decimal.js';

export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' | 'COST_OF_SERVICE';

export interface AccountDefinition {
  code: string;
  name: string;
  namePt: string;
  nameEs: string;
  type: AccountCategory;
  subType: string;
  description?: string;
}

export const JournalLineInputSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  debit: z.number().nonnegative().default(0),
  credit: z.number().nonnegative().default(0),
  description: z.string().optional(),
  contactId: z.string().optional(),
}).refine(
  (line) => (line.debit > 0 && line.credit === 0) || (line.credit > 0 && line.debit === 0),
  { message: 'A journal line must have either a positive debit OR a positive credit, never both or neither.' }
);

export type JournalLineInput = z.infer<typeof JournalLineInputSchema>;

export const CreateJournalEntrySchema = z.object({
  organizationId: z.string().uuid(),
  date: z.date().or(z.string().transform((val) => new Date(val))),
  memo: z.string().min(3, 'Memo must be at least 3 characters'),
  basis: z.enum(['ACCRUAL', 'CASH', 'BOTH']).default('ACCRUAL'),
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
  lines: z.array(JournalLineInputSchema).min(2, 'A journal entry must contain at least 2 lines'),
}).refine((entry) => {
  const totalDebit = entry.lines.reduce((acc, l) => acc.plus(new Decimal(l.debit)), new Decimal(0));
  const totalCredit = entry.lines.reduce((acc, l) => acc.plus(new Decimal(l.credit)), new Decimal(0));
  return totalDebit.equals(totalCredit);
}, {
  message: 'Double-entry invariant violated: Total debits must strictly equal total credits (US GAAP requirement).'
});

export type CreateJournalEntryInput = z.infer<typeof CreateJournalEntrySchema>;

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountNamePt?: string;
  accountNameEs?: string;
  type: AccountCategory;
  totalDebit: number;
  totalCredit: number;
  netDebitBalance: number;
  netCreditBalance: number;
}

export interface TrialBalanceReport {
  asOfDate: string;
  basis: 'ACCRUAL' | 'CASH';
  items: TrialBalanceItem[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export interface IncomeStatementReport {
  startDate: string;
  endDate: string;
  basis: 'ACCRUAL' | 'CASH';
  revenues: { code: string; name: string; amount: number }[];
  totalRevenue: number;
  costOfServices: { code: string; name: string; amount: number }[];
  totalCostOfServices: number;
  grossProfit: number;
  grossMarginPercentage: number;
  operatingExpenses: { code: string; name: string; amount: number }[];
  totalOperatingExpenses: number;
  operatingIncome: number; // EBITDA
  netIncome: number;
}

export interface BalanceSheetReport {
  asOfDate: string;
  basis: 'ACCRUAL' | 'CASH';
  currentAssets: { code: string; name: string; amount: number }[];
  nonCurrentAssets: { code: string; name: string; amount: number }[];
  totalAssets: number;
  currentLiabilities: { code: string; name: string; amount: number }[];
  nonCurrentLiabilities: { code: string; name: string; amount: number }[];
  totalLiabilities: number;
  equityItems: { code: string; name: string; amount: number }[];
  retainedEarnings: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
}

export interface CashFlowStatementReport {
  fiscalYear: number;
  basis: 'ACCRUAL' | 'CASH';
  operatingActivities: {
    netIncome: number;
    depreciationAddBack: number;
    changeInAccountsReceivable: number;
    changeInAccountsPayable: number;
    changeInSalesTaxPayable: number;
    netCashFromOperating: number;
  };
  investingActivities: {
    fleetAndEquipmentPurchase: number;
    netCashFromInvesting: number;
  };
  financingActivities: {
    capitalContributions: number;
    partnerDrawsAndDistributions: number;
    netCashFromFinancing: number;
  };
  netChangeInCash: number;
  beginningCashBalance: number;
  endingCashBalance: number;
  isReconciled: boolean;
}

export interface StatementOfEquityReport {
  fiscalYear: number;
  basis: 'ACCRUAL' | 'CASH';
  beginningBalance: number;
  capitalContributed: number;
  netIncomeOrLoss: number;
  partnerDraws: number;
  endingBalance: number;
  scheduleM2: {
    line1BeginningCapital: number;
    line2CapitalContributed: number;
    line3NetIncome: number;
    line4OtherIncreases: number;
    line5TotalLines1Through4: number;
    line6Distributions: number;
    line7OtherDecreases: number;
    line8TotalLines6And7: number;
    line9EndingCapital: number;
  };
}

export interface FinancialNoteItem {
  noteNumber: number;
  title: string;
  titlePt: string;
  usGaapCodification: string;
  content: string;
}

export interface FinancialNotesReport {
  entityName: string;
  fiscalYear: number;
  basis: 'ACCRUAL' | 'CASH';
  notes: FinancialNoteItem[];
}

