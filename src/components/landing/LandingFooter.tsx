'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUpRight,
  Sparkles,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function LandingFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs relative overflow-hidden pt-12 pb-10">
      {/* 3D Atmospheric Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[300px] bg-emerald-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top 3D Specular Line Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 3D Floating Glassmorphic Footer Panel */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-2xl relative overflow-hidden mb-12">
          {/* Top Specular Border Light */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Brand & Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tight text-white font-serif">
                    Mister<span className="text-emerald-400">Contábil</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    US GAAP & FINANCIAL INTELLIGENCE
                  </span>
                </div>
              </Link>

              <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                {t('common.tagline')}
              </p>

              <div className="space-y-2.5 pt-3 text-xs text-slate-300">
                <div className="flex items-center space-x-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">contato@mistercontabil.com</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-medium">mistercontabil.com</span>
                </div>
              </div>
            </div>

            {/* Col 2: US GAAP Modules */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                US GAAP Accounting
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.balanceSheet')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.generalLedger')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.incomeStatement')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.journalEntries')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.trialBalance')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.chartOfAccounts')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Tax & IRS Compliance */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                IRS & Compliance
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('taxCompliance.cpaBinderTitle')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.partners')} (K-1)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.yearEndTax')} (1099/W-2)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.stateTaxes')} (DE/CA/TX)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.auditTrail')} (SOC 2 Merkle)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Operations & System */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                Operações & Acesso
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors block">
                    {t('auth.loginTitle')} ➔
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    Cadastro de Empresas
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.clientPortal')}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.bankReconciliation')} & OCR
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all block">
                    {t('nav.invoicing')} & Retainers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Bar in 3D Relief */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-2 px-2">
          <div>
            © {new Date().getFullYear()} Mister Contábil LLC. All Rights Reserved.
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <Link href="/login" className="hover:text-slate-200 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SOC 2 Type II Certified</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
