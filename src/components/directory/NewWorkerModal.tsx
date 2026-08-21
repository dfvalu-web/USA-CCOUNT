'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  WorkerEntity,
  WorkerClassification,
  EntityDirectoryEngine,
} from '@/lib/directory/entity-directory-engine';
import { US_STATES_LIST } from '@/lib/company/company-profile-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  UserPlus,
  Briefcase,
  FileText,
  Building2,
  HeartPulse,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Landmark,
} from 'lucide-react';

interface NewWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerCreated: (worker: WorkerEntity) => void;
}

export function NewWorkerModal({ isOpen, onClose, onWorkerCreated }: NewWorkerModalProps) {
  const { locale, t } = useI18n();

  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'tax-w4w9' | 'banking' | 'benefits'>('personal');

  // Personal Info
  const [legalName, setLegalName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssnRaw, setSsnRaw] = useState('');
  const [dob, setDob] = useState('1992-05-14');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('TX');
  const [zipCode, setZipCode] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Employment
  const [classification, setClassification] = useState<WorkerClassification>('W2_FULL_TIME');
  const [roleTitle, setRoleTitle] = useState('Especialista de Limpeza Comercial & Janitorial');
  const [department, setDepartment] = useState<'CLEANING_FIELD_CREW' | 'OPERATIONS' | 'MANAGEMENT' | 'ENGINEERING'>('CLEANING_FIELD_CREW');
  const [payModel, setPayModel] = useState<'HOURLY' | 'PER_JOB_FLAT' | 'ANNUAL_SALARY'>('HOURLY');
  const [basePayRate, setBasePayRate] = useState<number>(24.0);
  const [workState, setWorkState] = useState('TX');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);

  // Tax W-4 / W-9
  const [w4FilingStatus, setW4FilingStatus] = useState<'SINGLE' | 'MARRIED_FILING_JOINTLY' | 'HEAD_OF_HOUSEHOLD'>('SINGLE');
  const [w4MultipleJobs, setW4MultipleJobs] = useState(false);
  const [w4DependentsClaim, setW4DependentsClaim] = useState<number>(0);
  const [w4ExtraWithholding, setW4ExtraWithholding] = useState<number>(0);
  const [isTaxExempt, setIsTaxExempt] = useState(false);

  // W-9 (for 1099)
  const [w9BusinessName, setW9BusinessName] = useState('');
  const [w9TaxClass, setW9TaxClass] = useState('INDIVIDUAL_SOLE_PROPRIETOR');
  const [w9BackupWithholding, setW9BackupWithholding] = useState(false);

  // Direct Deposit Banking
  const [bankName, setBankName] = useState('Chase Bank NA');
  const [routingNumber, setRoutingNumber] = useState('111000025');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'CHECKING' | 'SAVINGS'>('CHECKING');

  // Benefits
  const [preTax401kPercent, setPreTax401kPercent] = useState<number>(4);
  const [healthInsuranceDeduction, setHealthInsuranceDeduction] = useState<number>(120);

  if (!isOpen) return null;

  const isW2 = classification.startsWith('W2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName || !email) return;

    const rawLast4 = ssnRaw.replace(/\D/g, '').slice(-4) || '0000';
    const ssnMasked = `•••-••-${rawLast4}`;

    const newWorker = EntityDirectoryEngine.createWorker({
      legalName,
      preferredName: preferredName || undefined,
      email,
      phone: phone || '(555) 000-0000',
      ssnOrTinMasked: ssnMasked,
      classification,
      roleTitle,
      department,
      payModel,
      basePayRate,
      workState,
      hireDate,
      bankRoutingNumberMasked: routingNumber ? `••••${routingNumber.slice(-4)}` : undefined,
      bankAccountNumberMasked: accountNumber ? `••••${accountNumber.slice(-4)}` : undefined,
      emergencyContactName: emergencyName || 'Not Provided',
      emergencyContactPhone: emergencyPhone || 'Not Provided',
      status: 'ACTIVE',
    });

    onWorkerCreated(newWorker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Cadastro Completo de Colaborador (W-2 & 1099 - Legislação Americana)
              </h3>
              <p className="text-[10px] text-slate-400">
                Conformidade IRS Form W-4, W-9, Depósito Direto ACH e Retenções Estaduais (SIT)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/60 flex space-x-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'personal', label: '1. Dados Pessoais & Endereço', icon: MapPin },
            { id: 'employment', label: '2. Cargo & Remuneração', icon: Briefcase },
            { id: 'tax-w4w9', label: isW2 ? '3. Retenções IRS W-4' : '3. Certificação W-9', icon: FileText },
            { id: 'banking', label: '4. Depósito Direto ACH', icon: Landmark },
            { id: 'benefits', label: '5. Benefícios & 401(k)', icon: HeartPulse },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1.5 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Tab 1: Dados Pessoais */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Nome Legal Completo (Legal Full Name):</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Eduarda Santos"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Nome de Preferência / Apelido:</label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Santos"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">E-mail Pessoal / Profissional:</label>
                  <input
                    type="email"
                    required
                    placeholder="maria.santos@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Telefone / Mobile:</label>
                  <input
                    type="text"
                    required
                    placeholder="(512) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Social Security Number (SSN / ITIN):</label>
                  <input
                    type="text"
                    placeholder="XXX-XX-XXXX"
                    value={ssnRaw}
                    onChange={(e) => setSsnRaw(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="font-bold text-slate-300 uppercase text-[11px] block">Endereço Residencial:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-slate-400 block mb-1">Rua / Apto:</label>
                    <input
                      type="text"
                      placeholder="Ex: 1205 S Lamar Blvd, Apt 304"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cidade:</label>
                    <input
                      type="text"
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Estado (US State):</label>
                    <select
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                    >
                      {US_STATES_LIST.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">ZIP Code:</label>
                    <input
                      type="text"
                      placeholder="78704"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Contato de Emergência (Nome & Parentesco):</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Gomez (Esposo)"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefone de Emergência:</label>
                  <input
                    type="text"
                    placeholder="(512) 555-0144"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cargo e Remuneração */}
          {activeTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Vínculo Trabalhista:</label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="W2_FULL_TIME">W-2 Full-Time (CLT 40h/sem)</option>
                    <option value="W2_PART_TIME">W-2 Part-Time (CLT Parcial)</option>
                    <option value="1099_CONTRACTOR">1099 Independent Contractor (PJ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Departamento:</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="CLEANING_FIELD_CREW">Equipe Operacional de Campo (Cleaning Crew)</option>
                    <option value="OPERATIONS">Supervisão & Despacho de Operações</option>
                    <option value="MANAGEMENT">Administração & Gestão</option>
                    <option value="ENGINEERING">Engenharia & Tecnologia</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Estado de Trabalho (SIT Nexus):</label>
                  <select
                    value={workState}
                    onChange={(e) => setWorkState(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  >
                    {US_STATES_LIST.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Cargo / Título da Função:</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Modelo de Remuneração:</label>
                  <select
                    value={payModel}
                    onChange={(e) => setPayModel(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="HOURLY">Por Hora (\$ / hr)</option>
                    <option value="PER_JOB_FLAT">Valor Fixo por Trabalho / Diária</option>
                    <option value="ANNUAL_SALARY">Salário Fixo Anual</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">
                    Valor da Remuneração ({payModel === 'HOURLY' ? '$/hora' : payModel === 'ANNUAL_SALARY' ? '$/ano' : '$/serviço'}):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={basePayRate}
                    onChange={(e) => setBasePayRate(parseFloat(e.target.value) || 0)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Data de Admissão / Início:</label>
                  <input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Retenções IRS W-4 / W-9 */}
          {activeTab === 'tax-w4w9' && (
            <div className="space-y-4 animate-in fade-in">
              {isW2 ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      IRS Form W-4 (Employee's Withholding Certificate)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Determina a retenção do Imposto de Renda Federal (Federal Income Tax - FIT) na folha de pagamento.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Filing Status (Step 1c):</label>
                      <select
                        value={w4FilingStatus}
                        onChange={(e) => setW4FilingStatus(e.target.value as any)}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                      >
                        <option value="SINGLE">Single or Married Filing Separately</option>
                        <option value="MARRIED_FILING_JOINTLY">Married Filing Jointly</option>
                        <option value="HEAD_OF_HOUSEHOLD">Head of Household</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Dependentes (\$2,000 por filho - Step 3):</label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        placeholder="Ex: 2000"
                        value={w4DependentsClaim}
                        onChange={(e) => setW4DependentsClaim(parseFloat(e.target.value) || 0)}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={w4MultipleJobs}
                        onChange={(e) => setW4MultipleJobs(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                      />
                      <span>Múltiplos Empregos ou Cônjuge Também Trabalha (Step 2c)</span>
                    </label>

                    <label className="flex items-center space-x-2 text-slate-300">
                      <input
                        type="checkbox"
                        checked={isTaxExempt}
                        onChange={(e) => setIsTaxExempt(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                      />
                      <span>Isento de Retenção Federal (IRC § 3402(n) - Sem obrigações fiscais no ano anterior)</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      IRS Form W-9 (Request for Taxpayer Identification Number)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Classificação fiscal para emissão anual do Form 1099-NEC (Nonemployee Compensation).
                    </p>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Nome Comercial / Business Name / DBA:</label>
                    <input
                      type="text"
                      placeholder="Ex: Gomez Cleaning & Maintenance LLC"
                      value={w9BusinessName}
                      onChange={(e) => setW9BusinessName(e.target.value)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Classificação Tributária:</label>
                      <select
                        value={w9TaxClass}
                        onChange={(e) => setW9TaxClass(e.target.value)}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                      >
                        <option value="INDIVIDUAL_SOLE_PROPRIETOR">Individual / Sole Proprietor</option>
                        <option value="LLC_SINGLE_MEMBER">Single-Member LLC (Disregarded)</option>
                        <option value="PARTNERSHIP">Partnership / Multi-Member LLC</option>
                        <option value="C_CORP">C Corporation</option>
                        <option value="S_CORP">S Corporation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Backup Withholding 24%:</label>
                      <select
                        value={w9BackupWithholding ? 'YES' : 'NO'}
                        onChange={(e) => setW9BackupWithholding(e.target.value === 'YES')}
                        className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                      >
                        <option value="NO">Isento / TIN Certificado (Normal)</option>
                        <option value="YES">Sujeito a Retenção de 24%</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Direct Deposit ACH */}
          {activeTab === 'banking' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  Autorização de Depósito Direto (Direct Deposit ACH Authorization)
                </span>
                <p className="text-slate-400">
                  Os pagamentos quinzenais serão liquidados diretamente na conta corrente do colaborador via NACHA ACH.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Instituição Bancária (Bank Name):</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tipo de Conta:</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white"
                  >
                    <option value="CHECKING">Conta Corrente (Checking Account)</option>
                    <option value="SAVINGS">Conta Poupança (Savings Account)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Routing Transit Number (9 dígitos ABA):</label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Número da Conta (Account Number):</label>
                  <input
                    type="text"
                    required
                    placeholder="9876543210"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Benefícios Pré-Tax & 401(k) */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">Plano de Aposentadoria 401(k):</span>
                  <label className="text-[11px] text-slate-400 block">Dedução Pré-Tax do Funcionário (% do Salário):</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="1"
                    value={preTax401kPercent}
                    onChange={(e) => setPreTax401kPercent(parseFloat(e.target.value) || 0)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">Seguro de Saúde & Odontológico (Section 125):</span>
                  <label className="text-[11px] text-slate-400 block">Dedução por Folha Quinzenal (\$):</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={healthInsuranceDeduction}
                    onChange={(e) => setHealthInsuranceDeduction(parseFloat(e.target.value) || 0)}
                    className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-sky-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <div className="text-[11px] text-slate-400">
              {isW2 ? 'Vínculo: W-2 Employee (Com retenções automáticas)' : 'Vínculo: 1099 Contractor (Sem retenção na fonte)'}
            </div>
            <div className="flex space-x-2">
              <Button type="button" size="sm" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Salvar Cadastro do Colaborador
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
