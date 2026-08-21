'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowUpRight,
} from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-serif">
                Mister<span className="text-emerald-400">Contábil</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Plataforma de inteligência contábil, fiscal e operacional para empresas e holdings nos Estados Unidos, operando em conformidade com as normas US GAAP e IRS.
            </p>

            <div className="space-y-2 pt-2 text-[11px] text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contato@mistercontabil.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>mistercontabil.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: US GAAP Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              US GAAP Accounting
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/balanco" className="hover:text-emerald-400 transition-colors">
                  Balanço Patrimonial
                </Link>
              </li>
              <li>
                <Link href="/razao" className="hover:text-emerald-400 transition-colors">
                  Livro Razão (General Ledger)
                </Link>
              </li>
              <li>
                <Link href="/demonstrativos" className="hover:text-emerald-400 transition-colors">
                  DRE & Fluxo de Caixa
                </Link>
              </li>
              <li>
                <Link href="/diario" className="hover:text-emerald-400 transition-colors">
                  Livro Diário (General Journal)
                </Link>
              </li>
              <li>
                <Link href="/balancete" className="hover:text-emerald-400 transition-colors">
                  Balancete de Verificação
                </Link>
              </li>
              <li>
                <Link href="/chart-of-accounts" className="hover:text-emerald-400 transition-colors">
                  Plano de Contas Oficial
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tax & IRS Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              IRS & Compliance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tax-compliance" className="hover:text-emerald-400 transition-colors">
                  CPA Tax Binder (Form 1065)
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-emerald-400 transition-colors">
                  Quadro Societário & K-1
                </Link>
              </li>
              <li>
                <Link href="/year-end-tax" className="hover:text-emerald-400 transition-colors">
                  Forms 1099-NEC & W-2
                </Link>
              </li>
              <li>
                <Link href="/state-taxes" className="hover:text-emerald-400 transition-colors">
                  State Franchise Taxes
                </Link>
              </li>
              <li>
                <Link href="/audit-trail" className="hover:text-emerald-400 transition-colors">
                  Trilha SOC 2 Merkle
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & System */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Operações & Acesso
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors font-bold text-white">
                  Acesso à Plataforma
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-emerald-400 transition-colors">
                  Criar Conta Empresarial
                </Link>
              </li>
              <li>
                <Link href="/client-portal" className="hover:text-emerald-400 transition-colors">
                  Portal do Cliente B2B
                </Link>
              </li>
              <li>
                <Link href="/bank-reconciliation" className="hover:text-emerald-400 transition-colors">
                  Conciliação Bancária
                </Link>
              </li>
              <li>
                <Link href="/invoicing" className="hover:text-emerald-400 transition-colors">
                  Faturamento & Retainers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Mister Contábil LLC. Todos os direitos reservados.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:text-slate-200">
              Termos de Uso
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-200">
              Política de Privacidade
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-200">
              Conformidade SOC 2
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
