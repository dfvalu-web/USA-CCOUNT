import Decimal from 'decimal.js';

export interface TaxJurisdictionBreakdown {
  zipCode: string;
  city: string;
  county: string;
  state: string;
  stateRate: number;
  countyRate: number;
  cityRate: number;
  specialDistrictRate: number;
  totalCombinedRate: number;
  isServiceTaxableInJurisdiction: boolean;
}

export class GeolocatedSalesTaxEngine {
  private static JURISDICTION_DB: Record<string, TaxJurisdictionBreakdown> = {
    '10001': { zipCode: '10001', city: 'New York', county: 'New York County', state: 'NY', stateRate: 0.04, countyRate: 0.045, cityRate: 0.00375, specialDistrictRate: 0, totalCombinedRate: 0.08875, isServiceTaxableInJurisdiction: true },
    '94105': { zipCode: '94105', city: 'San Francisco', county: 'San Francisco', state: 'CA', stateRate: 0.06, countyRate: 0.0025, cityRate: 0.0125, specialDistrictRate: 0.01125, totalCombinedRate: 0.08625, isServiceTaxableInJurisdiction: false },
    '75001': { zipCode: '75001', city: 'Dallas', county: 'Dallas County', state: 'TX', stateRate: 0.0625, countyRate: 0.005, cityRate: 0.01, specialDistrictRate: 0.005, totalCombinedRate: 0.0825, isServiceTaxableInJurisdiction: true },
    '19801': { zipCode: '19801', city: 'Wilmington', county: 'New Castle', state: 'DE', stateRate: 0, countyRate: 0, cityRate: 0, specialDistrictRate: 0, totalCombinedRate: 0, isServiceTaxableInJurisdiction: false },
    '33101': { zipCode: '33101', city: 'Miami', county: 'Miami-Dade', state: 'FL', stateRate: 0.06, countyRate: 0.01, cityRate: 0, specialDistrictRate: 0, totalCombinedRate: 0.07, isServiceTaxableInJurisdiction: false },
  };

  /**
   * Looks up jurisdictional sales tax rates by 5-digit US Zip Code
   */
  public static lookupByZip(zipCode: string): TaxJurisdictionBreakdown {
    const cleanZip = zipCode.trim().substring(0, 5);
    return (
      this.JURISDICTION_DB[cleanZip] || {
        zipCode: cleanZip,
        city: 'General US Metro',
        county: 'County District',
        state: 'US',
        stateRate: 0.05,
        countyRate: 0.01,
        cityRate: 0.01,
        specialDistrictRate: 0.005,
        totalCombinedRate: 0.075,
        isServiceTaxableInJurisdiction: false,
      }
    );
  }
}
