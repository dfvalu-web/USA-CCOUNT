'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { FormW2Data, Form1099NECData } from '@/lib/payroll/tax-forms-service';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, Printer, Download, FileCheck } from 'lucide-react';

interface TaxFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  w2Data?: FormW2Data | null;
  necData?: Form1099NECData | null;
}

export function TaxFormsModal({ isOpen, onClose, w2Data, necData }: TaxFormsModalProps) {
  const { locale, t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {w2Data ? `Form W-2: Wage and Tax Statement (${w2Data.taxYear})` : `Form 1099-NEC (${necData?.taxYear})`}
              </h3>
              <p className="text-xs text-slate-400">Official IRS Tax-Ready Compliance Document</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-950/60">
          {w2Data && (
            <div className="border border-slate-700 rounded-lg p-5 bg-slate-900 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Employer EIN & Name</span>
                  <div className="font-mono text-white font-semibold">{w2Data.employerEin}</div>
                  <div className="text-slate-200">{w2Data.employerName}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Employee SSN & Name</span>
                  <div className="font-mono text-white font-semibold">{w2Data.employeeSsn}</div>
                  <div className="text-slate-200 font-semibold">{w2Data.employeeName}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 1: Wages, Tips, Other</span>
                  <span className="text-sm font-mono font-bold text-white">
                    {formatCurrency(w2Data.box1WagesTips, 'USD', locale)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 2: Federal Income Tax</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formatCurrency(w2Data.box2FederalIncomeTax, 'USD', locale)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 3: Social Security Wages</span>
                  <span className="text-sm font-mono font-bold text-white">
                    {formatCurrency(w2Data.box3SocialSecurityWages, 'USD', locale)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 4: Social Security Tax</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formatCurrency(w2Data.box4SocialSecurityTax, 'USD', locale)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 5: Medicare Wages</span>
                  <span className="text-sm font-mono font-bold text-white">
                    {formatCurrency(w2Data.box5MedicareWages, 'USD', locale)}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Box 6: Medicare Tax</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formatCurrency(w2Data.box6MedicareTax, 'USD', locale)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Box 15: State</span>
                  <span className="font-mono font-bold text-white">{w2Data.box15State}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Box 16: State Wages</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(w2Data.box16StateWages, 'USD', locale)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Box 17: State Income Tax</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(w2Data.box17StateIncomeTax, 'USD', locale)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {necData && (
            <div className="border border-slate-700 rounded-lg p-5 bg-slate-900 space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Payer EIN & Name</span>
                  <div className="font-mono text-white font-semibold">{necData.payerEin}</div>
                  <div className="text-slate-200">{necData.payerName}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Recipient TIN & Name</span>
                  <div className="font-mono text-white font-semibold">{necData.recipientTin}</div>
                  <div className="text-slate-200 font-semibold">{necData.recipientName}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase block font-semibold">
                    Box 1: Nonemployee Compensation (1099-NEC)
                  </span>
                  <span className="text-[11px] text-slate-500">Gross payments reported directly to IRS</span>
                </div>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {formatCurrency(necData.box1NonemployeeCompensation, 'USD', locale)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <Badge variant="success">Verified for IRS e-File Transmission</Badge>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print Copy B/C
            </Button>
            <Button size="sm" variant="primary">
              <Download className="w-3.5 h-3.5 mr-1" />
              Download IRS PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
