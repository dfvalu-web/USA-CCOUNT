'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  useFiscalPeriod,
  MONTH_NAMES_SHORT,
  AVAILABLE_YEARS,
} from '@/lib/period/fiscal-period-context';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  ChevronDown,
  Check,
  ArrowRightLeft,
  X,
} from 'lucide-react';

interface CorporateFiscalPeriodSelectorProps {
  compact?: boolean;
  className?: string;
}

export function CorporateFiscalPeriodSelector({
  compact = false,
  className = '',
}: CorporateFiscalPeriodSelectorProps) {
  const {
    fiscalYear,
    selectedMonths,
    comparisonMode,
    setFiscalYear,
    toggleMonth,
    selectAllYear,
    selectYtd,
    selectQuarter,
    setComparisonMode,
    getFormattedPeriodLabel,
  } = useFiscalPeriod();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAllYearSelected = selectedMonths.length === 12;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button - Proportional & Resilient against Text Wrapping */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs text-slate-100 shadow-sm group min-h-[38px] whitespace-nowrap cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Calendar className="w-3.5 h-3.5" />
        </div>

        <div className="text-left font-sans leading-tight">
          <div className="font-bold text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
            <span>{getFormattedPeriodLabel()}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${
                isOpen ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </div>
          {!compact && (
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono whitespace-nowrap leading-none mt-0.5">
              <span className="text-emerald-400">
                {selectedMonths.length} {selectedMonths.length === 1 ? 'mês' : 'meses'}
              </span>
              {comparisonMode === 'PRIOR_YEAR_YOY' && (
                <>
                  <span>•</span>
                  <span className="text-sky-400 font-sans">vs. {fiscalYear - 1} YoY</span>
                </>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-80 sm:w-[380px] rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
          {/* Header with Quick Presets */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">
                  Seletor de Período Fiscal
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Ano Fiscal {fiscalYear}
              </Badge>
            </div>

            {/* Year Selector Tabs */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400 font-medium mr-1">
                Ano:
              </span>
              {AVAILABLE_YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setFiscalYear(year)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                    fiscalYear === year
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Quick Macro Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => selectQuarter(1)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
              >
                1º Tri (Q1)
              </button>
              <button
                type="button"
                onClick={() => selectQuarter(2)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
              >
                2º Tri (Q2)
              </button>
              <button
                type="button"
                onClick={() => selectQuarter(3)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
              >
                3º Tri (Q3)
              </button>
              <button
                type="button"
                onClick={() => selectQuarter(4)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
              >
                4º Tri (Q4)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={selectYtd}
                className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold transition-colors"
              >
                YTD (Até Hoje)
              </button>
              <button
                type="button"
                onClick={selectAllYear}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  isAllYearSelected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Ano Completo (12M)
              </button>
            </div>
          </div>

          {/* Month Multi-Select Grid (12 Months) */}
          <div className="p-3.5 space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
              Selecione os Meses:
            </span>

            <div className="grid grid-cols-4 gap-1.5">
              {MONTH_NAMES_SHORT.map((name, index) => {
                const monthNumber = index + 1;
                const isSelected = selectedMonths.includes(monthNumber);

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleMonth(monthNumber)}
                    className={`h-8 rounded-lg font-medium text-xs flex items-center justify-center space-x-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    <span>{name}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Mode Settings */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-300 text-xs">
                Comparativo YoY ({fiscalYear - 1})
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setComparisonMode(
                  comparisonMode === 'PRIOR_YEAR_YOY' ? 'NONE' : 'PRIOR_YEAR_YOY'
                )
              }
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                comparisonMode === 'PRIOR_YEAR_YOY'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {comparisonMode === 'PRIOR_YEAR_YOY' ? 'Ativado' : 'Desativado'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
