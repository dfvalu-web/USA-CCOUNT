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
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function LandingFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-serif">
                Mister<span className="text-emerald-400">Contábil</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {t('common.tagline')}
            </p>

            <div className="space-y-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contato@mistercontabil.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>mistercontabil.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: US GAAP Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              US GAAP Accounting
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/balanco" className="hover:text-emerald-400 transition-colors">
                  {t('nav.balanceSheet')}
                </Link>
              </li>
              <li>
                <Link href="/razao" className="hover:text-emerald-400 transition-colors">
                  {t('nav.generalLedger')}
                </Link>
              </li>
              <li>
                <Link href="/demonstrativos" className="hover:text-emerald-400 transition-colors">
                  {t('nav.incomeStatement')}
                </Link>
              </li>
              <li>
                <Link href="/diario" className="hover:text-emerald-400 transition-colors">
                  {t('nav.journalEntries')}
                </Link>
              </li>
              <li>
                <Link href="/balancete" className="hover:text-emerald-400 transition-colors">
                  {t('nav.trialBalance')}
                </Link>
              </li>
              <li>
                <Link href="/chart-of-accounts" className="hover:text-emerald-400 transition-colors">
                  {t('nav.chartOfAccounts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tax & IRS Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              IRS & Compliance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tax-compliance" className="hover:text-emerald-400 transition-colors">
                  {t('taxCompliance.cpaBinderTitle')}
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-emerald-400 transition-colors">
                  {t('nav.partners')}
                </Link>
              </li>
              <li>
                <Link href="/year-end-tax" className="hover:text-emerald-400 transition-colors">
                  {t('nav.yearEndTax')}
                </Link>
              </li>
              <li>
                <Link href="/state-taxes" className="hover:text-emerald-400 transition-colors">
                  {t('nav.stateTaxes')}
                </Link>
              </li>
              <li>
                <Link href="/audit-trail" className="hover:text-emerald-400 transition-colors">
                  {t('nav.auditTrail')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & System */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Operações & Acesso
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors font-bold text-white">
                  {t('auth.loginTitle')}
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-emerald-400 transition-colors">
                  {t('auth.registerTitle')}
                </Link>
              </li>
              <li>
                <Link href="/client-portal" className="hover:text-emerald-400 transition-colors">
                  {t('nav.clientPortal')}
                </Link>
              </li>
              <li>
                <Link href="/bank-reconciliation" className="hover:text-emerald-400 transition-colors">
                  {t('nav.bankReconciliation')}
                </Link>
              </li>
              <li>
                <Link href="/invoicing" className="hover:text-emerald-400 transition-colors">
                  {t('nav.invoicing')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Mister Contábil LLC. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:text-slate-200">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-200">
              SOC 2 Type II Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
