import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from '../accounting/types';
import { TimeEntryDTO, ClientRetainerAccount } from './time-tracking-engine';

export interface AmortizationResult {
  clientId: string;
  clientName: string;
  totalTimeValue: number;
  amortizedFromRetainer: number;
  remainingRetainerBalance: number;
  overageToInvoice: number;
  journalEntry: CreateJournalEntryInput;
}

export class RetainerAmortizationEngine {
  /**
   * ASC 606 Revenue Recognition: Automatically amortizes earned hours from Unearned Revenue (Retainer)
   * Debit: 2100 Unearned Revenue / Client Retainers ($Amortized)
   * Credit: 4030 Retainer Revenue ($Amortized)
   */
  public static amortizeRetainerForPeriod(
    organizationId: string,
    retainer: ClientRetainerAccount,
    approvedTimeEntries: TimeEntryDTO[],
    periodEndDate: string
  ): AmortizationResult {
    let totalTimeValueDec = new Decimal(0);

    for (const e of approvedTimeEntries) {
      if (e.isBillable && e.clientId === retainer.clientId) {
        totalTimeValueDec = totalTimeValueDec.plus(new Decimal(e.hours).times(new Decimal(e.hourlyRate)));
      }
    }

    const currentBalanceDec = new Decimal(retainer.unearnedBalanceRemaining);

    // Amortize up to current retainer balance
    const amortizedDec = Decimal.min(totalTimeValueDec, currentBalanceDec);
    const newBalanceDec = currentBalanceDec.minus(amortizedDec);
    const overageDec = Decimal.max(0, totalTimeValueDec.minus(amortizedDec));

    // Construct Balanced Journal Entry
    const journalEntry: CreateJournalEntryInput = {
      organizationId,
      date: new Date(periodEndDate),
      memo: `ASC 606 Retainer Amortization - ${retainer.clientName} (Period ending ${periodEndDate})`,
      basis: 'ACCRUAL',
      sourceType: 'RETAINER_AMORTIZATION',
      sourceId: retainer.clientId,
      lines: [
        {
          accountId: '2100', // Unearned Revenue (Liability) - Debit decreases liability
          debit: amortizedDec.toNumber(),
          credit: 0,
          description: `Retainer liability recognized into revenue for ${retainer.clientName}`,
          contactId: retainer.clientId,
        },
        {
          accountId: '4030', // Retainer Revenue - Credit increases revenue
          debit: 0,
          credit: amortizedDec.toNumber(),
          description: `Earned Retainer Service Revenue (${approvedTimeEntries.length} time entries)`,
          contactId: retainer.clientId,
        },
      ],
    };

    return {
      clientId: retainer.clientId,
      clientName: retainer.clientName,
      totalTimeValue: totalTimeValueDec.toNumber(),
      amortizedFromRetainer: amortizedDec.toNumber(),
      remainingRetainerBalance: newBalanceDec.toNumber(),
      overageToInvoice: overageDec.toNumber(),
      journalEntry,
    };
  }
}
