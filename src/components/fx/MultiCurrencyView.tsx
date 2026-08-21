'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  MultiCurrencyEngine,
  SupportedCurrency,
  MultiCurrencyInvoice,
} from '@/lib/fx/multi-currency-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Globe, ArrowRightLeft, Sparkles, CheckCircle2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MultiCurrencyViewProps {
  onRevaluationSuccess?: (entry: any) => void;
}

export function MultiCurrencyView({ onRevaluationSuccess }: MultiCurrencyViewProps) {
  const { locale, t } = useI18n();

  const [foreignInvoices, setForeignInvoices] = useState<MultiCurrencyInvoice[]>([
    {
      invoiceNumber: 'INV-EUR-001',
      clientName: 'Fintech Europe SAS (Paris, France)',
      foreignCurrency: 'EUR',
      foreignAmount: 20000, // 20k EUR
      issueDate: '2026-08-01',
      issueExchangeRate: 1.075, // Was $1.075 at issue = $21,500 USD
      usdEquivalentAtIssue: 21500,
      settlementDate: '2026-08-18',
      settlementExchangeRate: 1.085, // Rose to $1.085 at settlement = $21,700 USD
      usdEquivalentAtSettlement: 21700,
      realizedFxGainLoss: 200, // +$200 Realized Gain
    },
    {
      invoiceNumber: 'INV-GBP-002',
      clientName: 'London Advisory Partners LLP (UK)',
      foreignCurrency: 'GBP',
      foreignAmount: 15000, // 15k GBP
      issueDate: '2026-08-05',
      issueExchangeRate: 1.295, // Was $1.295 at issue = $19,425 USD
      usdEquivalentAtIssue: 19425,
      settlementDate: '2026-08-19',
      settlementExchangeRate: 1.285, // Dropped to $1.285 at settlement = $19,275 USD
      usdEquivalentAtSettlement: 19275,
      realizedFxGainLoss: -150, // -$150 Realized Loss
    },
    {
      invoiceNumber: 'INV-BRL-003',
      clientName: 'São Paulo Cloud Ventures (Brasil)',
      foreignCurrency: 'BRL',
      foreignAmount: 85000, // 85k BRL
      issueDate: '2026-08-10',
      issueExchangeRate: 0.180, // Was $0.180 at issue = $15,300 USD
      usdEquivalentAtIssue: 15300,
    },
  ]);

  const [revaluationMessage, setRevaluationMessage] = useState<string | null>(null);

  const rates: Array<{ curr: SupportedCurrency; name: string; flag: string; rate: number; change24h: string; isUp: boolean }> = [
    { curr: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 1.085, change24h: '+0.35%', isUp: true },
    { curr: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 1.285, change24h: '-0.12%', isUp: false },
    { curr: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', rate: 0.182, change24h: '+1.10%', isUp: true },
    { curr: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 0.742, change24h: '+0.05%', isUp: true },
    { curr: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', rate: 0.052, change24h: '-0.20%', isUp: false },
  ];

  const handleRunMonthEndRevaluation = () => {
    const openInvoices = [
      { foreignAmount: 85000, issueRate: 0.180, foreignCurrency: 'BRL' as const },
    ];

    const result = MultiCurrencyEngine.generateMonthEndRevaluationJournalEntry(
      '11111111-1111-1111-1111-111111111111',
      openInvoices,
      new Date().toISOString().split('T')[0]
    );

    if (onRevaluationSuccess) {
      onRevaluationSuccess(result.journalEntry);
    }

    setRevaluationMessage(
      `ASC 830 Month-End FX Revaluation complete! Net Unrealized ${result.isGain ? 'Gain' : 'Loss'} of $${Math.abs(result.totalUnrealizedFxGainLoss).toFixed(2)} USD posted to General Ledger (DR 1200 A/R / CR 4900 FX Gain).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Currency Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {rates.map((r) => (
          <Card key={r.curr} className="p-3 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{r.flag}</span>
                <span>{r.curr}</span>
              </span>
              <span
                className={`text-[10px] font-semibold flex items-center ${
                  r.isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {r.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {r.change24h}
              </span>
            </div>
            <div className="mt-1 text-sm font-mono font-bold text-slate-200">
              1 {r.curr} = ${r.rate.toFixed(3)}
            </div>
            <span className="text-[9px] text-slate-500 block">ECB & Federal Reserve feed</span>
          </Card>
        ))}
      </div>

      {/* Main Multi-Currency Ledger Card */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Multi-Currency Invoicing & Realized/Unrealized FX (ASC 830)</CardTitle>
                <CardDescription>
                  Functional Currency: USD ($) • Real-time FASB 52 & ASC 830 FX Revaluations
                </CardDescription>
              </div>
            </div>

            <Button size="sm" variant="primary" onClick={handleRunMonthEndRevaluation}>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Run Month-End FX Revaluation
            </Button>
          </div>
        </CardHeader>

        {revaluationMessage && (
          <div className="mb-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{revaluationMessage}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setRevaluationMessage(null)}>
              Dismiss
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Invoice #</TableHead>
              <TableHead>Client & Jurisdiction</TableHead>
              <TableHead className="text-right w-28">Foreign Amount</TableHead>
              <TableHead className="text-right w-24">Issue Rate</TableHead>
              <TableHead className="text-right w-28">USD at Issue</TableHead>
              <TableHead className="text-right w-28">USD at Settlement</TableHead>
              <TableHead className="text-right w-28">Realized FX Gain/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foreignInvoices.map((inv) => (
              <TableRow key={inv.invoiceNumber}>
                <TableCell className="font-mono text-emerald-400 font-semibold">{inv.invoiceNumber}</TableCell>
                <TableCell>
                  <div className="font-semibold text-white">{inv.clientName}</div>
                  <div className="text-[10px] text-slate-400">Issued: {formatDate(inv.issueDate, locale)}</div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-sky-300">
                  {inv.foreignAmount.toLocaleString()} {inv.foreignCurrency}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-400">
                  ${inv.issueExchangeRate.toFixed(3)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white">
                  {formatCurrency(inv.usdEquivalentAtIssue, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-slate-300">
                  {inv.usdEquivalentAtSettlement ? formatCurrency(inv.usdEquivalentAtSettlement, 'USD', locale) : '— (Open)'}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold">
                  {inv.realizedFxGainLoss !== undefined ? (
                    <span className={inv.realizedFxGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {inv.realizedFxGainLoss >= 0 ? `+${formatCurrency(inv.realizedFxGainLoss, 'USD', locale)}` : formatCurrency(inv.realizedFxGainLoss, 'USD', locale)}
                    </span>
                  ) : (
                    <Badge variant="outline" className="text-[9px]">
                      A/R Open
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
