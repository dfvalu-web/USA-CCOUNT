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
  Layers,
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
      href: '/login',
    },
    {
      name: 'Diamond Corporate',
      badge: 'MOST POPULAR • RECOMMENDED',
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
      href: '/login',
    },
    {
      name: 'CPA Firm & Holding',
      badge: 'FIRMS & HOLDINGS',
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
      href: '/login',
    },
  ];

  return (
    <section id="precos" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* 3D Radial Atmospheric Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-600/10 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-lg shadow-emerald-950/50 backdrop-blur-xl">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>INSTITUTIONAL SAAS PLANS & COMPLIANCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            {t('landing.pricingTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.pricingSubtitle')}
          </p>

          {/* Monthly / Annual Toggle in 3D Relief */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <span className={`text-xs font-bold transition-colors ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              {t('landing.monthlyBilling')}
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-slate-900 p-1 border border-slate-700/80 shadow-inner transition-colors relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/50 transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              <span>{t('landing.annualBilling')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 shadow-sm">
                {t('landing.save20')}
              </span>
            </span>
          </div>
        </div>

        {/* 3D Holographic Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-500 backdrop-blur-2xl overflow-hidden ${
                  p.isPopular
                    ? 'bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-emerald-950/40 border-2 border-emerald-500 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(16,185,129,0.25)] lg:-translate-y-3 lg:scale-105 z-20'
                    : 'bg-gradient-to-b from-slate-900/85 via-slate-950/90 to-slate-950 border border-slate-800/90 hover:border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-1'
                }`}
              >
                {/* 3D Specular Light Top Border */}
                <div className={`absolute inset-x-0 top-0 h-px ${p.isPopular ? 'bg-gradient-to-r from-transparent via-emerald-300 to-transparent' : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'} pointer-events-none`} />

                {p.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/30 flex items-center gap-1.5 border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{p.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!p.isPopular && (
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-white font-serif tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      {p.description}
                    </p>
                  </div>

                  {/* 3D Price Display */}
                  <div className="py-2 border-y border-slate-800/80">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        ${price}.00
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ mo</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono block mt-1">
                      {isAnnual ? 'Faturado anualmente (USD)' : 'Faturado mensalmente (USD)'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 text-xs">
                    <span className="font-bold text-slate-300 uppercase text-[10px] tracking-wider block">
                      Recursos Inclusos:
                    </span>
                    <ul className="space-y-2.5">
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5 text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3D Convex CTA Button */}
                <div className="pt-8">
                  <Link
                    href={p.href}
                    className={`w-full h-12 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xl ${
                      p.isPopular
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black shadow-emerald-500/30 hover:scale-[1.02]'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-600 hover:scale-[1.01]'
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
