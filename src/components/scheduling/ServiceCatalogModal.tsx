'use client';

import React from 'react';
import { ServiceCatalogView } from './ServiceCatalogView';
import { ServicePackageTemplate } from '@/lib/scheduling/smart-cleaning-engine';
import { X, Package } from 'lucide-react';

interface ServiceCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: ServicePackageTemplate[];
  onUpdatePackages: (packages: ServicePackageTemplate[]) => void;
}

export function ServiceCatalogModal({
  isOpen,
  onClose,
  packages,
  onUpdatePackages,
}: ServiceCatalogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-6xl rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Close Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Painel Operacional do Catálogo & Carteira de Indicações
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal View Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <ServiceCatalogView packages={packages} onUpdatePackages={onUpdatePackages} />
        </div>
      </div>
    </div>
  );
}
