import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from '../accounting/types';
import { InvoiceDTO } from '../accounting/invoicing-service';
import { CleaningServiceEngine } from './cleaning-service-engine';

export interface CleaningTaskItem {
  id: string;
  name: string;
  namePt: string;
  nameEs: string;
  defaultPriceImpact: number;
  defaultMinutesImpact: number;
  isSelected: boolean;
}

export interface ServicePackageTemplate {
  id: string;
  name: string;
  category: 'Combos Promocionais' | 'Pós-Obra & Entrega' | 'Comercial' | 'Especializado' | 'Residencial Padrão';
  description: string;
  billingPrice: number; // Cobrança (A/R)
  laborPayout: number; // Repasse Folha (Mão de Obra)
  suppliesCost: number; // Custo de Insumos
  durationHours: number;
  isCommercial: boolean;
  defaultTasks: string[];
}

export interface ClientReferralCredit {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  accumulatedCreditBalance: number;
  totalReferralsMade: number;
  status: 'DISPONIVEL' | 'APLICADO_NA_PROXIMA_FATURA';
}

export interface SmartCleaningBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyAddress: string;
  city: string;
  stateCode: string;
  zipCode: string;
  servicePackageId: string;
  servicePackageName: string;
  isCommercial: boolean;
  cleanerId: string;
  cleanerName: string;
  cleanerPayRate: number; // Repasse Mão de Obra
  scheduledDate: string;
  startTime: string; // e.g. "09:00"
  durationHours: number;
  endTime: string; // e.g. "11:00"
  // Tasks Checklist
  tasks: CleaningTaskItem[];
  // Member-Get-Member Program
  referredByClientId?: string;
  referredByClientName?: string;
  referralDiscountApplied: number; // Welcome discount for new client (e.g. $20)
  referrerBonusEarned: number; // Bonus credit earned by referrer (e.g. $20)
  // Financial & Tax Summary
  grossPrice: number;
  finalBilledPrice: number;
  laborCost: number;
  suppliesCost: number;
  estimatedMarginAmount: number;
  estimatedMarginPercent: number;
  // Sales Tax
  salesTaxRate: number;
  salesTaxAmount: number;
  totalInvoiceAmountWithTax: number;
  // Execution Status
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO_FATURADO' | 'CANCELADO';
  invoiceNumber?: string;
  journalEntryId?: string;
}

export class SmartCleaningEngine {
  // Default Canonical Task Checklist (Matching user uploaded screenshot)
  public static DEFAULT_TASKS: CleaningTaskItem[] = [
    { id: 'trash', name: 'Trash Removal', namePt: 'Remoção de Lixo', nameEs: 'Eliminación de Basura', defaultPriceImpact: 10, defaultMinutesImpact: 15, isSelected: true },
    { id: 'vacuum', name: 'Vacuuming', namePt: 'Aspiração de Pó', nameEs: 'Aspirado', defaultPriceImpact: 20, defaultMinutesImpact: 20, isSelected: true },
    { id: 'restrooms', name: 'Restrooms', namePt: 'Higienização de Banheiros', nameEs: 'Baños', defaultPriceImpact: 35, defaultMinutesImpact: 30, isSelected: true },
    { id: 'carpet', name: 'Deep Carpet Cleaning', namePt: 'Limpeza Profunda de Carpetes', nameEs: 'Limpieza Profunda de Alfombras', defaultPriceImpact: 60, defaultMinutesImpact: 45, isSelected: false },
    { id: 'windows', name: 'Window Washing', namePt: 'Lavagem de Vidros & Janelas', nameEs: 'Lavado de Ventanas', defaultPriceImpact: 40, defaultMinutesImpact: 30, isSelected: false },
    { id: 'oven', name: 'Oven Cleaning', namePt: 'Limpeza Interna de Fornos', nameEs: 'Limpieza de Hornos', defaultPriceImpact: 35, defaultMinutesImpact: 25, isSelected: false },
    { id: 'dust', name: 'Dust Removal', namePt: 'Espanamento de Superfícies', nameEs: 'Desempolvado', defaultPriceImpact: 15, defaultMinutesImpact: 15, isSelected: false },
    { id: 'floor_polish', name: 'Floor Polishing', namePt: 'Polimento & Enceramento de Piso', nameEs: 'Pulido de Pisos', defaultPriceImpact: 50, defaultMinutesImpact: 40, isSelected: false },
    { id: 'debris', name: 'Debris Clearance', namePt: 'Remoção de Entulho / Pós-Obra', nameEs: 'Remoción de Escombros', defaultPriceImpact: 70, defaultMinutesImpact: 60, isSelected: false },
    { id: 'sanitization', name: 'Sanitization', namePt: 'Sanitização & Desinfecção', nameEs: 'Sanitización', defaultPriceImpact: 45, defaultMinutesImpact: 30, isSelected: false },
    { id: 'mopping', name: 'Mopping', namePt: 'Passagem de Mop & Lavagem de Chão', nameEs: 'Trapeado de Pisos', defaultPriceImpact: 25, defaultMinutesImpact: 20, isSelected: true },
  ];

