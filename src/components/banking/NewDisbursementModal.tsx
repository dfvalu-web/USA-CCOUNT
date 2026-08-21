'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { DisbursementRequest } from '@/lib/banking/disbursements-engine';
import { EntityDirectoryEngine, VendorEntity } from '@/lib/directory/entity-directory-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Landmark,
  Building2,
  DollarSign,
  Lock,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface NewDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisbursementCreated: (disb: DisbursementRequest) => void;
  currentMakerName: string;
  currentMakerId: string;
  vendors?: VendorEntity[];
}

export function NewDisbursementModal({
  isOpen,
  onClose,
  onDisbursementCreated,
  currentMakerName,
  currentMakerId,
  vendors = EntityDirectoryEngine.INITIAL_VENDORS,
}: NewDisbursementModalProps) {
  const { locale } = useI18n();

  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || 'vnd-001');
  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const [payeeName, setPayeeName] = useState(selectedVendor?.companyName || 'Ecolab Commercial Supply');
  const [payeeRoutingNumber, setPayeeRoutingNumber] = useState('021000021');
  const [payeeAccountNumber, setPayeeAccountNumber] = useState('984102941');
  const [amount, setAmount] = useState<number>(3250);
  const [paymentType, setPaymentType] = useState<'ACH_CCD' | 'ACH_PPD' | 'DOMESTIC_WIRE'>('ACH_CCD');
  const [memo, setMemo] = useState('Pagamento de Fornecedor de Produtos e Equipamentos');

  if (!isOpen) return null;

  const handleVendorChange = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    const v = vendors.find((vend) => vend.id === vendorId);
    if (v) {
      setPayeeName(v.companyName);
      setMemo(`Pagamento de Fatura — ${v.companyName}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDisb: DisbursementRequest = {
      id: `DISB-${Math.floor(100 + Math.random() * 900)}`,
      payeeName,
      payeeRoutingNumber,
      payeeAccountNumber,
      amount,
      paymentType,
      memo,
      createdByMakerId: currentMakerId,
      createdByMakerName: currentMakerName,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'PENDING_APPROVAL',
    };

    onDisbursementCreated(newDisb);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nova Solicitação de Desembolso / ACH</h3>
              <p className="text-[10px] text-slate-400">Iniciação por Maker ({currentMakerName}) • Sujeito a Dual Control</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Selecionar Fornecedor Cadastrado:</label>
            <select
              value={selectedVendorId}
              onChange={(e) => handleVendorChange(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.companyName} ({v.stateCode})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nome do Favorecido (Payee Name):</label>
              <input
                type="text"
                required
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Tipo de Transferência Bancária:</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                <option value="ACH_CCD">NACHA ACH CCD (PJ / Corporate)</option>
                <option value="ACH_PPD">NACHA ACH PPD (PF / Direct Deposit)</option>
                <option value="DOMESTIC_WIRE">Domestic Wire Transfer (Fedwire)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Routing Transit Number (9 dígitos ABA):</label>
              <input
                type="text"
                required
                maxLength={9}
                value={payeeRoutingNumber}
                onChange={(e) => setPayeeRoutingNumber(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Número da Conta Bancária (Account #):</label>
              <input
                type="text"
                required
                value={payeeAccountNumber}
                onChange={(e) => setPayeeAccountNumber(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Valor do Pagamento (\$):</label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Memo / Finalidade Contábil:</label>
              <input
                type="text"
                required
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Regra SOX & Dual Approval: Após a criação, este pagamento exigirá a aprovação de um <strong>Checker (CFO)</strong> para ser liberado na rede NACHA.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Criar Solicitação de Pagamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
