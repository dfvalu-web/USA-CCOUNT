'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  DollarSign,
  Zap,
} from 'lucide-react';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
  amount: number;
  clientName: string;
  onSuccess: () => void;
}

export function StripeCheckoutModal({
  isOpen,
  onClose,
  invoiceNumber,
  amount,
  clientName,
  onSuccess,
}: StripeCheckoutModalProps) {
  const { locale } = useI18n();
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'ACH'>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Stripe & ACH Checkout Seguro</h3>
              <p className="text-[10px] text-slate-400">Fatura #{invoiceNumber} • {clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Pagamento Aprovado com Sucesso!</h4>
            <p className="text-xs text-slate-400">
              O valor de <strong>{formatCurrency(amount, 'USD', locale)}</strong> foi liquidado e baixado no razão contábil.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-4 text-xs">
            {/* Amount Summary */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total a Pagar</span>
                <span className="text-xs text-slate-300">Fatura {invoiceNumber}</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {formatCurrency(amount, 'USD', locale)}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ACH')}
                className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'ACH'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" /> Transferência ACH
              </button>
            </div>

            {paymentMethod === 'CARD' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Número do Cartão:</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Validade (MM/AA):</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CVC:</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Débito Direto ACH (Plaid Bank Link)</span>
                </div>
                <p className="text-slate-400">
                  Liquidação direta da conta bancária de {clientName} com taxa de processamento reduzida.
                </p>
              </div>
            )}

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
                {isProcessing ? 'Processando...' : `Confirmar Pagamento (${formatCurrency(amount, 'USD', locale)})`}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
