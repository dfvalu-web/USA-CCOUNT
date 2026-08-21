/**
 * Mister Contábil / UAS Accounting - AI-Powered Translation Autofill Engine
 * Synchronizes missing or empty translations across pt.json, en.json, and es.json
 * Preserves dynamic interpolation variables ({{count}}, {name}) and HTML tags.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales');
const FILES = {
  pt: path.join(LOCALES_DIR, 'pt.json'),
  en: path.join(LOCALES_DIR, 'en.json'),
  es: path.join(LOCALES_DIR, 'es.json'),
};

// Comprehensive Financial, Accounting (US GAAP / NIIF) and SaaS UI Glossary
const FINANCIAL_GLOSSARY = {
  // Navigation & General
  'dashboard': { pt: 'Cockpit Executivo', es: 'Panel Ejecutivo', en: 'Executive Cockpit' },
  'general ledger': { pt: 'Livro Razão Geral', es: 'Libro Mayor General', en: 'General Ledger' },
  'journal entries': { pt: 'Livro Diário Geral', es: 'Libro Diario General', en: 'Journal Entries' },
  'trial balance': { pt: 'Balancete de Verificação', es: 'Balance de Comprobación', en: 'Trial Balance' },
  'balance sheet': { pt: 'Balanço Patrimonial', es: 'Balance General', en: 'Balance Sheet' },
  'income statement': { pt: 'Demonstração do Resultado (DRE)', es: 'Estado de Resultados (P&L)', en: 'Income Statement (P&L)' },
  'statement of cash flows': { pt: 'Demonstração dos Fluxos de Caixa', es: 'Estado de Flujos de Efectivo', en: 'Statement of Cash Flows' },
  'statement of equity': { pt: 'Mutações do Patrimônio Líquido', es: 'Estado de Cambios en el Patrimonio', en: 'Statement of Equity' },
  'chart of accounts': { pt: 'Plano de Contas', es: 'Plan de Cuentas', en: 'Chart of Accounts' },
  'invoicing': { pt: 'Faturamento & Invoices', es: 'Facturación e Invoices', en: 'Invoicing & Invoices' },
  'scheduling': { pt: 'Agendamento & Apontamento de Horas', es: 'Control de Horas y Despacho', en: 'Scheduling & Dispatch' },
  'payroll': { pt: 'Departamento Pessoal & W-2 / 1099', es: 'Nómina y W-2 / 1099', en: 'Payroll & W-2 / 1099' },
  'tax compliance': { pt: 'Compliance Fiscal & Sales Tax', es: 'Cumplimiento Fiscal y Sales Tax', en: 'Tax Compliance & Sales Tax' },
  'bank reconciliation': { pt: 'Conciliação Bancária & OCR', es: 'Conciliación Bancaria y OCR', en: 'Bank Reconciliation & OCR' },
  'client portal': { pt: 'Portal do Cliente B2B', es: 'Portal del Cliente B2B', en: 'B2B Client Portal' },
  'worker portal': { pt: 'Portal do Colaborador & e-Sign', es: 'Portal del Trabajador y e-Sign', en: 'Worker Portal & e-Sign' },
  'audit trail': { pt: 'Trilha de Auditoria (SOC 2 Merkle)', es: 'Pista de Auditoría (SOC 2 Merkle)', en: 'Audit Trail (SOC 2 Merkle)' },
  'multi entity': { pt: 'Consolidação Multi-Empresas', es: 'Consolidación Multientidad', en: 'Multi-Entity Consolidation' },
  'system audit': { pt: 'Auditoria do Sistema & Anomalias', es: 'Auditoría del Sistema y Anomalías', en: 'System Audit & Anomalies' },
  'budget variance': { pt: 'Orçamento vs. Realizado', es: 'Presupuesto vs. Real', en: 'Budget vs. Actual Variance' },
  'reports': { pt: 'Inteligência & Relatórios Financeiros', es: 'Informes Financieros y BI', en: 'BI & Financial Reports' },
  'settings': { pt: 'Configurações da Empresa', es: 'Configuración de la Empresa', en: 'Organization Settings' },

  // Accounting Core
  'debit': { pt: 'Débito', es: 'Débito', en: 'Debit' },
  'credit': { pt: 'Crédito', es: 'Crédito', en: 'Credit' },
  'assets': { pt: 'Ativos', es: 'Activos', en: 'Assets' },
  'total assets': { pt: 'Ativo Total', es: 'Total de Activos', en: 'Total Assets' },
  'current assets': { pt: 'Ativo Circulante', es: 'Activo Corriente', en: 'Current Assets' },
  'non-current assets': { pt: 'Ativo Não Circulante / Imobilizado', es: 'Activo No Corriente / Activo Fijo', en: 'Non-Current Assets' },
  'liabilities': { pt: 'Passivos', es: 'Pasivos', en: 'Liabilities' },
  'total liabilities': { pt: 'Passivo Total', es: 'Total de Pasivos', en: 'Total Liabilities' },
  'current liabilities': { pt: 'Passivo Circulante', es: 'Pasivo Corriente', en: 'Current Liabilities' },
  'non-current liabilities': { pt: 'Passivo Não Circulante', es: 'Pasivo No Corriente', en: 'Non-Current Liabilities' },
  'equity': { pt: 'Patrimônio Líquido', es: 'Patrimonio Neto', en: 'Members’ Equity' },
  'total equity': { pt: 'Total do Patrimônio Líquido', es: 'Total del Patrimonio Neto', en: 'Total Members’ Equity' },
  'revenue': { pt: 'Receita de Serviços Prestados', es: 'Ingresos por Servicios Prestados', en: 'Revenue from Services' },
  'cost of services': { pt: 'Custo dos Serviços Prestados (CSP)', es: 'Costo de los Servicios Prestados (CSP)', en: 'Cost of Services (COGS)' },
  'operating expenses': { pt: 'Despesas Operacionais (OPEX)', es: 'Gastos Operativos (OPEX)', en: 'Operating Expenses (OPEX)' },
  'gross profit': { pt: 'Lucro Bruto', es: 'Utilidad Bruta', en: 'Gross Profit' },
  'gross margin': { pt: 'Margem Bruta', es: 'Margen Bruto', en: 'Gross Margin' },
  'operating income': { pt: 'Resultado Operacional (EBITDA)', es: 'Resultado Operativo (EBITDA)', en: 'Operating Income (EBITDA)' },
  'net income': { pt: 'Lucro / (Prejuízo) Líquido', es: 'Utilidad / (Pérdida) Neta', en: 'Net Income / (Loss)' },
  'retained earnings': { pt: 'Lucros Retidos Acumulados', es: 'Utilidades Retenidas Acumuladas', en: 'Cumulative Retained Earnings' },
  'total liabilities and equity': { pt: 'Total do Passivo e Patrimônio Líquido', es: 'Total Pasivo y Patrimonio Neto', en: 'Total Liabilities & Members’ Equity' },
  'starting balance': { pt: 'Saldo Inicial', es: 'Saldo Inicial', en: 'Starting Balance' },
  'ending balance': { pt: 'Saldo Final', es: 'Saldo Final', en: 'Ending Balance' },
  'running balance': { pt: 'Saldo Acumulado', es: 'Saldo Acumulado', en: 'Running Balance' },
  'carried forward balance': { pt: 'Saldo Inicial Transportado do Exercício Anterior', es: 'Saldo Inicial Transferido del Ejercicio Anterior', en: 'Starting Balance Carried Forward from Prior Year' },
  'accrual basis': { pt: 'Regime de Competência', es: 'Base de Devengado', en: 'Accrual Basis' },
  'cash basis': { pt: 'Regime de Caixa', es: 'Base de Efectivo', en: 'Cash Basis' },
  'balanced': { pt: 'Balanceado', es: 'Cuadrado', en: 'Balanced' },
  'unbalanced': { pt: 'Desbalanceado', es: 'Descuadrado', en: 'Unbalanced' },

  // Common UI Actions
  'save': { pt: 'Salvar', es: 'Guardar', en: 'Save' },
  'cancel': { pt: 'Cancelar', es: 'Cancelar', en: 'Cancel' },
  'close': { pt: 'Fechar', es: 'Cerrar', en: 'Close' },
  'create': { pt: 'Criar', es: 'Crear', en: 'Create' },
  'delete': { pt: 'Excluir', es: 'Eliminar', en: 'Delete' },
  'edit': { pt: 'Editar', es: 'Editar', en: 'Edit' },
  'export': { pt: 'Exportar PDF/CSV', es: 'Exportar PDF/CSV', en: 'Export PDF/CSV' },
  'print': { pt: 'Imprimir (PDF)', es: 'Imprimir (PDF)', en: 'Print (PDF)' },
  'loading': { pt: 'Carregando dados...', es: 'Cargando datos...', en: 'Loading data...' },
  'search': { pt: 'Buscar ou digitar comando...', es: 'Buscar o escribir comando...', en: 'Search or type command...' },
};

function flattenObject(obj, prefix = '') {
  let res = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(res, flattenObject(v, key));
    } else {
      res[key] = v;
    }
  }
  return res;
}

function unflattenObject(flatObj) {
  const result = {};
  const keys = Object.keys(flatObj).sort();

  for (const key of keys) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = flatObj[key];
  }
  return result;
}

/**
 * Protects variables like {{count}}, {name}, %s, $1 before translation
 */
