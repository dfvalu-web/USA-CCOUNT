import { describe, it, expect } from 'vitest';
import { IrsMefXmlGenerator } from '../src/lib/tax/irs-mef-xml-generator';
import { GeolocatedSalesTaxEngine } from '../src/lib/tax/geolocated-sales-tax';
import { IRSMappingEngine } from '../src/lib/tax/irs-mapping-engine';
import { SAMPLE_LEDGER_ACCOUNTS } from '../src/lib/accounting/sample-data';

describe('IRS Modernized e-File (MeF) XML & Geolocated Tax Engine', () => {
  it('should generate valid XML structure for Form 1065 return with required IRS tags', () => {
    const report = IRSMappingEngine.mapToIRSForm(SAMPLE_LEDGER_ACCOUNTS, 'LLC_PARTNERSHIP_1065', 2026);
    const xml = IrsMefXmlGenerator.generateBusinessReturnXml(report, 'XX-XXX4912', 'Apex Cloud Services LLC');

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<Return xmlns="http://www.irs.gov/efile"');
    expect(xml).toContain('<IRS1065 documentId="IRS1065-Doc-001">');
    expect(xml).toContain('<GrossReceiptsOrSalesAmt>');
    expect(xml).toContain('<OrdinaryBusinessIncomeLossAmt>');
    expect(xml).toContain('</Return>');
  });

  it('should generate valid XML for 1099-NEC nonemployee compensation', () => {
    const xml = IrsMefXmlGenerator.generate1099NecXml({
      taxYear: 2026,
      payerEin: 'XX-XXX4912',
      payerName: 'Apex Cloud Services LLC',
      recipientTin: 'XXX-XX-1111',
      recipientName: 'Elena Rostova',
      recipientAddress: 'Miami, FL',
      box1NonemployeeCompensation: 57600,
      box4FederalIncomeTaxWithheld: 0,
      box5StateTaxWithheld: 0,
      box6State: 'FL',
    });

    expect(xml).toContain('<Form1099NEC xmlns="http://www.irs.gov/efile"');
    expect(xml).toContain('<NonemployeeCompensationAmt>57600.00</NonemployeeCompensationAmt>');
  });

  it('should perform geolocated sales tax lookup by zip code for NYC and Dallas', () => {
    const nyc = GeolocatedSalesTaxEngine.lookupByZip('10001');
    expect(nyc.state).toBe('NY');
    expect(nyc.totalCombinedRate).toBe(0.08875);
    expect(nyc.isServiceTaxableInJurisdiction).toBe(true);

    const dallas = GeolocatedSalesTaxEngine.lookupByZip('75001');
    expect(dallas.state).toBe('TX');
    expect(dallas.totalCombinedRate).toBe(0.0825);
  });
});
