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
  Globe,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LandingHeaderProps {
  onOpenLoginModal?: () => void;
}

export function LandingHeader({ onOpenLoginModal }: LandingHeaderProps) {
  const { locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
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
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
          <a href="#recursos" className="hover:text-emerald-400 transition-colors">
            Recursos & Módulos
          </a>
          <a href="#demonstrativos" className="hover:text-emerald-400 transition-colors">
            Demonstrativos US GAAP
          </a>
          <a href="#tributacao" className="hover:text-emerald-400 transition-colors">
            IRS & Compliance Fiscal
          </a>
          <a href="#precos" className="hover:text-emerald-400 transition-colors">
            Planos
          </a>
          <a href="#seguranca" className="hover:text-emerald-400 transition-colors">
            Segurança & SOC 2
          </a>
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setLocale('pt')}
              className={`px-2 py-0.5 rounded ${locale === 'pt' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              PT
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2 py-0.5 rounded ${locale === 'en' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('es')}
              className={`px-2 py-0.5 rounded ${locale === 'es' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              ES
            </button>
          </div>

          <Link
            href="/login"
            className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Entrar
          </Link>

          <Link
            href="/dashboard"
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>Acessar Plataforma</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-5 space-y-4 text-sm font-semibold text-slate-300">
          <a
            href="#recursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-emerald-400"
          >
            Recursos & Módulos
          </a>
          <a
            href="#demonstrativos"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-emerald-400"
          >
            Demonstrativos US GAAP
          </a>
          <a
            href="#tributacao"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-emerald-400"
          >
            IRS & Compliance Fiscal
          </a>
          <a
            href="#precos"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-emerald-400"
          >
            Planos
          </a>
          <a
            href="#seguranca"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-emerald-400"
          >
            Segurança & SOC 2
          </a>

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold"
            >
              Fazer Login
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
