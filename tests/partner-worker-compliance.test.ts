import { describe, it, expect } from 'vitest';
import {
  CompanyProfileEngine,
  OfficerMemberProfile,
  CompanyTaxProfile,
} from '../src/lib/company/company-profile-engine';
import {
  EntityDirectoryEngine,
  WorkerEntity,
} from '../src/lib/directory/entity-directory-engine';

describe('US Partner & Corporate Compliance Engine (IRS Form 1065 / 1120-S & IRC 704b, 707c, 1446)', () => {
  it('should create and validate a Managing Member partner with IRC 704(b) capital accounts', () => {
    const partner = CompanyProfileEngine.createOfficerOrPartner({
      fullName: 'Marcus Aurelius Vance',
      title: 'Managing Member & Partnership Representative',
      memberType: 'MANAGING_MEMBER',
      taxClassification: 'US_CITIZEN_OR_RESIDENT',
      ssnOrItinRaw: '123-45-6789',
      ownershipPercentage: 50.0,
      profitSharingPercentage: 50.0,
      lossSharingPercentage: 50.0,
      beginningCapitalAccount: 100000,
      capitalContributedYear: 25000,
      currentYearDistributions: 15000,
      guaranteedPaymentsYear: 48000, // IRC § 707(c)
      isTaxMattersPartner: true,
      isMaterialParticipant: true,
      receivesW2Salary: false,
      k1DistributionRatio: 0.50,
    });

    expect(partner.id).toMatch(/^off-\d+/);
    expect(partner.ssnOrItinMasked).toBe('•••-••-6789');
    expect(partner.ownershipPercentage).toBe(50.0);
    expect(partner.beginningCapitalAccount).toBe(100000);
    expect(partner.capitalContributedYear).toBe(25000);
    expect(partner.currentYearDistributions).toBe(15000);
    // Ending Capital = Beginning (100k) + Contributions (25k) - Distributions (15k) = 110k
    expect(partner.endingCapitalAccount).toBe(110000);
    expect(partner.isTaxMattersPartner).toBe(true);
  });

  it('should calculate IRS Form 1065 Schedule K-1 Pass-Through for US and Foreign Partners (IRC § 1446 Withholding)', () => {
    const usPartner = CompanyProfileEngine.createOfficerOrPartner({
      fullName: 'David A. Silva',
      title: 'Managing Member',
      memberType: 'MANAGING_MEMBER',
      taxClassification: 'US_CITIZEN_OR_RESIDENT',
      ssnOrItinRaw: '987-65-4321',
      ownershipPercentage: 60.0,
      guaranteedPaymentsYear: 36000,
      isTaxMattersPartner: true,
      receivesW2Salary: false,
      k1DistributionRatio: 0.60,
    });

    const foreignPartner = CompanyProfileEngine.createOfficerOrPartner({
      fullName: 'Carlos Mendes',
      title: 'Limited Partner (NRA)',
      memberType: 'LIMITED_PARTNER_LP',
      taxClassification: 'FOREIGN_NATIONAL_NRA',
      ssnOrItinRaw: '999-88-7777',
      ownershipPercentage: 40.0,
      guaranteedPaymentsYear: 0,
      isTaxMattersPartner: false,
      receivesW2Salary: false,
      k1DistributionRatio: 0.40,
      foreignWithholdingRate: 0.37, // 37% IRC 1446 individual withholding
    });

    const companyNetIncome = 200000; // $200k Partnership Net Ordinary Income

    const k1Us = CompanyProfileEngine.calculatePartnerK1(usPartner, companyNetIncome);
    expect(k1Us.k1Box1OrdinaryBusinessIncome).toBe(120000); // 60% of 200k
    expect(k1Us.k1Box4GuaranteedPayments).toBe(36000);
    expect(k1Us.isForeignPartner).toBe(false);
    expect(k1Us.section1446WithholdingAmount).toBe(0);

    const k1Foreign = CompanyProfileEngine.calculatePartnerK1(foreignPartner, companyNetIncome);
    expect(k1Foreign.k1Box1OrdinaryBusinessIncome).toBe(80000); // 40% of 200k
    expect(k1Foreign.isForeignPartner).toBe(true);
    expect(k1Foreign.section1446WithholdingRate).toBe(0.37);
    // 37% of $80,000 = $29,600 mandatory withholding
    expect(k1Foreign.section1446WithholdingAmount).toBe(29600);
  });
});

describe('US Worker & Employee Compliance Engine (W-4 / W-9 / ACH / Pre-Tax Benefits)', () => {
  it('should create a W-2 employee with masked SSN and initial PTO balance', () => {
    const worker = EntityDirectoryEngine.createWorker({
      legalName: 'Maria Eduarda Santos',
      preferredName: 'Maria Santos',
      email: 'maria.santos@cleanops.com',
      phone: '(512) 555-0199',
      ssnOrTinMasked: '•••-••-4819',
      classification: 'W2_FULL_TIME',
      roleTitle: 'Commercial Janitorial Specialist',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'HOURLY',
      basePayRate: 26.50,
      workState: 'TX',
      hireDate: '2026-03-01',
      emergencyContactName: 'Carlos Santos (Spouse)',
      emergencyContactPhone: '(512) 555-0144',
      status: 'ACTIVE',
    });

    expect(worker.id).toMatch(/^wrk-\d+/);
    expect(worker.classification).toBe('W2_FULL_TIME');
    expect(worker.ptoBalanceHours).toBe(40); // 40 hours standard PTO for W2 Full-Time
  });

  it('should create a 1099 independent contractor with 0 PTO and proper role title', () => {
    const contractor = EntityDirectoryEngine.createWorker({
      legalName: 'Roberto Lima Jr.',
      email: 'roberto.lima@contractor.io',
      phone: '(305) 555-8821',
      ssnOrTinMasked: '•••-••-9942',
      classification: '1099_CONTRACTOR',
      roleTitle: 'Post-Construction Deep Clean Specialist (1099)',
      department: 'CLEANING_FIELD_CREW',
      payModel: 'PER_JOB_FLAT',
      basePayRate: 85.00,
      workState: 'FL',
      hireDate: '2026-03-10',
      emergencyContactName: 'Lucia Lima',
      emergencyContactPhone: '(305) 555-8822',
      status: 'ACTIVE',
    });

    expect(contractor.classification).toBe('1099_CONTRACTOR');
    expect(contractor.ptoBalanceHours).toBe(0); // Contractors do not accrue PTO
  });
});
