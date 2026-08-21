import { z } from 'zod';
import Decimal from 'decimal.js';

export type ClientClassification = 'RESIDENTIAL' | 'COMMERCIAL_CORPORATE' | 'GOVERNMENT_NONPROFIT';
export type WorkerClassification = 'W2_FULL_TIME' | 'W2_PART_TIME' | '1099_CONTRACTOR';
export type VendorCategory = 'SUPPLIES_CHEMICALS' | 'EQUIPMENT_HARDWARE' | 'INSURANCE' | 'SOFTWARE_IT' | 'PROFESSIONAL_LEGAL' | 'UTILITIES';

export interface ClientEntity {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  serviceAddress: string;
  city: string;
  stateCode: string;
  zipCode: string;
  classification: ClientClassification;
  isTaxExempt: boolean;
  taxExemptionCertificateNumber?: string;
  paymentTerms: 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30';
  currentBalanceDue: number;
  referralCreditBalance: number;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface WorkerEntity {
  id: string;
  legalName: string;
  preferredName?: string;
  email: string;
  phone: string;
  ssnOrTinMasked: string;
  classification: WorkerClassification;
  roleTitle: string;
  department: 'CLEANING_FIELD_CREW' | 'OPERATIONS' | 'MANAGEMENT' | 'ENGINEERING';
  payModel: 'HOURLY' | 'PER_JOB_FLAT' | 'ANNUAL_SALARY';
  basePayRate: number; // e.g. $24/hr or $75/job
  workState: string; // 'TX', 'NY', 'FL', 'CA'
  hireDate: string;
  bankRoutingNumberMasked?: string;
  bankAccountNumberMasked?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  ptoBalanceHours: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface VendorEntity {
  id: string;
  companyName: string;
  taxIdOrEin: string;
  category: VendorCategory;
  contactPerson: string;
  email: string;
  phone: string;
  remittanceAddress: string;
  city: string;
  stateCode: string;
  zipCode: string;
  paymentTerms: 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30' | 'NET_60';
  defaultExpenseAccountCode: string; // e.g. '5020' Supplies or '6100' Office
  is1099Eligible: boolean; // Tracks for annual 1099-NEC/MISC filing
  ytdSpendAmount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export class EntityDirectoryEngine {
  public static INITIAL_CLIENTS: ClientEntity[] = [
    {
      id: 'cnt-acme',
      name: 'Austin Tech Hub Suites',
      contactPerson: 'Marcus Vance (Facilities Director)',
      email: 'facilities@austintechhub.io',
      phone: '(512) 555-0192',
      billingAddress: '401 Congress Ave, Suite 1200',
      serviceAddress: '401 Congress Ave, Suite 1200',
      city: 'Austin',
      stateCode: 'TX',
      zipCode: '78701',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 450.00,
      referralCreditBalance: 0,
      createdAt: '2026-01-15',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-harrison',
      name: 'Dr. Robert Harrison',
      contactPerson: 'Dr. Robert Harrison',
      email: 'dr.harrison@gmail.com',
      phone: '(305) 555-4819',
      billingAddress: '1240 Ocean Drive, Penthouse 4',
      serviceAddress: '1240 Ocean Drive, Penthouse 4',
      city: 'Miami Beach',
      stateCode: 'FL',
      zipCode: '33139',
      classification: 'RESIDENTIAL',
      isTaxExempt: false,
      paymentTerms: 'DUE_ON_RECEIPT',
      currentBalanceDue: 0,
      referralCreditBalance: 40.00,
      createdAt: '2026-02-10',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-soho',
      name: 'SoHo Design Agency',
      contactPerson: 'Chloe Laurent (Creative Ops)',
      email: 'admin@sohodesign.ny',
      phone: '(212) 555-8831',
      billingAddress: '540 Broadway, 3rd Floor',
      serviceAddress: '540 Broadway, 3rd Floor',
      city: 'New York',
      stateCode: 'NY',
      zipCode: '10012',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_15',
      currentBalanceDue: 0,
      referralCreditBalance: 20.00,
      createdAt: '2026-03-01',
      status: 'ACTIVE',
    },
  ];

  public static INITIAL_WORKERS: WorkerEntity[] = [
    {
      id: 'wrk-001',
      legalName: 'Maria Santos',
      preferredName: 'Maria',
      email: 'maria.santos@uas-team.com',
      phone: '(512) 555-7721',
      ssnOrTinMasked: '•••-••-4819',
      classification: 'W2_FULL_TIME',
      roleTitle: 'Senior Field Cleaner & Crew Lead',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'HOURLY',
      basePayRate: 24.00,
      workState: 'TX',
      hireDate: '2026-01-05',
      bankRoutingNumberMasked: '••••0210',
      bankAccountNumberMasked: '••••8841',
      emergencyContactName: 'Jose Santos (Husband)',
      emergencyContactPhone: '(512) 555-7720',
      ptoBalanceHours: 40,
      status: 'ACTIVE',
    },
    {
      id: 'wrk-002',
      legalName: 'Carlos Gomez',
      preferredName: 'Carlos',
      email: 'carlos.gomez@uas-team.com',
      phone: '(512) 555-9932',
      ssnOrTinMasked: '•••-••-6231',
      classification: 'W2_FULL_TIME',
      roleTitle: 'Commercial Floor & Carpet Specialist',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'HOURLY',
      basePayRate: 22.00,
      workState: 'TX',
      hireDate: '2026-01-12',
      bankRoutingNumberMasked: '••••0210',
      bankAccountNumberMasked: '••••4102',
      emergencyContactName: 'Elena Gomez (Sister)',
      emergencyContactPhone: '(512) 555-9930',
      ptoBalanceHours: 32,
      status: 'ACTIVE',
    },
    {
      id: 'wrk-003',
      legalName: 'Ana Silva',
      preferredName: 'Ana',
      email: 'ana.silva@contractor.io',
      phone: '(305) 555-3341',
      ssnOrTinMasked: '•••-••-9081',
      classification: '1099_CONTRACTOR',
      roleTitle: 'Residential Deep Clean Specialist (1099)',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'PER_JOB_FLAT',
      basePayRate: 60.00, // $60 flat per standard residential clean
      workState: 'FL',
      hireDate: '2026-02-01',
      emergencyContactName: 'Paulo Silva (Brother)',
      emergencyContactPhone: '(305) 555-3340',
      ptoBalanceHours: 0,
      status: 'ACTIVE',
    },
  ];

  public static INITIAL_VENDORS: VendorEntity[] = [
    {
      id: 'vnd-001',
      companyName: 'Ecolab Professional Commercial Cleaning Solutions',
      taxIdOrEin: 'XX-XXX4190',
      category: 'SUPPLIES_CHEMICALS',
      contactPerson: 'David Miller',
      email: 'orders@ecolab-supply.com',
      phone: '(800) 555-3265',
      remittanceAddress: '1 Ecolab Place',
      city: 'St. Paul',
      stateCode: 'MN',
      zipCode: '55102',
      paymentTerms: 'NET_30',
      defaultExpenseAccountCode: '5020', // Cleaning Supplies & Consumables
      is1099Eligible: false, // Corporation
      ytdSpendAmount: 8450.00,
      status: 'ACTIVE',
    },
    {
      id: 'vnd-002',
      companyName: 'Grainger Industrial Janitorial & Safety Equipment',
      taxIdOrEin: 'XX-XXX8812',
      category: 'EQUIPMENT_HARDWARE',
      contactPerson: 'Sarah Lin',
      email: 'enterprise@grainger.com',
      phone: '(800) 555-4724',
      remittanceAddress: '100 Grainger Pkwy',
      city: 'Lake Forest',
      stateCode: 'IL',
      zipCode: '60045',
      paymentTerms: 'NET_30',
      defaultExpenseAccountCode: '1510', // Fixed Assets / Equipment
      is1099Eligible: false,
      ytdSpendAmount: 14200.00,
      status: 'ACTIVE',
    },
    {
      id: 'vnd-003',
      companyName: 'Liberty Mutual Commercial Liability Insurance',
      taxIdOrEin: 'XX-XXX9931',
      category: 'INSURANCE',
      contactPerson: 'Underwriting Dept',
      email: 'billing@libertymutual.com',
      phone: '(800) 555-5423',
      remittanceAddress: '175 Berkeley St',
      city: 'Boston',
      stateCode: 'MA',
      zipCode: '02116',
      paymentTerms: 'NET_30',
      defaultExpenseAccountCode: '6300', // Insurance Expense
      is1099Eligible: false,
      ytdSpendAmount: 4800.00,
      status: 'ACTIVE',
    },
  ];

  /**
   * Helper to create a new client
   */
  public static createClient(input: Omit<ClientEntity, 'id' | 'createdAt' | 'currentBalanceDue' | 'referralCreditBalance'>): ClientEntity {
    return {
      ...input,
      id: `cnt-${Math.floor(100000 + Math.random() * 900000)}`,
      currentBalanceDue: 0,
      referralCreditBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  /**
   * Helper to create a new worker
   */
  public static createWorker(input: Omit<WorkerEntity, 'id' | 'ptoBalanceHours'>): WorkerEntity {
    return {
      ...input,
      id: `wrk-${Math.floor(100000 + Math.random() * 900000)}`,
      ptoBalanceHours: input.classification.startsWith('W2') ? 40 : 0,
    };
  }

  /**
   * Helper to create a new vendor
   */
  public static createVendor(input: Omit<VendorEntity, 'id' | 'ytdSpendAmount'>): VendorEntity {
    return {
      ...input,
      id: `vnd-${Math.floor(100000 + Math.random() * 900000)}`,
      ytdSpendAmount: 0,
    };
  }
}
