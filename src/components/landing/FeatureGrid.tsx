'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Landmark,
  Sparkles,
  Camera,
  Users2,
  FileSignature,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function FeatureGrid() {
  const { t } = useI18n();

  const features = [
    {
      icon: Scale,
      title: t('nav.generalLedger'),
      tag: 'ASC 205 / 210 / 230',
      description: `${t('nav.journalEntries')}, ${t('nav.trialBalance')}, ${t('nav.balanceSheet')} & ${t('nav.incomeStatement')}.`,
      link: '/login',
      accentGlow: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
      borderColor: 'hover:border-emerald-500/50',
    },
    {
      icon: Landmark,
      title: t('nav.taxCompliance'),
      tag: 'Form 1065 / K-1 / 1099',
      description: `${t('taxCompliance.cpaBinderTitle')} • IRS Schedules K-1 & State Franchise Taxes.`,
      link: '/login',
      accentGlow: 'from-indigo-500/20 to-sky-500/20',
      iconColor: 'text-indigo-400',
      borderColor: 'hover:border-indigo-500/50',
    },
    {
      icon: Sparkles,
      title: t('nav.reports'),
      tag: 'CFA Financial AI',
      description: `${t('nav.reports')} • Sensitivity analysis & Monte Carlo Cash Flow Forecasting.`,
      link: '/login',
      accentGlow: 'from-sky-500/20 to-teal-500/20',
      iconColor: 'text-sky-400',
      borderColor: 'hover:border-sky-500/50',
    },
    {
      icon: Camera,
      title: t('nav.bankReconciliation'),
      tag: 'Plaid & 3-Way Match',
      description: `${t('reconciliation.threeWayMatching')} • Truist, Chase & Receipt Smart OCR.`,
      link: '/login',
      accentGlow: 'from-teal-500/20 to-emerald-500/20',
      iconColor: 'text-teal-400',
      borderColor: 'hover:border-teal-500/50',
    },
    {
      icon: Clock,
      title: t('nav.invoicing'),
      tag: 'Retainers & Invoicing',
      description: `${t('nav.invoicing')} • ${t('nav.scheduling')} & Team Dispatch.`,
      link: '/login',
      accentGlow: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
      borderColor: 'hover:border-amber-500/50',
    },
    {
      icon: FileSignature,
      title: t('nav.clientPortal'),
      tag: 'Security & e-Sign',
      description: `${t('nav.clientPortal')} • B2B Invoicing & Digital Contract Signatures.`,
      link: '/login',
      accentGlow: 'from-rose-500/20 to-purple-500/20',
      iconColor: 'text-rose-400',
      borderColor: 'hover:border-rose-500/50',
    },
  ];

  return (
    <section id="recursos" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* 3D Volumetric Lighting Background */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-teal-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/50 backdrop-blur-xl">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>US GAAP ENTERPRISE ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {t('landing.featureGridTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.featureGridSubtitle')}
          </p>
        </div>

        {/* 6 Feature 3D Holographic Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;

            return (
              <div
                key={idx}
                className={`rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800 ${f.borderColor} p-7 sm:p-8 space-y-5 transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between group backdrop-blur-xl relative overflow-hidden`}
              >
                {/* 3D Specular Light Top Border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 group-hover:via-emerald-400/70 to-transparent transition-all pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 group-hover:border-emerald-500/50 flex items-center justify-center ${f.iconColor} shadow-lg shadow-black/60 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-slate-300 px-3 py-1 rounded-full border border-slate-800 shadow-sm">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors font-serif tracking-tight pt-1">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={f.link}
                    className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ver Módulo ➔</span>
                  </Link>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
