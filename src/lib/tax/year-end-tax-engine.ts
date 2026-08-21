import Decimal from 'decimal.js';

export interface Form1099NecRecord {
  id: string;
  recipientName: string;
  recipientTaxId: string; // SSN or EIN (XX-XXXXXXX)
  recipientType: 'INDIVIDUAL_1099' | 'LLC_DISREGARDED';
  recipientAddress: string;
  payerName: string;
  payerEin: string;
  taxYear: number;
  box1NonemployeeCompensation: number; // >= $600 threshold
  box4FederalTaxWithheld: number;
  box5StateTaxWithheld: number;
  state: string;
  statePayerNumber: string;
  status: 'READY_TO_FILE' | 'FILED_ELECTRONICALLY' | 'DRAFT';
}

export interface FormW2Record {
  id: string;
  employeeName: string;
  ssn: string;
  address: string;
  employerName: string;
  employerEin: string;
  taxYear: number;
  box1WagesTips: number;
  box2FederalIncomeTaxWithheld: number;
  box3SocialSecurityWages: number;
  box4SocialSecurityTaxWithheld: number;
  box5MedicareWages: number;
  box6MedicareTaxWithheld: number;
  box16StateWages: number;
  box17StateIncomeTaxWithheld: number;
  state: string;
  status: 'READY_TO_FILE' | 'TRANSMITTED_SSA' | 'DRAFT';
}

export interface FormW3TransmittalSummary {
  taxYear: number;
  totalW2FormsCount: number;
  totalBox1Wages: number;
  totalBox2FederalTax: number;
  totalBox3SocialSecurityWages: number;
  totalBox4SocialSecurityTax: number;
  totalBox5MedicareWages: number;
  totalBox6MedicareTax: number;
  controlNumber: string;
}

export class YearEndTaxEngine {
  public static INITIAL_1099_NEC: Form1099NecRecord[] = [
    {
      id: '1099-2026-001',
      recipientName: 'Lucas Vance (Cloud Architecture Specialist)',
      recipientTaxId: '***-**-4892',
      recipientType: 'INDIVIDUAL_1099',
      recipientAddress: '100 Congress Ave, Austin, TX 78701',
      payerName: 'Apex CleanOps & Cloud Technologies LLC',
      payerEin: '88-9214751',
      taxYear: 2026,
      box1NonemployeeCompensation: 28500.0,
      box4FederalTaxWithheld: 0.0,
      box5StateTaxWithheld: 0.0,
      state: 'TX',
      statePayerNumber: 'TX-889214751',
      status: 'READY_TO_FILE',
    },
    {
      id: '1099-2026-002',
      recipientName: 'Elena Rostova (DevOps Security Consultant)',
      recipientTaxId: '***-**-9310',
      recipientType: 'INDIVIDUAL_1099',
      recipientAddress: '555 California St, San Francisco, CA 94104',
      payerName: 'Apex CleanOps & Cloud Technologies LLC',
      payerEin: '88-9214751',
      taxYear: 2026,
      box1NonemployeeCompensation: 34200.0,
      box4FederalTaxWithheld: 0.0,
      box5StateTaxWithheld: 1026.0, // CA Backup Withholding if applicable
      state: 'CA',
      statePayerNumber: 'CA-889214751',
      status: 'READY_TO_FILE',
    },
    {
      id: '1099-2026-003',
      recipientName: 'Marcus Sterling (Facilities Supervisor)',
      recipientTaxId: '***-**-7741',
      recipientType: 'INDIVIDUAL_1099',
      recipientAddress: '350 5th Ave, New York, NY 10118',
      payerName: 'Apex CleanOps & Cloud Technologies LLC',
      payerEin: '88-9214751',
      taxYear: 2026,
      box1NonemployeeCompensation: 18400.0,
      box4FederalTaxWithheld: 0.0,
      box5StateTaxWithheld: 736.0,
      state: 'NY',
      statePayerNumber: 'NY-889214751',
      status: 'READY_TO_FILE',
    },
  ];

