export type UsTaxEntityType =
  | 'C_CORP_1120'
  | 'S_CORP_1120S'
  | 'LLC_PARTNERSHIP_1065'
  | 'SINGLE_MEMBER_LLC_DISREGARDED'
  | 'SOLE_PROPRIETORSHIP';

export type TaxAccountingMethod = 'CASH' | 'ACCRUAL' | 'HYBRID';

export interface StateTaxNexusProfile {
  stateCode: string; // e.g. "TX", "DE", "FL", "NY", "CA"
  stateName: string;
  stateTaxId: string; // State Taxpayer ID / WebFile Number
  sosFileNumber: string; // Secretary of State Entity ID
  hasPhysicalNexus: boolean;
  hasEconomicNexus: boolean;
  salesTaxPermitNumber: string;
  salesTaxRate: number; // e.g. 0.0825 for TX
  annualReportDueDate: string; // e.g. "May 15"
  franchiseTaxStatus: 'ACTIVE_GOOD_STANDING' | 'FILED' | 'PENDING_RENEWAL';
}

export type PartnerMemberType =
  | 'MANAGING_MEMBER' // LLC
  | 'NON_MANAGING_MEMBER' // LLC
  | 'GENERAL_PARTNER_GP' // LP / LLP (Form 1065)
  | 'LIMITED_PARTNER_LP' // LP (Form 1065)
  | 'SHAREHOLDER_OWNER' // S-Corp (1120-S) or C-Corp (1120)
  | 'CORPORATE_OFFICER_DIRECTOR'; // President, CEO, Treasurer (1120 Sch E)

export type PartnerTaxClassification =
  | 'US_CITIZEN_OR_RESIDENT' // Form W-9
  | 'FOREIGN_NATIONAL_NRA' // Form W-8BEN (IRC § 1446 Withholding)
  | 'FOREIGN_CORPORATION_ENTITY' // Form W-8BEN-E
  | 'DOMESTIC_ENTITY_PARTNER'; // US LLC / Corp as partner

export interface OfficerMemberProfile {
  id: string;
  fullName: string;
  title: string; // e.g. "Managing Member", "President / CEO", "Treasurer"
  memberType: PartnerMemberType;
  taxClassification: PartnerTaxClassification;
  ssnOrItinMasked: string; // e.g. "•••-••-8492"
  ssnOrItinRaw?: string;
  residentialAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  ownershipPercentage: number; // e.g. 60.0
  profitSharingPercentage?: number; // IRC 704(b)
  lossSharingPercentage?: number;
  beginningCapitalAccount?: number;
  capitalContributedYear?: number;
  currentYearDistributions?: number;
  endingCapitalAccount?: number;
  guaranteedPaymentsYear?: number; // IRC § 707(c)
  isTaxMattersPartner: boolean; // IRS TMP for Form 1065 / Partnership Representative
  isMaterialParticipant?: boolean; // IRC § 469
  receivesW2Salary: boolean; // Required for S-Corp owners (Reasonable Comp)
  w2SalaryAnnual?: number;
  k1DistributionRatio: number;
  foreignWithholdingRate?: number; // IRC § 1446 Withholding
  hasW8BenOnFile?: boolean;
}

