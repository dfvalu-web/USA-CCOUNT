'use client';

import React, { useState, useEffect } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  EntityDirectoryEngine,
  ClientEntity,
  WorkerEntity,
  VendorEntity,
  ClientClassification,
  WorkerClassification,
  VendorCategory,
} from '@/lib/directory/entity-directory-engine';
import { NewWorkerModal } from './NewWorkerModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Building2,
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  DollarSign,
  Gift,
  FileSpreadsheet,
} from 'lucide-react';

export function EntityDirectoryView() {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();

  const companyId = activeCompany?.id || 'cmp-milla-maid-ga';
  const companyName = activeCompany?.legalName || 'Milla Maid Services LLC';

  const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'vendors'>('clients');
  const [searchQuery, setSearchQuery] = useState('');

  // Entity Lists State
  const [clients, setClients] = useState<ClientEntity[]>(() =>
    EntityDirectoryEngine.getClientsForCompany(companyId, companyName)
  );
  const [workers, setWorkers] = useState<WorkerEntity[]>(() =>
    EntityDirectoryEngine.getWorkersForCompany(companyId, companyName)
  );
  const [vendors, setVendors] = useState<VendorEntity[]>(() =>
    EntityDirectoryEngine.getVendorsForCompany(companyId, companyName)
  );

  // Sync with active company switch
  useEffect(() => {
    setClients(EntityDirectoryEngine.getClientsForCompany(companyId, companyName));
    setWorkers(EntityDirectoryEngine.getWorkersForCompany(companyId, companyName));
    setVendors(EntityDirectoryEngine.getVendorsForCompany(companyId, companyName));
  }, [companyId, companyName]);

  // Modal Open States
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewWorkerOpen, setIsNewWorkerOpen] = useState(false);
  const [isNewVendorOpen, setIsNewVendorOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Client Form State
  const [clientForm, setClientForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    billingAddress: '',
    serviceAddress: '',
    city: '',
    stateCode: 'TX',
    zipCode: '',
    classification: 'COMMERCIAL_CORPORATE' as ClientClassification,
    isTaxExempt: false,
    paymentTerms: 'NET_30' as 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30',
  });

  // Worker Form State
  // Vendor Form State
  const [vendorForm, setVendorForm] = useState({
    companyName: '',
    taxIdOrEin: 'XX-XXX0000',
    category: 'SUPPLIES_CHEMICALS' as VendorCategory,
    contactPerson: '',
    email: '',
    phone: '',
    remittanceAddress: '',
    city: '',
    stateCode: 'TX',
    zipCode: '',
    paymentTerms: 'NET_30' as 'DUE_ON_RECEIPT' | 'NET_15' | 'NET_30' | 'NET_60',
    defaultExpenseAccountCode: '5020',
    is1099Eligible: false,
  });

  // Submit Handlers
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient = EntityDirectoryEngine.createClient({
      ...clientForm,
      status: 'ACTIVE',
    });
    setClients([newClient, ...clients]);
    setIsNewClientOpen(false);
    setActionSuccessMsg(`Cliente "${newClient.name}" cadastrado com sucesso e sincronizado com o módulo de agendamento e faturamento!`);
  };

  const handleWorkerCreated = (newWorker: WorkerEntity) => {
    setWorkers([newWorker, ...workers]);
    setActionSuccessMsg(`Colaborador "${newWorker.legalName}" (${newWorker.roleTitle}) cadastrado com sucesso com enquadramento fiscal US W-4/W-9 e sincronizado com Folha e Despacho!`);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor = EntityDirectoryEngine.createVendor({
      ...vendorForm,
      status: 'ACTIVE',
    });
    setVendors([newVendor, ...vendors]);
    setIsNewVendorOpen(false);
    setActionSuccessMsg(`Fornecedor "${newVendor.companyName}" cadastrado com sucesso para controle de despesas e compras!`);
  };

  // Filtered lists
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.stateCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorkers = workers.filter(
    (w) =>
      w.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.workState.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVendors = vendors.filter(
    (v) =>
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Clientes Cadastrados</span>
            <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
              {clients.length} Ativos
            </span>
            <span className="text-[10px] text-slate-500">Residenciais & Corporativos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Quadro de Colaboradores</span>
            <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
              {workers.length} Profissionais
            </span>
            <span className="text-[10px] text-slate-500">W-2 CLT & 1099 Prestadores</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fornecedores & Parceiros</span>
            <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
              {vendors.length} Homologados
            </span>
            <span className="text-[10px] text-slate-500">Insumos Químicos, EPIs & Seguros</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Main Directory Container */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Diretório Geral de Entidades (Clientes, Funcionários & Fornecedores)</CardTitle>
              <CardDescription>
                Base Centralizada Integrada a Agendamento, Faturamento, Folha e Contas a Pagar
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              {activeTab === 'clients' && (
                <Button size="sm" variant="primary" onClick={() => setIsNewClientOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Novo Cliente
                </Button>
              )}
              {activeTab === 'workers' && (
                <Button size="sm" variant="primary" onClick={() => setIsNewWorkerOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Novo Funcionário / Prestador
                </Button>
              )}
              {activeTab === 'vendors' && (
                <Button size="sm" variant="primary" onClick={() => setIsNewVendorOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Novo Fornecedor
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Tab Navigation & Search Bar */}
        <div className="px-6 py-2 border-y border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex space-x-4">
            <button
              onClick={() => { setActiveTab('clients'); setSearchQuery(''); }}
              className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'clients'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Clientes ({clients.length})
            </button>

            <button
              onClick={() => { setActiveTab('workers'); setSearchQuery(''); }}
              className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'workers'
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Funcionários & Prestadores ({workers.length})
            </button>

            <button
              onClick={() => { setActiveTab('vendors'); setSearchQuery(''); }}
              className={`pb-2 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'vendors'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Fornecedores ({vendors.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome, estado ou cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
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

        {/* Table 1: Clientes */}
        {activeTab === 'clients' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente / Razão Social</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Endereço de Atendimento</TableHead>
                <TableHead>Termos</TableHead>
                <TableHead className="text-right">Saldo em Aberto</TableHead>
                <TableHead className="text-right">Carteira Indicação</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="font-bold text-white">{client.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5"><Mail className="w-3 h-3 text-slate-500" />{client.email}</span>
                      <span className="flex items-center gap-0.5"><Phone className="w-3 h-3 text-slate-500" />{client.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.classification === 'COMMERCIAL_CORPORATE' ? 'info' : 'outline'} className="text-[10px]">
                      {client.classification.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{client.serviceAddress}, {client.city} {client.stateCode}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{client.paymentTerms}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-white">
                    {formatCurrency(client.currentBalanceDue, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-400">
                    {client.referralCreditBalance > 0 ? (
                      <span className="flex items-center justify-end gap-1">
                        <Gift className="w-3 h-3" />
                        {formatCurrency(client.referralCreditBalance, 'USD', locale)}
                      </span>
                    ) : (
                      '$0.00'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">Ativo</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Table 2: Funcionários & Prestadores */}
        {activeTab === 'workers' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador / Cargo</TableHead>
                <TableHead>Enquadramento Fiscal</TableHead>
                <TableHead>Remuneração Base</TableHead>
                <TableHead>Estado Fiscal (SIT)</TableHead>
                <TableHead>Contato de Emergência</TableHead>
                <TableHead className="text-right">Banco de PTO</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="font-bold text-white">{worker.legalName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {worker.roleTitle} • <span className="text-sky-400">{worker.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={worker.classification === 'W2_FULL_TIME' ? 'success' : 'warning'} className="text-[10px]">
                      {worker.classification}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-emerald-400">
                    {worker.payModel === 'HOURLY' ? `$${worker.basePayRate.toFixed(2)}/hora` : `$${worker.basePayRate.toFixed(2)}/trabalho`}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-sky-300 font-bold">{worker.workState}</span>
                    <span className="text-[10px] text-slate-500 block">Tributação Estadual</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-300">{worker.emergencyContactName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{worker.emergencyContactPhone}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-300">
                    {worker.ptoBalanceHours} hrs
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">Ativo</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Table 3: Fornecedores */}
        {activeTab === 'vendors' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor / Razão Social</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta de Despesa Padrão</TableHead>
                <TableHead>Termos</TableHead>
                <TableHead className="text-center">1099 IRS</TableHead>
                <TableHead className="text-right">Gasto Acumulado (YTD)</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="font-bold text-white">{vendor.companyName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>EIN: {vendor.taxIdOrEin}</span>
                      <span>•</span>
                      <span>{vendor.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {vendor.category.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-sky-400">
                    Conta {vendor.defaultExpenseAccountCode}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{vendor.paymentTerms}</TableCell>
                  <TableCell className="text-center">
                    {vendor.is1099Eligible ? (
                      <Badge variant="warning" className="text-[10px]">1099-NEC</Badge>
                    ) : (
                      <span className="text-[10px] text-slate-500">Corp (Isento)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(vendor.ytdSpendAmount, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">Homologado</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Modal: Novo Cliente */}
      {isNewClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Cadastrar Novo Cliente
              </h3>
              <button onClick={() => setIsNewClientOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClient} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Nome da Empresa / Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: NovaTech Enterprises"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pessoa de Contato</label>
                  <input
                    type="text"
                    placeholder="Ex: Amanda Silva (Financeiro)"
                    value={clientForm.contactPerson}
                    onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">E-mail Principal</label>
                  <input
                    type="email"
                    required
                    placeholder="financeiro@cliente.com"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(512) 555-0100"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Endereço Completo do Imóvel / Serviço</label>
                <input
                  type="text"
                  required
                  placeholder="Rua, Número, Suíte, Cidade, Estado, ZIP"
                  value={clientForm.serviceAddress}
                  onChange={(e) => setClientForm({ ...clientForm, serviceAddress: e.target.value, billingAddress: e.target.value })}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Cidade</label>
                  <input
                    type="text"
                    placeholder="Austin"
                    value={clientForm.city}
                    onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estado (Jurisdição Fiscal)</label>
                  <select
                    value={clientForm.stateCode}
                    onChange={(e) => setClientForm({ ...clientForm, stateCode: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="TX">Texas (TX - 8.25%)</option>
                    <option value="NY">New York (NY - 8.875%)</option>
                    <option value="FL">Florida (FL - 7.0%)</option>
                    <option value="CA">California (CA - 0%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Classificação</label>
                  <select
                    value={clientForm.classification}
                    onChange={(e) => setClientForm({ ...clientForm, classification: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="COMMERCIAL_CORPORATE">Comercial / Empresa</option>
                    <option value="RESIDENTIAL">Residencial</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsNewClientOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Salvar Cliente</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Funcionário (US Law W-4 / W-9 / ACH / 401k) */}
      <NewWorkerModal
        isOpen={isNewWorkerOpen}
        onClose={() => setIsNewWorkerOpen(false)}
        onWorkerCreated={handleWorkerCreated}
      />

      {/* Modal: Novo Fornecedor */}
      {isNewVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                Cadastrar Novo Fornecedor
              </h3>
              <button onClick={() => setIsNewVendorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateVendor} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Razão Social / Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ecolab Commercial Supply"
                    value={vendorForm.companyName}
                    onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">EIN / Tax ID</label>
                  <input
                    type="text"
                    placeholder="XX-XXXXXXX"
                    value={vendorForm.taxIdOrEin}
                    onChange={(e) => setVendorForm({ ...vendorForm, taxIdOrEin: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Categoria de Fornecimento</label>
                  <select
                    value={vendorForm.category}
                    onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="SUPPLIES_CHEMICALS">Produtos Químicos & Insumos (Conta 5020)</option>
                    <option value="EQUIPMENT_HARDWARE">Equipamentos & Máquinas (Conta 1510)</option>
                    <option value="INSURANCE">Seguros Comerciais & Responsabilidade (Conta 6300)</option>
                    <option value="SOFTWARE_IT">Software & Telefonia (Conta 6100)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Termos de Pagamento</label>
                  <select
                    value={vendorForm.paymentTerms}
                    onChange={(e) => setVendorForm({ ...vendorForm, paymentTerms: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="NET_30">Net 30 Dias</option>
                    <option value="NET_15">Net 15 Dias</option>
                    <option value="DUE_ON_RECEIPT">À Vista</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">E-mail de Cobrança / Pedidos</label>
                  <input
                    type="email"
                    required
                    placeholder="pedidos@fornecedor.com"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(800) 555-0000"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsNewVendorOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Salvar Fornecedor</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
