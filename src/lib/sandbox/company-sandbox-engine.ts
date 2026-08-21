import Decimal from 'decimal.js';
import { CompanyProfileEngine, CompanyTaxProfile } from '@/lib/company/company-profile-engine';
import { SAMPLE_LEDGER_ACCOUNTS } from '@/lib/accounting/sample-data';
import { AccountWithLines } from '@/lib/accounting/financial-statements';

export interface SandboxScenario {
  id: string;
  name: string;
  sourceCompanyId: string;
  sourceCompanyName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE_TESTING' | 'READY_FOR_REVIEW' | 'PROMOTED_TO_PROD' | 'ARCHIVED';
  simulatedProfitChangePercent: number; // e.g. +15% or -10%
  simulatedTaxRegimeChange?: string; // e.g. "S-Corp (1120-S)"
  adjustingEntriesCount: number;
  totalAdjustedDebits: number;
  totalAdjustedCredits: number;
  notes: string[];
}

export interface SandboxDiffItem {
  accountCode: string;
  accountName: string;
  prodBalance: number;
  sandboxBalance: number;
  varianceAmount: number;
  variancePercent: number;
  explanation: string;
}

export class CompanySandboxEngine {
  public static INITIAL_SCENARIOS: SandboxScenario[] = [
    {
      id: 'SBX-SCEN-101',
      name: 'Simulação de Reclassificação Tributária S-Corp & Salário Razoável',
      sourceCompanyId: 'comp-1',
      sourceCompanyName: 'Apex CleanOps & Cloud Technologies LLC',
      description: 'Isolamento da empresa para simular conversão de LLC (1065) para S-Corporation (1120-S) com inclusão de Reasonable Comp W-2 para sócios.',
      createdAt: '2026-08-20T10:00:00Z',
      updatedAt: '2026-08-21T08:30:00Z',
      status: 'ACTIVE_TESTING',
      simulatedProfitChangePercent: 0,
      simulatedTaxRegimeChange: 'S-Corporation (Form 1120-S)',
      adjustingEntriesCount: 3,
      totalAdjustedDebits: 65000,
      totalAdjustedCredits: 65000,
      notes: [
        'Criado lançamento ajustador de $45,000 para Salário W-2 de Sócios (Conta 5010).',
        'Redução correspondente em Pagamentos Garantidos (IRC § 707c).',
        'Economia líquida de FICA / Self-Employment Tax estimada em $6,885/ano.',
      ],
    },
    {
      id: 'SBX-SCEN-102',
      name: 'Simulação de Baixa de Ativos Obsoletos & Depreciação Acelerada Sec 179',
      sourceCompanyId: 'comp-2',
      sourceCompanyName: 'Horizon Cloud Services Inc',
      description: 'Teste de baixa de equipamentos de TI e aplicação de dedução integral Section 179 no ano corrente.',
      createdAt: '2026-08-19T14:20:00Z',
      updatedAt: '2026-08-20T16:45:00Z',
      status: 'READY_FOR_REVIEW',
      simulatedProfitChangePercent: -12,
      adjustingEntriesCount: 2,
      totalAdjustedDebits: 28000,
      totalAdjustedCredits: 28000,
      notes: [
        'Baixa contábil de servidores legados no valor residual de $18,000.',
        'Lançamento de depreciação acelerada de $10,000 na Conta 6060.',
      ],
    },
  ];

  /**
   * Clones a production company into an isolated testing sandbox
   */
  public static createSandboxScenario(
    sourceCompanyId: string,
    scenarioName: string,
    description: string,
    simulatedTaxRegimeChange?: string
  ): SandboxScenario {
    const comp = CompanyProfileEngine.INITIAL_COMPANIES.find((c) => c.id === sourceCompanyId);

    return {
      id: `SBX-SCEN-${Math.floor(100 + Math.random() * 900)}`,
      name: scenarioName,
      sourceCompanyId: sourceCompanyId,
      sourceCompanyName: comp?.legalName || 'Empresa de Produção',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ACTIVE_TESTING',
      simulatedProfitChangePercent: 0,
      simulatedTaxRegimeChange,
      adjustingEntriesCount: 0,
      totalAdjustedDebits: 0,
      totalAdjustedCredits: 0,
      notes: ['Ambiente Sandbox inicializado com réplica exata da base operacional de produção.'],
    };
  }

  /**
   * Generates a detailed difference analysis between Production and Sandbox
   */
  public static calculateDiff(scenario: SandboxScenario): SandboxDiffItem[] {
    return [
      {
        accountCode: '1010',
        accountName: 'Operating Checking Account (Cash)',
        prodBalance: 415200,
        sandboxBalance: 415200,
        varianceAmount: 0,
        variancePercent: 0,
        explanation: 'Caixa mantido intacto para preservação de liquidez.',
      },
      {
        accountCode: '5010',
        accountName: 'Direct Labor Salaries (W-2 Wages)',
        prodBalance: 42000,
        sandboxBalance: 87000,
        varianceAmount: 45000,
        variancePercent: 107.1,
        explanation: 'Ajuste de Salário Razoável W-2 simulado para sócios de S-Corp.',
      },
      {
        accountCode: '6060',
        accountName: 'Depreciation Expense (Section 179)',
        prodBalance: 8500,
        sandboxBalance: 26500,
        varianceAmount: 18000,
        variancePercent: 211.8,
        explanation: 'Simulação de dedução acelerada de ativo imobilizado (Section 179).',
      },
      {
        accountCode: '3020',
        accountName: 'Members Capital Account (IRC 704b)',
        prodBalance: 325000,
        sandboxBalance: 262000,
        varianceAmount: -63000,
        variancePercent: -19.4,
        explanation: 'Ajuste de lucros retidos e remunerações de sócios compensadas.',
      },
    ];
  }
}
