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
  workState: string; // 'TX', 'NY', 'FL', 'CA', 'GA'
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
  public static MILLA_MAID_CLIENTS: ClientEntity[] = [
    {
      id: 'cnt-mill-01',
      name: 'Buckhead Luxury Condominiums',
      contactPerson: 'Sarah Jenkins (Property Manager)',
      email: 'management@buckheadluxury.com',
      phone: '(404) 555-8910',
      billingAddress: '3344 Peachtree Rd NE, Suite 1500',
      serviceAddress: '3344 Peachtree Rd NE',
      city: 'Atlanta',
      stateCode: 'GA',
      zipCode: '30326',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 8450.00,
      referralCreditBalance: 0,
      createdAt: '2022-02-15',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-mill-02',
      name: 'Midtown Medical & Dental Plaza',
      contactPerson: 'Dr. Evelyn Reed (Admin Director)',
      email: 'admin@midtownmedplaza.ga',
      phone: '(404) 555-3321',
      billingAddress: '1080 Peachtree St NE',
      serviceAddress: '1080 Peachtree St NE',
      city: 'Atlanta',
      stateCode: 'GA',
      zipCode: '30309',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 12800.00,
      referralCreditBalance: 0,
      createdAt: '2023-01-10',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-mill-03',
      name: 'Doraville Commercial Center',
      contactPerson: 'Carlos Martinez (Facilities Ops)',
      email: 'facilities@doravillecenter.com',
      phone: '(770) 555-6490',
      billingAddress: '2300 Global Forum Blvd, Suite 200',
      serviceAddress: '2300 Global Forum Blvd',
      city: 'Doraville',
      stateCode: 'GA',
      zipCode: '30340',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_15',
      currentBalanceDue: 6400.00,
      referralCreditBalance: 50.00,
      createdAt: '2023-06-20',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-mill-04',
      name: 'Dr. Robert Harrison (Residential Estate)',
      contactPerson: 'Dr. Robert Harrison',
      email: 'dr.harrison@gmail.com',
      phone: '(404) 555-4819',
      billingAddress: '8191 Colquitt Rd, Penthouse F',
      serviceAddress: '8191 Colquitt Rd, Penthouse F',
      city: 'Atlanta',
      stateCode: 'GA',
      zipCode: '30350',
      classification: 'RESIDENTIAL',
      isTaxExempt: false,
      paymentTerms: 'DUE_ON_RECEIPT',
      currentBalanceDue: 0,
      referralCreditBalance: 120.00,
      createdAt: '2021-11-20',
      status: 'ACTIVE',
    },
  ];

  public static APEX_CLEANOPS_CLIENTS: ClientEntity[] = [
    {
      id: 'cnt-apex-01',
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
      currentBalanceDue: 6495.00,
      referralCreditBalance: 0,
      createdAt: '2022-04-10',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-apex-02',
      name: 'Dallas Corporate Plaza Towers',
      contactPerson: 'Jessica Sterling (Operations VP)',
      email: 'jsterling@dallascorporateplaza.com',
      phone: '(214) 555-7740',
      billingAddress: '1717 McKinney Ave, 10th Floor',
      serviceAddress: '1717 McKinney Ave',
      city: 'Dallas',
      stateCode: 'TX',
      zipCode: '75202',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 15200.00,
      referralCreditBalance: 0,
      createdAt: '2023-03-15',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-apex-03',
      name: 'Houston Energy Tower Facility',
      contactPerson: 'Brandon Scott (Facility Superintendent)',
      email: 'bscott@houstonenergytower.com',
      phone: '(713) 555-9011',
      billingAddress: '1000 Louisiana St, Suite 4000',
      serviceAddress: '1000 Louisiana St',
      city: 'Houston',
      stateCode: 'TX',
      zipCode: '77002',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 22500.00,
      referralCreditBalance: 0,
      createdAt: '2023-08-01',
      status: 'ACTIVE',
    },
  ];

  public static APEX_CLOUD_CLIENTS: ClientEntity[] = [
    {
      id: 'cnt-cloud-01',
      name: 'NovaTech BioLabs Inc',
      contactPerson: 'Dr. Gregory House (CTO)',
      email: 'billing@novatechbiolabs.com',
      phone: '(302) 555-1940',
      billingAddress: '1201 N Market St, Suite 1400',
      serviceAddress: '1201 N Market St',
      city: 'Wilmington',
      stateCode: 'DE',
      zipCode: '19801',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 18500.00,
      referralCreditBalance: 0,
      createdAt: '2023-05-12',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-cloud-02',
      name: 'SoHo Design & Creative Agency',
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
      currentBalanceDue: 13065.00,
      referralCreditBalance: 20.00,
      createdAt: '2023-06-01',
      status: 'ACTIVE',
    },
    {
      id: 'cnt-cloud-03',
      name: 'Fintech Alpha Labs Corp',
      contactPerson: 'Alexander Hayes (VP Engineering)',
      email: 'finance@fintechalpha.io',
      phone: '(415) 555-9482',
      billingAddress: '500 Howard St, Suite 400',
      serviceAddress: '500 Howard St',
      city: 'San Francisco',
      stateCode: 'CA',
      zipCode: '94105',
      classification: 'COMMERCIAL_CORPORATE',
      isTaxExempt: false,
      paymentTerms: 'NET_30',
      currentBalanceDue: 28000.00,
      referralCreditBalance: 0,
      createdAt: '2024-01-15',
      status: 'ACTIVE',
    },
  ];

  public static INITIAL_CLIENTS: ClientEntity[] = EntityDirectoryEngine.MILLA_MAID_CLIENTS;

  public static getClientsForCompany(companyId: string, legalName?: string): ClientEntity[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));
    const isApexDelaware = companyId.includes('003') || companyId.includes('cloud') || (legalName && legalName.toLowerCase().includes('cloud'));

    if (isMilla) {
      return EntityDirectoryEngine.MILLA_MAID_CLIENTS;
    } else if (isApexDelaware) {
      return EntityDirectoryEngine.APEX_CLOUD_CLIENTS;
    } else {
      return EntityDirectoryEngine.APEX_CLEANOPS_CLIENTS;
    }
  }

  public static getWorkersForCompany(companyId: string, legalName?: string): WorkerEntity[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));
    const isApexDelaware = companyId.includes('003') || companyId.includes('cloud') || (legalName && legalName.toLowerCase().includes('cloud'));

    if (isMilla) {
      return [
        {
          id: 'wrk-mil-01',
          legalName: 'Maria Santos',
          preferredName: 'Maria',
          email: 'maria.santos@millamaidservices.com',
          phone: '(404) 555-7721',
          ssnOrTinMasked: '•••-••-4819',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Senior Atlanta Cleaning Crew Lead',
          department: 'CLEANING_FIELD_CREW',
          payModel: 'HOURLY',
          basePayRate: 25.00,
          workState: 'GA',
          hireDate: '2021-11-15',
          emergencyContactName: 'Jose Santos (Husband)',
          emergencyContactPhone: '(404) 555-7720',
          ptoBalanceHours: 48,
          status: 'ACTIVE',
        },
        {
          id: 'wrk-mil-02',
          legalName: 'Carlos Gomez',
          preferredName: 'Carlos',
          email: 'carlos.gomez@millamaidservices.com',
          phone: '(404) 555-9932',
          ssnOrTinMasked: '•••-••-6231',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Commercial Van Fleet Specialist & Dispatch',
          department: 'CLEANING_FIELD_CREW',
          payModel: 'HOURLY',
          basePayRate: 23.50,
          workState: 'GA',
          hireDate: '2022-01-10',
          emergencyContactName: 'Elena Gomez (Sister)',
          emergencyContactPhone: '(404) 555-9930',
          ptoBalanceHours: 36,
          status: 'ACTIVE',
        },
        {
          id: 'wrk-mil-03',
          legalName: 'Ana Silva',
          preferredName: 'Ana',
          email: 'ana.silva@contractor.io',
          phone: '(404) 555-3341',
          ssnOrTinMasked: '•••-••-9081',
          classification: '1099_CONTRACTOR',
          roleTitle: 'Residential Deep Clean Specialist (1099)',
          department: 'CLEANING_FIELD_CREW',
          payModel: 'PER_JOB_FLAT',
          basePayRate: 75.00,
          workState: 'GA',
          hireDate: '2022-03-01',
          emergencyContactName: 'Paulo Silva (Brother)',
          emergencyContactPhone: '(404) 555-3340',
          ptoBalanceHours: 0,
          status: 'ACTIVE',
        },
      ];
    } else if (isApexDelaware) {
      return [
        {
          id: 'wrk-cld-01',
          legalName: 'Lucas Vance',
          preferredName: 'Lucas',
          email: 'lucas.vance@apexcloud.io',
          phone: '(302) 555-4812',
          ssnOrTinMasked: '•••-••-7819',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Principal Cloud & AI Architect',
          department: 'ENGINEERING',
          payModel: 'ANNUAL_SALARY',
          basePayRate: 85.00,
          workState: 'DE',
          hireDate: '2023-01-05',
          emergencyContactName: 'Elena Vance (Wife)',
          emergencyContactPhone: '(302) 555-4810',
          ptoBalanceHours: 80,
          status: 'ACTIVE',
        },
        {
          id: 'wrk-cld-02',
          legalName: 'Sofia Chen',
          preferredName: 'Sofia',
          email: 'sofia.chen@apexcloud.io',
          phone: '(212) 555-9182',
          ssnOrTinMasked: '•••-••-3310',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Senior Full-Stack & Next.js Engineer',
          department: 'ENGINEERING',
          payModel: 'HOURLY',
          basePayRate: 65.00,
          workState: 'NY',
          hireDate: '2023-04-12',
          emergencyContactName: 'Min Chen (Mother)',
          emergencyContactPhone: '(212) 555-9180',
          ptoBalanceHours: 60,
          status: 'ACTIVE',
        },
      ];
    } else {
      return [
        {
          id: 'wrk-apx-01',
          legalName: 'Mateo Rodriguez',
          preferredName: 'Mateo',
          email: 'mateo.rodriguez@apexcleanops.com',
          phone: '(512) 555-7721',
          ssnOrTinMasked: '•••-••-4819',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Texas Field Operations Lead',
          department: 'CLEANING_FIELD_CREW',
          payModel: 'HOURLY',
          basePayRate: 26.00,
          workState: 'TX',
          hireDate: '2022-04-01',
          emergencyContactName: 'Laura Rodriguez (Wife)',
          emergencyContactPhone: '(512) 555-7720',
          ptoBalanceHours: 40,
          status: 'ACTIVE',
        },
        {
          id: 'wrk-apx-02',
          legalName: 'Elena Vasquez',
          preferredName: 'Elena',
          email: 'elena.vasquez@apexcleanops.com',
          phone: '(214) 555-9932',
          ssnOrTinMasked: '•••-••-6231',
          classification: 'W2_FULL_TIME',
          roleTitle: 'Industrial Sanitization Specialist',
          department: 'CLEANING_FIELD_CREW',
          payModel: 'HOURLY',
          basePayRate: 23.00,
          workState: 'TX',
          hireDate: '2022-06-15',
          emergencyContactName: 'Jorge Vasquez (Father)',
          emergencyContactPhone: '(214) 555-9930',
          ptoBalanceHours: 35,
          status: 'ACTIVE',
        },
      ];
    }
  }

  public static getVendorsForCompany(companyId: string, legalName?: string): VendorEntity[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));
    const isApexDelaware = companyId.includes('003') || companyId.includes('cloud') || (legalName && legalName.toLowerCase().includes('cloud'));

    if (isMilla) {
      return [
        {
          id: 'vnd-mil-01',
          companyName: 'Atlanta Janitorial & Chemical Supply Co.',
          taxIdOrEin: '58-9481920',
          category: 'SUPPLIES_CHEMICALS',
          contactPerson: 'David Miller',
          email: 'orders@atlantajanitorial.com',
          phone: '(404) 555-3265',
          remittanceAddress: '2100 Buford Hwy',
          city: 'Doraville',
          stateCode: 'GA',
          zipCode: '30340',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '5020',
          is1099Eligible: false,
          ytdSpendAmount: 18450.00,
          status: 'ACTIVE',
        },
        {
          id: 'vnd-mil-02',
          companyName: 'Truist Commercial Fleet & Liability Insurance',
          taxIdOrEin: '56-4920194',
          category: 'INSURANCE',
          contactPerson: 'Commercial Underwriting',
          email: 'commercial@truist.com',
          phone: '(800) 555-4724',
          remittanceAddress: '303 Peachtree St NE',
          city: 'Atlanta',
          stateCode: 'GA',
          zipCode: '30308',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '6300',
          is1099Eligible: false,
          ytdSpendAmount: 7200.00,
          status: 'ACTIVE',
        },
        {
          id: 'vnd-mil-03',
          companyName: 'Home Depot Pro Commercial Janitorial Supplies',
          taxIdOrEin: '58-1849201',
          category: 'SUPPLIES_CHEMICALS',
          contactPerson: 'Atlanta Pro Desk',
          email: 'prodesk.atlanta@homedepot.com',
          phone: '(800) 555-4376',
          remittanceAddress: '2455 Paces Ferry Rd',
          city: 'Atlanta',
          stateCode: 'GA',
          zipCode: '30339',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '5020',
          is1099Eligible: false,
          ytdSpendAmount: 5120.00,
          status: 'ACTIVE',
        },
      ];
    } else if (isApexDelaware) {
      return [
        {
          id: 'vnd-cld-01',
          companyName: 'Amazon Web Services Inc. (AWS)',
          taxIdOrEin: '91-1646860',
          category: 'SOFTWARE_IT',
          contactPerson: 'AWS Accounts Payable',
          email: 'aws-billing@amazon.com',
          phone: '(800) 555-0199',
          remittanceAddress: '410 Terry Ave N',
          city: 'Seattle',
          stateCode: 'WA',
          zipCode: '98109',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '6100',
          is1099Eligible: false,
          ytdSpendAmount: 24500.00,
          status: 'ACTIVE',
        },
        {
          id: 'vnd-cld-02',
          companyName: 'Vercel Pro Enterprise Hosting',
          taxIdOrEin: '84-4928172',
          category: 'SOFTWARE_IT',
          contactPerson: 'Vercel Billing',
          email: 'billing@vercel.com',
          phone: '(800) 555-8372',
          remittanceAddress: '440 N Barranca Ave #4133',
          city: 'Covina',
          stateCode: 'CA',
          zipCode: '91723',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '6100',
          is1099Eligible: false,
          ytdSpendAmount: 4800.00,
          status: 'ACTIVE',
        },
      ];
    } else {
      return [
        {
          id: 'vnd-apx-01',
          companyName: 'Grainger Industrial Safety & Janitorial Supply',
          taxIdOrEin: '36-1150280',
          category: 'SUPPLIES_CHEMICALS',
          contactPerson: 'Austin Enterprise Accounts',
          email: 'austin@grainger.com',
          phone: '(512) 555-4724',
          remittanceAddress: '100 Grainger Pkwy',
          city: 'Austin',
          stateCode: 'TX',
          zipCode: '78758',
          paymentTerms: 'NET_30',
          defaultExpenseAccountCode: '5020',
          is1099Eligible: false,
          ytdSpendAmount: 14200.00,
          status: 'ACTIVE',
        },
      ];
    }
  }

  public static INITIAL_WORKERS: WorkerEntity[] = EntityDirectoryEngine.getWorkersForCompany('cmp-milla-maid-ga');
  public static INITIAL_VENDORS: VendorEntity[] = EntityDirectoryEngine.getVendorsForCompany('cmp-milla-maid-ga');

  public static createClient(input: Omit<ClientEntity, 'id' | 'createdAt' | 'currentBalanceDue' | 'referralCreditBalance'>): ClientEntity {
    return {
      ...input,
      id: `cnt-${Math.floor(100000 + Math.random() * 900000)}`,
      currentBalanceDue: 0,
      referralCreditBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  public static createWorker(input: Omit<WorkerEntity, 'id' | 'ptoBalanceHours'>): WorkerEntity {
    return {
      ...input,
      id: `wrk-${Math.floor(100000 + Math.random() * 900000)}`,
      ptoBalanceHours: input.classification.startsWith('W2') ? 40 : 0,
    };
  }

  public static createVendor(input: Omit<VendorEntity, 'id' | 'ytdSpendAmount'>): VendorEntity {
    return {
      ...input,
      id: `vnd-${Math.floor(100000 + Math.random() * 900000)}`,
      ytdSpendAmount: 0,
    };
  }
}
