import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
}

export function Badge({
  children,
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide transition-colors';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/60',
    info: 'bg-sky-950/80 text-sky-300 border border-sky-800/60',
    outline: 'border border-slate-700 text-slate-300 bg-transparent',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}
