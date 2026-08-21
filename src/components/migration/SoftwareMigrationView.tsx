'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  SoftwareMigrationEngine,
  ImportedStatementPackage,
  SourceAccountingSoftware,
} from '@/lib/migration/software-migration-engine';
import { CompanyTaxProfile, CompanyProfileEngine } from '@/lib/company/company-profile-engine';
import { AccountMappingModal } from './AccountMappingModal';
import { NewMigrationUploadModal } from './NewMigrationUploadModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Upload,
  Sparkles,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';

export function SoftwareMigrationView() {
  const { locale, t } = useI18n();

  const [packages, setPackages] = useState<ImportedStatementPackage[]>(
    SoftwareMigrationEngine.INITIAL_PACKAGES
  );

  const [selectedPkgForMapping, setSelectedPkgForMapping] = useState<ImportedStatementPackage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePackageImported = (newPkg: ImportedStatementPackage, newCompany?: CompanyTaxProfile) => {
    setPackages([newPkg, ...packages]);
    setSelectedPkgForMapping(newPkg);

    if (newCompany) {
      CompanyProfileEngine.INITIAL_COMPANIES.push(newCompany);
      setNotificationMsg(
        `🎉 Auto-Cadastro Concluído! A empresa "${newCompany.legalName}" (${newCompany.formationState} • EIN ${newCompany.ein}) foi cadastrada e provisionada automaticamente no sistema. Demonstrativo (${newPkg.sourceSoftware.replace(/_/g, ' ')}) pronto para conferência De-Para!`
      );
    } else {
      setNotificationMsg(
        `Demonstrativo de ${newPkg.companyName} (${newPkg.sourceSoftware.replace(/_/g, ' ')}) carregado com sucesso! Revise o mapeamento De-Para.`
      );
    }
  };

  const handleSaveMappings = (updatedPkg: ImportedStatementPackage) => {
    setPackages(packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)));
    setNotificationMsg(`Mapeamentos do lote ${updatedPkg.id} salvos com sucesso!`);
  };

  const handleConsolidateToLedger = (pkgToPost: ImportedStatementPackage) => {
    setPackages(
      packages.map((p) => (p.id === pkgToPost.id ? { ...pkgToPost, status: 'POSTED_TO_LEDGER' } : p))
    );
    setNotificationMsg(
      `🎉 Sucesso! Os demonstrativos de ${pkgToPost.companyName} (${pkgToPost.statementType.replace(
        /_/g,
        ' '
      )}) foram consolidados e integrados ao Livro-Razão US GAAP do Mister Contábil com zero discrepância!`
    );
  };

  const filteredPackages = packages.filter(
    (p) =>
      p.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sourceSoftware.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMigratedAssets = packages.reduce((acc, p) => acc + p.totalDebits, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Importação & Migração Inteligente de Softwares Contábeis
              <Badge variant="success" className="text-[10px]">
                <Sparkles className="w-3 h-3 mr-1" /> IA De-Para US GAAP
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Integração direta de Balancetes, DRE, Balanços Patrimoniais e Livro Diário de QuickBooks, Xero, NetSuite, Sage e Excel
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            + Importar Novo Demonstrativo
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

      {/* Connectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'QuickBooks Online', logo: '🟢', status: 'API Connect Ready', tag: 'Intuit QBO' },
          { name: 'Xero Accounting', logo: '🔵', status: 'API Connect Ready', tag: 'Xero UK/US' },
          { name: 'Oracle NetSuite', logo: '🔴', status: 'SuiteTalk ERP', tag: 'Enterprise' },
          { name: 'Sage Intacct', logo: '🟣', status: 'XML Webhook', tag: 'Mid-Market' },
          { name: 'FreshBooks', logo: '🟡', status: 'REST Ingestion', tag: 'Service SMB' },
          { name: 'Excel / CSV / JSON', logo: '📊', status: 'Universal Parser', tag: 'Zero Config' },
        ].map((soft) => (
          <div
            key={soft.name}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800/90 space-y-1 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">{soft.logo}</span>
              <Badge variant="outline" className="text-[9px]">
                {soft.tag}
              </Badge>
            </div>
            <div className="font-bold text-white text-xs truncate">{soft.name}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {soft.status}
            </div>
          </div>
        ))}
      </div>

      {/* Packages Table Card */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Demonstrativos e Lotes de Migração Importados</CardTitle>
                <CardDescription>
                  Histórico de Balanços de Verificação e Demonstrações Financeiras Mapeadas
                </CardDescription>
              </div>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por empresa, software ou lote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID Lote</TableHead>
              <TableHead>Empresa & Software de Origem</TableHead>
              <TableHead className="w-36">Tipo de Demonstrativo</TableHead>
              <TableHead className="text-right w-32">Total Débitos</TableHead>
              <TableHead className="text-right w-32">Total Créditos</TableHead>
              <TableHead className="w-32 text-center">Balanço</TableHead>
              <TableHead className="w-36 text-center">Status</TableHead>
              <TableHead className="w-44 text-center">Ações De-Para</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg) => (
              <TableRow key={pkg.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-sky-400 text-xs">{pkg.id}</TableCell>
                <TableCell>
                  <div className="font-bold text-white text-xs">{pkg.companyName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Origem: {pkg.sourceSoftware.replace(/_/g, ' ')} • {formatDate(pkg.importedAt, locale)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {pkg.statementType.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(pkg.totalDebits, 'USD', locale)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-slate-200 text-xs">
                  {formatCurrency(pkg.totalCredits, 'USD', locale)}
                </TableCell>
                <TableCell className="text-center">
                  {pkg.isBalanced ? (
                    <Badge variant="success" className="text-[10px]">
                      ✓ Equilibrado ($0 Var)
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="text-[10px]">
                      Desbalanceado
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      pkg.status === 'POSTED_TO_LEDGER'
                        ? 'success'
                        : pkg.status === 'READY_TO_POST'
                        ? 'info'
                        : 'warning'
                    }
                    className="text-[10px]"
                  >
                    {pkg.status === 'POSTED_TO_LEDGER'
                      ? '✓ Integrado ao Ledger'
                      : pkg.status === 'READY_TO_POST'
                      ? 'Pronto para Consolidar'
                      : 'Pendente de Mapeamento'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant={pkg.status === 'POSTED_TO_LEDGER' ? 'outline' : 'primary'}
                    className={`h-7 text-[11px] px-2.5 font-bold ${
                      pkg.status !== 'POSTED_TO_LEDGER'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'text-sky-400'
                    }`}
                    onClick={() => setSelectedPkgForMapping(pkg)}
                  >
                    <ArrowRightLeft className="w-3 h-3 mr-1" />
                    {pkg.status === 'POSTED_TO_LEDGER' ? 'Revisar De-Para' : 'Mapear & Consolidar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal: Mapeamento De-Para */}
      <AccountMappingModal
        isOpen={!!selectedPkgForMapping}
        onClose={() => setSelectedPkgForMapping(null)}
        pkg={selectedPkgForMapping}
        onSaveMappings={handleSaveMappings}
        onConsolidateToLedger={handleConsolidateToLedger}
      />

      {/* Modal: Upload / Novo Demonstrativo */}
      <NewMigrationUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPackageImported={handlePackageImported}
      />
    </div>
  );
}
