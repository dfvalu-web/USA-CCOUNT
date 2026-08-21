'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/auth-context';
import { locales } from '@/lib/i18n/config';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Command,
  Building2,
  CheckCircle2,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { CorporateFiscalPeriodSelector } from '@/components/common/CorporateFiscalPeriodSelector';
import { GlobalCompanySelector } from '@/components/common/GlobalCompanySelector';

interface HeaderProps {
  onOpenCommandMenu: () => void;
  onOpenNewEntry: () => void;
}

export function Header({ onOpenCommandMenu, onOpenNewEntry }: HeaderProps) {
  const { locale, setLocale, basis, setBasis, t } = useI18n();
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Global Company Selector & Accounting Basis Switch */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <GlobalCompanySelector />

        {/* Accrual / Cash Toggle */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setBasis('ACCRUAL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              basis === 'ACCRUAL'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('common.accrual')}
          </button>
          <button
            onClick={() => setBasis('CASH')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              basis === 'CASH'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('common.cash')}
          </button>
        </div>
      </div>

      {/* Center: Corporate Fiscal Period Selector (Global) */}
      <div className="hidden md:flex items-center">
        <CorporateFiscalPeriodSelector />
      </div>

      {/* Right: Search / Command Menu, Language, New Entry Button */}
      <div className="flex items-center space-x-3">
        {/* Quick Command Trigger */}
        <button
          onClick={onOpenCommandMenu}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
        >
          <Command className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('common.search')}</span>
          <kbd className="px-1 py-0.5 text-[9px] font-semibold text-slate-400 bg-slate-800 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => setLocale(loc.code)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                locale === loc.code
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={loc.name}
            >
              {loc.flag}
            </button>
          ))}
        </div>

        {/* Ledger Balanced Status */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{t('common.balanced')}</span>
        </div>

        {/* New Journal Entry Button */}
        <Button size="sm" variant="primary" onClick={onOpenNewEntry}>
          + {t('accounting.newEntry')}
        </Button>

        {/* Logged in User Profile & Role Indicator */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <Link
            href="/login"
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-900 transition-colors group"
            title="Clique para alternar usuário / fazer login"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {user?.name ? user.name.charAt(0) : 'M'}
            </div>
            <div className="hidden xl:block text-left text-xs leading-none">
              <span className="font-bold text-white block group-hover:text-emerald-300 transition-colors">
                {user?.name || 'Milla Santos'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {user?.role === 'CPA_ACCOUNTANT' ? 'CPA Auditor' : user?.role === 'CLIENT_B2B' ? 'Cliente B2B' : 'Admin LLC'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            title="Sair da sessão / Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
