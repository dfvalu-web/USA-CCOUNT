import { describe, it, expect } from 'vitest';
import { UsZipLookupEngine } from '@/lib/directory/us-zip-lookup-engine';

describe('UsZipLookupEngine (US Postal & Sales Tax Rate Directory)', () => {
  it('should accurately resolve Texas ZIP code 78701 (Austin TX) with 8.25% tax rate', () => {
    const data = UsZipLookupEngine.lookupZip('78701');
    expect(data).toBeDefined();
    expect(data?.city).toBe('Austin');
    expect(data?.state).toBe('TX');
    expect(data?.county).toBe('Travis County');
    expect(data?.combinedSalesTaxRate).toBe(0.0825);
  });

  it('should accurately resolve California ZIP code 90210 (Beverly Hills CA) with 9.5% tax rate', () => {
    const data = UsZipLookupEngine.lookupZip('90210');
    expect(data).toBeDefined();
    expect(data?.city).toBe('Beverly Hills');
    expect(data?.state).toBe('CA');
    expect(data?.combinedSalesTaxRate).toBe(0.095);
  });

  it('should accurately resolve Delaware ZIP code 19801 (Wilmington DE) with 0% state sales tax', () => {
    const data = UsZipLookupEngine.lookupZip('19801');
    expect(data).toBeDefined();
    expect(data?.city).toBe('Wilmington');
    expect(data?.state).toBe('DE');
    expect(data?.combinedSalesTaxRate).toBe(0.0);
  });

  it('should gracefully fallback for known state prefix patterns', () => {
    const txFallback = UsZipLookupEngine.lookupZip('75099');
    expect(txFallback).toBeDefined();
    expect(txFallback?.state).toBe('TX');
    expect(txFallback?.combinedSalesTaxRate).toBe(0.0825);
  });
});
