'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  SmartCleaningEngine,
  ServicePackageTemplate,
  ClientReferralCredit,
} from '@/lib/scheduling/smart-cleaning-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import {
  Package,
  Gift,
  Plus,
  Sliders,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

interface ServiceCatalogViewProps {
  packages?: ServicePackageTemplate[];
  onUpdatePackages?: (packages: ServicePackageTemplate[]) => void;
}

export function ServiceCatalogView({
  packages: initialPackages = SmartCleaningEngine.DEFAULT_PACKAGES,
  onUpdatePackages,
}: ServiceCatalogViewProps) {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'packages' | 'referrals' | 'sqft-calculator'>('packages');

  // Sqft Calculator State
  const [sqftInput, setSqftInput] = useState<number>(2500);
  const [propertyType, setPropertyType] = useState<'RESIDENTIAL' | 'COMMERCIAL_OFFICE' | 'POST_CONSTRUCTION'>('COMMERCIAL_OFFICE');
  const [deepCarpetExtra, setDeepCarpetExtra] = useState<boolean>(true);
  const [windowCount, setWindowCount] = useState<number>(12);

  const [packages, setPackages] = useState<ServicePackageTemplate[]>(initialPackages);

  const [referralWallets, setReferralWallets] = useState<ClientReferralCredit[]>([
    {
      clientId: 'cnt-harrison',
      clientName: 'Dr. Robert Harrison',
      clientEmail: 'dr.harrison@gmail.com',
      clientPhone: '(305) 555-4819',
      accumulatedCreditBalance: 40.00,
      totalReferralsMade: 2,
      status: 'APLICADO_NA_PROXIMA_FATURA',
    },
    {
      clientId: 'cnt-soho',
      clientName: 'SoHo Design Agency',
      clientEmail: 'admin@sohodesign.ny',
      clientPhone: '(212) 555-8831',
      accumulatedCreditBalance: 20.00,
      totalReferralsMade: 1,
      status: 'APLICADO_NA_PROXIMA_FATURA',
    },
    {
      clientId: 'cnt-acme',
      clientName: 'Austin Tech Hub Suites',
      clientEmail: 'facilities@austintechhub.io',
      clientPhone: '(512) 555-0192',
      accumulatedCreditBalance: 50.00,
      totalReferralsMade: 2,
      status: 'DISPONIVEL',
    },
  ]);

  // Form Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackageTemplate | null>(null);

  // New/Edit Package Form State
  const [pkgForm, setPkgForm] = useState<Partial<ServicePackageTemplate>>({
    name: '',
    category: 'Residencial Padrão',
    description: '',
    billingPrice: 180,
    laborPayout: 65,
    suppliesCost: 15,
    durationHours: 2.5,
    isCommercial: false,
  });

  const [selectedClientForBonus, setSelectedClientForBonus] = useState<string>('cnt-harrison');
  const [manualBonusAmount, setManualBonusAmount] = useState<string>('20');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleSaveNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: ServicePackageTemplate = {
      id: `pkg-${Math.floor(100000 + Math.random() * 900000)}`,
      name: pkgForm.name || 'Novo Pacote Customizado',
      category: (pkgForm.category as any) || 'Residencial Padrão',
      description: pkgForm.description || 'Serviço personalizado cadastrado no catálogo',
      billingPrice: Number(pkgForm.billingPrice) || 150,
      laborPayout: Number(pkgForm.laborPayout) || 50,
      suppliesCost: Number(pkgForm.suppliesCost) || 15,
      durationHours: Number(pkgForm.durationHours) || 2.0,
      isCommercial: Boolean(pkgForm.isCommercial),
      defaultTasks: ['trash', 'vacuum', 'restrooms', 'mopping'],
    };

    const updated = [newPkg, ...packages];
    setPackages(updated);
    if (onUpdatePackages) onUpdatePackages(updated);
    setIsCreateModalOpen(false);
    setActionSuccessMsg(`Pacote "${newPkg.name}" adicionado ao catálogo com sucesso!`);
  };

  const handleSaveEditPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const updated = packages.map((p) =>
      p.id === editingPackage.id
        ? {
            ...p,
            name: pkgForm.name || p.name,
            category: (pkgForm.category as any) || p.category,
            description: pkgForm.description || p.description,
            billingPrice: Number(pkgForm.billingPrice) || p.billingPrice,
            laborPayout: Number(pkgForm.laborPayout) || p.laborPayout,
            suppliesCost: Number(pkgForm.suppliesCost) || p.suppliesCost,
            durationHours: Number(pkgForm.durationHours) || p.durationHours,
          }
        : p
    );

    setPackages(updated);
    if (onUpdatePackages) onUpdatePackages(updated);
    setEditingPackage(null);
    setActionSuccessMsg(`Pacote "${pkgForm.name}" atualizado com sucesso!`);
  };

  const handleUseTemplate = (template: ServicePackageTemplate) => {
    const cloned: ServicePackageTemplate = {
      ...template,
      id: `pkg-${Math.floor(100000 + Math.random() * 900000)}`,
      name: `${template.name} (Ativo)`,
    };
    const updated = [cloned, ...packages];
    setPackages(updated);
    if (onUpdatePackages) onUpdatePackages(updated);
    setActionSuccessMsg(`Modelo "${template.name}" ativado com sucesso para agendamentos!`);
  };

  const handleGrantCredit = () => {
    const amount = parseFloat(manualBonusAmount) || 20;
    setReferralWallets(
      referralWallets.map((w) =>
        w.clientId === selectedClientForBonus
          ? {
              ...w,
              accumulatedCreditBalance: w.accumulatedCreditBalance + amount,
              status: 'APLICADO_NA_PROXIMA_FATURA',
            }
          : w
      )
    );
    setActionSuccessMsg(`Crédito de $${amount.toFixed(2)} concedido com sucesso para a carteira do cliente!`);
  };

  const startEdit = (pkg: ServicePackageTemplate) => {
    setEditingPackage(pkg);
    setPkgForm({
      name: pkg.name,
      category: pkg.category,
      description: pkg.description,
      billingPrice: pkg.billingPrice,
      laborPayout: pkg.laborPayout,
      suppliesCost: pkg.suppliesCost,
      durationHours: pkg.durationHours,
      isCommercial: pkg.isCommercial,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pacotes & Combos Ativos</span>
            <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
              {packages.length} Serviços
            </span>
            <span className="text-[10px] text-slate-500">Residencial, Comercial & Combos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Package className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Créditos de Indicação Emitidos</span>
            <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
              {formatCurrency(referralWallets.reduce((acc, w) => acc + w.accumulatedCreditBalance, 0), 'USD', locale)}
            </span>
            <span className="text-[10px] text-slate-500">Programa Member-Get-Member</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Margem Média dos Pacotes</span>
            <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
              59.2%
            </span>
            <span className="text-[10px] text-slate-500">Após Repasse & Insumos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Container */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Catálogo de Serviços, Pacotes & Indicações</CardTitle>
              <CardDescription>
                Tabela de Preços, Combos Comerciais e Repasses para a Folha de Pagamento
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="primary" onClick={() => { setPkgForm({ billingPrice: 180, laborPayout: 65, suppliesCost: 15, durationHours: 2.5, category: 'Residencial Padrão' }); setIsCreateModalOpen(true); }}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Criar Novo Pacote / Serviço
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-y border-slate-800 bg-slate-900/80 flex space-x-4">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'packages'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Tabela de Pacotes & Combos ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'referrals'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Programa de Indicação (Member-Get-Member)
          </button>
          <button
            onClick={() => setActiveTab('sqft-calculator')}
            className={`pb-2 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'sqft-calculator'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            🧮 Simulador de Orçamento por Metragem (Sqft)
          </button>
        </div>

        {/* Success Alert Banner */}
        {actionSuccessMsg && (
          <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setActionSuccessMsg(null)}>
              Fechar
            </Button>
          </div>
        )}

        {/* Tab 1: Pacotes & Serviços */}
        {activeTab === 'packages' && (
          <div className="p-6 space-y-6">
            {/* Quick Model Cards Grid */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Modelos Rápidos de Pacotes (Adicione ou Customize antes de salvar):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SmartCleaningEngine.DEFAULT_PACKAGES.slice(0, 4).map((pkg) => {
                  const margin = pkg.billingPrice - pkg.laborPayout - pkg.suppliesCost;
                  return (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="text-[10px]">
                            {pkg.category}
                          </Badge>
                          <span className="text-xs font-mono font-bold text-sky-400">{pkg.durationHours}h</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{pkg.name}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{pkg.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                          <span className="text-emerald-400 font-bold">Cobrança: ${pkg.billingPrice}</span>
                          <span className="text-amber-400 font-bold">Repasse: ${pkg.laborPayout}</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-7 text-[11px] flex-1" onClick={() => startEdit(pkg)}>
                            <Sliders className="w-3 h-3 mr-1" />
                            Personalizar
                          </Button>
                          <Button size="sm" variant="secondary" className="h-7 text-[11px] flex-1" onClick={() => handleUseTemplate(pkg)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Usar Modelo
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Packages Table */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pacotes & Serviços Ativos no Catálogo ({packages.length}):
              </span>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pacote / Serviço</TableHead>
                    <TableHead className="w-40">Tipo & Categoria</TableHead>
                    <TableHead className="w-24 text-center">Duração</TableHead>
                    <TableHead className="text-right w-28">Cobrança (A/R)</TableHead>
                    <TableHead className="text-right w-28">Repasse Folha</TableHead>
                    <TableHead className="text-right w-28">Margem</TableHead>
                    <TableHead className="w-28 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => {
                    const marginAmount = pkg.billingPrice - pkg.laborPayout - pkg.suppliesCost;
                    const marginPct = pkg.billingPrice > 0 ? Math.round((marginAmount / pkg.billingPrice) * 100) : 0;
                    return (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <div>
                              <div>{pkg.name}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{pkg.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {pkg.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono text-slate-300">
                          {pkg.durationHours}h
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(pkg.billingPrice, 'USD', locale)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-amber-400">
                          {formatCurrency(pkg.laborPayout, 'USD', locale)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-sky-300">
                          {formatCurrency(marginAmount, 'USD', locale)} ({marginPct}%)
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Button size="sm" variant="ghost" className="h-6 text-[11px] px-2" onClick={() => startEdit(pkg)}>
                              <Edit2 className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Tab 2: Descontos & Carteira de Indicações */}
        {activeTab === 'referrals' && (
          <div className="p-6 space-y-6">
            {/* Member-Get-Member Explainer Box */}
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Como Funciona a Carteira de Indicações (&quot;Member-Get-Member&quot;):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-xs text-amber-100/90 pl-1">
                <li>No agendamento de um cliente novo, selecione quem o indicou.</li>
                <li>O cliente novo ganha um desconto imediato de boas-vindas na fatura dele.</li>
                <li>
                  Ao concluir o serviço, o <strong>Cliente Indicador (Padrinho)</strong> acumula créditos de indicação automaticamente para abater nas faturas futuras dele.
                </li>
              </ol>
            </div>

            {/* Referral Balances Table */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Saldo de Créditos Acumulados por Clientes:
              </span>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-right w-48">Crédito de Indicação Acumulado</TableHead>
                    <TableHead className="w-48 text-center">Status para Próxima Fatura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralWallets.map((w) => (
                    <TableRow key={w.clientId}>
                      <TableCell className="font-bold text-white">{w.clientName}</TableCell>
                      <TableCell className="text-slate-400 font-mono">
                        {w.clientEmail} • {w.clientPhone}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-amber-400 text-sm">
                        {formatCurrency(w.accumulatedCreditBalance, 'USD', locale)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="warning" className="text-[10px]">
                          {w.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Manual Bonus Grant Tool */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Conceder Bônus ou Crédito de Indicação Manual:
              </span>

              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="text-slate-400 block mb-1 text-[10px] uppercase">Selecione o Cliente</label>
                  <select
                    value={selectedClientForBonus}
                    onChange={(e) => setSelectedClientForBonus(e.target.value)}
                    className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {referralWallets.map((w) => (
                      <option key={w.clientId} value={w.clientId}>
                        {w.clientName} (Saldo Atual: ${w.accumulatedCreditBalance})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-36">
                  <label className="text-slate-400 block mb-1 text-[10px] uppercase">Valor do Crédito ($)</label>
                  <input
                    type="number"
                    value={manualBonusAmount}
                    onChange={(e) => setManualBonusAmount(e.target.value)}
                    className="w-full h-9 rounded-lg bg-slate-950 border border-slate-800 px-3 text-white font-mono focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <Button size="sm" variant="primary" onClick={handleGrantCredit} className="h-9">
                  <Gift className="w-3.5 h-3.5 mr-1" />
                  Conceder Crédito
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sqft Calculator */}
        {activeTab === 'sqft-calculator' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inputs Column */}
              <div className="lg:col-span-7 space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  Parâmetros do Imóvel & Serviços Adicionais
                </h4>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Área Total do Imóvel (Square Feet):</span>
                    <span className="font-mono font-bold text-sky-400">{sqftInput.toLocaleString()} sqft ({Math.round(sqftInput / 10.764)} m²)</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={100}
                    value={sqftInput}
                    onChange={(e) => setSqftInput(parseInt(e.target.value) || 1000)}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>500 sqft (Studio)</span>
                    <span>3,500 sqft (Casa / Escritório)</span>
                    <span>15,000 sqft (Galpão / Prédio)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPropertyType('RESIDENTIAL')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      propertyType === 'RESIDENTIAL'
                        ? 'border-sky-500 bg-sky-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Residencial</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">$0.14 / sqft base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyType('COMMERCIAL_OFFICE')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      propertyType === 'COMMERCIAL_OFFICE'
                        ? 'border-sky-500 bg-sky-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Comercial / Escritório</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">$0.18 / sqft base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyType('POST_CONSTRUCTION')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      propertyType === 'POST_CONSTRUCTION'
                        ? 'border-sky-500 bg-sky-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">Pós-Obra Pesada</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">$0.28 / sqft base</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center space-x-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deepCarpetExtra}
                      onChange={(e) => setDeepCarpetExtra(e.target.checked)}
                      className="rounded border-slate-700 text-sky-500 focus:ring-sky-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">Lavagem Profunda de Carpetes</span>
                      <span className="text-[10px] text-slate-400 block">+$0.05 / sqft adicional</span>
                    </div>
                  </label>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-slate-200">Janelas / Vidros Externos</span>
                      <span className="text-xs font-mono font-bold text-sky-400">{windowCount} un</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={windowCount}
                      onChange={(e) => setWindowCount(parseInt(e.target.value) || 0)}
                      className="w-full h-7 rounded bg-slate-900 border border-slate-700 px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Live Quotation Summary Column */}
              {(() => {
                const baseRate = propertyType === 'RESIDENTIAL' ? 0.14 : propertyType === 'COMMERCIAL_OFFICE' ? 0.18 : 0.28;
                const carpetRate = deepCarpetExtra ? 0.05 : 0;
                const windowCost = windowCount * 8.00;

                const rawServicePrice = (sqftInput * (baseRate + carpetRate)) + windowCost;
                const calculatedPrice = Math.max(120.00, Math.round(rawServicePrice * 100) / 100);

                const estimatedHours = Math.max(1.5, Math.round((sqftInput / 650) * 10) / 10);
                const laborCost = Math.round(estimatedHours * 22.00 * 100) / 100;
                const suppliesCost = Math.round((15.00 + (sqftInput / 1000) * 4.00) * 100) / 100;
                const grossProfit = calculatedPrice - laborCost - suppliesCost;
                const grossMarginPercent = (grossProfit / calculatedPrice) * 100;

                return (
                  <div className="lg:col-span-5 space-y-4 bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-xl border border-sky-500/40 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Orçamento Instantâneo
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        Margem {grossMarginPercent.toFixed(1)}%
                      </Badge>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Preço de Venda Sugerido (A/R)</span>
                      <span className="text-3xl font-mono font-black text-emerald-400 mt-1 block">
                        {formatCurrency(calculatedPrice, 'USD', locale)}
                      </span>
                      <span className="text-[11px] text-slate-400">Net 30 • Faturamento ASC 606</span>
                    </div>

                    <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Tempo de Equipe Estimado:</span>
                        <span className="font-mono font-bold text-white">{estimatedHours} horas</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Repasse Folha (Labor at $22/h):</span>
                        <span className="font-mono font-bold text-amber-400">-{formatCurrency(laborCost, 'USD', locale)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Custo Estimado de Insumos:</span>
                        <span className="font-mono font-bold text-slate-400">-{formatCurrency(suppliesCost, 'USD', locale)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-800/80 font-bold text-emerald-300">
                        <span>Lucro Bruto Previsto:</span>
                        <span className="font-mono">{formatCurrency(grossProfit, 'USD', locale)}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        const newPkg: ServicePackageTemplate = {
                          id: `pkg-sqft-${Date.now().toString().slice(-4)}`,
                          name: `Serviço Sob Medida (${sqftInput.toLocaleString()} sqft ${propertyType === 'RESIDENTIAL' ? 'Residencial' : 'Comercial'})`,
                          category: propertyType === 'POST_CONSTRUCTION' ? 'Pós-Obra & Entrega' : propertyType === 'COMMERCIAL_OFFICE' ? 'Comercial' : 'Residencial Padrão',
                          description: `Orçamento calculado para ${sqftInput.toLocaleString()} sqft com ${estimatedHours}h estimadas.`,
                          billingPrice: calculatedPrice,
                          laborPayout: laborCost,
                          suppliesCost: suppliesCost,
                          durationHours: estimatedHours,
                          isCommercial: propertyType !== 'RESIDENTIAL',
                          defaultTasks: ['trash', 'vacuum', 'restrooms', 'mopping', ...(deepCarpetExtra ? ['carpet'] : [])],
                        };
                        setPackages([newPkg, ...packages]);
                        if (onUpdatePackages) onUpdatePackages([newPkg, ...packages]);
                        setActiveTab('packages');
                        setActionSuccessMsg(`Orçamento de ${formatCurrency(calculatedPrice, 'USD', locale)} adicionado ao catálogo como pacote oficial!`);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Salvar como Novo Pacote Oficial
                    </Button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Card>

      {/* Modal: Criar Novo Pacote */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                Criar Novo Pacote de Serviço
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNewPackage} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome do Pacote / Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Limpeza Pesada Pós-Festa"
                  value={pkgForm.name || ''}
                  onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Categoria</label>
                  <select
                    value={pkgForm.category}
                    onChange={(e) => setPkgForm({ ...pkgForm, category: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="Residencial Padrão">Residencial Padrão</option>
                    <option value="Combos Promocionais">Combos Promocionais</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Pós-Obra & Entrega">Pós-Obra & Entrega</option>
                    <option value="Especializado">Especializado</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Duração Estimada (Horas)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pkgForm.durationHours || 2}
                    onChange={(e) => setPkgForm({ ...pkgForm, durationHours: parseFloat(e.target.value) || 2 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Cobrança Cliente ($)</label>
                  <input
                    type="number"
                    value={pkgForm.billingPrice || 150}
                    onChange={(e) => setPkgForm({ ...pkgForm, billingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Repasse Equipe ($)</label>
                  <input
                    type="number"
                    value={pkgForm.laborPayout || 50}
                    onChange={(e) => setPkgForm({ ...pkgForm, laborPayout: parseFloat(e.target.value) || 0 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-amber-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Insumos ($)</label>
                  <input
                    type="number"
                    value={pkgForm.suppliesCost || 15}
                    onChange={(e) => setPkgForm({ ...pkgForm, suppliesCost: parseFloat(e.target.value) || 0 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-sky-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição Comercial</label>
                <textarea
                  rows={2}
                  value={pkgForm.description || ''}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                  placeholder="Detalhes do que está incluso no serviço..."
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Salvar Pacote</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Pacote */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                Personalizar Pacote: {editingPackage.name}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditPackage} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome do Pacote</label>
                <input
                  type="text"
                  required
                  value={pkgForm.name || ''}
                  onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Cobrança ($)</label>
                  <input
                    type="number"
                    value={pkgForm.billingPrice || 0}
                    onChange={(e) => setPkgForm({ ...pkgForm, billingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Repasse Folha ($)</label>
                  <input
                    type="number"
                    value={pkgForm.laborPayout || 0}
                    onChange={(e) => setPkgForm({ ...pkgForm, laborPayout: parseFloat(e.target.value) || 0 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-amber-400 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Duração (h)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={pkgForm.durationHours || 2}
                    onChange={(e) => setPkgForm({ ...pkgForm, durationHours: parseFloat(e.target.value) || 2 })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-sky-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditingPackage(null)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Atualizar Pacote</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
