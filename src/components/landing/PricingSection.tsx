'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter Business',
      badge: 'Pequenas LLCs',
      priceMonthly: 189,
      priceAnnual: 149,
      description: 'Ideal para empresas em fase de estruturação que precisam de escrituração US GAAP básica.',
      features: [
        'Livro Diário Contábil (General Journal)',
        'Balancete de Verificação (Trial Balance)',
        'Balanço Patrimonial & DRE',
        'Conciliação Bancária com OCR (até 150 recibos/mês)',
        '1 Empresa / Entidade Fiscal',
        'Exportação de relatórios em CSV',
      ],
      ctaText: 'Começar com Starter',
      isPopular: false,
      href: '/cadastro',
    },
    {
      name: 'Diamond Corporate',
      badge: 'Mais Popular • Recomendado',
      priceMonthly: 429,
      priceAnnual: 349,
      description: 'A solução contábil e fiscal completa para empresas operacionais e holdings nos EUA.',
      features: [
        'Tudo do Plano Starter',
        'Livro Razão Analítico Geral (General Ledger)',
        'Demonstração dos Fluxos de Caixa (ASC 230)',
        'Pacote Fiscal IRS (Form 1065, K-1s, 1099-NEC & W-2)',
        'Impressão em Padrão Diamante para Bancos e IRS (PDF)',
        'Inteligência Artificial CFA Copilot & Monte Carlo BI',
        'Portal do Cliente B2B com Assinatura Digital de Contratos',
        'Até 3 Empresas Vinculadas',
      ],
      ctaText: 'Acessar Plano Diamond',
      isPopular: true,
      href: '/cadastro',
    },
    {
      name: 'CPA Firm & Holding',
      badge: 'Escritórios & Grupos',
      priceMonthly: 989,
      priceAnnual: 799,
      description: 'Desenvolvido para escritórios de contabilidade, CPAs e grupos com múltiplas empresas.',
      features: [
        'Tudo do Plano Diamond',
        'Empresas Ilimitadas (Multi-Entity Consolidation)',
        'Transmissão Direta IRS MeF XML & FIRE System',
        'Trilha de Auditoria SOC 2 Merkle Inviolável',
        'Acesso Dedicado para Clientes dos Escritórios',
        'API de Integração Contábil & Webhooks Bancários',
        'Gerente de Contas & Suporte Prioritário por CPA',
      ],
      ctaText: 'Falar com Especialista',
      isPopular: false,
      href: '/cadastro',
    },
  ];

  return (
    <section id="precos" className="py-24 bg-slate-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Planos Claros & Transparentes</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
            Invista na Conformidade & Crescimento da sua Empresa
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Economize milhares de dólares em multas fiscais e retrabalho contábil com uma plataforma institucional.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Cobrança Mensal
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-950 p-1 border border-slate-800 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              <span>Cobrança Anual</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                Economize 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  p.isPopular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/30 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 scale-105 z-10'
                    : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{p.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!p.isPopular && (
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white font-serif">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.description}</p>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                        ${price}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">/ mês</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {isAnnual ? 'Faturado anualmente em USD' : 'Faturado mensalmente em USD'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Recursos Inclusos:
                    </span>
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={p.href}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                      p.isPopular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                    }`}
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
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
