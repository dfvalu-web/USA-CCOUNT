import Decimal from 'decimal.js';
import { BankTransactionItem } from '../accounting/bank-reconciliation';

export interface PlaidWebhookPayload {
  webhook_type: 'TRANSACTIONS' | 'HOLDINGS' | 'ITEM';
  webhook_code: 'SYNC_UPDATES_AVAILABLE' | 'DEFAULT_UPDATE' | 'INITIAL_UPDATE' | 'TRANSACTIONS_REMOVED';
  item_id: string;
  new_transactions: number;
  environment: 'sandbox' | 'development' | 'production';
}

export interface IngestedTransactionEvent {
  transactionId: string;
  accountId: string;
  date: string;
  amount: number; // Plaid convention: positive = outflow, negative = inflow
  merchantName: string;
  category: string[];
  pending: boolean;
  suggestedGlAccountCode: string;
  suggestedGlAccountName: string;
  reconciliationConfidence: number;
}

export class PlaidWebhookHandler {
  /**
   * Processes incoming Plaid transaction webhook event and returns normalized GL transactions
   */
  public static processTransactionSync(
    rawTransactions: Array<{
      transaction_id: string;
      account_id: string;
      date: string;
      amount: number;
      name: string;
      category?: string[];
      pending?: boolean;
    }>
  ): IngestedTransactionEvent[] {
    return rawTransactions.map((tx) => {
      // In US Accounting: Inflow (Deposit) = Positive, Outflow (Disbursement) = Negative
      const accountingAmount = -tx.amount;
      const isDeposit = accountingAmount > 0;

      let glCode = '6100'; // Default Software
      let glName = 'Software, SaaS & Productivity Tools';

      const normName = tx.name.toLowerCase();
      if (isDeposit) {
        if (/stripe|client|invoice|consulting|wire/i.test(normName)) {
          glCode = '1200'; // A/R collection
          glName = 'Accounts Receivable (A/R)';
        } else {
          glCode = '4010'; // Service Revenue
          glName = 'Consulting & Advisory Services Revenue';
        }
      } else {
        if (/gusto|payroll|adp|salary/i.test(normName)) {
          glCode = '2210';
          glName = 'Federal Payroll Taxes & Wages Clearing';
        } else if (/aws|amazon web services|google cloud|gcp|azure/i.test(normName)) {
          glCode = '5030';
          glName = 'Direct Project Cloud Infrastructure';
        } else if (/ramp|brex|amex/i.test(normName)) {
          glCode = '2020';
          glName = 'Corporate Credit Cards Payable';
        }
      }

      return {
        transactionId: tx.transaction_id,
        accountId: tx.account_id,
        date: tx.date,
        amount: accountingAmount,
        merchantName: tx.name,
        category: tx.category || ['General'],
        pending: tx.pending || false,
        suggestedGlAccountCode: glCode,
        suggestedGlAccountName: glName,
        reconciliationConfidence: 95,
      };
    });
  }
}
