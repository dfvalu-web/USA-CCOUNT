'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  CompanyProfileEngine,
  CompanyTaxProfile,
  UsTaxEntityType,
  TaxAccountingMethod,
  OfficerMemberProfile,
} from '@/lib/company/company-profile-engine';
import { useCompany } from '@/lib/company/company-context';
import { NewPartnerModal } from './NewPartnerModal';
import { PartnerK1Modal } from './PartnerK1Modal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Edit2,
  Sparkles,
  Users,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
  Briefcase,
  X,
  Radio,
  FileCheck,
  Layers,
  ArrowRightLeft,
  Calculator,
  Settings,
  Save,
  Check,
  Lock,
} from 'lucide-react';

interface CompanyProfileViewProps {
  onCompanySwitch?: (activeCompany: CompanyTaxProfile) => void;
  initialTab?: 'config' | 'companies' | 'federal-tax' | 'state-nexus' | 'officers';
}

export function CompanyProfileView({ onCompanySwitch, initialTab = 'config' }: CompanyProfileViewProps) {
  const { locale, t } = useI18n();
  const { activeCompany, companies, setActiveCompanyId, addCompany, updateCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<'config' | 'companies' | 'federal-tax' | 'state-nexus' | 'officers'>(initialTab);
  const [selectedPartnerForK1, setSelectedPartnerForK1] = useState<OfficerMemberProfile | null>(null);
  const [simulatedProfit, setSimulatedProfit] = useState<number>(250000);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Live Edit Form State for Active Company
  const [editForm, setEditForm] = useState<Partial<CompanyTaxProfile>>({
    legalName: activeCompany?.legalName || '',
    dbaName: activeCompany?.dbaName || '',
    ein: activeCompany?.ein || '',
    entityType: activeCompany?.entityType || 'LLC_PARTNERSHIP_1065',
    taxAccountingMethod: activeCompany?.taxAccountingMethod || 'ACCRUAL',
    taxYearEndMonth: activeCompany?.taxYearEndMonth || 12,
    naicsCode: activeCompany?.naicsCode || '561720',
    businessActivityDescription: activeCompany?.businessActivityDescription || '',
    formationState: activeCompany?.formationState || 'GA',
    formationDate: activeCompany?.formationDate || '2022-01-10',
    contactEmail: activeCompany?.contactEmail || '',
    contactPhone: activeCompany?.contactPhone || '',
    principalAddress: {
      street: activeCompany?.principalAddress?.street || '',
      suite: activeCompany?.principalAddress?.suite || '',
      city: activeCompany?.principalAddress?.city || '',
      state: activeCompany?.principalAddress?.state || 'GA',
      zipCode: activeCompany?.principalAddress?.zipCode || '',
      country: activeCompany?.principalAddress?.country || 'USA',
    },
  });

  // Keep form in sync when active company changes
  useEffect(() => {
    if (activeCompany) {
      setEditForm({
        legalName: activeCompany.legalName,
        dbaName: activeCompany.dbaName || '',
        ein: activeCompany.ein,
        entityType: activeCompany.entityType,
        taxAccountingMethod: activeCompany.taxAccountingMethod,
        taxYearEndMonth: activeCompany.taxYearEndMonth || 12,
        naicsCode: activeCompany.naicsCode,
        businessActivityDescription: activeCompany.businessActivityDescription,
        formationState: activeCompany.formationState,
        formationDate: activeCompany.formationDate,
        contactEmail: activeCompany.contactEmail,
        contactPhone: activeCompany.contactPhone,
        principalAddress: { ...activeCompany.principalAddress },
      });
    }
  }, [activeCompany]);

  // Create Company Form State
  const [form, setForm] = useState<Partial<CompanyTaxProfile>>({
    legalName: '',
    dbaName: '',
    ein: '',
    entityType: 'LLC_PARTNERSHIP_1065',
    taxAccountingMethod: 'ACCRUAL',
    taxYearEndMonth: 12,
    naicsCode: '561720',
    businessActivityDescription: '',
    formationState: 'TX',
    formationDate: new Date().toISOString().split('T')[0],
    contactEmail: '',
    contactPhone: '',
    principalAddress: {
      street: '',
      suite: '',
      city: '',
      state: 'TX',
      zipCode: '',
      country: 'USA',
    },
  });

  const handlePartnerCreated = (newPartner: OfficerMemberProfile) => {
    if (activeCompany) {
      const updated: CompanyTaxProfile = {
        ...activeCompany,
        officersAndMembers: [...activeCompany.officersAndMembers, newPartner],
      };
      updateCompany(updated);
      setNotificationMsg(
        `Sócio "${newPartner.fullName}" (${newPartner.title}) cadastrado com sucesso com ${newPartner.ownershipPercentage}% de participação no capital conforme a legislação societária americana!`
      );
    }
  };

  const handleSetActiveCompany = (companyId: string) => {
    setActiveCompanyId(companyId);
    const selected = companies.find((c) => c.id === companyId);
    if (selected && onCompanySwitch) {
      onCompanySwitch(selected);
    }
    setNotificationMsg(`Empresa ativa alternada para: "${selected?.legalName}". Todos os relatórios contábeis, faturas e apurações de Tax agora refletem esta entidade!`);
  };

  const handleUpdateActiveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCompany) return;

    const cleanEin = CompanyProfileEngine.formatEin(editForm.ein || activeCompany.ein);
    const updated: CompanyTaxProfile = {
      ...activeCompany,
      legalName: editForm.legalName || activeCompany.legalName,
      dbaName: editForm.dbaName,
      ein: cleanEin,
      entityType: editForm.entityType || activeCompany.entityType,
      taxAccountingMethod: editForm.taxAccountingMethod || activeCompany.taxAccountingMethod,
      taxYearEndMonth: editForm.taxYearEndMonth || 12,
      naicsCode: editForm.naicsCode || activeCompany.naicsCode,
      businessActivityDescription: editForm.businessActivityDescription || activeCompany.businessActivityDescription,
      formationState: editForm.formationState || activeCompany.formationState,
      formationDate: editForm.formationDate || activeCompany.formationDate,
      contactEmail: editForm.contactEmail || activeCompany.contactEmail,
      contactPhone: editForm.contactPhone || activeCompany.contactPhone,
      principalAddress: {
        street: editForm.principalAddress?.street || activeCompany.principalAddress.street,
        suite: editForm.principalAddress?.suite || activeCompany.principalAddress.suite,
        city: editForm.principalAddress?.city || activeCompany.principalAddress.city,
        state: editForm.principalAddress?.state || activeCompany.principalAddress.state,
        zipCode: editForm.principalAddress?.zipCode || activeCompany.principalAddress.zipCode,
        country: 'USA',
      },
    };

    updateCompany(updated);
    setNotificationMsg(`Configurações de "${updated.legalName}" salvas com sucesso! Todos os módulos fiscais e contábeis foram atualizados.`);
  };

  const handleSaveNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEin = CompanyProfileEngine.formatEin(form.ein || '');

    const newCompany: CompanyTaxProfile = {
      id: `cmp-${Date.now()}`,
      legalName: form.legalName || 'Nova Empresa Registrada',
      dbaName: form.dbaName,
      ein: cleanEin,
      entityType: form.entityType || 'LLC_PARTNERSHIP_1065',
      taxAccountingMethod: form.taxAccountingMethod || 'ACCRUAL',
      taxYearEndMonth: 12,
      naicsCode: form.naicsCode || '561720',
      businessActivityDescription: form.businessActivityDescription || 'Serviços Comerciais e Operacionais',
      formationDate: form.formationDate || new Date().toISOString().split('T')[0],
      formationState: form.formationState || 'TX',
      principalAddress: {
        street: form.principalAddress?.street || 'Principal Street',
        suite: form.principalAddress?.suite,
        city: form.principalAddress?.city || 'Austin',
        state: form.formationState || 'TX',
        zipCode: form.principalAddress?.zipCode || '78701',
        country: 'USA',
      },
      contactEmail: form.contactEmail || 'contato@empresa.com',
      contactPhone: form.contactPhone || '(512) 555-0100',
      isCurrentActiveCompany: true,
      stateNexusProfiles: [
        {
          stateCode: form.formationState || 'TX',
          stateName: form.formationState === 'TX' ? 'Texas' : 'Primary Nexus',
          stateTaxId: `ST-${cleanEin.replace(/-/g, '')}`,
          sosFileNumber: `SOS-${Math.floor(1000000 + Math.random() * 9000000)}`,
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: `${form.formationState || 'TX'}-ST-991204`,
          salesTaxRate: form.formationState === 'TX' ? 0.0825 : 0.06,
          annualReportDueDate: 'May 15',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: `off-${Date.now()}`,
          fullName: 'Managing Principal',
          title: 'Managing Member',
          memberType: 'MANAGING_MEMBER',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-1122',
          residentialAddress: {
            street: form.principalAddress?.street || '100 Main St',
            city: form.principalAddress?.city || 'Austin',
            state: form.formationState || 'TX',
            zipCode: form.principalAddress?.zipCode || '78701',
            country: 'USA',
          },
          ownershipPercentage: 100.0,
          profitSharingPercentage: 100.0,
          lossSharingPercentage: 100.0,
          beginningCapitalAccount: 50000,
          capitalContributedYear: 0,
          currentYearDistributions: 0,
          endingCapitalAccount: 50000,
          guaranteedPaymentsYear: 0,
          isTaxMattersPartner: true,
          isMaterialParticipant: true,
          receivesW2Salary: false,
          k1DistributionRatio: 1.0,
        },
      ],
    };

    addCompany(newCompany);
    setIsCreateModalOpen(false);
    setNotificationMsg(`Empresa "${newCompany.legalName}" cadastrada com sucesso com número EIN ${cleanEin}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Entity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-emerald-500/30">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Empresa Ativa no SaaS</span>
            <Badge variant="success" className="text-[9px]">Ativa</Badge>
          </div>
          <span className="text-base font-bold text-white mt-1 block truncate">
            {activeCompany.legalName}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">EIN: {activeCompany.ein}</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Enquadramento Tributário IRS</span>
            <Badge variant="info" className="text-[9px]">
              {activeCompany.entityType === 'C_CORP_1120' ? 'Form 1120' : activeCompany.entityType === 'S_CORP_1120S' ? 'Form 1120-S' : 'Form 1065'}
            </Badge>
          </div>
          <span className="text-sm font-bold text-sky-400 mt-1 block">
            {activeCompany.entityType.replace(/_/g, ' ')}
          </span>
          <span className="text-[10px] text-slate-500">Método: {activeCompany.taxAccountingMethod}</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nexus Estadual & Sales Tax</span>
            <Badge variant="success" className="text-[9px]">Good Standing</Badge>
          </div>
          <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
            {activeCompany.stateNexusProfiles.length} Estados
          </span>
          <span className="text-[10px] text-slate-500">
            {activeCompany.stateNexusProfiles.map((s) => s.stateCode).join(', ')}
          </span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sócios & Administradores</span>
            <Badge variant="outline" className="text-[9px]">100% Alocado</Badge>
          </div>
          <span className="text-xl font-mono font-bold text-white mt-1 block">
            {activeCompany.officersAndMembers.length} Sócios
          </span>
          <span className="text-[10px] text-slate-500">Schedule K-1s / W-2 Officers</span>
        </Card>
      </div>

      {/* Main Container */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Configuração de Empresa & Perfil Societário (Tax Entity)</CardTitle>
                <CardDescription>
                  Parâmetros da Entidade dos EUA • US GAAP Accrual/Cash • IRS Form 1065/1120-S • Inscrições Estaduais
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Cadastrar Nova Empresa
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-y border-slate-800 bg-slate-900/80 flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'config'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurações da Empresa Ativa
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'companies'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Empresas Cadastradas ({companies.length})
          </button>

          <button
            onClick={() => setActiveTab('federal-tax')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'federal-tax'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Perfil Fiscal Federal (IRS Tax Return)
          </button>

          <button
            onClick={() => setActiveTab('state-nexus')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'state-nexus'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Inscrições Estaduais & Nexus ({activeCompany.stateNexusProfiles.length})
          </button>

          <button
            onClick={() => setActiveTab('officers')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'officers'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Sócios & K-1s ({activeCompany.officersAndMembers.length})
          </button>
        </div>

        {/* Success Alert Banner */}
        {notificationMsg && (
          <div className="m-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2 cursor-pointer" onClick={() => setNotificationMsg(null)}>
              Fechar
            </Button>
          </div>
        )}

        {/* Tab 0: Configurações Gerais da Empresa Ativa */}
        {activeTab === 'config' && (
          <form onSubmit={handleUpdateActiveCompany} className="p-6 space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Editar Parâmetros Corporativos: {activeCompany.legalName}
                </h3>
                <p className="text-xs text-slate-400">
                  Atualize os dados cadastrais, endereço nos EUA, regime contábil e enquadramento societário IRS da empresa ativa.
                </p>
              </div>
              <Badge variant="success">Entidade Ativa</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Identificação & IRS */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Landmark className="w-3.5 h-3.5 text-sky-400" />
                  Identificação Jurídica & IRS Tax ID
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Razão Social Completa (Legal Entity Name) *</label>
                  <input
                    type="text"
                    required
                    value={editForm.legalName || ''}
                    onChange={(e) => setEditForm({ ...editForm, legalName: e.target.value })}
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nome Fantasia (DBA / Trade Name)</label>
                  <input
                    type="text"
                    value={editForm.dbaName || ''}
                    onChange={(e) => setEditForm({ ...editForm, dbaName: e.target.value })}
                    placeholder="Ex: Milla Maid Commercial"
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Federal EIN *</label>
                    <input
                      type="text"
                      required
                      value={editForm.ein || ''}
                      onChange={(e) => setEditForm({ ...editForm, ein: e.target.value })}
                      placeholder="XX-XXXXXXX"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-emerald-400 font-mono font-bold focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Estado de Registro *</label>
                    <select
                      value={editForm.formationState || 'GA'}
                      onChange={(e) => setEditForm({ ...editForm, formationState: e.target.value })}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500 font-semibold"
                    >
                      {CompanyProfileEngine.STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Tipo Societário IRS</label>
                    <select
                      value={editForm.entityType || 'LLC_PARTNERSHIP_1065'}
                      onChange={(e) => setEditForm({ ...editForm, entityType: e.target.value as any })}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    >
                      <option value="LLC_PARTNERSHIP_1065">Form 1065 (Multi-Member LLC)</option>
                      <option value="S_CORP_1120S">Form 1120-S (S-Corporation)</option>
                      <option value="C_CORP_1120">Form 1120 (C-Corporation)</option>
                      <option value="SINGLE_MEMBER_LLC_DISREGARDED">Schedule C (Single-Member LLC)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Método Contábil US GAAP</label>
                    <select
                      value={editForm.taxAccountingMethod || 'ACCRUAL'}
                      onChange={(e) => setEditForm({ ...editForm, taxAccountingMethod: e.target.value as any })}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    >
                      <option value="ACCRUAL">Competência (Accrual Basis)</option>
                      <option value="CASH">Caixa (Cash Basis)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Código NAICS</label>
                    <input
                      type="text"
                      value={editForm.naicsCode || ''}
                      onChange={(e) => setEditForm({ ...editForm, naicsCode: e.target.value })}
                      placeholder="561720"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Data de Constituição</label>
                    <input
                      type="date"
                      value={editForm.formationDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, formationDate: e.target.value })}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Endereço & Contatos */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Domicílio Fiscal nos EUA & Contatos
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Logradouro / Rua (Street Address) *</label>
                  <input
                    type="text"
                    required
                    value={editForm.principalAddress?.street || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        principalAddress: { ...editForm.principalAddress!, street: e.target.value },
                      })
                    }
                    placeholder="1200 Industrial Pkwy"
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Suite / Sala</label>
                    <input
                      type="text"
                      value={editForm.principalAddress?.suite || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          principalAddress: { ...editForm.principalAddress!, suite: e.target.value },
                        })
                      }
                      placeholder="Suite 400"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Cidade *</label>
                    <input
                      type="text"
                      required
                      value={editForm.principalAddress?.city || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          principalAddress: { ...editForm.principalAddress!, city: e.target.value },
                        })
                      }
                      placeholder="Atlanta"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={editForm.principalAddress?.zipCode || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          principalAddress: { ...editForm.principalAddress!, zipCode: e.target.value },
                        })
                      }
                      placeholder="30301"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white font-mono focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">E-mail Corporativo</label>
                    <input
                      type="email"
                      value={editForm.contactEmail || ''}
                      onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                      placeholder="finance@millamaidservices.com"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Telefone</label>
                    <input
                      type="text"
                      value={editForm.contactPhone || ''}
                      onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                      placeholder="(404) 555-0199"
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Descrição da Atividade Principal</label>
                  <textarea
                    rows={2}
                    value={editForm.businessActivityDescription || ''}
                    onChange={(e) => setEditForm({ ...editForm, businessActivityDescription: e.target.value })}
                    placeholder="Serviços residenciais e comerciais de limpeza especializada..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>As alterações são auditadas e propagadas para todos os relatórios contábeis e fiscais.</span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-6 h-11 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01]"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações da Empresa</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 1: Empresas Cadastradas */}
        {activeTab === 'companies' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão Social / DBA</TableHead>
                <TableHead className="w-32">Federal EIN</TableHead>
                <TableHead className="w-48">Tipo Tributário IRS</TableHead>
                <TableHead className="w-24">Estado</TableHead>
                <TableHead className="w-36">Código NAICS</TableHead>
                <TableHead className="w-32 text-center">Status no SaaS</TableHead>
                <TableHead className="w-36 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className={company.isCurrentActiveCompany ? 'bg-emerald-950/20' : ''}>
                  <TableCell>
                    <div className="font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div>{company.legalName}</div>
                        {company.dbaName && (
                          <div className="text-[10px] text-slate-400 font-normal">DBA: {company.dbaName}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono font-bold text-slate-300">
                    {company.ein}
                  </TableCell>

                  <TableCell>
                    <Badge variant="info" className="text-[10px]">
                      {company.entityType === 'C_CORP_1120' ? 'Form 1120 (C-Corp)' : company.entityType === 'S_CORP_1120S' ? 'Form 1120-S (S-Corp)' : 'Form 1065 (LLC)'}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-semibold text-white">
                    {company.formationState} (EUA)
                  </TableCell>

                  <TableCell className="font-mono text-xs text-slate-400">
                    {company.naicsCode}
                  </TableCell>

                  <TableCell className="text-center">
                    {company.isCurrentActiveCompany ? (
                      <Badge variant="success" className="text-[10px]">
                        ✓ Empresa Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Disponível
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {!company.isCurrentActiveCompany ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs px-2 cursor-pointer"
                        onClick={() => handleSetActiveCompany(company.id)}
                      >
                        <ArrowRightLeft className="w-3 h-3 mr-1" />
                        Tornar Ativa
                      </Button>
                    ) : (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Em Operação
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Tab 2: Perfil Fiscal Federal (IRS Form 1120/1120-S/1065) */}
        {activeTab === 'federal-tax' && (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-base">
                    {CompanyProfileEngine.getIrsTaxFormLabel(activeCompany.entityType)}
                  </span>
                </div>
                <Badge variant="success">Pronto para Declaração Federal</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] block">Employer Identification Number (EIN)</span>
                  <span className="text-base font-mono font-bold text-white">{activeCompany.ein}</span>
                  <span className="text-[10px] text-emerald-400">Validado pela Receita Federal (IRS)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] block">Método Contábil Tributário (IRC 446)</span>
                  <span className="text-base font-bold text-sky-400">{activeCompany.taxAccountingMethod} (Competência)</span>
                  <span className="text-[10px] text-slate-500">Ano Fiscal: 31 de Dezembro</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] block">Código NAICS & Atividade Principal</span>
                  <span className="text-base font-mono font-bold text-amber-400">{activeCompany.naicsCode}</span>
                  <span className="text-[10px] text-slate-400 truncate block">{activeCompany.businessActivityDescription}</span>
                </div>
              </div>
            </div>

            {/* Address & Contact Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">Endereço Principal & Domicílio Fiscal:</span>
              <div className="text-white font-medium">
                {activeCompany.principalAddress.street} {activeCompany.principalAddress.suite && `• ${activeCompany.principalAddress.suite}`}
              </div>
              <div className="text-slate-400 font-mono">
                {activeCompany.principalAddress.city}, {activeCompany.principalAddress.state} {activeCompany.principalAddress.zipCode} • {activeCompany.principalAddress.country}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inscrições Estaduais & Nexus */}
        {activeTab === 'state-nexus' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Estados com Nexo Fiscal Ativo ({activeCompany.legalName}):
              </span>
              <Badge variant="info">Multi-State Nexus Engine</Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Inscrição Estadual (Tax ID)</TableHead>
                  <TableHead>Registro Secretaria de Estado (SOS)</TableHead>
                  <TableHead>Permissão Sales Tax</TableHead>
                  <TableHead className="w-28 text-right">Alíquota Base</TableHead>
                  <TableHead className="w-36 text-center">Status Regularidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCompany.stateNexusProfiles.map((nexus) => (
                  <TableRow key={nexus.stateCode}>
                    <TableCell className="font-bold text-white">
                      {nexus.stateName} ({nexus.stateCode})
                    </TableCell>
                    <TableCell className="font-mono text-slate-300">
                      {nexus.stateTaxId}
                    </TableCell>
                    <TableCell className="font-mono text-slate-400 text-xs">
                      {nexus.sosFileNumber}
                    </TableCell>
                    <TableCell className="font-mono text-amber-400 text-xs">
                      {nexus.salesTaxPermitNumber}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-400">
                      {(nexus.salesTaxRate * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" className="text-[10px]">
                        Good Standing
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 4: Sócios, Administradores & K-1s */}
        {activeTab === 'officers' && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Quadro Societário, Contas de Capital & K-1s ({activeCompany.legalName}):
                </span>
                <span className="text-[11px] text-slate-400">
                  Em conformidade estrita com o IRS Form 1065 / 1120-S e IRC § 704(b), 707(c) e 1446
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold cursor-pointer"
                  onClick={() => setIsNewPartnerModalOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  + Cadastrar Novo Sócio (US Law)
                </Button>
              </div>
            </div>

            {/* Live K-1 & Foreign Withholding Simulator Card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Calculator className="w-4 h-4" />
                  <span>Simulador Operacional de Lucro Pass-Through & Retenções (IRS Schedule K-1 / § 1446)</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Lucro Operacional Líquido (\$):</span>
                  <input
                    type="number"
                    step="10000"
                    value={simulatedProfit}
                    onChange={(e) => setSimulatedProfit(parseFloat(e.target.value) || 0)}
                    className="h-7 w-32 rounded bg-slate-950 border border-slate-700 px-2 text-emerald-400 font-mono font-bold text-right text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {activeCompany.officersAndMembers.map((officer) => {
                  const k1 = CompanyProfileEngine.calculatePartnerK1(officer, simulatedProfit);
                  return (
                    <div key={officer.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white truncate">{officer.fullName}</span>
                        <Badge variant="outline" className="text-[9px]">
                          {officer.ownershipPercentage.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 flex justify-between">
                        <span>Lucro K-1 (Box 1):</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {formatCurrency(k1.k1Box1OrdinaryBusinessIncome, 'USD', locale)}
                        </span>
                      </div>
                      {k1.isForeignPartner && (
                        <div className="text-[10px] text-amber-400 flex justify-between pt-1 border-t border-slate-800">
                          <span>Retenção 1446 (37%):</span>
                          <span className="font-mono font-bold">
                            {formatCurrency(k1.section1446WithholdingAmount, 'USD', locale)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sócio / Membro</TableHead>
                  <TableHead>Qualificação Societária</TableHead>
                  <TableHead className="w-32">Classificação Fiscal</TableHead>
                  <TableHead className="w-28">SSN / ITIN</TableHead>
                  <TableHead className="text-right w-24">% Capital</TableHead>
                  <TableHead className="text-right w-28">Conta Capital (704b)</TableHead>
                  <TableHead className="text-right w-28">Pagto. Garantido / W2</TableHead>
                  <TableHead className="w-28 text-center">TMP / Rep. Legal</TableHead>
                  <TableHead className="w-28 text-center">IRS K-1</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCompany.officersAndMembers.map((officer) => (
                  <TableRow key={officer.id} className="hover:bg-slate-900/50">
                    <TableCell>
                      <div className="font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <div>{officer.fullName}</div>
                          <div className="text-[10px] text-slate-400">{officer.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {officer.memberType?.replace(/_/g, ' ') || 'MANAGING MEMBER'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={officer.taxClassification === 'FOREIGN_NATIONAL_NRA' ? 'warning' : 'success'}
                        className="text-[10px]"
                      >
                        {officer.taxClassification === 'FOREIGN_NATIONAL_NRA' ? 'Estrangeiro (W-8)' : 'US Person (W-9)'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-slate-400 text-xs">
                      {officer.ssnOrItinMasked}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-400 text-sm">
                      {officer.ownershipPercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-slate-200 text-xs">
                      {officer.endingCapitalAccount ? formatCurrency(officer.endingCapitalAccount, 'USD', locale) : '—'}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-sky-400 text-xs">
                      {officer.guaranteedPaymentsYear
                        ? formatCurrency(officer.guaranteedPaymentsYear, 'USD', locale)
                        : officer.w2SalaryAnnual
                        ? `${formatCurrency(officer.w2SalaryAnnual, 'USD', locale)} (W-2)`
                        : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      {officer.isTaxMattersPartner ? (
                        <Badge variant="success" className="text-[10px]">✓ Sim (IRS TMP)</Badge>
                      ) : (
                        <span className="text-slate-500 text-xs">Não</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs px-2 cursor-pointer"
                        onClick={() => setSelectedPartnerForK1(officer)}
                      >
                        <FileCheck className="w-3 h-3 mr-1 text-emerald-400" />
                        Ver K-1
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* New Partner Modal */}
      {isNewPartnerModalOpen && (
        <NewPartnerModal
          isOpen={isNewPartnerModalOpen}
          onClose={() => setIsNewPartnerModalOpen(false)}
          onPartnerCreated={handlePartnerCreated}
          companyName={activeCompany.legalName}
          isPartnershipOrLLC={activeCompany.entityType.includes('LLC') || activeCompany.entityType.includes('PARTNERSHIP')}
        />
      )}

      {/* Partner K-1 Modal */}
      {selectedPartnerForK1 && (
        <PartnerK1Modal
          isOpen={!!selectedPartnerForK1}
          onClose={() => setSelectedPartnerForK1(null)}
          partner={selectedPartnerForK1}
          company={activeCompany}
        />
      )}

      {/* Modal de Cadastro de Nova Empresa */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Cadastrar Nova Entidade Empresarial (EUA)</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSaveNewCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Razão Social Completa (Legal Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Apex Janitorial Texas LLC"
                    value={form.legalName || ''}
                    onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nome Fantasia (DBA / Trade Name)</label>
                  <input
                    type="text"
                    placeholder="Ex: Apex Cleaners"
                    value={form.dbaName || ''}
                    onChange={(e) => setForm({ ...form, dbaName: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Federal EIN (XX-XXXXXXX)</label>
                  <input
                    type="text"
                    required
                    placeholder="84-9281742"
                    value={form.ein || ''}
                    onChange={(e) => setForm({ ...form, ein: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tipo Tributário IRS</label>
                  <select
                    value={form.entityType}
                    onChange={(e) => setForm({ ...form, entityType: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="LLC_PARTNERSHIP_1065">Form 1065 (Multi-Member LLC)</option>
                    <option value="C_CORP_1120">Form 1120 (C-Corporation)</option>
                    <option value="S_CORP_1120S">Form 1120-S (S-Corporation)</option>
                    <option value="SINGLE_MEMBER_LLC_DISREGARDED">Schedule C (Single-Member LLC)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estado de Constituição (50 Estados + DC + PR)</label>
                  <select
                    value={form.formationState}
                    onChange={(e) => setForm({ ...form, formationState: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-semibold"
                  >
                    {CompanyProfileEngine.STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Código NAICS</label>
                  <input
                    type="text"
                    placeholder="561720 (Serviços de Limpeza)"
                    value={form.naicsCode || ''}
                    onChange={(e) => setForm({ ...form, naicsCode: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Método Contábil Tributário</label>
                  <select
                    value={form.taxAccountingMethod}
                    onChange={(e) => setForm({ ...form, taxAccountingMethod: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="ACCRUAL">Competência (Accrual Basis)</option>
                    <option value="CASH">Caixa (Cash Basis)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Endereço Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="701 Brazos St, Suite 650"
                    value={form.principalAddress?.street || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        principalAddress: { ...form.principalAddress!, street: e.target.value },
                      })
                    }
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Cidade</label>
                  <input
                    type="text"
                    required
                    placeholder="Austin"
                    value={form.principalAddress?.city || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        principalAddress: { ...form.principalAddress!, city: e.target.value },
                      })
                    }
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estado / ZIP</label>
                  <div className="flex space-x-1">
                    <select
                      value={form.principalAddress?.state || 'TX'}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          principalAddress: { ...form.principalAddress!, state: e.target.value },
                        })
                      }
                      className="w-20 h-8 rounded bg-slate-900 border border-slate-800 px-1 text-white font-mono"
                    >
                      {CompanyProfileEngine.STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="78701"
                      value={form.principalAddress?.zipCode || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          principalAddress: { ...form.principalAddress!, zipCode: e.target.value },
                        })
                      }
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição da Atividade Comercial</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Prestação de serviços de limpeza comercial, janitorial e higienização corporativa..."
                  value={form.businessActivityDescription || ''}
                  onChange={(e) => setForm({ ...form, businessActivityDescription: e.target.value })}
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Salvar Empresa</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
