'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { BalanceSheetReport } from '@/lib/accounting/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Download, AlertCircle, ShieldCheck, Scale } from 'lucide-react';

interface BalanceSheetViewProps {
  data: BalanceSheetReport;
}

export function BalanceSheetView({ data }: BalanceSheetViewProps) {
  const { locale, t, basis } = useI18n();
  const [period, setPeriod] = useState<'CURRENT' | 'Q1' | 'Q2'>('CURRENT');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCsv = () => {
    let csv = `Category,Account Code,Account Name,Amount (USD)\n`;
    csv += `ASSETS\n`;
    data.currentAssets.forEach((a) => {
      csv += `Current Assets,"${a.code}","${a.name}",${a.amount}\n`;
    });
    data.nonCurrentAssets.forEach((a) => {
      csv += `Non-Current Assets,"${a.code}","${a.name}",${a.amount}\n`;
    });
    csv += `TOTAL ASSETS,,,${data.totalAssets}\n\n`;

    csv += `LIABILITIES\n`;
    data.currentLiabilities.forEach((l) => {
      csv += `Current Liabilities,"${l.code}","${l.name}",${l.amount}\n`;
    });
    data.nonCurrentLiabilities.forEach((l) => {
      csv += `Non-Current Liabilities,"${l.code}","${l.name}",${l.amount}\n`;
    });
    csv += `TOTAL LIABILITIES,,,${data.totalLiabilities}\n\n`;

    csv += `EQUITY\n`;
    data.equityItems.forEach((e) => {
      csv += `Equity,"${e.code}","${e.name}",${e.amount}\n`;
    });
    csv += `TOTAL EQUITY,,,${data.totalEquity}\n`;
    csv += `TOTAL LIABILITIES & EQUITY,,,${data.totalLiabilitiesAndEquity}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `balance_sheet_balanco_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Balanço Patrimonial (Balance Sheet) exportado com sucesso em formato CSV!');
  };

  return (
    <Card className="border-slate-800 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle>{t('nav.balanceSheet')} (Balanço Patrimonial)</CardTitle>
              <Badge variant={data.isBalanced ? 'success' : 'danger'}>
                {data.isBalanced ? `✓ ${t('common.balanced')}` : t('common.unbalanced')}
              </Badge>
              <Badge variant="outline">{basis} Basis</Badge>
            </div>
            <CardDescription>
              Posição em {formatDate(data.asOfDate, locale)} • Equação Fundamental: Ativo = Passivo + Patrimônio Líquido
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {t('common.export')} CSV
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
            Fechar
          </Button>
        </div>
      )}

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: ASSETS */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              1. {t('accounting.assets')} (Ativo Total)
            </span>
            <span className="text-base font-mono font-bold text-emerald-400">
              {formatCurrency(data.totalAssets, 'USD', locale)}
            </span>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              {t('accounting.currentAssets')} (Ativo Circulante)
            </h5>
            <Table>
              <TableBody>
                {data.currentAssets.map((a) => (
                  <TableRow key={a.code}>
                    <TableCell className="font-mono text-emerald-400 w-16">{a.code}</TableCell>
                    <TableCell className="font-medium text-white">{a.name}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-emerald-300 font-semibold w-28">
                      {formatCurrency(a.amount, 'USD', locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.nonCurrentAssets.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                {t('accounting.nonCurrentAssets')} (Ativo Não Circulante / Permanente)
              </h5>
              <Table>
                <TableBody>
                  {data.nonCurrentAssets.map((a) => (
                    <TableRow key={a.code}>
                      <TableCell className="font-mono text-slate-400 w-16">{a.code}</TableCell>
                      <TableCell className="text-slate-300">{a.name}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-slate-200 font-semibold w-28">
                        {formatCurrency(a.amount, 'USD', locale)}
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
                2. {t('accounting.liabilities')} (Passivo Total)
              </span>
              <span className="text-base font-mono font-bold text-rose-400">
                {formatCurrency(data.totalLiabilities, 'USD', locale)}
              </span>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                {t('accounting.currentLiabilities')} (Passivo Circulante)
              </h5>
              <Table>
                <TableBody>
                  {data.currentLiabilities.map((l) => (
                    <TableRow key={l.code}>
                      <TableCell className="font-mono text-rose-400 w-16">{l.code}</TableCell>
                      <TableCell className="text-slate-300">{l.name}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-rose-300 font-semibold w-28">
                        {formatCurrency(l.amount, 'USD', locale)}
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
                3. {t('accounting.equity')} (Patrimônio Líquido)
              </span>
              <span className="text-base font-mono font-bold text-sky-400">
                {formatCurrency(data.totalEquity, 'USD', locale)}
              </span>
            </div>

            <Table>
              <TableBody>
                {data.equityItems.map((e) => (
                  <TableRow key={e.code}>
                    <TableCell className="font-mono text-sky-400 w-16">{e.code}</TableCell>
                    <TableCell className="font-medium text-white">{e.name}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-sky-300 font-semibold w-28">
                      {formatCurrency(e.amount, 'USD', locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* TOTAL LIABILITIES & EQUITY */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">
              Total Passivo + Patrimônio Líquido
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {formatCurrency(data.totalLiabilitiesAndEquity, 'USD', locale)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
