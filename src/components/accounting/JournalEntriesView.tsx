'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  Printer,
} from 'lucide-react';

import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { useCompany } from '@/lib/company/company-context';
import { PrintReportHeader, PrintReportFooter } from './PrintReportHeader';

export interface JournalEntryListItem {
  id: string;
  date: string;
  memo: string;
  amount: number;
  basis: string;
  status: string;
  lines?: Array<{
    accountId: string;
    accountName?: string;
    debit: number;
    credit: number;
  }>;
}

interface JournalEntriesViewProps {
  journalEntries: JournalEntryListItem[];
  onOpenNewEntryModal: () => void;
}

export function JournalEntriesView({
  journalEntries,
  onOpenNewEntryModal,
}: JournalEntriesViewProps) {
  const { locale, t, basis, formatCurrency, formatDate } = useI18n();
  const { activeCompany } = useCompany();
  const { fiscalYear, selectedMonths, getFormattedPeriodLabel } = useFiscalPeriod();
  const [searchQuery, setSearchQuery] = useState('');
  const [basisFilter, setBasisFilter] = useState<string>('ALL');
  const [expandedJeId, setExpandedJeId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredEntries = journalEntries.filter((entry) => {
    // Filtragem rigorosa por ano fiscal e meses selecionados
    if (entry.date) {
      const lineDateStr = typeof entry.date === 'string' ? entry.date : (entry.date as any).toISOString().split('T')[0];
      const entryYear = parseInt(lineDateStr.substring(0, 4), 10);
      const entryMonth = parseInt(lineDateStr.substring(5, 7), 10);

      if (entryYear !== fiscalYear) return false;
      if (selectedMonths && selectedMonths.length > 0 && !selectedMonths.includes(entryMonth)) return false;
    }

    if (basisFilter !== 'ALL' && entry.basis !== basisFilter && entry.basis !== 'BOTH') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        entry.id.toLowerCase().includes(q) ||
        entry.memo.toLowerCase().includes(q) ||
        entry.date.toLowerCase().includes(q) ||
        entry.amount.toString().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    let csv = `Entry ID,Date,Memo,Accounting Basis,Total Amount (USD),Status\n`;
    journalEntries.forEach((je) => {
      csv += `"${je.id}","${je.date}","${je.memo}","${je.basis}",${je.amount},"${je.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `journal_entries_diario_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(t('common.exportSuccess'));
  };

  return (
    <div className="space-y-6">
      <PrintReportHeader
        reportTitle={t('reports.journalEntriesTitle')}
        reportSubtitle={`Chronological Double-Entry Journal • ${basis} Basis`}
      />

      <Card className="border-slate-800 bg-slate-950">
        <CardHeader className="no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>{t('nav.journalEntries')} — {activeCompany?.legalName}</CardTitle>
                <CardDescription>
                  {t('accounting.ruleDebitCredit')} • {getFormattedPeriodLabel()}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2 no-print">
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {t('common.export')}
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.print()} className="text-xs bg-slate-900 border-slate-700 text-white font-semibold">
                <Printer className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {t('common.print')}
              </Button>
              <Button size="sm" variant="primary" onClick={onOpenNewEntryModal} className="text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                {t('accounting.newEntry')}
              </Button>
            </div>
          </div>
        </CardHeader>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 border-y border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">{t('filters.accountingBasis')}</span>
          <select
            value={basisFilter}
            onChange={(e) => setBasisFilter(e.target.value)}
            className="h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">{t('filters.allTypes')} ({filteredEntries.length})</option>
            <option value="ACCRUAL">{t('filters.accrualOnly')}</option>
            <option value="CASH">{t('filters.cashOnly')}</option>
            <option value="BOTH">{t('filters.dualBasis')}</option>
          </select>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder={t('filters.searchJournal')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 rounded bg-slate-950 border border-slate-800 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notification Banner */}
      {exportNotice && (
        <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setExportNotice(null)}>
            {t('common.close')}
          </Button>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center text-xs space-y-2 bg-slate-900/30">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-300">
            {t('reports.noActivity')} — {getFormattedPeriodLabel()}
          </p>
          <p className="text-slate-500 text-[11px] max-w-md mx-auto">
            {t('reports.auditStamp')}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">{t('accounting.entryNumber')}</TableHead>
              <TableHead className="w-28">{t('common.date')}</TableHead>
              <TableHead>{t('accounting.memo')}</TableHead>
              <TableHead className="w-24 text-center">{t('filters.accountingBasis')}</TableHead>
              <TableHead className="w-32 text-right">{t('common.total')}</TableHead>
              <TableHead className="w-28 text-center">{t('common.status')}</TableHead>
              <TableHead className="w-16 no-print"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-slate-900/50 transition-colors">
                <TableCell className="font-mono text-emerald-400 font-semibold">
                  {entry.id}
                </TableCell>
                <TableCell className="text-slate-400 font-mono text-xs">
                  {entry.date}
                </TableCell>
                <TableCell className="font-medium text-white">
                  {entry.memo}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {entry.basis}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-emerald-300 font-bold text-sm">
                  {formatCurrency(entry.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="success" className="text-[10px]">
                    ✓ {entry.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>

    {/* Diamond-Standard Print Footer (Visible only on print/PDF) */}
    <PrintReportFooter />
  </div>
  );
}
