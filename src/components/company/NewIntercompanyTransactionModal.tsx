'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  MultiEntityConsolidationEngine,
  IntercompanyTransaction,
} from '@/lib/company/multi-entity-consolidation-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

interface NewIntercompanyTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionCreated: (tx: IntercompanyTransaction) => void;
}

export function NewIntercompanyTransactionModal({
  isOpen,
  onClose,
  onTransactionCreated,
}: NewIntercompanyTransactionModalProps) {
  const { locale } = useI18n();
  const entities = MultiEntityConsolidationEngine.INITIAL_GROUP_ENTITIES;

  const [sourceEntityId, setSourceEntityId] = useState(entities[1]?.id || 'ent-sub-02');
  const [targetEntityId, setTargetEntityId] = useState(entities[0]?.id || 'ent-hold-01');
  const [transactionType, setTransactionType] = useState<IntercompanyTransaction['transactionType']>('MANAGEMENT_FEE');
  const [amount, setAmount] = useState<number>(12000);
  const [memo, setMemo] = useState('Taxa de Gestão e Serviços Compartilhados Intercompany');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTx = MultiEntityConsolidationEngine.addIntercompanyTransaction(
      sourceEntityId,
      targetEntityId,
      transactionType,
      amount,
      memo
    );

    onTransactionCreated(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nova Transação Intercompany (Entre Empresas do Grupo)</h3>
              <p className="text-[10px] text-slate-400">Eliminação Contábil Automática no Balanço Consolidado</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Empresa de Origem (Pagadora):</label>
              <select
                value={sourceEntityId}
                onChange={(e) => setSourceEntityId(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.legalName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Empresa de Destino (Recebedora):</label>
              <select
                value={targetEntityId}
                onChange={(e) => setTargetEntityId(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.legalName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Natureza da Operação:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as any)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                <option value="MANAGEMENT_FEE">Taxa de Gestão / Management Fee</option>
                <option value="INTERCOMPANY_LOAN">Mútuo / Empréstimo Intercompany</option>
                <option value="IP_LICENSE_ROYALTY">Royalty / Licenciamento de Software</option>
                <option value="SHARED_SERVICES">Serviços Compartilhados (Shared Services)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Valor da Transação ($ USD):</label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Memorando / Justificativa Contábil:</label>
            <input
              type="text"
              required
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-[11px] text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              O motor de consolidação eliminará automaticamente esta receita e despesa do resultado consolidado do grupo para evitar dupla contagem.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-indigo-600 hover:bg-indigo-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Lançar Transação Intercompany
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
