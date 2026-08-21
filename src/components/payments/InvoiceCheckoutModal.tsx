'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { InvoiceDTO } from '@/lib/accounting/invoicing-service';
import { StripeAchCheckoutService, CheckoutSession, SupportedPaymentMethod } from '@/lib/payments/stripe-ach-checkout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { X, CreditCard, Landmark, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface InvoiceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceDTO;
  onPaymentSettled?: (settledSession: CheckoutSession, journalEntry: any) => void;
}

export function InvoiceCheckoutModal({
  isOpen,
  onClose,
  invoice,
  onPaymentSettled,
}: InvoiceCheckoutModalProps) {
  const { locale, t } = useI18n();

  const [paymentMethod, setPaymentMethod] = useState<SupportedPaymentMethod>('ACH_DIRECT_DEBIT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settled, setSettled] = useState(false);

  if (!isOpen) return null;

  const session = StripeAchCheckoutService.createCheckoutSession(invoice, paymentMethod);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const result = StripeAchCheckoutService.executeSettlement(
        session,
        new Date().toISOString().split('T')[0]
      );
      setIsProcessing(false);
      setSettled(true);

      if (onPaymentSettled) {
        onPaymentSettled(result.settledSession, result.journalEntry);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Payment Checkout Portal
              <Badge variant="success" className="text-[10px]">
                Stripe Elements & ACH Verified
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Invoice #{invoice.invoiceNumber} • {invoice.contactName}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 bg-slate-950/60">
          {settled ? (
            <div className="p-6 text-center space-y-3 rounded-xl bg-slate-900 border border-emerald-500/40">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h4 className="text-base font-bold text-white">Payment Successfully Settled!</h4>
              <p className="text-xs text-slate-300">
                Amount of <strong>{formatCurrency(session.finalSettlementAmount, 'USD', locale)}</strong> was transferred via{' '}
                <span className="font-mono text-emerald-400">{paymentMethod}</span>.
              </p>
              <p className="text-[11px] text-slate-500">
                General Ledger updated: Debited 1010 Operating Checking & Credited 1200 Accounts Receivable.
              </p>
              <Button size="sm" variant="primary" className="mt-2" onClick={onClose}>
                Done
              </Button>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Invoice Total Due:</span>
                  <span className="font-mono text-white font-semibold">
                    {formatCurrency(session.grossAmountDue, 'USD', locale)}
                  </span>
                </div>
                {session.earlyPaymentDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span>Early Payment Discount (2% 10 Net 30):</span>
                    <span className="font-mono font-semibold">
                      -{formatCurrency(session.earlyPaymentDiscountAmount, 'USD', locale)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">Final Amount to Pay:</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">
                    {formatCurrency(session.finalSettlementAmount, 'USD', locale)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Select Payment Rail:</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ACH_DIRECT_DEBIT')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMethod === 'ACH_DIRECT_DEBIT'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Landmark className="w-4 h-4 mb-1 text-emerald-400" />
                    <div className="text-xs font-bold">Instant ACH Debit</div>
                    <div className="text-[10px] text-slate-500">Zero fee • Direct Bank Wire</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('STRIPE_CARD')}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      paymentMethod === 'STRIPE_CARD'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1 text-sky-400" />
                    <div className="text-xs font-bold">Credit Card / Apple Pay</div>
                    <div className="text-[10px] text-slate-500">Visa, MC, Amex, Apple Pay</div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit TLS Encrypted</span>
                </div>
                <Button size="sm" variant="primary" isLoading={isProcessing} onClick={handlePayNow}>
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  Authorize & Pay {formatCurrency(session.finalSettlementAmount, 'USD', locale)}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
