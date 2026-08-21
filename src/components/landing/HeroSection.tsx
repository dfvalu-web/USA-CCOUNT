'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Scale,
  BookOpen,
  CheckCircle2,
  Lock,
  Landmark,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';

export function HeroSection() {
  const { t, formatCurrency } = useI18n();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950">
      {/* 4K Background Radial Glows & Grid Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-sky-600/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-[-100px] w-[500px] h-[400px] bg-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Subtle Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Audit-Ready Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-xl shadow-lg shadow-emerald-950/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t('landing.heroBadge')}</span>
          </div>

          {/* Main 4K Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.1]">
            {t('landing.heroTitle1')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              {t('landing.heroTitle2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          {/* CTAs Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 group hover:scale-[1.02]"
            >
              <span>{t('landing.ctaAccess')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-bold text-sm backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('landing.ctaDemo')}</span>
            </Link>
          </div>

          {/* Trust Pillars */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>US GAAP ASC 205/210/606</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>IRS Form 1065 / K-1 Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 Type II Merkle Audit Trail</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('accounting.balancedProof')}</span>
            </div>
          </div>
        </div>

        {/* 4K Hero Card Visualizer Teaser */}
        <div className="mt-14 max-w-5xl mx-auto relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-sky-500/30 blur-xl opacity-75 pointer-events-none" />

          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden p-6 sm:p-8">
            {/* Top Control Bar of Visualizer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">
                  mistercontabil.com • Live GAAP Engine
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-semibold">{t('common.status')}:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('accounting.balancedProof')}
                </span>
              </div>
            </div>

            {/* Metrics Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('accounting.totalAssets')}</span>
                  <Scale className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span>✓ 100% US GAAP Compliant</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('accounting.totalLiabilitiesAndEquity')}</span>
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(320771.75)}
                </div>
                <div className="text-[10px] text-sky-400 flex items-center gap-1">
                  <span>✓ {t('accounting.balanceSheetEquation')}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{t('nav.journalEntries')}</span>
                  <BookOpen className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatCurrency(6577924.35)}
                </div>
                <div className="text-[10px] text-teal-300 flex items-center gap-1">
                  <span>✓ {t('accounting.ruleDebitCredit')}</span>
                </div>
              </div>
            </div>

            {/* Live Navigation Tabs Preview */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="font-semibold">{t('common.actions')}:</span>
                <Link href="/balanco" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium">
                  {t('nav.balanceSheet')} ➔
                </Link>
                <Link href="/razao" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium">
                  {t('nav.generalLedger')} ➔
                </Link>
                <Link href="/demonstrativos" className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:text-emerald-300 font-medium">
                  {t('nav.incomeStatement')} ➔
                </Link>
              </div>

              <Link
                href="/dashboard"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>{t('nav.dashboard')}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
