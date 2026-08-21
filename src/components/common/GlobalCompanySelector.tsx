'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCompany } from '@/lib/company/company-context';
import { Badge } from '@/components/ui/Badge';
import {
  Building2,
  ChevronDown,
  Check,
  Plus,
  Search,
  Sparkles,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export function GlobalCompanySelector() {
  const { activeCompany, companies, setActiveCompanyId } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.legalName.toLowerCase().includes(search.toLowerCase()) ||
      c.formationState.toLowerCase().includes(search.toLowerCase()) ||
      c.ein.includes(search) ||
      c.entityType.toLowerCase().includes(search.toLowerCase())
  );

  const getEntityBadge = (type: string) => {
    if (type.includes('1065')) return 'LLC (Form 1065)';
    if (type.includes('1120S')) return 'S-Corp (1120-S)';
    if (type.includes('1120')) return 'C-Corp (1120)';
    return 'Sole Prop';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
          <Building2 className="w-4 h-4" />
        </div>

        <div className="max-w-[200px] sm:max-w-[260px] truncate">
          <div className="font-bold text-white text-xs tracking-tight flex items-center gap-1.5 truncate">
            <span className="truncate">{activeCompany?.legalName || 'Selecione uma Empresa'}</span>
            <Badge
              variant="success"
              className="text-[9px] py-0 px-1 font-mono uppercase shrink-0"
            >
              {activeCompany?.formationState || 'US'}
            </Badge>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate font-mono">
            <span>EIN: {activeCompany?.ein || 'XX-XXXXXXX'}</span>
            <span>•</span>
            <span className="text-emerald-400/90 font-sans">
              {getEntityBadge(activeCompany?.entityType || '')}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950 border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Seletor Global de Empresa Ativa
              </span>
              <Badge variant="outline" className="text-[9px]">
                {companies.length} Cadastradas
              </Badge>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, estado (GA, TX, DE) ou EIN..."
                className="w-full h-7.5 pl-8 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                autoFocus
              />
            </div>
          </div>

          {/* Company List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-900/60">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Nenhuma empresa encontrada com &quot;{search}&quot;.
              </div>
            ) : (
              filtered.map((c) => {
                const isSelected = c.id === activeCompany?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCompanyId(c.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all group ${
                      isSelected
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                        : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                        }`}
                      >
                        {c.formationState}
                      </div>

                      <div className="truncate">
                        <div className="font-bold text-xs truncate flex items-center gap-1.5">
                          <span className="truncate">{c.legalName}</span>
                          {isSelected && (
                            <Badge variant="success" className="text-[8px] py-0 px-1">
                              Ativa
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5 truncate">
                          <span>EIN: {c.ein}</span>
                          <span>•</span>
                          <span className="text-sky-400 font-sans">
                            {getEntityBadge(c.entityType)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
            <a
              href="/software-migration"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all text-[11px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Importar / Auto-Cadastrar Nova Empresa</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
