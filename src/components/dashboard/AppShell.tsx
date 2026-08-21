'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandMenu } from '@/components/ui/CommandMenu';
import { ExecutiveCockpit } from '@/components/dashboard/ExecutiveCockpit';
import { TrialBalanceTable } from '@/components/accounting/TrialBalanceTable';
import { IncomeStatementView } from '@/components/accounting/IncomeStatementView';
import { BalanceSheetView } from '@/components/accounting/BalanceSheetView';
import { ChartOfAccountsView } from '@/components/accounting/ChartOfAccountsView';
import { JournalEntriesView } from '@/components/accounting/JournalEntriesView';
import { FixedAssetsView } from '@/components/accounting/FixedAssetsView';
import { InvoicingView } from '@/components/accounting/InvoicingView';
import { BankReconciliationView } from '@/components/accounting/BankReconciliationView';
import { SmartReconciliationHub } from '@/components/accounting/SmartReconciliationHub';
import { ReceiptOcrScanner } from '@/components/ai/ReceiptOcrScanner';
import { PlaidWebhooksConsole } from '@/components/banking/PlaidWebhooksConsole';
import { PayrollView } from '@/components/payroll/PayrollView';
import { OnboardingW4W9View } from '@/components/payroll/OnboardingW4W9View';
import { TaxComplianceView } from '@/components/tax/TaxComplianceView';
import { CompanyProfileView } from '@/components/company/CompanyProfileView';
import { StateFranchiseTaxView } from '@/components/tax/StateFranchiseTaxView';
import { CpaTaxBinderView } from '@/components/tax/CpaTaxBinderView';
import { SchedulingView } from '@/components/scheduling/SchedulingView';
import { CalendarSyncView } from '@/components/scheduling/CalendarSyncView';
import { TimesheetApprovalView } from '@/components/scheduling/TimesheetApprovalView';
import { CleaningSchedulingView } from '@/components/scheduling/CleaningSchedulingView';
import { ServiceCatalogView } from '@/components/scheduling/ServiceCatalogView';
import { EntityDirectoryView } from '@/components/directory/EntityDirectoryView';
import { WorkerPortalView } from '@/components/portal/WorkerPortalView';
import { ContractSignView } from '@/components/contracts/ContractSignView';
import { BankingDisbursementsView } from '@/components/banking/BankingDisbursementsView';
import { MultiCurrencyView } from '@/components/fx/MultiCurrencyView';
import { AuditTrailSecurityView } from '@/components/security/AuditTrailSecurityView';
import { BiAnalyticsView } from '@/components/bi/BiAnalyticsView';
import { SensitivityAnalysisMatrix } from '@/components/bi/SensitivityAnalysisMatrix';
import { CfaAiCopilotChat } from '@/components/bi/CfaAiCopilotChat';
import { SoftwareMigrationView } from '@/components/migration/SoftwareMigrationView';
import { SystemAuditView } from '@/components/audit/SystemAuditView';
import { CompanySandboxView } from '@/components/sandbox/CompanySandboxView';
import { YearEndTaxFormsView } from '@/components/tax/YearEndTaxFormsView';
import { ClientPortalView } from '@/components/portal/ClientPortalView';
import { BudgetVarianceView } from '@/components/budget/BudgetVarianceView';
import { MultiEntityConsolidationView } from '@/components/company/MultiEntityConsolidationView';
import { NewJournalEntryModal } from '@/components/accounting/NewJournalEntryModal';
import { SAMPLE_LEDGER_ACCOUNTS } from '@/lib/accounting/sample-data';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { FinancialStatementsEngine, AccountWithLines } from '@/lib/accounting/financial-statements';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';

import { FiscalPeriodProvider } from '@/lib/period/fiscal-period-context';

interface AppShellProps {
  initialTab?: string;
}

