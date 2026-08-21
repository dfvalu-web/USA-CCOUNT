'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Landmark,
  Sparkles,
  Camera,
  Users2,
  FileSignature,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

export function FeatureGrid() {
  const features = [
    {
      icon: Scale,
      title: 'Livros Fiscais & Contabilidade US GAAP',
      tag: 'ASC 205 / 210 / 230',
      description: 'Livro Diário Geral, Livro Razão Analítico, Balancete de Verificação, Balanço Patrimonial e DRE com fechamento em partidas dobradas.',
      link: '/razao',
      accentColor: 'emerald',
    },
    {
      icon: Landmark,
      title: 'IRS Tax Suite & Fechamento Anual',
      tag: 'Form 1065 / K-1 / 1099',
      description: 'Geração do pacote CPA Tax Binder, Schedules K-1 dos sócios, emissão de 1099-NEC/W-2 e cálculo de State Franchise Taxes.',
      link: '/tax-compliance',
      accentColor: 'indigo',
    },
    {
      icon: Sparkles,
      title: 'CFA AI Copilot & Monte Carlo BI',
      tag: 'Inteligência Financeira',
      description: 'Análise de sensibilidade, projeção de fluxo de caixa por simulação de Monte Carlo e copiloto financeiro especialista em US GAAP.',
      link: '/reports',
      accentColor: 'sky',
    },
    {
      icon: Camera,
      title: 'Conciliação Bancária & OCR com IA',
      tag: 'Plaid & 3-Way Match',
      description: 'Importação automática de extratos bancários (Truist, Chase), OCR inteligente de recibos e pareamento contábil instantâneo.',
      link: '/bank-reconciliation',
      accentColor: 'teal',
    },
    {
      icon: Clock,
      title: 'Agendamento & Faturamento Recorrente',
      tag: 'Retainers & Invoicing',
      description: 'Controle de contratos com mensalidades fixas (retainers), apontamento de horas, despacho de equipes e faturas profissionais.',
      link: '/invoicing',
      accentColor: 'amber',
    },
    {
      icon: FileSignature,
      title: 'Portal do Cliente B2B & e-Sign de Contratos',
      tag: 'Segurança & Compliance',
      description: 'Área do cliente para pagamento de faturas, download de relatórios e assinatura digital de contratos com validade jurídica nos EUA.',
      link: '/client-portal',
      accentColor: 'rose',
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Módulos de Alta Tecnologia</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            Tudo que sua Empresa Precisa para Operar nos EUA
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Projetado especificamente para empresários, holdings e escritórios de contabilidade que exigem precisão absoluta perante a legislação americana.
          </p>
        </div>

        {/* 6 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;

            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 sm:p-8 space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/30 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-950 text-slate-400 px-2.5 py-1 rounded-full border border-slate-800">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors font-serif">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <Link
                    href={f.link}
                    className="text-xs font-bold text-slate-300 hover:text-emerald-400 flex items-center justify-between group/link"
                  >
                    <span>Explorar módulo</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover/link:text-emerald-400 group-hover/link:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
