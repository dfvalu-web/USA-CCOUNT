import Decimal from 'decimal.js';

export type SourceAccountingSoftware =
  | 'QUICKBOOKS_ONLINE'
  | 'XERO'
  | 'NETSUITE'
  | 'SAGE_INTACCT'
  | 'FRESHBOOKS'
  | 'UNIVERSAL_CSV_EXCEL';

export type StatementTypeToImport =
  | 'TRIAL_BALANCE'
  | 'INCOME_STATEMENT_PL'
  | 'BALANCE_SHEET'
  | 'GENERAL_LEDGER_ENTRIES'
  | 'CHART_OF_ACCOUNTS';

export interface SourceAccountRawLine {
  sourceAccountCode: string;
  sourceAccountName: string;
  sourceAccountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  debit: number;
  credit: number;
  netBalance: number;
}

export interface SmartAccountMapping {
  sourceAccountCode: string;
  sourceAccountName: string;
  targetAccountCode: string;
  targetAccountName: string;
  targetAccountType: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  confidenceScore: number; // 0 to 100
  status: 'AUTO_MAPPED' | 'MANUALLY_CONFIRMED' | 'UNMAPPED';
}

export interface ImportedStatementPackage {
  id: string;
  companyName: string;
  sourceSoftware: SourceAccountingSoftware;
  statementType: StatementTypeToImport;
  periodStart: string;
  periodEnd: string;
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  varianceAmount: number;
  rawLines: SourceAccountRawLine[];
  mappings: SmartAccountMapping[];
  importedAt: string;
  status: 'PENDING_MAPPING' | 'READY_TO_POST' | 'POSTED_TO_LEDGER';
}