  // Default Service Packages (Matching user uploaded screenshots)
  public static DEFAULT_PACKAGES: ServicePackageTemplate[] = [
    {
      id: 'pkg-combo-master',
      name: 'Combo Master: Limpeza Geral + Carpetes',
      category: 'Combos Promocionais',
      description: 'Pacote promocional com higienização completa e extração profunda de carpetes',
      billingPrice: 310.00,
      laborPayout: 110.00,
      suppliesCost: 25.00,
      durationHours: 4.0,
      isCommercial: false,
      defaultTasks: ['trash', 'vacuum', 'restrooms', 'carpet', 'mopping', 'dust'],
    },
    {
      id: 'pkg-movein-out',
      name: 'Pacote Move-In / Move-Out Premium',
      category: 'Pós-Obra & Entrega',
      description: 'Higienização total detalhada para entrega ou entrada em imóveis',
      billingPrice: 380.00,
      laborPayout: 140.00,
      suppliesCost: 30.00,
      durationHours: 5.0,
      isCommercial: false,
      defaultTasks: ['trash', 'vacuum', 'restrooms', 'oven', 'windows', 'mopping', 'sanitization'],
    },
    {
      id: 'pkg-commercial-janitorial',
      name: 'Manutenção Comercial Corporativa',
      category: 'Comercial',
      description: 'Limpeza e desinfecção periódica de escritórios e áreas empresariais',
      billingPrice: 220.00,
      laborPayout: 75.00,
      suppliesCost: 20.00,
      durationHours: 3.0,
      isCommercial: true,
      defaultTasks: ['trash', 'vacuum', 'restrooms', 'sanitization', 'mopping'],
    },
    {
      id: 'pkg-windows',
      name: 'Lavagem Técnica de Janelas & Vidraças',
      category: 'Especializado',
      description: 'Limpeza de fachadas, esquadrias e vidros com acabamento sem marcas',
      billingPrice: 160.00,
      laborPayout: 60.00,
      suppliesCost: 15.00,
      durationHours: 2.5,
      isCommercial: true,
      defaultTasks: ['windows', 'dust'],
    },
    {
      id: 'pkg-standard-residential',
      name: 'Standard Home Cleaning (2h)',
      category: 'Residencial Padrão',
      description: 'Limpeza residencial de rotina para manutenção doméstica',
      billingPrice: 150.00,
      laborPayout: 50.00,
      suppliesCost: 12.00,
      durationHours: 2.0,
      isCommercial: false,
      defaultTasks: ['trash', 'vacuum', 'restrooms', 'mopping'],
    },
  ];

  /**
   * Calculates End Time given Start Time and Duration in Hours
   */
  public static calculateEndTime(startTime: string, durationHours: number): string {
    const [hStr, mStr] = startTime.split(':');
    const startMinutes = (parseInt(hStr) || 9) * 60 + (parseInt(mStr) || 0);
    const endMinutes = startMinutes + Math.round(durationHours * 60);

    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  }

