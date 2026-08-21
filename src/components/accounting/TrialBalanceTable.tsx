'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { TrialBalanceReport } from '@/lib/accounting/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { CheckCircle2, AlertCircle, Download, Search, Filter, Layers, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCompany } from '@/lib/company/company-context';
import { PrintReportHeader, PrintReportFooter } from './PrintReportHeader';

interface TrialBalanceTableProps {
  data: TrialBalanceReport;
}

export function TrialBalanceTable({ data }: TrialBalanceTableProps) {
  const { locale, t, basis } = useI18n();
  const { activeCompany } = useCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredItems = data.items.filter((item) => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (item.accountName || '').toLowerCase();
      const namePt = (item.accountNamePt || '').toLowerCase();
      const code = item.accountCode.toLowerCase();
      return name.includes(q) || namePt.includes(q) || code.includes(q);
    }
    return true;
  });

  const handleExportCsv = () => {
    let csv = `Account Code,Account Name,Type,Debit Balance,Credit Balance\n`;
    data.items.forEach((item) => {
      csv += `"${item.accountCode}","${item.accountName}","${item.type}",${item.netDebitBalance},${item.netCreditBalance}\n`;
    });
    csv += `TOTAL,"Grand Total Balanced",,${data.totalDebits},${data.totalCredits}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trial_balance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Balanço de Verificação (Trial Balance) exportado com sucesso em formato CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Diamond-Standard Print Header (Visible only on print/PDF) */}
      <PrintReportHeader
        reportTitle={t('reports.trialBalanceTitle')}
        reportSubtitle={`US GAAP Chart of Accounts Trial Balance • ${basis} Basis`}
        asOfDate={formatDate(data.asOfDate)}
      />

      <Card className="border-slate-800 bg-slate-950">
        <CardHeader className="no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle>{t('nav.trialBalance')} — {activeCompany?.legalName}</CardTitle>
                <Badge variant={data.isBalanced ? 'success' : 'danger'}>
                  {data.isBalanced ? `✓ ${t('common.balanced')}` : t('common.unbalanced')}
                </Badge>
                <Badge variant="outline">{basis} Basis</Badge>
              </div>
              <CardDescription>
                {activeCompany?.legalName} (EIN: {activeCompany?.ein}) • {t('reports.asOfDate')} {formatDate(data.asOfDate)} • {t('accounting.ruleDebitCredit')}
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2 no-print">
              <Button variant="outline" size="sm" onClick={handleExportCsv} className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {t('common.export')}
              </Button>
              <Button size="sm" variant="primary" onClick={() => window.print()} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Printer className="w-3.5 h-3.5 mr-1" />
                {t('common.print')}
              </Button>
            </div>
          </div>
        </CardHeader>

      {/* Filters & Search Toolbar */}
      <div className="px-6 py-3 border-y border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">{t('filters.accountTypeFilter')}</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">{t('filters.allTypes')} ({data.items.length})</option>
            <option value="ASSET">{t('filters.assetsOnly')}</option>
            <option value="LIABILITY">{t('filters.liabilitiesOnly')}</option>
            <option value="EQUITY">{t('filters.equityOnly')}</option>
            <option value="REVENUE">{t('filters.revenueOnly')}</option>
            <option value="EXPENSE">{t('filters.expensesOnly')}</option>
          </select>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder={t('filters.searchAccounts')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 rounded bg-slate-950 border border-slate-800 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Export Notice Banner */}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">{t('accounting.accountCode')}</TableHead>
            <TableHead>{t('accounting.accountName')}</TableHead>
            <TableHead className="w-32">{t('accounting.accountType')}</TableHead>
            <TableHead className="text-right w-40">{t('accounting.debit')}</TableHead>
            <TableHead className="text-right w-40">{t('accounting.credit')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const localizedName =
              locale === 'pt' && item.accountNamePt
                ? item.accountNamePt
                : locale === 'es' && item.accountNameEs
                ? item.accountNameEs
                : item.accountName;

            return (
              <TableRow key={item.accountCode}>
                <TableCell className="font-mono text-emerald-400 font-semibold">
                  {item.accountCode}
                </TableCell>
                <TableCell className="font-medium text-slate-100">{localizedName}</TableCell>
                <TableCell>
                  <span className="text-[11px] text-slate-400 font-mono">{item.type}</span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-100">
                  {item.netDebitBalance > 0
                    ? formatCurrency(item.netDebitBalance, 'USD', locale)
                    : '—'}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-100">
                  {item.netCreditBalance > 0
                    ? formatCurrency(item.netCreditBalance, 'USD', locale)
                    : '—'}
                </TableCell>
              </TableRow>
            );
          })}

          {/* Grand Totals Row */}
          <TableRow className="bg-slate-900 font-bold border-t-2 border-slate-700">
            <TableCell colSpan={3} className="text-slate-100 uppercase tracking-wide text-xs">
              {t('common.total')} GERAL AUDITADO
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums text-emerald-400 text-sm">
              {formatCurrency(data.totalDebits, 'USD', locale)}
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums text-emerald-400 text-sm">
              {formatCurrency(data.totalCredits, 'USD', locale)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    {/* Diamond-Standard Print Footer (Visible only on print/PDF) */}
    <PrintReportFooter />
  </div>
  );
}
