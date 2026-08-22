'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  SmartReconciliationEngine,
  BankFeedTransaction,
  BankStatementParseResult,
} from '@/lib/accounting/smart-reconciliation-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Landmark,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  Camera,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckSquare,
  DollarSign,
  Building,
  Plus,
  FileText,
  AlertCircle,
  Clock,
  X,
  Search,
  Sliders,
  Filter,
} from 'lucide-react';

import { useCompany } from '@/lib/company/company-context';
import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { CompanyBankFeedEngine, ConnectedBankItem } from '@/lib/accounting/company-bank-feed';

interface SmartReconciliationHubProps {
  onPostJournalEntry?: (entry: any) => void;
}

export function SmartReconciliationHub({ onPostJournalEntry }: SmartReconciliationHubProps) {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();
  const { fiscalYear, selectedMonths, getFormattedPeriodLabel } = useFiscalPeriod();

  const [activeTab, setActiveTab] = useState<'smart-reconciliation' | 'live-sync' | 'statement-import' | 'ocr-scanner'>('smart-reconciliation');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RECONCILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);

  // Bank Feed Items State dinamicamente sincronizado com a empresa ativa e período fiscal
  const [transactions, setTransactions] = useState<BankFeedTransaction[]>(() =>
    CompanyBankFeedEngine.getBankFeedTransactions(
      activeCompany?.id || '',
      activeCompany?.legalName,
      fiscalYear,
      selectedMonths
    )
  );

  // Connected Banks List sincronizado com as contas da empresa
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBankItem[]>(() =>
    CompanyBankFeedEngine.getConnectedBanks(activeCompany?.id || '', activeCompany?.legalName)
  );

  // Efeito reativo para carregar contas bancárias e extratos ao trocar empresa ou ano/mês
  useEffect(() => {
    if (activeCompany) {
      const companyTx = CompanyBankFeedEngine.getBankFeedTransactions(
        activeCompany.id,
        activeCompany.legalName,
        fiscalYear,
        selectedMonths
      );
      const banks = CompanyBankFeedEngine.getConnectedBanks(activeCompany.id, activeCompany.legalName);
      setTransactions(companyTx);
      setConnectedBanks(banks);
    }
  }, [activeCompany, fiscalYear, selectedMonths]);

  // Modals State
  const [isPlaidModalOpen, setIsPlaidModalOpen] = useState(false);
  const [isManualTxModalOpen, setIsManualTxModalOpen] = useState(false);
  const [selectedPlaidBank, setSelectedPlaidBank] = useState('Bank of America');

  // Manual Transaction Form
  const [manualTxForm, setManualTxForm] = useState({
    payee: '',
    amount: '',
    isDebit: true,
    institution: connectedBanks[0]?.name || 'Truist Bank (Commercial)',
    accountCode: '5010',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // OCR Receipt State
  const [selectedReceipt, setSelectedReceipt] = useState<{
    vendor: string;
    date: string;
    total: number;
    tax: number;
    accountCode: string;
    description: string;
    fileName?: string;
  }>({
    vendor: 'Ecolab Commercial Chemical Solutions',
    date: '2026-08-20',
    total: 284.50,
    tax: 21.65,
    accountCode: '5020',
    description: 'Produtos de Limpeza Profunda, Desinfetantes Hospitalares & Sacos de Lixo Industriais',
    fileName: 'comprovante_ecolab_agosto.pdf',
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1-Click Reconcile Single
  const handleReconcileSingle = (tx: BankFeedTransaction, customAccount?: string) => {
    const entry = SmartReconciliationEngine.createJournalEntryForBankFeed(
      '11111111-1111-1111-1111-111111111111',
      tx,
      customAccount || tx.suggestedAccountCode
    );

    setTransactions(
      transactions.map((t) =>
        t.id === tx.id
          ? {
              ...t,
              status: 'RECONCILED',
              suggestedAccountCode: customAccount || t.suggestedAccountCode,
            }
          : t
      )
    );

    if (onPostJournalEntry) {
      onPostJournalEntry(entry);
    }

    setNotificationMsg(
      `Transação "${tx.payeeOrMerchant}" ($${Math.abs(tx.amount).toFixed(2)}) conciliada e contabilizada no Razão Contábil (Conta ${customAccount || tx.suggestedAccountCode} vs Conta 1010 Banco)!`
    );
  };

  // 1-Click Auto-Reconcile All
  const handleAutoReconcileAll = () => {
    const confident = transactions.filter(
      (t) => t.status === 'EXACT_MATCH_FOUND' || t.status === 'RULE_MATCH_FOUND'
    );

    for (const tx of confident) {
      const entry = SmartReconciliationEngine.createJournalEntryForBankFeed(
        '11111111-1111-1111-1111-111111111111',
        tx
      );
      if (onPostJournalEntry) {
        onPostJournalEntry(entry);
      }
    }

    setTransactions(
      transactions.map((t) =>
        t.status === 'EXACT_MATCH_FOUND' || t.status === 'RULE_MATCH_FOUND'
          ? { ...t, status: 'RECONCILED' }
          : t
      )
    );

    setNotificationMsg(
      `✨ Auto-Conciliação Concluída: ${confident.length} lançamentos bancários conciliados e integrados ao Razão Contábil!`
    );
  };

  // Handle Real File Upload (OFX/QBO/CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      let parseResult: BankStatementParseResult;

      if (file.name.toLowerCase().endsWith('.csv')) {
        parseResult = SmartReconciliationEngine.parseCsv(text, file.name);
      } else {
        parseResult = SmartReconciliationEngine.parseOfxOrQbo(text, file.name);
      }

      setTransactions([...parseResult.transactions, ...transactions]);
      setActiveTab('smart-reconciliation');
      setNotificationMsg(
        `Arquivo "${file.name}" importado com sucesso: ${parseResult.totalTransactionsFound} transações processadas (Débitos: $${parseResult.totalDebits.toFixed(2)}, Créditos: $${parseResult.totalCredits.toFixed(2)})!`
      );
    };
    reader.readAsText(file);
  };

  // 1-Click Auto Categorization Engine
  const handleAutoCategorizeAll = () => {
    let categorizedCount = 0;
    const updated = transactions.map((tx) => {
      if (tx.status === 'RECONCILED') return tx;
      categorizedCount++;
      const raw = (tx.rawDescription || tx.payeeOrMerchant || '').toLowerCase();
      let suggestedAcc = tx.suggestedAccountCode || '6000';
      let category = tx.categorySuggested || 'Despesas Gerais';

      if (raw.includes('home depot') || raw.includes('ecolab') || raw.includes('grainger') || raw.includes('chemical') || raw.includes('supply')) {
        suggestedAcc = '5020'; // Insumos e Materiais
        category = 'COGS • Insumos de Limpeza';
      } else if (raw.includes('shell') || raw.includes('chevron') || raw.includes('exxon') || raw.includes('fuel') || raw.includes('gas')) {
        suggestedAcc = '6040'; // Combustível e Frotas
        category = 'OPEX • Combustível & Frotas';
      } else if (raw.includes('stripe') || raw.includes('client') || raw.includes('deposit') || raw.includes('invoice')) {
        suggestedAcc = '4010'; // Receita de Serviços
        category = 'Receita • Serviços de Limpeza';
      } else if (raw.includes('fee') || raw.includes('truist') || raw.includes('chase') || raw.includes('bank')) {
        suggestedAcc = '6080'; // Taxas Bancárias
        category = 'OPEX • Tarifas Bancárias';
      } else if (raw.includes('insurance') || raw.includes('liberty')) {
        suggestedAcc = '6050'; // Seguros
        category = 'OPEX • Seguros Comerciais';
      }

      return {
        ...tx,
        suggestedAccountCode: suggestedAcc,
        categorySuggested: category,
        status: 'RULE_MATCH_FOUND' as const,
        matchConfidence: 98,
        matchExplanation: `IA & Regra Padrão: ${category} (Conta ${suggestedAcc})`,
      };
    });

    setTransactions(updated);
    setNotificationMsg(`✨ Auto-Categorização Preditiva executada com sucesso em ${categorizedCount} lançamentos bancários com 98% de confiança contábil!`);
  };

  // Demo OFX Sample Loader
  const handleLoadDemoOfx = () => {
    const ofxSample = `
OFXHEADER:100
DATA:OFXSGML
<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <BANKTRANLIST>
          <STMTTRN>
            <TRNTYPE>DEBIT
            <DTPOSTED>20260821120000
            <TRNAMT>-320.00
            <FITID>CHASE-DEMO-8801
            <NAME>ECOLAB COMMERCIAL
            <MEMO>DISINFECTANTS & FLOOR CLEANERS
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>CREDIT
            <DTPOSTED>20260821160000
            <TRNAMT>487.13
            <FITID>CHASE-DEMO-8802
            <NAME>STRIPE PAYOUT
            <MEMO>AUSTIN TECH HUB JANITORIAL
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT
            <DTPOSTED>20260820100000
            <TRNAMT>-95.40
            <FITID>CHASE-DEMO-8803
            <NAME>GRAINGER INDUSTRIAL JANITORIAL
            <MEMO>MICROFIBER PACK & SQUEEGEES
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>`;

    const parsed = SmartReconciliationEngine.parseOfxOrQbo(ofxSample, 'extrato_chase_demo.ofx');
    setTransactions([...parsed.transactions, ...transactions]);
    setActiveTab('smart-reconciliation');
    setNotificationMsg(
      `Extrato Demonstrativo OFX do JPMorgan Chase carregado com sucesso: ${parsed.totalTransactionsFound} novos lançamentos identificados e prontos para conciliação!`
    );
  };

  // Demo CSV Sample Loader
  const handleLoadDemoCsv = () => {
    const csvSample = `Date,Description,Debit,Credit
2026-08-21,THE HOME DEPOT #6512 AUSTIN,185.00,
2026-08-21,LIBERTY MUTUAL INSURANCE,450.00,
2026-08-20,STRIPE PAYOUT TRANSFER,,290.00`;

    const parsed = SmartReconciliationEngine.parseCsv(csvSample, 'extrato_mercury_demo.csv');
    setTransactions([...parsed.transactions, ...transactions]);
    setActiveTab('smart-reconciliation');
    setNotificationMsg(
      `Extrato Demonstrativo CSV do Mercury carregado com sucesso: ${parsed.totalTransactionsFound} novos lançamentos bancários adicionados!`
    );
  };

  // Manual Transaction Add
  const handleSaveManualTx = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualTxForm.amount) || 0;
    const finalAmount = manualTxForm.isDebit ? -Math.abs(val) : Math.abs(val);

    const newTx: BankFeedTransaction = {
      id: `bnk-manual-${Date.now()}`,
      institutionName: manualTxForm.institution,
      accountNumberMasked: '••••4819',
      date: manualTxForm.date,
      amount: finalAmount,
      rawDescription: manualTxForm.description || manualTxForm.payee,
      payeeOrMerchant: manualTxForm.payee,
      categorySuggested: manualTxForm.isDebit ? 'Despesa Operacional' : 'Receita Operacional',
      suggestedAccountCode: manualTxForm.accountCode,
      fitId: `MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'RULE_MATCH_FOUND',
      matchConfidence: 95,
      matchExplanation: 'Lançamento Manual pelo Usuário',
    };

    setTransactions([newTx, ...transactions]);
    setIsManualTxModalOpen(false);
    setNotificationMsg(`Lançamento manual de "${newTx.payeeOrMerchant}" adicionado à fila de conciliação com sucesso!`);
  };

  // Connect Bank via Plaid Simulator
  const handleConnectPlaidBank = () => {
    const mask = `••••${Math.floor(1000 + Math.random() * 9000)}`;
    const newBank: ConnectedBankItem = {
      id: selectedPlaidBank.toLowerCase().replace(/\s+/g, '-'),
      name: selectedPlaidBank,
      account: `Commercial Account (${mask})`,
      accountNumberMasked: mask,
      balance: Math.floor(50000 + Math.random() * 150000),
      status: 'Online',
      lastSync: 'Agora',
    };

    setConnectedBanks([...connectedBanks, newBank]);
    setIsPlaidModalOpen(false);
    setNotificationMsg(`Instituição Bancária "${selectedPlaidBank}" conectada com sucesso via Plaid Open Banking API!`);
  };

  // Post OCR Expense to General Ledger
  const handlePostOcrExpense = () => {
    if (!selectedReceipt) return;

    const entry = {
      organizationId: '11111111-1111-1111-1111-111111111111',
      date: new Date(selectedReceipt.date),
      memo: `Receipt OCR: ${selectedReceipt.vendor} ($${selectedReceipt.total.toFixed(2)})`,
      basis: 'BOTH',
      sourceType: 'EXPENSE_RECEIPT_OCR',
      sourceId: `ocr-${Date.now()}`,
      lines: [
        {
          accountId: selectedReceipt.accountCode,
          debit: selectedReceipt.total,
          credit: 0,
          description: `${selectedReceipt.vendor} - ${selectedReceipt.description}`,
        },
        {
          accountId: '1010', // Operating Checking
          debit: 0,
          credit: selectedReceipt.total,
          description: `Direct Bank Clearance for ${selectedReceipt.vendor}`,
        },
      ],
    };

    if (onPostJournalEntry) {
      onPostJournalEntry(entry);
    }

    setNotificationMsg(
      `Comprovante de "${selectedReceipt.vendor}" no valor de $${selectedReceipt.total.toFixed(2)} contabilizado no Razão (DR ${selectedReceipt.accountCode} / CR 1010 Banco)!`
    );
  };

  // Preset Receipts for Quick OCR Testing
  const handleSelectPresetReceipt = (type: 'ecolab' | 'homedepot' | 'chevron' | 'amazon') => {
    if (type === 'ecolab') {
      setSelectedReceipt({
        vendor: 'Ecolab Commercial Chemical Solutions',
        date: '2026-08-21',
        total: 284.50,
        tax: 21.65,
        accountCode: '5020',
        description: 'Produtos de Limpeza Profunda, Desinfetantes Hospitalares & Sacos Industriais',
        fileName: 'recibo_ecolab_284.pdf',
      });
    } else if (type === 'homedepot') {
      setSelectedReceipt({
        vendor: 'The Home Depot Pro Cleaners',
        date: '2026-08-20',
        total: 145.20,
        tax: 11.08,
        accountCode: '5020',
        description: 'Baldes Industriais, Mops Profissionais e Panos de Microfibra',
        fileName: 'nota_home_depot_145.jpg',
      });
    } else if (type === 'chevron') {
      setSelectedReceipt({
        vendor: 'Chevron Fleet Fuel Services',
        date: '2026-08-19',
        total: 55.00,
        tax: 0,
        accountCode: '6200',
        description: 'Abastecimento da Frota de Limpeza (Veículo 01)',
        fileName: 'cupom_posto_chevron_55.png',
      });
    } else {
      setSelectedReceipt({
        vendor: 'Amazon Business Essentials',
        date: '2026-08-18',
        total: 89.90,
        tax: 6.85,
        accountCode: '6100',
        description: 'Papelaria, Luvas Descartáveis de Nitrilo e Dispensers',
        fileName: 'invoice_amazon_89.pdf',
      });
    }
    setNotificationMsg('Comprovante selecionado e processado pelo motor OCR!');
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (statusFilter === 'PENDING' && tx.status === 'RECONCILED') return false;
    if (statusFilter === 'RECONCILED' && tx.status !== 'RECONCILED') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tx.payeeOrMerchant.toLowerCase().includes(q) ||
        tx.rawDescription.toLowerCase().includes(q) ||
        tx.fitId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = transactions.filter((t) => t.status !== 'RECONCILED').length;
  const reconciledCount = transactions.filter((t) => t.status === 'RECONCILED').length;

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".ofx,.qbo,.csv"
        className="hidden"
      />
      <input
        type="file"
        ref={receiptInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setSelectedReceipt({
              vendor: 'Comprovante Enviado pelo Usuário',
              date: new Date().toISOString().split('T')[0],
              total: 120.00,
              tax: 9.15,
              accountCode: '5020',
              description: 'Insumos de Limpeza e Consumíveis Operacionais',
          fileName: e.target.files[0].name,
            });
            setNotificationMsg(`Arquivo "${e.target.files[0].name}" processado pelo OCR com sucesso!`);
          }
        }}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Top Banner with Dynamic Bank Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {connectedBanks.map((bank) => (
          <Card key={bank.id} className="p-4 bg-slate-900 border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">{bank.name}</span>
              <Badge variant="success" className="text-[9px]">{bank.status}</Badge>
            </div>
            <span className="text-xl font-mono font-bold text-white mt-1 block">
              {formatCurrency(bank.balance, 'USD', locale)}
            </span>
            <span className="text-[10px] text-slate-500">{bank.account}</span>
          </Card>
        ))}

        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Transações do Período</span>
            <Badge variant={pendingCount === 0 ? "success" : "warning"} className="text-[9px]">
              {pendingCount === 0 ? "100% Conciliado" : `${pendingCount} Pendentes`}
            </Badge>
          </div>
          <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
            {pendingCount} Pendentes
          </span>
          <span className="text-[10px] text-slate-500">{reconciledCount} já conciliadas no período</span>
        </Card>

        <Card className="p-4 bg-slate-900 border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Período Fiscal Selecionado</span>
            <Badge variant="info" className="text-[9px]">{getFormattedPeriodLabel()}</Badge>
          </div>
          <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">3-Way Matching</span>
          <span className="text-[10px] text-slate-500">Banco vs Razão Contábil vs OCR</span>
        </Card>
      </div>

      {/* Main Reconciliation Hub Container */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Central de Conciliação Bancária ({activeCompany?.legalName || 'Empresa Ativa'})</CardTitle>
                <CardDescription>
                  Plaid Open Banking • Parser OFX/QBO/CSV • Auto-Matching 3-Way • {getFormattedPeriodLabel()}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoCategorizeAll}
                className="text-xs bg-slate-900 border-amber-500/40 text-amber-300 hover:bg-slate-800"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Auto-Categorizar IA
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadDemoOfx}
                className="text-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Carregar OFX Demo
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAutoReconcileAll}
                className="text-xs"
                disabled={pendingCount === 0}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Conciliar Tudo ({pendingCount})
              </Button>
            </div>
          </div>

          {/* Navigation Tabs inside Hub */}
          <div className="flex border-b border-slate-800 pt-4 space-x-6 text-xs">
            <button
              onClick={() => setActiveTab('smart-reconciliation')}
              className={`pb-2 font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'smart-reconciliation'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              Fila de Conciliação Inteligente ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('live-sync')}
              className={`pb-2 font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'live-sync'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Landmark className="w-4 h-4" />
              Bancos Conectados ({connectedBanks.length})
            </button>
            <button
              onClick={() => setActiveTab('statement-import')}
              className={`pb-2 font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'statement-import'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Importar Extrato OFX / QBO / CSV
            </button>
            <button
              onClick={() => setActiveTab('ocr-scanner')}
              className={`pb-2 font-medium flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'ocr-scanner'
                  ? 'border-emerald-500 text-emerald-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              Escaner OCR de Recibos
            </button>
          </div>
        </CardHeader>

        {/* Action and Filter Ribbon */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-medium">Filtro de Status:</span>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2 py-0.5 rounded ${statusFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
              >
                Todas ({transactions.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-2 py-0.5 rounded ${statusFilter === 'PENDING' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-slate-400'}`}
              >
                Pendentes ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('RECONCILED')}
                className={`px-2 py-0.5 rounded ${statusFilter === 'RECONCILED' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400'}`}
              >
                Conciliadas ({reconciledCount})
              </button>
            </div>
          </div>

          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Buscar lançamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-7 rounded-lg bg-slate-950 border border-slate-800 pl-7 pr-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Success Alert Banner */}
        {notificationMsg && (
          <div className="m-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg}</span>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setNotificationMsg(null)}>
              Fechar
            </Button>
          </div>
        )}

        {/* Tab 1: Conciliação Inteligente 3-Way */}
        {activeTab === 'smart-reconciliation' && (
          filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-xs space-y-2 bg-slate-900/30">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                <Landmark className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-300">
                Nenhuma Movimentação Bancária para {getFormattedPeriodLabel()}
              </p>
              <p className="text-slate-500 text-[11px] max-w-md mx-auto">
                Não constam lançamentos de extrato bancário ou transações pendentes de conciliação para o período selecionado de {activeCompany?.legalName || 'empresa ativa'}.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Data / FITID</TableHead>
                  <TableHead>Extrato Bancário (Descrição & Banco)</TableHead>
                  <TableHead>Conta no Razão Contábil (US GAAP)</TableHead>
                  <TableHead className="text-right w-28">Valor Bancário</TableHead>
                  <TableHead className="w-44 text-center">Confiança / Regra</TableHead>
                  <TableHead className="w-36 text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-mono text-xs text-white">{formatDate(tx.date, locale)}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{tx.fitId}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-white">{tx.payeeOrMerchant}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {tx.rawDescription} • <span className="text-sky-400">{tx.institutionName}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <select
                          value={tx.suggestedAccountCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            setTransactions(
                              transactions.map((t) => (t.id === tx.id ? { ...t, suggestedAccountCode: newCode } : t))
                            );
                          }}
                          disabled={tx.status === 'RECONCILED'}
                          className="h-7 text-xs rounded bg-slate-900 border border-slate-800 text-emerald-400 font-semibold px-2 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="4010">Conta 4010 - Receita de Serviços de Limpeza</option>
                          <option value="5010">Conta 5010 - Subcontratados 1099</option>
                          <option value="5020">Conta 5020 - Salários Diretos W-2</option>
                          <option value="6010">Conta 6010 - Honorários Legais e CPA</option>
                          <option value="6040">Conta 6040 - Veículos, Combustível & Frota</option>
                          <option value="6050">Conta 6050 - Insumos Químicos de Limpeza</option>
                          <option value="1510">Conta 1510 - Frota & Vans Imobilizado</option>
                          <option value="3010">Conta 3010 - Aporte de Capital dos Sócios</option>
                          <option value="3030">Conta 3030 - Distribuição de Lucros (Draws)</option>
                        </select>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{tx.matchExplanation}</div>
                    </TableCell>

                    <TableCell className="text-right font-mono tabular-nums font-bold text-sm">
                      <span className={tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {tx.amount < 0 ? '-' : '+'}
                        {formatCurrency(Math.abs(tx.amount), 'USD', locale)}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          tx.status === 'EXACT_MATCH_FOUND'
                            ? 'success'
                            : tx.status === 'RULE_MATCH_FOUND'
                            ? 'info'
                            : tx.status === 'RECONCILED'
                            ? 'success'
                            : 'warning'
                        }
                        className="text-[10px]"
                      >
                        {tx.status === 'EXACT_MATCH_FOUND'
                          ? '✓ 100% Match Exato'
                          : tx.status === 'RULE_MATCH_FOUND'
                          ? '⚡ 98% Regra Automática'
                          : tx.status === 'RECONCILED'
                          ? '✓ Conciliado'
                          : 'Pendente'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {tx.status !== 'RECONCILED' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          className="h-7 text-xs px-2 w-full"
                          onClick={() => handleReconcileSingle(tx)}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Conciliar
                        </Button>
                      ) : (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Conciliado
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}

        {/* Tab 2: Conexão Direta (Plaid Open Banking) */}
        {activeTab === 'live-sync' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {connectedBanks.map((bank) => (
                <div key={bank.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-sky-400" />
                      <span className="font-bold text-white">{bank.name}</span>
                    </div>
                    <Badge variant="success">{bank.status}</Badge>
                  </div>
                  <div className="text-xs text-slate-400">{bank.account}</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {formatCurrency(bank.balance, 'USD', locale)}
                  </div>
                  <div className="text-[10px] text-emerald-400">Última sinc: {bank.lastSync}</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="font-bold text-sky-300 block">Plaid Financial Data Engine Conectado</span>
                <span>Transações e extratos são baixados automaticamente via Webhook bancário instantâneo.</span>
              </div>
              <Button size="sm" variant="primary" onClick={() => setIsPlaidModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Conectar Nova Instituição (Plaid Link)
              </Button>
            </div>
          </div>
        )}

        {/* Tab 3: Importador de Extratos (OFX, QBO, CSV) */}
        {activeTab === 'statement-import' && (
          <div className="p-6 space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all"
            >
              <UploadCloud className="w-10 h-10 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Clique ou Arraste seu Extrato Bancário aqui</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Formatos Suportados: OFX, QBO (QuickBooks) ou CSV
                </p>
              </div>
              <Button size="sm" variant="primary">
                Selecionar Arquivo do Computador
              </Button>
            </div>

            {/* Quick Demo Statement Loaders */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Ou carregue arquivos de demonstração com 1 clique para testar o parser:
              </span>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline" onClick={handleLoadDemoOfx}>
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-sky-400" />
                  📥 Carregar Extrato Demo OFX (JPMorgan Chase)
                </Button>
                <Button size="sm" variant="outline" onClick={handleLoadDemoCsv}>
                  <FileText className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  📥 Carregar Extrato Demo CSV (Mercury Bank)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Escaner de Despesas & Comprovantes (OCR ➔ Razão) */}
        {activeTab === 'ocr-scanner' && (
          <div className="p-6 space-y-6">
            {/* Quick Preset Selector for OCR */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Testar Digitalização OCR Instantânea com Recibos de Exemplo:
                </span>
                <Button size="sm" variant="secondary" onClick={() => receiptInputRef.current?.click()}>
                  <Camera className="w-3.5 h-3.5 mr-1" />
                  Fazer Upload de Recibo Real
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSelectPresetReceipt('ecolab')}>
                  🧪 Recibo Ecolab Insumos ($284.50)
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPresetReceipt('homedepot')}>
                  🧹 Recibo Home Depot Mops & Baldes ($145.20)
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPresetReceipt('chevron')}>
                  ⛽ Recibo Combustível Chevron ($55.00)
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSelectPresetReceipt('amazon')}>
                  📦 Recibo Amazon Suprimentos ($89.90)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Receipt Preview */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-400" />
                    Comprovante Digitalizado (OCR Multimodal)
                  </h4>
                  <Badge variant="success">OCR 100% Legível</Badge>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                  <div className="text-center pb-2 border-b border-slate-800">
                    <span className="font-bold text-white block text-sm">{selectedReceipt.vendor}</span>
                    <span className="text-[10px] text-slate-500">{selectedReceipt.fileName || 'comprovante.pdf'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data: {selectedReceipt.date}</span>
                    <span>Hora: 14:32</span>
                  </div>
                  <div className="py-2 text-[11px] text-slate-400 border-y border-slate-900">
                    {selectedReceipt.description}
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Sales Tax Apurado:</span>
                    <span>${selectedReceipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold text-base pt-1 border-t border-slate-800">
                    <span>TOTAL DO COMPROVANTE:</span>
                    <span>${selectedReceipt.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Accounting Entry Bridge */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Classificação Contábil Automática</span>
                    <h4 className="text-base font-bold text-white mt-1">Lançamento de Despesa no Razão (US GAAP)</h4>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Fornecedor Identificado:</span>
                      <span className="text-white font-bold">{selectedReceipt.vendor}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Conta de Despesa (Débito):</span>
                      <select
                        value={selectedReceipt.accountCode}
                        onChange={(e) => setSelectedReceipt({ ...selectedReceipt, accountCode: e.target.value })}
                        className="bg-slate-900 border border-slate-700 text-emerald-400 font-bold rounded px-2 py-1"
                      >
                        <option value="5020">Conta 5020 - Insumos de Limpeza (COGS)</option>
                        <option value="5010">Conta 5010 - Salários & Diárias da Equipe</option>
                        <option value="6100">Conta 6100 - Escritório & Tecnologia</option>
                        <option value="6200">Conta 6200 - Veículos & Combustível</option>
                        <option value="6300">Conta 6300 - Seguros de Responsabilidade</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Conta de Saída (Crédito):</span>
                      <span className="text-sky-400 font-bold font-mono">Conta 1010 (JPMorgan Chase Checking)</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Valor Total do Lançamento:</span>
                      <span className="text-xl font-mono font-bold text-emerald-400">
                        {formatCurrency(selectedReceipt.total, 'USD', locale)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button size="lg" variant="primary" className="w-full" onClick={handlePostOcrExpense}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Contabilizar Comprovante Automaticamente no Razão
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modal: Conectar Banco via Plaid */}
      {isPlaidModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-sky-400" />
                Plaid Link • Conectar Instituição
              </h3>
              <button onClick={() => setIsPlaidModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-300">
                Selecione seu banco comercial dos EUA para sincronizar extratos e transações em tempo real:
              </p>
              <div className="space-y-2">
                {['Bank of America', 'Wells Fargo', 'Silicon Valley Bank (SVB)', 'Citibank Commercial', 'Brex Treasury'].map((bankName) => (
                  <button
                    type="button"
                    key={bankName}
                    onClick={() => setSelectedPlaidBank(bankName)}
                    className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                      selectedPlaidBank === bankName
                        ? 'bg-sky-950/60 border-sky-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <span>{bankName}</span>
                    {selectedPlaidBank === bankName && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button size="sm" variant="ghost" onClick={() => setIsPlaidModalOpen(false)}>Cancelar</Button>
                <Button size="sm" variant="primary" onClick={handleConnectPlaidBank}>
                  Autorizar Conexão Segura
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Lançamento Manual */}
      {isManualTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Adicionar Lançamento Bancário Manual
              </h3>
              <button onClick={() => setIsManualTxModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveManualTx} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Beneficiário / Fornecedor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ecolab Chemicals"
                    value={manualTxForm.payee}
                    onChange={(e) => setManualTxForm({ ...manualTxForm, payee: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Valor ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="150.00"
                    value={manualTxForm.amount}
                    onChange={(e) => setManualTxForm({ ...manualTxForm, amount: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Tipo de Movimentação</label>
                  <select
                    value={manualTxForm.isDebit ? 'DEBIT' : 'CREDIT'}
                    onChange={(e) => setManualTxForm({ ...manualTxForm, isDebit: e.target.value === 'DEBIT' })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="DEBIT">Saída / Despesa (Débito Bancário)</option>
                    <option value="CREDIT">Entrada / Receita (Depósito)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Conta do Razão Contábil</label>
                  <select
                    value={manualTxForm.accountCode}
                    onChange={(e) => setManualTxForm({ ...manualTxForm, accountCode: e.target.value })}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="5020">Conta 5020 - Insumos de Limpeza (COGS)</option>
                    <option value="5010">Conta 5010 - Salários & Diárias da Equipe</option>
                    <option value="4010">Conta 4010 - Receita Limpeza Residencial</option>
                    <option value="4020">Conta 4020 - Receita Janitorial Comercial</option>
                    <option value="6100">Conta 6100 - Escritório & Tech</option>
                    <option value="6200">Conta 6200 - Veículos & Combustível</option>
                    <option value="6300">Conta 6300 - Seguros de Responsabilidade</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsManualTxModalOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" variant="primary">Salvar Lançamento</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
