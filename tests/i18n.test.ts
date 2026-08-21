import { describe, it, expect } from 'vitest';
import en from '../src/locales/en.json';
import pt from '../src/locales/pt.json';
import es from '../src/locales/es.json';

describe('i18n Dictionary Parity & Integrity', () => {
  function getKeys(obj: Record<string, any>, prefix = ''): string[] {
    return Object.keys(obj).reduce((acc: string[], k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        acc.push(...getKeys(obj[k], pre + k));
      } else {
        acc.push(pre + k);
      }
      return acc;
    }, []);
  }

  it('should have identical translation keys across EN, PT and ES', () => {
    const enKeys = getKeys(en).sort();
    const ptKeys = getKeys(pt).sort();
    const esKeys = getKeys(es).sort();

    expect(ptKeys).toEqual(enKeys);
    expect(esKeys).toEqual(enKeys);
  });

  it('should contain required canonical accounting terms', () => {
    expect(en.accounting.ruleDebitCredit).toBeDefined();
    expect(pt.accounting.ruleDebitCredit).toBeDefined();
    expect(es.accounting.ruleDebitCredit).toBeDefined();

    expect(en.nav.trialBalance).toBe('Trial Balance');
    expect(pt.nav.trialBalance).toBe('Balancete de Verificação');
    expect(es.nav.trialBalance).toBe('Balance de Comprobación');
  });
});
