'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ComparisonMode = 'NONE' | 'PRIOR_YEAR_YOY' | 'PRIOR_PERIOD';

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

export interface FiscalPeriodState {
  fiscalYear: number;
  selectedMonths: number[]; // 1 to 12
  customDateRange: CustomDateRange | null;
  comparisonMode: ComparisonMode;
  setFiscalYear: (year: number) => void;
  setSelectedMonths: (months: number[]) => void;
  setCustomDateRange: (range: CustomDateRange | null) => void;
  toggleMonth: (month: number) => void;
  selectSingleMonth: (month: number) => void;
  selectAllYear: () => void;
  selectYtd: () => void;
  selectQuarter: (q: 1 | 2 | 3 | 4) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  getFormattedPeriodLabel: () => string;
  getDateRange: () => { startDate: string; endDate: string };
}

const FiscalPeriodContext = createContext<FiscalPeriodState | undefined>(undefined);

export const MONTH_NAMES_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

// Primary quick-access years & all historical years from 2002 to 2026
export const PRIMARY_YEARS = [2026, 2025, 2024, 2023, 2022, 2021];
export const AVAILABLE_YEARS = Array.from({ length: 25 }, (_, i) => 2026 - i);

export function getFiscalDateRange(
  fiscalYear: number,
  selectedMonths: number[],
  customDateRange?: CustomDateRange | null
): { startDate: string; endDate: string } {
  if (customDateRange?.startDate && customDateRange?.endDate) {
    return {
      startDate: customDateRange.startDate,
      endDate: customDateRange.endDate,
    };
  }

  if (!selectedMonths || selectedMonths.length === 0) {
    return {
      startDate: `${fiscalYear}-01-01`,
      endDate: `${fiscalYear}-12-31`,
    };
  }
  const sorted = [...selectedMonths].sort((a, b) => a - b);
  const minMonth = sorted[0];
  const maxMonth = sorted[sorted.length - 1];

  const startMonthStr = minMonth.toString().padStart(2, '0');
  const maxMonthStr = maxMonth.toString().padStart(2, '0');
  const lastDay = new Date(fiscalYear, maxMonth, 0).getDate();

  return {
    startDate: `${fiscalYear}-${startMonthStr}-01`,
    endDate: `${fiscalYear}-${maxMonthStr}-${lastDay.toString().padStart(2, '0')}`,
  };
}

export function FiscalPeriodProvider({ children }: { children: ReactNode }) {
  const [fiscalYear, setFiscalYear] = useState<number>(2025);
  // Default: Full Year (1 to 12) for historical forensic fidelity
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [customDateRange, setCustomDateRangeState] = useState<CustomDateRange | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('PRIOR_YEAR_YOY');

  // Sync with localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedYear = localStorage.getItem('uas_fiscal_year');
      const storedMonths = localStorage.getItem('uas_fiscal_months');
      if (storedYear) setFiscalYear(parseInt(storedYear, 10));
      if (storedMonths) {
        try {
          const parsed = JSON.parse(storedMonths);
          if (Array.isArray(parsed) && parsed.length > 0) setSelectedMonths(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const handleSetFiscalYear = (year: number) => {
    setFiscalYear(year);
    setCustomDateRangeState(null); // Reset custom date range when year changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('uas_fiscal_year', year.toString());
    }
  };

  const handleSetSelectedMonths = (months: number[]) => {
    const sorted = [...months].sort((a, b) => a - b);
    setSelectedMonths(sorted);
    setCustomDateRangeState(null); // Reset custom date range when months change
    if (typeof window !== 'undefined') {
      localStorage.setItem('uas_fiscal_months', JSON.stringify(sorted));
    }
  };

  const handleSetCustomDateRange = (range: CustomDateRange | null) => {
    setCustomDateRangeState(range);
    if (range?.startDate) {
      const startYear = parseInt(range.startDate.split('-')[0], 10);
      if (!isNaN(startYear)) {
        setFiscalYear(startYear);
      }
    }
  };

  const toggleMonth = (month: number) => {
    let updated: number[];
    if (selectedMonths.includes(month)) {
      if (selectedMonths.length === 1) return; // Keep at least 1 month
      updated = selectedMonths.filter((m) => m !== month);
    } else {
      updated = [...selectedMonths, month];
    }
    handleSetSelectedMonths(updated);
  };

  const selectSingleMonth = (month: number) => {
    handleSetSelectedMonths([month]);
  };

  const selectAllYear = () => {
    handleSetSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  };

  const selectYtd = () => {
    const currentMonth = fiscalYear === 2026 ? 8 : 12;
    const ytd = Array.from({ length: currentMonth }, (_, i) => i + 1);
    handleSetSelectedMonths(ytd);
  };

  const selectQuarter = (q: 1 | 2 | 3 | 4) => {
    const start = (q - 1) * 3 + 1;
    handleSetSelectedMonths([start, start + 1, start + 2]);
  };

  const getDateRange = () => {
    return getFiscalDateRange(fiscalYear, selectedMonths, customDateRange);
  };

  const getFormattedPeriodLabel = (): string => {
    if (customDateRange?.startDate && customDateRange?.endDate) {
      return `${customDateRange.startDate} a ${customDateRange.endDate}`;
    }
    if (selectedMonths.length === 0) return `${fiscalYear}`;
    if (selectedMonths.length === 12) {
      return `${fiscalYear} • Ano Todo`;
    }
    if (selectedMonths.length === 1) {
      return `${MONTH_NAMES_FULL[selectedMonths[0] - 1]} / ${fiscalYear}`;
    }

    // Check if contiguous range
    const isContiguous = selectedMonths.every(
      (m, idx) => idx === 0 || m === selectedMonths[idx - 1] + 1
    );

    if (isContiguous) {
      const first = MONTH_NAMES_SHORT[selectedMonths[0] - 1];
      const last = MONTH_NAMES_SHORT[selectedMonths[selectedMonths.length - 1] - 1];
      return `${fiscalYear} • ${first} a ${last}`;
    }

    const shortList = selectedMonths.map((m) => MONTH_NAMES_SHORT[m - 1]).join(', ');
    return `${fiscalYear} • ${shortList}`;
  };

  return (
    <FiscalPeriodContext.Provider
      value={{
        fiscalYear,
        selectedMonths,
        customDateRange,
        comparisonMode,
        setFiscalYear: handleSetFiscalYear,
        setSelectedMonths: handleSetSelectedMonths,
        setCustomDateRange: handleSetCustomDateRange,
        toggleMonth,
        selectSingleMonth,
        selectAllYear,
        selectYtd,
        selectQuarter,
        setComparisonMode,
        getFormattedPeriodLabel,
        getDateRange,
      }}
    >
      {children}
    </FiscalPeriodContext.Provider>
  );
}

export function useFiscalPeriod(): FiscalPeriodState {
  const context = useContext(FiscalPeriodContext);
  if (!context) {
    return {
      fiscalYear: 2025,
      selectedMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      customDateRange: null,
      comparisonMode: 'PRIOR_YEAR_YOY',
      setFiscalYear: () => {},
      setSelectedMonths: () => {},
      setCustomDateRange: () => {},
      toggleMonth: () => {},
      selectSingleMonth: () => {},
      selectAllYear: () => {},
      selectYtd: () => {},
      selectQuarter: () => {},
      setComparisonMode: () => {},
      getFormattedPeriodLabel: () => '2025 • Ano Todo',
      getDateRange: () => ({ startDate: '2025-01-01', endDate: '2025-12-31' }),
    };
  }
  return context;
}
