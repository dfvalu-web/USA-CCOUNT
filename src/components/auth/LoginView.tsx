'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-context';
import { DEMO_USERS } from '@/lib/auth/auth-context';
import { useI18n } from '@/lib/i18n/context';

interface LoginViewProps {
  isEmbedded?: boolean;
}

export function LoginView({ isEmbedded = false }: LoginViewProps) {
  const router = useRouter();
  const { quickLoginDemo, login, isLoading } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('milla@millamaidservices.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleDemoSelect = (demoId: string) => {
    quickLoginDemo(demoId);
    router.push('/dashboard');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const res = await login({ email, password });
    if (res.success) {
      router.push('/dashboard');
    } else {
      setAuthError(res.error || 'Credenciais inválidas. Utilize um dos botões de acesso 1-clique abaixo.');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100 ${isEmbedded ? 'min-h-full py-6' : ''}`}>
      {/* 4K Background Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-sky-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Back to Home Button */}
      {!isEmbedded && (
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('auth.backToHome')}</span>
          </Link>
        </div>
      )}

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md mb-2 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('auth.loginSubtitle')}</span>
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
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('common.tagline')}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {t('auth.demoQuickAccess')}
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
              Audit-Ready
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {DEMO_USERS.map((demo) => {
              const isMilla = demo.id === 'demo-milla-admin';
              const isCpa = demo.id === 'demo-cpa-lead';

              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleDemoSelect(demo.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isMilla ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isCpa ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                      'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {isMilla ? <Building2 className="w-4 h-4" /> : isCpa ? <Briefcase className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {demo.label}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                          {demo.badge}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">
                        {demo.subtitle}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@company.com"
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {t('auth.passwordLabel')}
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span>{t('auth.rememberMe')}</span>
              </label>

              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>{t('auth.sslProtected')}</span>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isLoading ? t('auth.authenticating') : t('auth.signInButton')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center">
            <Link
              href="/cadastro"
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
            >
              {t('auth.registerTitle')} ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