export class SoftwareMigrationEngine {
  /**
   * AI-powered dictionary of standard mapping patterns
   */
  private static STANDARD_MAPPINGS: Record<
    string,
    { code: string; name: string; type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE' }
  > = {
    // Assets
    checking: { code: '1010', name: 'Operating Checking Account (Cash)', type: 'ASSET' },
    bank: { code: '1010', name: 'Operating Checking Account (Cash)', type: 'ASSET' },
    savings: { code: '1020', name: 'Treasury & Reserve Cash', type: 'ASSET' },
    'accounts receivable': { code: '1100', name: 'Accounts Receivable (A/R)', type: 'ASSET' },
    ar: { code: '1100', name: 'Accounts Receivable (A/R)', type: 'ASSET' },
    debtors: { code: '1100', name: 'Accounts Receivable (A/R)', type: 'ASSET' },
    inventory: { code: '1200', name: 'Inventory & Supplies', type: 'ASSET' },
    equipment: { code: '1500', name: 'Equipment & Computers (Fixed Assets)', type: 'ASSET' },
    vehicles: { code: '1510', name: 'Fleet Vehicles (Fixed Assets)', type: 'ASSET' },
    'accumulated depreciation': { code: '1600', name: 'Accumulated Depreciation', type: 'ASSET' },

    // Liabilities
    'accounts payable': { code: '2010', name: 'Accounts Payable (A/P)', type: 'LIABILITY' },
    ap: { code: '2010', name: 'Accounts Payable (A/P)', type: 'LIABILITY' },
    creditors: { code: '2010', name: 'Accounts Payable (A/P)', type: 'LIABILITY' },
    'credit card': { code: '2020', name: 'Corporate Credit Card Payable', type: 'LIABILITY' },
    'payroll taxes payable': { code: '2100', name: 'Payroll Tax Withholdings Payable', type: 'LIABILITY' },
    'sales tax payable': { code: '2110', name: 'State Sales Tax Payable', type: 'LIABILITY' },
    'unearned revenue': { code: '2200', name: 'Deferred Retainer Revenue (ASC 606)', type: 'LIABILITY' },
    'deferred revenue': { code: '2200', name: 'Deferred Retainer Revenue (ASC 606)', type: 'LIABILITY' },
    'notes payable': { code: '2500', name: 'Long Term Bank Loan Payable', type: 'LIABILITY' },

    // Equity
    'retained earnings': { code: '3000', name: 'Retained Earnings', type: 'EQUITY' },
    'common stock': { code: '3010', name: 'Common Stock & Capital Stock', type: 'EQUITY' },
    'owners equity': { code: '3020', name: 'Members Capital Account (IRC 704b)', type: 'EQUITY' },
    'members equity': { code: '3020', name: 'Members Capital Account (IRC 704b)', type: 'EQUITY' },
    drawings: { code: '3030', name: 'Partner Distributions / Draws', type: 'EQUITY' },
    distributions: { code: '3030', name: 'Partner Distributions / Draws', type: 'EQUITY' },

    // Revenue
    'sales revenue': { code: '4010', name: 'Subscription & SaaS Revenue', type: 'REVENUE' },
    'service revenue': { code: '4020', name: 'Commercial Cleaning & Service Revenue', type: 'REVENUE' },
    fees: { code: '4020', name: 'Commercial Cleaning & Service Revenue', type: 'REVENUE' },
    'consulting revenue': { code: '4030', name: 'Engineering & Advisory Revenue', type: 'REVENUE' },

    // Expenses
    'wages expense': { code: '5010', name: 'Direct Labor Salaries (W-2 Wages)', type: 'EXPENSE' },
    'payroll expense': { code: '5010', name: 'Direct Labor Salaries (W-2 Wages)', type: 'EXPENSE' },
    subcontractors: { code: '5020', name: '1099 Independent Contractor Fees', type: 'EXPENSE' },
    contractors: { code: '5020', name: '1099 Independent Contractor Fees', type: 'EXPENSE' },
    supplies: { code: '5030', name: 'Cleaning Chemicals & Field Supplies', type: 'EXPENSE' },
    software: { code: '6010', name: 'Cloud Infrastructure & SaaS Software', type: 'EXPENSE' },
    hosting: { code: '6010', name: 'Cloud Infrastructure & SaaS Software', type: 'EXPENSE' },
    rent: { code: '6020', name: 'Facility Lease & Office Rent', type: 'EXPENSE' },
    insurance: { code: '6030', name: 'Commercial General Liability Insurance', type: 'EXPENSE' },
    advertising: { code: '6040', name: 'Sales & Digital Marketing Expenses', type: 'EXPENSE' },
    legal: { code: '6050', name: 'Legal, CPA & Professional Advisory Fees', type: 'EXPENSE' },
    depreciation: { code: '6060', name: 'Depreciation Expense', type: 'EXPENSE' },
  };

  /**
   * Sample pre-loaded migration packages for instant demonstration
   */
  public static INITIAL_PACKAGES: ImportedStatementPackage[] = [
    {
      id: 'MIG-QBO-901',
      companyName: 'Apex CleanOps & Cloud Technologies LLC',
      sourceSoftware: 'QUICKBOOKS_ONLINE',
      statementType: 'TRIAL_BALANCE',
      periodStart: '2026-01-01',
      periodEnd: '2026-08-31',
      totalDebits: 485200.0,
      totalCredits: 485200.0,
      isBalanced: true,
      varianceAmount: 0.0,
      importedAt: '2026-08-21T10:15:00Z',
      status: 'POSTED_TO_LEDGER',
      rawLines: [
        { sourceAccountCode: '1000', sourceAccountName: 'Chase Business Checking', sourceAccountType: 'ASSET', debit: 415200, credit: 0, netBalance: 415200 },
        { sourceAccountCode: '1200', sourceAccountName: 'Accounts Receivable', sourceAccountType: 'ASSET', debit: 45000, credit: 0, netBalance: 45000 },
        { sourceAccountCode: '1500', sourceAccountName: 'Cleaning Machinery & Vans', sourceAccountType: 'ASSET', debit: 25000, credit: 0, netBalance: 25000 },
        { sourceAccountCode: '2000', sourceAccountName: 'Accounts Payable', sourceAccountType: 'LIABILITY', debit: 0, credit: 18200, netBalance: -18200 },
        { sourceAccountCode: '2200', sourceAccountName: 'Customer Retainer Deposits', sourceAccountType: 'LIABILITY', debit: 0, credit: 15000, netBalance: -15000 },
        { sourceAccountCode: '3000', sourceAccountName: 'Opening Balance Equity', sourceAccountType: 'EQUITY', debit: 0, credit: 325000, netBalance: -325000 },
        { sourceAccountCode: '4000', sourceAccountName: 'Janitorial & Cleaning Sales', sourceAccountType: 'REVENUE', debit: 0, credit: 185000, netBalance: -185000 },
        { sourceAccountCode: '5000', sourceAccountName: 'Payroll Wages & Salaries', sourceAccountType: 'EXPENSE', debit: 42000, credit: 0, netBalance: 42000 },
        { sourceAccountCode: '5100', sourceAccountName: 'Subcontractor Labor 1099', sourceAccountType: 'EXPENSE', debit: 16000, credit: 0, netBalance: 16000 },
      ],
      mappings: [
        { sourceAccountCode: '1000', sourceAccountName: 'Chase Business Checking', targetAccountCode: '1010', targetAccountName: 'Operating Checking Account (Cash)', targetAccountType: 'ASSET', confidenceScore: 99, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '1200', sourceAccountName: 'Accounts Receivable', targetAccountCode: '1100', targetAccountName: 'Accounts Receivable (A/R)', targetAccountType: 'ASSET', confidenceScore: 100, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '1500', sourceAccountName: 'Cleaning Machinery & Vans', targetAccountCode: '1500', targetAccountName: 'Equipment & Computers (Fixed Assets)', targetAccountType: 'ASSET', confidenceScore: 92, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '2000', sourceAccountName: 'Accounts Payable', targetAccountCode: '2010', targetAccountName: 'Accounts Payable (A/P)', targetAccountType: 'LIABILITY', confidenceScore: 100, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '2200', sourceAccountName: 'Customer Retainer Deposits', targetAccountCode: '2200', targetAccountName: 'Deferred Retainer Revenue (ASC 606)', targetAccountType: 'LIABILITY', confidenceScore: 95, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '3000', sourceAccountName: 'Opening Balance Equity', targetAccountCode: '3020', targetAccountName: 'Members Capital Account (IRC 704b)', targetAccountType: 'EQUITY', confidenceScore: 94, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '4000', sourceAccountName: 'Janitorial & Cleaning Sales', targetAccountCode: '4020', targetAccountName: 'Commercial Cleaning & Service Revenue', targetAccountType: 'REVENUE', confidenceScore: 98, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '5000', sourceAccountName: 'Payroll Wages & Salaries', targetAccountCode: '5010', targetAccountName: 'Direct Labor Salaries (W-2 Wages)', targetAccountType: 'EXPENSE', confidenceScore: 99, status: 'MANUALLY_CONFIRMED' },
        { sourceAccountCode: '5100', sourceAccountName: 'Subcontractor Labor 1099', targetAccountCode: '5020', targetAccountName: '1099 Independent Contractor Fees', targetAccountType: 'EXPENSE', confidenceScore: 99, status: 'MANUALLY_CONFIRMED' },
      ],
    },
    {
      id: 'MIG-XERO-902',
      companyName: 'Horizon Fintech Labs Inc',
      sourceSoftware: 'XERO',
      statementType: 'INCOME_STATEMENT_PL',
      periodStart: '2026-01-01',
      periodEnd: '2026-06-30',
      totalDebits: 140000.0,
      totalCredits: 140000.0,
      isBalanced: true,
      varianceAmount: 0.0,
      importedAt: '2026-08-20T14:30:00Z',
      status: 'READY_TO_POST',
      rawLines: [
        { sourceAccountCode: '200', sourceAccountName: 'SaaS Platform License Revenue', sourceAccountType: 'REVENUE', debit: 0, credit: 140000, netBalance: -140000 },
        { sourceAccountCode: '400', sourceAccountName: 'Engineering Contractor Fees', sourceAccountType: 'EXPENSE', debit: 65000, credit: 0, netBalance: 65000 },
        { sourceAccountCode: '420', sourceAccountName: 'AWS & Cloud Hosting Services', sourceAccountType: 'EXPENSE', debit: 18000, credit: 0, netBalance: 18000 },
        { sourceAccountCode: '450', sourceAccountName: 'Office & Facilities Rent', sourceAccountType: 'EXPENSE', debit: 12000, credit: 0, netBalance: 12000 },
      ],
      mappings: [
        { sourceAccountCode: '200', sourceAccountName: 'SaaS Platform License Revenue', targetAccountCode: '4010', targetAccountName: 'Subscription & SaaS Revenue', targetAccountType: 'REVENUE', confidenceScore: 98, status: 'AUTO_MAPPED' },
        { sourceAccountCode: '400', sourceAccountName: 'Engineering Contractor Fees', targetAccountCode: '5020', targetAccountName: '1099 Independent Contractor Fees', targetAccountType: 'EXPENSE', confidenceScore: 99, status: 'AUTO_MAPPED' },
        { sourceAccountCode: '420', sourceAccountName: 'AWS & Cloud Hosting Services', targetAccountCode: '6010', targetAccountName: 'Cloud Infrastructure & SaaS Software', targetAccountType: 'EXPENSE', confidenceScore: 96, status: 'AUTO_MAPPED' },
        { sourceAccountCode: '450', sourceAccountName: 'Office & Facilities Rent', targetAccountCode: '6020', targetAccountName: 'Facility Lease & Office Rent', targetAccountType: 'EXPENSE', confidenceScore: 97, status: 'AUTO_MAPPED' },
      ],
    },
  ];

  /**
   * Intelligently maps source account lines to UAS Accounting standard US GAAP accounts
   */
  public static autoMapAccount(raw: SourceAccountRawLine): SmartAccountMapping {
    const cleanName = raw.sourceAccountName.toLowerCase();
    let bestMatchKey = '';
    let highestConfidence = 50;

    for (const key of Object.keys(this.STANDARD_MAPPINGS)) {
      if (cleanName.includes(key)) {
        bestMatchKey = key;
        highestConfidence = 95;
        break;
      }
    }

    if (bestMatchKey && this.STANDARD_MAPPINGS[bestMatchKey]) {
      const target = this.STANDARD_MAPPINGS[bestMatchKey];
      return {
        sourceAccountCode: raw.sourceAccountCode,
        sourceAccountName: raw.sourceAccountName,
        targetAccountCode: target.code,
        targetAccountName: target.name,
        targetAccountType: target.type,
        confidenceScore: highestConfidence,
        status: 'AUTO_MAPPED',
      };
    }

    // Fallback default based on type
    const fallbackByType: Record<string, { code: string; name: string; type: any }> = {
      ASSET: { code: '1010', name: 'Operating Checking Account (Cash)', type: 'ASSET' },
      LIABILITY: { code: '2010', name: 'Accounts Payable (A/P)', type: 'LIABILITY' },
      EQUITY: { code: '3000', name: 'Retained Earnings', type: 'EQUITY' },
      REVENUE: { code: '4010', name: 'Subscription & SaaS Revenue', type: 'REVENUE' },
      EXPENSE: { code: '6010', name: 'General & Administrative Expense', type: 'EXPENSE' },
    };

    const fb = fallbackByType[raw.sourceAccountType] || fallbackByType['EXPENSE'];
    return {
      sourceAccountCode: raw.sourceAccountCode,
      sourceAccountName: raw.sourceAccountName,
      targetAccountCode: fb.code,
      targetAccountName: fb.name,
      targetAccountType: fb.type,
      confidenceScore: 70,
      status: 'AUTO_MAPPED',
    };
  }

  /**
   * Parses and validates raw tabular data (CSV / JSON) into an ImportedStatementPackage
   */
  public static processUploadedStatement(
    companyName: string,
    sourceSoftware: SourceAccountingSoftware,
    statementType: StatementTypeToImport,
    rawLines: SourceAccountRawLine[]
  ): ImportedStatementPackage {
    let totalDebits = new Decimal(0);
    let totalCredits = new Decimal(0);

    const mappings = rawLines.map((line) => {
      totalDebits = totalDebits.plus(new Decimal(line.debit || 0));
      totalCredits = totalCredits.plus(new Decimal(line.credit || 0));
      return this.autoMapAccount(line);
    });

    const variance = totalDebits.minus(totalCredits).abs().toNumber();
    const isBalanced = variance < 0.01;

    return {
      id: `MIG-${sourceSoftware.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      companyName,
      sourceSoftware,
      statementType,
      periodStart: '2026-01-01',
      periodEnd: '2026-08-31',
      totalDebits: totalDebits.toNumber(),
      totalCredits: totalCredits.toNumber(),
      isBalanced,
      varianceAmount: variance,
      rawLines,
      mappings,
      importedAt: new Date().toISOString(),
      status: isBalanced ? 'READY_TO_POST' : 'PENDING_MAPPING',
    };
  }
}
