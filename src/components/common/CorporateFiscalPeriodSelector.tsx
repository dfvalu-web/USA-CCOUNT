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
      {/* Trigger Button - Proportional to Company Selector & Header elements */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-xs text-slate-100 shadow-sm group h-9"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Calendar className="w-3.5 h-3.5" />
        </div>

        <div className="text-left font-sans">
          <div className="font-bold text-white text-xs flex items-center gap-1.5">
            <span>{getFormattedPeriodLabel()}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isOpen ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </div>
          {!compact && (
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="text-emerald-400">{selectedMonths.length} {selectedMonths.length === 1 ? 'mês' : 'meses'}</span>
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
          {/* Header */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white text-xs">
                Ano & Meses
              </span>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono">
              {fiscalYear} • {selectedMonths.length}/12M
            </Badge>
          </div>

          <div className="p-3.5 space-y-3.5">
            {/* 1. SELEÇÃO DO ANO */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Ano Fiscal:
              </label>
              <div className="grid grid-cols-7 gap-1">
                {AVAILABLE_YEARS.map((yr) => {
                  const isCurrent = yr === fiscalYear;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFiscalYear(yr)}
                      className={`py-1 rounded-lg font-mono font-bold text-[11px] transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border border-emerald-400 shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELEÇÃO LIVRE DOS MESES */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Meses:
                </label>
                <span className="text-[9px] text-slate-500">Clique para alternar</span>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {MONTH_NAMES_SHORT.map((monthName, idx) => {
                  const monthNum = idx + 1;
                  const isSelected = selectedMonths.includes(monthNum);
                  return (
                    <button
                      key={monthNum}
                      type="button"
                      onClick={() => toggleMonth(monthNum)}
                      className={`py-1.5 rounded-lg text-center font-medium text-xs transition-all relative ${
                        isSelected
                          ? 'bg-emerald-950/70 border border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400'
                      }`}
                    >
                      <span>{monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. ATALHOS RÁPIDOS */}
            <div className="space-y-1.5 pt-1 border-t border-slate-900">
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={selectAllYear}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-medium border text-center ${
                    isAllYearSelected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Ano Todo
                </button>

                <button
                  type="button"
                  onClick={selectYtd}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-center"
                >
                  YTD
                </button>

                <button
                  type="button"
                  onClick={() => selectQuarter(1)}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-center"
                >
                  Q1 (Jan-Mar)
                </button>

                <button
                  type="button"
                  onClick={() => selectQuarter(2)}
                  className="py-1 px-1.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-center"
                >
                  Q2 (Abr-Jun)
                </button>
              </div>
            </div>

            {/* 4. COMPARATIVO YoY */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] text-slate-300">
                  Comparar YoY (vs. {fiscalYear - 1}):
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setComparisonMode(
                    comparisonMode === 'PRIOR_YEAR_YOY' ? 'NONE' : 'PRIOR_YEAR_YOY'
                  )
                }
                className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 ${
                  comparisonMode === 'PRIOR_YEAR_YOY' ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    comparisonMode === 'PRIOR_YEAR_YOY' ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 truncate max-w-[220px]">
              {getFormattedPeriodLabel()}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-1 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
