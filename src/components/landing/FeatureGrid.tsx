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
      link: '/razao',
      accentColor: 'emerald',
    },
    {
      icon: Landmark,
      title: t('nav.taxCompliance'),
      tag: 'Form 1065 / K-1 / 1099',
      description: `${t('taxCompliance.cpaBinderTitle')} • IRS Schedules K-1 & State Franchise Taxes.`,
      link: '/tax-compliance',
      accentColor: 'indigo',
    },
    {
      icon: Sparkles,
      title: t('nav.reports'),
      tag: 'CFA Financial AI',
      description: `${t('nav.reports')} • Sensitivity analysis & Monte Carlo Cash Flow Forecasting.`,
      link: '/reports',
      accentColor: 'sky',
    },
    {
      icon: Camera,
      title: t('nav.bankReconciliation'),
      tag: 'Plaid & 3-Way Match',
      description: `${t('reconciliation.threeWayMatching')} • Truist, Chase & Receipt Smart OCR.`,
      link: '/bank-reconciliation',
      accentColor: 'teal',
    },
    {
      icon: Clock,
      title: t('nav.invoicing'),
      tag: 'Retainers & Invoicing',
      description: `${t('nav.invoicing')} • ${t('nav.scheduling')} & Team Dispatch.`,
      link: '/invoicing',
      accentColor: 'amber',
    },
    {
      icon: FileSignature,
      title: t('nav.clientPortal'),
      tag: 'Security & e-Sign',
      description: `${t('nav.clientPortal')} • B2B Invoicing & Digital Contract Signatures.`,
      link: '/client-portal',
      accentColor: 'rose',
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>US GAAP Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            {t('landing.featureGridTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('landing.featureGridSubtitle')}
          </p>
        </div>

        {/* 6 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;

            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 sm:p-8 space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/30 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-950 text-slate-400 px-2.5 py-1 rounded-full border border-slate-800">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-serif">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    href={f.link}
                    className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center justify-between group/link"
                  >
                    <span>{t('common.viewDetails')}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover/link:text-emerald-400 group-hover/link:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
