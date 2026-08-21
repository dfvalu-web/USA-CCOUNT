import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from '../accounting/types';
import { InvoiceDTO } from '../accounting/invoicing-service';

export type CleaningServiceType =
  | 'RESIDENTIAL_STANDARD'
  | 'RESIDENTIAL_DEEP_CLEAN'
  | 'COMMERCIAL_JANITORIAL'
  | 'POST_CONSTRUCTION_CLEAN'
  | 'MOVE_IN_MOVE_OUT';

export interface CleaningCrewAssignment {
  cleanerId: string;
  cleanerName: string;
  cleanerType: 'W2_EMPLOYEE' | '1099_CONTRACTOR';
  payRatePerHour: number; // e.g. $22/hr
  estimatedHours: number;
}

export interface CleaningJobSchedule {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyAddress: string;
  city: string;
  stateCode: string; // 'TX', 'NY', 'FL', 'CA', etc.
  zipCode: string;
  isCommercial: boolean;
  serviceType: CleaningServiceType;
  scheduledDate: string;
  scheduledTimeWindow: string; // e.g. "09:00 AM - 12:00 PM"
  squareFootage: number;
  quotedServicePrice: number; // e.g. $280.00
  estimatedSuppliesCost: number; // Chemical supplies, trash liners, microfiber ($15.00)
  crew: CleaningCrewAssignment[];
  status: 'SCHEDULED' | 'CREW_DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED_POSTED' | 'CANCELLED';
  // Tax calculations
  salesTaxApplicable: boolean;
  salesTaxRate: number;
  salesTaxAmount: number;
  totalInvoiceAmount: number;
  // Accounting linkage
  invoiceGeneratedId?: string;
  journalEntryPostedId?: string;
  grossProfitAmount?: number;
  grossProfitMarginPercent?: number;
}

export class CleaningServiceEngine {
  /**
   * Evaluates state & local sales taxability for cleaning services
   * - Texas (TX): Commercial Janitorial & Residential Cleaning by companies is taxable (8.25% combined)
   * - New York (NY): Interior cleaning is taxable (8.875% in NYC / ~8.0% upstate)
   * - Florida (FL): Non-residential / commercial janitorial is taxable (7.0%), pure residential is exempt
   * - California (CA): Pure cleaning labor is exempt (0%)
   */
  public static evaluateCleaningSalesTax(
    stateCode: string,
    isCommercial: boolean,
    servicePrice: number
  ): {
    taxApplicable: boolean;
    rate: number;
    taxAmount: number;
    totalAmount: number;
    taxRuleRationale: string;
  } {
    const priceDec = new Decimal(servicePrice);
    let taxApplicable = false;
    let rateDec = new Decimal(0);
    let rationale = '';

    const state = stateCode.toUpperCase().trim();

    if (state === 'TX') {
      // Texas Tax Code Sec. 151.0101(a)(11): Real property services including janitorial/cleaning are taxable
      taxApplicable = true;
      rateDec = new Decimal('0.0825'); // 6.25% state + 2.0% local
      rationale = 'Texas Tax Code §151.0101: Janitorial & Building Cleaning services are taxable at 8.25%.';
    } else if (state === 'NY') {
      // NY Tax Law Section 1105(c)(5): Interior cleaning and maintenance are taxable
      taxApplicable = true;
      rateDec = new Decimal('0.08875'); // 4.0% state + 4.5% NYC + 0.375% MCTD
      rationale = 'NY Tax Law §1105(c)(5): Interior cleaning and maintenance services are taxable at 8.875%.';
    } else if (state === 'FL') {
      // Florida: Commercial cleaning is taxable (FL Statute 212.05(1)(i)), residential is exempt
      if (isCommercial) {
        taxApplicable = true;
        rateDec = new Decimal('0.070'); // 6.0% state + 1.0% surtax
        rationale = 'Florida Statute §212.05: Commercial janitorial/cleaning is taxable at 7.0%.';
      } else {
        taxApplicable = false;
        rateDec = new Decimal(0);
        rationale = 'Florida Department of Revenue: Residential cleaning services are exempt from sales tax.';
      }
    } else if (state === 'CA') {
      // California: Pure labor services are exempt from sales tax
      taxApplicable = false;
      rateDec = new Decimal(0);
      rationale = 'California CDTFA Reg. 1506: Pure service labor without sale of tangible property is exempt.';
    } else {
      // General US benchmark (taxable if commercial)
      if (isCommercial) {
        taxApplicable = true;
        rateDec = new Decimal('0.075');
        rationale = 'Standard multi-jurisdiction commercial janitorial tax rate applied (7.5%).';
      } else {
        taxApplicable = false;
        rateDec = new Decimal(0);
        rationale = 'Standard residential maid service exemption applied.';
      }
    }

    const taxAmountDec = taxApplicable ? priceDec.times(rateDec) : new Decimal(0);
    const totalAmountDec = priceDec.plus(taxAmountDec);

    return {
      taxApplicable,
      rate: parseFloat(rateDec.toFixed(4)),
      taxAmount: parseFloat(taxAmountDec.toFixed(2)),
      totalAmount: parseFloat(totalAmountDec.toFixed(2)),
      taxRuleRationale: rationale,
    };
  }

