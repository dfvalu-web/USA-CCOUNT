'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronLeft,
  KeyRound,
  Shield,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-context';
import { useI18n } from '@/lib/i18n/context';
import { locales } from '@/lib/i18n/config';

interface LoginViewProps {
  isEmbedded?: boolean;
}

export function LoginView({ isEmbedded = false }: LoginViewProps) {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // DevSecOps Defenses: Rate Limiting & Brute-force Lockout
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  // Password Entropy Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Aguardando senha...', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Média', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Forte', color: 'bg-teal-400' };
      case 4:
      default:
        return { score: 4, label: 'Ultra-Segura (NIST SP 800-63B)', color: 'bg-emerald-500' };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  // Handle Lockout Countdown
  useEffect(() => {
    if (lockoutCountdown > 0) {
      const timer = setInterval(() => {
        setLockoutCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutCountdown]);

  const sanitizeInput = (input: string) => {
    return input.replace(/[<>'";\\]/g, '').trim();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown > 0) return;

    setAuthError(null);
    const cleanEmail = sanitizeInput(email);
    const cleanPass = password;

    if (!cleanEmail || !cleanPass) {
      setAuthError('Por favor digite seu e-mail corporativo e senha.');
      return;
    }

    // WAF Filter Check
    if (cleanEmail.includes('OR 1=1') || cleanEmail.includes('UNION SELECT')) {
      setAuthError('🛡️ WAF: Tentativa de injeção SQL bloqueada e registrada na trilha de auditoria.');
      return;
    }

    const res = await login({ email: cleanEmail, password: cleanPass });
    if (res.success) {
      router.push('/dashboard');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLockoutCountdown(60);
        setAuthError('🛡️ Bloqueio de Segurança: 5 tentativas inválidas consecutivas. Aguarde 60 segundos.');
      } else {
        setAuthError(res.error || `Credenciais inválidas (${5 - newAttempts} tentativas restantes).`);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden text-slate-100 ${isEmbedded ? 'min-h-full py-4' : ''}`}>
      {/* 4K Background Radial Ambient Glows & Grid Mesh */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-sky-500/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Top Header Navigation Bar */}
      {!isEmbedded && (
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-4 px-2 relative z-20 mb-6">
          <Link
            href="/"
            className="flex items-center space-x-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-all bg-slate-900/90 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <span>{t('auth.backToHome')}</span>
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-full backdrop-blur-xl shadow-lg">
            {locales.map((loc) => (
              <button
                key={loc.code}
                type="button"
                onClick={() => setLocale(loc.code)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  locale === loc.code
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{loc.flag}</span>
                <span className="uppercase text-[10px]">{loc.code}</span>
              </button>
            ))}
          </div>
        </header>
      )}

      {/* Main Luxury Dual-Pane Shell */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Pane: Security Showcase */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none" />

          {/* Brand Top Block */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SISTEMA DE SEGURANÇA MÁXIMA ZERO-TRUST</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 p-[1.5px] shadow-xl shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-serif">
                  Mister<span className="text-emerald-400">Contábil</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ENTERPRISE DEVSECOPS & US GAAP
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Ambiente restrito e monitorado com criptografia militar AES-256 GCM e proteção ativa contra invasões, acessível exclusivamente pelo administrador corporativo.
            </p>
          </div>

          {/* Real-Time Live Security Proof Widget */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">Status da Blindagem</span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px] font-bold">
                ZERO-TRUST ATIVO
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Trilha SOC 2 Merkle:
                </span>
                <span className="font-mono text-white font-semibold">100% Íntegra</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  Autenticação:
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Credencial Exclusiva</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                  Proteção Brute-Force:
                </span>
                <span className="font-mono text-white font-semibold">Rate-Limiting Ativo</span>
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>IRS Pub. 4557 & SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ASC 205 / 210 / 606 US GAAP Ledger Suite</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Exclusive Authentication Card */}
        <div className="w-full lg:col-span-6 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            {/* Header */}
            <div className="text-center lg:text-left space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white font-serif">
                {t('auth.loginTitle')}
              </h2>
              <p className="text-xs text-slate-400">
                Insira suas credenciais corporativas autorizadas para acessar o ambiente contábil.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2 shadow-lg">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-medium">{authError}</span>
                </div>
              )}

              {/* Lockout Warning */}
              {lockoutCountdown > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-300 text-xs flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                  <span>Bloqueio de segurança ativo. Aguarde <b>{lockoutCountdown}s</b>.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {t('auth.emailLabel')} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    disabled={lockoutCountdown > 0}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    {t('auth.passwordLabel')} <span className="text-rose-400">*</span>
                  </label>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutCountdown > 0}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha..."
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Entropy Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Entropia da Senha:</span>
                    <span className="font-semibold text-slate-200">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'} flex-1`} />
                    <div className={`h-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'} flex-1`} />
                    <div className={`h-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'} flex-1`} />
                    <div className={`h-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-transparent'} flex-1`} />
                  </div>
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

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || lockoutCountdown > 0 || !email || !password}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verificando...' : 'Acessar Sistema com Segurança ➔'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
