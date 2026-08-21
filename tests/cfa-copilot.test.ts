import { describe, it, expect } from 'vitest';
import { CfaCopilotEngine } from '../src/lib/ai/cfa-copilot-engine';

describe('CfaCopilotEngine (Conversational Financial AI)', () => {
  it('should answer Runway questions with exact metrics in Portuguese', () => {
    const res = CfaCopilotEngine.generateResponse('Qual é o nosso Runway atual?', 'pt');
    expect(res.text).toContain('14.8 meses');
    expect(res.metricsReference).toContain('Runway');
  });

  it('should explain ASC 606 Retainer Amortization in English', () => {
    const res = CfaCopilotEngine.generateResponse('How does ASC 606 retainer amortization work?', 'en');
    expect(res.text).toContain('ASC 606');
    expect(res.text).toContain('2100');
    expect(res.text).toContain('4030');
  });
});
