'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UnitEconomicsEngine, ClientLtvCacMetric } from '@/lib/bi/unit-economics-engine';
import { EntityDirectoryEngine } from '@/lib/directory/entity-directory-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Target,
  Building2,
  DollarSign,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface NewClientLtvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientEvaluated: (metric: ClientLtvCacMetric) => void;
}

export function NewClientLtvModal({
  isOpen,
  onClose,
  onClientEvaluated,
}: NewClientLtvModalProps) {
  const { locale } = useI18n();
  const clients = EntityDirectoryEngine.INITIAL_CLIENTS;

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cnt-acme');
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const [annualContractValue, setAnnualContractValue] = useState<number>(120000);
  const [grossMarginPercentage, setGrossMarginPercentage] = useState<number>(72.5);
  const [estimatedLifespanYears, setEstimatedLifespanYears] = useState<number>(3.0);
  const [acquisitionCostCac, setAcquisitionCostCac] = useState<number>(8500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const evaluated = UnitEconomicsEngine.calculateClientLtv(
      `c-${Date.now()}`,
      selectedClient?.name || 'Cliente Corporativo',
      annualContractValue,
      grossMarginPercentage,
      estimatedLifespanYears,
      acquisitionCostCac
    );

    onClientEvaluated(evaluated);
    onClose();
  };

  const estimatedLtv = annualContractValue * (grossMarginPercentage / 100) * estimatedLifespanYears;
  const ltvCacRatio = acquisitionCostCac > 0 ? (estimatedLtv / acquisitionCostCac).toFixed(1) : '99.0';
  const paybackMonths = annualContractValue > 0 ? ((acquisitionCostCac / (annualContractValue * (grossMarginPercentage / 100))) * 12).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Avaliação de Client LTV vs CAC & Payback</h3>
              <p className="text-[10px] text-slate-400">Métricas de Eficiência de Capital & Retorno sobre Investimento</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Cliente:</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Valor Anual de Contrato (ACV \$):</label>
              <input
                type="number"
                min="1000"
                step="5000"
                required
                value={annualContractValue}
                onChange={(e) => setAnnualContractValue(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Margem Bruta Contratual (%):</label>
              <input
                type="number"
                min="10"
                max="100"
                step="1"
                required
                value={grossMarginPercentage}
                onChange={(e) => setGrossMarginPercentage(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Retenção Média (Anos):</label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                required
                value={estimatedLifespanYears}
                onChange={(e) => setEstimatedLifespanYears(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Custo de Aquisição (CAC \$):</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={acquisitionCostCac}
                onChange={(e) => setAcquisitionCostCac(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-amber-400 font-mono font-bold"
              />
            </div>
          </div>

          {/* Real-time KPI Card */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-sky-950/30 border border-sky-500/40 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Lifetime Value (LTV)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">${Math.round(estimatedLtv).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Razão LTV : CAC</span>
              <span className="text-sm font-bold font-mono text-sky-400">{ltvCacRatio}x</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Payback CAC</span>
              <span className="text-sm font-bold font-mono text-amber-300">{paybackMonths} meses</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-sky-600 hover:bg-sky-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Salvar Avaliação LTV/CAC
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
