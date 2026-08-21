'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  SoftwareMigrationEngine,
  SourceAccountingSoftware,
  StatementTypeToImport,
  ImportedStatementPackage,
  SourceAccountRawLine,
} from '@/lib/migration/software-migration-engine';
import {
  CompanyProfileEngine,
  CompanyTaxProfile,
  UsTaxEntityType,
} from '@/lib/company/company-profile-engine';
import { UsZipLookupEngine } from '@/lib/directory/us-zip-lookup-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  Upload,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  PlusCircle,
  MapPin,
} from 'lucide-react';

interface NewMigrationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPackageImported: (pkg: ImportedStatementPackage, newCompany?: CompanyTaxProfile) => void;
}

export function NewMigrationUploadModal({
  isOpen,
  onClose,
  onPackageImported,
}: NewMigrationUploadModalProps) {
  const { locale } = useI18n();

  const existingCompanies = CompanyProfileEngine.INITIAL_COMPANIES;
  const [importMode, setImportMode] = useState<'AUTO_REGISTER_NEW' | 'EXISTING_COMPANY'>('AUTO_REGISTER_NEW');

  // Existing company state
  const [selectedCompanyId, setSelectedCompanyId] = useState(existingCompanies[0]?.id || 'comp-1');

  // New company auto-registration fields
  const [newCompanyName, setNewCompanyName] = useState('Vanguard CleanTech Solutions LLC');
  const [newFormationState, setNewFormationState] = useState('TX');
  const [newEntityType, setNewEntityType] = useState<UsTaxEntityType>('LLC_PARTNERSHIP_1065');
  const [newZipCode, setNewZipCode] = useState('78701');
  const [newCity, setNewCity] = useState('Austin');
  const [newEin, setNewEin] = useState('93-8472910');

  // Software and statement type
  const [sourceSoftware, setSourceSoftware] = useState<SourceAccountingSoftware>('QUICKBOOKS_ONLINE');
  const [statementType, setStatementType] = useState<StatementTypeToImport>('TRIAL_BALANCE');
  const [useSampleData, setUseSampleData] = useState(true);

  if (!isOpen) return null;

  const handleZipChange = (zip: string) => {
    setNewZipCode(zip);
    if (zip.length >= 5) {
      const lookup = UsZipLookupEngine.lookupZip(zip);
      if (lookup) {
        setNewCity(lookup.city);
        setNewFormationState(lookup.state);
      }
    }
  };

  const handleProcessImport = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCompanyName = newCompanyName;
    let createdCompany: CompanyTaxProfile | undefined = undefined;

    if (importMode === 'AUTO_REGISTER_NEW') {
      createdCompany = CompanyProfileEngine.autoRegisterCompanyFromMigration(
        newCompanyName,
        newFormationState,
        newEntityType,
        newEin,
        newZipCode,
        newCity
      );
      targetCompanyName = createdCompany.legalName;
    } else {
      const found = existingCompanies.find((c) => c.id === selectedCompanyId);
      targetCompanyName = found?.legalName || 'Empresa Selecionada';
    }

    // Sample real-world raw lines generated based on chosen software and statement type
    let rawLines: SourceAccountRawLine[] = [];

    if (sourceSoftware === 'QUICKBOOKS_ONLINE') {
      rawLines = [
        { sourceAccountCode: '1000', sourceAccountName: 'Bank of America Business Checking', sourceAccountType: 'ASSET', debit: 380000, credit: 0, netBalance: 380000 },
        { sourceAccountCode: '1100', sourceAccountName: 'Trade Accounts Receivable', sourceAccountType: 'ASSET', debit: 52000, credit: 0, netBalance: 52000 },
        { sourceAccountCode: '1500', sourceAccountName: 'Commercial Cleaning Vehicles & Equipment', sourceAccountType: 'ASSET', debit: 48000, credit: 0, netBalance: 48000 },
        { sourceAccountCode: '2000', sourceAccountName: 'Accounts Payable Suppliers', sourceAccountType: 'LIABILITY', debit: 0, credit: 24500, netBalance: -24500 },
        { sourceAccountCode: '2200', sourceAccountName: 'Customer Retainer Liabilities', sourceAccountType: 'LIABILITY', debit: 0, credit: 18500, netBalance: -18500 },
        { sourceAccountCode: '3000', sourceAccountName: 'Opening Balance Equity Capital', sourceAccountType: 'EQUITY', debit: 0, credit: 310000, netBalance: -310000 },
        { sourceAccountCode: '4000', sourceAccountName: 'Facility Cleaning & Disinfection Revenue', sourceAccountType: 'REVENUE', debit: 0, credit: 215000, netBalance: -215000 },
        { sourceAccountCode: '5000', sourceAccountName: 'Direct Labor Wages W-2', sourceAccountType: 'EXPENSE', debit: 54000, credit: 0, netBalance: 54000 },
        { sourceAccountCode: '5100', sourceAccountName: 'Subcontractor Labor 1099 Fees', sourceAccountType: 'EXPENSE', debit: 22000, credit: 0, netBalance: 22000 },
        { sourceAccountCode: '6000', sourceAccountName: 'Cloud Software & Office Lease', sourceAccountType: 'EXPENSE', debit: 12000, credit: 0, netBalance: 12000 },
      ];
    } else if (sourceSoftware === 'XERO') {
      rawLines = [
        { sourceAccountCode: '090', sourceAccountName: 'Business Bank Account', sourceAccountType: 'ASSET', debit: 290000, credit: 0, netBalance: 290000 },
        { sourceAccountCode: '610', sourceAccountName: 'Accounts Receivable', sourceAccountType: 'ASSET', debit: 38000, credit: 0, netBalance: 38000 },
        { sourceAccountCode: '800', sourceAccountName: 'Trade Creditors A/P', sourceAccountType: 'LIABILITY', debit: 0, credit: 15000, netBalance: -15000 },
        { sourceAccountCode: '900', sourceAccountName: 'Retained Earnings', sourceAccountType: 'EQUITY', debit: 0, credit: 200000, netBalance: -200000 },
        { sourceAccountCode: '200', sourceAccountName: 'SaaS Platform Subscription Revenue', sourceAccountType: 'REVENUE', debit: 0, credit: 180000, netBalance: -180000 },
        { sourceAccountCode: '400', sourceAccountName: 'Software Engineering Contractor Fees', sourceAccountType: 'EXPENSE', debit: 52000, credit: 0, netBalance: 52000 },
        { sourceAccountCode: '420', sourceAccountName: 'AWS Cloud Compute & Hosting', sourceAccountType: 'EXPENSE', debit: 15000, credit: 0, netBalance: 15000 },
      ];
    } else if (sourceSoftware === 'NETSUITE') {
      rawLines = [
        { sourceAccountCode: '10100', sourceAccountName: 'Cash and Cash Equivalents - SVB', sourceAccountType: 'ASSET', debit: 540000, credit: 0, netBalance: 540000 },
        { sourceAccountCode: '12000', sourceAccountName: 'Accounts Receivable - Corporate', sourceAccountType: 'ASSET', debit: 85000, credit: 0, netBalance: 85000 },
        { sourceAccountCode: '20000', sourceAccountName: 'Accounts Payable - Operations', sourceAccountType: 'LIABILITY', debit: 0, credit: 35000, netBalance: -35000 },
        { sourceAccountCode: '30000', sourceAccountName: 'Common Stock APIC', sourceAccountType: 'EQUITY', debit: 0, credit: 400000, netBalance: -400000 },
        { sourceAccountCode: '40000', sourceAccountName: 'Enterprise SaaS Annual License', sourceAccountType: 'REVENUE', debit: 0, credit: 320000, netBalance: -320000 },
        { sourceAccountCode: '50000', sourceAccountName: 'Direct Engineering Salaries', sourceAccountType: 'EXPENSE', debit: 98000, credit: 0, netBalance: 98000 },
        { sourceAccountCode: '60000', sourceAccountName: 'Corporate Insurance & Legal', sourceAccountType: 'EXPENSE', debit: 32000, credit: 0, netBalance: 32000 },
      ];
    } else {
      rawLines = [
        { sourceAccountCode: '101', sourceAccountName: 'Checking Account', sourceAccountType: 'ASSET', debit: 150000, credit: 0, netBalance: 150000 },
        { sourceAccountCode: '102', sourceAccountName: 'Accounts Receivable', sourceAccountType: 'ASSET', debit: 25000, credit: 0, netBalance: 25000 },
        { sourceAccountCode: '201', sourceAccountName: 'Accounts Payable', sourceAccountType: 'LIABILITY', debit: 0, credit: 12000, netBalance: -12000 },
        { sourceAccountCode: '301', sourceAccountName: 'Owners Capital', sourceAccountType: 'EQUITY', debit: 0, credit: 100000, netBalance: -100000 },
        { sourceAccountCode: '401', sourceAccountName: 'Service Revenue', sourceAccountType: 'REVENUE', debit: 0, credit: 95000, netBalance: -95000 },
        { sourceAccountCode: '501', sourceAccountName: 'Payroll Expenses', sourceAccountType: 'EXPENSE', debit: 32000, credit: 0, netBalance: 32000 },
      ];
    }

    const newPackage = SoftwareMigrationEngine.processUploadedStatement(
      targetCompanyName,
      sourceSoftware,
      statementType,
      rawLines
    );

    onPackageImported(newPackage, createdCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Importar & Auto-Cadastrar Empresa</h3>
              <p className="text-[10px] text-slate-400">
                QuickBooks Online, Xero, NetSuite, Sage, FreshBooks ou Planilha Excel / CSV
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleProcessImport} className="p-6 space-y-4 text-xs overflow-y-auto">
          {/* Target Mode Toggle */}
          <div>
            <label className="text-slate-400 block mb-1.5 font-bold uppercase text-[10px]">
              1. Destino da Importação:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImportMode('AUTO_REGISTER_NEW')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all ${
                  importMode === 'AUTO_REGISTER_NEW'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs">Nova Empresa (Auto-Cadastro)</div>
                  <div className="text-[9px] text-slate-400">Cria perfil fiscal e plano de contas na hora</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setImportMode('EXISTING_COMPANY')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all ${
                  importMode === 'EXISTING_COMPANY'
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs">Empresa Já Cadastrada</div>
                  <div className="text-[9px] text-slate-400">Vincula a uma empresa existente</div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional: Auto-Registration Fields for New Company */}
          {importMode === 'AUTO_REGISTER_NEW' ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Dados da Nova Empresa (Preenchimento Automático por IA)
                </span>
                <Badge variant="success" className="text-[9px]">
                  Auto-Provisionamento Ativo
                </Badge>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Nome Legal / Razão Social da Empresa:</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2.5 text-white font-bold"
                  placeholder="Ex: Vanguard CleanTech Solutions LLC"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Jurisdição / Estado de Registro:</label>
                  <select
                    value={newFormationState}
                    onChange={(e) => setNewFormationState(e.target.value)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-white font-medium"
                  >
                    <option value="TX">Texas (TX) — Zero State Income Tax</option>
                    <option value="DE">Delaware (DE) — Corporate Friendly</option>
                    <option value="CA">California (CA) — FTB Compliance</option>
                    <option value="FL">Florida (FL) — Sunshine State</option>
                    <option value="NY">New York (NY) — Financial Capital</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Regime Tributário IRS:</label>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-white font-medium"
                  >
                    <option value="LLC_PARTNERSHIP_1065">LLC Parceria (Form 1065)</option>
                    <option value="S_CORP_1120S">S-Corporation (Form 1120-S)</option>
                    <option value="C_CORP_1120">C-Corporation (Form 1120)</option>
                    <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship (Schedule C)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">ZIP Code (EUA):</label>
                  <input
                    type="text"
                    required
                    value={newZipCode}
                    onChange={(e) => handleZipChange(e.target.value)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-sky-400 font-mono font-bold"
                    placeholder="78701"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Cidade:</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">EIN (Federal Tax ID):</label>
                  <input
                    type="text"
                    value={newEin}
                    onChange={(e) => setNewEin(e.target.value)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-700 px-2 text-emerald-400 font-mono"
                    placeholder="93-XXXXXXX"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Selecione a Empresa Cadastrada:</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
              >
                {existingCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalName} ({c.formationState} • {c.entityType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Software & Statement Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Software de Origem:</label>
              <select
                value={sourceSoftware}
                onChange={(e) => setSourceSoftware(e.target.value as any)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
              >
                <option value="QUICKBOOKS_ONLINE">QuickBooks Online (QBO)</option>
                <option value="XERO">Xero Accounting</option>
                <option value="NETSUITE">Oracle NetSuite (SuiteTalk)</option>
                <option value="SAGE_INTACCT">Sage Intacct</option>
                <option value="FRESHBOOKS">FreshBooks</option>
                <option value="UNIVERSAL_CSV_EXCEL">Universal CSV / Excel Standard</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Tipo de Demonstrativo:</label>
              <select
                value={statementType}
                onChange={(e) => setStatementType(e.target.value as any)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
              >
                <option value="TRIAL_BALANCE">Balanço de Verificação (Trial Balance)</option>
                <option value="INCOME_STATEMENT_PL">Demonstração do Resultado (P&L / DRE)</option>
                <option value="BALANCE_SHEET">Balanço Patrimonial (Balance Sheet)</option>
                <option value="GENERAL_LEDGER_ENTRIES">Livro Diário / Lançamentos (Journal Entries)</option>
                <option value="CHART_OF_ACCOUNTS">Plano de Contas (Chart of Accounts)</option>
              </select>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-xl p-5 text-center bg-slate-900/40 transition-colors cursor-pointer">
            <FileSpreadsheet className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium text-xs">
              Arraste seu arquivo (.CSV, .XLSX, .QBO, .TXT) ou clique para selecionar
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              O motor de IA detectará as colunas de Conta, Débito, Crédito e Saldo automaticamente
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2 shrink-0">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <Sparkles className="w-4 h-4 mr-1.5" />
              {importMode === 'AUTO_REGISTER_NEW'
                ? 'Auto-Cadastrar Empresa & Processar Importação'
                : 'Processar Arquivo & Mapear Contas'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
