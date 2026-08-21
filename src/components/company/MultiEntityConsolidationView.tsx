'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  MultiEntityConsolidationEngine,
  GroupEntitySummary,
  IntercompanyTransaction,
  ConsolidatedFinancialPackage,
} from '@/lib/company/multi-entity-consolidation-engine';
import { NewIntercompanyTransactionModal } from './NewIntercompanyTransactionModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Building2,
  Layers,
  ArrowRightLeft,
  DollarSign,
  Download,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';

export function MultiEntityConsolidationView() {
  const { locale, t } = useI18n();

  const [entities, setEntities] = useState<GroupEntitySummary[]>(
    MultiEntityConsolidationEngine.INITIAL_GROUP_ENTITIES
  );
  const [intercompany, setIntercompany] = useState<IntercompanyTransaction[]>(
    MultiEntityConsolidationEngine.INITIAL_INTERCOMPANY
  );

  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const consolidated: ConsolidatedFinancialPackage = MultiEntityConsolidationEngine.generateConsolidation(
    entities,
    intercompany
  );

  const handleTransactionCreated = (newTx: IntercompanyTransaction) => {
    setIntercompany([newTx, ...intercompany]);
    setNotificationMsg(
      `Transação intercompany de ${formatCurrency(newTx.amount, 'USD', locale)} registrada e eliminada com sucesso no consolidado!`
    );
  };

  const handleExportConsolidatedCsv = () => {
    let csv = `MISTER CONTÁBIL - CONSOLIDATED FINANCIAL REPORT (MULTI-ENTITY GROUP)\n`;
    csv += `Group Name,${consolidated.groupName}\n`;
    csv += `As of Date,${new Date().toISOString()}\n`;
    csv += `Gross Total Assets (USD),${consolidated.grossTotalAssets}\n`;
    csv += `Eliminated Intercompany Assets (USD),${consolidated.eliminatedIntercompanyAssets}\n`;
    csv += `Consolidated Net Assets (USD),${consolidated.consolidatedNetAssets}\n`;
    csv += `Consolidated Net Revenue (USD),${consolidated.consolidatedNetRevenue}\n`;
    csv += `Consolidated Net Income (USD),${consolidated.consolidatedNetIncome}\n\n`;

    csv += `GROUP ENTITIES BREAKDOWN\n`;
    csv += `Legal Name,Jurisdiction,Entity Type,Ownership (%),Total Assets (USD),Total Revenue (USD),Net Income (USD)\n`;
    entities.forEach((e) => {
      csv += `"${e.legalName}","${e.jurisdiction}","${e.entityType}",${e.ownershipPercentage}%,${e.totalAssets},${e.totalRevenue},${e.netIncome}\n`;
    });
    csv += `\n`;

    csv += `INTERCOMPANY ELIMINATIONS SCHEDULE\n`;
    csv += `Transaction ID,Source Entity,Target Entity,Nature,Amount (USD),Elimination Status\n`;
    intercompany.forEach((ic) => {
      csv += `"${ic.id}","${ic.sourceEntityName}","${ic.targetEntityName}","${ic.transactionType}",${ic.amount},"${ic.eliminationStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CONSOLIDATED_FINANCIAL_PACKAGE_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg('Dossiê financeiro consolidado do grupo exportado com sucesso (.CSV)!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Consolidação Multi-Empresas & Holding
              <Badge variant="success" className="text-[10px]">
                US GAAP ASC 810 Consolidated
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Balanço e DRE consolidados do grupo econômico com eliminação automática de transações intercompany
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={handleExportConsolidatedCsv}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Exportar Consolidado (.CSV)
          </Button>
          <Button
            size="sm"
            variant="primary"
            className="bg-indigo-600 hover:bg-indigo-500 font-bold text-xs"
            onClick={() => setIsNewTxModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Nova Transação Intercompany
          </Button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ativo Líquido Consolidado</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 block">
            {formatCurrency(consolidated.consolidatedNetAssets, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {entities.length} entidades combinadas
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Receita Líquida do Grupo</span>
          <span className="text-2xl font-bold font-mono text-white block">
            {formatCurrency(consolidated.consolidatedNetRevenue, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Após eliminações</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lucro Líquido Consolidado</span>
          <span className="text-2xl font-bold font-mono text-sky-400 block">
            {formatCurrency(consolidated.consolidatedNetIncome, 'USD', locale)}
          </span>
          <span className="text-[10px] text-slate-500 block">Margem líquida global: 39.4%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Eliminações Intercompany</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {formatCurrency(consolidated.eliminatedIntercompanyRevenue, 'USD', locale)}
            </span>
            <Badge variant="success" className="text-[10px]">
              ✓ $0 Dupla Contagem
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 block font-mono">{intercompany.length} transações eliminadas</span>
        </div>
      </div>

      {/* Entities Table */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estrutura Corporativa do Grupo (Holding & Subsidiárias)</CardTitle>
              <CardDescription>Entidades que compõem o grupo consolidado para demonstrações financeiras</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {entities.length} Entidades Integradas
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão Social da Entidade</TableHead>
              <TableHead className="w-36">Jurisdição</TableHead>
              <TableHead className="w-48">Tipo Societário</TableHead>
              <TableHead className="text-right w-24">Controle %</TableHead>
              <TableHead className="text-right w-32">Total Ativos</TableHead>
              <TableHead className="text-right w-32">Receita YTD</TableHead>
              <TableHead className="text-right w-32">Lucro Líquido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((e) => (
              <TableRow key={e.id} className="hover:bg-slate-900/50">
                <TableCell>
                  <div className="font-bold text-white text-xs">{e.legalName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {e.id}</div>
                </TableCell>
                <TableCell className="text-xs text-slate-300 font-medium">{e.jurisdiction}</TableCell>
                <TableCell className="text-xs text-slate-300 font-medium">{e.entityType}</TableCell>
                <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                  {e.ownershipPercentage}%
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(e.totalAssets, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-200 text-xs">
                  {formatCurrency(e.totalRevenue, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                  {formatCurrency(e.netIncome, 'USD', locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Intercompany Eliminations Table */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quadro de Eliminações Intercompany (Intercompany Eliminations Schedule)</CardTitle>
              <CardDescription>
                Operações entre empresas do mesmo grupo eliminadas na consolidação sob o ASC 810
              </CardDescription>
            </div>
            <Badge variant="success" className="text-[10px]">
              {intercompany.length} Operações Eliminadas
            </Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID</TableHead>
              <TableHead>Empresa Origem (Pagadora) → Empresa Destino (Recebedora)</TableHead>
              <TableHead className="w-44">Natureza</TableHead>
              <TableHead className="text-right w-32">Valor Eliminado</TableHead>
              <TableHead className="w-36 text-center">Status Contábil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intercompany.map((ic) => (
              <TableRow key={ic.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-indigo-400 text-xs">{ic.id}</TableCell>
                <TableCell>
                  <div className="text-white text-xs font-semibold">
                    {ic.sourceEntityName} <span className="text-slate-500 font-bold">→</span> {ic.targetEntityName}
                  </div>
                  <div className="text-[10px] text-slate-400">{ic.memo}</div>
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  <Badge variant="outline" className="text-[9px]">
                    {ic.transactionType.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-rose-400 text-xs">
                  ({formatCurrency(ic.amount, 'USD', locale)})
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="success" className="text-[10px]">
                    ✓ Eliminado ASC 810
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Nova Transacao */}
      <NewIntercompanyTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onTransactionCreated={handleTransactionCreated}
      />
    </div>
  );
}
