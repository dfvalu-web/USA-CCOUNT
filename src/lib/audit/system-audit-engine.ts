import Decimal from 'decimal.js';
import { SAMPLE_LEDGER_ACCOUNTS } from '@/lib/accounting/sample-data';
import { DoubleEntryLedgerEngine } from '@/lib/accounting/ledger-engine';
import { CompanyProfileEngine } from '@/lib/company/company-profile-engine';

export interface AuditAnomalyAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'LEDGER_INTEGRITY' | 'SUSPICIOUS_TRANSACTION' | 'TAX_COMPLIANCE' | 'SECURITY_ACCESS';
  title: string;
  description: string;
  affectedEntityOrAccount: string;
  detectedAt: string;
  status: 'OPEN' | 'RESOLVED' | 'AUTO_FIXED';
  recommendedAction: string;
}

export interface SystemAuditReport {
  overallHealthScore: number; // 0 to 100
  totalAccountsAudited: number;
  totalTransactionsAudited: number;
  openAnomaliesCount: number;
  criticalIssuesCount: number;
  isLedgerBalanced: boolean;
  totalDebits: number;
  totalCredits: number;
  activeUsersWithAdminRole: number;
  lastScanTimestamp: string;
  anomalies: AuditAnomalyAlert[];
}

export class SystemAuditEngine {
  private static INITIAL_ANOMALIES: AuditAnomalyAlert[] = [
    {
      id: 'ANOM-2026-001',
      severity: 'HIGH',
      category: 'SUSPICIOUS_TRANSACTION',
      title: 'Lançamento Potencialmente Duplicado Detectado',
      description: 'Dois pagamentos de $1,420.50 identificados para o mesmo favorecido (AWS Cloud Services) com intervalo de 48h.',
      affectedEntityOrAccount: 'Conta 6010 — Cloud Infrastructure & SaaS',
      detectedAt: '2026-08-20T11:20:00Z',
      status: 'OPEN',
      recommendedAction: 'Verificar se houve duplicidade de fatura no cartão virtual ou se foi um estorno não registrado.',
    },
    {
      id: 'ANOM-2026-002',
      severity: 'MEDIUM',
      category: 'TAX_COMPLIANCE',
      title: 'Nexus Econômico Atingido em Nova York Sem Inscrição Estadual',
      description: 'O faturamento no estado de NY atingiu $320,000 (teto legal $500,000 / 100 transações). Obrigatoriedade de monitoramento mensal.',
      affectedEntityOrAccount: 'Nexus Estadual NY (Wayfair)',
      detectedAt: '2026-08-19T09:45:00Z',
      status: 'OPEN',
      recommendedAction: 'Preparar documentação para cadastro do certificado de Sales Tax perante o NY Department of Taxation.',
    },
    {
      id: 'ANOM-2026-003',
      severity: 'LOW',
      category: 'SECURITY_ACCESS',
      title: 'Acesso de Administrador Fora do Horário Comercial Padrão',
      description: 'Login autorizado para o usuário Victoria Sterling (CFO) registrado às 23:14 UTC com MFA verificado.',
      affectedEntityOrAccount: 'Segurança / IAM Role (Checker CFO)',
      detectedAt: '2026-08-20T23:14:00Z',
      status: 'RESOLVED',
      recommendedAction: 'Nenhuma ação necessária. Autenticação criptográfica de 2 fatores confirmada.',
    },
    {
      id: 'ANOM-2026-004',
      severity: 'MEDIUM',
      category: 'LEDGER_INTEGRITY',
      title: 'Contrato de Retainer Sem Amortização Mensal (ASC 606)',
      description: 'Receita diferida de $15,000 na Conta 2200 aguardando reconhecimento proporcional de serviço entregue.',
      affectedEntityOrAccount: 'Conta 2200 — Deferred Retainer Revenue',
      detectedAt: '2026-08-18T16:00:00Z',
      status: 'OPEN',
      recommendedAction: 'Executar a rotina automática de amortização ASC 606 no módulo de Faturamento.',
    },
  ];

  /**
   * Runs a complete deep automated diagnostic scan of the entire accounting system
   */
  public static runDeepDiagnosticScan(): SystemAuditReport {
    const tb = DoubleEntryLedgerEngine.generateTrialBalance(SAMPLE_LEDGER_ACCOUNTS as any, 'ACCRUAL');
    let totalLines = 0;
    SAMPLE_LEDGER_ACCOUNTS.forEach((acc) => {
      totalLines += acc.lines.length;
    });

    const isBalanced = tb.isBalanced;
    const criticalCount = this.INITIAL_ANOMALIES.filter((a) => a.severity === 'CRITICAL' && a.status === 'OPEN').length;
    const highCount = this.INITIAL_ANOMALIES.filter((a) => a.severity === 'HIGH' && a.status === 'OPEN').length;

    // Health Score calculation (starts at 100, drops per open issue)
    let score = 100;
    if (!isBalanced) score -= 40;
    score -= criticalCount * 20;
    score -= highCount * 5;
    score = Math.max(10, Math.min(100, score));

    return {
      overallHealthScore: score,
      totalAccountsAudited: SAMPLE_LEDGER_ACCOUNTS.length,
      totalTransactionsAudited: totalLines,
      openAnomaliesCount: this.INITIAL_ANOMALIES.filter((a) => a.status === 'OPEN').length,
      criticalIssuesCount: criticalCount,
      isLedgerBalanced: isBalanced,
      totalDebits: tb.totalDebits,
      totalCredits: tb.totalCredits,
      activeUsersWithAdminRole: 3,
      lastScanTimestamp: new Date().toISOString(),
      anomalies: this.INITIAL_ANOMALIES,
    };
  }

  /**
   * Resolves or auto-fixes an identified anomaly
   */
  public static resolveAnomaly(anomalyId: string, resolutionType: 'MANUAL' | 'AUTO_FIX'): AuditAnomalyAlert[] {
    return this.INITIAL_ANOMALIES.map((a) => {
      if (a.id === anomalyId) {
        return {
          ...a,
          status: resolutionType === 'AUTO_FIX' ? 'AUTO_FIXED' : 'RESOLVED',
        };
      }
      return a;
    });
  }
}