export interface CompanyTaxProfile {
  id: string;
  legalName: string;
  dbaName?: string;
  ein: string; // XX-XXXXXXX
  entityType: UsTaxEntityType;
  taxAccountingMethod: TaxAccountingMethod;
  taxYearEndMonth: number; // 12 for Calendar Year (Dec 31)
  naicsCode: string; // e.g. "561720" for Janitorial Services
  businessActivityDescription: string;
  formationDate: string;
  formationState: string; // e.g. "TX" or "DE"
  principalAddress: {
    street: string;
    suite?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactEmail: string;
  contactPhone: string;
  website?: string;
  stateNexusProfiles: StateTaxNexusProfile[];
  officersAndMembers: OfficerMemberProfile[];
  isCurrentActiveCompany: boolean;
}

export interface UsStateDefinition {
  code: string;
  name: string;
  defaultSalesTaxRate: number;
  hasFranchiseTax: boolean;
  sosAnnualReportDue: string;
}

export const US_STATES_LIST: UsStateDefinition[] = [
  { code: 'AL', name: 'Alabama', defaultSalesTaxRate: 0.04, hasFranchiseTax: true, sosAnnualReportDue: 'March 15' },
  { code: 'AK', name: 'Alaska', defaultSalesTaxRate: 0.00, hasFranchiseTax: false, sosAnnualReportDue: 'Jan 2' },
  { code: 'AZ', name: 'Arizona', defaultSalesTaxRate: 0.056, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'AR', name: 'Arkansas', defaultSalesTaxRate: 0.065, hasFranchiseTax: true, sosAnnualReportDue: 'May 1' },
  { code: 'CA', name: 'California', defaultSalesTaxRate: 0.0725, hasFranchiseTax: true, sosAnnualReportDue: 'Biennial' },
  { code: 'CO', name: 'Colorado', defaultSalesTaxRate: 0.029, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'CT', name: 'Connecticut', defaultSalesTaxRate: 0.0635, hasFranchiseTax: true, sosAnnualReportDue: 'March 31' },
  { code: 'DE', name: 'Delaware', defaultSalesTaxRate: 0.00, hasFranchiseTax: true, sosAnnualReportDue: 'June 1 (LLC) / March 1 (Corp)' },
  { code: 'FL', name: 'Florida', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'May 1' },
  { code: 'GA', name: 'Georgia', defaultSalesTaxRate: 0.04, hasFranchiseTax: true, sosAnnualReportDue: 'April 1' },
  { code: 'HI', name: 'Hawaii', defaultSalesTaxRate: 0.04, hasFranchiseTax: false, sosAnnualReportDue: 'Quarterly' },
  { code: 'ID', name: 'Idaho', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'IL', name: 'Illinois', defaultSalesTaxRate: 0.0625, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary' },
  { code: 'IN', name: 'Indiana', defaultSalesTaxRate: 0.07, hasFranchiseTax: false, sosAnnualReportDue: 'Biennial' },
  { code: 'IA', name: 'Iowa', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'Biennial' },
  { code: 'KS', name: 'Kansas', defaultSalesTaxRate: 0.065, hasFranchiseTax: false, sosAnnualReportDue: 'April 15' },
  { code: 'KY', name: 'Kentucky', defaultSalesTaxRate: 0.06, hasFranchiseTax: true, sosAnnualReportDue: 'June 30' },
  { code: 'LA', name: 'Louisiana', defaultSalesTaxRate: 0.0445, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary' },
  { code: 'ME', name: 'Maine', defaultSalesTaxRate: 0.055, hasFranchiseTax: false, sosAnnualReportDue: 'June 1' },
  { code: 'MD', name: 'Maryland', defaultSalesTaxRate: 0.06, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
  { code: 'MA', name: 'Massachusetts', defaultSalesTaxRate: 0.0625, hasFranchiseTax: true, sosAnnualReportDue: 'Nov 1' },
  { code: 'MI', name: 'Michigan', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'Feb 15' },
  { code: 'MN', name: 'Minnesota', defaultSalesTaxRate: 0.06875, hasFranchiseTax: false, sosAnnualReportDue: 'Dec 31' },
  { code: 'MS', name: 'Mississippi', defaultSalesTaxRate: 0.07, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
  { code: 'MO', name: 'Missouri', defaultSalesTaxRate: 0.04225, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'MT', name: 'Montana', defaultSalesTaxRate: 0.00, hasFranchiseTax: false, sosAnnualReportDue: 'April 15' },
  { code: 'NE', name: 'Nebraska', defaultSalesTaxRate: 0.055, hasFranchiseTax: true, sosAnnualReportDue: 'April 1' },
  { code: 'NV', name: 'Nevada', defaultSalesTaxRate: 0.0685, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary' },
  { code: 'NH', name: 'New Hampshire', defaultSalesTaxRate: 0.00, hasFranchiseTax: true, sosAnnualReportDue: 'April 1' },
  { code: 'NJ', name: 'New Jersey', defaultSalesTaxRate: 0.06625, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary' },
  { code: 'NM', name: 'New Mexico', defaultSalesTaxRate: 0.05, hasFranchiseTax: false, sosAnnualReportDue: 'Biennial' },
  { code: 'NY', name: 'New York', defaultSalesTaxRate: 0.04, hasFranchiseTax: true, sosAnnualReportDue: 'Biennial' },
  { code: 'NC', name: 'North Carolina', defaultSalesTaxRate: 0.0475, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
  { code: 'ND', name: 'North Dakota', defaultSalesTaxRate: 0.05, hasFranchiseTax: false, sosAnnualReportDue: 'Nov 15' },
  { code: 'OH', name: 'Ohio', defaultSalesTaxRate: 0.0575, hasFranchiseTax: true, sosAnnualReportDue: 'Commercial CAT' },
  { code: 'OK', name: 'Oklahoma', defaultSalesTaxRate: 0.045, hasFranchiseTax: true, sosAnnualReportDue: 'July 1' },
  { code: 'OR', name: 'Oregon', defaultSalesTaxRate: 0.00, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary' },
  { code: 'PA', name: 'Pennsylvania', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'Dec 31' },
  { code: 'RI', name: 'Rhode Island', defaultSalesTaxRate: 0.07, hasFranchiseTax: true, sosAnnualReportDue: 'May 1' },
  { code: 'SC', name: 'South Carolina', defaultSalesTaxRate: 0.06, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
  { code: 'SD', name: 'South Dakota', defaultSalesTaxRate: 0.045, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'TN', name: 'Tennessee', defaultSalesTaxRate: 0.07, hasFranchiseTax: true, sosAnnualReportDue: 'April 1' },
  { code: 'TX', name: 'Texas', defaultSalesTaxRate: 0.0625, hasFranchiseTax: true, sosAnnualReportDue: 'May 15' },
  { code: 'UT', name: 'Utah', defaultSalesTaxRate: 0.061, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'VT', name: 'Vermont', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'March 15' },
  { code: 'VA', name: 'Virginia', defaultSalesTaxRate: 0.053, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'WA', name: 'Washington', defaultSalesTaxRate: 0.065, hasFranchiseTax: true, sosAnnualReportDue: 'Anniversary (B&O Tax)' },
  { code: 'WV', name: 'West Virginia', defaultSalesTaxRate: 0.06, hasFranchiseTax: false, sosAnnualReportDue: 'July 1' },
  { code: 'WI', name: 'Wisconsin', defaultSalesTaxRate: 0.05, hasFranchiseTax: false, sosAnnualReportDue: 'Quarterly' },
  { code: 'WY', name: 'Wyoming', defaultSalesTaxRate: 0.04, hasFranchiseTax: false, sosAnnualReportDue: 'Anniversary' },
  { code: 'DC', name: 'District of Columbia', defaultSalesTaxRate: 0.06, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
  { code: 'PR', name: 'Puerto Rico', defaultSalesTaxRate: 0.115, hasFranchiseTax: true, sosAnnualReportDue: 'April 15' },
];

export class CompanyProfileEngine {
  public static STATES = US_STATES_LIST;
  public static INITIAL_COMPANIES: CompanyTaxProfile[] = [
    {
      id: 'cmp-apex-cleanops-tx',
      legalName: 'Apex CleanOps Commercial Services LLC',
      dbaName: 'Apex Commercial Cleaning',
      ein: '84-9281742',
      entityType: 'LLC_PARTNERSHIP_1065',
      taxAccountingMethod: 'ACCRUAL',
      taxYearEndMonth: 12,
      naicsCode: '561720',
      businessActivityDescription: 'Commercial Janitorial & Facility Disinfection Services',
      formationDate: '2022-03-15',
      formationState: 'TX',
      principalAddress: {
        street: '701 Brazos Street',
        suite: 'Suite 650',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'USA',
      },
      contactEmail: 'accounting@apexcleanops.com',
      contactPhone: '(512) 555-0192',
      website: 'https://apexcleanops.com',
      isCurrentActiveCompany: true,
      stateNexusProfiles: [
        {
          stateCode: 'TX',
          stateName: 'Texas',
          stateTaxId: '32084928174',
          sosFileNumber: '0804491029',
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: 'TX-ST-991204',
          salesTaxRate: 0.0825,
          annualReportDueDate: 'May 15',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
        {
          stateCode: 'FL',
          stateName: 'Florida',
          stateTaxId: 'FL-8492019-22',
          sosFileNumber: 'L22000194812',
          hasPhysicalNexus: false,
          hasEconomicNexus: true,
          salesTaxPermitNumber: 'FL-ST-44129',
          salesTaxRate: 0.070,
          annualReportDueDate: 'May 1',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: 'off-001',
          fullName: 'David A. Silva',
          title: 'Managing Member & Partnership Representative',
          memberType: 'MANAGING_MEMBER',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-4819',
          residentialAddress: {
            street: '401 Congress Ave, Apt 1802',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            country: 'USA',
          },
          ownershipPercentage: 60.0,
          profitSharingPercentage: 60.0,
          lossSharingPercentage: 60.0,
          beginningCapitalAccount: 50000,
          capitalContributedYear: 15000,
          currentYearDistributions: 20000,
          endingCapitalAccount: 45000,
          guaranteedPaymentsYear: 36000,
          isTaxMattersPartner: true,
          isMaterialParticipant: true,
          receivesW2Salary: false,
          k1DistributionRatio: 0.60,
        },
        {
          id: 'off-002',
          fullName: 'Carolina M. Rodriguez',
          title: 'Operating Member / Head of Operations',
          memberType: 'NON_MANAGING_MEMBER',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-1942',
          residentialAddress: {
            street: '1240 Ocean Drive, Suite 500',
            city: 'Miami Beach',
            state: 'FL',
            zipCode: '33139',
            country: 'USA',
          },
          ownershipPercentage: 40.0,
          profitSharingPercentage: 40.0,
          lossSharingPercentage: 40.0,
          beginningCapitalAccount: 30000,
          capitalContributedYear: 10000,
          currentYearDistributions: 12000,
          endingCapitalAccount: 28000,
          guaranteedPaymentsYear: 24000,
          isTaxMattersPartner: false,
          isMaterialParticipant: true,
          receivesW2Salary: false,
          k1DistributionRatio: 0.40,
        },
      ],
    },
    {
      id: 'cmp-milla-maid-ga',
      legalName: 'Milla Maid Services LLC',
      dbaName: 'Milla Maid Cleaning Solutions',
      ein: '84-3910294',
      entityType: 'LLC_PARTNERSHIP_1065',
      taxAccountingMethod: 'ACCRUAL',
      taxYearEndMonth: 12,
      naicsCode: '561720',
      businessActivityDescription: 'Commercial, Residential & Hotel Janitorial & Cleaning Services',
      formationDate: '2021-11-01',
      formationState: 'GA',
      principalAddress: {
        street: '8191 Colquitt Rd, Apt F',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30350',
        country: 'USA',
      },
      contactEmail: 'contact@millamaidservices.com',
      contactPhone: '+1 (404) 879-8655',
      isCurrentActiveCompany: true,
      stateNexusProfiles: [
        {
          stateCode: 'GA',
          stateName: 'Georgia',
          stateTaxId: 'GA-REV-9821034',
          sosFileNumber: 'GA-LLC-21094812',
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: 'GA-ST-558291',
          salesTaxRate: 0.04,
          annualReportDueDate: 'April 1',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: 'off-milla-01',
          fullName: 'Managing Principal & Operator',
          title: 'Managing Member / CEO',
          memberType: 'MANAGING_MEMBER',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-8655',
          residentialAddress: {
            street: '8191 Colquitt Rd, Apt F',
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30350',
            country: 'USA',
          },
          ownershipPercentage: 100.0,
          profitSharingPercentage: 100.0,
          lossSharingPercentage: 100.0,
          beginningCapitalAccount: 150000,
          capitalContributedYear: 0,
          currentYearDistributions: 32440,
          endingCapitalAccount: 185000,
          guaranteedPaymentsYear: 0,
          isTaxMattersPartner: true,
          isMaterialParticipant: true,
          receivesW2Salary: false,
          k1DistributionRatio: 1.0,
        },
      ],
    },
    {
      id: 'cmp-apex-cloud-de',
      legalName: 'Apex Cloud Technologies Inc.',
      dbaName: 'Apex SaaS Solutions',
      ein: '88-1928471',
      entityType: 'C_CORP_1120',
      taxAccountingMethod: 'ACCRUAL',
      taxYearEndMonth: 12,
      naicsCode: '541511',
      businessActivityDescription: 'Enterprise Fintech & Accounting Cloud Software',
      formationDate: '2023-01-10',
      formationState: 'DE',
      principalAddress: {
        street: '1209 North Orange Street',
        suite: 'Suite 400',
        city: 'Wilmington',
        state: 'DE',
        zipCode: '19801',
        country: 'USA',
      },
      contactEmail: 'tax@apexcloudtech.io',
      contactPhone: '(302) 555-0144',
      website: 'https://apexcloudtech.io',
      isCurrentActiveCompany: false,
      stateNexusProfiles: [
        {
          stateCode: 'DE',
          stateName: 'Delaware',
          stateTaxId: 'DE-7749102',
          sosFileNumber: '7391048',
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: 'N/A (No State Sales Tax)',
          salesTaxRate: 0.00,
          annualReportDueDate: 'March 1',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
        {
          stateCode: 'NY',
          stateName: 'New York',
          stateTaxId: 'NY-DTF-994812',
          sosFileNumber: 'NY-DOS-849102',
          hasPhysicalNexus: false,
          hasEconomicNexus: true,
          salesTaxPermitNumber: 'NY-ST-882194',
          salesTaxRate: 0.08875,
          annualReportDueDate: 'April 15',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: 'off-101',
          fullName: 'David A. Silva',
          title: 'President & CEO',
          memberType: 'CORPORATE_OFFICER_DIRECTOR',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-4819',
          ownershipPercentage: 75.0,
          isTaxMattersPartner: false,
          receivesW2Salary: true,
          w2SalaryAnnual: 180000,
          k1DistributionRatio: 0.0,
        },
        {
          id: 'off-102',
          fullName: 'Elena Rostova',
          title: 'Chief Technology Officer (CTO)',
          memberType: 'CORPORATE_OFFICER_DIRECTOR',
          taxClassification: 'FOREIGN_NATIONAL_NRA',
          ssnOrItinMasked: '•••-••-9931',
          ownershipPercentage: 25.0,
          isTaxMattersPartner: false,
          receivesW2Salary: true,
          w2SalaryAnnual: 160000,
          k1DistributionRatio: 0.0,
          foreignWithholdingRate: 0.30,
          hasW8BenOnFile: true,
        },
      ],
    },
  ];

  /**
   * Formats EIN string into XX-XXXXXXX
   */
  public static formatEin(val: string): string {
    const clean = val.replace(/\D/g, '').slice(0, 9);
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  }

  /**
   * Validates US EIN format
   */
  public static isValidEin(ein: string): boolean {
    const clean = ein.replace(/\D/g, '');
    return clean.length === 9;
  }

  /**
   * Returns IRS Tax Form label based on Entity Type
   */
  public static getIrsTaxFormLabel(entityType: UsTaxEntityType): string {
    switch (entityType) {
      case 'C_CORP_1120':
        return 'IRS Form 1120 (U.S. Corporation Income Tax Return - 21% Flat Rate)';
      case 'S_CORP_1120S':
        return 'IRS Form 1120-S (U.S. Income Tax Return for an S Corporation - Pass-Through)';
      case 'LLC_PARTNERSHIP_1065':
        return 'IRS Form 1065 (U.S. Return of Partnership Income & Schedule K-1s)';
      case 'SINGLE_MEMBER_LLC_DISREGARDED':
        return 'IRS Form 1040 Schedule C (Disregarded Entity / Sole Proprietorship)';
      case 'SOLE_PROPRIETORSHIP':
        return 'IRS Form 1040 Schedule C (Profit or Loss From Business)';
      default:
        return 'IRS Tax Return';
    }
  }

  /**
   * Generates Tax Return Header metadata for CPA Tax Return Binder & IRS MeF XML
   */
  public static generateTaxBinderHeader(company: CompanyTaxProfile) {
    return {
      returnType: company.entityType === 'C_CORP_1120' ? '1120' : company.entityType === 'S_CORP_1120S' ? '1120-S' : '1065',
      taxYear: 2026,
      taxPeriodBegin: `${new Date().getFullYear()}-01-01`,
      taxPeriodEnd: `${new Date().getFullYear()}-12-31`,
      ein: company.ein,
      legalName: company.legalName,
      dba: company.dbaName || company.legalName,
      principalActivity: company.businessActivityDescription,
      naicsCode: company.naicsCode,
      accountingMethod: company.taxAccountingMethod,
      stateOfFormation: company.formationState,
      totalPartnersOrShareholders: company.officersAndMembers.length,
      primaryContact: company.officersAndMembers[0]?.fullName || 'Authorized Officer',
    };
  }

  /**
   * Creates a new Partner / Officer conforming to US Corporate & Partnership Law
   */
  public static createOfficerOrPartner(input: Omit<OfficerMemberProfile, 'id' | 'ssnOrItinMasked'> & { ssnOrItinRaw?: string }): OfficerMemberProfile {
    const rawId = input.ssnOrItinRaw || '0000';
    const masked = `•••-••-${rawId.replace(/\D/g, '').slice(-4) || '0000'}`;

    return {
      ...input,
      id: `off-${Math.floor(1000 + Math.random() * 9000)}`,
      ssnOrItinMasked: masked,
      beginningCapitalAccount: input.beginningCapitalAccount || 0,
      capitalContributedYear: input.capitalContributedYear || 0,
      currentYearDistributions: input.currentYearDistributions || 0,
      endingCapitalAccount: (input.beginningCapitalAccount || 0) + (input.capitalContributedYear || 0) - (input.currentYearDistributions || 0),
      guaranteedPaymentsYear: input.guaranteedPaymentsYear || 0,
      profitSharingPercentage: input.profitSharingPercentage ?? input.ownershipPercentage,
      lossSharingPercentage: input.lossSharingPercentage ?? input.ownershipPercentage,
      k1DistributionRatio: (input.ownershipPercentage || 0) / 100,
    };
  }

  /**
   * Calculates IRS Schedule K-1 Pass-Through allocation for a partner (Form 1065 / 1120-S)
   */
  public static calculatePartnerK1(
    partner: OfficerMemberProfile,
    totalNetOrdinaryIncome: number
  ) {
    const ordinaryIncomeShare = totalNetOrdinaryIncome * (partner.k1DistributionRatio || partner.ownershipPercentage / 100);
    const guaranteedPayments = partner.guaranteedPaymentsYear || 0;
    const totalTaxableIncomeToPartner = ordinaryIncomeShare + guaranteedPayments;

    // IRC § 1446 Withholding calculation for Foreign Partners
    const isForeign = partner.taxClassification === 'FOREIGN_NATIONAL_NRA' || partner.taxClassification === 'FOREIGN_CORPORATION_ENTITY';
    const withholdingRate = partner.foreignWithholdingRate || (isForeign ? 0.37 : 0);
    const section1446WithholdingAmount = isForeign ? totalTaxableIncomeToPartner * withholdingRate : 0;

    return {
      partnerId: partner.id,
      partnerName: partner.fullName,
      memberType: partner.memberType,
      taxClassification: partner.taxClassification,
      k1Box1OrdinaryBusinessIncome: ordinaryIncomeShare,
      k1Box4GuaranteedPayments: guaranteedPayments,
      k1Box19Distributions: partner.currentYearDistributions || 0,
      endingCapitalAccount: partner.endingCapitalAccount || 0,
      isForeignPartner: isForeign,
      section1446WithholdingRate: withholdingRate,
      section1446WithholdingAmount,
    };
  }

  /**
   * Auto-provisions and registers a new company directly from a migration package/file
   */
  public static autoRegisterCompanyFromMigration(
    legalName: string,
    formationState: string = 'DE',
    entityType: UsTaxEntityType = 'LLC_PARTNERSHIP_1065',
    ein: string = '',
    zipCode: string = '19801',
    city: string = 'Wilmington'
  ): CompanyTaxProfile {
    const generatedId = `comp-${Math.floor(100 + Math.random() * 900)}`;
    const effectiveEin = ein.trim() || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newCompany: CompanyTaxProfile = {
      id: generatedId,
      legalName,
      dbaName: legalName,
      ein: effectiveEin,
      entityType,
      taxAccountingMethod: 'ACCRUAL',
      taxYearEndMonth: 12,
      naicsCode: '541512',
      businessActivityDescription: 'Enterprise Technology & Professional Services',
      formationDate: new Date().toISOString().split('T')[0],
      formationState,
      principalAddress: {
        street: '100 Business Parkway',
        suite: 'Suite 200',
        city,
        state: formationState,
        zipCode,
        country: 'USA',
      },
      contactEmail: `admin@${legalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
      contactPhone: '+1 (512) 555-0100',
      stateNexusProfiles: [
        {
          stateCode: formationState,
          stateName: formationState === 'DE' ? 'Delaware' : formationState === 'TX' ? 'Texas' : formationState === 'CA' ? 'California' : 'Primary State',
          stateTaxId: `${formationState}-TAX-${Math.floor(100000 + Math.random() * 900000)}`,
          sosFileNumber: `SOS-${Math.floor(1000000 + Math.random() * 9000000)}`,
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: `${formationState}-ST-${Math.floor(10000 + Math.random() * 90000)}`,
          salesTaxRate: formationState === 'TX' ? 0.0825 : formationState === 'CA' ? 0.0725 : 0.0,
          annualReportDueDate: 'May 15',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: `off-${Math.floor(100 + Math.random() * 900)}`,
          fullName: 'Managing Principal Officer',
          title: entityType.includes('LLC') ? 'Managing Member' : 'President / CEO',
          memberType: entityType.includes('LLC') ? 'MANAGING_MEMBER' : 'CORPORATE_OFFICER_DIRECTOR',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-8899',
          ownershipPercentage: 100.0,
          profitSharingPercentage: 100.0,
          lossSharingPercentage: 100.0,
          beginningCapitalAccount: 50000,
          capitalContributedYear: 0,
          currentYearDistributions: 0,
          endingCapitalAccount: 50000,
          guaranteedPaymentsYear: 0,
          isTaxMattersPartner: true,
          isMaterialParticipant: true,
          receivesW2Salary: entityType === 'S_CORP_1120S',
          k1DistributionRatio: 1.0,
        },
      ],
      isCurrentActiveCompany: true,
    };

    return newCompany;
  }
}
