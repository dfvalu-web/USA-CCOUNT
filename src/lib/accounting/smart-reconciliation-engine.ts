import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from './types';

export interface BankFeedTransaction {
  id: string;
  institutionName: string; // e.g. "JPMorgan Chase" or "Mercury"
  accountNumberMasked: string; // e.g. "••••4819"
  date: string;
  amount: number; // Negative for expense/withdrawal, Positive for deposit/revenue
  rawDescription: string;
  payeeOrMerchant: string;
  categorySuggested: string;
  suggestedAccountCode: string; // e.g. "5020", "4010", "6100"
  fitId: string; // Financial Institution Transaction ID (anti-duplication)
  status: 'PENDING_MATCH' | 'EXACT_MATCH_FOUND' | 'RULE_MATCH_FOUND' | 'RECONCILED' | 'MANUAL_REVIEW';
  matchedJournalEntryId?: string;
  matchConfidence: number; // 0 to 100
  matchExplanation?: string;
}

export interface BankStatementParseResult {
  fileName: string;
  fileFormat: 'OFX' | 'QBO' | 'CSV';
  totalTransactionsFound: number;
  totalDebits: number;
  totalCredits: number;
  transactions: BankFeedTransaction[];
  duplicatesIgnoredCount: number;
}

export class SmartReconciliationEngine {
  /**
   * Rule-based Vendor Pattern Matcher
   */
  public static VENDOR_RULES: Array<{
    pattern: RegExp;
    payee: string;
    accountCode: string;
    category: string;
  }> = [
    { pattern: /ecolab|cleaningsupply|chemicals/i, payee: 'Ecolab Commercial Supply', accountCode: '5020', category: 'Cleaning Supplies (COGS)' },
    { pattern: /home\s*depot|lowes|grainger/i, payee: 'The Home Depot Pro / Grainger', accountCode: '5020', category: 'Cleaning Supplies (COGS)' },
    { pattern: /chevron|shell|exxon|bp\s*gas/i, payee: 'Fuel & Transportation', accountCode: '6200', category: 'Travel & Vehicle Expense' },
    { pattern: /stripe\s*payout|stripe\s*transfer/i, payee: 'Stripe Merchant Payout', accountCode: '1010', category: 'Revenue Settlement' },
    { pattern: /liberty\s*mutual|state\s*farm|geico/i, payee: 'Commercial Liability Insurance', accountCode: '6300', category: 'Insurance Expense' },
    { pattern: /aws|amazon\s*web|google\s*cloud|vercel/i, payee: 'Cloud Infrastructure', accountCode: '6100', category: 'Software & Technology' },
    { pattern: /adp|gusto|payroll\s*tax/i, payee: 'Payroll & Tax Remittance', accountCode: '2210', category: 'Payroll Liability' },
  ];

  /**
   * Parses Raw OFX / QBO SGML/XML text content into normalized BankFeedTransactions
   */
  public static parseOfxOrQbo(content: string, fileName: string = 'statement.ofx'): BankStatementParseResult {
    const transactions: BankFeedTransaction[] = [];
    let totalDebitsDec = new Decimal(0);
    let totalCreditsDec = new Decimal(0);

    // Regex extract <STMTTRN>...</STMTTRN> blocks
    const stmttrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match;

    while ((match = stmttrnRegex.exec(content)) !== null) {
      const block = match[1];

      const trntype = block.match(/<TRNTYPE>([^<\r\n]+)/i)?.[1]?.trim() || 'DEBIT';
      const dtpostedRaw = block.match(/<DTPOSTED>([^<\r\n]+)/i)?.[1]?.trim() || '';
      const trnamtRaw = block.match(/<TRNAMT>([^<\r\n]+)/i)?.[1]?.trim() || '0';
      const fitid = block.match(/<FITID>([^<\r\n]+)/i)?.[1]?.trim() || `FIT-${Math.random().toString(36).substring(2, 9)}`;
      const name = block.match(/<NAME>([^<\r\n]+)/i)?.[1]?.trim() || 'Bank Transaction';
      const memo = block.match(/<MEMO>([^<\r\n]+)/i)?.[1]?.trim() || name;

      // Parse Date YYYYMMDD
      let dateFormatted = new Date().toISOString().split('T')[0];
      if (dtpostedRaw.length >= 8) {
        dateFormatted = `${dtpostedRaw.substring(0, 4)}-${dtpostedRaw.substring(4, 6)}-${dtpostedRaw.substring(6, 8)}`;
      }

      const amountNum = parseFloat(trnamtRaw);
      const amountDec = new Decimal(amountNum);

      if (amountNum < 0) {
        totalDebitsDec = totalDebitsDec.plus(amountDec.abs());
      } else {
        totalCreditsDec = totalCreditsDec.plus(amountDec);
      }

      // Identify vendor rule
      const rule = this.matchVendorRule(name + ' ' + memo);

      transactions.push({
        id: `bnk-${fitid}`,
        institutionName: 'JPMorgan Chase Operating Checking',
        accountNumberMasked: '••••4819',
        date: dateFormatted,
        amount: amountNum,
        rawDescription: `${name} ${memo}`.trim(),
        payeeOrMerchant: rule?.payee || name,
        categorySuggested: rule?.category || (amountNum < 0 ? 'Uncategorized Expense' : 'Uncategorized Income'),
        suggestedAccountCode: rule?.accountCode || (amountNum < 0 ? '6100' : '4010'),
        fitId: fitid,
        status: rule ? 'RULE_MATCH_FOUND' : 'PENDING_MATCH',
        matchConfidence: rule ? 95 : 60,
        matchExplanation: rule ? `Automated Vendor Rule: ${rule.payee}` : 'Suggested based on standard account type',
      });
    }

    return {
      fileName,
      fileFormat: fileName.toLowerCase().endsWith('.qbo') ? 'QBO' : 'OFX',
      totalTransactionsFound: transactions.length,
      totalDebits: parseFloat(totalDebitsDec.toFixed(2)),
      totalCredits: parseFloat(totalCreditsDec.toFixed(2)),
      transactions,
      duplicatesIgnoredCount: 0,
    };
  }

