'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/context';

export function PricingSection() {
  const { t, formatCurrency } = useI18n();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter Business',
      badge: 'Small Business / LLC',
      priceMonthly: 189,
      priceAnnual: 149,
      description: 'Ideal for establishing US companies requiring core US GAAP books and statements.',
      features: [
        t('nav.journalEntries'),
        t('nav.trialBalance'),
        `${t('nav.balanceSheet')} & ${t('nav.incomeStatement')}`,
        `${t('nav.bankReconciliation')} (150 OCR receipts/mo)`,
        '1 Company / Tax Entity',
        'CSV & PDF Financial Exports',
      ],
      ctaText: 'Get Started',
      isPopular: false,
      href: '/cadastro',
    },
    {
      name: 'Diamond Corporate',
      badge: 'Most Popular • Recommended',
      priceMonthly: 429,
      priceAnnual: 349,
      description: 'Comprehensive financial, tax compliance, and automated reporting suite for US operating LLCs.',
      features: [
        'All Starter Business Features',
        t('nav.generalLedger'),
        t('nav.cashFlow'),
        t('taxCompliance.cpaBinderTitle'),
        t('reports.notesTitle'),
        t('nav.reports'),
        t('nav.clientPortal'),
        'Up to 3 Linked Companies',
      ],
      ctaText: 'Choose Diamond Corporate',
      isPopular: true,
      href: '/cadastro',
    },
    {
      name: 'CPA Firm & Holding',
      badge: 'Firms & Holdings',
      priceMonthly: 989,
      priceAnnual: 799,
      description: 'Tailored for CPA firms, accounting offices, and multi-state corporate holdings.',
      features: [
        'All Diamond Corporate Features',
        t('nav.multiEntity'),
        'IRS MeF XML Direct e-File Mapping',
        t('nav.auditTrail'),
        'Dedicated Client Access Workspaces',
        'Direct Bank Feeds & Automated Webhooks',
        'Dedicated Account Manager & CPA Support',
      ],
      ctaText: 'Contact Sales',
      isPopular: false,
      href: '/cadastro',
    },
  ];

  return (
    <section id="precos" className="py-24 bg-slate-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>SaaS Pricing & Compliance</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            {t('landing.pricingTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('landing.pricingSubtitle')}
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              {t('landing.monthlyBilling')}
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-950 p-1 border border-slate-800 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              <span>{t('landing.annualBilling')}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {t('landing.save20')}
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  p.isPopular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/30 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 scale-105 z-10'
                    : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{p.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!p.isPopular && (
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white font-serif">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.description}</p>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                        {formatCurrency(price)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">/ mo</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAnnual ? 'Billed annually (USD)' : 'Billed monthly (USD)'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Features Included:
                    </span>
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={p.href}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      p.isPopular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                    }`}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
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
