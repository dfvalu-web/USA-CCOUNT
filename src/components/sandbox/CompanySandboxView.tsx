'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  CompanySandboxEngine,
  SandboxScenario,
} from '@/lib/sandbox/company-sandbox-engine';
import { NewSandboxCloneModal } from './NewSandboxCloneModal';
import { SandboxDiffReviewModal } from './SandboxDiffReviewModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FlaskConical,
  Sparkles,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldAlert,
  Download,
  Plus,
  RefreshCw,
  Eye,
  Upload,
  Trash2,
  Sliders,
  DollarSign,
} from 'lucide-react';

export function CompanySandboxView() {
  const { locale, t } = useI18n();

  const [scenarios, setScenarios] = useState<SandboxScenario[]>(
    CompanySandboxEngine.INITIAL_SCENARIOS
  );

  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [selectedScenarioForDiff, setSelectedScenarioForDiff] = useState<SandboxScenario | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleScenarioCreated = (newScenario: SandboxScenario) => {
    setScenarios([newScenario, ...scenarios]);
    setNotificationMsg(`Ambiente Sandbox "${newScenario.name}" clonado e inicializado com sucesso!`);
  };

  const handlePromoteToProd = (promotedScenario: SandboxScenario) => {
    setScenarios(
      scenarios.map((s) =>
        s.id === promotedScenario.id ? { ...promotedScenario, status: 'PROMOTED_TO_PROD' } : s
      )
    );
    setNotificationMsg(
      `🎉 Cenário "${promotedScenario.name}" promovido para a base de produção com sucesso! Os lançamentos de ajuste foram consolidados no livro-razão oficial.`
    );
  };

  const handleResetSandbox = (scenarioId: string) => {
    setScenarios(
      scenarios.map((s) =>
        s.id === scenarioId
          ? {
              ...s,
              adjustingEntriesCount: 0,
              totalAdjustedDebits: 0,
              totalAdjustedCredits: 0,
              notes: ['Sandbox resetado para o snapshot limpo da base de produção.'],
            }
          : s
      )
    );
    setNotificationMsg(`Ambiente Sandbox ${scenarioId} resetado para o estado limpo de produção!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Ambiente Sandbox & Isolamento de Empresas
              <Badge variant="warning" className="text-[10px] bg-purple-950 text-purple-300 border-purple-700">
                100% Desconectado da Produção
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Ambiente seguro para testes tributários extremos, reestruturações societárias, lançamentos de ajuste e correções fora da base operacional
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="primary"
            className="bg-purple-600 hover:bg-purple-500 font-bold text-xs"
            onClick={() => setIsCloneModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Clonar Empresa para Sandbox
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-700 text-purple-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Safety Notice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>Isolamento Total de Dados</span>
          </div>
          <p className="text-xs text-slate-300">
            Nenhuma ação no Sandbox afeta o balanço oficial, as contas bancárias conectadas ou as declarações fiscais do IRS.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Sliders className="w-4 h-4" />
            <span>Simulação de Cenários M&A e Tributários</span>
          </div>
          <p className="text-xs text-slate-300">
            Teste conversões societárias (LLC para S-Corp / C-Corp), reclassificações de despesas e baixas de ativos imobilizados.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
            <Upload className="w-4 h-4" />
            <span>Promoção Segura para Produção</span>
          </div>
          <p className="text-xs text-slate-300">
            Após validar as correções e revisar o relatório de diferenças (Diff), promova as alterações para a base operacional com 1 clique.
          </p>
        </div>
      </div>

      {/* Scenarios Table Card */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cenários Sandbox Ativos & Réplicas de Teste</CardTitle>
              <CardDescription>
                Empresas clonadas para análise independente, simulação contábil e saneamento
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {scenarios.length} Ambientes Isolados
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">ID Cenário</TableHead>
              <TableHead>Nome do Cenário & Empresa Clonada</TableHead>
              <TableHead className="w-44">Regime / Teste</TableHead>
              <TableHead className="text-right w-32">Ajustes Deb/Cred</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
              <TableHead className="w-56 text-center">Ações do Sandbox</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scen) => (
              <TableRow key={scen.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-purple-400 text-xs">
                  {scen.id}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white text-xs">{scen.name}</div>
                  <div className="text-[10px] text-slate-400">Origem: {scen.sourceCompanyName}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {scen.simulatedTaxRegimeChange || 'Ajustes no Livro-Razão'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(scen.totalAdjustedDebits, 'USD', locale)}
                  <div className="text-[10px] text-slate-500 font-normal">
                    {scen.adjustingEntriesCount} lançamentos
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      scen.status === 'PROMOTED_TO_PROD'
                        ? 'success'
                        : scen.status === 'READY_FOR_REVIEW'
                        ? 'info'
                        : 'warning'
                    }
                    className="text-[10px]"
                  >
                    {scen.status === 'PROMOTED_TO_PROD'
                      ? '✓ Promovido p/ Produção'
                      : scen.status === 'READY_FOR_REVIEW'
                      ? 'Pronto para Revisão'
                      : '🧪 Em Teste Isolado'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2 text-sky-400 hover:text-sky-300"
                      onClick={() => setSelectedScenarioForDiff(scen)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Revisar Diff
                    </Button>
                    {scen.status !== 'PROMOTED_TO_PROD' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px] px-2 text-rose-400 hover:bg-rose-950/30"
                        onClick={() => handleResetSandbox(scen.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Resetar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal: Clonar Empresa para Sandbox */}
      <NewSandboxCloneModal
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        onScenarioCreated={handleScenarioCreated}
      />

      {/* Modal: Revisar Diff e Promover para Produção */}
      <SandboxDiffReviewModal
        isOpen={!!selectedScenarioForDiff}
        onClose={() => setSelectedScenarioForDiff(null)}
        scenario={selectedScenarioForDiff}
        onPromoteToProd={handlePromoteToProd}
      />
    </div>
  );
}
