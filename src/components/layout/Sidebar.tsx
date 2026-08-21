'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  LayoutDashboard,
  BookOpen,
  ListTree,
  FileSpreadsheet,
  Scale,
  TrendingUp,
  Receipt,
  Users2,
  Landmark,
  Clock,
  Settings,
  ShieldCheck,
  Globe,
  Lock,
  UserCheck,
  Fingerprint,
  Sparkles,
  Package,
  Building2,
  ArrowRightLeft,
  FlaskConical,
  FileText,
  Target,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useI18n();

  const menuSections = [
    {
      title: 'US GAAP Accounting',
      items: [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'general-ledger', label: t('nav.generalLedger'), icon: BookOpen },
        { id: 'trial-balance', label: t('nav.trialBalance'), icon: Scale },
        { id: 'income-statement', label: t('nav.incomeStatement'), icon: TrendingUp },
        { id: 'balance-sheet', label: t('nav.balanceSheet'), icon: FileSpreadsheet },
        { id: 'journal-entries', label: t('nav.journalEntries'), icon: BookOpen },
        { id: 'bank-reconciliation', label: t('nav.bankReconciliation'), icon: Landmark },
        { id: 'software-migration', label: t('nav.softwareMigration'), icon: ArrowRightLeft },
        { id: 'multi-currency', label: t('nav.multiCurrency'), icon: Globe },
        { id: 'chart-of-accounts', label: t('nav.chartOfAccounts'), icon: ListTree },
      ],
    },
    {
      title: 'Service Operations',
      items: [
        { id: 'directory', label: t('nav.directory'), icon: Users2 },
        { id: 'client-portal', label: t('nav.clientPortal'), icon: Globe },
        { id: 'service-catalog', label: t('nav.serviceCatalog'), icon: Package },
        { id: 'invoicing', label: t('nav.invoicing'), icon: Receipt },
        { id: 'scheduling', label: t('nav.scheduling'), icon: Clock },
        { id: 'payroll', label: t('nav.payroll'), icon: Users2 },
        { id: 'worker-portal', label: t('nav.workerPortal'), icon: UserCheck },
        { id: 'banking-disbursements', label: t('nav.bankingDisbursements'), icon: Lock },
      ],
    },
    {
      title: 'Tax & Compliance',
      items: [
        { id: 'company-profile', label: t('nav.companyProfile'), icon: Building2 },
        { id: 'partners', label: t('nav.partners'), icon: Users2 },
        { id: 'year-end-tax', label: t('nav.yearEndTax'), icon: FileText },
        { id: 'tax-compliance', label: t('nav.taxCompliance'), icon: Landmark },
        { id: 'state-taxes', label: t('nav.stateTaxes'), icon: Landmark },
        { id: 'multi-entity', label: t('nav.multiEntity'), icon: Building2 },
        { id: 'audit-trail', label: t('nav.auditTrail'), icon: Fingerprint },
      ],
    },
    {
      title: 'CFA Intelligence & BI',
      items: [
        { id: 'reports', label: t('nav.reports'), icon: Sparkles },
        { id: 'budget-variance', label: t('nav.budgetVariance'), icon: Target },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { id: 'system-audit', label: t('nav.systemAudit'), icon: ShieldCheck },
        { id: 'sandbox', label: t('nav.sandbox'), icon: FlaskConical },
        { id: 'settings', label: t('nav.settings'), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-3.5rem)]">
      <div className="p-3 space-y-5">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('reports.auditStamp')}</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
          Mister Contábil v2.5 • Multi-Tenant
        </div>
      </div>
    </aside>
  );
}
