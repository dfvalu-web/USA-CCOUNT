'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PeriodType = 'ALL' | 'YTD' | 'TTM' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'MONTH' | 'CUSTOM';
export type ComparisonMode = 'NONE' | 'PRIOR_PERIOD' | 'PRIOR_YEAR_YOY';

export interface FiscalPeriodState {
  fiscalYear: number;
  periodType: PeriodType;
  selectedMonth: number; // 1 to 12
  customStartDate: string;
  customEndDate: string;
  comparisonMode: ComparisonMode;
  setFiscalYear: (year: number) => void;
  setPeriodType: (type: PeriodType) => void;
  setSelectedMonth: (month: number) => void;
  setCustomRange: (start: string, end: string) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  getFormattedPeriodLabel: () => string;
}

const FiscalPeriodContext = createContext<FiscalPeriodState | undefined>(undefined);

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function FiscalPeriodProvider({ children }: { children: ReactNode }) {
  const [fiscalYear, setFiscalYear] = useState<number>(2026);
  const [periodType, setPeriodType] = useState<PeriodType>('YTD');
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August
  const [customStartDate, setCustomStartDate] = useState<string>('2026-01-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-31');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('PRIOR_YEAR_YOY');

  const setCustomRange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setPeriodType('CUSTOM');
  };

  const getFormattedPeriodLabel = (): string => {
    let label = '';
    switch (periodType) {
      case 'ALL':
        label = `Todo o Histórico (All-Time)`;
        break;
      case 'YTD':
        label = `FY ${fiscalYear} • YTD (Acumulado no Ano)`;
        break;
      case 'TTM':
        label = `Últimos 12 Meses (TTM / LTM)`;
        break;
      case 'Q1':
        label = `FY ${fiscalYear} • 1º Trimestre (Q1: Jan-Mar)`;
        break;
      case 'Q2':
        label = `FY ${fiscalYear} • 2º Trimestre (Q2: Abr-Jun)`;
        break;
      case 'Q3':
        label = `FY ${fiscalYear} • 3º Trimestre (Q3: Jul-Set)`;
        break;
      case 'Q4':
        label = `FY ${fiscalYear} • 4º Trimestre (Q4: Out-Dez)`;
        break;
      case 'MONTH':
        label = `${MONTH_NAMES[selectedMonth - 1]} / ${fiscalYear}`;
        break;
      case 'CUSTOM':
        label = `${customStartDate} até ${customEndDate}`;
        break;
    }

    if (comparisonMode === 'PRIOR_YEAR_YOY') {
      label += ` (vs. ${fiscalYear - 1} YoY)`;
    } else if (comparisonMode === 'PRIOR_PERIOD') {
      label += ` (vs. Período Anterior MoM/QoQ)`;
    }

    return label;
  };

  return (
    <FiscalPeriodContext.Provider
      value={{
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
      }}
    >
      {children}
    </FiscalPeriodContext.Provider>
  );
}

export function useFiscalPeriod(): FiscalPeriodState {
  const context = useContext(FiscalPeriodContext);
  if (!context) {
    throw new Error('useFiscalPeriod must be used within a FiscalPeriodProvider');
  }
  return context;
}
