import { describe, it, expect } from 'vitest';
import { MultiEntityConsolidationEngine } from '@/lib/company/multi-entity-consolidation-engine';

describe('MultiEntityConsolidationEngine (US GAAP ASC 810 Consolidation)', () => {
  it('should list group entities with 100% parent-subsidiary structure', () => {
    const entities = MultiEntityConsolidationEngine.INITIAL_GROUP_ENTITIES;
    expect(entities.length).toBeGreaterThan(0);
    const holding = entities.find((e) => e.id === 'ent-hold-01');
    expect(holding).toBeDefined();
    expect(holding?.legalName).toContain('Holdings');
  });

  it('should eliminate intercompany transactions from consolidated revenue and assets', () => {
    const result = MultiEntityConsolidationEngine.generateConsolidation();

    expect(result.grossTotalAssets).toBeGreaterThan(result.consolidatedNetAssets);
    expect(result.eliminatedIntercompanyAssets).toBe(48000); // 24k + 24k
    expect(result.grossTotalRevenue).toBeGreaterThan(result.consolidatedNetRevenue);
    expect(result.eliminatedIntercompanyRevenue).toBe(48000);
    expect(result.consolidatedNetRevenue).toBe(result.grossTotalRevenue - 48000);
  });

  it('should record a new intercompany transaction and auto-eliminate it', () => {
    const newTx = MultiEntityConsolidationEngine.addIntercompanyTransaction(
      'ent-sub-02',
      'ent-hold-01',
      'MANAGEMENT_FEE',
      15000,
      'Taxa de Auditoria Compartilhada'
    );

    expect(newTx.id).toMatch(/^IC-\d+-\d+/);
    expect(newTx.amount).toBe(15000);
    expect(newTx.eliminationStatus).toBe('ELIMINATED_IN_CONSOLIDATION');
  });
});
