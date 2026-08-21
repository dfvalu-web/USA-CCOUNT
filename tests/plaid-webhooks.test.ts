import { describe, it, expect } from 'vitest';
import { PlaidWebhookHandler } from '../src/lib/banking/plaid-webhooks';

describe('PlaidWebhookHandler (Open Banking Continuous Ingestion)', () => {
  it('should ingest and normalize transactions into positive deposits and negative outflows', () => {
    const rawEvents = [
      {
        transaction_id: 'tx-1',
        account_id: 'acc-1',
        date: '2026-08-20',
        amount: -15000, // Plaid negative = Inflow/Deposit
        name: 'STRIPE PAYOUT RET-ACME CORP',
      },
      {
        transaction_id: 'tx-2',
        account_id: 'acc-1',
        date: '2026-08-20',
        amount: 1420.50, // Plaid positive = Outflow/Disbursement
        name: 'AMAZON WEB SERVICES',
      },
    ];

    const normalized = PlaidWebhookHandler.processTransactionSync(rawEvents);
    expect(normalized.length).toBe(2);
    expect(normalized[0].amount).toBe(15000); // Converted to +15,000 in accounting
    expect(normalized[0].suggestedGlAccountCode).toBe('1200'); // A/R
    expect(normalized[1].amount).toBe(-1420.50); // Converted to -1420.50
    expect(normalized[1].suggestedGlAccountCode).toBe('5030'); // Direct Cloud
  });
});
