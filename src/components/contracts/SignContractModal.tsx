'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  ServiceContractAgreement,
  ContractEsignEngine,
} from '@/lib/contracts/contract-esign-engine';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  FileSignature,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Scale,
} from 'lucide-react';

interface SignContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ServiceContractAgreement | null;
  onSigned: (signedContract: ServiceContractAgreement) => void;
}

export function SignContractModal({
  isOpen,
  onClose,
  contract,
  onSigned,
}: SignContractModalProps) {
  const { locale } = useI18n();

  const [signerName, setSignerName] = useState('Marcus Vance');
  const [signerTitle, setSignerTitle] = useState('Managing Director / Authorized Representative');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !contract) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms || !signerName) return;

    setIsProcessing(true);

    setTimeout(() => {
      const signed = ContractEsignEngine.executeDigitalSignature(
        contract,
        `${signerName} (${signerTitle})`
      );
      setIsProcessing(false);
      onSigned(signed);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileSignature className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Assinatura Digital de Acordo de Serviços (e-Sign)</h3>
              <p className="text-[10px] text-slate-400">
                Contrato #{contract.id} • {contract.clientName} • Valor: {formatCurrency(contract.totalValue, 'USD', locale)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Content */}
        <form onSubmit={handleSign} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Agreement Summary Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-white text-sm">{contract.contractTitle}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Contratante: <strong>{contract.clientName}</strong> ({contract.clientContactEmail})
                </span>
              </div>
              <Badge variant="info" className="text-[9px]">
                {contract.contractType.replace(/_/g, ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-400 block">Vigência do Contrato:</span>
                <span className="text-slate-200 font-mono">
                  {formatDate(contract.effectiveDate, locale)} até {formatDate(contract.expirationDate, locale)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Valor Total do Acordo:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {formatCurrency(contract.totalValue, 'USD', locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Clauses Preview */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 space-y-2 text-[11px] text-slate-300 max-h-36 overflow-y-auto font-mono">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Termos Jurídicos do Acordo:</p>
            <p>1. O PRESTADOR concorda em fornecer serviços especializados em conformidade com as diretrizes acordadas no presente Statement of Work (SOW).</p>
            <p>2. Os pagamentos serão faturados conforme o cronograma (NET 30) e liquidados via transferência eletrônica ACH / Cartão.</p>
            <p>3. Este documento é executado eletronicamente em plena conformidade com o Federal Electronic Signatures in Global and National Commerce Act (ESIGN Act, 15 U.S.C. § 7001).</p>
          </div>

          {/* Electronic Signature Fields */}
          <div className="p-4 rounded-xl bg-slate-900 border border-sky-500/30 space-y-3">
            <span className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Firma Eletrônica Legal & Certificado Digital SHA-256
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Nome Completo do Signatário:</label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium font-serif italic text-sm"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cargo / Função Oficial:</label>
                <input
                  type="text"
                  required
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full h-8 rounded bg-slate-950 border border-slate-800 px-2 text-white font-medium"
                />
              </div>
            </div>

            <label className="flex items-center space-x-2 text-slate-300 pt-1">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-sky-500"
              />
              <span>Declaro que li e concordo com todos os termos e que minha firma tem plena validade jurídica.</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit IP: 198.51.100.42 • SHA-256 Sealed</span>
            </div>

            <div className="flex space-x-2">
              <Button type="button" size="sm" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isProcessing}
                className="bg-sky-600 hover:bg-sky-500 font-bold"
              >
                {isProcessing ? 'Assinando...' : 'Assinar & Selar Digitalmente (e-Sign)'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