export function AppShell({ initialTab = 'dashboard' }: AppShellProps) {
  const { locale, t, basis } = useI18n();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // Sync if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Synchronize activeTab from window URL pathname on load and popstate
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\//, '');
        if (path) {
          if (path === 'modulo-contabil') setActiveTab('trial-balance');
          else if (path === 'modulo-dp') setActiveTab('payroll');
          else if (path === 'modulo-fiscal' || path === 'tax-compliance' || path === 'compliance-fiscal' || path === 'impostos') setActiveTab('tax-compliance');
          else if (path === 'state-taxes' || path === 'franchise-tax' || path === 'taxas-estaduais') setActiveTab('state-taxes');
          else if (path === 'audit-trail' || path === 'auditoria' || path === 'soc2') setActiveTab('audit-trail');
          else if (path === 'modulo-agendamento') setActiveTab('scheduling');
          else if (path === 'modulo-bi' || path === 'monte-carlo' || path === 'unit-economics' || path === 'bi' || path === 'reports' || path === 'inteligencia-financeira') setActiveTab('reports');
          else if (path === 'partners' || path === 'socios' || path === 'quadro-societario') setActiveTab('partners');
          else if (path === 'portal-colaborador' || path === 'worker-portal' || path === 'contracts' || path === 'contratos' || path === 'e-sign') setActiveTab('worker-portal');
          else if (path === 'banking' || path === 'banking-disbursements' || path === 'aprovacao-bancaria') setActiveTab('banking-disbursements');
          else if (path === 'software-migration' || path === 'migration' || path === 'importacao' || path === 'importar-software') setActiveTab('software-migration');
          else if (path === 'system-audit' || path === 'auditoria-sistema' || path === 'auditoria-geral' || path === 'health-check') setActiveTab('system-audit');
          else if (path === 'sandbox' || path === 'ambiente-sandbox' || path === 'staging' || path === 'isolamento') setActiveTab('sandbox');
          else if (path === 'year-end-tax' || path === 'irs-forms' || path === 'fechamento-anual') setActiveTab('year-end-tax');
          else if (path === 'client-portal' || path === 'portal-cliente' || path === 'faturas-cliente') setActiveTab('client-portal');
          else if (path === 'budget-variance' || path === 'orcamento' || path === 'budget') setActiveTab('budget-variance');
          else if (path === 'multi-entity' || path === 'consolidacao' || path === 'holding') setActiveTab('multi-entity');
          else setActiveTab(path);
        }
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', `/${newTab}`);
    }
  };

  // Dynamic ledger state
  const [accountsState, setAccountsState] = useState<AccountWithLines[]>(SAMPLE_LEDGER_ACCOUNTS);
  const [journalEntriesList, setJournalEntriesList] = useState<Array<{
    id: string;
    date: string;
    memo: string;
    amount: number;
    basis: string;
    status: string;
  }>>([
    { id: 'JE-2026-0001', date: '2026-01-01', memo: 'Initial Capital Contribution', amount: 325000, basis: 'BOTH', status: 'POSTED' },
    { id: 'JE-2026-0002', date: '2026-01-05', memo: 'Purchase of Engineering Workstations', amount: 24000, basis: 'BOTH', status: 'POSTED' },
    { id: 'JE-2026-0003', date: '2026-02-01', memo: 'Client Invoiced Revenue - Q1 Retainers', amount: 210000, basis: 'ACCRUAL', status: 'POSTED' },
    { id: 'JE-2026-0004', date: '2026-03-15', memo: 'Collection of Invoiced Client Accounts', amount: 150000, basis: 'BOTH', status: 'POSTED' },
    { id: 'JE-2026-0005', date: '2026-03-31', memo: 'Direct Contractor Engineering Fees (1099)', amount: 45000, basis: 'BOTH', status: 'POSTED' },
  ]);

  // Recalculate financial reports dynamically based on current basis and ledger lines
  const reports = useMemo(() => {
    const trialBalance = DoubleEntryLedgerEngine.generateTrialBalance(
      accountsState.map((acc) => ({
        code: acc.code,
        name: acc.name,
        type: acc.type,
        lines: acc.lines.filter((l) => basis === 'ACCRUAL' || l.basis !== 'ACCRUAL'),
      })),
      basis
    );

    const incomeStatement = FinancialStatementsEngine.generateIncomeStatement(
      accountsState,
      '2026-01-01',
      '2026-12-31',
      basis
    );

    const balanceSheet = FinancialStatementsEngine.generateBalanceSheet(
      accountsState,
      '2026-12-31',
      basis,
      incomeStatement.netIncome
    );

    return { trialBalance, incomeStatement, balanceSheet };
  }, [accountsState, basis]);

  // Handler for adding new journal entry
  const handleEntrySuccess = (entry: any) => {
    if (!entry) return;
    const newEntryNumber = `JE-2026-000${journalEntriesList.length + 1}`;
    const totalAmount = entry.lines.reduce((acc: number, l: any) => acc + (l.debit || 0), 0);

    const updatedAccounts = accountsState.map((acc) => {
      const matchingLines = entry.lines.filter((l: any) => l.accountId === acc.code);
      if (matchingLines.length === 0) return acc;

      const newLines = matchingLines.map((ml: any) => ({
        debit: ml.debit,
        credit: ml.credit,
        date: entry.date,
        basis: entry.basis,
      }));

      return {
        ...acc,
        lines: [...acc.lines, ...newLines],
      };
    });

    setAccountsState(updatedAccounts);
    setJournalEntriesList([
      {
        id: newEntryNumber,
        date: typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString().split('T')[0],
        memo: entry.memo,
        amount: totalAmount,
        basis: entry.basis,
        status: 'POSTED',
      },
      ...journalEntriesList,
    ]);
  };

  return (
    <FiscalPeriodProvider>
      <div className="min-h-screen flex flex-col bg-slate-950">
        {/* Top Header */}
        <Header
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
          onOpenNewEntry={() => setIsNewEntryOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Dynamic Page Content */}
          <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <ExecutiveCockpit onNavigateTab={handleTabChange} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReceiptOcrScanner onPostSuccess={handleEntrySuccess} />
                <CfaAiCopilotChat />
              </div>
            </div>
          )}
          {activeTab === 'trial-balance' && (
            <div className="space-y-6">
              <TrialBalanceTable data={reports.trialBalance} />
              <FixedAssetsView onPostDepreciation={handleEntrySuccess} />
            </div>
          )}
          {activeTab === 'income-statement' && <IncomeStatementView data={reports.incomeStatement} />}
          {activeTab === 'balance-sheet' && <BalanceSheetView data={reports.balanceSheet} />}
          {activeTab === 'chart-of-accounts' && <ChartOfAccountsView />}
          {activeTab === 'multi-currency' && <MultiCurrencyView onRevaluationSuccess={handleEntrySuccess} />}
          {activeTab === 'directory' && <EntityDirectoryView />}
          {activeTab === 'service-catalog' && <ServiceCatalogView />}
          {activeTab === 'invoicing' && <InvoicingView onPostPaymentAccounting={handleEntrySuccess} />}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <PayrollView onPostPayrollAccounting={handleEntrySuccess} />
            </div>
          )}
          {activeTab === 'worker-portal' && (
            <div className="space-y-6">
              <WorkerPortalView />
              <ContractSignView />
            </div>
          )}
          {activeTab === 'banking-disbursements' && <BankingDisbursementsView />}
          {activeTab === 'company-profile' && <CompanyProfileView />}
          {activeTab === 'partners' && <CompanyProfileView initialTab="officers" />}
          {activeTab === 'tax-compliance' && (
            <div className="space-y-6">
              <TaxComplianceView />
              <CpaTaxBinderView />
            </div>
          )}
          {activeTab === 'state-taxes' && <StateFranchiseTaxView />}
          {activeTab === 'audit-trail' && <AuditTrailSecurityView />}
          {(activeTab === 'scheduling' || activeTab === 'cleaning-dispatch') && (
            <div className="space-y-6">
              <CleaningSchedulingView onPostJobAccounting={handleEntrySuccess} />
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <BiAnalyticsView />
            </div>
          )}
          {activeTab === 'bank-reconciliation' && (
            <div className="space-y-6">
              <SmartReconciliationHub onPostJournalEntry={handleEntrySuccess} />
            </div>
          )}
          {activeTab === 'software-migration' && (
            <div className="space-y-6">
              <SoftwareMigrationView />
            </div>
          )}
          {activeTab === 'journal-entries' && (
            <div className="space-y-6">
              <JournalEntriesView
                journalEntries={journalEntriesList}
                onOpenNewEntryModal={() => setIsNewEntryOpen(true)}
              />
            </div>
          )}
          {activeTab === 'system-audit' && (
            <div className="space-y-6">
              <SystemAuditView />
            </div>
          )}
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              <CompanySandboxView />
            </div>
          )}
          {activeTab === 'year-end-tax' && (
            <div className="space-y-6">
              <YearEndTaxFormsView />
            </div>
          )}
          {activeTab === 'client-portal' && (
            <div className="space-y-6">
              <ClientPortalView />
            </div>
          )}
          {activeTab === 'budget-variance' && (
            <div className="space-y-6">
              <BudgetVarianceView />
            </div>
          )}
          {activeTab === 'multi-entity' && (
            <div className="space-y-6">
              <MultiEntityConsolidationView />
            </div>
          )}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('nav.settings')}</CardTitle>
                <CardDescription>
                  Organization Tax Profile, Multi-currency, and Accounting Preferences
                </CardDescription>
              </CardHeader>
              <div className="space-y-4 max-w-xl text-xs">
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Entity Legal Name</span>
                  <span className="text-white font-medium">Apex Cloud Services LLC</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Jurisdiction & Entity Structure</span>
                  <span className="text-white font-medium">Delaware LLC (Treated as Partnership / 1065)</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Tax Accounting Basis</span>
                  <span className="text-emerald-400 font-medium">{basis} Basis</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Functional & Reporting Currency</span>
                  <span className="text-white font-mono font-medium">USD ($)</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Phase 1 Compliance Engine</span>
                  <span className="text-emerald-400 font-medium">ASC 606 & US GAAP (Service Businesses)</span>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* Command Menu Modal */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onOpenNewEntry={() => setIsNewEntryOpen(true)}
      />

      {/* New Journal Entry Modal */}
      <NewJournalEntryModal
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        onSuccess={handleEntrySuccess}
      />
    </div>
    </FiscalPeriodProvider>
  );
}
