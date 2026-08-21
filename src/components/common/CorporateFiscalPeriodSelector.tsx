'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFiscalPeriod, PeriodType, ComparisonMode } from '@/lib/period/fiscal-period-context';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  ChevronDown,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  Filter,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

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
    periodType,
    selectedMonth,
    customStartDate,
    customEndDate,
    comparisonMode,
    setFiscalYear,
    setPeriodType,
    setSelectedMonth,
    setCustomRange,
    setComparisonMode,
    getFormattedPeriodLabel,
  } = useFiscalPeriod();

  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(customStartDate);
  const [tempEnd, setTempEnd] = useState(customEndDate);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRange(tempStart, tempEnd);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/60 transition-all text-xs text-slate-100 shadow-sm"
      >
        <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Calendar className="w-3.5 h-3.5" />
        </div>

        <div className="text-left font-sans">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span>{getFormattedPeriodLabel()}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {!compact && (
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Exercício Fiscal: FY {fiscalYear}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {comparisonMode === 'PRIOR_YEAR_YOY' ? 'YoY Ativo' : comparisonMode === 'PRIOR_PERIOD' ? 'MoM/QoQ Ativo' : 'Sem benchmark'}
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Popover Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-96 rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">Seletor de Período Fiscal Corporativo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section 1: Fiscal Year Selection */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
              1. Ano Fiscal (Fiscal Year):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[2026, 2025, 2024, 2023].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setFiscalYear(yr)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    fiscalYear === yr
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  FY {yr} {yr === 2026 ? '(Atual)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Macro Financial Presets */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
              2. Intervalos Padrão do Mercado Financeiro:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPeriodType('YTD');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  periodType === 'YTD'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                YTD (Acumulado)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriodType('TTM');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  periodType === 'TTM'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                TTM (12 Meses)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriodType('ALL');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  periodType === 'ALL'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Todo Histórico
              </button>
            </div>
          </div>

          {/* Section 3: Quarter Selection */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
              3. Trimestres Fiscais (Quarters):
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setPeriodType(q);
                    setIsOpen(false);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    periodType === q
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {q} {q === 'Q1' ? '(Jan-Mar)' : q === 'Q2' ? '(Abr-Jun)' : q === 'Q3' ? '(Jul-Set)' : '(Out-Dez)'}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Individual Month Selection */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
              4. Mês Individual ({fiscalYear}):
            </label>
            <div className="grid grid-cols-6 gap-1 text-[11px]">
              {MONTHS_SHORT.map((mName, idx) => {
                const monthNum = idx + 1;
                const isSelected = periodType === 'MONTH' && selectedMonth === monthNum;
                return (
                  <button
                    key={mName}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(monthNum);
                      setPeriodType('MONTH');
                      setIsOpen(false);
                    }}
                    className={`py-1 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-900 border border-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Custom Date Range */}
          <form onSubmit={handleApplyCustom} className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-bold block">
              5. Intervalo Customizado Livre (De / Até):
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">Data Inicial:</span>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full h-7 rounded bg-slate-900 border border-slate-800 px-2 text-white text-[11px]"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block mb-0.5">Data Final:</span>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full h-7 rounded bg-slate-900 border border-slate-800 px-2 text-white text-[11px]"
                />
              </div>
            </div>
            <Button type="submit" size="sm" variant="outline" className="w-full h-7 text-xs font-bold border-slate-700">
              Aplicar Intervalo Customizado
            </Button>
          </form>

          {/* Section 6: Comparative Benchmark Analysis */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-bold block">
              6. Modo de Comparação Contábil / Benchmark:
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setComparisonMode('PRIOR_YEAR_YOY')}
                className={`py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                  comparisonMode === 'PRIOR_YEAR_YOY'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                YoY (Ano Ant.)
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('PRIOR_PERIOD')}
                className={`py-1 px-1.5 rounded-lg font-bold transition-all text-center ${
                  comparisonMode === 'PRIOR_PERIOD'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                MoM / QoQ
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('NONE')}
                className={`py-1 px-1.5 rounded-lg font-medium transition-all text-center ${
                  comparisonMode === 'NONE'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Sem Comparação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
