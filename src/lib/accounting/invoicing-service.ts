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
  public static MILLA_MAID_INVOICES: InvoiceDTO[] = [
    {
      id: 'inv-mil-101',
      organizationId: 'cmp-milla-maid-ga',
      contactId: 'cnt-mill-01',
      contactName: 'Buckhead Luxury Condominiums',
      invoiceNumber: 'INV-2026-0101',
      issueDate: '2026-08-01',
      dueDate: '2026-08-31',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Commercial Janitorial & Common Area Sanitization (50 hrs @ $150/hr)',
          quantity: 50,
          unitPrice: 150,
          pricingModel: 'HOURLY',
          revenueAccountCode: '4010',
        },
        {
          description: 'High-Luster Marble Floor Buffing & Sealant',
          quantity: 1,
          unitPrice: 950,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 8450,
      taxAmount: 0,
      totalAmount: 8450,
      amountPaid: 0,
      balanceDue: 8450,
      status: 'ISSUED',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0101',
    },
    {
      id: 'inv-mil-102',
      organizationId: 'cmp-milla-maid-ga',
      contactId: 'cnt-mill-02',
      contactName: 'Midtown Medical & Dental Plaza',
      invoiceNumber: 'INV-2026-0102',
      issueDate: '2026-07-15',
      dueDate: '2026-08-14',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Specialized Medical Grade Facility Cleaning - Monthly Retainer',
          quantity: 1,
          unitPrice: 12800,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 12800,
      taxAmount: 0,
      totalAmount: 12800,
      amountPaid: 12800,
      balanceDue: 0,
      status: 'PAID',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0102',
    },
    {
      id: 'inv-mil-103',
      organizationId: 'cmp-milla-maid-ga',
      contactId: 'cnt-mill-03',
      contactName: 'Doraville Commercial Center',
      invoiceNumber: 'INV-2026-0103',
      issueDate: '2026-06-20',
      dueDate: '2026-07-05',
      paymentTerm: 'NET_15',
      items: [
        {
          description: 'Post-Construction Deep Clean & Waste Disposal',
          quantity: 1,
          unitPrice: 6400,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 6400,
      taxAmount: 0,
      totalAmount: 6400,
      amountPaid: 0,
      balanceDue: 6400,
      status: 'OVERDUE',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0103',
      lateFeeApplied: 96,
    },
  ];

  public static APEX_CLEANOPS_INVOICES: InvoiceDTO[] = [
    {
      id: 'inv-apx-101',
      organizationId: 'cmp-apex-cleanops-tx',
      contactId: 'cnt-apex-01',
      contactName: 'Austin Tech Hub Suites',
      invoiceNumber: 'INV-2026-0089',
      issueDate: '2026-08-01',
      dueDate: '2026-08-31',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Manutenção Mensal & Janitorial Corporativo (40 hrs @ $150/hr)',
          quantity: 40,
          unitPrice: 150,
          pricingModel: 'HOURLY',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 6000,
      taxAmount: 495,
      totalAmount: 6495,
      amountPaid: 0,
      balanceDue: 6495,
      status: 'ISSUED',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0089',
    },
    {
      id: 'inv-apx-102',
      organizationId: 'cmp-apex-cleanops-tx',
      contactId: 'cnt-apex-02',
      contactName: 'Dallas Corporate Plaza Towers',
      invoiceNumber: 'INV-2026-0091',
      issueDate: '2026-07-10',
      dueDate: '2026-08-10',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Commercial Facility Floor Polishing & Sanitization Retainer',
          quantity: 1,
          unitPrice: 15200,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 15200,
      taxAmount: 0,
      totalAmount: 15200,
      amountPaid: 15200,
      balanceDue: 0,
      status: 'PAID',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0091',
    },
    {
      id: 'inv-apx-103',
      organizationId: 'cmp-apex-cleanops-tx',
      contactId: 'cnt-apex-03',
      contactName: 'Houston Energy Tower Facility',
      invoiceNumber: 'INV-2026-0092',
      issueDate: '2026-08-15',
      dueDate: '2026-09-15',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Industrial HVAC Sanitization & Bio-Disinfection',
          quantity: 1,
          unitPrice: 22500,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4010',
        },
      ],
      subtotal: 22500,
      taxAmount: 0,
      totalAmount: 22500,
      amountPaid: 0,
      balanceDue: 22500,
      status: 'ISSUED',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0092',
    },
  ];

  public static APEX_CLOUD_INVOICES: InvoiceDTO[] = [
    {
      id: 'inv-cld-101',
      organizationId: 'cmp-apex-cloud-de',
      contactId: 'cnt-cloud-01',
      contactName: 'NovaTech BioLabs Inc',
      invoiceNumber: 'INV-2026-0088',
      issueDate: '2026-07-15',
      dueDate: '2026-08-14',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Custom React & Node.js Platform Engineering',
          quantity: 1,
          unitPrice: 18500,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4020',
        },
      ],
      subtotal: 18500,
      taxAmount: 0,
      totalAmount: 18500,
      amountPaid: 18500,
      balanceDue: 0,
      status: 'PAID',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0088',
    },
    {
      id: 'inv-cld-102',
      organizationId: 'cmp-apex-cloud-de',
      contactId: 'cnt-cloud-02',
      contactName: 'SoHo Design & Creative Agency',
      invoiceNumber: 'INV-2026-0082',
      issueDate: '2026-06-15',
      dueDate: '2026-07-15',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Monthly Engineering & Security Retainer - June',
          quantity: 1,
          unitPrice: 12000,
          pricingModel: 'RETAINER',
          revenueAccountCode: '4030',
        },
      ],
      subtotal: 12000,
      taxAmount: 1065,
      totalAmount: 13065,
      amountPaid: 0,
      balanceDue: 13065,
      status: 'OVERDUE',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0082',
      lateFeeApplied: 216,
    },
    {
      id: 'inv-cld-103',
      organizationId: 'cmp-apex-cloud-de',
      contactId: 'cnt-cloud-03',
      contactName: 'Fintech Alpha Labs Corp',
      invoiceNumber: 'INV-2026-0083',
      issueDate: '2026-08-01',
      dueDate: '2026-08-31',
      paymentTerm: 'NET_30',
      items: [
        {
          description: 'Next.js AI Copilot Architecture & Multi-Tenant Migration',
          quantity: 1,
          unitPrice: 28000,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode: '4020',
        },
      ],
      subtotal: 28000,
      taxAmount: 0,
      totalAmount: 28000,
      amountPaid: 0,
      balanceDue: 28000,
      status: 'ISSUED',
      paymentLinkUrl: 'https://pay.mistercontabil.com/inv/INV-2026-0083',
    },
  ];

  public static getInvoicesForCompany(companyId: string, legalName?: string): InvoiceDTO[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));
    const isApexDelaware = companyId.includes('003') || companyId.includes('cloud') || (legalName && legalName.toLowerCase().includes('cloud'));

    if (isMilla) {
      return InvoicingService.MILLA_MAID_INVOICES;
    } else if (isApexDelaware) {
      return InvoicingService.APEX_CLOUD_INVOICES;
    } else {
      return InvoicingService.APEX_CLEANOPS_INVOICES;
    }
  }

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
      paymentLinkUrl: `https://pay.mistercontabil.com/inv/${input.invoiceNumber}`,
    };
  }

  /**
   * Generates a balanced US GAAP Journal Entry when an invoice is issued (Accrual basis)
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
   * Calculates late fee penalty for overdue invoices
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
