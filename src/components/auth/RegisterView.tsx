'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ShieldCheck,
  Building2,
  Mail,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function RegisterView() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [ein, setEin] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN_OWNER' | 'CPA_ACCOUNTANT'>('ADMIN_OWNER');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await register({
      name: fullName,
      email,
      companyName: companyName || 'Minha Empresa LLC',
      ein: ein || '88-9999999',
      role,
      password,
    });

    setIsSubmitting(false);
    if (res.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glowing Ambient Background Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-600/20 via-sky-600/15 to-indigo-600/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Top navigation back to landing page */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar ao Site Principal</span>
        </Link>
      </div>

      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md mb-2 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cadastro Empresarial</span>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] shadow-xl shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-serif">
              Mister<span className="text-emerald-400">Contábil</span>
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white pt-1">
            Crie sua Conta Empresarial
          </h2>
          <p className="text-xs text-slate-400">
            Gerencie sua contabilidade US GAAP e obrigações do IRS em uma única plataforma
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Perfil de Uso Principal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('ADMIN_OWNER')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    role === 'ADMIN_OWNER'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Empresa / LLC / Corp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CPA_ACCOUNTANT')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    role === 'CPA_ACCOUNTANT'
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Escritório de CPA / Contador</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Razão Social (Legal Name)
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Minha Empresa LLC"
                    className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  EIN (Federal Tax ID)
                </label>
                <input
                  type="text"
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu Nome"
                    className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com"
                    className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">
                Senha Segura
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inclui no teste gratuito:</span>
              </div>
              <p className="text-slate-400 pl-5">
                Plano de Contas US GAAP, Livro Diário, Balancete, DRE, Balanço Patrimonial e Conciliação Bancária com OCR.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Criando Conta...</span>
              ) : (
                <>
                  <span>Concluir Cadastro e Acessar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login link */}
          <div className="pt-2 text-center text-xs text-slate-400">
            Já possui uma conta ativa?{' '}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