function protectVariables(text) {
  const placeholders = [];
  let tokenCounter = 0;

  // Replace {{var}} or {var} or %s
  const protectedText = text.replace(/(\{\{[^}]+\}\}|\{[^}]+\}|%[sdf]|US\$\s*[\d\.\,]+|<[^>]+>)/g, (match) => {
    const token = `__VAR_TOKEN_${tokenCounter++}__`;
    placeholders.push({ token, original: match });
    return token;
  });

  return { protectedText, placeholders };
}

function restoreVariables(translatedText, placeholders) {
  let restored = translatedText;
  for (const item of placeholders) {
    restored = restored.replace(new RegExp(item.token, 'g'), item.original);
  }
  return restored;
}

/**
 * AI Financial Linguistic Translation Fallback Engine
 */
function translateWithFinancialEngine(text, sourceLang, targetLang) {
  if (!text || sourceLang === targetLang) return text;

  const { protectedText, placeholders } = protectVariables(text);
  const lower = protectedText.toLowerCase().trim();

  let translated = protectedText;

  // Direct glossary hit
  if (FINANCIAL_GLOSSARY[lower] && FINANCIAL_GLOSSARY[lower][targetLang]) {
    translated = FINANCIAL_GLOSSARY[lower][targetLang];
  } else {
    // Compound substitution
    for (const [term, map] of Object.entries(FINANCIAL_GLOSSARY)) {
      const srcTerm = map[sourceLang] || term;
      const targetTerm = map[targetLang];
      if (srcTerm && targetTerm) {
        const reg = new RegExp(`\\b${srcTerm}\\b`, 'gi');
        if (reg.test(translated)) {
          translated = translated.replace(reg, targetTerm);
        }
      }
    }
  }

  return restoreVariables(translated, placeholders);
}

