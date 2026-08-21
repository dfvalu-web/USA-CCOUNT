'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Lock,
} from 'lucide-react';

interface LandingHeaderProps {
  onOpenLoginModal?: () => void;
}

export function LandingHeader({ onOpenLoginModal }: LandingHeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-serif">
                Mister<span className="text-emerald-400">Contábil</span>
              </span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase font-bold">
                4K US GAAP
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider font-sans block -mt-0.5">
              FINANCIAL & TAX INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-300">
          <a href="#demonstrativos" className="hover:text-emerald-400 transition-colors">
            {t('nav.balanceSheet')}
          </a>
          <a href="#recursos" className="hover:text-emerald-400 transition-colors">
            {t('nav.reports')}
          </a>
          <a href="#tributacao" className="hover:text-emerald-400 transition-colors">
            {t('nav.taxCompliance')}
          </a>
          <a href="#precos" className="hover:text-emerald-400 transition-colors">
            {t('landing.pricingTitle')}
          </a>
          <a href="#seguranca" className="hover:text-emerald-400 transition-colors">
            {t('landing.securityTitle')}
          </a>
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setLocale('pt')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${locale === 'pt' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${locale === 'en' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('es')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${locale === 'es' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              ES
            </button>
          </div>

          {/* Secure Login Link */}
          <Link
            href="/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('auth.loginTitle')}</span>
          </Link>

          {/* CTA Access Platform */}
          <Link
            href="/login"
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <span>{t('landing.ctaAccess')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
            <a
              href="#demonstrativos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('nav.balanceSheet')}
            </a>
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('nav.reports')}
            </a>
            <a
              href="#tributacao"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('nav.taxCompliance')}
            </a>
            <a
              href="#precos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.pricingTitle')}
            </a>
            <a
              href="#seguranca"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.securityTitle')}
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200"
            >
              {t('auth.loginTitle')}
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-lg"
            >
              {t('landing.ctaAccess')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