  public static INITIAL_W2: FormW2Record[] = [
    {
      id: 'W2-2026-001',
      employeeName: 'Sarah Jenkins (Lead Operations Dispatcher)',
      ssn: '***-**-1184',
      address: '1400 Lavaca St, Austin, TX 78701',
      employerName: 'Apex CleanOps & Cloud Technologies LLC',
      employerEin: '88-9214751',
      taxYear: 2026,
      box1WagesTips: 68000.0,
      box2FederalIncomeTaxWithheld: 7480.0,
      box3SocialSecurityWages: 68000.0,
      box4SocialSecurityTaxWithheld: 4216.0, // 6.2%
      box5MedicareWages: 68000.0,
      box6MedicareTaxWithheld: 986.0, // 1.45%
      box16StateWages: 68000.0,
      box17StateIncomeTaxWithheld: 0.0, // TX 0% state income tax
      state: 'TX',
      status: 'READY_TO_FILE',
    },
    {
      id: 'W2-2026-002',
      employeeName: 'Carlos Ramirez (Senior Janitorial Field Lead)',
      ssn: '***-**-6623',
      address: '2200 Barton Springs Rd, Austin, TX 78704',
      employerName: 'Apex CleanOps & Cloud Technologies LLC',
      employerEin: '88-9214751',
      taxYear: 2026,
      box1WagesTips: 52000.0,
      box2FederalIncomeTaxWithheld: 4680.0,
      box3SocialSecurityWages: 52000.0,
      box4SocialSecurityTaxWithheld: 3224.0,
      box5MedicareWages: 52000.0,
      box6MedicareTaxWithheld: 754.0,
      box16StateWages: 52000.0,
      box17StateIncomeTaxWithheld: 0.0,
      state: 'TX',
      status: 'READY_TO_FILE',
    },
  ];

  /**
   * Generates Form W-3 transmittal summary from a list of Form W-2 records
   */
  public static generateW3Transmittal(w2Records: FormW2Record[], taxYear: number = 2026): FormW3TransmittalSummary {
    let totalWages = new Decimal(0);
    let totalFedTax = new Decimal(0);
    let totalSsWages = new Decimal(0);
    let totalSsTax = new Decimal(0);
    let totalMedWages = new Decimal(0);
    let totalMedTax = new Decimal(0);

    w2Records.forEach((w) => {
      totalWages = totalWages.plus(new Decimal(w.box1WagesTips));
      totalFedTax = totalFedTax.plus(new Decimal(w.box2FederalIncomeTaxWithheld));
      totalSsWages = totalSsWages.plus(new Decimal(w.box3SocialSecurityWages));
      totalSsTax = totalSsTax.plus(new Decimal(w.box4SocialSecurityTaxWithheld));
      totalMedWages = totalMedWages.plus(new Decimal(w.box5MedicareWages));
      totalMedTax = totalMedTax.plus(new Decimal(w.box6MedicareTaxWithheld));
    });

    return {
      taxYear,
      totalW2FormsCount: w2Records.length,
      totalBox1Wages: totalWages.toNumber(),
      totalBox2FederalTax: totalFedTax.toNumber(),
      totalBox3SocialSecurityWages: totalSsWages.toNumber(),
      totalBox4SocialSecurityTax: totalSsTax.toNumber(),
      totalBox5MedicareWages: totalMedWages.toNumber(),
      totalBox6MedicareTax: totalMedTax.toNumber(),
      controlNumber: `W3-TX-${taxYear}-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  /**
   * Generates IRS FIRE formatted bulk export for 1099-NEC e-filing
   */
  public static generateIrsFireElectronicFile(records: Form1099NecRecord[]): string {
    const header = `T|2026|889214751|APEX CLEANOPS LLC|${records.length}|IRS_FIRE_FORMAT_V26\n`;
    const lines = records
      .map(
        (r, idx) =>
          `A|${idx + 1}|${r.recipientTaxId}|${r.recipientName}|NEC|${r.box1NonemployeeCompensation.toFixed(2)}|${r.box4FederalTaxWithheld.toFixed(2)}|${r.state}`
      )
      .join('\n');
    const footer = `\nF|${records.length}|${records.reduce((acc, r) => acc + r.box1NonemployeeCompensation, 0).toFixed(2)}`;
    return header + lines + footer;
  }
}
