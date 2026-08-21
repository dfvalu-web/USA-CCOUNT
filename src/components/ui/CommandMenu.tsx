'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';
import {
  Search,
  BookOpen,
  Receipt,
  Users,
  PieChart,
  Calendar,
  Layers,
  ArrowUpDown,
  Globe,
  FileSpreadsheet
} from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewEntry?: () => void;
}

export function CommandMenu({ isOpen, onClose, onOpenNewEntry }: CommandMenuProps) {
  const { locale, setLocale, basis, setBasis, t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open menu
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'new-entry',
      category: 'Accounting Actions',
      title: t('accounting.newEntry'),
      icon: BookOpen,
      action: () => {
        onClose();
        if (onOpenNewEntry) onOpenNewEntry();
      },
    },
    {
      id: 'toggle-accrual',
      category: 'Accounting Basis',
      title: `${t('common.accrual')} (Switch)`,
      icon: ArrowUpDown,
      action: () => {
        setBasis('ACCRUAL');
        onClose();
      },
    },
    {
      id: 'toggle-cash',
      category: 'Accounting Basis',
      title: `${t('common.cash')} (Switch)`,
      icon: ArrowUpDown,
      action: () => {
        setBasis('CASH');
        onClose();
      },
    },
    ...locales.map((loc) => ({
      id: `lang-${loc.code}`,
      category: 'Language / Idioma',
      title: `${loc.flag} ${loc.name} ${loc.code === locale ? '✓' : ''}`,
      icon: Globe,
      action: () => {
        setLocale(loc.code);
        onClose();
      },
    })),
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="w-4 h-4 mr-2 text-slate-400" />
          <input
            type="text"
            className="w-full h-12 bg-transparent text-sm placeholder:text-slate-500 text-white focus:outline-none"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-500">Nenhum comando encontrado.</p>
          ) : (
            filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-800/80 text-left group transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                    <span className="font-medium text-slate-200 group-hover:text-white">
                      {action.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{action.category}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>UAS Accounting Command Menu</span>
          <span>
            Current Basis: <strong className="text-emerald-400">{basis}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
