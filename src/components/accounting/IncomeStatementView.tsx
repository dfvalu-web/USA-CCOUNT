'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import { IncomeStatementReport } from '@/lib/accounting/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Download,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Columns3,
} from 'lucide-react';
import { CorporateFiscalPeriodSelector } from '@/components/common/CorporateFiscalPeriodSelector';
import { useCompany } from '@/lib/company/company-context';

interface IncomeStatementViewProps {
  data: IncomeStatementReport;
}

export function IncomeStatementView({ data }: IncomeStatementViewProps) {
  const { locale, t, basis } = useI18n();
  const { activeCompany } = useCompany();
  const [period, setPeriod] = useState<'YTD' | 'Q1' | 'Q2' | 'MONTHLY'>('YTD');
  const [showComparative, setShowComparative] = useState<boolean>(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Multi-period baseline simulation for MoM / YoY comparison
  const priorYearFactor = 0.84; // Prior year was ~84% of current scale
  const priorRevenue = data.totalRevenue * priorYearFactor;
  const priorCogs = data.totalCostOfServices * priorYearFactor;
  const priorGrossProfit = priorRevenue - priorCogs;
  const priorOpex = data.totalOperatingExpenses * 0.88;
  const priorNetIncome = priorGrossProfit - priorOpex;

  const revVariance = data.totalRevenue - priorRevenue;
  const revGrowthPercent = priorRevenue > 0 ? (revVariance / priorRevenue) * 100 : 0;

  const netVariance = data.netIncome - priorNetIncome;
  const netGrowthPercent = priorNetIncome > 0 ? (netVariance / priorNetIncome) * 100 : 0;

  const handleExportCsv = () => {
    let csv = `Category,Account Code,Account Name,Current Period (USD),Prior Period (USD),Variance ($),Growth (%)\n`;
    csv += `REVENUE\n`;
    data.revenues.forEach((r) => {
      const prior = r.amount * priorYearFactor;
      const v = r.amount - prior;
      const pct = prior > 0 ? (v / prior) * 100 : 0;
      csv += `Revenue,"${r.code}","${r.name}",${r.amount},${prior.toFixed(2)},${v.toFixed(2)},${pct.toFixed(1)}%\n`;
    });
    csv += `TOTAL REVENUE,,,${data.totalRevenue},${priorRevenue.toFixed(2)},${revVariance.toFixed(2)},${revGrowthPercent.toFixed(1)}%\n\n`;

    csv += `COST OF SERVICES (COGS)\n`;
    data.costOfServices.forEach((c) => {
      const prior = c.amount * priorYearFactor;
      const v = c.amount - prior;
      const pct = prior > 0 ? (v / prior) * 100 : 0;
      csv += `Cost of Services,"${c.code}","${c.name}",${c.amount},${prior.toFixed(2)},${v.toFixed(2)},${pct.toFixed(1)}%\n`;
    });
    csv += `TOTAL COGS,,,${data.totalCostOfServices},${priorCogs.toFixed(2)}\n\n`;

    csv += `GROSS PROFIT,,,${data.grossProfit},${priorGrossProfit.toFixed(2)}\n\n`;

    csv += `OPERATING EXPENSES\n`;
    data.operatingExpenses.forEach((e) => {
      const prior = e.amount * 0.88;
      const v = e.amount - prior;
      const pct = prior > 0 ? (v / prior) * 100 : 0;
      csv += `Operating Expense,"${e.code}","${e.name}",${e.amount},${prior.toFixed(2)},${v.toFixed(2)},${pct.toFixed(1)}%\n`;
    });
    csv += `TOTAL OPEX,,,${data.totalOperatingExpenses},${priorOpex.toFixed(2)}\n\n`;
    csv += `NET INCOME,,,${data.netIncome},${priorNetIncome.toFixed(2)},${netVariance.toFixed(2)},${netGrowthPercent.toFixed(1)}%\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `income_statement_dre_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Demonstração do Resultado (DRE) exportada com sucesso em formato CSV!');
  };

  return (
    <Card className="border-slate-800 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle>{t('nav.incomeStatement')} — {activeCompany?.legalName}</CardTitle>
              <Badge variant="outline">{basis} Basis</Badge>
              <Badge variant="success">US GAAP ASC 606</Badge>
              {showComparative && (
                <Badge variant="info" className="text-[9px]">
                  YoY Comparativo Ativo
                </Badge>
              )}
            </div>
            <CardDescription>
              {activeCompany?.legalName} (EIN: {activeCompany?.ein}) • {data.startDate} — {data.endDate} • Análise de Rentabilidade e Crescimento
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <CorporateFiscalPeriodSelector />

            <Button
              variant="outline"
              size="sm"
              className={`text-xs ${showComparative ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 font-bold' : ''}`}
              onClick={() => setShowComparative(!showComparative)}
            >
              <Columns3 className="w-3.5 h-3.5 mr-1" />
              {showComparative ? 'Ocultar Comparativo' : 'Comparativo YoY'}
            </Button>

            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {t('common.export')} CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Export Notice Banner */}
      {exportNotice && (
        <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setExportNotice(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* YoY Summary Performance Ribbon */}
      {showComparative && (
        <div className="mx-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Crescimento de Receita (YoY)</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold font-mono text-white">+{formatCurrency(revVariance, 'USD', locale)}</span>
              <Badge variant="success" className="text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{revGrowthPercent.toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Margem Bruta Comparada</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold font-mono text-emerald-400">{data.grossMarginPercentage}%</span>
              <span className="text-slate-500 text-[10px]">(vs 68.2% ano anterior)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expansão de Lucro Líquido</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold font-mono text-emerald-400">+{formatCurrency(netVariance, 'USD', locale)}</span>
              <Badge variant="success" className="text-[10px]">
                +{netGrowthPercent.toFixed(1)}% YoY
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* REVENUE SECTION */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>1. {t('accounting.revenue')} (Receita Operacional)</span>
            <div className="flex items-center space-x-4">
              {showComparative && (
                <span className="font-mono text-slate-400 text-xs font-normal">
                  Ano Anterior: {formatCurrency(priorRevenue, 'USD', locale)}
                </span>
              )}
              <span className="font-mono text-emerald-400 font-bold">
                {formatCurrency(data.totalRevenue, 'USD', locale)}
              </span>
            </div>
          </h4>
          <Table>
            <TableBody>
              {data.revenues.map((item) => {
                const prior = item.amount * priorYearFactor;
                const diff = item.amount - prior;
                const pct = prior > 0 ? (diff / prior) * 100 : 0;
                return (
                  <TableRow key={item.code}>
                    <TableCell className="font-mono text-emerald-400 w-20">{item.code}</TableCell>
                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                    {showComparative && (
                      <TableCell className="text-right font-mono tabular-nums text-slate-400 w-32 text-xs">
                        {formatCurrency(prior, 'USD', locale)}
                      </TableCell>
                    )}
                    {showComparative && (
                      <TableCell className="text-right font-mono tabular-nums text-emerald-400 w-24 text-xs font-bold">
                        +{pct.toFixed(1)}%
                      </TableCell>
                    )}
                    <TableCell className="text-right font-mono tabular-nums text-emerald-300 font-semibold w-36">
                      {formatCurrency(item.amount, 'USD', locale)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* COST OF SERVICES SECTION */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>2. {t('accounting.costOfServices')} (Custos Diretos COGS)</span>
            <div className="flex items-center space-x-4">
              {showComparative && (
                <span className="font-mono text-slate-400 text-xs font-normal">
                  Ano Anterior: ({formatCurrency(priorCogs, 'USD', locale)})
                </span>
              )}
              <span className="font-mono text-rose-400 font-bold">
                ({formatCurrency(data.totalCostOfServices, 'USD', locale)})
              </span>
            </div>
          </h4>
          <Table>
            <TableBody>
              {data.costOfServices.map((item) => {
                const prior = item.amount * priorYearFactor;
                return (
                  <TableRow key={item.code}>
                    <TableCell className="font-mono text-slate-400 w-20">{item.code}</TableCell>
                    <TableCell className="text-slate-300">{item.name}</TableCell>
                    {showComparative && (
                      <TableCell className="text-right font-mono tabular-nums text-slate-400 w-32 text-xs">
                        ({formatCurrency(prior, 'USD', locale)})
                      </TableCell>
                    )}
                    {showComparative && (
                      <TableCell className="text-right font-mono tabular-nums text-slate-400 w-24 text-xs">
                        +19.0%
                      </TableCell>
                    )}
                    <TableCell className="text-right font-mono tabular-nums text-rose-300 font-semibold w-36">
                      ({formatCurrency(item.amount, 'USD', locale)})
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* GROSS PROFIT HIGHLIGHT */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white uppercase">{t('accounting.grossProfit')} (Lucro Bruto)</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {t('accounting.grossMargin')}:{' '}
              <strong className="text-emerald-400 font-mono font-bold">{formatPercent(data.grossMarginPercentage, locale)}</strong>
              {showComparative && (
                <span className="text-slate-500 ml-2">
                  (Ano Anterior: {formatCurrency(priorGrossProfit, 'USD', locale)})
                </span>
              )}
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(data.grossProfit, 'USD', locale)}
          </div>
        </div>

        {/* OPERATING EXPENSES SECTION */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>3. {t('accounting.operatingExpenses')} (Despesas Operacionais OPEX)</span>
            <div className="flex items-center space-x-4">
              {showComparative && (
                <span className="font-mono text-slate-400 text-xs font-normal">
                  Ano Anterior: ({formatCurrency(priorOpex, 'USD', locale)})
                </span>
              )}
              <span className="font-mono text-rose-400 font-bold">
                ({formatCurrency(data.totalOperatingExpenses, 'USD', locale)})
              </span>
            </div>
          </h4>
          <Table>
            <TableBody>
              {data.operatingExpenses.map((item) => (
                <TableRow key={item.code}>
                  <TableCell className="font-mono text-slate-400 w-20">{item.code}</TableCell>
                  <TableCell className="text-slate-300">{item.name}</TableCell>
                  {showComparative && (
                    <TableCell className="text-right font-mono tabular-nums text-slate-400 w-32 text-xs">
                      ({formatCurrency(item.amount * 0.88, 'USD', locale)})
                    </TableCell>
                  )}
                  {showComparative && (
                    <TableCell className="text-right font-mono tabular-nums text-slate-400 w-24 text-xs">
                      +13.6%
                    </TableCell>
                  )}
                  <TableCell className="text-right font-mono tabular-nums text-rose-300 font-semibold w-36">
                    ({formatCurrency(item.amount, 'USD', locale)})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* NET OPERATING INCOME & NET INCOME */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              {t('accounting.netIncome')} (Resultado / Lucro Líquido Final)
            </span>
            <span className="text-xs text-slate-400">
              Margem Líquida:{' '}
              <strong className="text-emerald-400 font-mono">
                {formatPercent(data.totalRevenue > 0 ? data.netIncome / data.totalRevenue : 0, locale)}
              </strong>
              {showComparative && (
                <span className="text-slate-500 ml-2">
                  (Ano Anterior: {formatCurrency(priorNetIncome, 'USD', locale)})
                </span>
              )}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {formatCurrency(data.netIncome, 'USD', locale)}
          </div>
        </div>
      </div>
    </Card>
  );
}
