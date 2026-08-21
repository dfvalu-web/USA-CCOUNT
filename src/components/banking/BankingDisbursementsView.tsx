'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  DisbursementsEngine,
  DisbursementRequest,
  VirtualCard,
} from '@/lib/banking/disbursements-engine';
import { NewDisbursementModal } from './NewDisbursementModal';
import { NewVirtualCardModal } from './NewVirtualCardModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  CreditCard,
  AlertCircle,
  Plus,
  UserCheck,
  XCircle,
  Building2,
  Landmark,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export function BankingDisbursementsView() {
  const { locale, t } = useI18n();

  // Dual Control Simulated User
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: 'MAKER' | 'CHECKER';
  }>({
    id: 'user-cfo-02',
    name: 'Victoria Sterling (CFO / Checker)',
    role: 'CHECKER',
  });

  const [disbursements, setDisbursements] = useState<DisbursementRequest[]>([
    {
      id: 'DISB-881',
      payeeName: 'Elena Rostova Tech Services',
      payeeRoutingNumber: '021000021',
      payeeAccountNumber: '984102941',
      amount: 4800,
      paymentType: 'ACH_CCD',
      memo: '1099 Contractor Engineering Retainer',
      createdByMakerId: 'user-accountant-01',
      createdByMakerName: 'David Silva (Staff Accountant)',
      createdAt: '2026-08-20',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'DISB-882',
      payeeName: 'Ecolab Commercial Supply',
      payeeRoutingNumber: '121000358',
      payeeAccountNumber: '449102991',
      amount: 1420.50,
      paymentType: 'ACH_CCD',
      memo: 'Compra de Químicos e Desinfetantes de Limpeza',
      createdByMakerId: 'user-accountant-01',
      createdByMakerName: 'David Silva (Staff Accountant)',
      createdAt: '2026-08-19',
      approvedByCheckerId: 'user-cfo-02',
      approvedByCheckerName: 'Victoria Sterling (CFO)',
      approvedAt: '2026-08-20T14:10:00Z',
      status: 'APPROVED',
    },
    {
      id: 'DISB-883',
      payeeName: 'Grainger Industrial Janitorial Hardware',
      payeeRoutingNumber: '071000013',
      payeeAccountNumber: '558192044',
      amount: 3100.00,
      paymentType: 'ACH_CCD',
      memo: 'Maquinário de Lavagem e Enceramento Industrial',
      createdByMakerId: 'user-accountant-01',
      createdByMakerName: 'David Silva (Staff Accountant)',
      createdAt: '2026-08-18',
      approvedByCheckerId: 'user-cfo-02',
      approvedByCheckerName: 'Victoria Sterling (CFO)',
      approvedAt: '2026-08-19T10:30:00Z',
      status: 'APPROVED',
    },
  ]);

  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([
    {
      id: 'vc-1',
      cardholderName: 'Sarah Jenkins (CTO)',
      last4: '4192',
      monthlySpendLimit: 5000,
      currentSpendMonth: 1420.50,
      status: 'ACTIVE',
      purpose: 'DevOps & Cloud SaaS Subscriptions',
    },
    {
      id: 'vc-2',
      cardholderName: 'Carlos Gomez (Field Supervisor)',
      last4: '8830',
      monthlySpendLimit: 2000,
      currentSpendMonth: 480.00,
      status: 'ACTIVE',
      purpose: 'Combustível de Frotas & Suprimentos Emergenciais',
    },
  ]);

  // Modal States
  const [isDisbursementModalOpen, setIsDisbursementModalOpen] = useState(false);
  const [isVirtualCardModalOpen, setIsVirtualCardModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateDisbursement = (newDisb: DisbursementRequest) => {
    setDisbursements([newDisb, ...disbursements]);
    setActionMessage(`Solicitação ${newDisb.id} criada pelo Maker (${currentUser.name}) e aguardando aprovação do Checker!`);
    setErrorMessage(null);
  };

  const handleApprove = (disbursement: DisbursementRequest) => {
    const result = DisbursementsEngine.approveDisbursement(
      disbursement,
      currentUser.id,
      currentUser.name
    );

    if (!result.success) {
      setErrorMessage(result.error || 'Erro ao aprovar desembolso.');
      setActionMessage(null);
      return;
    }

    if (result.success && result.updatedDisbursement) {
      setDisbursements(
        disbursements.map((d) => (d.id === disbursement.id ? result.updatedDisbursement! : d))
      );
      setActionMessage(
        `Pagamento ${disbursement.id} (${disbursement.payeeName}) no valor de ${formatCurrency(
          disbursement.amount,
          'USD',
          locale
        )} aprovado com sucesso por ${currentUser.name} e liberado para lote NACHA ACH!`
      );
      setErrorMessage(null);
    }
  };

  const handleReject = (disbursement: DisbursementRequest) => {
    setDisbursements(
      disbursements.map((d) => (d.id === disbursement.id ? { ...d, status: 'REJECTED' } : d))
    );
    setActionMessage(`Pagamento ${disbursement.id} rejeitado pelo Checker (${currentUser.name}).`);
    setErrorMessage(null);
  };

  const handleToggleCardStatus = (cardId: string) => {
    setVirtualCards(
      virtualCards.map((c) =>
        c.id === cardId
          ? { ...c, status: c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' }
          : c
      )
    );
    setActionMessage(`Status do Cartão Virtual atualizado com sucesso!`);
  };

  const handleCardCreated = (newCard: VirtualCard) => {
    setVirtualCards([...virtualCards, newCard]);
    setActionMessage(`Cartão Virtual para ${newCard.cardholderName} emitido com sucesso!`);
  };

  const handleDownloadNacha = () => {
    const approvedList = disbursements.filter((d) => d.status === 'APPROVED');
    if (approvedList.length === 0) {
      setErrorMessage('Nenhum pagamento aprovado disponível para geração do lote NACHA.');
      return;
    }
    const nachaText = DisbursementsEngine.generateNachaFile(approvedList);
    const blob = new Blob([nachaText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NACHA_ACH_BATCH_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setActionMessage(
      `Arquivo NACHA ACH de lote bancário gerado com sucesso contendo ${approvedList.length} pagamentos aprovados!`
    );
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Dual Control Switcher */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Controle Dual de Desembolsos Bancários (Segregation of Duties / SOX Compliance)
            </span>
            <span className="text-[11px] text-slate-400">
              Usuário Atual em Sessão: <strong className="text-emerald-400">{currentUser.name}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400">Alternar Perfil:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              if (e.target.value === 'user-accountant-01') {
                setCurrentUser({
                  id: 'user-accountant-01',
                  name: 'David Silva (Staff Accountant / Maker)',
                  role: 'MAKER',
                });
              } else {
                setCurrentUser({
                  id: 'user-cfo-02',
                  name: 'Victoria Sterling (CFO / Checker)',
                  role: 'CHECKER',
                });
              }
              setErrorMessage(null);
              setActionMessage(null);
            }}
            className="h-8 rounded bg-slate-950 border border-slate-700 px-2 text-xs text-white font-medium"
          >
            <option value="user-cfo-02">Victoria Sterling (CFO / Checker — Pode Aprovar)</option>
            <option value="user-accountant-01">David Silva (Staff Accountant / Maker — Cria)</option>
          </select>
        </div>
      </div>

      {/* Alerts */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setActionMessage(null)}>
            Fechar
          </Button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-600 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setErrorMessage(null)}>
            Fechar
          </Button>
        </div>
      )}

      {/* Main Disbursements Table */}
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Fila de Pagamentos & Desembolsos (Maker-Checker Queue)</CardTitle>
                <CardDescription>
                  Autorização de Transferências ACH, Wire e Lotes NACHA com Dupla Validação
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40"
                onClick={handleDownloadNacha}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Baixar Lote NACHA ACH (.txt)
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                onClick={() => setIsDisbursementModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                + Nova Solicitação (Maker)
              </Button>
            </div>
          </div>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">ID</TableHead>
              <TableHead>Favorecido & Conta</TableHead>
              <TableHead className="text-right w-28">Valor</TableHead>
              <TableHead className="w-24">Tipo</TableHead>
              <TableHead>Iniciado por (Maker)</TableHead>
              <TableHead className="w-32 text-center">Status</TableHead>
              <TableHead className="w-48 text-center">Ações Dual Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disbursements.map((d) => (
              <TableRow key={d.id} className="hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-emerald-400 text-xs">
                  {d.id}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-white text-xs">{d.payeeName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Routing: {d.payeeRoutingNumber} • Account: ••••{d.payeeAccountNumber.slice(-4)}
                  </div>
                  <div className="text-[10px] text-slate-500">{d.memo}</div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-white text-xs">
                  {formatCurrency(d.amount, 'USD', locale)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px]">
                    {d.paymentType}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  <div>{d.createdByMakerName}</div>
                  <div className="text-[10px] text-slate-500">{formatDate(d.createdAt, locale)}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      d.status === 'APPROVED'
                        ? 'success'
                        : d.status === 'REJECTED'
                        ? 'danger'
                        : 'warning'
                    }
                    className="text-[10px]"
                  >
                    {d.status === 'APPROVED'
                      ? '✓ Aprovado (Checker)'
                      : d.status === 'REJECTED'
                      ? '✕ Rejeitado'
                      : '⏳ Pendente de Aprovação'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {d.status === 'PENDING_APPROVAL' ? (
                    <div className="flex items-center justify-center space-x-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        className="h-7 text-[11px] px-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold"
                        onClick={() => handleApprove(d)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] px-2 text-rose-400 border-rose-800/60 hover:bg-rose-950/40"
                        onClick={() => handleReject(d)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400">
                      {d.status === 'APPROVED' && d.approvedByCheckerName
                        ? `Aprovado por: ${d.approvedByCheckerName}`
                        : 'Processado'}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Corporate Virtual Cards */}
      <Card className="border-slate-800 bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Cartões Corporativos Virtuais (Virtual Cards Management)</CardTitle>
                <CardDescription>
                  Limites Dinâmicos, Bloqueio Instantâneo e Controles de Gastos por Colaborador
                </CardDescription>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setIsVirtualCardModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Emitir Cartão Virtual
            </Button>
          </div>
        </CardHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {virtualCards.map((card) => {
            const usagePercent = Math.min(100, Math.round((card.currentSpendMonth / card.monthlySpendLimit) * 100));
            return (
              <div
                key={card.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm block">{card.cardholderName}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{card.purpose}</span>
                  </div>
                  <Badge variant={card.status === 'ACTIVE' ? 'success' : 'warning'} className="text-[10px]">
                    {card.status === 'ACTIVE' ? 'Ativo' : 'Congelado (Frozen)'}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between font-mono">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>•••• •••• •••• {card.last4}</span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400">Gasto no Mês: </span>
                    <span className="font-bold text-white">{formatCurrency(card.currentSpendMonth, 'USD', locale)}</span>
                    <span className="text-slate-500"> / {formatCurrency(card.monthlySpendLimit, 'USD', locale)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <span className="text-[10px] text-slate-500">{usagePercent}% do limite mensal utilizado</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] px-2 text-amber-400 hover:text-amber-300"
                    onClick={() => handleToggleCardStatus(card.id)}
                  >
                    {card.status === 'ACTIVE' ? 'Congelar Cartão' : 'Descongelar Cartão'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal: Nova Solicitação de Desembolso */}
      <NewDisbursementModal
        isOpen={isDisbursementModalOpen}
        onClose={() => setIsDisbursementModalOpen(false)}
        onDisbursementCreated={handleCreateDisbursement}
        currentMakerName={currentUser.name}
        currentMakerId={currentUser.id}
      />

      {/* Modal: Novo Cartão Virtual */}
      <NewVirtualCardModal
        isOpen={isVirtualCardModalOpen}
        onClose={() => setIsVirtualCardModalOpen(false)}
        onCardCreated={handleCardCreated}
      />
    </div>
  );
}
