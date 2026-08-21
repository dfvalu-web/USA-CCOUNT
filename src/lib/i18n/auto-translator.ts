import { Locale } from './config';

export class AutoTranslator {
  // Comprehensive accounting, tax, fintech and UI glossary
  private static GLOSSARY: Record<string, { pt: string; es: string }> = {
    // General & Navigation
    'dashboard': { pt: 'Painel Geral', es: 'Panel General' },
    'settings': { pt: 'Configurações', es: 'Configuración' },
    'trial balance': { pt: 'Balancete de Verificação', es: 'Balance de Comprobación' },
    'income statement': { pt: 'Demonstração do Resultado (DRE)', es: 'Estado de Resultados' },
    'balance sheet': { pt: 'Balanço Patrimonial', es: 'Balance General' },
    'journal entries': { pt: 'Lançamentos Contábeis', es: 'Asientos Contables' },
    'chart of accounts': { pt: 'Plano de Contas', es: 'Plan de Cuentas' },
    'invoicing': { pt: 'Faturamento & Cobrança', es: 'Facturación y Cobro' },
    'scheduling': { pt: 'Agendamento & Horas', es: 'Programación y Horas' },
    'payroll': { pt: 'Folha de Pagamento', es: 'Nómina de Sueldos' },
    'tax compliance': { pt: 'Conformidade Fiscal', es: 'Cumplimiento Tributario' },
    'reports': { pt: 'Relatórios & Inteligência', es: 'Informes y Análisis' },
    'multi-currency': { pt: 'Multi-Moedas', es: 'Multi-Monedas' },
    'banking': { pt: 'Operações Bancárias', es: 'Operaciones Bancarias' },
    'audit trail': { pt: 'Trilha de Auditoria', es: 'Pista de Auditoría' },

    // Financial & Accounting Terms
    'general ledger': { pt: 'Razão Geral Contábil', es: 'Libro Mayor Contable' },
    'double entry': { pt: 'Partidas Dobradas', es: 'Partida Doble' },
    'debit': { pt: 'Débito', es: 'Débito' },
    'credit': { pt: 'Crédito', es: 'Crédito' },
    'assets': { pt: 'Ativos', es: 'Activos' },
    'liabilities': { pt: 'Passivos', es: 'Pasivos' },
    'equity': { pt: 'Patrimônio Líquido', es: 'Patrimonio Neto' },
    'revenue': { pt: 'Receita', es: 'Ingresos' },
    'expenses': { pt: 'Despesas', es: 'Gastos' },
    'net income': { pt: 'Lucro Líquido', es: 'Utilidad Neta' },
    'gross profit': { pt: 'Lucro Bruto', es: 'Utilidad Bruta' },
    'gross margin': { pt: 'Margem Bruta', es: 'Margen Bruto' },
    'accrual basis': { pt: 'Regime de Competência', es: 'Criterio de Devengo' },
    'cash basis': { pt: 'Regime de Caixa', es: 'Criterio de Caja' },
    'accounts receivable': { pt: 'Contas a Receber (A/R)', es: 'Cuentas por Cobrar (A/R)' },
    'accounts payable': { pt: 'Contas a Pagar (A/P)', es: 'Cuentas por Pagar (A/P)' },
    'unearned revenue': { pt: 'Receita Antecipada (Passivo)', es: 'Ingresos Diferidos (Pasivo)' },
    'retainer revenue': { pt: 'Receita de Retainers Reconhecida', es: 'Ingresos por Retainers' },
    'bank reconciliation': { pt: 'Conciliação Bancária', es: 'Conciliación Bancaria' },
    'reconciled': { pt: 'Conciliado', es: 'Conciliado' },
    'unreconciled': { pt: 'Não Conciliado', es: 'No Conciliado' },

    // Tax & Compliance Terms
    'sales tax': { pt: 'Imposto sobre Vendas (Sales Tax)', es: 'Impuesto sobre Ventas' },
    'economic nexus': { pt: 'Nexo Econômico Estadual', es: 'Nexo Económico Estatal' },
    'tax withholdings': { pt: 'Retenções de Impostos', es: 'Retenciones de Impuestos' },
    'franchise tax': { pt: 'Taxa de Franquia Estadual', es: 'Impuesto de Franquicia' },
    'delaware franchise tax': { pt: 'Franchise Tax de Delaware', es: 'Impuesto de Franquicia de Delaware' },
    'california franchise tax': { pt: 'Imposto da Califórnia (Form 568)', es: 'Impuesto de California (Form 568)' },
    'texas franchise tax': { pt: 'Relatório Fiscal do Texas', es: 'Informe Fiscal de Texas' },

    // Actions & Common Phrases
    'confirm': { pt: 'Confirmar', es: 'Confirmar' },
    'cancel': { pt: 'Cancelar', es: 'Cancelar' },
    'save': { pt: 'Salvar', es: 'Guardar' },
    'delete': { pt: 'Excluir', es: 'Eliminar' },
    'edit': { pt: 'Editar', es: 'Editar' },
    'download': { pt: 'Baixar', es: 'Descargar' },
    'export': { pt: 'Exportar', es: 'Exportar' },
    'upload': { pt: 'Enviar Arquivo', es: 'Subir Archivo' },
    'search': { pt: 'Pesquisar...', es: 'Buscar...' },
    'status': { pt: 'Status', es: 'Estado' },
    'date': { pt: 'Data', es: 'Fecha' },
    'amount': { pt: 'Valor', es: 'Monto' },
    'total': { pt: 'Total', es: 'Total' },
    'hours': { pt: 'Horas', es: 'Horas' },
    'rate': { pt: 'Taxa', es: 'Tarifa' },
    'paid': { pt: 'Pago', es: 'Pagado' },
    'pending': { pt: 'Pendente', es: 'Pendiente' },
    'approved': { pt: 'Aprovado', es: 'Aprobado' },
  };

