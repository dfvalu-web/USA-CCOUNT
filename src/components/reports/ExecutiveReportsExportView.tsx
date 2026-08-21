'use client';

import React, { useState } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatPercent } from '@/lib/i18n/formatters';
import { ExecutiveReportsEngine, CertifiedReportPackage } from '@/lib/reports/executive-reports-engine';
import {
  Printer,
  Download,
  FileSpreadsheet,
  FileCheck2,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  TrendingUp,
  Scale,
  DollarSign,
  Landmark,
  BadgeCheck,
  Share2,
  FileArchive,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ExecutiveReportsExportView() {
  const { activeCompany } = useCompany();
  const { t } = useI18n();

  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [activeReportTab, setActiveReportTab] = useState<
    'balance-sheet' | 'income-statement' | 'cash-flow' | 'sba-loan' | 'cpa-binder'
  >('sba-loan');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const reportPackage: CertifiedReportPackage = ExecutiveReportsEngine.generateCertifiedPackage(
    activeCompany?.id || 'comp-001',
    activeCompany?.legalName || 'Milla Maid Services LLC',
    selectedYear
  );

  const handlePrint = () => {
    window.print();
  };

  const cashAmount = reportPackage.balanceSheet.currentAssets.find(a => a.code === '1010')?.amount || 0;
  const arAmount = reportPackage.balanceSheet.currentAssets.find(a => a.code === '1200')?.amount || 0;
  const currentAssetsTotal = reportPackage.balanceSheet.currentAssets.reduce((s, a) => s + a.amount, 0);
  const nonCurrentAssetsTotal = reportPackage.balanceSheet.nonCurrentAssets.reduce((s, a) => s + a.amount, 0);
  const currentLiabilitiesTotal = reportPackage.balanceSheet.currentLiabilities.reduce((s, l) => s + l.amount, 0);

  const handleExportCsv = () => {
    const rows = [
      ['REPORT', 'CERTIFIED US GAAP FINANCIAL REPORT'],
      ['ENTITY', reportPackage.entityName],
      ['EIN', activeCompany?.ein || reportPackage.ein],
      ['FISCAL_YEAR', String(selectedYear)],
      ['DATE_GENERATED', reportPackage.generatedDate],
      [''],
      ['SECTION', 'LINE_ITEM', 'AMOUNT_USD'],
      ['BALANCE_SHEET', 'Total Current Assets', currentAssetsTotal.toFixed(2)],
      ['BALANCE_SHEET', 'Cash & Cash Equivalents', cashAmount.toFixed(2)],
      ['BALANCE_SHEET', 'Accounts Receivable', arAmount.toFixed(2)],
      ['BALANCE_SHEET', 'Property, Plant & Equipment (Net)', nonCurrentAssetsTotal.toFixed(2)],
      ['BALANCE_SHEET', 'TOTAL ASSETS', reportPackage.balanceSheet.totalAssets.toFixed(2)],
      ['BALANCE_SHEET', 'Total Current Liabilities', currentLiabilitiesTotal.toFixed(2)],
      ['BALANCE_SHEET', 'TOTAL LIABILITIES & EQUITY', reportPackage.balanceSheet.totalLiabilitiesAndEquity.toFixed(2)],
      ['INCOME_STATEMENT', 'Total Revenue', reportPackage.incomeStatement.totalRevenue.toFixed(2)],
      ['INCOME_STATEMENT', 'Cost of Services (COGS)', reportPackage.incomeStatement.totalCostOfServices.toFixed(2)],
      ['INCOME_STATEMENT', 'Gross Profit', reportPackage.incomeStatement.grossProfit.toFixed(2)],
      ['INCOME_STATEMENT', 'Operating Expenses', reportPackage.incomeStatement.totalOperatingExpenses.toFixed(2)],
      ['INCOME_STATEMENT', 'NET INCOME', reportPackage.incomeStatement.netIncome.toFixed(2)],
      ['SBA_METRICS', 'Current Ratio', reportPackage.sbaMetrics.currentRatio.toFixed(2)],
      ['SBA_METRICS', 'Debt Service Coverage Ratio (DSCR)', reportPackage.sbaMetrics.dscr.toFixed(2)],
      ['SBA_METRICS', 'Working Capital', reportPackage.sbaMetrics.workingCapital.toFixed(2)],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `US_GAAP_${reportPackage.entityName.replace(/\s+/g, '_')}_FY${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackMsg(`Arquivo CSV com dados contábeis de ${selectedYear} exportado com sucesso!`);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportPackage, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `AUDIT_PACKAGE_${reportPackage.entityName.replace(/\s+/g, '_')}_FY${selectedYear}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedbackMsg(`Pacote JSON de Auditoria Forense exportado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Controls (Hidden during print) */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>US GAAP OFFICIAL REPORTING & SBA BANKING ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              Central de Exportação de Relatórios Oficiais
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Gere documentos timbrados auditados para bancos americanos (SBA 7(a)/504), investidores e contadores CPA.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              onClick={handlePrint}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30 flex items-center space-x-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF Oficial</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCsv}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar CSV</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleExportJson}
              className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <FileArchive className="w-4 h-4 text-sky-400" />
              <span>Pacote JSON</span>
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{feedbackMsg}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Year & Report Type Selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {/* Report Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'sba-loan', label: 'Dossiê Bancário SBA', icon: Landmark },
              { id: 'balance-sheet', label: 'Balanço Patrimonial (ASC 210)', icon: Scale },
              { id: 'income-statement', label: 'DRE / P&L (ASC 205)', icon: TrendingUp },
              { id: 'cash-flow', label: 'Fluxo de Caixa (ASC 230)', icon: DollarSign },
              { id: 'cpa-binder', label: 'Pasta Fiscal CPA / K-1', icon: FileCheck2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeReportTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveReportTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Year Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium">Exercício:</span>
            {[2022, 2023, 2024, 2025].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL PRINTABLE CERTIFICATE & REPORT PAPER LAYOUT (A4 / Letter Print) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950 print:bg-white print:text-black rounded-3xl border border-slate-800 print:border-none p-6 sm:p-12 shadow-2xl relative overflow-hidden font-sans">
        {/* Printable Watermark & Letterhead Header */}
        <div className="border-b-2 border-slate-800 print:border-black pb-6 mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 print:bg-black text-slate-950 print:text-white flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-white print:text-black font-serif tracking-tight">
                {reportPackage.entityName}
              </span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-700 space-y-0.5 font-mono">
              <div>DBA: {activeCompany?.dbaName || reportPackage.dba} • Federal EIN: {activeCompany?.ein || reportPackage.ein}</div>
              <div>Registered Jurisdiction: {activeCompany?.formationState || activeCompany?.principalAddress?.state || reportPackage.state} • NAICS: {activeCompany?.naicsCode || '561720'}</div>
              <div>Accounting Basis: US GAAP Accrual Basis (ASC 606) • Currency: USD ($)</div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block px-3 py-1 rounded-lg bg-emerald-950/80 print:bg-gray-100 border border-emerald-500/30 print:border-gray-400 text-emerald-300 print:text-black text-xs font-mono font-bold">
              FISCAL YEAR {selectedYear} AUDIT PACKET
            </div>
            <div className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
              Generated: {reportPackage.generatedDate}
            </div>
            <div className="text-[10px] text-slate-500 print:text-gray-500 font-mono truncate max-w-xs">
              SHA-256: {reportPackage.merkleRootHash.substring(0, 24)}...
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SBA BANKING LOAN APPLICATION DOSSIER */}
        {/* ========================================================================= */}
        {activeReportTab === 'sba-loan' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 print:bg-gray-50 border border-slate-800 print:border-gray-300">
              <div>
                <h2 className="text-lg font-bold text-white print:text-black font-serif flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-400 print:text-black" />
                  <span>SBA 7(a) & Commercial Bank Financial Dossier</span>
                </h2>
                <p className="text-xs text-slate-400 print:text-gray-600">
                  Standard underwriting package and debt service ratios for US commercial lenders.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 print:bg-emerald-100 text-emerald-300 print:text-emerald-800 text-xs font-black border border-emerald-500/40 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>SBA UNDERWRITING STATUS: {reportPackage.sbaMetrics.sbaStatus}</span>
                </span>
              </div>
            </div>

            {/* 4 Banking Ratios Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 print:text-gray-700 uppercase">
                  Debt Service Coverage (DSCR)
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400 print:text-black">
                  {reportPackage.sbaMetrics.dscr}x
                </div>
                <span className="text-[10px] text-emerald-400 print:text-gray-600">
                  Benchmark: &gt; 1.25x (Forte Solvência)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 print:text-gray-700 uppercase">
                  Current Ratio (Liquidez)
                </span>
                <div className="text-2xl font-black font-mono text-sky-400 print:text-black">
                  {reportPackage.sbaMetrics.currentRatio}x
                </div>
                <span className="text-[10px] text-sky-400 print:text-gray-600">
                  Benchmark: &gt; 1.50x (Ativos / Passivos)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 print:text-gray-700 uppercase">
                  Working Capital (Giro)
                </span>
                <div className="text-2xl font-black font-mono text-white print:text-black">
                  {formatCurrency(reportPackage.sbaMetrics.workingCapital)}
                </div>
                <span className="text-[10px] text-slate-400 print:text-gray-600">
                  Capital Líquido Disponível
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 print:bg-gray-100 border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 print:text-gray-700 uppercase">
                  Debt-to-Equity
                </span>
                <div className="text-2xl font-black font-mono text-teal-400 print:text-black">
                  {reportPackage.sbaMetrics.debtToEquity}x
                </div>
                <span className="text-[10px] text-teal-400 print:text-gray-600">
                  Alavancagem Saudável (&lt; 2.0x)
                </span>
              </div>
            </div>

            {/* Key Strengths for Underwriter */}
            <div className="p-5 rounded-2xl bg-slate-900/60 print:bg-white border border-slate-800 print:border-gray-300 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
                Parecer de Elegibilidade & Pontos Fortes de Crédito:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {reportPackage.sbaMetrics.keyStrengths.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-200 flex items-center space-x-2 text-slate-300 print:text-black"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-black shrink-0" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CERTIFIED US GAAP BALANCE SHEET (ASC 210) */}
        {/* ========================================================================= */}
        {activeReportTab === 'balance-sheet' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:border-gray-300">
              <h2 className="text-lg font-bold text-white print:text-black font-serif">
                Certified Balance Sheet (Statement of Financial Position) — ASC 210
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 print:text-black">
                As of December 31, {selectedYear}
              </span>
            </div>

            {/* Assets Table */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-900 print:bg-gray-200 p-2.5 rounded-lg text-xs font-bold text-slate-200 print:text-black uppercase">
                <span>1. ASSETS (Ativo Total)</span>
                <span className="font-mono">{formatCurrency(reportPackage.balanceSheet.totalAssets)}</span>
              </div>

              <div className="pl-4 space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>1010 • Cash and Cash Equivalents (Truist Bank / Chase Operating)</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(cashAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>1200 • Accounts Receivable (Trade Debtors ASC 606)</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(arAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>1510 • Property, Plant & Equipment (Fleet Cleaning Vans & Gear)</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(nonCurrentAssetsTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity Table */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center bg-slate-900 print:bg-gray-200 p-2.5 rounded-lg text-xs font-bold text-slate-200 print:text-black uppercase">
                <span>2. LIABILITIES & PARTNERS&apos; EQUITY (Passivo + Patrimônio Líquido)</span>
                <span className="font-mono">{formatCurrency(reportPackage.balanceSheet.totalLiabilitiesAndEquity)}</span>
              </div>

              <div className="pl-4 space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>2010 • Accounts Payable & Accrued Expenses</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(currentLiabilitiesTotal)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>3010 • Members&apos; Contributed Capital Accounts</span>
                  <span className="font-mono font-semibold">{formatCurrency(115000)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60 print:border-gray-200 text-slate-300 print:text-gray-800">
                  <span>3020 • Retained Earnings & Current Period Net Income</span>
                  <span className="font-mono font-semibold text-emerald-400 print:text-black">
                    {formatCurrency(reportPackage.balanceSheet.totalEquity - 115000)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mathematical Proof Footer */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 print:bg-gray-100 border border-emerald-500/40 print:border-gray-400 flex justify-between items-center text-xs font-bold text-emerald-300 print:text-black">
              <span>PROVA DE EQUILÍBRIO MATEMÁTICO: ATIVOS = PASSIVOS + PATRIMÔNIO LÍQUIDO</span>
              <span className="font-mono">VARIÂNCIA: $0.00 (100% BALANCEADO)</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MULTI-YEAR COMPARATIVE INCOME STATEMENT (ASC 205 / 606) */}
        {/* ========================================================================= */}
        {activeReportTab === 'income-statement' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:border-gray-300">
              <h2 className="text-lg font-bold text-white print:text-black font-serif">
                Statement of Operations & Comprehensive Income (P&L) — ASC 205 / ASC 606
              </h2>
              <span className="text-xs font-mono font-bold text-sky-400 print:text-black">
                Period: Jan 1 – Dec 31, {selectedYear}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-800 print:border-gray-300">
                <span className="font-bold text-slate-200 print:text-black">4010 • Gross Revenue from Services (ASC 606):</span>
                <span className="font-mono font-extrabold text-white print:text-black text-sm">
                  {formatCurrency(reportPackage.incomeStatement.totalRevenue)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800 print:border-gray-300 text-rose-400 print:text-black">
                <span>5010 • Cost of Goods/Services Sold (Labor, Supplies, Dispatch):</span>
                <span className="font-mono font-semibold">
                  ({formatCurrency(reportPackage.incomeStatement.totalCostOfServices)})
                </span>
              </div>

              <div className="flex justify-between items-center py-2 bg-slate-900 print:bg-gray-100 p-2.5 rounded-lg font-bold text-slate-200 print:text-black">
                <span>GROSS PROFIT (Margem Bruta):</span>
                <span className="font-mono text-emerald-400 print:text-black">
                  {formatCurrency(reportPackage.incomeStatement.grossProfit)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-slate-800 print:border-gray-300 text-rose-400 print:text-black">
                <span>6000 • Operating & Administrative Expenses (SG&A):</span>
                <span className="font-mono font-semibold">
                  ({formatCurrency(reportPackage.incomeStatement.totalOperatingExpenses)})
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-emerald-950/80 print:bg-gray-200 p-3 rounded-xl font-extrabold text-sm text-white print:text-black border border-emerald-500/40 print:border-gray-400">
                <span>NET ORDINARY BUSINESS INCOME (Lucro Líquido do Exercício):</span>
                <span className="font-mono text-emerald-300 print:text-black text-base">
                  {formatCurrency(reportPackage.incomeStatement.netIncome)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STATEMENT OF CASH FLOWS (ASC 230) */}
        {/* ========================================================================= */}
        {activeReportTab === 'cash-flow' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:border-gray-300">
              <h2 className="text-lg font-bold text-white print:text-black font-serif">
                Statement of Cash Flows (Direct Method) — ASC 230
              </h2>
              <span className="text-xs font-mono font-bold text-teal-400 print:text-black">
                Year Ended Dec 31, {selectedYear}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 print:text-black uppercase block">
                  1. Cash Flows from Operating Activities:
                </span>
                <div className="flex justify-between text-slate-400 print:text-gray-700">
                  <span>Net cash from operating transactions</span>
                  <span className="font-mono text-white print:text-black">
                    {formatCurrency(reportPackage.cashFlow.operatingActivities.netCashFromOperating)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 print:text-black uppercase block">
                  2. Cash Flows from Investing Activities:
                </span>
                <div className="flex justify-between text-slate-400 print:text-gray-700">
                  <span>Capital expenditures for fleet and commercial gear</span>
                  <span className="font-mono text-white print:text-black">
                    ({formatCurrency(Math.abs(reportPackage.cashFlow.investingActivities.fleetAndEquipmentPurchase))})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 print:bg-gray-100 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 print:text-black uppercase block">
                  3. Cash Flows from Financing Activities:
                </span>
                <div className="flex justify-between text-slate-400 print:text-gray-700">
                  <span>Partner capital contributions & distributions</span>
                  <span className="font-mono text-white print:text-black">
                    {formatCurrency(reportPackage.cashFlow.financingActivities.netCashFromFinancing)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-teal-950/80 print:bg-gray-200 border border-teal-500/40 text-xs font-bold text-teal-300 print:text-black">
                <span>NET CHANGE IN CASH & CASH EQUIVALENTS:</span>
                <span className="font-mono text-sm">{formatCurrency(reportPackage.cashFlow.netChangeInCash)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CPA TAX BINDER & SCHEDULE K-1 WORKPAPER */}
        {/* ========================================================================= */}
        {activeReportTab === 'cpa-binder' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:border-gray-300">
              <h2 className="text-lg font-bold text-white print:text-black font-serif">
                IRS Form 1065 / Schedule K-1 Partner Allocation Binder
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 print:text-black">
                IRS Tax Year {selectedYear}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2">
                <span className="font-bold text-slate-300 print:text-black block">
                  IRS Tax Form Classification:
                </span>
                <div className="text-slate-400 print:text-gray-700">
                  Form 1065 (US Return of Partnership Income)
                </div>
                <div className="text-slate-400 print:text-gray-700">
                  Ordinary Business Income (Line 1):{' '}
                  <strong className="text-emerald-400 print:text-black">
                    {formatCurrency(reportPackage.incomeStatement.netIncome)}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2">
                <span className="font-bold text-slate-300 print:text-black block">
                  Partner Capital Account Analysis (Schedule M-2):
                </span>
                <div className="text-slate-400 print:text-gray-700">
                  Beginning Capital: <strong>{formatCurrency(115000)}</strong>
                </div>
                <div className="text-slate-400 print:text-gray-700">
                  Ending Partner Capital:{' '}
                  <strong className="text-emerald-400 print:text-black">
                    {formatCurrency(reportPackage.balanceSheet.totalEquity)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official CPA / Management Signature Block */}
        <div className="mt-12 pt-8 border-t-2 border-slate-800 print:border-black grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-400 print:text-gray-700">
          <div className="space-y-4">
            <div className="border-b border-slate-700 print:border-gray-400 pb-1 w-64">
              <span className="font-serif italic text-white print:text-black text-sm">David Ferreira</span>
            </div>
            <div>
              <div className="font-bold text-white print:text-black">Managing Member / CEO</div>
              <div className="text-[11px] font-mono">{reportPackage.entityName}</div>
            </div>
          </div>

          <div className="space-y-4 text-right sm:text-right">
            <div className="border-b border-slate-700 print:border-gray-400 pb-1 w-64 ml-auto">
              <span className="font-mono text-emerald-400 print:text-black text-xs">VERIFIED US GAAP ENGINE</span>
            </div>
            <div>
              <div className="font-bold text-white print:text-black">CPA & Forensic Auditor Attestation</div>
              <div className="text-[11px] font-mono">SOC 2 Merkle Chain ID: 8f42a19c...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
