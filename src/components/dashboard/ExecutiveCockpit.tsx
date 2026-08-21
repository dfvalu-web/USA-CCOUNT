'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Flame,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  Calendar,
  Download,
  Plus,
  RefreshCw,
  Zap,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

interface ExecutiveCockpitProps {
  onNavigateTab?: (tab: string) => void;
}

export function ExecutiveCockpit({ onNavigateTab }: ExecutiveCockpitProps) {
  const { locale, t, basis } = useI18n();

  // Period State
  const [selectedPeriod, setSelectedPeriod] = useState<'YTD' | 'Q1' | 'Q2' | 'LTM'>('YTD');

  // Interactive Scenario Simulator State
  const [revenueGrowthPct, setRevenueGrowthPct] = useState<number>(15);
  const [burnRateDeltaPct, setBurnRateDeltaPct] = useState<number>(0);
  const [headcountAddition, setHeadcountAddition] = useState<number>(1);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Baseline Financials
  const baseCashBalance = 415200;
  const baseMonthlyRevenue = 68500;
  const baseMonthlyBurn = 28050;

  // Computed Dynamic Scenario Metrics
  const simulatedMonthlyRevenue = baseMonthlyRevenue * (1 + revenueGrowthPct / 100);
  const simulatedMonthlyBurn = baseMonthlyBurn * (1 + burnRateDeltaPct / 100) + headcountAddition * 4500;
  const simulatedNetCashFlow = simulatedMonthlyRevenue - simulatedMonthlyBurn;
  const simulatedRunwayMonths =
    simulatedNetCashFlow < 0
      ? (baseCashBalance / Math.abs(simulatedNetCashFlow)).toFixed(1)
      : 'Infinito (Fluxo Positivo)';

  const kpis = [
    {
      title: t('metrics.netRunway'),
      value: `${(baseCashBalance / baseMonthlyBurn).toFixed(1)} ${t('metrics.months')}`,
      subtext: `Saldo em Caixa (${formatCurrency(baseCashBalance, 'USD', locale)}) / Burn Líquido`,
      trend: '+1.4 mo',
      isPositive: true,
      icon: Clock,
      color: 'text-emerald-400',
    },
    {
      title: t('metrics.monthlyBurn'),
      value: formatCurrency(baseMonthlyBurn, 'USD', locale),
      subtext: 'Média mensal de salários, insumos e infraestrutura',
      trend: '-4.2%',
      isPositive: true,
      icon: Flame,
      color: 'text-amber-400',
    },
    {
      title: t('metrics.quickRatio'),
      value: '3.42x',
      subtext: '(Caixa $415k + Contas a Receber $94k) / Passivo Circulante',
      trend: '+0.18x',
      isPositive: true,
      icon: ShieldCheck,
      color: 'text-sky-400',
    },
    {
      title: 'Margem Bruta Operacional',
      value: '68.4%',
      subtext: 'Receita Bruta menos Salários Diretos e Insumos (COGS)',
      trend: '+2.8%',
      isPositive: true,
      icon: Activity,
      color: 'text-purple-400',
    },
  ];

  const handleExportSummary = () => {
    setNotificationMsg('Relatório Executivo C-Level (Executive Summary US GAAP) exportado em PDF com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: AI Financial Intelligence & Quick Controls */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">Cockpit Executivo & Inteligência Financeira C-Level</h3>
              <Badge variant="success">Runway Ótimo (14.8 meses)</Badge>
              <Badge variant="outline" className="font-mono text-[10px]">{basis} Basis</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Apex CleanOps & Cloud Services apresenta liquidez sólida. Margem de contribuição média de <strong>68.4%</strong>. Retenção de clientes em <strong>96.2%</strong>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Filter Buttons */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['YTD', 'Q1', 'Q2', 'LTM'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  selectedPeriod === p ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button size="sm" variant="outline" onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}>
            <Sliders className="w-3.5 h-3.5 mr-1 text-sky-400" />
            {isSimulatorOpen ? 'Ocultar Simulador' : 'Simulador de Cenários'}
          </Button>

          <Button size="sm" variant="primary" onClick={handleExportSummary}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar Resumo Executivo
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Interactive Scenario & Runway Simulator Card (Collapsible) */}
      {isSimulatorOpen && (
        <Card className="p-5 border-sky-500/30 bg-slate-950 animate-in fade-in space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <CardTitle className="text-sm">Simulador Executivo de Sensibilidade & Runway Financeiro</CardTitle>
            </div>
            <Badge variant="info">Simulação em Tempo Real</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Control 1: Revenue Growth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Crescimento de Receita Previsto:</span>
                <span className="text-emerald-400 font-mono font-bold">+{revenueGrowthPct}%</span>
              </div>
              <input
                type="range"
                min="-30"
                max="100"
                step="5"
                value={revenueGrowthPct}
                onChange={(e) => setRevenueGrowthPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-30%</span>
                <span>0%</span>
                <span>+100%</span>
              </div>
            </div>

            {/* Control 2: Operating Burn Change */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Variação de Despesas Operacionais:</span>
                <span className="text-amber-400 font-mono font-bold">{burnRateDeltaPct > 0 ? `+${burnRateDeltaPct}%` : `${burnRateDeltaPct}%`}</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="5"
                value={burnRateDeltaPct}
                onChange={(e) => setBurnRateDeltaPct(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-20% (Corte)</span>
                <span>0%</span>
                <span>+50% (Expansão)</span>
              </div>
            </div>

            {/* Control 3: New Hires Headcount */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Novas Contratações (Equipe):</span>
                <span className="text-purple-400 font-mono font-bold">+{headcountAddition} colaboradores</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={headcountAddition}
                onChange={(e) => setHeadcountAddition(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>5</span>
                <span>+10 vagas</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Receita Mensal Projetada</span>
              <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                {formatCurrency(simulatedMonthlyRevenue, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Burn Rate / Gastos Projetados</span>
              <span className="text-lg font-mono font-bold text-rose-400 mt-0.5 block">
                {formatCurrency(simulatedMonthlyBurn, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Runway no Cenário Simulado</span>
              <span className="text-lg font-mono font-bold text-sky-400 mt-0.5 block">
                {typeof simulatedRunwayMonths === 'string' && simulatedRunwayMonths.includes('Infinito')
                  ? '✨ Fluxo de Caixa Positivo'
                  : `${simulatedRunwayMonths} meses`}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="p-4 bg-slate-900 border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-white tracking-tight">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-semibold flex items-center ${
                    kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{kpi.subtext}</p>
            </Card>
          );
        })}
      </div>

      {/* Strategic Actions & Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Verified Journal Entries */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lançamentos Recentes no Razão Contábil (General Ledger)</CardTitle>
                <CardDescription>Partidas Dobradas US GAAP Auditadas em Tempo Real</CardDescription>
              </div>
              {onNavigateTab && (
                <Button size="sm" variant="ghost" className="text-xs text-emerald-400" onClick={() => onNavigateTab('journal-entries')}>
                  Ver Livro Diário Completo →
                </Button>
              )}
            </div>
          </CardHeader>
          <div className="space-y-2 p-4 pt-0">
            {[
              { id: 'JE-2026-0042', memo: 'Client Monthly Retainer - Acme Global Corp', amount: 15000, date: '2026-08-18', status: 'POSTED' },
              { id: 'JE-2026-0041', memo: 'Direct Contractor Engineering Fees (1099)', amount: 4800, date: '2026-08-16', status: 'POSTED' },
              { id: 'JE-2026-0040', memo: 'AWS Dedicated Client Infrastructure Hosting', amount: 1250, date: '2026-08-15', status: 'POSTED' },
              { id: 'JE-2026-0039', memo: 'Software Engineering Advisory - FinTech Labs', amount: 22500, date: '2026-08-12', status: 'POSTED' },
            ].map((je) => (
              <div key={je.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">{je.id}</span>
                  <div>
                    <div className="text-xs font-medium text-slate-200">{je.memo}</div>
                    <div className="text-[10px] text-slate-500">{je.date} • US GAAP Accrual</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-white">{formatCurrency(je.amount, 'USD', locale)}</div>
                  <Badge variant="success" className="text-[9px] py-0 px-1">{je.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue by Service Stream */}
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <CardTitle>Linhas de Receita</CardTitle>
            <CardDescription>Composição do Faturamento Operacional</CardDescription>
          </CardHeader>
          <div className="space-y-4 p-4 pt-0">
            {[
              { name: 'Limpeza Comercial & Janitorial', percent: 45, amount: 67500 },
              { name: 'Contratos Mensais Recorrentes', percent: 35, amount: 52500 },
              { name: 'Serviços Especializados / Pós-Obra', percent: 15, amount: 22500 },
              { name: 'Assinaturas de Tecnologia SaaS', percent: 5, amount: 7500 },
            ].map((stream) => (
              <div key={stream.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{stream.name}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{formatCurrency(stream.amount, 'USD', locale)}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stream.percent}%` }} />
                </div>
              </div>
            ))}

            {/* Quick Executive Insights Box */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Alertas Executivos do Cockpit:
              </span>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div>✓ Todos os impostos estaduais em conformidade (*Good Standing*).</div>
                <div>✓ 3 Contas bancárias conectadas e conciliadas em tempo real.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
