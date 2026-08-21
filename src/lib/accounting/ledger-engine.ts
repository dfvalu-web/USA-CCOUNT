import Decimal from 'decimal.js';
import { CreateJournalEntryInput, CreateJournalEntrySchema, TrialBalanceReport, TrialBalanceItem, AccountCategory } from './types';

export class DoubleEntryLedgerEngine {
  /**
   * Validates that an incoming journal entry complies strictly with US GAAP double-entry rules.
   * Debits must equal Credits exactly to 2 decimal places.
   */
  public static validateJournalEntry(input: unknown): { isValid: boolean; error?: string; data?: CreateJournalEntryInput } {
    const parseResult = CreateJournalEntrySchema.safeParse(input);
    if (!parseResult.success) {
      return {
        isValid: false,
        error: parseResult.error.errors.map(e => e.message).join(' | '),
      };
    }

    const data = parseResult.data;
    let totalDebit = new Decimal(0);
    let totalCredit = new Decimal(0);

    for (const line of data.lines) {
      totalDebit = totalDebit.plus(new Decimal(line.debit));
      totalCredit = totalCredit.plus(new Decimal(line.credit));
    }

    if (!totalDebit.equals(totalCredit)) {
      return {
        isValid: false,
        error: `Debits ($${totalDebit.toFixed(2)}) do not match Credits ($${totalCredit.toFixed(2)}). Difference: $${totalDebit.minus(totalCredit).abs().toFixed(2)}`,
      };
    }

    return {
      isValid: true,
      data,
    };
  }

  /**
   * Determine normal balance side for US GAAP account categories:
   * ASSET, EXPENSE, COST_OF_SERVICE -> Normal Debit Balance
   * LIABILITY, EQUITY, REVENUE -> Normal Credit Balance
   */
  public static isNormalDebitBalance(type: AccountCategory): boolean {
    return type === 'ASSET' || type === 'EXPENSE' || type === 'COST_OF_SERVICE';
  }

  /**
   * Generates a Trial Balance report from a list of accounts and their aggregated journal lines.
   */
  public static generateTrialBalance(
    accounts: Array<{
      code: string;
      name: string;
      namePt?: string | null;
      nameEs?: string | null;
      type: AccountCategory;
      lines: Array<{ debit: number | Decimal; credit: number | Decimal }>;
    }>,
    basis: 'ACCRUAL' | 'CASH' = 'ACCRUAL',
    asOfDate: string = new Date().toISOString()
  ): TrialBalanceReport {
    let grandTotalDebit = new Decimal(0);
    let grandTotalCredit = new Decimal(0);

    const items: TrialBalanceItem[] = accounts.map((acc) => {
      let totalDebit = new Decimal(0);
      let totalCredit = new Decimal(0);

      for (const line of acc.lines) {
        totalDebit = totalDebit.plus(new Decimal(line.debit.toString()));
        totalCredit = totalCredit.plus(new Decimal(line.credit.toString()));
      }

      grandTotalDebit = grandTotalDebit.plus(totalDebit);
      grandTotalCredit = grandTotalCredit.plus(totalCredit);

      let netDebit = new Decimal(0);
      let netCredit = new Decimal(0);

      if (this.isNormalDebitBalance(acc.type)) {
        const net = totalDebit.minus(totalCredit);
        if (net.greaterThanOrEqualTo(0)) {
          netDebit = net;
        } else {
          netCredit = net.abs();
        }
      } else {
        const net = totalCredit.minus(totalDebit);
        if (net.greaterThanOrEqualTo(0)) {
          netCredit = net;
        } else {
          netDebit = net.abs();
        }
      }

      return {
        accountCode: acc.code,
        accountName: acc.name,
        accountNamePt: acc.namePt ?? undefined,
        accountNameEs: acc.nameEs ?? undefined,
        type: acc.type,
        totalDebit: totalDebit.toNumber(),
        totalCredit: totalCredit.toNumber(),
        netDebitBalance: netDebit.toNumber(),
        netCreditBalance: netCredit.toNumber(),
      };
    }).sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    const isBalanced = grandTotalDebit.equals(grandTotalCredit);

    return {
      asOfDate,
      basis,
      items,
      totalDebits: grandTotalDebit.toNumber(),
      totalCredits: grandTotalCredit.toNumber(),
      isBalanced,
    };
  }
}
