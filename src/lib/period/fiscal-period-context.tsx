'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ComparisonMode = 'NONE' | 'PRIOR_YEAR_YOY' | 'PRIOR_PERIOD';

export interface FiscalPeriodState {
  fiscalYear: number;
  selectedMonths: number[]; // 1 to 12
  comparisonMode: ComparisonMode;
  setFiscalYear: (year: number) => void;
  setSelectedMonths: (months: number[]) => void;
  toggleMonth: (month: number) => void;
  selectSingleMonth: (month: number) => void;
  selectAllYear: () => void;
  selectYtd: () => void;
  selectQuarter: (q: 1 | 2 | 3 | 4) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  getFormattedPeriodLabel: () => string;
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

export const AVAILABLE_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export function FiscalPeriodProvider({ children }: { children: ReactNode }) {
  const [fiscalYear, setFiscalYear] = useState<number>(2026);
  // Default: YTD Jan to August (1 to 8)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('uas_fiscal_year', year.toString());
    }
  };

  const handleSetSelectedMonths = (months: number[]) => {
    const sorted = [...months].sort((a, b) => a - b);
    setSelectedMonths(sorted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uas_fiscal_months', JSON.stringify(sorted));
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
    const currentMonth = 8; // August
    const ytd = Array.from({ length: currentMonth }, (_, i) => i + 1);
    handleSetSelectedMonths(ytd);
  };

  const selectQuarter = (q: 1 | 2 | 3 | 4) => {
    const start = (q - 1) * 3 + 1;
    handleSetSelectedMonths([start, start + 1, start + 2]);
  };

  const getFormattedPeriodLabel = (): string => {
    if (selectedMonths.length === 0) return `FY ${fiscalYear}`;
    if (selectedMonths.length === 12) {
      return `FY ${fiscalYear} • Ano Todo (12 meses)`;
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
      return `FY ${fiscalYear} • ${first} a ${last} (${selectedMonths.length} meses)`;
    }

    const shortList = selectedMonths.map((m) => MONTH_NAMES_SHORT[m - 1]).join(', ');
    return `FY ${fiscalYear} • ${shortList}`;
  };

  return (
    <FiscalPeriodContext.Provider
      value={{
        fiscalYear,
        selectedMonths,
        comparisonMode,
        setFiscalYear: handleSetFiscalYear,
        setSelectedMonths: handleSetSelectedMonths,
        toggleMonth,
        selectSingleMonth,
        selectAllYear,
        selectYtd,
        selectQuarter,
        setComparisonMode,
        getFormattedPeriodLabel,
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
      fiscalYear: 2026,
      selectedMonths: [1, 2, 3, 4, 5, 6, 7, 8],
      comparisonMode: 'PRIOR_YEAR_YOY',
      setFiscalYear: () => {},
      setSelectedMonths: () => {},
      toggleMonth: () => {},
      selectSingleMonth: () => {},
      selectAllYear: () => {},
      selectYtd: () => {},
      selectQuarter: () => {},
      setComparisonMode: () => {},
      getFormattedPeriodLabel: () => 'FY 2026 • Jan a Ago (8 meses)',
    };
  }
  return context;
}
