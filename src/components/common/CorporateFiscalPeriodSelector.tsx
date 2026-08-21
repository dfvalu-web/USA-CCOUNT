'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  useFiscalPeriod,
  MONTH_NAMES_SHORT,
  MONTH_NAMES_FULL,
  AVAILABLE_YEARS,
} from '@/lib/period/fiscal-period-context';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  ChevronDown,
  Check,
  Sparkles,
  ArrowRightLeft,
  X,
  Layers,
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
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/60 transition-all text-xs text-slate-100 shadow-sm group"
      >
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Calendar className="w-4 h-4" />
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
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-emerald-400 font-bold">FY {fiscalYear}</span>
              <span>•</span>
              <span>{selectedMonths.length} {selectedMonths.length === 1 ? 'mês' : 'meses'} ativos</span>
              {comparisonMode === 'PRIOR_YEAR_YOY' && (
                <>
                  <span>•</span>
                  <span className="text-sky-400">vs. {fiscalYear - 1} YoY</span>
                </>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Direct Dropdown Filter Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-80 sm:w-[420px] rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 text-xs">
          {/* Panel Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white text-xs">
                Filtro de Período Contábil (Ano & Meses)
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* 1. SELEÇÃO DO ANO FISCAL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Selecione o Ano Fiscal:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {AVAILABLE_YEARS.map((yr) => {
                  const isCurrent = yr === fiscalYear;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setFiscalYear(yr)}
                      className={`py-1.5 px-2 rounded-lg font-mono font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md shadow-emerald-950 scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELEÇÃO LIVRE DOS MESES (12 MESES) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  2. Escolha os Meses ({selectedMonths.length}/12 selecionados):
                </label>
                <span className="text-[9px] text-slate-500">Clique para ativar/desativar</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {MONTH_NAMES_SHORT.map((monthName, idx) => {
                  const monthNum = idx + 1;
                  const isSelected = selectedMonths.includes(monthNum);
                  return (
                    <button
                      key={monthNum}
                      type="button"
                      onClick={() => toggleMonth(monthNum)}
                      className={`py-2 px-1 rounded-xl text-center font-medium text-xs transition-all relative ${
                        isSelected
                          ? 'bg-emerald-950/60 border border-emerald-500 text-white font-bold shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{monthName}</span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-emerald-400 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. ATALHOS RÁPIDOS */}
            <div className="space-y-1.5 pt-1 border-t border-slate-900">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Atalhos Rápidos de Fechamento:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={selectAllYear}
                  className={`py-1 px-2 rounded-lg text-[11px] font-medium border text-left flex items-center justify-between ${
                    isAllYearSelected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span>✨ Ano Todo (12M)</span>
                  {isAllYearSelected && <Check className="w-3 h-3 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={selectYtd}
                  className="py-1 px-2 rounded-lg text-[11px] font-medium bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-left flex items-center justify-between"
                >
                  <span>⚡ YTD (Até Hoje)</span>
                </button>

                <div className="grid grid-cols-2 gap-1 sm:col-span-1">
                  <button
                    type="button"
                    onClick={() => selectQuarter(1)}
                    className="py-1 px-1.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-center"
                  >
                    Q1 (Jan-Mar)
                  </button>
                  <button
                    type="button"
                    onClick={() => selectQuarter(2)}
                    className="py-1 px-1.5 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-center"
                  >
                    Q2 (Abr-Jun)
                  </button>
                </div>
              </div>
            </div>

            {/* 4. COMPARATIVO YoY */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] text-slate-300 font-medium">
                  Benchmark Comparativo com Ano Anterior ({fiscalYear - 1} YoY):
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setComparisonMode(
                    comparisonMode === 'PRIOR_YEAR_YOY' ? 'NONE' : 'PRIOR_YEAR_YOY'
                  )
                }
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  comparisonMode === 'PRIOR_YEAR_YOY' ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    comparisonMode === 'PRIOR_YEAR_YOY' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Período Ativo: <strong className="text-white">{getFormattedPeriodLabel()}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="py-1 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Aplicar Filtro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
