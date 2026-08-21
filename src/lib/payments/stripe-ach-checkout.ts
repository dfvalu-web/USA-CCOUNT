import Decimal from 'decimal.js';
import { InvoiceDTO, InvoicingService } from '../accounting/invoicing-service';
import { CreateJournalEntryInput } from '../accounting/types';

export type SupportedPaymentMethod = 'STRIPE_CARD' | 'ACH_DIRECT_DEBIT' | 'APPLE_PAY' | 'FEDNOW_INSTANT';

export interface CheckoutSession {
  sessionId: string;
  invoice: InvoiceDTO;
  grossAmountDue: number;
  earlyPaymentDiscountAmount: number;
  finalSettlementAmount: number;
  processingFeeEstimate: number;
  paymentMethod: SupportedPaymentMethod;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  receiptUrl: string;
}

export class StripeAchCheckoutService {
  /**
   * Initializes a checkout session applying early discount (e.g. 2% if paid within 10 days)
   */
  public static createCheckoutSession(
    invoice: InvoiceDTO,
    paymentMethod: SupportedPaymentMethod = 'ACH_DIRECT_DEBIT',
    currentDate: string = new Date().toISOString().split('T')[0]
  ): CheckoutSession {
    const grossDueDec = new Decimal(invoice.balanceDue);
    const issueDate = new Date(invoice.issueDate).getTime();
    const currDate = new Date(currentDate).getTime();
    const daysSinceIssue = Math.floor((currDate - issueDate) / (1000 * 60 * 60 * 24));

    let discountDec = new Decimal(0);
    // 2% 10 Net 30 rule: 2% discount if paid within 10 days
    if (daysSinceIssue <= 10 && daysSinceIssue >= 0) {
      discountDec = grossDueDec.times('0.02');
    }

    const finalAmountDec = grossDueDec.minus(discountDec);

    // ACH fees are capped at $5, Card fees are ~2.9% + 30c
    let feeDec = new Decimal(5.00);
    if (paymentMethod === 'STRIPE_CARD' || paymentMethod === 'APPLE_PAY') {
      feeDec = finalAmountDec.times('0.029').plus('0.30');
    }

    return {
      sessionId: `cs_${Math.random().toString(36).substring(7)}`,
      invoice,
      grossAmountDue: grossDueDec.toNumber(),
      earlyPaymentDiscountAmount: parseFloat(discountDec.toFixed(2)),
      finalSettlementAmount: parseFloat(finalAmountDec.toFixed(2)),
      processingFeeEstimate: parseFloat(feeDec.toFixed(2)),
      paymentMethod,
      status: 'PENDING',
      receiptUrl: `https://receipts.uas-accounting.io/rcpt_${invoice.invoiceNumber}`,
    };
  }

  /**
   * Completes payment settlement and generates balancing payment journal entry
   */
  public static executeSettlement(session: CheckoutSession, settlementDate: string): {
    settledSession: CheckoutSession;
    journalEntry: CreateJournalEntryInput;
  } {
    const settledSession: CheckoutSession = {
      ...session,
      status: 'SUCCEEDED',
    };

    const paymentJE = InvoicingService.generatePaymentJournalEntry(
      session.invoice,
      session.finalSettlementAmount,
      settlementDate
    );

    return {
      settledSession,
      journalEntry: paymentJE,
    };
  }
}
