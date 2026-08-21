import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md select-none';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500 shadow-sm',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 focus-visible:ring-slate-400',
    outline: 'border border-slate-700 hover:bg-slate-800 text-slate-200 focus-visible:ring-slate-400',
    ghost: 'hover:bg-slate-800/60 text-slate-300 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-3.5 py-2 h-9 gap-2',
    lg: 'text-base px-5 py-2.5 h-11 gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2">⟳</span>
      ) : null}
      {children}
    </button>
  );
}
