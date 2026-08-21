'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { VirtualCard } from '@/lib/banking/disbursements-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  CreditCard,
  Building2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NewVirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCreated: (card: VirtualCard) => void;
}

export function NewVirtualCardModal({
  isOpen,
  onClose,
  onCardCreated,
}: NewVirtualCardModalProps) {
  const { locale } = useI18n();

  const [cardholderName, setCardholderName] = useState('David Silva (Finance Lead)');
  const [monthlySpendLimit, setMonthlySpendLimit] = useState<number>(3000);
  const [purpose, setPurpose] = useState('Operações de Limpeza & Compras de Insumos');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: VirtualCard = {
      id: `vc-${Date.now()}`,
      cardholderName,
      last4,
      monthlySpendLimit,
      currentSpendMonth: 0,
      status: 'ACTIVE',
      purpose,
    };

    onCardCreated(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Emitir Novo Cartão Corporativo Virtual</h3>
              <p className="text-[10px] text-slate-400">Geração Instantânea via Stripe Issuing / Plaid</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Nome do Titular / Responsável:</label>
            <input
              type="text"
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Limite Mensal de Gastos (\$):</label>
            <input
              type="number"
              min="100"
              step="100"
              required
              value={monthlySpendLimit}
              onChange={(e) => setMonthlySpendLimit(parseFloat(e.target.value) || 0)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold text-sm"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Finalidade / Centro de Custo:</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Controle Inteligente: Transações acima do limite mensal são automaticamente declinadas em tempo real.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Emitir Cartão Virtual
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
