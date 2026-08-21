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
  FileSignature,
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
        { id: 'trial-balance', label: t('nav.trialBalance'), icon: Scale },
        { id: 'income-statement', label: t('nav.incomeStatement'), icon: TrendingUp },
        { id: 'balance-sheet', label: t('nav.balanceSheet'), icon: FileSpreadsheet },
        { id: 'journal-entries', label: t('nav.journalEntries'), icon: BookOpen },
        { id: 'bank-reconciliation', label: 'Conciliação Bancária & OCR', icon: Landmark },
        { id: 'software-migration', label: 'Importação & Migração de Softwares', icon: ArrowRightLeft },
        { id: 'multi-currency', label: 'Multi-Currency & FX (ASC 830)', icon: Globe },
        { id: 'chart-of-accounts', label: t('nav.chartOfAccounts'), icon: ListTree },
      ],
    },
    {
      title: 'Service Operations',
      items: [
        { id: 'directory', label: 'Clientes, Equipe & Fornecedores', icon: Users2 },
        { id: 'client-portal', label: 'Portal do Cliente B2B', icon: Globe },
        { id: 'service-catalog', label: 'Catálogo & Indicações', icon: Package },
        { id: 'invoicing', label: t('nav.invoicing'), icon: Receipt },
        { id: 'scheduling', label: 'Agendamento & Apontamento de Horas', icon: Clock },
        { id: 'payroll', label: t('nav.payroll'), icon: Users2 },
        { id: 'worker-portal', label: 'Worker Portal & e-Sign SOW', icon: UserCheck },
        { id: 'banking-disbursements', label: 'Banking & Dual Approval', icon: Lock },
      ],
    },
    {
      title: 'Tax & Compliance',
      items: [
        { id: 'company-profile', label: 'Cadastro de Empresas (Tax)', icon: Building2 },
        { id: 'partners', label: 'Sócios & Quadro Societário (K-1)', icon: Users2 },
        { id: 'year-end-tax', label: 'IRS Year-End Forms (1099/W-2)', icon: FileText },
        { id: 'tax-compliance', label: t('nav.taxCompliance'), icon: Landmark },
        { id: 'state-taxes', label: 'State Franchise Taxes (DE/CA/TX)', icon: Landmark },
        { id: 'multi-entity', label: 'Consolidação Multi-Empresas', icon: Building2 },
        { id: 'audit-trail', label: 'Audit Trail (SOC 2 Merkle)', icon: Fingerprint },
      ],
    },
    {
      title: 'CFA Intelligence & BI',
      items: [
        { id: 'reports', label: 'Monte Carlo & Unit Economics', icon: Sparkles },
        { id: 'budget-variance', label: 'Orçamento vs. Realizado', icon: Target },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { id: 'system-audit', label: 'Auditoria do Sistema & Anomalias', icon: ShieldCheck },
        { id: 'sandbox', label: 'Ambiente Sandbox (Isolamento)', icon: FlaskConical },
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
          <span>US GAAP & SOC 2 Verified</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
          UAS v2.4 • Active Multi-Tenant
        </div>
      </div>
    </aside>
  );
}
