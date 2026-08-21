'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { ClientInvoiceItem } from '@/lib/portal/client-portal-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  CreditCard,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ClientPayInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: ClientInvoiceItem | null;
  onPaymentSuccess: (invoiceId: string, paymentMethod: 'STRIPE_ACH' | 'CREDIT_CARD' | 'WIRE') => void;
}

export function ClientPayInvoiceModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSuccess,
}: ClientPayInvoiceModalProps) {
  const { locale } = useI18n();

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE_ACH' | 'CREDIT_CARD'>('STRIPE_ACH');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(invoice.id, paymentMethod);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pagamento Seguro de Fatura B2B</h3>
              <p className="text-[10px] text-slate-400">Checkout Criptografado Stripe ACH & Cartão Corporativo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{invoice.invoiceNumber}</span>
              <Badge variant="warning" className="text-[10px]">
                Vence em {formatDate(invoice.dueDate, locale)}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-300">{invoice.serviceDescription}</p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-slate-400">Total a Pagar:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(invoice.balanceDue, 'USD', locale)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Forma de Pagamento:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE_ACH')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all ${
                  paymentMethod === 'STRIPE_ACH'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs">Stripe ACH</div>
                  <div className="text-[9px] text-slate-500">Débito em Conta (0.8% cap $5)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'bg-sky-950/40 border-sky-500 text-sky-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs">Cartão de Crédito</div>
                  <div className="text-[9px] text-slate-500">Visa, Master, Amex</div>
                </div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Processamento criptografado de nível bancário com emissão instantânea de recibo contábil.</span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={isProcessing}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold"
            >
              {isProcessing ? 'Liquidando Pagamento...' : `Pagar ${formatCurrency(invoice.balanceDue, 'USD', locale)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
