import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from './types';

export type PaymentTerm = 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30' | 'NET_60';

export interface InvoiceItemDTO {
  description: string;
  quantity: number; // Hours or units
  unitPrice: number; // Rate per hour or fixed fee
  pricingModel: 'HOURLY' | 'FIXED_FEE' | 'RETAINER' | 'SUBSCRIPTION';
  revenueAccountCode: string; // E.g. '4010', '4020'
}

export interface CreateInvoiceDTO {
  organizationId: string;
  contactId: string;
  contactName: string;
  invoiceNumber: string;
  issueDate: string;
  paymentTerm: PaymentTerm;
  items: InvoiceItemDTO[];
  notes?: string;
}

export interface InvoiceDTO extends CreateInvoiceDTO {
  id: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE';
  paymentLinkUrl: string;
  lateFeeApplied?: number;
}

export class InvoicingService {
  /**
   * Calculates due date based on payment terms
   */
  public static calculateDueDate(issueDate: string, term: PaymentTerm): string {
    const d = new Date(issueDate);
    switch (term) {
      case 'DUE_ON_RECEIPT':
        return issueDate;
      case 'NET_15':
        d.setDate(d.getDate() + 15);
        return d.toISOString().split('T')[0];
      case 'NET_30':
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
      case 'NET_60':
        d.setDate(d.getDate() + 60);
        return d.toISOString().split('T')[0];
    }
  }

  /**
   * Calculates subtotal, total, and balance due for an invoice
   */
  public static createInvoice(input: CreateInvoiceDTO, taxRate: number = 0): InvoiceDTO {
    let subtotalDec = new Decimal(0);

    for (const item of input.items) {
      const lineAmt = new Decimal(item.quantity).times(new Decimal(item.unitPrice));
      subtotalDec = subtotalDec.plus(lineAmt);
    }

    const taxAmountDec = subtotalDec.times(new Decimal(taxRate));
    const totalAmountDec = subtotalDec.plus(taxAmountDec);
    const dueDate = this.calculateDueDate(input.issueDate, input.paymentTerm);

    return {
      ...input,
      id: `inv-${Math.random().toString(36).substring(7)}`,
      dueDate,
      subtotal: subtotalDec.toNumber(),
      taxAmount: taxAmountDec.toNumber(),
      totalAmount: totalAmountDec.toNumber(),
      amountPaid: 0,
      balanceDue: totalAmountDec.toNumber(),
      status: 'ISSUED',
      paymentLinkUrl: `https://pay.uas-accounting.io/inv/${input.invoiceNumber}`,
    };
  }

  /**
   * Generates a balanced US GAAP Journal Entry when an invoice is issued (Accrual basis)
   * Debit: 1200 Accounts Receivable ($Total)
   * Credit: 4010/4020 Service Revenue ($Subtotal)
   * Credit (if applicable): 2300 Sales Tax Payable ($Tax)
   */
  public static generateIssueJournalEntry(invoice: InvoiceDTO): CreateJournalEntryInput {
    const lines = [
      {
        accountId: '1200', // A/R
        debit: invoice.totalAmount,
        credit: 0,
        description: `Invoice ${invoice.invoiceNumber} - ${invoice.contactName}`,
        contactId: invoice.contactId,
      },
    ];

    for (const item of invoice.items) {
      const lineAmount = new Decimal(item.quantity).times(new Decimal(item.unitPrice)).toNumber();
      lines.push({
        accountId: item.revenueAccountCode,
        debit: 0,
        credit: lineAmount,
        description: item.description,
        contactId: invoice.contactId,
      });
    }

    if (invoice.taxAmount > 0) {
      lines.push({
        accountId: '2300', // Sales Tax Payable
        debit: 0,
        credit: invoice.taxAmount,
        description: `Sales Tax on Invoice ${invoice.invoiceNumber}`,
        contactId: invoice.contactId,
      });
    }

    return {
      organizationId: invoice.organizationId,
      date: new Date(invoice.issueDate),
      memo: `Invoice Issued: ${invoice.invoiceNumber} (${invoice.contactName})`,
      basis: 'ACCRUAL',
      sourceType: 'INVOICE',
      sourceId: invoice.id,
      lines,
    };
  }

  /**
   * Generates a balanced US GAAP Journal Entry when an invoice is paid (Settlement)
   * Debit: 1010 Operating Checking Account ($Paid)
   * Credit: 1200 Accounts Receivable ($Paid)
   */
  public static generatePaymentJournalEntry(
    invoice: InvoiceDTO,
    paymentAmount: number,
    paymentDate: string
  ): CreateJournalEntryInput {
    return {
      organizationId: invoice.organizationId,
      date: new Date(paymentDate),
      memo: `Payment Received for Invoice ${invoice.invoiceNumber} (${invoice.contactName})`,
      basis: 'BOTH',
      sourceType: 'PAYMENT',
      sourceId: invoice.id,
      lines: [
        {
          accountId: '1010', // Operating Checking Account
          debit: paymentAmount,
          credit: 0,
          description: `ACH/Stripe Payment for ${invoice.invoiceNumber}`,
          contactId: invoice.contactId,
        },
        {
          accountId: '1200', // Accounts Receivable
          debit: 0,
          credit: paymentAmount,
          description: `Clear A/R for ${invoice.invoiceNumber}`,
          contactId: invoice.contactId,
        },
      ],
    };
  }

  /**
   * Calculates late fee penalty for overdue invoices (e.g. 1.5% per 30-day overdue period)
   */
  public static calculateLateFee(invoice: InvoiceDTO, asOfDate: string, monthlyRatePercent: number = 1.5): number {
    if (invoice.balanceDue <= 0) return 0;
    const dueDate = new Date(invoice.dueDate).getTime();
    const asOf = new Date(asOfDate).getTime();

    if (asOf <= dueDate) return 0;

    const daysOverdue = Math.floor((asOf - dueDate) / (1000 * 60 * 60 * 24));
    if (daysOverdue <= 0) return 0;

    const monthsOverdue = new Decimal(daysOverdue).dividedBy(30);
    const rateDecimal = new Decimal(monthlyRatePercent).dividedBy(100);
    const lateFee = new Decimal(invoice.balanceDue).times(rateDecimal).times(monthsOverdue);

    return parseFloat(lateFee.toFixed(2));
  }
}
