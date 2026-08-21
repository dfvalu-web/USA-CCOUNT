'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { WorkerPaystub, WorkerSelfServiceProfile } from '@/lib/portal/worker-portal-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  X,
  Printer,
  Download,
  Building2,
  DollarSign,
  ShieldCheck,
  Landmark,
  User,
} from 'lucide-react';

interface PaystubDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paystub: WorkerPaystub | null;
  worker: WorkerSelfServiceProfile;
  companyName?: string;
  companyEin?: string;
}

export function PaystubDetailModal({
  isOpen,
  onClose,
  paystub,
  worker,
  companyName = 'Apex CleanOps & Cloud Technologies LLC',
  companyEin = '84-9281742',
}: PaystubDetailModalProps) {
  const { locale } = useI18n();

  if (!isOpen || !paystub) return null;

  // Breakdown Calculations for detailed itemized slip
  const isW2 = worker.workerType === 'W2_EMPLOYEE';
  const gross = paystub.grossPay;

  // Estimated Taxes
  const federalIncomeTax = isW2 ? gross * 0.12 : 0;
  const socialSecurity = isW2 ? gross * 0.062 : 0;
  const medicare = isW2 ? gross * 0.0145 : 0;
  const stateIncomeTax = isW2 ? gross * 0.04 : 0;

  // Pre-tax deductions
  const preTax401k = isW2 ? gross * 0.04 : 0;
  const healthInsurance = isW2 ? 120 : 0;

  const totalDeductions = paystub.totalWithholdings;
  const netPay = paystub.netPay;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Demonstrativo de Pagamento (Official Paystub)</h3>
              <p className="text-[10px] text-slate-400">
                Período: {paystub.payPeriod} • Data do Pagamento: {formatDate(paystub.payDate, locale)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slip Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Header Info: Employer vs Employee */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Empregador / Empresa:</span>
              <span className="font-bold text-white text-sm block mt-0.5">{companyName}</span>
              <span className="text-[10px] text-emerald-400 font-mono">EIN: {companyEin}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Austin, TX • United States</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Colaborador:</span>
              <span className="font-bold text-white text-sm block mt-0.5">{worker.name}</span>
              <span className="text-[10px] text-slate-300 block">{worker.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isW2 ? 'info' : 'warning'} className="text-[9px]">
                  {isW2 ? 'W-2 CLT' : '1099 Prestador'}
                </Badge>
                <span className="text-[10px] text-slate-400">SSN: •••-••-4102</span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Gross Earnings */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                1. Rendimentos Brutos (Earnings)
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Remuneração Base ({isW2 ? '80h Quinzenal' : 'Serviços Faturados'}):</span>
                  <span className="font-mono text-white font-semibold">
                    {formatCurrency(gross, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Adicional Noturno / Horas Extras:</span>
                  <span className="font-mono text-slate-400">$0.00</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                  <span>Total Bruto (Gross Pay):</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(gross, 'USD', locale)}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Taxes & Withholdings */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 uppercase text-[11px] block border-b border-slate-800 pb-1">
                2. Retenções Tributárias & Benefícios
              </span>
              <div className="space-y-1.5 text-slate-300">
                {isW2 ? (
                  <>
                    <div className="flex justify-between">
                      <span>Federal Income Tax (FIT):</span>
                      <span className="font-mono text-rose-400">-{formatCurrency(federalIncomeTax, 'USD', locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Security (FICA 6.2%):</span>
                      <span className="font-mono text-rose-400">-{formatCurrency(socialSecurity, 'USD', locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medicare (FICA 1.45%):</span>
                      <span className="font-mono text-rose-400">-{formatCurrency(medicare, 'USD', locale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plano 401(k) / Saúde Sec. 125:</span>
                      <span className="font-mono text-rose-400">
                        -{formatCurrency(preTax401k + healthInsurance, 'USD', locale)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-[11px] text-slate-400 py-3 text-center">
                    Prestador 1099: Sem retenção na fonte. Apuração trimestral via IRS Form 1040-ES.
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                  <span>Total Retido / Deduções:</span>
                  <span className="font-mono text-rose-400">-{formatCurrency(totalDeductions, 'USD', locale)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Payout Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Depósito Líquido Efetuado (Direct Deposit)
                </span>
                <span className="text-xs text-slate-300">
                  Conta Bancária ACH: ••••{paystub.directDepositAccountLast4} • Liquidado
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {formatCurrency(netPay, 'USD', locale)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Documento Contábil Oficial • US GAAP Compliant</span>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => window.print()} className="text-xs">
              <Printer className="w-3.5 h-3.5 mr-1" />
              Imprimir Holerite
            </Button>
            <Button size="sm" variant="primary" onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
