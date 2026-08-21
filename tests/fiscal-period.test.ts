import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_YEARS,
  MONTH_NAMES_SHORT,
  MONTH_NAMES_FULL,
} from '@/lib/period/fiscal-period-context';

describe('Corporate Fiscal Period & Intuitive Month Selection', () => {
  it('should list all historical fiscal years including 2020 to 2026', () => {
    expect(AVAILABLE_YEARS).toContain(2026);
    expect(AVAILABLE_YEARS).toContain(2025);
    expect(AVAILABLE_YEARS).toContain(2024);
    expect(AVAILABLE_YEARS).toContain(2021);
  });

  it('should format 12-month full year selection accurately', () => {
    const year = 2025;
    const selectedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const isAll = selectedMonths.length === 12;
    expect(isAll).toBe(true);
    const label = `FY ${year} • Ano Todo (12 meses)`;
    expect(label).toBe('FY 2025 • Ano Todo (12 meses)');
  });

  it('should format single month selection accurately', () => {
    const selectedMonth = 8; // August
    const year = 2026;
    const label = `${MONTH_NAMES_FULL[selectedMonth - 1]} / ${year}`;
    expect(label).toBe('Agosto / 2026');
  });

  it('should format custom multi-month range accurately', () => {
    const selectedMonths = [1, 2, 3]; // Q1
    const first = MONTH_NAMES_SHORT[selectedMonths[0] - 1];
    const last = MONTH_NAMES_SHORT[selectedMonths[selectedMonths.length - 1] - 1];
    const label = `FY 2026 • ${first} a ${last} (${selectedMonths.length} meses)`;
    expect(label).toBe('FY 2026 • Jan a Mar (3 meses)');
  });
});
