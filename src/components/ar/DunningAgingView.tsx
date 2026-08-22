'use client';

import React, { useState, useMemo } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { DunningEngine, OverdueAccount, DunningNoticeLetter } from '@/lib/ar/dunning-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Printer,
  Copy,
  CheckCircle2,
  Send,
  Building2,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
} from 'lucide-react';

export function DunningAgingView() {
  const { activeCompany } = useCompany();
  const { locale } = useI18n();

  const companyId = activeCompany?.id || 'cmp-milla-maid-ga';
  const companyName = activeCompany?.legalName || 'Milla Maid Services LLC';

  const [selectedBucket, setSelectedBucket] = useState<'ALL' | '0-30' | '31-60' | '61-90' | '90+'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<DunningNoticeLetter | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);

  const accounts = useMemo(() => {
    return DunningEngine.evaluateAgingAccounts(companyId, companyName);
  }, [companyId, companyName]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (selectedBucket !== 'ALL' && acc.agingBucket !== selectedBucket) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          acc.clientName.toLowerCase().includes(q) ||
          acc.invoiceNumber.toLowerCase().includes(q) ||
          acc.contactEmail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [accounts, selectedBucket, searchQuery]);

  const totalPrincipal = accounts.reduce((acc, a) => acc + a.originalAmount, 0);
  const totalInterest = accounts.reduce((acc, a) => acc + a.accruedInterestAmount, 0);
  const totalLateFees = accounts.reduce((acc, a) => acc + a.lateFeePenalty, 0);
  const totalReceivable = totalPrincipal + totalInterest + totalLateFees;

  const handleOpenNotice = (account: OverdueAccount) => {
    const notice = DunningEngine.generateDunningNotice(account);
    setActiveNotice(notice);
  };

  const handleCopyWhatsapp = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg('Mensagem de WhatsApp copiada para a área de transferência!');
    setTimeout(() => setCopiedMsg(null), 3000);
  };

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg('Carta formal de cobrança copiada!');
    setTimeout(() => setCopiedMsg(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                Gestão de Inadimplência & Cobrança Automática (A/R Dunning & Aging)
              </h3>
              <Badge variant="danger" className="text-[10px]">
                {accounts.length} Faturas em Atraso
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {companyName} • Cálculo de juros estaduais, multas contratuais e geração de notificações formais em 3 níveis
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Total Principal Vencido</span>
          <div className="mt-1 text-xl font-bold font-mono text-white">
            {formatCurrency(totalPrincipal, 'USD', locale)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Saldo original de faturas emitidas</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Juros de Mora Acumulados</span>
          <div className="mt-1 text-xl font-bold font-mono text-amber-400">
            +{formatCurrency(totalInterest, 'USD', locale)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Conforme legislação estadual ({activeCompany?.formationState || 'GA'}: 1.5% a.m.)</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Taxas Administrativas / Multas</span>
          <div className="mt-1 text-xl font-bold font-mono text-purple-400">
            +{formatCurrency(totalLateFees, 'USD', locale)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Penalidades contratuais aplicadas</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Saldo Total Atualizado para Cobrança</span>
          <div className="mt-1 text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(totalReceivable, 'USD', locale)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Valor total a ser recuperado</span>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs text-slate-400 mr-1 font-medium">Faixa de Atraso:</span>
          {(
            [
              { id: 'ALL', label: 'Todas as Faturas' },
              { id: '0-30', label: '1 a 30 dias (Nível 1)' },
              { id: '31-60', label: '31 a 60 dias (Nível 2)' },
              { id: '61-90', label: '61 a 90 dias (Nível 3)' },
              { id: '90+', label: '90+ dias (Crítico)' },
            ] as const
          ).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBucket(b.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedBucket === b.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente ou fatura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Copy Alert Notice */}
      {copiedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{copiedMsg}</span>
          </div>
          <button onClick={() => setCopiedMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Overdue Accounts Table */}
      <Card className="border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <CardTitle className="text-sm">Relatório Detalhado de Contas a Receber Vencidas</CardTitle>
          <span className="text-xs text-slate-400 font-mono">{filteredAccounts.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Fatura / Cliente</th>
                <th className="py-3 px-3 font-semibold">Vencimento Original</th>
                <th className="py-3 px-3 font-semibold text-center">Dias Atraso</th>
                <th className="py-3 px-3 font-semibold text-right">Valor Original</th>
                <th className="py-3 px-3 font-semibold text-right">Juros & Multa</th>
                <th className="py-3 px-3 font-semibold text-right">Saldo Atualizado</th>
                <th className="py-3 px-4 font-semibold text-center">Ações de Cobrança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    Nenhuma fatura em atraso nesta categoria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.invoiceId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-white">{account.clientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{account.invoiceNumber} • {account.contactPhone}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {account.dueDate}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          account.daysOverdue > 60
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : account.daysOverdue > 30
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}
                      >
                        {account.daysOverdue} dias
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {formatCurrency(account.originalAmount, 'USD', locale)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-rose-400">
                      +{formatCurrency(account.accruedInterestAmount + account.lateFeePenalty, 'USD', locale)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-400">
                      {formatCurrency(account.totalBalanceDue, 'USD', locale)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenNotice(account)}
                        className="text-xs bg-slate-900 border-slate-700 hover:bg-slate-800 text-rose-300 hover:text-white font-semibold flex items-center space-x-1.5 mx-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                        <span>Gerar Carta Nível {account.dunningLevel}</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Formal Dunning Letter Modal */}
      {activeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeNotice.tierTitle}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {activeNotice.noticeId} • {activeNotice.clientName}</span>
                </div>
              </div>
              <button onClick={() => setActiveNotice(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-900/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => window.print()}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Imprimir Notificação Oficial
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyWhatsapp(activeNotice.whatsappMessageText)}
                  className="bg-slate-900 border-slate-700 text-emerald-400 hover:bg-slate-800 text-xs font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1" />
                  Copiar Mensagem WhatsApp
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyLetter(activeNotice.formalLetterBody)}
                className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copiar Texto da Notificação
              </Button>
            </div>

            {/* Formal Letter Preview */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-white font-serif">{activeNotice.companyName}</h4>
                    <span className="text-slate-400 text-[11px] block">{activeNotice.companyAddress}</span>
                    <span className="text-slate-400 text-[11px] block">{activeNotice.companyPhone} • {activeNotice.companyEmail}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-slate-400 block">Data: {activeNotice.date}</span>
                    <span className="text-rose-400 font-bold block">{activeNotice.noticeId}</span>
                  </div>
                </div>

                <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
                  {activeNotice.formalLetterBody}
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1 text-[11px]">
                  <span className="font-bold text-white block">Resumo Contábil do Saldo Devedor:</span>
                  <div className="flex justify-between text-slate-400">
                    <span>Principal Original ({activeNotice.invoiceNumber}):</span>
                    <span>{formatCurrency(activeNotice.principalAmount, 'USD', locale)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Juros Moratórios Legais:</span>
                    <span>+{formatCurrency(activeNotice.lateInterest, 'USD', locale)}</span>
                  </div>
                  <div className="flex justify-between text-purple-400">
                    <span>Taxa Administrativa de Cobrança:</span>
                    <span>+{formatCurrency(activeNotice.lateFee, 'USD', locale)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold text-xs pt-1 border-t border-slate-800">
                    <span>Total Atualizado para Quitação:</span>
                    <span>{formatCurrency(activeNotice.totalSettlementDue, 'USD', locale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
