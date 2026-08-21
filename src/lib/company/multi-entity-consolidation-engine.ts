import Decimal from 'decimal.js';

export interface GroupEntitySummary {
  id: string;
  legalName: string;
  jurisdiction: string;
  entityType: string;
  ownershipPercentage: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  netIncome: number;
}

export interface IntercompanyTransaction {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  transactionType: 'MANAGEMENT_FEE' | 'INTERCOMPANY_LOAN' | 'IP_LICENSE_ROYALTY' | 'SHARED_SERVICES';
  amount: number;
  date: string;
  memo: string;
  eliminationStatus: 'ELIMINATED_IN_CONSOLIDATION' | 'PENDING';
}

export interface ConsolidatedFinancialPackage {
  groupId: string;
  groupName: string;
  asOfDate: string;
  entities: GroupEntitySummary[];
  intercompanyTransactions: IntercompanyTransaction[];
  grossTotalAssets: number;
  eliminatedIntercompanyAssets: number;
  consolidatedNetAssets: number;
  grossTotalRevenue: number;
  eliminatedIntercompanyRevenue: number;
  consolidatedNetRevenue: number;
  consolidatedNetIncome: number;
}

export class MultiEntityConsolidationEngine {
  public static INITIAL_GROUP_ENTITIES: GroupEntitySummary[] = [
    {
      id: 'ent-hold-01',
      legalName: 'Apex Enterprise Group Holdings Inc',
      jurisdiction: 'Delaware (DE)',
      entityType: 'C-Corporation (Parent Holding)',
      ownershipPercentage: 100.0,
      totalAssets: 680000.0,
      totalLiabilities: 45000.0,
      totalEquity: 635000.0,
      totalRevenue: 48000.0, // Management fee income
      netIncome: 32000.0,
    },
    {
      id: 'ent-sub-02',
      legalName: 'Apex CleanOps & Facilities LLC',
      jurisdiction: 'Texas (TX)',
      entityType: 'Operating LLC (100% Owned)',
      ownershipPercentage: 100.0,
      totalAssets: 485200.0,
      totalLiabilities: 33200.0,
      totalEquity: 452000.0,
      totalRevenue: 215000.0,
      netIncome: 68400.0,
    },
    {
      id: 'ent-sub-03',
      legalName: 'Apex Cloud Technologies & AI Labs Inc',
      jurisdiction: 'California (CA)',
      entityType: 'Operating C-Corp (100% Owned)',
      ownershipPercentage: 100.0,
      totalAssets: 340000.0,
      totalLiabilities: 28000.0,
      totalEquity: 312000.0,
      totalRevenue: 180000.0,
      netIncome: 54000.0,
    },
  ];

  public static INITIAL_INTERCOMPANY: IntercompanyTransaction[] = [
    {
      id: 'IC-2026-001',
      sourceEntityId: 'ent-sub-02',
      sourceEntityName: 'Apex CleanOps & Facilities LLC',
      targetEntityId: 'ent-hold-01',
      targetEntityName: 'Apex Enterprise Group Holdings Inc',
      transactionType: 'MANAGEMENT_FEE',
      amount: 24000.0,
      date: '2026-03-31',
      memo: 'Taxa de Gestão Corporativa, Compliance e Diretoria Executiva Q1/Q2',
      eliminationStatus: 'ELIMINATED_IN_CONSOLIDATION',
    },
    {
      id: 'IC-2026-002',
      sourceEntityId: 'ent-sub-03',
      sourceEntityName: 'Apex Cloud Technologies & AI Labs Inc',
      targetEntityId: 'ent-hold-01',
      targetEntityName: 'Apex Enterprise Group Holdings Inc',
      transactionType: 'IP_LICENSE_ROYALTY',
      amount: 24000.0,
      date: '2026-03-31',
      memo: 'Licenciamento de Propriedade Intelectual e Marca Global Q1/Q2',
      eliminationStatus: 'ELIMINATED_IN_CONSOLIDATION',
    },
  ];

  /**
   * Generates the Consolidated Financial Statements Package with Intercompany Eliminations
   */
  public static generateConsolidation(
    entities: GroupEntitySummary[] = this.INITIAL_GROUP_ENTITIES,
    intercompany: IntercompanyTransaction[] = this.INITIAL_INTERCOMPANY
  ): ConsolidatedFinancialPackage {
    let grossAssets = new Decimal(0);
    let grossRevenue = new Decimal(0);
    let grossNetIncome = new Decimal(0);

    entities.forEach((e) => {
      grossAssets = grossAssets.plus(new Decimal(e.totalAssets));
      grossRevenue = grossRevenue.plus(new Decimal(e.totalRevenue));
      grossNetIncome = grossNetIncome.plus(new Decimal(e.netIncome));
    });

    let totalEliminatedRevenue = new Decimal(0);
    intercompany.forEach((ic) => {
      totalEliminatedRevenue = totalEliminatedRevenue.plus(new Decimal(ic.amount));
    });

    const netRevenue = grossRevenue.minus(totalEliminatedRevenue);
    const netAssets = grossAssets.minus(totalEliminatedRevenue); // Intercompany receivables eliminated against payables

    return {
      groupId: 'GRP-APEX-HOLDINGS',
      groupName: 'Apex Enterprise Group & Subsidiaries Consolidated',
      asOfDate: new Date().toISOString(),
      entities,
      intercompanyTransactions: intercompany,
      grossTotalAssets: grossAssets.toNumber(),
      eliminatedIntercompanyAssets: totalEliminatedRevenue.toNumber(),
      consolidatedNetAssets: netAssets.toNumber(),
      grossTotalRevenue: grossRevenue.toNumber(),
      eliminatedIntercompanyRevenue: totalEliminatedRevenue.toNumber(),
      consolidatedNetRevenue: netRevenue.toNumber(),
      consolidatedNetIncome: grossNetIncome.toNumber(),
    };
  }

  /**
   * Records a new intercompany transaction
   */
  public static addIntercompanyTransaction(
    sourceEntityId: string,
    targetEntityId: string,
    transactionType: IntercompanyTransaction['transactionType'],
    amount: number,
    memo: string
  ): IntercompanyTransaction {
    const src = this.INITIAL_GROUP_ENTITIES.find((e) => e.id === sourceEntityId);
    const tgt = this.INITIAL_GROUP_ENTITIES.find((e) => e.id === targetEntityId);

    return {
      id: `IC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      sourceEntityId,
      sourceEntityName: src?.legalName || 'Subsidiária Origem',
      targetEntityId,
      targetEntityName: tgt?.legalName || 'Holding Destino',
      transactionType,
      amount,
      date: new Date().toISOString().split('T')[0],
      memo,
      eliminationStatus: 'ELIMINATED_IN_CONSOLIDATION',
    };
  }
}