  /**
   * Evaluates Price, Labor Payout, Referral Discounts and Margin
   */
  public static calculateBookingFinancials(
    basePrice: number,
    baseLaborPayout: number,
    suppliesCost: number,
    referralDiscount: number,
    stateCode: string,
    isCommercial: boolean
  ): {
    grossPrice: number;
    discountApplied: number;
    finalBilledPrice: number;
    laborCost: number;
    suppliesCost: number;
    totalCOGS: number;
    estimatedMarginAmount: number;
    estimatedMarginPercent: number;
    salesTaxRate: number;
    salesTaxAmount: number;
    totalWithTax: number;
  } {
    const grossDec = new Decimal(basePrice);
    const discDec = new Decimal(referralDiscount);
    const finalBilledDec = Decimal.max(0, grossDec.minus(discDec));

    const laborDec = new Decimal(baseLaborPayout);
    const suppliesDec = new Decimal(suppliesCost);
    const totalCogsDec = laborDec.plus(suppliesDec);

    const marginAmountDec = finalBilledDec.minus(totalCogsDec);
    const marginPct = finalBilledDec.greaterThan(0)
      ? parseFloat(marginAmountDec.dividedBy(finalBilledDec).times(100).toFixed(1))
      : 0;

    // Sales Tax
    const taxEval = CleaningServiceEngine.evaluateCleaningSalesTax(
      stateCode,
      isCommercial,
      finalBilledDec.toNumber()
    );

    return {
      grossPrice: parseFloat(grossDec.toFixed(2)),
      discountApplied: parseFloat(discDec.toFixed(2)),
      finalBilledPrice: parseFloat(finalBilledDec.toFixed(2)),
      laborCost: parseFloat(laborDec.toFixed(2)),
      suppliesCost: parseFloat(suppliesDec.toFixed(2)),
      totalCOGS: parseFloat(totalCogsDec.toFixed(2)),
      estimatedMarginAmount: parseFloat(marginAmountDec.toFixed(2)),
      estimatedMarginPercent: marginPct,
      salesTaxRate: taxEval.rate,
      salesTaxAmount: taxEval.taxAmount,
      totalWithTax: taxEval.totalAmount,
    };
  }

