import { describe, it, expect } from 'vitest';
import { CompanyProfileEngine } from '@/lib/company/company-profile-engine';

describe('Global Company Multi-Entity Architecture', () => {
  it('should list all registered companies including Milla Maid Services LLC', () => {
    const list = CompanyProfileEngine.INITIAL_COMPANIES;
    expect(list.length).toBeGreaterThanOrEqual(3);

    const milla = list.find((c) => c.legalName.includes('Milla Maid'));
    expect(milla).toBeDefined();
    expect(milla?.formationState).toBe('GA');
    expect(milla?.entityType).toBe('LLC_PARTNERSHIP_1065');
    expect(milla?.stateNexusProfiles[0].stateCode).toBe('GA');
  });

  it('should provide complete tax profile and member details for active company', () => {
    const milla = CompanyProfileEngine.INITIAL_COMPANIES.find((c) => c.legalName.includes('Milla Maid'));
    expect(milla?.officersAndMembers.length).toBe(1);
    expect(milla?.officersAndMembers[0].ownershipPercentage).toBe(100);
    expect(milla?.principalAddress.city).toBe('Atlanta');
    expect(milla?.principalAddress.state).toBe('GA');
  });
});
