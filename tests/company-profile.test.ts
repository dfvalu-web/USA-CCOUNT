import { describe, it, expect } from 'vitest';
import { CompanyProfileEngine, CompanyTaxProfile } from '../src/lib/company/company-profile-engine';

describe('CompanyProfileEngine (Cadastro de Empresas & Perfil Tributário)', () => {
  it('should format and validate Federal EIN numbers correctly', () => {
    expect(CompanyProfileEngine.formatEin('849281742')).toBe('84-9281742');
    expect(CompanyProfileEngine.formatEin('84-9281742')).toBe('84-9281742');
    expect(CompanyProfileEngine.isValidEin('84-9281742')).toBe(true);
    expect(CompanyProfileEngine.isValidEin('12345')).toBe(false);
  });

  it('should return correct IRS tax form labels for C-Corp, S-Corp and Partnership LLCs', () => {
    expect(CompanyProfileEngine.getIrsTaxFormLabel('C_CORP_1120')).toContain('Form 1120');
    expect(CompanyProfileEngine.getIrsTaxFormLabel('S_CORP_1120S')).toContain('Form 1120-S');
    expect(CompanyProfileEngine.getIrsTaxFormLabel('LLC_PARTNERSHIP_1065')).toContain('Form 1065');
  });

  it('should generate complete tax return binder header metadata for CPA filing', () => {
    const sampleCompany: CompanyTaxProfile = CompanyProfileEngine.INITIAL_COMPANIES[0];
    const header = CompanyProfileEngine.generateTaxBinderHeader(sampleCompany);

    expect(header.ein).toBe('84-9281742');
    expect(header.returnType).toBe('1065');
    expect(header.legalName).toBe('Apex CleanOps Commercial Services LLC');
    expect(header.naicsCode).toBe('561720');
    expect(header.totalPartnersOrShareholders).toBe(2);
    expect(header.accountingMethod).toBe('ACCRUAL');
  });

  it('should list all 50 US States plus DC and PR with default sales tax rates and SOS report deadlines', () => {
    expect(CompanyProfileEngine.STATES.length).toBe(52);
    const texas = CompanyProfileEngine.STATES.find((s) => s.code === 'TX');
    expect(texas).toBeDefined();
    expect(texas?.name).toBe('Texas');
    expect(texas?.defaultSalesTaxRate).toBe(0.0625);

    const delaware = CompanyProfileEngine.STATES.find((s) => s.code === 'DE');
    expect(delaware).toBeDefined();
    expect(delaware?.hasFranchiseTax).toBe(true);

    const california = CompanyProfileEngine.STATES.find((s) => s.code === 'CA');
    expect(california).toBeDefined();
    expect(california?.name).toBe('California');

    const florida = CompanyProfileEngine.STATES.find((s) => s.code === 'FL');
    expect(florida).toBeDefined();
    expect(florida?.defaultSalesTaxRate).toBe(0.06);
  });
});
