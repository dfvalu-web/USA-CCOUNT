import { describe, it, expect } from 'vitest';
import { AutoTranslator } from '../src/lib/i18n/auto-translator';

describe('AutoTranslator (Automatic i18n Translation Mechanism for PT and ES)', () => {
  it('should accurately translate accounting terms from English to Portuguese and Spanish', () => {
    const ptTerm = AutoTranslator.translate('Trial Balance', 'pt');
    expect(ptTerm).toBe('Balancete de Verificação');

    const esTerm = AutoTranslator.translate('Trial Balance', 'es');
    expect(esTerm).toBe('Balance de Comprobación');

    const ptUnearned = AutoTranslator.translate('Unearned Revenue', 'pt');
    expect(ptUnearned).toContain('Receita Antecipada');

    const esUnearned = AutoTranslator.translate('Unearned Revenue', 'es');
    expect(esUnearned).toContain('Ingresos Diferidos');
  });

  it('should translate compound phrases with grammar rules for new features', () => {
    const ptPhrase = AutoTranslator.translate('New Invoice Created for Accounts Receivable', 'pt');
    expect(ptPhrase).toContain('Novo');
    expect(ptPhrase).toContain('Contas a Receber');

    const esPhrase = AutoTranslator.translate('New Invoice Created for Accounts Receivable', 'es');
    expect(esPhrase).toContain('Nuevo');
    expect(esPhrase).toContain('Cuentas por Cobrar');
  });

  it('should recursively synchronize missing keys into target dictionaries', () => {
    const sourceEn = {
      nav: {
        newFeature: 'Delaware Franchise Tax',
        newAction: 'Confirm',
      },
    };

    const targetPt = {
      nav: {
        existing: 'Existente',
      },
    };

    const syncedPt = AutoTranslator.syncObject(sourceEn, targetPt, 'pt');
    expect(syncedPt.nav.existing).toBe('Existente');
    expect(syncedPt.nav.newFeature).toBe('Franchise Tax de Delaware');
    expect(syncedPt.nav.newAction).toBe('Confirmar');
  });
});