  /**
   * Completes a Smart Cleaning Booking and generates:
   * 1. Official Fiscal Customer Invoice with Sales Tax & Referral breakdown
   * 2. Balanced US GAAP Journal Entry (Double-Entry Ledger)
   * 3. Accumulates Cleaner Wage in Payroll Engine
   * 4. Credits Referrer Wallet in Member-Get-Member Program
   */
  public static executeBookingCompletion(
    organizationId: string,
    booking: SmartCleaningBooking,
    completionDate: string = new Date().toISOString().split('T')[0]
  ): {
    completedBooking: SmartCleaningBooking;
    journalEntry: CreateJournalEntryInput;
    invoice: InvoiceDTO;
    updatedReferrerWallet?: ClientReferralCredit;
  } {
    const revenueAccountCode = booking.isCommercial ? '4020' : '4010'; // 4020 Commercial, 4010 Residential

    // 1. Build Balanced US GAAP Journal Entry Lines
    const lines = [
      // Debit Bank (Cash on file / Stripe)
      {
        accountId: '1010', // Operating Checking
        debit: booking.totalInvoiceAmountWithTax,
        credit: 0,
        description: `Settlement via Card/Bank: ${booking.clientName} (${booking.servicePackageName})`,
      },
      // Credit Revenue (Gross or Net of discount)
      {
        accountId: revenueAccountCode,
        debit: 0,
        credit: booking.grossPrice,
        description: `Cleaning Service Revenue - ${booking.propertyAddress}, ${booking.city} ${booking.stateCode}`,
      },
    ];

    // Referral Discount promotional expense line
    if (booking.referralDiscountApplied > 0) {
      lines.push({
        accountId: '6200', // Marketing & Referral Promotion Expense
        debit: booking.referralDiscountApplied,
        credit: 0,
        description: `Member-Get-Member Referral Welcome Discount for ${booking.clientName}`,
      });
    }

    // Sales Tax Liability Line
    if (booking.salesTaxAmount > 0) {
      lines.push({
        accountId: '2300', // Sales Tax Payable (Liability)
        debit: 0,
        credit: booking.salesTaxAmount,
        description: `Sales Tax Collected (${(booking.salesTaxRate * 100).toFixed(2)}% ${booking.stateCode} Dept of Revenue)`,
      });
    }

    // Direct Labor Line (Repasse da Faxina)
    if (booking.laborCost > 0) {
      lines.push(
        {
          accountId: '5010', // Direct Cleaning Labor Wages
          debit: booking.laborCost,
          credit: 0,
          description: `Direct Cleaner Labor Wages (${booking.cleanerName})`,
        },
        {
          accountId: '2210', // Accrued Cleaner Wages Payable
          debit: 0,
          credit: booking.laborCost,
          description: `Cleaner Wage Accrual - Booking ${booking.id}`,
        }
      );
    }

    // Supplies Line
    if (booking.suppliesCost > 0) {
      lines.push(
        {
          accountId: '5020', // Cleaning Supplies Expense
          debit: booking.suppliesCost,
          credit: 0,
          description: `Cleaning Supplies Allocation for ${booking.id}`,
        },
        {
          accountId: '1400', // Prepaid Supplies Inventory
          debit: 0,
          credit: booking.suppliesCost,
          description: `Consumables Dispensed - Booking ${booking.id}`,
        }
      );
    }

    const journalEntry: CreateJournalEntryInput = {
      organizationId,
      date: new Date(completionDate),
      memo: `Cleaning Service Completed & Invoiced: ${booking.id} (${booking.clientName})`,
      basis: 'BOTH',
      sourceType: 'SMART_CLEANING_COMPLETION',
      sourceId: booking.id,
      lines,
    };

    // 2. Build Invoice
    const invoice: InvoiceDTO = {
      id: `inv-${booking.id}`,
      organizationId,
      contactId: booking.clientId,
      contactName: booking.clientName,
      invoiceNumber: `INV-${booking.id}`,
      issueDate: completionDate,
      dueDate: completionDate,
      paymentTerm: 'DUE_ON_RECEIPT',
      subtotal: booking.finalBilledPrice,
      taxAmount: booking.salesTaxAmount,
      totalAmount: booking.totalInvoiceAmountWithTax,
      amountPaid: booking.totalInvoiceAmountWithTax,
      balanceDue: 0,
      status: 'PAID',
      items: [
        {
          description: `${booking.servicePackageName} - ${booking.propertyAddress}`,
          quantity: 1,
          unitPrice: booking.finalBilledPrice,
          pricingModel: 'FIXED_FEE',
          revenueAccountCode,
        },
      ],
      paymentLinkUrl: `https://pay.mistercontabil.com/clean/${booking.id}`,
    };

    // 3. Update Referrer Wallet if applicable
    let updatedReferrerWallet: ClientReferralCredit | undefined = undefined;
    if (booking.referredByClientId && booking.referrerBonusEarned > 0) {
      updatedReferrerWallet = {
        clientId: booking.referredByClientId,
        clientName: booking.referredByClientName || 'Cliente Indicador',
        clientEmail: 'referrer@email.com',
        clientPhone: '(555) 000-0000',
        accumulatedCreditBalance: booking.referrerBonusEarned,
        totalReferralsMade: 1,
        status: 'APLICADO_NA_PROXIMA_FATURA',
      };
    }

    const completedBooking: SmartCleaningBooking = {
      ...booking,
      status: 'CONCLUIDO_FATURADO',
      invoiceNumber: invoice.invoiceNumber,
      journalEntryId: `JE-${booking.id}`,
    };

    return {
      completedBooking,
      journalEntry,
      invoice,
      updatedReferrerWallet,
    };
  }
}
