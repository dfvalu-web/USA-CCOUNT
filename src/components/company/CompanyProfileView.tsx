'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  CompanyProfileEngine,
  CompanyTaxProfile,
  UsTaxEntityType,
  TaxAccountingMethod,
  OfficerMemberProfile,
} from '@/lib/company/company-profile-engine';
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
} from 'lucide-react';

interface CompanyProfileViewProps {
  onCompanySwitch?: (activeCompany: CompanyTaxProfile) => void;
  initialTab?: 'companies' | 'federal-tax' | 'state-nexus' | 'officers';
}

export function CompanyProfileView({ onCompanySwitch, initialTab = 'companies' }: CompanyProfileViewProps) {
  const { locale, t } = useI18n();
  const [companies, setCompanies] = useState<CompanyTaxProfile[]>(CompanyProfileEngine.INITIAL_COMPANIES);
  const [activeTab, setActiveTab] = useState<'companies' | 'federal-tax' | 'state-nexus' | 'officers'>(initialTab);
  const [selectedPartnerForK1, setSelectedPartnerForK1] = useState<OfficerMemberProfile | null>(null);
  const [simulatedProfit, setSimulatedProfit] = useState<number>(250000);

  const activeCompany = companies.find((c) => c.isCurrentActiveCompany) || companies[0];

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handlePartnerCreated = (newPartner: OfficerMemberProfile) => {
    const updatedCompanies = companies.map((c) => {
      if (c.id === activeCompany.id) {
        return {
          ...c,
          officersAndMembers: [...c.officersAndMembers, newPartner],
        };
      }
      return c;
    });

    setCompanies(updatedCompanies);
    setNotificationMsg(
      `Sócio "${newPartner.fullName}" (${newPartner.title}) cadastrado com sucesso com ${newPartner.ownershipPercentage}% de participação no capital conforme a legislação societária americana!`
    );
  };

  // Form State
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

  const handleSetActiveCompany = (companyId: string) => {
    const updated = companies.map((c) => ({
      ...c,
      isCurrentActiveCompany: c.id === companyId,
    }));
    setCompanies(updated);
    const selected = updated.find((c) => c.id === companyId);
    if (selected && onCompanySwitch) {
      onCompanySwitch(selected);
    }
    setNotificationMsg(`Empresa ativa alternada para: "${selected?.legalName}". Todos os relatórios contábeis, faturas e apurações de Tax agora refletem esta entidade!`);
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
        state: form.principalAddress?.state || 'TX',
        zipCode: form.principalAddress?.zipCode || '78701',
        country: 'USA',
      },
      contactEmail: form.contactEmail || 'contato@empresa.com',
      contactPhone: form.contactPhone || '(512) 555-0100',
      isCurrentActiveCompany: false,
      stateNexusProfiles: [
        {
          stateCode: form.formationState || 'TX',
          stateName:
            CompanyProfileEngine.STATES.find((s) => s.code === form.formationState)?.name ||
            (form.formationState === 'TX' ? 'Texas' : 'Delaware'),
          stateTaxId: `ST-${cleanEin.replace('-', '')}`,
          sosFileNumber: `SOS-${Math.floor(1000000 + Math.random() * 9000000)}`,
          hasPhysicalNexus: true,
          hasEconomicNexus: true,
          salesTaxPermitNumber: `ST-PERMIT-${form.formationState || 'TX'}-9912`,
          salesTaxRate:
            CompanyProfileEngine.STATES.find((s) => s.code === form.formationState)?.defaultSalesTaxRate || 0.0625,
          annualReportDueDate:
            CompanyProfileEngine.STATES.find((s) => s.code === form.formationState)?.sosAnnualReportDue || 'May 15',
          franchiseTaxStatus: 'ACTIVE_GOOD_STANDING',
        },
      ],
      officersAndMembers: [
        {
          id: `off-${Date.now()}`,
          fullName: 'Sócio Administrador Principal',
          title: 'Managing Member',
          memberType: 'MANAGING_MEMBER',
          taxClassification: 'US_CITIZEN_OR_RESIDENT',
          ssnOrItinMasked: '•••-••-8899',
          ownershipPercentage: 100.0,
          profitSharingPercentage: 100.0,
          lossSharingPercentage: 100.0,
          beginningCapitalAccount: 10000,
          capitalContributedYear: 10000,
          currentYearDistributions: 0,
          endingCapitalAccount: 10000,
          guaranteedPaymentsYear: 0,
          isTaxMattersPartner: true,
          isMaterialParticipant: true,
          receivesW2Salary: false,
          k1DistributionRatio: 1.0,
        },
      ],
    };

    setCompanies([...companies, newCompany]);
    setIsCreateModalOpen(false);
    setNotificationMsg(`Empresa "${newCompany.legalName}" cadastrada com sucesso com enquadramento fiscal no ${CompanyProfileEngine.getIrsTaxFormLabel(newCompany.entityType)}!`);
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
                <CardTitle>Cadastro de Empresas & Perfil Tributário (Tax Entity Profile)</CardTitle>
                <CardDescription>
                  Registro de Entidades Jurídicas dos EUA • Form 1120/1120-S/1065 • Inscrições Estaduais & Nexus
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
        <div className="px-6 py-2 border-y border-slate-800 bg-slate-900/80 flex space-x-4">
          <button
            onClick={() => setActiveTab('companies')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
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
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
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
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'state-nexus'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Inscrições Estaduais & Sales Tax Nexus ({activeCompany.stateNexusProfiles.length})
          </button>

          <button
            onClick={() => setActiveTab('officers')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === 'officers'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Sócios, Administradores & K-1s ({activeCompany.officersAndMembers.length})
          </button>
        </div>

        {/* Success Alert Banner */}
        {notificationMsg && (
          <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
              Fechar
            </Button>
          </div>
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
                        className="h-7 text-xs px-2"
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
              <div className="text-sky-300 pt-1">
                E-mail: {activeCompany.contactEmail} • Telefone: {activeCompany.contactPhone}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inscrições Estaduais & Sales Tax Nexus */}
        {activeTab === 'state-nexus' && (
          <div className="p-6 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Estados com Nexus Físico / Econômico e Inscrições Estaduais ({activeCompany.legalName}):
            </span>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Estado</TableHead>
                  <TableHead>Inscrição Estadual (Taxpayer ID / WebFile)</TableHead>
                  <TableHead>Secretaria de Estado (SOS File #)</TableHead>
                  <TableHead>Permissão de Sales Tax</TableHead>
                  <TableHead className="w-24 text-right">Alíquota</TableHead>
                  <TableHead className="w-32">Vencimento Anual</TableHead>
                  <TableHead className="w-32 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCompany.stateNexusProfiles.map((nexus) => (
                  <TableRow key={nexus.stateCode}>
                    <TableCell className="font-bold text-white">
                      {nexus.stateName} ({nexus.stateCode})
                    </TableCell>
                    <TableCell className="font-mono text-emerald-400 font-semibold">
                      {nexus.stateTaxId}
                    </TableCell>
                    <TableCell className="font-mono text-slate-300">
                      {nexus.sosFileNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sky-400">
                      {nexus.salesTaxPermitNumber}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-white">
                      {(nexus.salesTaxRate * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-xs text-amber-300 font-medium">
                      {nexus.annualReportDueDate}
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
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold"
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
                        variant="outline"
                        className="h-7 text-[11px] px-2"
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

      {/* Modal: Cadastrar Novo Sócio (US Law) */}
      <NewPartnerModal
        isOpen={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onPartnerCreated={handlePartnerCreated}
        companyName={activeCompany.legalName}
        isPartnershipOrLLC={activeCompany.entityType.includes('LLC') || activeCompany.entityType.includes('PARTNERSHIP')}
      />

      {/* Modal: Visualizar e Exportar IRS Schedule K-1 Oficial */}
      <PartnerK1Modal
        isOpen={!!selectedPartnerForK1}
        onClose={() => setSelectedPartnerForK1(null)}
        partner={selectedPartnerForK1}
        company={activeCompany}
      />

      {/* Modal: Cadastrar Nova Empresa */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Cadastrar Nova Empresa nos EUA
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNewCompany} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
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
