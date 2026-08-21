import { describe, it, expect } from 'vitest';
import { CompanySandboxEngine } from '@/lib/sandbox/company-sandbox-engine';

describe('CompanySandboxEngine (Isolated Safe Testing Environment)', () => {
  it('should clone an operational company into an isolated sandbox scenario', () => {
    const scenario = CompanySandboxEngine.createSandboxScenario(
      'comp-1',
      'Cenário Teste M&A e Conversão C-Corp',
      'Isolamento para simular tributação de dividendos C-Corp 1120',
      'C-Corporation (Form 1120)'
    );

    expect(scenario.id).toMatch(/^SBX-SCEN-\d+/);
    expect(scenario.status).toBe('ACTIVE_TESTING');
    expect(scenario.sourceCompanyId).toBe('comp-1');
    expect(scenario.simulatedTaxRegimeChange).toBe('C-Corporation (Form 1120)');
    expect(scenario.adjustingEntriesCount).toBe(0);
  });

  it('should compute variances and diff items between Production and Sandbox', () => {
    const scenario = CompanySandboxEngine.INITIAL_SCENARIOS[0];
    const diffs = CompanySandboxEngine.calculateDiff(scenario);

    expect(diffs.length).toBeGreaterThan(0);
    const w2Diff = diffs.find((d) => d.accountCode === '5010');
    expect(w2Diff).toBeDefined();
    expect(w2Diff?.varianceAmount).toBe(45000);
    expect(w2Diff?.sandboxBalance).toBeGreaterThan(w2Diff?.prodBalance || 0);
  });
});
