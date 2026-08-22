'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  YearEndTaxEngine,
  Form1099NecRecord,
  FormW2Record,
  FormW3TransmittalSummary,
} from '@/lib/tax/year-end-tax-engine';
import { Form1099NecDetailModal } from './Form1099NecDetailModal';
import { FormW2DetailModal } from './FormW2DetailModal';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Printer,
  Sparkles,
  Eye,
  ShieldCheck,
  Send,
  Building2,
} from 'lucide-react';

import { useFiscalPeriod } from '@/lib/period/fiscal-period-context';
import { useCompany } from '@/lib/company/company-context';

export function YearEndTaxFormsView() {
  const { locale, t } = useI18n();
  const { activeCompany } = useCompany();
  const { fiscalYear } = useFiscalPeriod();

  const [activeTab, setActiveTab] = useState<'1099-NEC' | 'W-2' | 'W-3'>('1099-NEC');
  const [records1099, setRecords1099] = useState<Form1099NecRecord[]>(YearEndTaxEngine.INITIAL_1099_NEC);
  const [recordsW2, setRecordsW2] = useState<FormW2Record[]>(YearEndTaxEngine.INITIAL_W2);

  const [selected1099, setSelected1099] = useState<Form1099NecRecord | null>(null);
  const [selectedW2, setSelectedW2] = useState<FormW2Record | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const w3Summary: FormW3TransmittalSummary = YearEndTaxEngine.generateW3Transmittal(recordsW2, fiscalYear);

  const handleDownloadIrsFire = () => {
    const fileContent = YearEndTaxEngine.generateIrsFireElectronicFile(records1099);
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IRS_FIRE_1099NEC_TRANSMISSION_${fiscalYear}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotificationMsg(`Arquivo eletrônico oficial do IRS FIRE para o Exercício ${fiscalYear} gerado e baixado com sucesso!`);
  };

  const total1099Compensation = records1099.reduce((acc, r) => acc + r.box1NonemployeeCompensation, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Fechamento Fiscal de Fim de Ano — {activeCompany?.legalName}
              <Badge variant="warning" className="text-[10px]">
                Ano Fiscal {fiscalYear}
              </Badge>
            </h3>
            <p className="text-xs text-slate-400">
              Geração em lote de Forms 1099-NEC, W-2, W-3 e arquivos eletrônicos de transmissão para o IRS FIRE & SSA • EIN: {activeCompany?.ein}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="text-xs" onClick={handleDownloadIrsFire}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Download IRS FIRE (.TXT)
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

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs w-fit">
        <button
          onClick={() => setActiveTab('1099-NEC')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === '1099-NEC' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Form 1099-NEC (Prestadores 1099)
        </button>
        <button
          onClick={() => setActiveTab('W-2')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'W-2' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Form W-2 (Colaboradores W-2)
        </button>
        <button
          onClick={() => setActiveTab('W-3')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'W-3' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Form W-3 (Transmittal Consolidado SSA)
        </button>
      </div>

      {/* TAB 1: 1099-NEC */}
      {activeTab === '1099-NEC' && (
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Form 1099-NEC — Prestadores de Serviços Autônomos (≥ $600/ano)</CardTitle>
                <CardDescription>
                  Total de Remuneração Autônoma: {formatCurrency(total1099Compensation, 'USD', locale)}
                </CardDescription>
              </div>
              <Badge variant="success" className="text-[10px]">
                {records1099.length} Formulários Prontos
              </Badge>
            </div>
          </CardHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Prestador & TIN/SSN</TableHead>
                <TableHead className="w-28">Estado</TableHead>
                <TableHead className="text-right w-36">Box 1: Remuneração</TableHead>
                <TableHead className="text-right w-32">Retenção Estadual</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
                <TableHead className="w-32 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records1099.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-900/50">
                  <TableCell className="font-mono text-amber-400 text-xs font-bold">{r.id}</TableCell>
                  <TableCell>
                    <div className="font-bold text-white text-xs">{r.recipientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">TIN: {r.recipientTaxId}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300 font-bold">{r.state}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-400 text-xs">
                    {formatCurrency(r.box1NonemployeeCompensation, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-300 text-xs">
                    {formatCurrency(r.box5StateTaxWithheld, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success" className="text-[10px]">
                      ✓ Pronto p/ Envio
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2 text-amber-400 hover:text-amber-300"
                      onClick={() => setSelected1099(r)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 2: W-2 */}
      {activeTab === 'W-2' && (
        <Card className="border-slate-800 bg-slate-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Form W-2 — Salários e Retenções de Colaboradores</CardTitle>
                <CardDescription>Demonstrativo anual para Social Security Administration e IRS</CardDescription>
              </div>
              <Badge variant="info" className="text-[10px]">
                {recordsW2.length} Colaboradores W-2
              </Badge>
            </div>
          </CardHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Colaborador & SSN</TableHead>
                <TableHead className="text-right w-32">Box 1: Salários</TableHead>
                <TableHead className="text-right w-32">Box 2: Fed Tax</TableHead>
                <TableHead className="text-right w-32">Box 4: Social Security</TableHead>
                <TableHead className="text-right w-32">Box 6: Medicare</TableHead>
                <TableHead className="w-32 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordsW2.map((w) => (
                <TableRow key={w.id} className="hover:bg-slate-900/50">
                  <TableCell className="font-mono text-sky-400 text-xs font-bold">{w.id}</TableCell>
                  <TableCell>
                    <div className="font-bold text-white text-xs">{w.employeeName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SSN: {w.ssn}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-white text-xs">
                    {formatCurrency(w.box1WagesTips, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-rose-400 text-xs">
                    {formatCurrency(w.box2FederalIncomeTaxWithheld, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-300 text-xs">
                    {formatCurrency(w.box4SocialSecurityTaxWithheld, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-300 text-xs">
                    {formatCurrency(w.box6MedicareTaxWithheld, 'USD', locale)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2 text-sky-400 hover:text-sky-300"
                      onClick={() => setSelectedW2(w)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* TAB 3: W-3 Transmittal */}
      {activeTab === 'W-3' && (
        <Card className="border-slate-800 bg-slate-950 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-base font-bold text-white">Form W-3 — Transmittal of Wage and Tax Statements</h4>
              <p className="text-xs text-slate-400">Resumo consolidado para transmissão à Social Security Administration (SSA)</p>
            </div>
            <Badge variant="success">Número de Controle: {w3Summary.controlNumber}</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total W-2s Transmitidos</span>
              <span className="text-xl font-bold text-white block mt-1">{w3Summary.totalW2FormsCount}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Box 1: Wages</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">
                {formatCurrency(w3Summary.totalBox1Wages, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Box 2: Federal Tax</span>
              <span className="text-xl font-bold text-rose-400 block mt-1">
                {formatCurrency(w3Summary.totalBox2FederalTax, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Social Security Wages</span>
              <span className="text-base font-bold text-white block mt-1">
                {formatCurrency(w3Summary.totalBox3SocialSecurityWages, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Social Security Tax</span>
              <span className="text-base font-bold text-slate-300 block mt-1">
                {formatCurrency(w3Summary.totalBox4SocialSecurityTax, 'USD', locale)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Medicare Tax</span>
              <span className="text-base font-bold text-slate-300 block mt-1">
                {formatCurrency(w3Summary.totalBox6MedicareTax, 'USD', locale)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Modal 1099-NEC */}
      <Form1099NecDetailModal
        isOpen={!!selected1099}
        onClose={() => setSelected1099(null)}
        record={selected1099}
      />

      {/* Modal W-2 */}
      <FormW2DetailModal
        isOpen={!!selectedW2}
        onClose={() => setSelectedW2(null)}
        record={selectedW2}
      />
    </div>
  );
}
