'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Command,
  CheckCircle2,
  Users,
  Radio,
} from 'lucide-react';
import { CorporateFiscalPeriodSelector } from '@/components/common/CorporateFiscalPeriodSelector';
import { GlobalCompanySelector } from '@/components/common/GlobalCompanySelector';

interface HeaderProps {
  onOpenCommandMenu: () => void;
  onOpenNewEntry: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function Header({ onOpenCommandMenu, onOpenNewEntry, onNavigateTab }: HeaderProps) {
  const { locale, setLocale, basis, setBasis, t } = useI18n();
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Accounting Basis Switch & Corporate Fiscal Period Selector */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Accrual / Cash Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setBasis('ACCRUAL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              basis === 'ACCRUAL'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('common.accrual')}
          </button>
          <button
            type="button"
            onClick={() => setBasis('CASH')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              basis === 'CASH'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
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

      {/* Center: Interactive Global Company Selector Dropdown (Permite selecionar qualquer empresa) */}
      <div className="hidden md:flex items-center">
        <GlobalCompanySelector />
      </div>

      {/* Right: Monitoring Pulse, User Profile, Search, Language & New Entry Button */}
      <div className="flex items-center space-x-2.5">
        {/* Live Active Sessions Badge */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('system-monitoring')}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
          title="Ver Centro de Comando & Pessoas Logadas"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 font-bold">4</span>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-200">Online</span>
        </button>

        {/* Quick Command Trigger */}
        <button
          type="button"
          onClick={onOpenCommandMenu}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer"
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
              type="button"
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

        {/* Logged-in Partner Profile Card */}
        {user && (
          <div
            onClick={() => onNavigateTab?.('system-monitoring')}
            className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-xl cursor-pointer transition-colors"
            title={`${user.name} (${user.email}) • Clique para ver sessões ativas`}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-emerald-500/50 object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center border border-emerald-500/40">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-white leading-none truncate max-w-[110px]">{user.name}</div>
              <div className="text-[9px] text-emerald-400 font-mono leading-none mt-0.5">
                {user.role === 'ADMIN_OWNER' ? 'Master Owner' : user.role}
              </div>
            </div>
          </div>
        )}

        {/* New Journal Entry Button */}
        <Button size="sm" variant="primary" onClick={onOpenNewEntry}>
          + {t('accounting.newEntry')}
        </Button>
      </div>
    </header>
  );
}
