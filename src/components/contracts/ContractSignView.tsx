'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  ContractEsignEngine,
  ServiceContractAgreement,
} from '@/lib/contracts/contract-esign-engine';
import { NewContractModal } from './NewContractModal';
import { SignContractModal } from './SignContractModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileSignature,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  Search,
  Eye,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export function ContractSignView() {
  const { locale, t } = useI18n();

  const [contracts, setContracts] = useState<ServiceContractAgreement[]>([
    {
      id: 'SOW-2026-091',
      contractTitle: 'Fintech Cloud Infrastructure & SOC 2 Advisory',
      clientName: 'Horizon Fintech Labs Inc',
      clientContactEmail: 'legal@horizonfintech.com',
      contractType: 'MONTHLY_RETAINER',
      totalValue: 120000,
      monthlyRetainerAmount: 10000,
      effectiveDate: '2026-09-01',
      expirationDate: '2027-08-31',
      status: 'SENT_FOR_SIGNATURE',
    },
    {
      id: 'SOW-2026-090',
      contractTitle: 'SaaS Multi-Tenant Database Architecture SOW',
      clientName: 'Austin Tech Hub Suites',
      clientContactEmail: 'facilities@austintechhub.io',
      contractType: 'FIXED_FEE_SOW',
      totalValue: 45000,
      effectiveDate: '2026-08-01',
      expirationDate: '2026-11-30',
      status: 'EXECUTED_SIGNED',
      signatureTimestamp: '2026-08-01T15:20:00Z',
      signerIpAddress: '198.51.100.42',
      cryptographicSignatureHash: 'sig_sha256_9b841a029c48b712',
    },
    {
      id: 'SOW-2026-089',
      contractTitle: 'Commercial Facility Janitorial & Disinfection MSA',
      clientName: 'Dr. Robert Harrison',
      clientContactEmail: 'dr.harrison@gmail.com',
      contractType: 'MONTHLY_RETAINER',
      totalValue: 24000,
      monthlyRetainerAmount: 2000,
      effectiveDate: '2026-06-01',
      expirationDate: '2027-05-31',
      status: 'EXECUTED_SIGNED',
      signatureTimestamp: '2026-06-01T11:10:00Z',
      signerIpAddress: '198.51.100.88',
      cryptographicSignatureHash: 'sig_sha256_4a91b4028c11e991',
    },
  ]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedForSign, setSelectedForSign] = useState<ServiceContractAgreement | null>(null);
  const [signMessage, setSignMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleContractCreated = (newContract: ServiceContractAgreement) => {
    setContracts([newContract, ...contracts]);
    setSignMessage(`Contrato #${newContract.id} criado com sucesso e enviado para assinatura eletrônica!`);
  };

  const handleContractSigned = (signed: ServiceContractAgreement) => {
    setContracts(contracts.map((c) => (c.id === signed.id ? signed : c)));
    setSignMessage(
      `Contrato #${signed.id} assinado digitalmente com sucesso! Hash criptográfico: ${signed.cryptographicSignatureHash}. Faturamento recorrente ativado!`
    );
  };

  const filteredContracts = contracts.filter(
    (c) =>
      c.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-sky-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Contratos de Serviços & Assinatura Digital (e-Sign SOW & Retainers)</CardTitle>
              <CardDescription>
                Acordos Selados Criptograficamente sob o ESIGN Act • Faturamento & Retainers Automatizados
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="primary"
              className="bg-sky-600 hover:bg-sky-500 font-bold text-xs"
              onClick={() => setIsNewModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Novo Contrato / SOW
            </Button>
          </div>
        </div>
      </CardHeader>

      {signMessage && (
        <div className="mx-6 mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{signMessage}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setSignMessage(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="px-6 pb-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por contrato, cliente ou ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Contrato ID</TableHead>
            <TableHead>Título do Acordo & Cliente</TableHead>
            <TableHead className="text-right w-28">Valor Total</TableHead>
            <TableHead className="w-32">Modelo</TableHead>
            <TableHead className="w-36 text-center">Status e-Sign</TableHead>
            <TableHead className="w-44">Auditoria / Selo SHA-256</TableHead>
            <TableHead className="w-32 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.map((contract) => (
            <TableRow key={contract.id} className="hover:bg-slate-900/50">
              <TableCell className="font-mono font-bold text-sky-400 text-xs">
                {contract.id}
              </TableCell>
              <TableCell>
                <div className="font-bold text-white text-xs">{contract.contractTitle}</div>
                <div className="text-[11px] text-slate-400">{contract.clientName}</div>
              </TableCell>
              <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                {formatCurrency(contract.totalValue, 'USD', locale)}
                {contract.monthlyRetainerAmount && (
                  <div className="text-[10px] text-slate-400 font-normal">
                    {formatCurrency(contract.monthlyRetainerAmount, 'USD', locale)}/mês
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {contract.contractType.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={contract.status === 'EXECUTED_SIGNED' ? 'success' : 'warning'}
                  className="text-[10px]"
                >
                  {contract.status === 'EXECUTED_SIGNED' ? '✓ Assinado Digitalmente' : 'Aguardando Assinatura'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                {contract.cryptographicSignatureHash ? (
                  <div>
                    <div className="font-mono text-[10px] text-emerald-400 truncate max-w-[160px]">
                      {contract.cryptographicSignatureHash}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">IP: {contract.signerIpAddress}</div>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">Pendente</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {contract.status === 'SENT_FOR_SIGNATURE' ? (
                  <Button
                    size="sm"
                    variant="primary"
                    className="h-7 text-[11px] px-2.5 bg-sky-600 hover:bg-sky-500 font-bold"
                    onClick={() => setSelectedForSign(contract)}
                  >
                    <FileSignature className="w-3 h-3 mr-1" />
                    Assinar Agora
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] px-2 text-slate-300"
                    onClick={() => setSelectedForSign(contract)}
                  >
                    <Eye className="w-3 h-3 mr-1 text-sky-400" />
                    Ver Contrato
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal: Criar Novo Contrato */}
      <NewContractModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onContractCreated={handleContractCreated}
      />

      {/* Modal: Assinar Contrato e-Sign */}
      <SignContractModal
        isOpen={!!selectedForSign}
        onClose={() => setSelectedForSign(null)}
        contract={selectedForSign}
        onSigned={handleContractSigned}
      />
    </Card>
  );
}
