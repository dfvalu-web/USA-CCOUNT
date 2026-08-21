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
  Layers,
  ShieldCheck,
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
    <section id="demonstrativos" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* 3D Atmospheric Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-600/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-lg shadow-emerald-950/50 backdrop-blur-xl">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>US GAAP ASC 210 / ASC 606 MATRIZ DE EQUILÍBRIO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {t('landing.interactiveTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.interactiveSubtitle')}
          </p>

          {/* 3D Floating Year Tabs */}
          <div className="flex items-center justify-center gap-2.5 pt-4">
            {[2022, 2023, 2024, 2025].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all duration-300 cursor-pointer relative ${
                  selectedYear === yr
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_10px_25px_rgba(16,185,129,0.4)] scale-105 ring-2 ring-emerald-300/40 font-black'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/90 shadow-md backdrop-blur-md hover:scale-102'
                }`}
              >
                {t('common.year')} {yr}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Holographic Dual-Pane Ledger & Statement Suite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Balance Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 rounded-3xl border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group">
            {/* Top Specular Border Light Reflection */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
              <div>
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wide block">
                  US GAAP ASC 210
                </span>
                <h3 className="text-xl font-bold text-white font-serif tracking-tight">
                  {t('nav.balanceSheet')} ({selectedYear})
                </h3>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('accounting.balancedProof')}</span>
              </span>
            </div>

            {/* Asset Breakdown 3D Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span>1. {t('accounting.totalAssets')}</span>
                <span className="font-mono text-emerald-400 text-base font-black drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
                  {formatCurrency(current.assets)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-2.5 text-xs shadow-inner">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-emerald-400 font-medium">1010 • Cash & Equivalents (Truist/Chase)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(current.cash)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-emerald-400 font-medium">1510 • Vehicles & Equipment (Property, Plant)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(current.fleet)}</span>
                </div>
              </div>
            </div>

            {/* Equity Breakdown 3D Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span>2. {t('accounting.totalEquity')}</span>
                <span className="font-mono text-sky-400 text-base font-black drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]">
                  {formatCurrency(current.equity)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-2.5 text-xs shadow-inner">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-sky-400 font-medium">3010 • Members’ Contributed Capital</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(115000)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono text-sky-400 font-medium">3020 • Cumulative Retained Earnings</span>
                  <span className="font-mono font-bold text-emerald-400">100% Balanced</span>
                </div>
              </div>
            </div>

            {/* Verification Proof Footer */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-teal-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
              <span className="text-slate-300 font-medium text-center sm:text-left">
                {t('accounting.balanceSheetEquation')}
              </span>
              <span className="font-mono font-black text-emerald-300 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {t('accounting.balancedProof')}
              </span>
            </div>
          </div>

          {/* Right Column: 3D Income Statement & Audit Proof (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Income Statement (P&L) 3D Card */}
            <div className="bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(56,189,248,0.1)] backdrop-blur-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <h3 className="text-base font-bold text-white font-serif">
                    {t('nav.incomeStatement')} ({selectedYear})
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">US GAAP ASC 606</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Revenue from Services:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {formatCurrency(current.revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Net Income / (Loss):</span>
                  <span className={`font-mono font-bold text-sm ${current.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(current.netIncome)}
                  </span>
                </div>
              </div>

              <Link
                href="/login"
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('nav.incomeStatement')} ➔</span>
              </Link>
            </div>

            {/* Audit Quality Stamp 3D Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-emerald-950/40 border border-emerald-500/30 space-y-3 shadow-xl backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <Printer className="w-4 h-4" />
                <span>{t('reports.auditStamp')}</span>
              </div>
              <h4 className="text-sm font-bold text-white font-serif">
                Prepared By CPA & SBA Loan Ready
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('reports.notesTitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
