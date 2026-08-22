import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useCompany } from '@/lib/company/company-context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import { StateFranchiseTaxEngine } from '@/lib/tax/state-franchise-tax-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Landmark,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  Building2,
  Calendar,
  DollarSign,
  Calculator,
} from 'lucide-react';

export function StateFranchiseTaxView() {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();

  const [activeStateTab, setActiveStateTab] = useState<'GA' | 'DE' | 'CA' | 'TX' | 'HISTORY'>(
    activeCompany?.formationState === 'GA' ? 'GA' : activeCompany?.formationState === 'TX' ? 'TX' : activeCompany?.formationState === 'CA' ? 'CA' : 'DE'
  );

  useEffect(() => {
    if (activeCompany?.formationState === 'GA') setActiveStateTab('GA');
    else if (activeCompany?.formationState === 'TX') setActiveStateTab('TX');
    else if (activeCompany?.formationState === 'CA') setActiveStateTab('CA');
    else if (activeCompany?.formationState === 'DE') setActiveStateTab('DE');
  }, [activeCompany]);

  // Delaware Interactive State
  const [deIsLlc, setDeIsLlc] = useState(false);
  const [deAuthShares, setDeAuthShares] = useState(10000000);
  const [deIssuedShares, setDeIssuedShares] = useState(8000000);
  const [deGrossAssets, setDeGrossAssets] = useState(500000);

  // California Interactive State
  const [caGrossIncome, setCaGrossIncome] = useState(350000);

  // Texas Interactive State
  const [txGrossRevenue, setTxGrossRevenue] = useState(450000);

  // Calculations
  const deTax = StateFranchiseTaxEngine.calculateDelawareFranchiseTax(
    deAuthShares,
    deIssuedShares,
    deGrossAssets,
    deIsLlc
  );

  const caTax = StateFranchiseTaxEngine.calculateCaliforniaLlcTax(caGrossIncome);
  const txTax = StateFranchiseTaxEngine.calculateTexasFranchiseTax(txGrossRevenue);

  // Filings History
  const [filings, setFilings] = useState([
    {
      id: 'FIL-DE-2025',
      state: 'Delaware (DE)',
      entityName: 'Apex CleanOps & Cloud Technologies Inc',
      form: 'DE Annual Franchise Tax Report',
      amountPaid: 450.00,
      filingDate: '2026-03-01',
      status: 'GOOD_STANDING',
      confirmationNumber: 'DE-SOS-9812401',
    },
    {
      id: 'FIL-CA-2025',
      state: 'California (CA)',
      entityName: 'Apex CleanOps & Cloud Technologies LLC',
      form: 'CA Form 568 / FTB 3536 ($800 + Fee)',
      amountPaid: 1700.00,
      filingDate: '2026-04-15',
      status: 'GOOD_STANDING',
      confirmationNumber: 'CA-FTB-4410294',
    },
    {
      id: 'FIL-TX-2025',
      state: 'Texas (TX)',
      entityName: 'Apex CleanOps Texas LLC',
      form: 'TX Comptroller Form 05-163 (No Tax Due)',
      amountPaid: 0.00,
      filingDate: '2026-05-15',
      status: 'GOOD_STANDING',
      confirmationNumber: 'TX-COMP-1049281',
    },
  ]);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handleSimulatePayment = (stateName: string, amount: number, formName: string) => {
    const newFiling = {
      id: `FIL-${activeStateTab}-2026`,
      state: stateName,
      entityName: 'Apex CleanOps & Cloud Technologies LLC',
      form: formName,
      amountPaid: amount,
      filingDate: new Date().toISOString().split('T')[0],
      status: 'GOOD_STANDING',
      confirmationNumber: `${activeStateTab}-SOS-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setFilings([newFiling, ...filings]);
    setNotificationMsg(
      `Relatório e Guia Estadual de ${stateName} (${formName}) protocolados e transmitidos com sucesso! Confirmação SOS: ${newFiling.confirmationNumber}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Central de State Franchise Taxes & Relatórios Anuais (DE / CA / TX)</h4>
            <p className="text-xs text-slate-400">
              Otimização Tributária Estatutária • Manutenção de Good Standing perante Secretarias de Estado (SOS)
            </p>
          </div>
        </div>

        {/* State Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveStateTab('GA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeStateTab === 'GA' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Georgia (GA - Milla Maid)
          </button>
          <button
            onClick={() => setActiveStateTab('DE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeStateTab === 'DE' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Delaware (DE)
          </button>
          <button
            onClick={() => setActiveStateTab('CA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeStateTab === 'CA' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            California (CA)
          </button>
          <button
            onClick={() => setActiveStateTab('TX')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeStateTab === 'TX' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Texas (TX)
          </button>
          <button
            onClick={() => setActiveStateTab('HISTORY')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeStateTab === 'HISTORY' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Protocolos & Good Standing ({filings.length})
          </button>
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

      {/* Tab 0: Georgia Annual Registration (Milla Maid) */}
      {activeStateTab === 'GA' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-emerald-500/30 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                Georgia Secretary of State & DOR
              </CardTitle>
              <CardDescription>Obrigações anuais da Milla Maid Services LLC na Geórgia</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Entidade:</span>
                  <span className="font-bold text-white">Milla Maid Services LLC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estado de Registro:</span>
                  <span className="font-bold text-emerald-400">Georgia (GA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxa Anual GA SOS:</span>
                  <span className="font-bold font-mono text-white">$50.00 / ano</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prazo de Envio:</span>
                  <span className="font-bold text-amber-400">1º de Abril Anual</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setNotificationMsg('Comprovante de Good Standing e Declaração Anual da Geórgia (GA Annual Registration) gerado com sucesso!');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Emitir Certificado de Good Standing GA
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 border-emerald-500/30 bg-slate-950">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Status de Conformidade Tributária da Geórgia</CardTitle>
                <Badge variant="success">✓ Active & Good Standing (GA SOS)</Badge>
              </div>
              <CardDescription>
                Georgia Department of Revenue (DOR) & Secretary of State Corporations Division
              </CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Georgia Net Worth Tax (Form 600S)</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 mt-1 block">$0.00</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Patrimônio líquido contábil abaixo do teto de isenção de $100,000 do estado da Geórgia.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Sales & Use Tax Exemption (Limpeza)</span>
                  <span className="text-2xl font-mono font-bold text-sky-400 mt-1 block">0.0% Isento</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Serviços de limpeza residencial e mão de obra pura são isentos de Sales Tax na Geórgia (O.C.G.A. § 48-8-3).
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 1: Delaware Optimizer */}
      {activeStateTab === 'DE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-indigo-500/30 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-400" />
                Parâmetros Societários de Delaware
              </CardTitle>
              <CardDescription>Ajuste os dados de capital para recalcular a taxa em tempo real</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Tipo Societário:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeIsLlc(false)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      !deIsLlc
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    C-Corp / S-Corp
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeIsLlc(true)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      deIsLlc
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    LLC (Taxa Fixa $300)
                  </button>
                </div>
              </div>

              {!deIsLlc && (
                <>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Ações Autorizadas no Certificado (Authorized Shares):
                    </label>
                    <input
                      type="number"
                      step="1000000"
                      value={deAuthShares}
                      onChange={(e) => setDeAuthShares(parseFloat(e.target.value) || 0)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Ações Emitidas / Subscritas (Issued Shares):
                    </label>
                    <input
                      type="number"
                      step="1000000"
                      value={deIssuedShares}
                      onChange={(e) => setDeIssuedShares(parseFloat(e.target.value) || 0)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">
                      Ativos Brutos Totais no Balanço (\$ Total Gross Assets):
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={deGrossAssets}
                      onChange={(e) => setDeGrossAssets(parseFloat(e.target.value) || 0)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                </>
              )}

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold"
                  onClick={() =>
                    handleSimulatePayment(
                      'Delaware (DE)',
                      deTax.minimalTaxPayable,
                      deIsLlc ? 'DE LLC Annual Tax ($300)' : 'DE Corp Annual Report & Franchise Tax'
                    )
                  }
                >
                  <FileCheck className="w-3.5 h-3.5 mr-1" />
                  Transmitir Annual Report & Pagar (${deTax.minimalTaxPayable})
                </Button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm">Comparador Estatutário Delaware: Authorized Shares vs Assumed Par Value</CardTitle>
                  <CardDescription>
                    Otimização automática para evitar cobranças indevidas de dezenas de milhares de dólares
                  </CardDescription>
                </div>
                <Badge variant="success">Vencimento: 1 de Março (Corp) / 1 de Junho (LLC)</Badge>
              </div>
            </CardHeader>
            <div className="p-6 space-y-4">
              {deIsLlc ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>Delaware LLC Annual Flat Tax:</span>
                    <span className="text-emerald-400 font-mono text-base">$300.00 / ano</span>
                  </div>
                  <p className="text-slate-400">
                    LLCs formadas em Delaware não pagam taxa de franquia baseada em ações ou receita, apenas a taxa fixa anual de \$300 devida até 1º de junho de cada ano.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Method 1 */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/40 space-y-2">
                      <span className="text-[11px] font-bold text-rose-400 block uppercase">
                        1. Método de Ações Autorizadas
                      </span>
                      <div className="text-xl font-bold font-mono text-rose-400 line-through">
                        {formatCurrency(deTax.authorizedSharesMethodTax, 'USD', locale)}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Calculado sobre o volume nominal de {deAuthShares.toLocaleString()} ações autorizadas.
                      </p>
                    </div>

                    {/* Method 2 */}
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase">
                          2. Método Assumed Par Value Capital
                        </span>
                        <Badge variant="success" className="text-[9px]">Recomendado</Badge>
                      </div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">
                        {formatCurrency(deTax.assumedParValueMethodTax, 'USD', locale)}
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Baseado na proporção de ativos totais ({formatCurrency(deGrossAssets, 'USD', locale)}) e ações emitidas.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <TrendingDown className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="font-bold block">Economia Tributária Identificada:</span>
                        <span>
                          Você economizou{' '}
                          <strong>
                            {formatCurrency(
                              deTax.authorizedSharesMethodTax - deTax.assumedParValueMethodTax,
                              'USD',
                              locale
                            )}
                          </strong>{' '}
                          ao optar pelo método de Assumed Par Value Capital!
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: California Form 568 */}
      {activeStateTab === 'CA' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-amber-500/30 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                Parâmetros California FTB
              </CardTitle>
              <CardDescription>Cálculo de Form 568 e taxa progressiva sobre receita da CA</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Receita Total Bruta da Califórnia (CA Total Gross Income):
                </label>
                <input
                  type="number"
                  step="50000"
                  value={caGrossIncome}
                  onChange={(e) => setCaGrossIncome(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-amber-400 font-mono font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-300">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Tabela Progressiva FTB:</span>
                <div className="flex justify-between text-[11px]">
                  <span>Até $250,000:</span>
                  <span className="font-mono">$0 Fee</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>$250k – $499,999:</span>
                  <span className="font-mono text-amber-400">$900 Fee</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>$500k – $999,999:</span>
                  <span className="font-mono text-amber-400">$2,500 Fee</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>$1M – $4,999,999:</span>
                  <span className="font-mono text-amber-400">$6,000 Fee</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                className="w-full bg-amber-600 hover:bg-amber-500 font-bold text-slate-950"
                onClick={() =>
                  handleSimulatePayment(
                    'California (CA)',
                    caTax.totalCaliforniaTaxDue,
                    'CA Form 568 / FTB 3536 Voucher'
                  )
                }
              >
                <FileCheck className="w-3.5 h-3.5 mr-1" />
                Transmitir Form 568 (${caTax.totalCaliforniaTaxDue})
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm">California Franchise Tax Board (FTB) Breakdown</CardTitle>
                  <CardDescription>Resumo discriminado de taxa mínima e taxa de faturamento</CardDescription>
                </div>
                <Badge variant="warning">Vencimento: 15 de Abril (FTB 3536)</Badge>
              </div>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Taxa Mínima Anual</span>
                  <span className="text-xl font-bold font-mono text-white">$800.00</span>
                  <span className="text-[10px] text-slate-500 block">Obrigatória para todas as LLCs</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">LLC Fee Escalonada</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    {formatCurrency(caTax.graduatedLlcFee, 'USD', locale)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Baseada na receita de {formatCurrency(caGrossIncome, 'USD', locale)}</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                  <span className="text-[10px] text-amber-300 uppercase font-bold block">Total Devido à Califórnia</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {formatCurrency(caTax.totalCaliforniaTaxDue, 'USD', locale)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Form 568 Schedule Q</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Texas Comptroller */}
      {activeStateTab === 'TX' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-emerald-500/30 bg-slate-950">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Parâmetros Texas Comptroller
              </CardTitle>
              <CardDescription>Cálculo de elegibilidade para No Tax Due (Limite de \$2.47M)</CardDescription>
            </CardHeader>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Receita Bruta Total (\$ Texas Gross Revenue):
                </label>
                <input
                  type="number"
                  step="50000"
                  value={txGrossRevenue}
                  onChange={(e) => setTxGrossRevenue(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold text-sm"
                />
              </div>

              <Button
                size="sm"
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold"
                onClick={() =>
                  handleSimulatePayment(
                    'Texas (TX)',
                    0,
                    'TX Comptroller Form 05-163 (No Tax Due Information Report)'
                  )
                }
              >
                <FileCheck className="w-3.5 h-3.5 mr-1" />
                Transmitir Form 05-163 ($0 Tax Due)
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 border-slate-800 bg-slate-950">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm">Texas Franchise Tax & Public Information Report (PIR)</CardTitle>
                  <CardDescription>Status perante o Texas Comptroller of Public Accounts</CardDescription>
                </div>
                <Badge variant="success">Vencimento: 15 de Maio</Badge>
              </div>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">
                    Status: Isento de Pagamento de Imposto (No Tax Due Eligible)
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    Sua receita ({formatCurrency(txGrossRevenue, 'USD', locale)}) está abaixo do teto de isenção de{' '}
                    <strong>{formatCurrency(txTax.noTaxDueThreshold, 'USD', locale)}</strong>.
                  </p>
                </div>
                <span className="text-2xl font-mono font-bold text-emerald-400">$0.00 Devido</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <span className="font-bold text-white block">Formulário Obrigatório a Transmitir:</span>
                <div className="font-mono text-sky-400">{txTax.requiredReport}</div>
                <span className="text-[11px] text-slate-400 block">
                  Mesmo sem imposto a pagar, a transmissão anual do Relatório de Informações Públicas (Form 05-102) é obrigatória para manter a empresa ativa perante o Estado do Texas.
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Filings History & Good Standing */}
      {activeStateTab === 'HISTORY' && (
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm">Histórico de Protocolos & Certificados de Good Standing</CardTitle>
                <CardDescription>Comprovantes oficiais de taxas estaduais transmitidas</CardDescription>
              </div>
              <Badge variant="success">Todas as Empresas em Good Standing</Badge>
            </div>
          </CardHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID Protocolo</TableHead>
                <TableHead>Estado & Entidade</TableHead>
                <TableHead>Relatório / Formulário</TableHead>
                <TableHead className="text-right w-28">Valor Pago</TableHead>
                <TableHead className="w-32">Data do Envio</TableHead>
                <TableHead className="w-36">Nº Confirmação SOS</TableHead>
                <TableHead className="w-28 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((f) => (
                <TableRow key={f.id} className="hover:bg-slate-900/50">
                  <TableCell className="font-mono font-bold text-sky-400 text-xs">{f.id}</TableCell>
                  <TableCell>
                    <div className="font-bold text-white text-xs">{f.state}</div>
                    <div className="text-[10px] text-slate-400">{f.entityName}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">{f.form}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                    {formatCurrency(f.amountPaid, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">{formatDate(f.filingDate, locale)}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-300">{f.confirmationNumber}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">
                      ✓ Good Standing
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
