import { describe, it, expect } from 'vitest';
import {
  SoftwareMigrationEngine,
  SourceAccountRawLine,
} from '@/lib/migration/software-migration-engine';
import { CompanyProfileEngine } from '@/lib/company/company-profile-engine';

describe('SoftwareMigrationEngine (US GAAP Smart Importer & Company Auto-Registration)', () => {
  it('should auto-map standard QuickBooks accounts with high confidence', () => {
    const rawBank: SourceAccountRawLine = {
      sourceAccountCode: '1000',
      sourceAccountName: 'Chase Business Checking Account',
      sourceAccountType: 'ASSET',
      debit: 150000,
      credit: 0,
      netBalance: 150000,
    };

    const mapping = SoftwareMigrationEngine.autoMapAccount(rawBank);
    expect(mapping.targetAccountCode).toBe('1010');
    expect(mapping.targetAccountType).toBe('ASSET');
    expect(mapping.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it('should auto-map Xero expense accounts correctly', () => {
    const rawPayroll: SourceAccountRawLine = {
      sourceAccountCode: '400',
      sourceAccountName: 'Wages Expense Direct Labor',
      sourceAccountType: 'EXPENSE',
      debit: 45000,
      credit: 0,
      netBalance: 45000,
    };

    const mapping = SoftwareMigrationEngine.autoMapAccount(rawPayroll);
    expect(mapping.targetAccountCode).toBe('5010');
    expect(mapping.targetAccountType).toBe('EXPENSE');
  });

  it('should accurately validate balanced trial balances (Debits == Credits)', () => {
    const balancedLines: SourceAccountRawLine[] = [
      { sourceAccountCode: '1000', sourceAccountName: 'Cash in Bank', sourceAccountType: 'ASSET', debit: 100000, credit: 0, netBalance: 100000 },
      { sourceAccountCode: '3000', sourceAccountName: 'Owners Capital Stock', sourceAccountType: 'EQUITY', debit: 0, credit: 100000, netBalance: -100000 },
    ];

    const pkg = SoftwareMigrationEngine.processUploadedStatement(
      'Acme Holdings Corp',
      'QUICKBOOKS_ONLINE',
      'TRIAL_BALANCE',
      balancedLines
    );

    expect(pkg.isBalanced).toBe(true);
    expect(pkg.varianceAmount).toBe(0);
    expect(pkg.status).toBe('READY_TO_POST');
    expect(pkg.totalDebits).toBe(100000);
    expect(pkg.totalCredits).toBe(100000);
  });

  it('should flag unbalanced trial balances and calculate variance amount', () => {
    const unBalancedLines: SourceAccountRawLine[] = [
      { sourceAccountCode: '1000', sourceAccountName: 'Cash in Bank', sourceAccountType: 'ASSET', debit: 100000, credit: 0, netBalance: 100000 },
      { sourceAccountCode: '3000', sourceAccountName: 'Owners Capital Stock', sourceAccountType: 'EQUITY', debit: 0, credit: 90000, netBalance: -90000 },
    ];

    const pkg = SoftwareMigrationEngine.processUploadedStatement(
      'Discrepant Co',
      'XERO',
      'TRIAL_BALANCE',
      unBalancedLines
    );

    expect(pkg.isBalanced).toBe(false);
    expect(pkg.varianceAmount).toBe(10000);
    expect(pkg.status).toBe('PENDING_MAPPING');
  });

  it('should auto-register and provision a new company during migration onboarding', () => {
    const newComp = CompanyProfileEngine.autoRegisterCompanyFromMigration(
      'Vanguard CleanTech Solutions LLC',
      'TX',
      'LLC_PARTNERSHIP_1065',
      '93-8472910',
      '78701',
      'Austin'
    );

    expect(newComp.id).toMatch(/^comp-\d+/);
    expect(newComp.legalName).toBe('Vanguard CleanTech Solutions LLC');
    expect(newComp.formationState).toBe('TX');
    expect(newComp.ein).toBe('93-8472910');
    expect(newComp.principalAddress.city).toBe('Austin');
    expect(newComp.stateNexusProfiles.length).toBeGreaterThan(0);
    expect(newComp.officersAndMembers.length).toBe(1);
    expect(newComp.officersAndMembers[0].ownershipPercentage).toBe(100);
  });
});
