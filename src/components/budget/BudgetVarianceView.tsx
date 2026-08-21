'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import {
  BudgetVarianceEngine,
  DepartmentBudgetGoal,
} from '@/lib/budget/budget-variance-engine';
import { NewBudgetGoalModal } from './NewBudgetGoalModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Target,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';

export function BudgetVarianceView() {
  const { locale, t } = useI18n();

  const [budgets, setBudgets] = useState<DepartmentBudgetGoal[]>(
    BudgetVarianceEngine.INITIAL_BUDGETS
  );

  const [isNewBudgetModalOpen, setIsNewBudgetModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const totalAnnualBudget = budgets.reduce((acc, b) => acc + b.annualBudget, 0);
  const totalActualSpent = budgets.reduce((acc, b) => acc + b.actualSpentYtd, 0);
  const totalRemaining = totalAnnualBudget - totalActualSpent;
  const overallUtilizationPercent = totalAnnualBudget > 0 ? (totalActualSpent / totalAnnualBudget) * 100 : 0;

  const handleBudgetCreated = (newGoal: DepartmentBudgetGoal) => {
    setBudgets([newGoal, ...budgets]);
    setNotificationMsg(`Meta orçamentária para "${newGoal.departmentName}" criada com sucesso!`);
  };

  const handleExportBudgetReport = () => {
    let csv = `Department,Account Code,Account Name,Annual Budget (USD),Monthly Budget (USD),Actual Spent YTD (USD),Variance ($),Variance (%),Status,Responsible Leader\n`;
    budgets.forEach((b) => {
      csv += `"${b.departmentName}","${b.accountCode}","${b.accountName}",${b.annualBudget},${b.monthlyBudget},${b.actualSpentYtd},${b.varianceAmount},${b.variancePercentage}%,${b.status},"${b.responsibleLeader}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BUDGET_VS_ACTUALS_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Relatório de Orçamento vs Realizado exportado com sucesso (.CSV)!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Controle Orçamentário vs. Realizado (Budget vs. Actuals)
              <Badge variant="success" className="text-[10px]">
                Utilização: {overallUtilizationPercent.toFixed(1)}%
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Análise de variância por centro de custo, teto de despesas e controle departamental integrado ao Livro-Razão
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={handleExportBudgetReport}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar (.CSV)
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
            onClick={() => setIsNewBudgetModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Nova Meta Orçamentária
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Orçamento Total Aprovado</span>
          <span className="text-2xl font-bold font-mono text-white block">
            {formatCurrency(totalAnnualBudget, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 block">Exercício Anual 2026</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gasto Realizado (YTD)</span>
          <span className="text-2xl font-bold font-mono text-sky-400 block">
            {formatCurrency(totalActualSpent, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 block font-mono">Consolidado no Livro-Razão</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Saldo Orçamentário Restante</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block">
            {formatCurrency(totalRemaining, 'USD', locale)}
          </span>
          <span className="text-[10px] text-emerald-400 block font-medium">Margem de segurança saudável</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Taxa de Execução Orçamentária</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-white">{overallUtilizationPercent.toFixed(1)}%</span>
            <Badge variant="success" className="text-[10px]">
              Dentro do Teto
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block">Meta esperada YTD: ~66.7%</span>
        </div>
      </div>

      {/* Budgets Table Card */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metas Orçamentárias por Departamento & Centro de Custo</CardTitle>
              <CardDescription>
                Acompanhamento em tempo real de despesas operacionais e custos diretos
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {budgets.length} Centros de Custo Monitorados
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departamento & Conta US GAAP</TableHead>
              <TableHead className="text-right w-32">Orçamento Anual</TableHead>
              <TableHead className="text-right w-28">Meta Mensal</TableHead>
              <TableHead className="text-right w-32">Realizado YTD</TableHead>
              <TableHead className="text-right w-32">Saldo Restante</TableHead>
              <TableHead className="w-32 text-center">Status</TableHead>
              <TableHead className="w-44">Líder Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((b) => (
              <TableRow key={b.id} className="hover:bg-slate-900/50">
                <TableCell>
                  <div className="font-bold text-white text-xs">{b.departmentName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {b.accountCode} — {b.accountName}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(b.annualBudget, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-300 text-xs">
                  {formatCurrency(b.monthlyBudget, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-sky-400 text-xs">
                  {formatCurrency(b.actualSpentYtd, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                  {formatCurrency(b.varianceAmount, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      b.status === 'ON_TRACK'
                        ? 'success'
                        : b.status === 'WARNING_90'
                        ? 'warning'
                        : 'danger'
                    }
                    className="text-[10px]"
                  >
                    {b.status === 'ON_TRACK'
                      ? '✓ No Prazo'
                      : b.status === 'WARNING_90'
                      ? 'Atenção >90%'
                      : 'Estouro de Teto'}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-300 font-medium">
                  {b.responsibleLeader}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Nova Meta */}
      <NewBudgetGoalModal
        isOpen={isNewBudgetModalOpen}
        onClose={() => setIsNewBudgetModalOpen(false)}
        onBudgetCreated={handleBudgetCreated}
      />
    </div>
  );
}
