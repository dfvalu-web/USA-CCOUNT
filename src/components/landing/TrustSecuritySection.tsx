'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Landmark,
  FileCheck2,
  Fingerprint,
  CheckCircle2,
  Server,
  Award,
} from 'lucide-react';

export function TrustSecuritySection() {
  const securityPillars = [
    {
      icon: ShieldCheck,
      title: 'Conformidade US GAAP & FASB',
      description: 'Todos os cálculos contábeis obedecem rigorosamente às normas ASC 205, 210, 230 e 606 para partidas dobradas e reconhecimento de receita.',
    },
    {
      icon: Landmark,
      title: 'Padrão Oficial IRS MeF XML',
      description: 'Estruturação pronta para entrega eletrônica do Form 1065, Schedules K-1 dos sócios, 1099-NEC para prestadores e W-2 para funcionários.',
    },
    {
      icon: Fingerprint,
      title: 'Trilha de Auditoria SOC 2 Merkle',
      description: 'Cada lançamento contábil recebe um hash SHA-256 encadeado com registro indelével de data, hora, IP e usuário para blindagem jurídica.',
    },
    {
      icon: Lock,
      title: 'Criptografia Bancária TLS 256-Bit',
      description: 'Proteção máxima para dados sensíveis, extratos bancários de bancos parceiros (Truist, Chase) e números fiscais (EIN / SSN).',
    },
  ];

  return (
    <section id="seguranca" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Segurança Institucional & Auditoria</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            Blindagem Jurídica & Integridade de Dados
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Construído para suportar auditorias forenses e atender às mais rígidas exigências de órgãos fiscais federais e estaduais dos EUA.
          </p>
        </div>

        {/* Security Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-xl backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white font-serif">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* Banner with CPA & Legal Quote */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-serif">
              Precisa resolver pendências de anos anteriores (2022 a 2025)?
            </h4>
            <p className="text-xs text-slate-300">
              O sistema reconstrói o Livro Diário e Livro Razão de múltiplos exercícios fiscais instantaneamente com prova de $0.00 de variância.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
              Audit-Proof
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
