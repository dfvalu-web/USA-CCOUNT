import Decimal from 'decimal.js';

export interface BankTransactionItem {
  id: string;
  date: string;
  amount: number; // Positive = Deposit, Negative = Withdrawal
  description: string;
  plaidCategory?: string;
  isReconciled: boolean;
  matchedJournalEntryId?: string;
}

export interface UnreconciledJournalEntry {
  id: string;
  date: string;
  memo: string;
  amount: number; // Net cash effect on account 1010
  type: 'RECEIPT' | 'DISBURSEMENT';
}

export interface MatchResult {
  bankTransactionId: string;
  journalEntryId: string;
  confidence: number; // 0 to 100
  matchReason: string;
  isExactAmount: boolean;
  dateDifferenceDays: number;
}

export class BankReconciliationEngine {
  /**
   * Performs automated matching between imported bank feed transactions (Plaid/OFX)
   * and posted General Ledger journal entries with cash account impact.
   */
  public static autoMatchTransactions(
    bankTransactions: BankTransactionItem[],
    journalEntries: UnreconciledJournalEntry[],
    maxDateToleranceDays: number = 5
  ): MatchResult[] {
    const results: MatchResult[] = [];
    const matchedJournalIds = new Set<string>();

    for (const bankTx of bankTransactions) {
      if (bankTx.isReconciled) continue;

      const bankDate = new Date(bankTx.date).getTime();
      const bankAmt = new Decimal(bankTx.amount).abs();
      const isDeposit = bankTx.amount > 0;

      let bestMatch: { entry: UnreconciledJournalEntry; score: number; reason: string; diffDays: number } | null = null;

      for (const entry of journalEntries) {
        if (matchedJournalIds.has(entry.id)) continue;

        // Check direction (Receipt = Deposit, Disbursement = Withdrawal)
        const matchesDirection =
          (isDeposit && entry.type === 'RECEIPT') || (!isDeposit && entry.type === 'DISBURSEMENT');
        if (!matchesDirection) continue;

        const entryAmt = new Decimal(entry.amount).abs();
        const entryDate = new Date(entry.date).getTime();
        const diffDays = Math.abs(Math.round((bankDate - entryDate) / (1000 * 60 * 60 * 24)));

        if (diffDays > maxDateToleranceDays) continue;

        // Exact amount match
        if (bankAmt.equals(entryAmt)) {
          let score = 90; // Base exact amount score
          let reason = 'Exact amount match';

          if (diffDays === 0) {
            score = 100;
            reason = 'Exact amount and same date';
          } else if (diffDays <= 2) {
            score = 95;
            reason = `Exact amount within ${diffDays} days settlement window`;
          }

          // Fuzzy description check
          const normBankDesc = bankTx.description.toLowerCase();
          const normMemo = entry.memo.toLowerCase();
          if (normBankDesc.split(' ').some((w) => w.length > 3 && normMemo.includes(w))) {
            score = Math.min(100, score + 5);
            reason += ' + Memo keyword match';
          }

          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { entry, score, reason, diffDays };
          }
        }
      }

      if (bestMatch && bestMatch.score >= 80) {
        matchedJournalIds.add(bestMatch.entry.id);
        results.push({
          bankTransactionId: bankTx.id,
          journalEntryId: bestMatch.entry.id,
          confidence: bestMatch.score,
          matchReason: bestMatch.reason,
          isExactAmount: true,
          dateDifferenceDays: bestMatch.diffDays,
        });
      }
    }

    return results;
  }
}
