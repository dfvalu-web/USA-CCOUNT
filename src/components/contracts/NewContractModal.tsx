'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { ServiceContractAgreement } from '@/lib/contracts/contract-esign-engine';
import { EntityDirectoryEngine, ClientEntity } from '@/lib/directory/entity-directory-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  FileSignature,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractCreated: (contract: ServiceContractAgreement) => void;
  clients?: ClientEntity[];
}

export function NewContractModal({
  isOpen,
  onClose,
  onContractCreated,
  clients = EntityDirectoryEngine.INITIAL_CLIENTS,
}: NewContractModalProps) {
  const { locale } = useI18n();

  const [contractTitle, setContractTitle] = useState('Contrato de Prestação de Serviços & Retainer Mensal');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cnt-acme');
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const [contractType, setContractType] = useState<'MONTHLY_RETAINER' | 'FIXED_FEE_SOW' | 'HOURLY_MSA'>('MONTHLY_RETAINER');
  const [totalValue, setTotalValue] = useState<number>(36000);
  const [monthlyRetainerAmount, setMonthlyRetainerAmount] = useState<number>(3000);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newContract: ServiceContractAgreement = {
      id: `SOW-2026-${Math.floor(100 + Math.random() * 900)}`,
      contractTitle,
      clientName: selectedClient?.name || 'Cliente Empresarial',
      clientContactEmail: selectedClient?.email || 'finance@cliente.com',
      contractType,
      totalValue,
      monthlyRetainerAmount: contractType === 'MONTHLY_RETAINER' ? monthlyRetainerAmount : undefined,
      effectiveDate,
      expirationDate,
      status: 'SENT_FOR_SIGNATURE',
    };

    onContractCreated(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Criar Novo Contrato / SOW (e-Sign)</h3>
              <p className="text-[10px] text-slate-400">Emissão de Proposta e Acordo de Serviços com Assinatura Eletrônica</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Título do Acordo / Objeto:</label>
            <input
              type="text"
              required
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Cliente Contratante:</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stateCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Modelo de Contrato:</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              >
                <option value="MONTHLY_RETAINER">Retainer Mensal Recorrente</option>
                <option value="FIXED_FEE_SOW">Preço Fixo por Escopo (Fixed Fee)</option>
                <option value="HOURLY_MSA">Acordo Mestre por Hora (Hourly MSA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Valor Total do Contrato (\$):</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={totalValue}
                onChange={(e) => setTotalValue(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
              />
            </div>

            {contractType === 'MONTHLY_RETAINER' && (
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Valor Mensal Recorrente (\$):</label>
                <input
                  type="number"
                  min="0"
                  step="250"
                  required
                  value={monthlyRetainerAmount}
                  onChange={(e) => setMonthlyRetainerAmount(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-sky-400 font-mono font-bold"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Data de Início (Vigência):</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Data de Término:</label>
              <input
                type="date"
                required
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-sky-600 hover:bg-sky-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Emitir Contrato para Assinatura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
