'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  useFiscalPeriod,
  MONTH_NAMES_SHORT,
  PRIMARY_YEARS,
  AVAILABLE_YEARS,
} from '@/lib/period/fiscal-period-context';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  ChevronDown,
  Check,
  ArrowRightLeft,
  X,
  SlidersHorizontal,
  Clock,
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
    customDateRange,
    comparisonMode,
    setFiscalYear,
    toggleMonth,
    selectAllYear,
    selectYtd,
    selectQuarter,
    setCustomDateRange,
    setComparisonMode,
    getFormattedPeriodLabel,
  } = useFiscalPeriod();

  const [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStart, setCustomStart] = useState(`${fiscalYear}-01-01`);
  const [customEnd, setCustomEnd] = useState(`${fiscalYear}-12-31`);
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

  const isAllYearSelected = selectedMonths.length === 12 && !customDateRange;

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd && customStart <= customEnd) {
      setCustomDateRange({
        startDate: customStart,
        endDate: customEnd,
      });
      setIsOpen(false);
    }
  };

  const handleClearCustomRange = () => {
    setCustomDateRange(null);
    setShowCustomRange(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button - Proportional & Resilient against Text Wrapping */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs text-slate-100 shadow-sm group min-h-[38px] whitespace-nowrap cursor-pointer"
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
              {customDateRange ? (
                <span className="text-amber-400 font-sans">Intervalo Personalizado</span>
              ) : (
                <span className="text-emerald-400">
                  {selectedMonths.length} {selectedMonths.length === 1 ? 'mês' : 'meses'}
                </span>
              )}
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
        <div className="absolute left-0 mt-2 w-84 sm:w-[410px] rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
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

            {/* Primary Year Pills + Historical Select Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Exercício Fiscal (Ano):</span>
                <select
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(parseInt(e.target.value, 10))}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-mono rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500"
                >
                  <option disabled value="">Histórico Completo (2002-2026)</option>
                  {AVAILABLE_YEARS.map((y) => (
                    <option key={y} value={y}>
                      Exercício {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Year Access Pills */}
              <div className="grid grid-cols-6 gap-1">
                {PRIMARY_YEARS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setFiscalYear(year)}
                    className={`py-1 rounded-lg text-xs font-semibold font-mono text-center transition-all ${
                      fiscalYear === year && !customDateRange
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
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
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-semibold transition-colors"
              >
                YTD (Até Hoje)
              </button>
              <button
                type="button"
                onClick={selectAllYear}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  isAllYearSelected
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Ano Completo (12M)
              </button>
            </div>
          </div>

          {/* Month Multi-Select Grid (12 Months) */}
          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                Meses Selecionados:
              </span>
              <button
                type="button"
                onClick={() => setShowCustomRange(!showCustomRange)}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" />
                {showCustomRange ? 'Ocultar Intervalo de Dias' : 'Filtrar por Dias Específicos'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {MONTH_NAMES_SHORT.map((name, index) => {
                const monthNumber = index + 1;
                const isSelected = selectedMonths.includes(monthNumber) && !customDateRange;

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

          {/* Custom Date Range Filter Form (Collapsible) */}
          {showCustomRange && (
            <form onSubmit={handleApplyCustomRange} className="p-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Intervalo Exato de Datas (De / Até):
                </span>
                {customDateRange && (
                  <button
                    type="button"
                    onClick={handleClearCustomRange}
                    className="text-[10px] text-rose-400 hover:text-rose-300"
                  >
                    Limpar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">De:</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Até:</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Aplicar Intervalo de Datas
              </button>
            </form>
          )}

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
