import { describe, it, expect } from 'vitest';
import { EntityDirectoryEngine } from '../src/lib/directory/entity-directory-engine';

describe('EntityDirectoryEngine (Clientes, Funcionários & Fornecedores)', () => {
  it('should initialize canonical entities for clients, workers and vendors', () => {
    expect(EntityDirectoryEngine.INITIAL_CLIENTS.length).toBeGreaterThanOrEqual(3);
    expect(EntityDirectoryEngine.INITIAL_WORKERS.length).toBeGreaterThanOrEqual(3);
    expect(EntityDirectoryEngine.INITIAL_VENDORS.length).toBeGreaterThanOrEqual(3);
  });

  it('should create a new client with active status and zero initial balance', () => {
    const client = EntityDirectoryEngine.createClient({
      name: 'Beacon Hill Dental Clinic',
      contactPerson: 'Dr. Emily Watson',
      email: 'office@beaconhill.com',
      phone: '(617) 555-0144',
      billingAddress: '150 Tremont St',
      serviceAddress: '150 Tremont St',
      city: 'Boston',
      stateCode: 'MA',
      zipCode: '02111',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      status: 'ACTIVE',
    });

    expect(client.id).toContain('cnt-');
    expect(client.currentBalanceDue).toBe(0);
    expect(client.referralCreditBalance).toBe(0);
    expect(client.status).toBe('ACTIVE');
  });

  it('should create a new worker with correct PTO allocation based on W2 status', () => {
    const w2Worker = EntityDirectoryEngine.createWorker({
      legalName: 'Lucia Ferreira',
      email: 'lucia@uas-team.com',
      phone: '(512) 555-8822',
      ssnOrTinMasked: '•••-••-9921',
      classification: 'W2_FULL_TIME',
      roleTitle: 'Cleaning Supervisor',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'HOURLY',
      basePayRate: 26.00,
      workState: 'TX',
      hireDate: '2026-08-01',
      emergencyContactName: 'Tiago Ferreira',
      emergencyContactPhone: '(512) 555-8820',
      status: 'ACTIVE',
    });

    expect(w2Worker.ptoBalanceHours).toBe(40); // 40h initial PTO for full-time

    const contractorWorker = EntityDirectoryEngine.createWorker({
      legalName: 'Mateo Rossi (1099)',
      email: 'mateo@contractor.io',
      phone: '(512) 555-1100',
      ssnOrTinMasked: '•••-••-3310',
      classification: '1099_CONTRACTOR',
      roleTitle: 'Floor Specialist',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'PER_JOB_FLAT',
      basePayRate: 75.00,
      workState: 'TX',
      hireDate: '2026-08-01',
      emergencyContactName: 'Sofia Rossi',
      emergencyContactPhone: '(512) 555-1101',
      status: 'ACTIVE',
    });

    expect(contractorWorker.ptoBalanceHours).toBe(0); // 1099 has no PTO
  });

  it('should create a vendor with default expense account mapping', () => {
    const vendor = EntityDirectoryEngine.createVendor({
      companyName: 'Cintas Facility Services',
      taxIdOrEin: 'XX-XXX3910',
      category: 'SUPPLIES_CHEMICALS',
      contactPerson: 'Corporate Sales',
      email: 'sales@cintas.com',
      phone: '(800) 555-8899',
      remittanceAddress: '6800 Cintas Blvd',
      city: 'Mason',
      stateCode: 'OH',
      zipCode: '45040',
      paymentTerms: 'NET_30',
      defaultExpenseAccountCode: '5020',
      is1099Eligible: false,
      status: 'ACTIVE',
    });

    expect(vendor.defaultExpenseAccountCode).toBe('5020');
    expect(vendor.ytdSpendAmount).toBe(0);
  });
});