  /**
   * Parses CSV Bank Statement content with dynamic header detection
   */
  public static parseCsv(csvText: string, fileName: string = 'statement.csv'): BankStatementParseResult {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return {
        fileName,
        fileFormat: 'CSV',
        totalTransactionsFound: 0,
        totalDebits: 0,
        totalCredits: 0,
        transactions: [],
        duplicatesIgnoredCount: 0,
      };
    }

    const headers = lines[0].toLowerCase().split(',').map((h) => h.replace(/["']/g, '').trim());
    const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('data'));
    const descIdx = headers.findIndex((h) => h.includes('desc') || h.includes('payee') || h.includes('memo') || h.includes('name'));
    const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('valor') || h.includes('total'));
    const debitIdx = headers.findIndex((h) => h.includes('debit') || h.includes('debito'));
    const creditIdx = headers.findIndex((h) => h.includes('credit') || h.includes('credito'));

    const transactions: BankFeedTransaction[] = [];
    let totalDebitsDec = new Decimal(0);
    let totalCreditsDec = new Decimal(0);

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map((c) => c.replace(/["']/g, '').trim());
      if (row.length < 2) continue;

      const dateRaw = row[dateIdx >= 0 ? dateIdx : 0] || new Date().toISOString().split('T')[0];
      const descRaw = row[descIdx >= 0 ? descIdx : 1] || 'Bank Transaction';

      let amount = 0;
      if (amountIdx >= 0 && row[amountIdx]) {
        amount = parseFloat(row[amountIdx].replace(/[$,]/g, '')) || 0;
      } else if (debitIdx >= 0 && creditIdx >= 0) {
        const dVal = parseFloat(row[debitIdx]?.replace(/[$,]/g, '') || '0') || 0;
        const cVal = parseFloat(row[creditIdx]?.replace(/[$,]/g, '') || '0') || 0;
        amount = cVal > 0 ? cVal : -Math.abs(dVal);
      }

      const amountDec = new Decimal(amount);
      if (amount < 0) totalDebitsDec = totalDebitsDec.plus(amountDec.abs());
      else totalCreditsDec = totalCreditsDec.plus(amountDec);

      const fitId = `CSV-${Math.abs(dateRaw.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0))}-${Math.abs(amount * 100)}`;
      const rule = this.matchVendorRule(descRaw);

      transactions.push({
        id: `bnk-${fitId}`,
        institutionName: 'Business Checking Account',
        accountNumberMasked: '••••4819',
        date: dateRaw,
        amount,
        rawDescription: descRaw,
        payeeOrMerchant: rule?.payee || descRaw,
        categorySuggested: rule?.category || (amount < 0 ? 'Operating Expense' : 'Operating Revenue'),
        suggestedAccountCode: rule?.accountCode || (amount < 0 ? '6100' : '4010'),
        fitId,
        status: rule ? 'RULE_MATCH_FOUND' : 'PENDING_MATCH',
        matchConfidence: rule ? 95 : 65,
        matchExplanation: rule ? `Automated Vendor Rule: ${rule.payee}` : 'Fuzzy description categorization',
      });
    }

    return {
      fileName,
      fileFormat: 'CSV',
      totalTransactionsFound: transactions.length,
      totalDebits: parseFloat(totalDebitsDec.toFixed(2)),
      totalCredits: parseFloat(totalCreditsDec.toFixed(2)),
      transactions,
      duplicatesIgnoredCount: 0,
    };
  }

  /**
   * Helper to match vendor rules
   */
  public static matchVendorRule(text: string) {
    for (const rule of this.VENDOR_RULES) {
      if (rule.pattern.test(text)) {
        return rule;
      }
    }
    return null;
  }

  /**
   * Generates a balanced US GAAP Journal Entry for a reconciled bank feed item
   */
  public static createJournalEntryForBankFeed(
    organizationId: string,
    tx: BankFeedTransaction,
    customAccountCode?: string
  ): CreateJournalEntryInput {
    const accountCode = customAccountCode || tx.suggestedAccountCode;
    const absAmount = Math.abs(tx.amount);

    const isExpense = tx.amount < 0;

    const lines = isExpense
      ? [
          {
            accountId: accountCode,
            debit: absAmount,
            credit: 0,
            description: `${tx.payeeOrMerchant} - ${tx.rawDescription}`,
          },
          {
            accountId: '1010', // Operating Checking (Cash Outflow)
            debit: 0,
            credit: absAmount,
            description: `Bank Clearance FITID ${tx.fitId}`,
          },
        ]
      : [
          {
            accountId: '1010', // Operating Checking (Cash Inflow)
            debit: absAmount,
            credit: 0,
            description: `Bank Deposit FITID ${tx.fitId}`,
          },
          {
            accountId: accountCode,
            debit: 0,
            credit: absAmount,
            description: `${tx.payeeOrMerchant} - ${tx.rawDescription}`,
          },
        ];

    return {
      organizationId,
      date: new Date(tx.date),
      memo: `Bank Feed Cleared: ${tx.payeeOrMerchant} ($${absAmount.toFixed(2)})`,
      basis: 'BOTH',
      sourceType: 'BANK_FEED_RECONCILIATION',
      sourceId: tx.id,
      lines,
    };
  }
}
