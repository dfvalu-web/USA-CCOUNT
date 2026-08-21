'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { UnitEconomicsEngine, ProjectUnitEconomics } from '@/lib/bi/unit-economics-engine';
import { EntityDirectoryEngine } from '@/lib/directory/entity-directory-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  PieChart,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface NewProjectEconomicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: ProjectUnitEconomics) => void;
}

export function NewProjectEconomicsModal({
  isOpen,
  onClose,
  onProjectCreated,
}: NewProjectEconomicsModalProps) {
  const { locale } = useI18n();

  const clients = EntityDirectoryEngine.INITIAL_CLIENTS;

  const [projectName, setProjectName] = useState('Contrato de Manutenção Predial & Desinfecção');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'cnt-acme');
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const [totalRevenue, setTotalRevenue] = useState<number>(45000);
  const [directLaborCost, setDirectLaborCost] = useState<number>(12000);
  const [contractorFees, setContractorFees] = useState<number>(3500);
  const [toolingAndSuppliesCost, setToolingAndSuppliesCost] = useState<number>(1800);
  const [billableHours, setBillableHours] = useState<number>(240);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProj = UnitEconomicsEngine.calculateProjectEconomics(
      `p-${Date.now()}`,
      projectName,
      selectedClient?.name || 'Cliente Corporativo',
      totalRevenue,
      directLaborCost,
      contractorFees,
      toolingAndSuppliesCost,
      billableHours
    );

    onProjectCreated(newProj);
    onClose();
  };

  const totalCosts = directLaborCost + contractorFees + toolingAndSuppliesCost;
  const margin = totalRevenue - totalCosts;
  const marginPct = totalRevenue > 0 ? ((margin / totalRevenue) * 100).toFixed(1) : '0';
  const realizationRate = billableHours > 0 ? (totalRevenue / billableHours).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Análise de Unit Economics por Projeto / Serviço</h3>
              <p className="text-[10px] text-slate-400">Cálculo de Margem de Contribuição & Taxa Efetiva de Realização</p>
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
              <label className="text-slate-400 block mb-1 font-semibold">Nome do Projeto / Serviço:</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Receita Total Faturada (\$):</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={totalRevenue}
                onChange={(e) => setTotalRevenue(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Horas Faturáveis / Trabalhadas:</label>
              <input
                type="number"
                min="1"
                step="10"
                required
                value={billableHours}
                onChange={(e) => setBillableHours(parseFloat(e.target.value) || 0)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-sky-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Custos Diretos de Entrega (COGS / COS):</span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Mão de Obra W-2 (\$):</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={directLaborCost}
                  onChange={(e) => setDirectLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-full h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Prestadores 1099 (\$):</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={contractorFees}
                  onChange={(e) => setContractorFees(parseFloat(e.target.value) || 0)}
                  className="w-full h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Insumos / SaaS (\$):</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={toolingAndSuppliesCost}
                  onChange={(e) => setToolingAndSuppliesCost(parseFloat(e.target.value) || 0)}
                  className="w-full h-7 rounded bg-slate-950 border border-slate-800 px-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Real-time calculated KPI preview */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Margem de Contribuição</span>
              <span className="text-sm font-bold font-mono text-emerald-400">${margin.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Margem Percentual</span>
              <span className="text-sm font-bold font-mono text-emerald-300">{marginPct}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Realização / Hora</span>
              <span className="text-sm font-bold font-mono text-sky-400">${realizationRate}/h</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Salvar Análise de Unit Economics
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
