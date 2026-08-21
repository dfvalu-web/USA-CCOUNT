'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  OfficerMemberProfile,
  PartnerMemberType,
  PartnerTaxClassification,
  CompanyProfileEngine,
  US_STATES_LIST,
} from '@/lib/company/company-profile-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  X,
  Users2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Globe,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

interface NewPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartnerCreated: (partner: OfficerMemberProfile) => void;
  companyName: string;
  isPartnershipOrLLC: boolean;
}

export function NewPartnerModal({
  isOpen,
  onClose,
  onPartnerCreated,
  companyName,
  isPartnershipOrLLC,
}: NewPartnerModalProps) {
  const { locale, t } = useI18n();

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('Managing Member');
  const [memberType, setMemberType] = useState<PartnerMemberType>(
    isPartnershipOrLLC ? 'MANAGING_MEMBER' : 'SHAREHOLDER_OWNER'
  );
  const [taxClassification, setTaxClassification] = useState<PartnerTaxClassification>('US_CITIZEN_OR_RESIDENT');
  const [ssnOrItinRaw, setSsnOrItinRaw] = useState('');

  // Residential Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('TX');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');

  // Equity & Capital Account (IRC 704(b))
  const [ownershipPercentage, setOwnershipPercentage] = useState<number>(50);
  const [profitSharingPercentage, setProfitSharingPercentage] = useState<number>(50);
  const [lossSharingPercentage, setLossSharingPercentage] = useState<number>(50);
  const [initialCapitalContribution, setInitialCapitalContribution] = useState<number>(25000);
  const [guaranteedPaymentsAnnual, setGuaranteedPaymentsAnnual] = useState<number>(0);

  // Compliance Flags
  const [isTaxMattersPartner, setIsTaxMattersPartner] = useState(false);
  const [isMaterialParticipant, setIsMaterialParticipant] = useState(true);
  const [receivesW2Salary, setReceivesW2Salary] = useState(false);
  const [w2SalaryAnnual, setW2SalaryAnnual] = useState<number>(0);
  const [hasW8BenOnFile, setHasW8BenOnFile] = useState(false);

  if (!isOpen) return null;

  const isForeign =
    taxClassification === 'FOREIGN_NATIONAL_NRA' || taxClassification === 'FOREIGN_CORPORATION_ENTITY';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    const newPartner = CompanyProfileEngine.createOfficerOrPartner({
      fullName,
      title,
      memberType,
      taxClassification,
      ssnOrItinRaw,
      residentialAddress: {
        street,
        city,
        state: stateCode,
        zipCode,
        country,
      },
      ownershipPercentage,
      profitSharingPercentage,
      lossSharingPercentage,
      beginningCapitalAccount: initialCapitalContribution,
      capitalContributedYear: initialCapitalContribution,
      currentYearDistributions: 0,
      endingCapitalAccount: initialCapitalContribution,
      guaranteedPaymentsYear: guaranteedPaymentsAnnual,
      isTaxMattersPartner,
      isMaterialParticipant,
      receivesW2Salary,
      w2SalaryAnnual: receivesW2Salary ? w2SalaryAnnual : undefined,
      k1DistributionRatio: ownershipPercentage / 100,
      foreignWithholdingRate: isForeign ? 0.37 : undefined,
      hasW8BenOnFile: isForeign ? hasW8BenOnFile : undefined,
    });

    onPartnerCreated(newPartner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Cadastrar Novo Sócio / Membro do Quadro Societário (US Law)
              </h3>
              <p className="text-[10px] text-slate-400">
                Empresa: {companyName} • Enquadramento IRS Form 1065 / 1120-S / 1120 K-1
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto text-xs">
          {/* Section 1: Member Identification & US Legal Role */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> 1. Qualificação Jurídica & Identificação
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Nome Legal Completo (Pessoa ou Entidade):</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alexander J. Hamilton"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Cargo / Título Oficial:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Managing Member / Chief Executive Officer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Tipo de Participação Societária:</label>
                <select
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value as any)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white text-[11px]"
                >
                  <option value="MANAGING_MEMBER">Managing Member (LLC Administrador)</option>
                  <option value="NON_MANAGING_MEMBER">Non-Managing Member (Sócio Cotista LLC)</option>
                  <option value="GENERAL_PARTNER_GP">General Partner GP (Sócio Ilimitado)</option>
                  <option value="LIMITED_PARTNER_LP">Limited Partner LP (Sócio Comanditário)</option>
                  <option value="SHAREHOLDER_OWNER">Shareholder (Acionista S-Corp / C-Corp)</option>
                  <option value="CORPORATE_OFFICER_DIRECTOR">Corporate Officer / Diretor (Form 1120 Sch E)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Status de Residência Fiscal IRS:</label>
                <select
                  value={taxClassification}
                  onChange={(e) => setTaxClassification(e.target.value as any)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white text-[11px]"
                >
                  <option value="US_CITIZEN_OR_RESIDENT">US Citizen / Green Card / Resident (W-9)</option>
                  <option value="FOREIGN_NATIONAL_NRA">Estrangeiro Não-Residente (NRA / W-8BEN)</option>
                  <option value="FOREIGN_CORPORATION_ENTITY">Entidade Estrangeira (W-8BEN-E)</option>
                  <option value="DOMESTIC_ENTITY_PARTNER">Pessoa Jurídica Americana (LLC/Corp)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">SSN / ITIN / EIN:</label>
                <input
                  type="text"
                  placeholder="XXX-XX-XXXX"
                  value={ssnOrItinRaw}
                  onChange={(e) => setSsnOrItinRaw(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Residential Address */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> 2. Endereço Residencial do Sócio (IRS Reporting)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-slate-400 block mb-1">Rua / Logradouro e Número/Apto:</label>
                <input
                  type="text"
                  placeholder="Ex: 401 Congress Ave, Suite 1200"
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

            <div className="grid grid-cols-3 gap-3">
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
                <label className="text-slate-400 block mb-1">ZIP / Código Postal:</label>
                <input
                  type="text"
                  placeholder="78701"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">País:</label>
                <input
                  type="text"
                  placeholder="USA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Equity, Profit Share & Capital Accounts (IRC 704(b)) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> 3. Participação no Capital & Contas de Capital (IRC § 704(b))
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">% Capital (Equity):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={ownershipPercentage}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setOwnershipPercentage(val);
                    setProfitSharingPercentage(val);
                    setLossSharingPercentage(val);
                  }}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">% Lucros (Profit):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={profitSharingPercentage}
                  onChange={(e) => setProfitSharingPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">% Perdas (Loss):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={lossSharingPercentage}
                  onChange={(e) => setLossSharingPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Aporte Inicial de Capital (\$):</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={initialCapitalContribution}
                  onChange={(e) => setInitialCapitalContribution(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>

            {/* Guaranteed Payments & Reasonable Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-slate-400 block mb-1">
                  Pagamentos Garantidos ao Sócio Anuais (IRC § 707(c)):
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={guaranteedPaymentsAnnual}
                  onChange={(e) => setGuaranteedPaymentsAnnual(parseFloat(e.target.value) || 0)}
                  className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono"
                  placeholder="0"
                />
                <span className="text-[10px] text-slate-500">
                  Dedutível pela sociedade no Form 1065 / Tributável no K-1 Box 4
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Salário W-2 do Sócio (S-Corp Reasonable Comp):
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center space-x-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={receivesW2Salary}
                      onChange={(e) => setReceivesW2Salary(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                    />
                    <span>Recebe salário W-2 na folha da empresa</span>
                  </label>
                  {receivesW2Salary && (
                    <input
                      type="number"
                      min="10000"
                      step="5000"
                      placeholder="Valor anual W-2 (ex: $90,000)"
                      value={w2SalaryAnnual}
                      onChange={(e) => setW2SalaryAnnual(parseFloat(e.target.value) || 0)}
                      className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-emerald-400 font-mono font-bold"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: IRS Tax Compliance & Foreign Withholding */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> 4. Representação IRS & Conformidade Tributária
            </h4>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 text-slate-200 font-medium">
                <input
                  type="checkbox"
                  checked={isTaxMattersPartner}
                  onChange={(e) => setIsTaxMattersPartner(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                />
                <span>Designar como Tax Matters Partner (TMP) / Partnership Representative perante o IRS</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={isMaterialParticipant}
                  onChange={(e) => setIsMaterialParticipant(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                />
                <span>Participação Material Ativa (IRC § 469 - Renda Ativa vs Passiva)</span>
              </label>

              {isForeign && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    Regra Especial para Sócio Estrangeiro (IRC § 1446 Withholding):
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A sociedade é obrigada a reter e recolher trimestralmente 37% (Pessoa Física NRA) ou 21% (Pessoa Jurídica) sobre o lucro distribuível efetivamente conectado (ECI).
                  </p>
                  <label className="flex items-center space-x-2 text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasW8BenOnFile}
                      onChange={(e) => setHasW8BenOnFile(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-500"
                    />
                    <span>Formulário IRS W-8BEN / W-8BEN-E assinado e arquivado</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <Button type="button" size="sm" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Salvar Cadastro do Sócio (US Law)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
