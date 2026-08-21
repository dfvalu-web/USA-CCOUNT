'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import { MonteCarloForecastEngine, MonteCarloSimulationResult } from '@/lib/bi/monte-carlo-forecast';
import { UnitEconomicsEngine, ProjectUnitEconomics, ClientLtvCacMetric } from '@/lib/bi/unit-economics-engine';
import { AIFinancialInsightsEngine, AIFinancialInsight } from '@/lib/bi/ai-insights-generator';
import { SensitivityAnalysisMatrix } from './SensitivityAnalysisMatrix';
import { CfaAiCopilotChat } from './CfaAiCopilotChat';
import { NewProjectEconomicsModal } from './NewProjectEconomicsModal';
import { NewClientLtvModal } from './NewClientLtvModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  Sparkles,
  PieChart,
  Target,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  Plus,
  Sliders,
  DollarSign,
  Calculator,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

export function BiAnalyticsView() {
  const { locale, t } = useI18n();

  // Monte Carlo Interactive Inputs
  const [initialCash, setInitialCash] = useState<number>(415200);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(28050);
  const [monthlyInflow, setMonthlyInflow] = useState<number>(65000);
  const [volatilityPercent, setVolatilityPercent] = useState<number>(20);

  const [simulation, setSimulation] = useState<MonteCarloSimulationResult>(() =>
    MonteCarloForecastEngine.runSimulation(initialCash, monthlyBurn, monthlyInflow, volatilityPercent / 100, 1000)
  );

  // Projects Unit Economics State
  const [projectsEconomics, setProjectsEconomics] = useState<ProjectUnitEconomics[]>([
    UnitEconomicsEngine.calculateProjectEconomics(
      'p-1',
      'Modernização de Infraestrutura Cloud & DevOps',
      'Acme Global Corp',
      95000,
      22000,
      6000,
      1500,
      380
    ),
    UnitEconomicsEngine.calculateProjectEconomics(
      'p-2',
      'Serviços Especializados de Limpeza Industrial & Desinfecção',
      'Austin Tech Hub Suites',
      115000,
      28000,
      11000,
      2200,
      460
    ),
    UnitEconomicsEngine.calculateProjectEconomics(
      'p-3',
      'Consultoria de Arquitetura de Dados & AI Core',
      'Horizon Fintech Labs',
      60000,
      14000,
      4800,
      1200,
      270
    ),
  ]);

  // Client LTV / CAC State
  const [clientLtvMetrics, setClientLtvMetrics] = useState<ClientLtvCacMetric[]>([
    UnitEconomicsEngine.calculateClientLtv('c-1', 'Acme Global Corp', 180000, 71.4, 3.5, 12000),
    UnitEconomicsEngine.calculateClientLtv('c-2', 'Austin Tech Hub Suites', 140000, 68.2, 2.5, 9500),
    UnitEconomicsEngine.calculateClientLtv('c-3', 'Horizon Fintech Labs', 120000, 74.0, 3.0, 8000),
  ]);

  // Modals
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const insights: AIFinancialInsight[] = AIFinancialInsightsEngine.generateInsights(14.8, 71.4, 24, 84.6);

  const handleRecalculateSimulation = () => {
    const updated = MonteCarloForecastEngine.runSimulation(
      initialCash,
      monthlyBurn,
      monthlyInflow,
      volatilityPercent / 100,
      1000
    );
    setSimulation(updated);
    setNotificationMsg('Simulação de Monte Carlo executada com 1.000 trajetórias estocásticas recalculadas!');
  };

  const handleProjectCreated = (newProj: ProjectUnitEconomics) => {
    setProjectsEconomics([newProj, ...projectsEconomics]);
    setNotificationMsg(`Análise de Unit Economics para "${newProj.projectName}" incluída com sucesso!`);
  };

  const handleClientEvaluated = (newClient: ClientLtvCacMetric) => {
    setClientLtvMetrics([newClient, ...clientLtvMetrics]);
    setNotificationMsg(`Métrica LTV/CAC para "${newClient.clientName}" salva com sucesso!`);
  };

  const handleExportFinancialModelCsv = () => {
    let csv = `MISTER CONTÁBIL - CFA INTELLIGENCE FINANCIAL MODELING DOSSIER\n`;
    csv += `Generated At,${new Date().toISOString()}\n`;
    csv += `Initial Cash (USD),${initialCash}\n`;
    csv += `Monthly Burn Rate (USD),${monthlyBurn}\n`;
    csv += `Monthly Inflow (USD),${monthlyInflow}\n`;
    csv += `Volatility (Sigma %),${volatilityPercent}%\n\n`;

    csv += `MONTE CARLO STOCHASTIC FORECAST (1000 TRAJECTORIES)\n`;
    csv += `Horizon,Median P50 (USD),Optimistic P90 (USD),Stress Scenario P10 (USD),Solvency Probability (%)\n`;
    csv += `30 Days,${simulation.forecast30Days.baseMedianP50},${simulation.forecast30Days.optimisticP90},${simulation.forecast30Days.stressP10},${simulation.forecast30Days.probabilityOfPositiveCash}%\n`;
    csv += `60 Days,${simulation.forecast60Days.baseMedianP50},${simulation.forecast60Days.optimisticP90},${simulation.forecast60Days.stressP10},${simulation.forecast60Days.probabilityOfPositiveCash}%\n`;
    csv += `90 Days,${simulation.forecast90Days.baseMedianP50},${simulation.forecast90Days.optimisticP90},${simulation.forecast90Days.stressP10},${simulation.forecast90Days.probabilityOfPositiveCash}%\n\n`;

    csv += `UNIT ECONOMICS BY PROJECT (ASC 606 REALIZATION)\n`;
    csv += `Project Name,Client,Total Revenue (USD),Direct Labor (USD),Contractors (USD),Supplies (USD),Contribution Margin (USD),Margin (%),Billable Hours,Hourly Realization Rate (USD/h)\n`;
    projectsEconomics.forEach((p) => {
      csv += `"${p.projectName}","${p.clientName}",${p.totalRevenue},${p.directInternalLaborCost},${p.subcontractor1099Cost},${p.directInfrastructureCost},${p.contributionMargin},${p.contributionMarginPercentage}%,${p.billableHours},${p.effectiveHourlyRealizationRate}\n`;
    });
    csv += `\n`;

    csv += `CLIENT LIFETIME VALUE (LTV) VS ACQUISITION COST (CAC)\n`;
    csv += `Client Name,Annual Contract Value (ACV),Retention (Years),Estimated LTV (USD),CAC (USD),LTV/CAC Ratio,Health Status\n`;
    clientLtvMetrics.forEach((c) => {
      csv += `"${c.clientName}",${c.annualContractValue},${c.estimatedLifespanYears},${c.lifetimeValueLtv},${c.acquisitionCostCac},${c.ltvCacRatio}x,${c.healthStatus}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CFA_FINANCIAL_MODEL_MONTE_CARLO_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Dossiê completo de Modelagem Financeira (Monte Carlo & Unit Economics) exportado com sucesso (.CSV)!');
  };

  return (
    <div className="space-y-6">
      {/* Top Monte Carlo Banner */}
      <Card className="p-5 border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">
                  Simulação Estocástica de Fluxo de Caixa (Modelo Monte Carlo: 1.000 Trajetórias)
                </h4>
                <Badge variant="success">100% Probabilidade de Solvência</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Projeção estocástica simulando Burn Rate Mensal ({formatCurrency(monthlyBurn, 'USD', locale)}) e Entradas Previstas ({formatCurrency(monthlyInflow, 'USD', locale)}) nos horizontes de 30, 60 e 90 dias.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="text-xs" onClick={handleExportFinancialModelCsv}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Exportar Modelo (.CSV)
            </Button>
            <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs" onClick={handleRecalculateSimulation}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Recalcular 1.000 Trajetórias
            </Button>
          </div>
        </div>

        {/* Live Parameters Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Caixa Atual (\$):</span>
            <input
              type="number"
              step="10000"
              value={initialCash}
              onChange={(e) => setInitialCash(parseFloat(e.target.value) || 0)}
              className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-emerald-400 font-mono font-bold"
            />
          </div>
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Burn Rate Mensal (\$):</span>
            <input
              type="number"
              step="2500"
              value={monthlyBurn}
              onChange={(e) => setMonthlyBurn(parseFloat(e.target.value) || 0)}
              className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-rose-400 font-mono font-bold"
            />
          </div>
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Entradas Previstas (\$):</span>
            <input
              type="number"
              step="5000"
              value={monthlyInflow}
              onChange={(e) => setMonthlyInflow(parseFloat(e.target.value) || 0)}
              className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-sky-400 font-mono font-bold"
            />
          </div>
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Volatilidade (Sigma %):</span>
            <input
              type="number"
              min="5"
              max="50"
              step="5"
              value={volatilityPercent}
              onChange={(e) => setVolatilityPercent(parseFloat(e.target.value) || 20)}
              className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-amber-400 font-mono font-bold"
            />
          </div>
        </div>

        {/* 30, 60, 90 Days Monte Carlo Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Projeção 30 Dias', point: simulation.forecast30Days },
            { label: 'Projeção 60 Dias', point: simulation.forecast60Days },
            { label: 'Projeção 90 Dias', point: simulation.forecast90Days },
          ].map(({ label, point }) => (
            <div key={label} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{label}</span>
                <Badge variant="info" className="text-[9px]">
                  {point.probabilityOfPositiveCash}% Solvente
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cenário Base (Mediana P50):</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(point.baseMedianP50, 'USD', locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cenário Otimista (P90):</span>
                  <span className="font-mono text-sky-300">
                    {formatCurrency(point.optimisticP90, 'USD', locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cenário de Estresse (P10):</span>
                  <span className="font-mono text-amber-400">
                    {formatCurrency(point.stressP10, 'USD', locale)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Advanced Sensitivity Matrix Component */}
      <SensitivityAnalysisMatrix />

      {/* AI Narrative Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title} className="p-4 bg-slate-900 border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">{insight.title}</span>
              </div>
              <Badge variant="success" className="text-[9px]">
                {insight.category}
              </Badge>
            </div>
            <p className="text-xs text-slate-300">{insight.narrative}</p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-medium">
              💡 Recomendação Estratégica: {insight.actionRecommendation}
            </div>
          </Card>
        ))}
      </div>

      {/* Unit Economics Table */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Unit Economics por Projeto / Serviço (Margem de Contribuição & ASC 606)</CardTitle>
              <CardDescription>
                Rentabilidade Líquida e Taxa Efetiva de Realização por Hora Faturável
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Novo Projeto / Serviço
            </Button>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto & Cliente</TableHead>
              <TableHead className="text-right w-28">Receita Total</TableHead>
              <TableHead className="text-right w-28">Custo Direto (COS)</TableHead>
              <TableHead className="text-right w-28">Margem Contrib.</TableHead>
              <TableHead className="text-right w-24">Margem %</TableHead>
              <TableHead className="text-right w-24">Horas</TableHead>
              <TableHead className="text-right w-28">Realização / Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectsEconomics.map((p) => (
              <TableRow key={p.projectId} className="hover:bg-slate-900/50">
                <TableCell>
                  <div className="font-semibold text-white text-xs">{p.projectName}</div>
                  <div className="text-[10px] text-slate-400">{p.clientName}</div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white font-semibold text-xs">
                  {formatCurrency(p.totalRevenue, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-rose-400 text-xs">
                  {formatCurrency(p.totalCostOfDelivery, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400 text-xs">
                  {formatCurrency(p.contributionMargin, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-emerald-300 text-xs">
                  {p.contributionMarginPercentage}%
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-300 text-xs">
                  {p.billableHours}h
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-sky-400 text-xs">
                  ${p.effectiveHourlyRealizationRate}/h
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Client LTV vs CAC Ratios */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Métricas de Lifetime Value (LTV) vs. Custo de Aquisição (CAC)</CardTitle>
              <CardDescription>Eficiência de Capital e Retorno sobre o Investimento por Cliente</CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setIsNewClientModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Avaliar Cliente (LTV:CAC)
            </Button>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right w-28">Contrato Anual (ACV)</TableHead>
              <TableHead className="text-right w-24">Retenção</TableHead>
              <TableHead className="text-right w-28">LTV Estimado</TableHead>
              <TableHead className="text-right w-28">CAC (Vendas & Mkt)</TableHead>
              <TableHead className="text-right w-28">Razão LTV / CAC</TableHead>
              <TableHead className="w-28 text-center">Saúde</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientLtvMetrics.map((c) => (
              <TableRow key={c.clientId} className="hover:bg-slate-900/50">
                <TableCell className="font-semibold text-white text-xs">{c.clientName}</TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white text-xs">
                  {formatCurrency(c.annualContractValue, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-300 text-xs">
                  {c.estimatedLifespanYears} anos
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-emerald-400 font-semibold text-xs">
                  {formatCurrency(c.lifetimeValueLtv, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-400 text-xs">
                  {formatCurrency(c.acquisitionCostCac, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-sky-400 text-xs">
                  {c.ltvCacRatio}x
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={c.healthStatus === 'EXCELLENT' ? 'success' : 'info'} className="text-[10px]">
                    {c.healthStatus === 'EXCELLENT' ? 'Excelente' : 'Saudável'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Integrated CFA AI Financial Copilot */}
      <CfaAiCopilotChat />

      {/* Modal: Novo Projeto Unit Economics */}
      <NewProjectEconomicsModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Modal: Novo Cliente LTV / CAC */}
      <NewClientLtvModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientEvaluated={handleClientEvaluated}
      />
    </div>
  );
}
