'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandMenu } from '@/components/ui/CommandMenu';
import { ExecutiveCockpit } from '@/components/dashboard/ExecutiveCockpit';
import { TrialBalanceTable } from '@/components/accounting/TrialBalanceTable';
import { GeneralLedgerView } from '@/components/accounting/GeneralLedgerView';
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
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { FinancialStatementsEngine, AccountWithLines } from '@/lib/accounting/financial-statements';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

import { useFiscalPeriod, getFiscalDateRange } from '@/lib/period/fiscal-period-context';
import { useCompany } from '@/lib/company/company-context';
import { CompanyLedgerEngine } from '@/lib/accounting/company-ledger-data';

export function normalizeTabId(rawTab: string): string {
  const clean = (rawTab || '').toLowerCase().trim().replace(/^\//, '');
  switch (clean) {
    case '':
    case 'dashboard':
    case 'cockpit':
      return 'dashboard';
    case 'general-ledger':
    case 'razao':
    case 'livro-razao':
      return 'general-ledger';
    case 'trial-balance':
    case 'balancete':
    case 'modulo-contabil':
    case 'balancete-verificacao':
      return 'trial-balance';
    case 'income-statement':
    case 'dre':
    case 'demonstrativos':
    case 'demonstracao-resultado':
      return 'income-statement';
    case 'balance-sheet':
    case 'balanco':
    case 'balanco-patrimonial':
      return 'balance-sheet';
    case 'journal-entries':
    case 'diario':
    case 'livro-diario':
      return 'journal-entries';
    case 'bank-reconciliation':
    case 'conciliacao':
    case 'conciliacao-bancaria':
      return 'bank-reconciliation';
    case 'software-migration':
    case 'migration':
    case 'importacao':
    case 'importar-software':
      return 'software-migration';
    case 'multi-currency':
    case 'fx':
    case 'cambio':
      return 'multi-currency';
    case 'chart-of-accounts':
    case 'plano-de-contas':
      return 'chart-of-accounts';
    case 'directory':
    case 'cadastros':
    case 'clientes':
    case 'fornecedores':
    case 'equipe':
      return 'directory';
    case 'client-portal':
    case 'portal-cliente':
    case 'faturas-cliente':
      return 'client-portal';
    case 'service-catalog':
    case 'catalogo':
    case 'servicos':
      return 'service-catalog';
    case 'invoicing':
    case 'faturamento':
    case 'faturas':
      return 'invoicing';
    case 'scheduling':
    case 'modulo-agendamento':
    case 'agendamento':
    case 'cleaning-dispatch':
      return 'scheduling';
    case 'payroll':
    case 'modulo-dp':
    case 'folha':
    case 'departamento-pessoal':
      return 'payroll';
    case 'worker-portal':
    case 'portal-colaborador':
    case 'contracts':
    case 'contratos':
    case 'e-sign':
      return 'worker-portal';
    case 'banking-disbursements':
    case 'banking':
    case 'aprovacao-bancaria':
      return 'banking-disbursements';
    case 'company-profile':
    case 'empresas':
    case 'cadastro-empresa':
      return 'company-profile';
    case 'partners':
    case 'socios':
    case 'quadro-societario':
      return 'partners';
    case 'year-end-tax':
    case 'irs-forms':
    case 'fechamento-anual':
      return 'year-end-tax';
    case 'tax-compliance':
    case 'modulo-fiscal':
    case 'compliance-fiscal':
    case 'impostos':
      return 'tax-compliance';
    case 'state-taxes':
    case 'franchise-tax':
    case 'taxas-estaduais':
      return 'state-taxes';
    case 'multi-entity':
    case 'consolidacao':
    case 'holding':
      return 'multi-entity';
    case 'audit-trail':
    case 'auditoria':
    case 'soc2':
      return 'audit-trail';
    case 'reports':
    case 'modulo-bi':
    case 'monte-carlo':
    case 'unit-economics':
    case 'bi':
    case 'inteligencia-financeira':
      return 'reports';
    case 'budget-variance':
    case 'orcamento':
    case 'budget':
      return 'budget-variance';
    case 'system-audit':
    case 'auditoria-sistema':
    case 'auditoria-geral':
    case 'health-check':
      return 'system-audit';
    case 'sandbox':
    case 'ambiente-sandbox':
    case 'staging':
    case 'isolamento':
      return 'sandbox';
    case 'settings':
    case 'configuracoes':
      return 'settings';
    default:
      return clean || 'dashboard';
  }
}

interface AppShellProps {
  initialTab?: string;
}

export function AppShell({ initialTab = 'dashboard' }: AppShellProps) {
  const { locale, t, basis } = useI18n();
  const { activeCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<string>(() => normalizeTabId(initialTab));
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // Dynamic ledger state initialized and synchronized per active company
  const [accountsState, setAccountsState] = useState<AccountWithLines[]>(() =>
    CompanyLedgerEngine.getAccountsForCompany(activeCompany?.id || '', activeCompany?.legalName)
  );
  const [journalEntriesList, setJournalEntriesList] = useState<Array<{
    id: string;
    date: string;
    memo: string;
    amount: number;
    basis: string;
    status: string;
  }>>(() =>
    CompanyLedgerEngine.getJournalEntriesForCompany(activeCompany?.id || '', activeCompany?.legalName)
  );

  // Sincroniza imediatamente o livro-razão e as demonstrações contábeis ao alternar a empresa
  useEffect(() => {
    if (activeCompany) {
      const companyAccounts = CompanyLedgerEngine.getAccountsForCompany(
        activeCompany.id,
        activeCompany.legalName
      );
      const companyEntries = CompanyLedgerEngine.getJournalEntriesForCompany(
        activeCompany.id,
        activeCompany.legalName
      );
      setAccountsState(companyAccounts);
      setJournalEntriesList(companyEntries);
    }
  }, [activeCompany]);

  // Sync if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTabId(initialTab));
    }
  }, [initialTab]);

  // Synchronize activeTab from window URL pathname on load and popstate
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\//, '');
        if (path) {
          setActiveTab(normalizeTabId(path));
        }
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const handleTabChange = useCallback((newTab: string) => {
    const target = normalizeTabId(newTab);
    setActiveTab(target);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', `/${target}`);
    }
  }, []);

  const { fiscalYear, selectedMonths } = useFiscalPeriod();

  // Recalculate financial reports dynamically based on active company, basis, and selected fiscal period (Year & Months)
  const reports = useMemo(() => {
    const { startDate, endDate } = getFiscalDateRange(fiscalYear, selectedMonths);

    const trialBalance = DoubleEntryLedgerEngine.generateTrialBalance(
      accountsState.map((acc) => ({
        code: acc.code,
        name: acc.name,
        type: acc.type,
        lines: acc.lines.filter((l) => {
          if (basis === 'CASH' && l.basis === 'ACCRUAL') return false;
          const dStr = typeof l.date === 'string' ? l.date : l.date.toISOString().split('T')[0];
          return dStr <= endDate;
        }),
      })),
      basis,
      endDate
    );

    const incomeStatement = FinancialStatementsEngine.generateIncomeStatement(
      accountsState,
      startDate,
      endDate,
      basis,
      selectedMonths,
      fiscalYear
    );

    const balanceSheet = FinancialStatementsEngine.generateBalanceSheet(
      accountsState,
      endDate,
      basis,
      incomeStatement.netIncome
    );

    return { trialBalance, incomeStatement, balanceSheet };
  }, [accountsState, basis, fiscalYear, selectedMonths]);

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
          {activeTab === 'general-ledger' && (
            <div className="space-y-6">
              <GeneralLedgerView />
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
          {activeTab === 'scheduling' && (
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
                  <span className="text-white font-medium">{activeCompany?.legalName || 'Apex Cloud Services LLC'}</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300">Jurisdiction & Entity Structure</span>
                  <span className="text-white font-medium">{activeCompany?.formationState || 'Delaware'} LLC (Form 1065)</span>
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

          {/* Safety Fallback: if activeTab is not matched, render ExecutiveCockpit */}
          {![
            'dashboard',
            'trial-balance',
            'general-ledger',
            'income-statement',
            'balance-sheet',
            'chart-of-accounts',
            'multi-currency',
            'directory',
            'service-catalog',
            'invoicing',
            'payroll',
            'worker-portal',
            'banking-disbursements',
            'company-profile',
            'partners',
            'tax-compliance',
            'state-taxes',
            'audit-trail',
            'scheduling',
            'reports',
            'bank-reconciliation',
            'software-migration',
            'journal-entries',
            'system-audit',
            'sandbox',
            'year-end-tax',
            'client-portal',
            'budget-variance',
            'multi-entity',
            'settings',
          ].includes(activeTab) && (
            <div className="space-y-6">
              <ExecutiveCockpit onNavigateTab={handleTabChange} />
            </div>
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
  );
}
