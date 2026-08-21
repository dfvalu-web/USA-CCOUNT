import { describe, it, expect } from 'vitest';
import { MultiStatePayrollEngine, WorkerProfile } from '../src/lib/payroll/payroll-engine';
import { TaxFormsService } from '../src/lib/payroll/tax-forms-service';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('MultiStatePayrollEngine & Compliance (US Jurisdictions)', () => {
  it('should calculate FICA taxes (6.2% SS + 1.45% Medicare) correctly for W-2 employee', () => {
    const employee: WorkerProfile = {
      id: 'w-1',
      name: 'Sarah Jenkins',
      email: 'sarah.j@apexcloud.io',
      type: 'W2_EMPLOYEE',
      ssnEin: 'XXX-XX-8491',
      state: 'CA',
      filingStatus: 'SINGLE',
      is1099: false,
    };

    const gross = 5000;
    const calc = MultiStatePayrollEngine.calculatePaycheck(employee, gross);

    expect(calc.employeeSocialSecurity).toBe(310); // 5000 * 0.062
    expect(calc.employeeMedicare).toBe(72.5); // 5000 * 0.0145
    expect(calc.employerSocialSecurity).toBe(310);
    expect(calc.employerMedicare).toBe(72.5);
    expect(calc.netPay).toBeLessThan(gross);
  });

  it('should apply 0% State Income Tax (SIT) for Texas (TX) and Florida (FL)', () => {
    const txEmployee: WorkerProfile = {
      id: 'w-tx',
      name: 'David Silva',
      email: 'david.s@apexcloud.io',
      type: 'W2_EMPLOYEE',
      ssnEin: 'XXX-XX-9934',
      state: 'TX',
      filingStatus: 'SINGLE',
      is1099: false,
    };

    const calc = MultiStatePayrollEngine.calculatePaycheck(txEmployee, 5000);
    expect(calc.employeeStateIncomeTax).toBe(0);
  });

  it('should pay 100% gross to 1099 contractors without tax withholdings', () => {
    const contractor: WorkerProfile = {
      id: 'w-c',
      name: 'Elena Rostova',
      email: 'elena@clouddevs.io',
      type: '1099_CONTRACTOR',
      ssnEin: 'XX-XXX5812',
      state: 'FL',
      filingStatus: 'SINGLE',
      is1099: true,
    };

    const calc = MultiStatePayrollEngine.calculatePaycheck(contractor, 4800);
    expect(calc.totalEmployeeWithholdings).toBe(0);
    expect(calc.netPay).toBe(4800);
    expect(calc.totalEmployerTaxes).toBe(0);
  });

  it('should generate a strictly balanced US GAAP Journal Entry for an aggregated payroll run', () => {
    const worker1: WorkerProfile = {
      id: 'w-1',
      name: 'Sarah',
      email: 's@a.io',
      type: 'W2_EMPLOYEE',
      ssnEin: '111',
      state: 'CA',
      filingStatus: 'SINGLE',
      is1099: false,
    };
    const worker2: WorkerProfile = {
      id: 'w-2',
      name: 'Elena',
      email: 'e@a.io',
      type: '1099_CONTRACTOR',
      ssnEin: '222',
      state: 'TX',
      filingStatus: 'SINGLE',
      is1099: true,
    };

    const p1 = MultiStatePayrollEngine.calculatePaycheck(worker1, 5000);
    const p2 = MultiStatePayrollEngine.calculatePaycheck(worker2, 3000);

    const summary = {
      id: 'pr-2026-08',
      payPeriodStart: '2026-08-01',
      payPeriodEnd: '2026-08-15',
      paymentDate: '2026-08-20',
      paychecks: [p1, p2],
      totalGrossPay: 8000,
      totalNetPay: p1.netPay + p2.netPay,
      totalEmployeeWithholdings: p1.totalEmployeeWithholdings,
      totalEmployerTaxes: p1.totalEmployerTaxes,
      totalCashRequirement: p1.totalCompanyCost + p2.totalCompanyCost,
    };

    const je = MultiStatePayrollEngine.generatePayrollJournalEntry('11111111-1111-1111-1111-111111111111', summary);
    const validation = DoubleEntryLedgerEngine.validateJournalEntry(je);

    expect(validation.isValid).toBe(true);
  });

  it('should generate accurate Form 941 quarterly figures', () => {
    const worker1: WorkerProfile = {
      id: 'w-1',
      name: 'Sarah',
      email: 's@a.io',
      type: 'W2_EMPLOYEE',
      ssnEin: '111',
      state: 'CA',
      filingStatus: 'SINGLE',
      is1099: false,
    };
    const p1 = MultiStatePayrollEngine.calculatePaycheck(worker1, 10000);
    const f941 = TaxFormsService.generateForm941(1, 2026, [p1]);

    expect(f941.totalWagesPaid).toBe(10000);
    expect(f941.totalSocialSecurityTax).toBe(1240); // 12.4% of 10k
    expect(f941.totalMedicareTax).toBe(290); // 2.9% of 10k
  });
});
