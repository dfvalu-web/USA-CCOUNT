'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  BookOpen,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  Calculator,
  Printer,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';

export function InteractiveLedgerTeaser() {
  const { t, formatCurrency } = useI18n();
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const yearData: Record<number, { assets: number; cash: number; fleet: number; equity: number; revenue: number; netIncome: number }> = {
    2022: { assets: 374145.84, cash: 325645.84, fleet: 48500.00, equity: 374145.84, revenue: 342851.75, netIncome: 299233.85 },
    2023: { assets: 387292.78, cash: 338792.78, fleet: 48500.00, equity: 387292.78, revenue: 477370.70, netIncome: 70238.99 },
    2024: { assets: 320771.75, cash: 272271.75, fleet: 48500.00, equity: 320771.75, revenue: 412313.30, netIncome: -20554.09 },
    2025: { assets: 381922.40, cash: 283617.40, fleet: 98305.00, equity: 349522.40, revenue: 364061.65, netIncome: 61190.65 },
  };

  const current = yearData[selectedYear] || yearData[2024];

  return (
    <section id="demonstrativos" className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>US GAAP ASC 210 / ASC 606</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {t('landing.interactiveTitle')}
          </h2>
          <p className="text-sm text-slate-400">
            {t('landing.interactiveSubtitle')}
          </p>

          {/* Year Buttons */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {[2022, 2023, 2024, 2025].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  selectedYear === yr
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t('common.year')} {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Double-Entry Ledger & Balance Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Balance Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/90 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wide block">
                  US GAAP ASC 210
                </span>
                <h3 className="text-lg font-bold text-white font-serif">
                  {t('nav.balanceSheet')} ({selectedYear})
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('accounting.balancedProof')}
              </span>
            </div>

            {/* Asset Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
                <span>1. {t('accounting.totalAssets')}</span>
                <span className="font-mono text-emerald-400 text-sm font-extrabold">
                  {formatCurrency(current.assets)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-emerald-400">1010 • Cash & Equivalents (Truist/Chase)</span>
                  <span className="font-mono font-semibold">{formatCurrency(current.cash)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-emerald-400">1510 • Vehicles & Equipment (Property, Plant)</span>
                  <span className="font-mono font-semibold">{formatCurrency(current.fleet)}</span>
                </div>
              </div>
            </div>

            {/* Equity Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
                <span>2. {t('accounting.totalEquity')}</span>
                <span className="font-mono text-sky-400 text-sm font-extrabold">
                  {formatCurrency(current.equity)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-sky-400">3010 • Members’ Contributed Capital</span>
                  <span className="font-mono font-semibold">{formatCurrency(115000)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-sky-400">3020 • {t('accounting.retainedEarnings')}</span>
                  <span className="font-mono font-semibold">100% {t('common.balanced')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Equality Proof */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/40 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('accounting.balanceSheetEquation')}
              </span>
              <span className="text-base font-bold font-mono text-emerald-400">
                ✓ {t('accounting.balancedProof')}
              </span>
            </div>
          </div>

          {/* Right Column: P&L and Features Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Income Statement Highlight */}
            <div className="bg-slate-950/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">{t('nav.incomeStatement')} ({selectedYear})</h4>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                  US GAAP ASC 606
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t('accounting.revenue')}:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(current.revenue)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t('accounting.netIncome')}:</span>
                  <span className={`font-mono font-bold ${current.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(current.netIncome)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>{t('nav.incomeStatement')} ➔</span>
                </Link>
              </div>
            </div>

            {/* Diamond Print Feature Card */}
            <div className="bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-900 rounded-3xl border border-emerald-500/30 p-6 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Printer className="w-4 h-4" />
                <span>{t('reports.auditStamp')}</span>
              </div>
              <h4 className="text-base font-bold text-white font-serif">
                {t('reports.preparedBy')} CPA & SBA Loan Ready
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('reports.notesTitle')}
              </p>
              <div className="pt-1">
                <Link
                  href="/login"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('common.print')} (PDF)</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
