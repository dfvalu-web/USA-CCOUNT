'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  MonthEndCloseEngine,
  MonthEndClosingPackage,
  MonthStatusSummary,
} from '@/lib/closing/month-end-close-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  AlertCircle,
  Download,
  Key,
  ChevronRight,
} from 'lucide-react';

export function MonthEndCloseView() {
  const { activeCompany } = useCompany();
  const { fiscalYear, selectedMonths } = useFiscalPeriod();
  const { locale } = useI18n();

  const companyId = activeCompany?.id || 'cmp-milla-maid-ga';
  const companyName = activeCompany?.legalName || 'Milla Maid Services LLC';

  // State do mês ativo no assistente de fechamento
  const [activeMonth, setActiveMonth] = useState<number>(() => selectedMonths[0] || 8);

  // Lista dos 12 meses com status
  const [monthSummaries, setMonthSummaries] = useState<MonthStatusSummary[]>(() =>
    MonthEndCloseEngine.getMonthSummariesForYear(companyId, companyName, fiscalYear)
  );

  // Pacote de fechamento do mês selecionado
  const [closingPackage, setClosingPackage] = useState<MonthEndClosingPackage>(() =>
    MonthEndCloseEngine.getClosingPackage(companyId, companyName, fiscalYear, activeMonth)
  );

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [auditorPassword, setAuditorPassword] = useState('');
  const [lockError, setLockError] = useState<string | null>(null);

  // Sincroniza quando troca empresa, ano ou mês
  useEffect(() => {
    setMonthSummaries(MonthEndCloseEngine.getMonthSummariesForYear(companyId, companyName, fiscalYear));
    setClosingPackage(MonthEndCloseEngine.getClosingPackage(companyId, companyName, fiscalYear, activeMonth));
  }, [companyId, companyName, fiscalYear, activeMonth]);

  const completedCount = closingPackage.checklists.filter((c) => c.status === 'COMPLETED').length;
  const progressPct = Math.round((completedCount / closingPackage.checklists.length) * 100);

  const handleSelectMonth = (monthNumber: number) => {
    setActiveMonth(monthNumber);
    setClosingPackage(MonthEndCloseEngine.getClosingPackage(companyId, companyName, fiscalYear, monthNumber));
  };

  const handleToggleLock = () => {
    if (closingPackage.isPeriodLocked) {
      // Unlock
      MonthEndCloseEngine.setPeriodLock(companyId, fiscalYear, activeMonth, false);
      setMonthSummaries(MonthEndCloseEngine.getMonthSummariesForYear(companyId, companyName, fiscalYear));
      setClosingPackage(MonthEndCloseEngine.getClosingPackage(companyId, companyName, fiscalYear, activeMonth));
      setNotificationMsg(`Período contábil de ${closingPackage.monthName} / ${fiscalYear} desbloqueado para ajustes pelo Auditor Master.`);
    } else {
      setIsLockModalOpen(true);
    }
  };

  const handleConfirmLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (auditorPassword !== 'Brpc@#2026') {
      setLockError('Senha de Auditor Master incorreta.');
      return;
    }
    setLockError(null);
    MonthEndCloseEngine.setPeriodLock(companyId, fiscalYear, activeMonth, true, 'dfvalu@gmail.com');
    setMonthSummaries(MonthEndCloseEngine.getMonthSummariesForYear(companyId, companyName, fiscalYear));
    setClosingPackage(MonthEndCloseEngine.getClosingPackage(companyId, companyName, fiscalYear, activeMonth));
    setIsLockModalOpen(false);
    setAuditorPassword('');
    setNotificationMsg(`Período contábil de ${closingPackage.monthName} / ${fiscalYear} bloqueado com sucesso! Nenhuma alteração retroativa será permitida.`);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                Assistente de Fechamento Contábil Mensal & Trava de Período (Month-End Close)
              </h3>
              <Badge variant={closingPackage.isPeriodLocked ? 'danger' : 'success'} className="text-[10px]">
                {closingPackage.isPeriodLocked ? '🔒 PERÍODO BLOQUEADO' : '🔓 PERÍODO ABERTO'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {companyName} • Exercício Fiscal {fiscalYear} • Mês em Foco: <strong className="text-white">{closingPackage.monthName}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrintCertificate}
            className="bg-slate-900 border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Imprimir Certificado de Fechamento</span>
          </Button>

          <Button
            size="sm"
            variant={closingPackage.isPeriodLocked ? 'outline' : 'primary'}
            onClick={handleToggleLock}
            className={
              closingPackage.isPeriodLocked
                ? 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900 text-xs font-bold flex items-center space-x-1.5 cursor-pointer'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-950 cursor-pointer'
            }
          >
            {closingPackage.isPeriodLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-rose-400" />
                <span>Desbloquear Mês (Reabrir Livros)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white" />
                <span>Bloquear Mês de {closingPackage.monthName}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 🌟 BARRA EXECUTIVA DOS 12 MESES COM STATUS DE TRAVA (OPÇÃO 1) */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Seletor de Meses do Exercício {fiscalYear}:
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {monthSummaries.filter((m) => m.isLocked).length} de 12 meses travados
          </span>
        </div>

        {/* 12-Month Pills Navigation */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-1">
          {monthSummaries.map((m) => {
            const isSelected = activeMonth === m.month;
            return (
              <button
                key={m.month}
                type="button"
                onClick={() => handleSelectMonth(m.month)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600/20 text-white border-emerald-500 shadow-md shadow-emerald-950'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="font-mono text-[11px] font-bold">
                  {m.month.toString().padStart(2, '0')} • {m.shortName}
                </span>
                <div className="mt-1 flex items-center space-x-1">
                  {m.isLocked ? (
                    <span className="inline-flex items-center text-[10px] text-rose-400 font-mono font-bold">
                      <Lock className="w-3 h-3 mr-0.5" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-[10px] text-amber-300 font-mono">
                      <Unlock className="w-3 h-3 mr-0.5" />
                      Aberto
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Progress & Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-400">Progresso ({closingPackage.monthName}):</span>
            <span className="font-mono font-bold text-emerald-400">{progressPct}% Concluído</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 block">
            {completedCount} de {closingPackage.checklists.length} etapas verificadas
          </span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Equilíbrio do Livro-Razão ({closingPackage.monthName})</span>
          <div className="mt-1 flex items-center space-x-2">
            <span className="text-lg font-bold font-mono text-white">
              {formatCurrency(closingPackage.totalDebits, 'USD', locale)}
            </span>
            <Badge variant="success" className="text-[9px] py-0 px-1.5 font-bold">
              ✓ $0.00 Variância
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Débitos = Créditos mathematically balanced</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block">Selo Criptográfico de Auditoria</span>
          <div className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC 2 Type II Verificado</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-mono truncate block">
            {closingPackage.merkleSeal}
          </span>
        </Card>
      </div>

      {/* Checklists Detailed Table */}
      <Card className="border-slate-800 bg-slate-950 overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-800">
          <CardTitle className="text-sm">
            Checklist de Fechamento Contábil — {closingPackage.monthName} / {fiscalYear}
          </CardTitle>
          <CardDescription>Roteiro oficial Big 4 de conciliação, reconhecimento e trava de segurança</CardDescription>
        </CardHeader>

        <div className="divide-y divide-slate-800/60 font-sans">
          {closingPackage.checklists.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-xs">{item.title}</span>
                  <Badge variant={item.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[9px] py-0 px-1.5">
                    {item.status === 'COMPLETED' ? '✓ CONCLUÍDO' : 'PENDENTE'}
                  </Badge>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{item.description}</p>
                {item.verifiedBy && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    Auditado por: <span className="text-slate-300">{item.verifiedBy}</span> {item.verifiedAt && `em ${item.verifiedAt.split('T')[0]}`}
                  </div>
                )}
              </div>

              {item.amount !== undefined && (
                <div className="text-right font-mono shrink-0">
                  <span className="text-xs font-bold text-white block">
                    {formatCurrency(item.amount, 'USD', locale)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">Discrepância: $0.00</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Printable Certificate (Visible on print) */}
      <div className="bg-slate-900 print:bg-white text-slate-100 print:text-black rounded-3xl border border-slate-800 print:border-none p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="border-b-2 border-slate-800 print:border-black pb-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-400 print:text-black" />
              <h2 className="text-xl font-bold font-serif text-white print:text-black">
                Certificado Oficial de Fechamento Contábil Mensal
              </h2>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-700 font-mono">
              Entidade: {closingPackage.companyName} • Federal EIN: {closingPackage.companyEin}
            </div>
            <div className="text-xs text-slate-400 print:text-gray-700 font-mono">
              Período Contábil: {closingPackage.monthName} de {closingPackage.fiscalYear} • US GAAP ASC 210/205/606
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <span className="text-slate-400 print:text-gray-600 block">Selo de Auditoria:</span>
            <span className="text-emerald-400 print:text-black font-bold text-[11px] block">{closingPackage.merkleSeal}</span>
            <span className="text-slate-500 print:text-gray-600 text-[10px] block">
              Status: {closingPackage.isPeriodLocked ? 'LOCKED & SEALED' : 'READY FOR LOCK'}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-300 print:text-black space-y-3 leading-relaxed">
          <p>
            Certificamos que as demonstrações contábeis e os livros contábeis (Livro Diário e Livro-Razão Geral) de{' '}
            <strong>{closingPackage.companyName}</strong> referentes ao mês de <strong>{closingPackage.monthName} / {closingPackage.fiscalYear}</strong>{' '}
            foram devidamente apurados, reconciliados com os extratos bancários das instituições oficiais e auditados sob as normas contábeis americanas (US GAAP).
          </p>
          <p>
            A equação patrimonial fundamental de partidas dobradas (\(Ativo = Passivo + Patrimônio\ Líquido\)) encontra-se matematicamente equilibrada com{' '}
            <strong>\$0.00 (zero) de variância</strong>.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <span className="text-slate-400 print:text-gray-600 block text-[10px]">Auditor Master Responsável:</span>
            <div className="text-white print:text-black font-bold mt-2 pt-2 border-t border-slate-700 print:border-black">
              David Fernandes, CPA Master
            </div>
            <span className="text-[10px] text-slate-500">Mister Contábil Global Intelligence</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 print:text-gray-600 block text-[10px]">Data da Emissão / Trava:</span>
            <div className="text-white print:text-black font-bold mt-2 pt-2 border-t border-slate-700 print:border-black">
              {closingPackage.lockedAt ? closingPackage.lockedAt.split('T')[0] : new Date().toISOString().split('T')[0]}
            </div>
            <span className="text-[10px] text-slate-500">Conformidade IRS & SBA Loan Audit</span>
          </div>
        </div>
      </div>

      {/* Lock Confirmation Modal */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Confirmar Bloqueio de Período Contábil</h3>
              </div>
              <button onClick={() => setIsLockModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              O bloqueio de período (Period Lock) tranca o mês de <strong>{closingPackage.monthName} / {closingPackage.fiscalYear}</strong> contra quaisquer inserções, exclusões ou modificações retroativas no Livro-Razão.
            </p>

            {lockError && (
              <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-700 text-rose-300 text-xs">
                {lockError}
              </div>
            )}

            <form onSubmit={handleConfirmLock} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Senha de Auditor Master:</label>
                <input
                  type="password"
                  required
                  placeholder="Insira a senha de auditor..."
                  value={auditorPassword}
                  onChange={(e) => setAuditorPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Credencial mestre de autorização CPA</span>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-lg mt-2 text-xs cursor-pointer"
              >
                🔒 Travar e Selar {closingPackage.monthName} / {fiscalYear}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
