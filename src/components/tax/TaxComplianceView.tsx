import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useCompany } from '@/lib/company/company-context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { SalesTaxNexusEngine, StateNexusStatus } from '@/lib/tax/sales-tax-engine';
import { IRSMappingEngine, TaxEntityType, IRSTaxReportSummary } from '@/lib/tax/irs-mapping-engine';
import { EstimatedTaxCalculator } from '@/lib/tax/estimated-tax-calculator';
import { SAMPLE_LEDGER_ACCOUNTS } from '@/lib/accounting/sample-data';
import { IrsMefExportModal } from './IrsMefExportModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Landmark,
  ShieldCheck,
  Download,
  AlertTriangle,
  FileText,
  ArrowRight,
  Code2,
  Calculator,
  Plus,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export function TaxComplianceView() {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();
  const [selectedEntity, setSelectedEntity] = useState<TaxEntityType>(
    (activeCompany?.entityType as TaxEntityType) || 'LLC_PARTNERSHIP_1065'
  );
  const [isMefModalOpen, setIsMefModalOpen] = useState(false);

  useEffect(() => {
    if (activeCompany?.entityType) {
      setSelectedEntity(activeCompany.entityType as TaxEntityType);
    }
  }, [activeCompany]);

  // Interactive Sales Feed
  const [salesFeed, setSalesFeed] = useState([
    { state: 'NY', amount: 320000, transactionCount: 45 },
    { state: 'CA', amount: 280000, transactionCount: 38 },
    { state: 'TX', amount: 145000, transactionCount: 22 },
    { state: 'FL', amount: 85000, transactionCount: 15 },
    { state: 'DE', amount: 95000, transactionCount: 12 },
    { state: 'IL', amount: 110000, transactionCount: 210 },
  ]);

  // Interactive Estimated Tax State
  const [projectedAnnualProfit, setProjectedAnnualProfit] = useState(185000);
  const [projectedState, setProjectedState] = useState<'DE' | 'CA' | 'TX' | 'NY' | 'FL'>('TX');

  // Engines
  const nexusList: StateNexusStatus[] = SalesTaxNexusEngine.evaluateNexus(salesFeed);
  const irsReport: IRSTaxReportSummary = IRSMappingEngine.mapToIRSForm(SAMPLE_LEDGER_ACCOUNTS, selectedEntity, 2026);
  const quarterlyEstimates = EstimatedTaxCalculator.calculateQuarterlyEstimatedTaxes(
    projectedAnnualProfit,
    projectedState,
    'PASS_THROUGH',
    2026
  );

  const handleUpdateSalesAmount = (stateCode: string, newAmount: number) => {
    setSalesFeed(
      salesFeed.map((s) => (s.state === stateCode ? { ...s, amount: newAmount } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Compliance Tributário Federal & Nexus Estadual de Sales Tax</h4>
            <p className="text-xs text-slate-400">
              Mapeamento Automático do Livro-Razão para IRS Form 1065, 1120-S, 1120 & Schemas MeF XML
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value as TaxEntityType)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="LLC_PARTNERSHIP_1065">LLC Partnership (Form 1065)</option>
            <option value="SCORP_1120S">S-Corporation (Form 1120-S)</option>
            <option value="CCORP_1120">C-Corporation (Form 1120)</option>
            <option value="SOLE_PROP_SCHED_C">Single-Member LLC (Schedule C)</option>
          </select>
          <Button
            size="sm"
            variant="primary"
            className="bg-sky-600 hover:bg-sky-500 font-bold text-xs"
            onClick={() => setIsMefModalOpen(true)}
          >
            <Code2 className="w-3.5 h-3.5 mr-1" />
            Gerar IRS MeF XML / Dossiê
          </Button>
        </div>
      </div>

      {/* IRS Tax Return Line Feeds */}
      <Card className="border-sky-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{irsReport.formName}</CardTitle>
              <CardDescription>
                Ano Fiscal {irsReport.taxYear} • Mapeamento Direto de Contas Contábeis (Sem Digitação Manual)
              </CardDescription>
            </div>
            <Badge variant="success">IRS Compliance Ready</Badge>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Linha IRS</TableHead>
              <TableHead>Descrição Oficial da Linha (IRS Tax Return)</TableHead>
              <TableHead className="w-36">Contas Contábeis de Origem</TableHead>
              <TableHead className="text-right w-36">Valor Mapeado (\$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {irsReport.lines.map((line) => (
              <TableRow key={line.lineNumber} className="hover:bg-slate-900/50">
                <TableCell className="font-mono text-sky-400 font-semibold">{line.lineNumber}</TableCell>
                <TableCell className="font-medium text-white text-xs">{line.lineDescription}</TableCell>
                <TableCell className="font-mono text-[11px] text-slate-400">
                  {line.sourceAccounts.join(', ')}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums font-bold text-emerald-300">
                  {formatCurrency(line.amount, 'USD', locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Grid: Sales Tax Nexus & Estimated Taxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Economic Nexus Monitor */}
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm">Monitor de Nexus Econômico Multi-Estadual (Wayfair Standard)</CardTitle>
                <CardDescription>Ajuste o volume de vendas por estado para monitorar a obrigação de Sales Tax</CardDescription>
              </div>
              <Badge variant="warning">South Dakota v. Wayfair</Badge>
            </div>
          </CardHeader>
          <div className="p-6 space-y-4">
            {nexusList.map((nexus) => (
              <div key={nexus.stateCode} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-sm">{nexus.stateCode}</span>
                    <span className="text-slate-400">({nexus.stateName})</span>
                    {nexus.isSaaSOrServiceTaxable && (
                      <Badge variant="warning" className="text-[9px] py-0">
                        SaaS / Serviços Tributáveis
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-[10px]">Vendas:</span>
                    <input
                      type="number"
                      step="10000"
                      value={nexus.salesTotal}
                      onChange={(e) => handleUpdateSalesAmount(nexus.stateCode, parseFloat(e.target.value) || 0)}
                      className="h-6 w-24 rounded bg-slate-950 border border-slate-700 px-1 text-emerald-400 font-mono font-bold text-right text-xs"
                    />
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      nexus.hasEconomicNexus ? 'bg-rose-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${Math.min(100, nexus.salesPercentageToThreshold)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{nexus.transactionCount} transações registradas</span>
                  {nexus.hasEconomicNexus ? (
                    <span className="font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Nexus Atingido! Registro e Recolhimento Obrigatórios
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {nexus.salesPercentageToThreshold}% do teto legal ({formatCurrency(nexus.salesThreshold, 'USD', locale)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quarterly Estimated Taxes (Q1-Q4) */}
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm">Estimativas Trimestrais de Imposto (IRS Form 1040-ES / 1120-W)</CardTitle>
                <CardDescription>Projeções de Safe Harbor e Vencimentos Oficiais do IRS</CardDescription>
              </div>
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-slate-400">Lucro Anual:</span>
                <input
                  type="number"
                  step="10000"
                  value={projectedAnnualProfit}
                  onChange={(e) => setProjectedAnnualProfit(parseFloat(e.target.value) || 0)}
                  className="h-7 w-28 rounded bg-slate-900 border border-slate-700 px-2 text-emerald-400 font-mono font-bold text-right text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <div className="p-6 space-y-3">
            {quarterlyEstimates.map((q) => (
              <div
                key={q.quarter}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Parcela Estimada Q{q.quarter} (Form 1040-ES)
                    <Badge variant="success" className="text-[9px] py-0">
                      Safe Harbor OK
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Vencimento IRS: {formatDate(q.dueDate, locale)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-sky-400">
                    {formatCurrency(q.totalEstimatedQuarterlyPayment, 'USD', locale)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Federal: ${q.federalEstimatedTaxDue} • Estadual: ${q.stateEstimatedTaxDue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal: IRS MeF XML Generator */}
      <IrsMefExportModal
        isOpen={isMefModalOpen}
        onClose={() => setIsMefModalOpen(false)}
        reportSummary={irsReport}
      />
    </div>
  );
}
