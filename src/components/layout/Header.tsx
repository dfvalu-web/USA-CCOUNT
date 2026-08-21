'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CheckCircle2,
} from 'lucide-react';
import { CorporateFiscalPeriodSelector } from '@/components/common/CorporateFiscalPeriodSelector';

interface HeaderProps {
  onOpenCommandMenu: () => void;
  onOpenNewEntry: () => void;
}

export function Header({ onOpenCommandMenu, onOpenNewEntry }: HeaderProps) {
  const { locale, setLocale, basis, setBasis, t } = useI18n();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Accounting Basis Switch & Corporate Fiscal Period Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Accrual / Cash Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
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

        {/* Corporate Fiscal Period Selector (Global) */}
        <div className="flex items-center">
          <CorporateFiscalPeriodSelector />
        </div>
      </div>

      {/* Right: Search / Command Menu, Language, Balanced Status & New Entry Button */}
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
      </div>
    </header>
  );
}
