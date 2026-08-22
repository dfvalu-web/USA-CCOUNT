import { describe, it, expect } from 'vitest';
import { EntityDirectoryEngine } from '../src/lib/directory/entity-directory-engine';
import { InvoicingService } from '../src/lib/accounting/invoicing-service';

describe('Multi-Tenant Dynamic Synchronization & Company Partitioning', () => {
  it('should isolate clients strictly per active company', () => {
    const millaClients = EntityDirectoryEngine.getClientsForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(millaClients.length).toBeGreaterThan(0);
    expect(millaClients.some((c) => c.name.includes('Buckhead') || c.stateCode === 'GA')).toBe(true);
    expect(millaClients.some((c) => c.name.includes('Austin Tech Hub'))).toBe(false);

    const apexTxClients = EntityDirectoryEngine.getClientsForCompany('cmp-apex-cleanops-tx', 'Apex CleanOps Commercial Services LLC');
    expect(apexTxClients.length).toBeGreaterThan(0);
    expect(apexTxClients.some((c) => c.name.includes('Austin Tech Hub') || c.stateCode === 'TX')).toBe(true);
    expect(apexTxClients.some((c) => c.name.includes('Buckhead'))).toBe(false);

    const apexCloudClients = EntityDirectoryEngine.getClientsForCompany('cmp-apex-cloud-de', 'Apex Cloud Technologies Inc.');
    expect(apexCloudClients.length).toBeGreaterThan(0);
    expect(apexCloudClients.some((c) => c.name.includes('NovaTech') || c.name.includes('SoHo'))).toBe(true);
    expect(apexCloudClients.some((c) => c.name.includes('Austin Tech Hub'))).toBe(false);
  });

  it('should isolate workers/crews per active company', () => {
    const millaWorkers = EntityDirectoryEngine.getWorkersForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(millaWorkers.some((w) => w.workState === 'GA')).toBe(true);

    const apexTxWorkers = EntityDirectoryEngine.getWorkersForCompany('cmp-apex-cleanops-tx', 'Apex CleanOps Commercial Services LLC');
    expect(apexTxWorkers.some((w) => w.workState === 'TX')).toBe(true);

    const cloudWorkers = EntityDirectoryEngine.getWorkersForCompany('cmp-apex-cloud-de', 'Apex Cloud Technologies Inc.');
    expect(cloudWorkers.some((w) => w.department === 'ENGINEERING')).toBe(true);
  });

  it('should isolate invoices and Accounts Receivable per active company', () => {
    const millaInvoices = InvoicingService.getInvoicesForCompany('cmp-milla-maid-ga', 'Milla Maid Services LLC');
    expect(millaInvoices.length).toBeGreaterThan(0);
    expect(millaInvoices.some((i) => i.contactName.includes('Buckhead') || i.contactName.includes('Midtown'))).toBe(true);
    expect(millaInvoices.some((i) => i.contactName.includes('Austin Tech Hub'))).toBe(false);

    const apexTxInvoices = InvoicingService.getInvoicesForCompany('cmp-apex-cleanops-tx', 'Apex CleanOps Commercial Services LLC');
    expect(apexTxInvoices.some((i) => i.contactName.includes('Austin Tech Hub'))).toBe(true);
    expect(apexTxInvoices.some((i) => i.contactName.includes('Buckhead'))).toBe(false);

    const cloudInvoices = InvoicingService.getInvoicesForCompany('cmp-apex-cloud-de', 'Apex Cloud Technologies Inc.');
    expect(cloudInvoices.some((i) => i.contactName.includes('NovaTech') || i.contactName.includes('SoHo'))).toBe(true);
  });
});
