'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CompanyProfileEngine,
  CompanyTaxProfile,
} from './company-profile-engine';

interface CompanyContextType {
  activeCompany: CompanyTaxProfile;
  companies: CompanyTaxProfile[];
  setActiveCompanyId: (id: string) => void;
  addCompany: (company: CompanyTaxProfile) => void;
  updateCompany: (company: CompanyTaxProfile) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<CompanyTaxProfile[]>(
    CompanyProfileEngine.INITIAL_COMPANIES
  );
  const [activeCompanyId, setActiveCompanyId] = useState<string>(
    CompanyProfileEngine.INITIAL_COMPANIES[0]?.id || 'cmp-milla-maid-ga'
  );

  // Sync from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('uas_active_company_id');
      if (stored && companies.some((c) => c.id === stored)) {
        setActiveCompanyId(stored);
      }
    }
  }, [companies]);

  const handleSetActiveCompanyId = (id: string) => {
    setActiveCompanyId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uas_active_company_id', id);
    }
  };

  const handleAddCompany = (newComp: CompanyTaxProfile) => {
    setCompanies((prev) => {
      if (prev.some((c) => c.id === newComp.id)) return prev;
      return [newComp, ...prev];
    });
    handleSetActiveCompanyId(newComp.id);
  };

  const handleUpdateCompany = (updated: CompanyTaxProfile) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const activeCompany =
    companies.find((c) => c.id === activeCompanyId) || companies[0];

  return (
    <CompanyContext.Provider
      value={{
        activeCompany,
        companies,
        setActiveCompanyId: handleSetActiveCompanyId,
        addCompany: handleAddCompany,
        updateCompany: handleUpdateCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany(): CompanyContextType {
  const context = useContext(CompanyContext);
  if (!context) {
    const fallback = CompanyProfileEngine.INITIAL_COMPANIES[0];
    return {
      activeCompany: fallback,
      companies: CompanyProfileEngine.INITIAL_COMPANIES,
      setActiveCompanyId: () => {},
      addCompany: () => {},
      updateCompany: () => {},
    };
  }
  return context;
}