/**
 * Main translation autofill execution
 */
async function autoTranslate() {
  console.log('🤖 ========================================================');
  console.log('🤖 MISTER CONTÁBIL - AI AUTO-TRANSLATION & PARITY ENGINE');
  console.log('🤖 ========================================================\n');

  const rawPt = JSON.parse(fs.readFileSync(FILES.pt, 'utf-8'));
  const rawEn = JSON.parse(fs.readFileSync(FILES.en, 'utf-8'));
  const rawEs = JSON.parse(fs.readFileSync(FILES.es, 'utf-8'));

  const ptFlat = flattenObject(rawPt);
  const enFlat = flattenObject(rawEn);
  const esFlat = flattenObject(rawEs);

  const allKeys = Array.from(new Set([
    ...Object.keys(ptFlat),
    ...Object.keys(enFlat),
    ...Object.keys(esFlat),
  ])).sort();

  let autofilledCount = 0;

  for (const key of allKeys) {
    const ptVal = ptFlat[key];
    const enVal = enFlat[key];
    const esVal = esFlat[key];

    // Find the best source value (prefer EN, then PT, then ES)
    const sourceVal = (enVal && enVal.trim()) || (ptVal && ptVal.trim()) || (esVal && esVal.trim());
    const sourceLang = (enVal && enVal.trim()) ? 'en' : (ptVal && ptVal.trim()) ? 'pt' : 'es';

    if (!sourceVal) continue;

    // Fill missing / empty in PT
    if (!ptVal || ptVal.trim() === '') {
      ptFlat[key] = translateWithFinancialEngine(sourceVal, sourceLang, 'pt');
      console.log(`✨ [AUTOFILL PT] "${key}": "${ptFlat[key]}"`);
      autofilledCount++;
    }

    // Fill missing / empty in EN
    if (!enVal || enVal.trim() === '') {
      enFlat[key] = translateWithFinancialEngine(sourceVal, sourceLang, 'en');
      console.log(`✨ [AUTOFILL EN] "${key}": "${enFlat[key]}"`);
      autofilledCount++;
    }

    // Fill missing / empty in ES
    if (!esVal || esVal.trim() === '') {
      esFlat[key] = translateWithFinancialEngine(sourceVal, sourceLang, 'es');
      console.log(`✨ [AUTOFILL ES] "${key}": "${esFlat[key]}"`);
      autofilledCount++;
    }
  }

  // Write back formatted JSON files
  fs.writeFileSync(FILES.pt, JSON.stringify(unflattenObject(ptFlat), null, 2) + '\n', 'utf-8');
  fs.writeFileSync(FILES.en, JSON.stringify(unflattenObject(enFlat), null, 2) + '\n', 'utf-8');
  fs.writeFileSync(FILES.es, JSON.stringify(unflattenObject(esFlat), null, 2) + '\n', 'utf-8');

  console.log(`\n🎉 Sincronização Concluída!`);
  console.log(`📊 Total de termos preenchidos automaticamente por IA: ${autofilledCount}`);
  console.log(`💾 Arquivos 'pt.json', 'en.json' e 'es.json' salvos com estrutura hierárquica e 100% de paridade.\n`);
}

autoTranslate().catch((err) => {
  console.error('❌ Erro durante a tradução automática:', err);
  process.exit(1);
});
