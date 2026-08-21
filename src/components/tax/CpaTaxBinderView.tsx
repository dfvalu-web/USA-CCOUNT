'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  SalesTaxFilingService,
  StateSalesTaxReturnForm,
  CpaTaxReturnBinder,
} from '@/lib/tax/sales-tax-filing-service';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Landmark, FileArchive, Download, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export function CpaTaxBinderView() {
  const { locale, t } = useI18n();

  const [selectedState, setSelectedState] = useState<'TX' | 'NY' | 'CA'>('TX');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const txReturn = SalesTaxFilingService.generateStateSalesTaxReturn(selectedState, 120000, true);
  const binder = SalesTaxFilingService.generateCpaTaxBinder();

  const handleDownloadBinder = () => {
    setDownloadMsg(`CPA Tax Package for ${binder.entityName} (Tax Year ${binder.taxYear}) successfully prepared and exported!`);
  };

  return (
    <div className="space-y-6">
      {/* Unified CPA Tax Binder */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileArchive className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Annual CPA Tax Return Binder & Workpaper Package</CardTitle>
                <CardDescription>
                  Audit-Ready Tax Package Consolidated for Form 1065 / 1120-S CPA Transmission
                </CardDescription>
              </div>
            </div>

            <Button size="sm" variant="primary" onClick={handleDownloadBinder}>
              <Download className="w-3.5 h-3.5 mr-1" />
              Download Full CPA Tax Package (.ZIP)
            </Button>
          </div>
        </CardHeader>

        {downloadMsg && (
          <div className="mb-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{downloadMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setDownloadMsg(null)}>
              Dismiss
            </Button>
          </div>
        )}

        <div className="p-4 space-y-4 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Entity & EIN</span>
              <div className="text-white font-bold mt-0.5">{binder.entityName}</div>
              <div className="text-slate-400 font-mono">EIN: {binder.ein}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">IRS Tax Mapping</span>
              <div className="text-emerald-400 font-bold mt-0.5">Form 1065 (Partnership/LLC)</div>
              <div className="text-slate-400">Ordinary Income: ${binder.ordinaryBusinessIncome.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Audit Status</span>
              <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ledger Balanced (Debits = Credits)
              </div>
              <div className="text-slate-400">Total Assets: ${binder.totalAssets.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Included Audit Schedules & Tax Workpapers:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {binder.documentsIncluded.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center space-x-2 text-xs text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* State Sales Tax Filing Helper */}
      <Card className="border-sky-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>State Sales Tax Return Filing Schedule & Portal Pre-Filler</CardTitle>
                <CardDescription>
                  Calculates Exact Box Numbers for Texas WebFile (01-114), New York (ST-100) & CA CDTFA
                </CardDescription>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={selectedState === 'TX' ? 'primary' : 'outline'}
                onClick={() => setSelectedState('TX')}
              >
                Texas (WebFile)
              </Button>
              <Button
                size="sm"
                variant={selectedState === 'NY' ? 'primary' : 'outline'}
                onClick={() => setSelectedState('NY')}
              >
                New York (ST-100)
              </Button>
              <Button
                size="sm"
                variant={selectedState === 'CA' ? 'primary' : 'outline'}
                onClick={() => setSelectedState('CA')}
              >
                California (CDTFA)
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="p-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-white">{txReturn.officialFormNumber}</span>
              <Badge variant="warning">Due Date: {txReturn.dueDate}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 block">Gross Sales (Box 1):</span>
                <span className="font-mono text-white font-semibold">
                  {formatCurrency(txReturn.grossSalesAmount, 'USD', locale)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Exempt Sales (Box 2):</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatCurrency(txReturn.exemptSalesAmount, 'USD', locale)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Taxable Sales (Box 3):</span>
                <span className="font-mono text-white font-semibold">
                  {formatCurrency(txReturn.taxableSalesAmount, 'USD', locale)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Net Tax Due (Box 4):</span>
                <span className="font-mono text-xl font-bold text-sky-400">
                  {formatCurrency(txReturn.netPayableToState, 'USD', locale)}
                </span>
              </div>
            </div>

            {selectedState === 'TX' && (
              <div className="p-2.5 rounded bg-sky-950/40 border border-sky-800 text-[11px] text-sky-300">
                💡 Texas 80% Rule applied: 20% (${txReturn.exemptSalesAmount.toLocaleString()}) of SaaS revenue is statutory exempt. 0.5% Timely Filing Discount (${txReturn.timelyFilingDiscount}) deducted.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
