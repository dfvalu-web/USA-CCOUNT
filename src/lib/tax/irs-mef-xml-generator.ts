import { IRSTaxReportSummary } from './irs-mapping-engine';
import { FormW2Data, Form1099NECData } from '../payroll/tax-forms-service';

export class IrsMefXmlGenerator {
  /**
   * Generates official IRS Modernized e-File (MeF) XML for Form 1065 / 1120-S
   */
  public static generateBusinessReturnXml(
    report: IRSTaxReportSummary,
    ein: string = 'XX-XXX4912',
    businessName: string = 'Apex Cloud Services LLC'
  ): string {
    const is1065 = report.entityType === 'LLC_PARTNERSHIP_1065';
    const formRootTag = is1065 ? 'IRS1065' : 'IRS1120S';

    return `<?xml version="1.0" encoding="UTF-8"?>
<Return xmlns="http://www.irs.gov/efile" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" returnVersion="${report.taxYear}v1.0">
  <ReturnHeader binaryAttachmentCnt="0">
    <ReturnTs>${new Date().toISOString()}</ReturnTs>
    <TaxPeriodEndDate>${report.taxYear}-12-31</TaxPeriodEndDate>
    <Filer>
      <EIN>${ein}</EIN>
      <BusinessName>
        <BusinessNameLine1Txt>${businessName}</BusinessNameLine1Txt>
      </BusinessName>
    </Filer>
    <BusinessReturnPriorYearGrossReceiptsAmt>${report.grossReceipts.toFixed(2)}</BusinessReturnPriorYearGrossReceiptsAmt>
  </ReturnHeader>
  <ReturnData documentCnt="1">
    <${formRootTag} documentId="${formRootTag}-Doc-001">
      <TaxYear>${report.taxYear}</TaxYear>
      <GrossReceiptsOrSalesAmt>${report.grossReceipts.toFixed(2)}</GrossReceiptsOrSalesAmt>
      <CostOfLaborServicesAmt>${report.costOfLaborServices.toFixed(2)}</CostOfLaborServicesAmt>
      <GrossProfitAmt>${report.grossProfit.toFixed(2)}</GrossProfitAmt>
      <TotalDeductionsAmt>${report.totalDeductions.toFixed(2)}</TotalDeductionsAmt>
      <OrdinaryBusinessIncomeLossAmt>${report.ordinaryBusinessIncome.toFixed(2)}</OrdinaryBusinessIncomeLossAmt>
      <TaxAccountingMethodCd>ACCRUAL</TaxAccountingMethodCd>
      <PrincipalActivityCd>541511</PrincipalActivityCd>
    </${formRootTag}>
  </ReturnData>
</Return>`;
  }

  /**
   * Generates IRS IRIS / FIRE format XML for 1099-NEC Nonemployee Compensation
   */
  public static generate1099NecXml(necData: Form1099NECData): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Form1099NEC xmlns="http://www.irs.gov/efile" taxYear="${necData.taxYear}">
  <PayerEIN>${necData.payerEin}</PayerEIN>
  <PayerName>${necData.payerName}</PayerName>
  <RecipientTIN>${necData.recipientTin}</RecipientTIN>
  <RecipientName>${necData.recipientName}</RecipientName>
  <NonemployeeCompensationAmt>${necData.box1NonemployeeCompensation.toFixed(2)}</NonemployeeCompensationAmt>
  <FederalIncomeTaxWithheldAmt>${necData.box4FederalIncomeTaxWithheld.toFixed(2)}</FederalIncomeTaxWithheldAmt>
  <StateCode>${necData.box6State}</StateCode>
</Form1099NEC>`;
  }

  /**
   * Generates SSA / IRS EFW2 XML for W-2 Wage & Tax Statements
   */
  public static generateW2Xml(w2Data: FormW2Data): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<W2WageAndTaxStatement xmlns="http://www.irs.gov/efile" taxYear="${w2Data.taxYear}">
  <EmployerEIN>${w2Data.employerEin}</EmployerEIN>
  <EmployerName>${w2Data.employerName}</EmployerName>
  <EmployeeSSN>${w2Data.employeeSsn}</EmployeeSSN>
  <EmployeeName>${w2Data.employeeName}</EmployeeName>
  <WagesTipsOtherCompAmt>${w2Data.box1WagesTips.toFixed(2)}</WagesTipsOtherCompAmt>
  <FederalIncomeTaxWithheldAmt>${w2Data.box2FederalIncomeTax.toFixed(2)}</FederalIncomeTaxWithheldAmt>
  <SocialSecurityWagesAmt>${w2Data.box3SocialSecurityWages.toFixed(2)}</SocialSecurityWagesAmt>
  <SocialSecurityTaxWithheldAmt>${w2Data.box4SocialSecurityTax.toFixed(2)}</SocialSecurityTaxWithheldAmt>
  <MedicareWagesAndTipsAmt>${w2Data.box5MedicareWages.toFixed(2)}</MedicareWagesAndTipsAmt>
  <MedicareTaxWithheldAmt>${w2Data.box6MedicareTax.toFixed(2)}</MedicareTaxWithheldAmt>
  <StateAbbreviationCd>${w2Data.box15State}</StateAbbreviationCd>
  <StateWagesAmt>${w2Data.box16StateWages.toFixed(2)}</StateWagesAmt>
  <StateIncomeTaxAmt>${w2Data.box17StateIncomeTax.toFixed(2)}</StateIncomeTaxAmt>
</W2WageAndTaxStatement>`;
  }
}
