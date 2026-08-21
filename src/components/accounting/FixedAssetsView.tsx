'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  FixedAssetsEngine,
  FixedAssetItem,
  PeriodLockConfig,
} from '@/lib/accounting/fixed-assets-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Monitor, Lock, Sparkles, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface FixedAssetsViewProps {
  onPostDepreciation?: (entry: any) => void;
}

export function FixedAssetsView({ onPostDepreciation }: FixedAssetsViewProps) {
  const { locale, t } = useI18n();

  const [assets, setAssets] = useState<FixedAssetItem[]>([
    {
      id: 'fa-1',
      assetName: 'Apple MacBook Pro M3 Max (Engineering Workstations - Batch 1)',
      assetTag: 'TAG-MBP-001',
      purchaseDate: '2026-01-05',
      costBasis: 16000,
      salvageValue: 1600,
      usefulLifeMonths: 36,
      monthsDepreciated: 7,
      accumulatedDepreciation: 2800,
      currentBookValue: 13200,
      assetAccountCode: '1510',
      depreciationExpenseAccountCode: '6400',
      accumulatedDepreciationAccountCode: '1520',
      status: 'ACTIVE_IN_SERVICE',
    },
    {
      id: 'fa-2',
      assetName: 'Dell UltraSharp 4K Monitors & CalDigit Docks (5 Sets)',
      assetTag: 'TAG-MON-002',
      purchaseDate: '2026-01-10',
      costBasis: 8000,
      salvageValue: 800,
      usefulLifeMonths: 36,
      monthsDepreciated: 7,
      accumulatedDepreciation: 1400,
      currentBookValue: 6600,
      assetAccountCode: '1510',
      depreciationExpenseAccountCode: '6400',
      accumulatedDepreciationAccountCode: '1520',
      status: 'ACTIVE_IN_SERVICE',
    },
  ]);

  const [lockConfig, setLockConfig] = useState<PeriodLockConfig>({
    organizationId: '11111111-1111-1111-1111-111111111111',
    lockedThroughDate: '2026-06-30',
    lockedByUserId: 'user-cfo-01',
    lockedByUserName: 'Victoria Sterling (CFO)',
    lockedAt: '2026-07-05T18:00:00Z',
  });

  const [depMessage, setDepMessage] = useState<string | null>(null);

  const handleRunDepreciation = () => {
    const res = FixedAssetsEngine.generateDepreciationJournalEntry(
      lockConfig.organizationId,
      assets,
      '2026-08-31'
    );

    setAssets(res.updatedAssets);
    if (onPostDepreciation) {
      onPostDepreciation(res.journalEntry);
    }

    setDepMessage(
      `Depreciation run for August 2026 complete: $${res.totalDepreciation.toFixed(2)} posted to General Ledger (DR 6400 / CR 1520 Accumulated Depreciation).`
    );
  };

  const totalCostBasis = assets.reduce((acc, a) => acc + a.costBasis, 0);
  const totalAccumDep = assets.reduce((acc, a) => acc + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.reduce((acc, a) => acc + a.currentBookValue, 0);

  return (
    <div className="space-y-6">
      {/* Top Metrics & Period Lock Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Fixed Assets Cost</span>
          <span className="text-lg font-mono font-bold text-white mt-1 block">
            {formatCurrency(totalCostBasis, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500">Account 1510 (Computer Equipment)</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accumulated Depreciation</span>
          <span className="text-lg font-mono font-bold text-rose-400 mt-1 block">
            -{formatCurrency(totalAccumDep, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500">Account 1520 (Contra-Asset)</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Net Book Value (Carrying Value)</span>
          <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
            {formatCurrency(totalNetBookValue, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500">Balance Sheet Asset Value</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Period Hard Close</span>
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-base font-mono font-bold text-amber-400 mt-1 block">
            Locked: {lockConfig.lockedThroughDate}
          </span>
          <span className="text-[10px] text-slate-500">By {lockConfig.lockedByUserName.split(' ')[0]}</span>
        </Card>
      </div>

      {/* Main Asset Schedule */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Fixed Asset Register & Monthly Straight-Line Depreciation</CardTitle>
                <CardDescription>
                  US GAAP 36-Month Useful Life Schedule • Automated Monthly Contra-Asset Posting
                </CardDescription>
              </div>
            </div>

            <Button size="sm" variant="primary" onClick={handleRunDepreciation}>
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Run Monthly Depreciation Entry
            </Button>
          </div>
        </CardHeader>

        {depMessage && (
          <div className="mb-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{depMessage}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setDepMessage(null)}>
              Dismiss
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Asset Tag</TableHead>
              <TableHead>Asset Description & Acquisition</TableHead>
              <TableHead className="text-right w-28">Cost Basis</TableHead>
              <TableHead className="text-right w-24">Life (Mo)</TableHead>
              <TableHead className="w-36">Depreciation Progress</TableHead>
              <TableHead className="text-right w-28">Accumulated</TableHead>
              <TableHead className="text-right w-28">Net Book Value</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const progressPct = Math.min(100, Math.round((asset.monthsDepreciated / asset.usefulLifeMonths) * 100));
              return (
                <TableRow key={asset.id}>
                  <TableCell className="font-mono text-xs text-sky-400 font-semibold">{asset.assetTag}</TableCell>
                  <TableCell>
                    <div className="font-semibold text-white">{asset.assetName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Acquired: {formatDate(asset.purchaseDate, locale)} • Salvage: ${asset.salvageValue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-white">
                    {formatCurrency(asset.costBasis, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-slate-400">
                    {asset.monthsDepreciated} / {asset.usefulLifeMonths}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{progressPct}%</span>
                        <span>{asset.usefulLifeMonths - asset.monthsDepreciated} mo left</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-rose-400">
                    -{formatCurrency(asset.accumulatedDepreciation, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-400">
                    {formatCurrency(asset.currentBookValue, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
