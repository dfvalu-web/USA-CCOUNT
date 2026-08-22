'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';
import {
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';

interface LandingHeaderProps {
  onOpenLoginModal?: () => void;
}

export function LandingHeader({ onOpenLoginModal }: LandingHeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = locales.find((l) => l.code === locale) || locales[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Clean & Diamond Standard */}
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white font-serif block">
              Mister<span className="text-emerald-400">Contábil</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-wider font-sans block -mt-0.5">
              FINANCIAL & TAX INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Spacious & Refined */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-slate-300">
          <a
            href="#demonstrativos"
            className="hover:text-emerald-400 transition-colors py-1 relative group"
          >
            <span>{t('landing.navDemonstrativos') || 'Demonstrativos'}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          <a
            href="#recursos"
            className="hover:text-emerald-400 transition-colors py-1 relative group"
          >
            <span>{t('landing.navRecursos') || 'Recursos & BI'}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          <a
            href="#tributacao"
            className="hover:text-emerald-400 transition-colors py-1 relative group"
          >
            <span>{t('landing.navCompliance') || 'Compliance Fiscal'}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          <a
            href="#precos"
            className="hover:text-emerald-400 transition-colors py-1 relative group"
          >
            <span>{t('landing.navPrecos') || 'Planos'}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
          <a
            href="#seguranca"
            className="hover:text-emerald-400 transition-colors py-1 relative group"
          >
            <span>{t('landing.navSeguranca') || 'Segurança SOC 2'}</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
        </nav>

        {/* Action Controls & Single Primary CTA */}
        <div className="hidden sm:flex items-center space-x-3.5 shrink-0">
          {/* Floating Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
              title="Selecionar Idioma"
            >
              <span>{currentLang.flag}</span>
              <span className="font-mono font-bold text-[11px]">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-950/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-1.5 space-y-0.5 z-50 animate-in fade-in zoom-in-95">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => {
                      setLocale(loc.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      locale === loc.code
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{loc.flag}</span>
                      <span>{loc.name}</span>
                    </span>
                    {locale === loc.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Single Diamond CTA Button */}
          <Link
            href="/login"
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t('landing.ctaAccess') || 'Acessar Plataforma'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
            <a
              href="#demonstrativos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.navDemonstrativos') || 'Demonstrativos'}
            </a>
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.navRecursos') || 'Recursos & BI'}
            </a>
            <a
              href="#tributacao"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.navCompliance') || 'Compliance Fiscal'}
            </a>
            <a
              href="#precos"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.navPrecos') || 'Planos'}
            </a>
            <a
              href="#seguranca"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-emerald-400 py-1"
            >
              {t('landing.navSeguranca') || 'Segurança SOC 2'}
            </a>
          </nav>

          {/* Mobile Language & CTA */}
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-3">
            <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-xs px-2">Idioma:</span>
              <div className="flex space-x-1">
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => setLocale(loc.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      locale === loc.code
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {loc.flag} {loc.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{t('landing.ctaAccess') || 'Acessar Plataforma'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
