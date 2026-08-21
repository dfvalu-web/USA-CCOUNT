import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from '../accounting/types';

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'BRL' | 'CAD' | 'MXN';

export interface ExchangeRateQuote {
  fromCurrency: SupportedCurrency;
  toCurrency: 'USD';
  rate: number; // e.g. 1 EUR = 1.085 USD, 1 BRL = 0.182 USD
  source: 'FEDERAL_RESERVE' | 'ECB' | 'CENTRAL_BANK';
  asOfDate: string;
}

export interface MultiCurrencyInvoice {
  invoiceNumber: string;
  clientName: string;
  foreignCurrency: SupportedCurrency;
  foreignAmount: number;
  issueDate: string;
  issueExchangeRate: number; // Rate at issue date
  usdEquivalentAtIssue: number;
  settlementDate?: string;
  settlementExchangeRate?: number; // Rate at payment date
  usdEquivalentAtSettlement?: number;
  realizedFxGainLoss?: number; // Positive = Gain, Negative = Loss
}

export interface UnrealizedRevaluationResult {
  asOfDate: string;
  openInvoicesEvaluated: number;
  totalUnrealizedFxGainLoss: number;
  isGain: boolean;
  journalEntry: CreateJournalEntryInput;
}

export class MultiCurrencyEngine {
  private static LIVE_RATES: Record<SupportedCurrency, number> = {
    USD: 1.00,
    EUR: 1.085, // 1 EUR = $1.085 USD
    GBP: 1.285, // 1 GBP = $1.285 USD
    BRL: 0.182, // 1 BRL = $0.182 USD
    CAD: 0.742, // 1 CAD = $0.742 USD
    MXN: 0.052, // 1 MXN = $0.052 USD
  };

  /**
   * Returns current exchange rate quote to USD
   */
  public static getExchangeRate(fromCurrency: SupportedCurrency): number {
    return this.LIVE_RATES[fromCurrency] || 1.0;
  }

  /**
   * Converts foreign currency amount to USD
   */
  public static convertToUSD(amount: number, fromCurrency: SupportedCurrency, customRate?: number): number {
    const rate = customRate ?? this.getExchangeRate(fromCurrency);
    const usd = new Decimal(amount).times(new Decimal(rate));
    return parseFloat(usd.toFixed(2));
  }

  /**
   * Calculates Realized FX Gain/Loss upon settlement of a foreign currency invoice (ASC 830)
   */
  public static calculateRealizedFx(
    foreignAmount: number,
    issueRate: number,
    settlementRate: number
  ): {
    usdAtIssue: number;
    usdAtSettlement: number;
    realizedGainLoss: number;
    isGain: boolean;
  } {
    const amtDec = new Decimal(foreignAmount);
    const usdIssueDec = amtDec.times(new Decimal(issueRate));
    const usdSettlementDec = amtDec.times(new Decimal(settlementRate));
    const diffDec = usdSettlementDec.minus(usdIssueDec);

    return {
      usdAtIssue: parseFloat(usdIssueDec.toFixed(2)),
      usdAtSettlement: parseFloat(usdSettlementDec.toFixed(2)),
      realizedGainLoss: parseFloat(diffDec.toFixed(2)),
      isGain: diffDec.greaterThanOrEqualTo(0),
    };
  }

  /**
   * Generates a balanced US GAAP Journal Entry for month-end Unrealized FX Revaluation
   */
  public static generateMonthEndRevaluationJournalEntry(
    organizationId: string,
    openInvoices: Array<{ foreignAmount: number; issueRate: number; foreignCurrency: SupportedCurrency }>,
    asOfDate: string
  ): UnrealizedRevaluationResult {
    let totalDiffDec = new Decimal(0);

    for (const inv of openInvoices) {
      const currentRate = this.getExchangeRate(inv.foreignCurrency);
      const originalUsd = new Decimal(inv.foreignAmount).times(new Decimal(inv.issueRate));
      const currentUsd = new Decimal(inv.foreignAmount).times(new Decimal(currentRate));
      totalDiffDec = totalDiffDec.plus(currentUsd.minus(originalUsd));
    }

    const totalDiff = parseFloat(totalDiffDec.toFixed(2));
    const isGain = totalDiffDec.greaterThanOrEqualTo(0);
    const absDiff = Math.abs(totalDiff);

    // If Gain: DR 1200 A/R ($Gain), CR 4900 Foreign Exchange Gain ($Gain)
    // If Loss: DR 6500 Foreign Exchange Loss ($Loss), CR 1200 A/R ($Loss)
    const lines = isGain
      ? [
          {
            accountId: '1200', // Accounts Receivable
            debit: absDiff,
            credit: 0,
            description: `ASC 830 Unrealized FX Gain Revaluation (A/R asset increase)`,
          },
          {
            accountId: '4900', // Other Income / FX Gain
            debit: 0,
            credit: absDiff,
            description: `Unrealized FX Gain on Open Foreign Invoices as of ${asOfDate}`,
          },
        ]
      : [
          {
            accountId: '6500', // Bank & FX Fees / FX Loss
            debit: absDiff,
            credit: 0,
            description: `Unrealized FX Loss on Open Foreign Invoices as of ${asOfDate}`,
          },
          {
            accountId: '1200', // Accounts Receivable
            debit: 0,
            credit: absDiff,
            description: `ASC 830 Unrealized FX Loss Revaluation (A/R asset decrease)`,
          },
        ];

    const journalEntry: CreateJournalEntryInput = {
      organizationId,
      date: new Date(asOfDate),
      memo: `ASC 830 Month-End FX Revaluation (${openInvoices.length} open foreign invoices)`,
      basis: 'ACCRUAL',
      sourceType: 'FX_REVALUATION',
      sourceId: `fx-rev-${asOfDate}`,
      lines,
    };

    return {
      asOfDate,
      openInvoicesEvaluated: openInvoices.length,
      totalUnrealizedFxGainLoss: totalDiff,
      isGain,
      journalEntry,
    };
  }
}
