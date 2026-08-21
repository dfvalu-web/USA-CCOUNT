'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useCompany } from '@/lib/company/company-context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { BalanceSheetReport } from '@/lib/accounting/types';
import { PrintReportHeader, PrintReportFooter } from './PrintReportHeader';

interface BalanceSheetViewProps {
  data: BalanceSheetReport;
}

export function BalanceSheetView({ data }: BalanceSheetViewProps) {
  const { locale, t, basis, formatCurrency, formatDate } = useI18n();
  const { activeCompany } = useCompany();
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCsv = () => {
    let csv = `${t('reports.balanceSheetTitle')}\n`;
    csv += `${t('common.year')}: ${data.asOfDate}\n`;
    csv += `${t('common.status')}: ${data.isBalanced ? t('common.balanced') : t('common.unbalanced')}\n\n`;
    csv += `${t('accounting.accountCode')},${t('accounting.accountName')},${t('accounting.accountType')},${t('accounting.netBalance')}\n`;

    data.currentAssets.forEach((a) => {
      csv += `${a.code},"${a.name}",${t('accounting.currentAssets')},${a.amount}\n`;
    });
    data.nonCurrentAssets.forEach((a) => {
      csv += `${a.code},"${a.name}",${t('accounting.nonCurrentAssets')},${a.amount}\n`;
    });
    csv += `${t('accounting.totalAssets').toUpperCase()},,,${data.totalAssets}\n\n`;

    data.currentLiabilities.forEach((l) => {
      csv += `${l.code},"${l.name}",${t('accounting.currentLiabilities')},${l.amount}\n`;
    });
    csv += `${t('accounting.totalLiabilities').toUpperCase()},,,${data.totalLiabilities}\n\n`;

    data.equityItems.forEach((e) => {
      csv += `${e.code},"${e.name}",${t('accounting.equity')},${e.amount}\n`;
    });
    csv += `${t('accounting.totalEquity').toUpperCase()},,,${data.totalEquity}\n`;
    csv += `${t('accounting.totalLiabilitiesAndEquity').toUpperCase()},,,${data.totalLiabilitiesAndEquity}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `balance_sheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`${t('nav.balanceSheet')} — CSV OK`);
  };

  return (
    <div className="space-y-6">
      {/* Diamond-Standard Print Header (Visible only on print/PDF) */}
      <PrintReportHeader
        reportTitle={t('reports.balanceSheetTitle')}
        reportSubtitle={`US GAAP ASC 210 Balance Sheet • ${basis} Basis`}
        asOfDate={formatDate(data.asOfDate)}
      />

      <Card className="border-slate-800 bg-slate-950">
        <CardHeader className="no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle>{t('nav.balanceSheet')} — {activeCompany?.legalName}</CardTitle>
                <Badge variant={data.isBalanced ? 'success' : 'danger'}>
                  {data.isBalanced ? `✓ ${t('common.balanced')}` : t('common.unbalanced')}
                </Badge>
                <Badge variant="outline">{basis} Basis</Badge>
              </div>
              <CardDescription>
                {activeCompany?.legalName} (EIN: {activeCompany?.ein}) • {t('reports.asOfDate')} {formatDate(data.asOfDate)} • {t('accounting.balanceSheetEquation')}
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: ASSETS */}
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                1. {t('accounting.totalAssets')}
              </span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {formatCurrency(data.totalAssets)}
              </span>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                {t('accounting.currentAssets')}
              </h5>
              <Table>
                <TableBody>
                  {data.currentAssets.map((a) => (
                    <TableRow key={a.code}>
                      <TableCell className="font-mono text-emerald-400 w-16">{a.code}</TableCell>
                      <TableCell className="font-medium text-white">{a.name}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-emerald-300 font-semibold w-28">
                        {formatCurrency(a.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {data.nonCurrentAssets.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  {t('accounting.nonCurrentAssets')}
                </h5>
                <Table>
                  <TableBody>
                    {data.nonCurrentAssets.map((a) => (
                      <TableRow key={a.code}>
                        <TableCell className="font-mono text-slate-400 w-16">{a.code}</TableCell>
                        <TableCell className="text-slate-300">{a.name}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-slate-200 font-semibold w-28">
                          {formatCurrency(a.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
          <div className="space-y-6">
            {/* LIABILITIES */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                  2. {t('accounting.totalLiabilities')}
                </span>
                <span className="text-base font-mono font-bold text-rose-400">
                  {formatCurrency(data.totalLiabilities)}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  {t('accounting.currentLiabilities')}
                </h5>
                <Table>
                  <TableBody>
                    {data.currentLiabilities.map((l) => (
                      <TableRow key={l.code}>
                        <TableCell className="font-mono text-rose-400 w-16">{l.code}</TableCell>
                        <TableCell className="text-slate-300">{l.name}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-rose-300 font-semibold w-28">
                          {formatCurrency(l.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* EQUITY */}
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                  3. {t('accounting.totalEquity')}
                </span>
                <span className="text-base font-mono font-bold text-sky-400">
                  {formatCurrency(data.totalEquity)}
                </span>
              </div>

              <Table>
                <TableBody>
                  {data.equityItems.map((e) => (
                    <TableRow key={e.code}>
                      <TableCell className="font-mono text-sky-400 w-16">{e.code}</TableCell>
                      <TableCell className="font-medium text-white">{e.name}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sky-300 font-semibold w-28">
                        {formatCurrency(e.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* TOTAL LIABILITIES & EQUITY */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">
                {t('accounting.totalLiabilitiesAndEquity')}
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatCurrency(data.totalLiabilitiesAndEquity)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Diamond-Standard Print Footer (Visible only on print/PDF) */}
      <PrintReportFooter />
    </div>
  );
}