  /**
   * Books a cleaning job with automated sales tax and cost calculations
   */
  public static createCleaningJob(input: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    propertyAddress: string;
    city: string;
    stateCode: string;
    zipCode: string;
    isCommercial: boolean;
    serviceType: CleaningServiceType;
    scheduledDate: string;
    scheduledTimeWindow: string;
    squareFootage: number;
    quotedServicePrice: number;
    estimatedSuppliesCost?: number;
    crew: CleaningCrewAssignment[];
  }): CleaningJobSchedule {
    const suppliesCost = input.estimatedSuppliesCost ?? 15.00;
    const taxEval = this.evaluateCleaningSalesTax(
      input.stateCode,
      input.isCommercial,
      input.quotedServicePrice
    );

    return {
      id: `CLN-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      propertyAddress: input.propertyAddress,
      city: input.city,
      stateCode: input.stateCode.toUpperCase(),
      zipCode: input.zipCode,
      isCommercial: input.isCommercial,
      serviceType: input.serviceType,
      scheduledDate: input.scheduledDate,
      scheduledTimeWindow: input.scheduledTimeWindow,
      squareFootage: input.squareFootage,
      quotedServicePrice: input.quotedServicePrice,
      estimatedSuppliesCost: suppliesCost,
      crew: input.crew,
      status: 'SCHEDULED',
      salesTaxApplicable: taxEval.taxApplicable,
      salesTaxRate: taxEval.rate,
      salesTaxAmount: taxEval.taxAmount,
      totalInvoiceAmount: taxEval.totalAmount,
    };
  }

  /**
   * Completes a cleaning job and automatically posts to:
   * 1. Invoicing (Generates customer invoice)
   * 2. Fiscal (Records Sales Tax Payable liability to the state)
   * 3. Contábil (Generates strictly balanced US GAAP double-entry journal entry with Revenue, Labor COGS, Supplies COGS)
   */
  public static completeCleaningJobAndPostAccounting(
    organizationId: string,
    job: CleaningJobSchedule,
    completionDate: string = new Date().toISOString().split('T')[0],
    isPaidImmediatelyViaCard: boolean = true
  ): {
    completedJob: CleaningJobSchedule;
    journalEntry: CreateJournalEntryInput;
    invoice: InvoiceDTO;
    profitability: {
      totalRevenue: number;
      salesTaxCollected: number;
      directLaborCost: number;
      suppliesCost: number;
      totalCOGS: number;
      grossProfit: number;
      grossMarginPercent: number;
    };
  } {
    // 1. Calculate Total Direct Labor Cost of Cleaners
    let totalLaborDec = new Decimal(0);
    for (const cleaner of job.crew) {
      totalLaborDec = totalLaborDec.plus(
        new Decimal(cleaner.payRatePerHour).times(new Decimal(cleaner.estimatedHours))
      );
    }
    const directLaborCost = parseFloat(totalLaborDec.toFixed(2));
    const suppliesCost = job.estimatedSuppliesCost;
    const totalCOGS = parseFloat(new Decimal(directLaborCost).plus(new Decimal(suppliesCost)).toFixed(2));

    const revenueDec = new Decimal(job.quotedServicePrice);
    const grossProfitDec = revenueDec.minus(new Decimal(totalCOGS));
    const grossMarginPct = parseFloat(grossProfitDec.dividedBy(revenueDec).times(100).toFixed(1));

    // 2. Generate Balanced US GAAP Journal Entry
    // Debit: 1010 Operating Checking (if paid immediately) or 1200 Accounts Receivable ($Total with tax)
    // Debit: 5010 Direct Cleaning Labor Expense ($Labor)
    // Debit: 5020 Cleaning Supplies & Consumables Expense ($Supplies)
    // Credit: 4010 Residential Cleaning Revenue or 4020 Commercial Janitorial Revenue ($Service Price)
    // Credit: 2300 Sales Tax Payable to State ($Tax Amount, if applicable)
    // Credit: 2210 Accrued Cleaner Wages & Payroll Clearing ($Labor)
    // Credit: 1400 Prepaid Cleaning Supplies & Inventory ($Supplies)

    const revenueAccountCode = job.isCommercial ? '4020' : '4010'; // 4020 Commercial, 4010 Residential
    const debitAccountCode = isPaidImmediatelyViaCard ? '1010' : '1200'; // 1010 Bank / 1200 A/R

    const lines = [
      // Revenue & Receivable / Cash
      {
        accountId: debitAccountCode,
        debit: job.totalInvoiceAmount,
        credit: 0,
        description: `Client Billing: ${job.clientName} (${job.serviceType.replace(/_/g, ' ')})`,
      },
      {
        accountId: revenueAccountCode,
        debit: 0,
        credit: job.quotedServicePrice,
        description: `Service Revenue - ${job.propertyAddress}, ${job.city} ${job.stateCode}`,
      },
    ];

    // Sales Tax Line (if applicable)
    if (job.salesTaxApplicable && job.salesTaxAmount > 0) {
      lines.push({
        accountId: '2300', // Sales Tax Payable (Liability)
        debit: 0,
        credit: job.salesTaxAmount,
        description: `Sales Tax Collected (${(job.salesTaxRate * 100).toFixed(2)}% ${job.stateCode} Dept of Revenue)`,
      });
    }

    // Direct Cost of Labor Lines
    if (directLaborCost > 0) {
      lines.push(
        {
          accountId: '5010', // Direct Labor Cost (COGS)
          debit: directLaborCost,
          credit: 0,
          description: `Direct Cleaning Crew Wages (${job.crew.map((c) => c.cleanerName).join(', ')})`,
        },
        {
          accountId: '2210', // Accrued Cleaner Wages Payable
          debit: 0,
          credit: directLaborCost,
          description: `Accrued Cleaner Payroll Liability - Job ${job.id}`,
        }
      );
    }

    // Direct Supplies Expense Lines
    if (suppliesCost > 0) {
      lines.push(
        {
          accountId: '5020', // Cleaning Supplies Expense (COGS)
          debit: suppliesCost,
          credit: 0,
          description: `Chemical Consumables, Liners & Microfiber Used for Job ${job.id}`,
        },
        {
          accountId: '1400', // Prepaid Supplies Inventory / Clearing
          debit: 0,
          credit: suppliesCost,
          description: `Cleaning Supplies Allocation - Job ${job.id}`,
        }
      );
    }

    const journalEntry: CreateJournalEntryInput = {
      organizationId,
      date: new Date(completionDate),
      memo: `Cleaning Job Completed: ${job.id} - ${job.clientName} (${job.propertyAddress})`,
      basis: 'BOTH',
      sourceType: 'CLEANING_JOB_COMPLETION',
      sourceId: job.id,
      lines,
    };

    // 3. Construct Invoice Object
    const invoice: InvoiceDTO = {
      id: `inv-${job.id}`,
      organizationId,
      contactId: `cnt-${job.clientName.toLowerCase().replace(/\s+/g, '-')}`,
      contactName: job.clientName,
      invoiceNumber: `INV-${job.id}`,
      issueDate: completionDate,
      dueDate: completionDate,
      paymentTerm: 'DUE_ON_RECEIPT',
      subtotal: job.quotedServicePrice,
      taxAmount: job.salesTaxAmount,
      totalAmount: job.totalInvoiceAmount,
      amountPaid: isPaidImmediatelyViaCard ? job.totalInvoiceAmount : 0,
      balanceDue: isPaidImmediatelyViaCard ? 0 : job.totalInvoiceAmount,
      status: isPaidImmediatelyViaCard ? 'PAID' : 'ISSUED',
      items: [
        {
          description: `${job.serviceType.replace(/_/g, ' ')} (${job.squareFootage} sq ft) - ${job.propertyAddress}`,
          quantity: 1,
          unitPrice: job.quotedServicePrice,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode,
        },
      ],
      paymentLinkUrl: `https://pay.mistercontabil.com/clean/${job.id}`,
    };

    const completedJob: CleaningJobSchedule = {
      ...job,
      status: 'COMPLETED_POSTED',
      invoiceGeneratedId: invoice.invoiceNumber,
      journalEntryPostedId: `JE-${job.id}`,
      grossProfitAmount: parseFloat(grossProfitDec.toFixed(2)),
      grossProfitMarginPercent: grossMarginPct,
    };

    return {
      completedJob,
      journalEntry,
      invoice,
      profitability: {
        totalRevenue: job.quotedServicePrice,
        salesTaxCollected: job.salesTaxAmount,
        directLaborCost,
        suppliesCost,
        totalCOGS,
        grossProfit: parseFloat(grossProfitDec.toFixed(2)),
        grossMarginPercent: grossMarginPct,
      },
    };
  }
}
