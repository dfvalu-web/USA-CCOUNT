import { describe, it, expect } from 'vitest';
import { SmartReconciliationEngine } from '../src/lib/accounting/smart-reconciliation-engine';
import { DoubleEntryLedgerEngine } from '../src/lib/accounting/ledger-engine';

describe('SmartReconciliationEngine (Extratos OFX/QBO/CSV, Plaid e Contabilização Automática)', () => {
  it('should parse standard OFX SGML content and identify vendor rules', () => {
    const ofxSample = `
OFXHEADER:100
DATA:OFXSGML
<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <BANKTRANLIST>
          <STMTTRN>
            <TRNTYPE>DEBIT
            <DTPOSTED>20260820120000
            <TRNAMT>-284.50
            <FITID>CHASE-TX-9921
            <NAME>ECOLAB DIRECT CHEMICALS
            <MEMO>CLEANING CHEMICALS SUPPLY
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>CREDIT
            <DTPOSTED>20260820150000
            <TRNAMT>450.00
            <FITID>CHASE-TX-9922
            <NAME>STRIPE PAYOUT
            <MEMO>CLIENT INVOICE SETTLEMENT
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

    const result = SmartReconciliationEngine.parseOfxOrQbo(ofxSample, 'chase_august.ofx');
    expect(result.fileFormat).toBe('OFX');
    expect(result.totalTransactionsFound).toBe(2);
    expect(result.totalDebits).toBe(284.50);
    expect(result.totalCredits).toBe(450.00);

    const ecolabTx = result.transactions[0];
    expect(ecolabTx.suggestedAccountCode).toBe('5020'); // Cleaning supplies rule
    expect(ecolabTx.status).toBe('RULE_MATCH_FOUND');
    expect(ecolabTx.matchConfidence).toBe(95);
  });

  it('should parse CSV bank statement with auto header detection and amount normalization', () => {
    const csvSample = `Date,Description,Debit,Credit
2026-08-19,THE HOME DEPOT PRO #6512,145.20,
2026-08-20,STRIPE PAYOUT TRANSFER,,450.00`;

    const result = SmartReconciliationEngine.parseCsv(csvSample, 'mercury.csv');
    expect(result.fileFormat).toBe('CSV');
    expect(result.totalTransactionsFound).toBe(2);
    expect(result.totalDebits).toBe(145.20);
    expect(result.totalCredits).toBe(450.00);

    const hdTx = result.transactions[0];
    expect(hdTx.amount).toBe(-145.20);
    expect(hdTx.suggestedAccountCode).toBe('5020');
  });

  it('should generate strictly balanced US GAAP double-entry journal entry from reconciled bank feed item', () => {
    const tx = {
      id: 'bnk-tx-001',
      institutionName: 'JPMorgan Chase',
      accountNumberMasked: '••••4819',
      date: '2026-08-20',
      amount: -284.50,
      rawDescription: 'ECOLAB CHEMICALS',
      payeeOrMerchant: 'Ecolab Commercial Supply',
      categorySuggested: 'Cleaning Supplies (COGS)',
      suggestedAccountCode: '5020',
      fitId: 'FIT-CHASE-9921',
      status: 'RULE_MATCH_FOUND' as const,
      matchConfidence: 98,
    };

    const je = SmartReconciliationEngine.createJournalEntryForBankFeed(
      '11111111-1111-1111-1111-111111111111',
      tx
    );

    const validation = DoubleEntryLedgerEngine.validateJournalEntry(je);
    expect(validation.isValid).toBe(true);
    expect(je.lines[0].accountId).toBe('5020');
    expect(je.lines[0].debit).toBe(284.50);
    expect(je.lines[1].accountId).toBe('1010');
    expect(je.lines[1].credit).toBe(284.50);
  });
});
