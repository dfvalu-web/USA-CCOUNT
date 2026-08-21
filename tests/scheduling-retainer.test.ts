import { describe, it, expect } from 'vitest';
import { TimeTrackingEngine, ClientRetainerAccount, TimeEntryDTO } from '../src/lib/scheduling/time-tracking-engine';
import { RetainerAmortizationEngine } from '../src/lib/scheduling/retainer-amortization-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('Scheduling, Time Tracking & Retainer Amortization (ASC 606)', () => {
  it('should calculate billable metrics and utilization rate correctly', () => {
    const timeEntries: TimeEntryDTO[] = [
      {
        id: '1',
        clientId: 'c-1',
        clientName: 'Acme',
        projectId: 'p-1',
        projectName: 'Cloud Dev',
        workerId: 'w-1',
        workerName: 'Sarah',
        date: '2026-08-18',
        hours: 40,
        hourlyRate: 200,
        isBillable: true,
        description: 'Terraform setup',
        status: 'APPROVED',
      },
      {
        id: '2',
        clientId: 'c-1',
        clientName: 'Acme',
        projectId: 'p-1',
        projectName: 'Internal Meeting',
        workerId: 'w-1',
        workerName: 'Sarah',
        date: '2026-08-19',
        hours: 10,
        hourlyRate: 0,
        isBillable: false,
        description: 'Sprint planning',
        status: 'APPROVED',
      },
    ];

    const metrics = TimeTrackingEngine.calculateBillableTotal(timeEntries);
    expect(metrics.totalHours).toBe(50);
    expect(metrics.billableHours).toBe(40);
    expect(metrics.nonBillableHours).toBe(10);
    expect(metrics.utilizationRate).toBe(80); // 40/50 = 80%
    expect(metrics.totalAmount).toBe(8000); // 40 * 200
  });

  it('should amortize retainer and generate a balanced journal entry (DR 2100 / CR 4030)', () => {
    const retainer: ClientRetainerAccount = {
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      totalRetainerDeposited: 15000,
      unearnedBalanceRemaining: 15000,
      totalAmortizedToDate: 0,
      monthlyAllocationAmount: 15000,
      effectiveHourlyRate: 250,
    };

    const timeEntries: TimeEntryDTO[] = [
      {
        id: '1',
        clientId: 'c-1',
        clientName: 'Acme Global Corp',
        projectId: 'p-1',
        projectName: 'Cloud Dev',
        workerId: 'w-1',
        workerName: 'Sarah',
        date: '2026-08-18',
        hours: 40, // 40 * 250 = $10,000
        hourlyRate: 250,
        isBillable: true,
        description: 'Cloud Modernization',
        status: 'APPROVED',
      },
    ];

    const result = RetainerAmortizationEngine.amortizeRetainerForPeriod(
      '11111111-1111-1111-1111-111111111111',
      retainer,
      timeEntries,
      '2026-08-20'
    );

    expect(result.totalTimeValue).toBe(10000);
    expect(result.amortizedFromRetainer).toBe(10000);
    expect(result.remainingRetainerBalance).toBe(5000); // 15000 - 10000
    expect(result.overageToInvoice).toBe(0);

    const validation = DoubleEntryLedgerEngine.validateJournalEntry(result.journalEntry);
    expect(validation.isValid).toBe(true);
    expect(result.journalEntry.lines[0].accountId).toBe('2100'); // DR 2100 Unearned Revenue
    expect(result.journalEntry.lines[0].debit).toBe(10000);
    expect(result.journalEntry.lines[1].accountId).toBe('4030'); // CR 4030 Retainer Revenue
    expect(result.journalEntry.lines[1].credit).toBe(10000);
  });

  it('should detect overage when billable hours exceed retainer balance', () => {
    const retainer: ClientRetainerAccount = {
      clientId: 'c-1',
      clientName: 'Acme Global Corp',
      totalRetainerDeposited: 5000,
      unearnedBalanceRemaining: 5000,
      totalAmortizedToDate: 0,
      monthlyAllocationAmount: 5000,
      effectiveHourlyRate: 250,
    };

    const timeEntries: TimeEntryDTO[] = [
      {
        id: '1',
        clientId: 'c-1',
        clientName: 'Acme Global Corp',
        projectId: 'p-1',
        projectName: 'Cloud Dev',
        workerId: 'w-1',
        workerName: 'Sarah',
        date: '2026-08-18',
        hours: 32, // 32 * 250 = $8,000 (Exceeds $5,000 retainer by $3,000)
        hourlyRate: 250,
        isBillable: true,
        description: 'Full migration',
        status: 'APPROVED',
      },
    ];

    const result = RetainerAmortizationEngine.amortizeRetainerForPeriod(
      '11111111-1111-1111-1111-111111111111',
      retainer,
      timeEntries,
      '2026-08-20'
    );

    expect(result.amortizedFromRetainer).toBe(5000);
    expect(result.remainingRetainerBalance).toBe(0);
    expect(result.overageToInvoice).toBe(3000);
  });
});
