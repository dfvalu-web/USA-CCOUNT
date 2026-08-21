'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { US_GAAP_SERVICE_CHART_OF_ACCOUNTS } from '@/lib/accounting/chart-of-accounts-template';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { Plus, Search, Filter, Download, CheckCircle2, X, ListTree } from 'lucide-react';

export function ChartOfAccountsView() {
  const { locale, t } = useI18n();
  const [accounts, setAccounts] = useState(US_GAAP_SERVICE_CHART_OF_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    code: '',
    name: '',
    namePt: '',
    nameEs: '',
    type: 'EXPENSE' as const,
    description: '',
  });

  const filteredAccounts = accounts.filter((acc) => {
    if (typeFilter !== 'ALL' && acc.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        acc.code.toLowerCase().includes(q) ||
        acc.name.toLowerCase().includes(q) ||
        (acc.namePt || '').toLowerCase().includes(q) ||
        (acc.nameEs || '').toLowerCase().includes(q) ||
        (acc.description || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name) return;

    const newAcc = {
      code: form.code,
      name: form.name,
      namePt: form.namePt || form.name,
      nameEs: form.nameEs || form.name,
      type: form.type,
      subType: 'OPERATING_GENERAL',
      description: form.description || 'Conta contábil personalizada do plano de contas',
    };

    const updated = [...accounts, newAcc].sort((a, b) => a.code.localeCompare(b.code));
    setAccounts(updated);
    setIsCreateModalOpen(false);
    setForm({ code: '', name: '', namePt: '', nameEs: '', type: 'EXPENSE', description: '' });
    setNotificationMsg(`Conta ${newAcc.code} - "${newAcc.name}" criada com sucesso no Plano de Contas US GAAP!`);
  };

  const handleExportCsv = () => {
    let csv = `Account Code,Account Name (EN),Account Name (PT),Type,Normal Balance,Description\n`;
    accounts.forEach((acc) => {
      const isDebitNormal = DoubleEntryLedgerEngine.isNormalDebitBalance(acc.type);
      csv += `"${acc.code}","${acc.name}","${acc.namePt || acc.name}","${acc.type}","${isDebitNormal ? 'DEBIT (DR)' : 'CREDIT (CR)'}","${acc.description || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chart_of_accounts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Plano de Contas US GAAP exportado com sucesso em CSV!');
  };

  return (
    <Card className="border-slate-800 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ListTree className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>{t('nav.chartOfAccounts')} (Plano de Contas US GAAP)</CardTitle>
              <CardDescription>
                Estrutura Padronizada de Contas para Serviços, Limpeza & Janitorial e FinTech
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Exportar CSV
            </Button>
            <Button size="sm" variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Nova Conta Contábil
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 border-y border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">Categoria:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Todas as Contas ({accounts.length})</option>
            <option value="ASSET">Ativos (1000s)</option>
            <option value="LIABILITY">Passivos (2000s)</option>
            <option value="EQUITY">Patrimônio Líquido (3000s)</option>
            <option value="REVENUE">Receitas (4000s)</option>
            <option value="EXPENSE">Custos & Despesas (5000s & 6000s)</option>
          </select>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar por código, nome ou finalidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 rounded bg-slate-950 border border-slate-800 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notification Banner */}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">{t('accounting.accountCode')}</TableHead>
            <TableHead>Nome da Conta</TableHead>
            <TableHead className="w-32">{t('accounting.accountType')}</TableHead>
            <TableHead className="w-36">Natureza do Saldo</TableHead>
            <TableHead>Finalidade / Escopo Contábil</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAccounts.map((acc) => {
            const isDebitNormal = DoubleEntryLedgerEngine.isNormalDebitBalance(acc.type);
            const localizedName =
              locale === 'pt' && acc.namePt ? acc.namePt : locale === 'es' && acc.nameEs ? acc.nameEs : acc.name;

            return (
              <TableRow key={acc.code}>
                <TableCell className="font-mono text-emerald-400 font-semibold">{acc.code}</TableCell>
                <TableCell className="font-medium text-white">{localizedName}</TableCell>
                <TableCell>
                  <span className="text-[11px] font-mono text-slate-300">{acc.type}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={isDebitNormal ? 'info' : 'warning'}>
                    {isDebitNormal ? `${t('accounting.debit')} (DR)` : `${t('accounting.credit')} (CR)`}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-400">{acc.description}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Modal: Nova Conta Contábil */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ListTree className="w-5 h-5 text-emerald-400" />
                Cadastrar Nova Conta Contábil
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAccount} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Código da Conta (Ex: 6250)</label>
                  <input
                    type="text"
                    required
                    placeholder="6250"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tipo de Conta</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="ASSET">ASSET (Ativo - 1000s)</option>
                    <option value="LIABILITY">LIABILITY (Passivo - 2000s)</option>
                    <option value="EQUITY">EQUITY (Patrimônio - 3000s)</option>
                    <option value="REVENUE">REVENUE (Receita - 4000s)</option>
                    <option value="EXPENSE">EXPENSE (Despesa/Custo - 5000s/6000s)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nome da Conta (Inglês / Oficial)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Digital Marketing & Online Advertising"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Nome em Português</label>
                  <input
                    type="text"
                    placeholder="Ex: Marketing Digital & Anúncios"
                    value={form.namePt}
                    onChange={(e) => setForm({ ...form, namePt: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nome em Espanhol</label>
                  <input
                    type="text"
                    placeholder="Ex: Marketing Digital y Publicidad"
                    value={form.nameEs}
                    onChange={(e) => setForm({ ...form, nameEs: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Descrição / Finalidade Contábil</label>
                <textarea
                  rows={2}
                  placeholder="Descreva para quais lançamentos esta conta deve ser utilizada..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Criar Conta</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