  /**
   * Translates any text from English to Portuguese or Spanish
   */
  public static translate(text: string, targetLang: Locale): string {
    if (!text || targetLang === 'en') return text;

    const lower = text.toLowerCase().trim();

    // 1. Direct glossary match
    if (this.GLOSSARY[lower]) {
      return this.GLOSSARY[lower][targetLang];
    }

    // 2. Token-by-token replacement for compound phrases
    let translated = text;
    for (const [enTerm, translations] of Object.entries(this.GLOSSARY)) {
      const regex = new RegExp(`\\b${enTerm}\\b`, 'gi');
      if (regex.test(translated)) {
        translated = translated.replace(regex, translations[targetLang]);
      }
    }

    // 3. Fallback grammar patterns
    if (targetLang === 'pt') {
      translated = translated
        .replace(/\bNew\s+/gi, 'Novo ')
        .replace(/\bActive\b/gi, 'Ativo')
        .replace(/\bCompleted\b/gi, 'Concluído')
        .replace(/\bAll\s+/gi, 'Todos ')
        .replace(/\bSuccess\b/gi, 'Sucesso')
        .replace(/\bFailed\b/gi, 'Falhou');
    } else if (targetLang === 'es') {
      translated = translated
        .replace(/\bNew\s+/gi, 'Nuevo ')
        .replace(/\bActive\b/gi, 'Activo')
        .replace(/\bCompleted\b/gi, 'Completado')
        .replace(/\bAll\s+/gi, 'Todos ')
        .replace(/\bSuccess\b/gi, 'Éxito')
        .replace(/\bFailed\b/gi, 'Falló');
    }

    return translated;
  }

  /**
   * Recursively synchronizes missing keys from source dictionary (en) to target dictionary (pt/es)
   */
  public static syncObject(
    sourceObj: Record<string, any>,
    targetObj: Record<string, any>,
    targetLang: Locale
  ): Record<string, any> {
    const result: Record<string, any> = { ...targetObj };

    for (const [key, value] of Object.entries(sourceObj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.syncObject(value, result[key] || {}, targetLang);
      } else if (typeof value === 'string') {
        if (result[key] === undefined || result[key] === null || result[key] === '') {
          result[key] = this.translate(value, targetLang);
        }
      }
    }

    return result;
  }
}
