'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { CompanyProfileEngine } from '@/lib/company/company-profile-engine';
import { CompanySandboxEngine, SandboxScenario } from '@/lib/sandbox/company-sandbox-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Layers,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  FlaskConical,
} from 'lucide-react';

interface NewSandboxCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioCreated: (scenario: SandboxScenario) => void;
}

export function NewSandboxCloneModal({
  isOpen,
  onClose,
  onScenarioCreated,
}: NewSandboxCloneModalProps) {
  const { locale } = useI18n();
  const companies = CompanyProfileEngine.INITIAL_COMPANIES;

  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id || 'comp-1');
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const [scenarioName, setScenarioName] = useState('Simulação de Reclassificação e Ajuste Societário');
  const [description, setDescription] = useState(
    'Ambiente isolado para testes de reestruturação societária, ajustes contábeis retroativos e simulação de taxas.'
  );
  const [simulatedTaxRegime, setSimulatedTaxRegime] = useState('Manter Atual');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newScenario = CompanySandboxEngine.createSandboxScenario(
      selectedCompanyId,
      scenarioName,
      description,
      simulatedTaxRegime !== 'Manter Atual' ? simulatedTaxRegime : undefined
    );

    onScenarioCreated(newScenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Clonar Empresa para Ambiente Sandbox (Isolamento)</h3>
              <p className="text-[10px] text-slate-400">Criação de réplica exata 100% desconectada da base operacional</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Empresa de Origem (Base de Produção):</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalName} ({c.formationState} • {c.entityType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Nome do Cenário de Teste / Sandbox:</label>
            <input
              type="text"
              required
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Regime Tributário Simulado no Sandbox:</label>
            <select
              value={simulatedTaxRegime}
              onChange={(e) => setSimulatedTaxRegime(e.target.value)}
              className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
            >
              <option value="Manter Atual">Manter Regime Atual da Empresa</option>
              <option value="S-Corporation (Form 1120-S)">Converter para S-Corporation (Form 1120-S)</option>
              <option value="C-Corporation (Form 1120)">Converter para C-Corporation (Form 1120)</option>
              <option value="LLC Partnership (Form 1065)">Converter para LLC Partnership (Form 1065)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Objetivo & Hipótese de Teste:</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 p-2 text-white resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Segurança Total: Nenhuma alteração feita neste Sandbox afetará a contabilidade, extratos fiscais ou declarações oficiais até que você decida explicitamente promover as alterações.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-purple-600 hover:bg-purple-500 font-bold">
              <FlaskConical className="w-4 h-4 mr-1.5" />
              Criar Ambiente Sandbox Isolado
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
