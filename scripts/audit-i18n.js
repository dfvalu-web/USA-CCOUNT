/**
 * Mister Contábil / UAS Accounting - Continuous i18n Parity Audit Script
 * Verifies 100% key parity and non-empty values across pt.json, en.json, and es.json
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales');
const FILES = {
  pt: path.join(LOCALES_DIR, 'pt.json'),
  en: path.join(LOCALES_DIR, 'en.json'),
  es: path.join(LOCALES_DIR, 'es.json'),
};

function flattenKeys(obj, prefix = '') {
  let keys = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(keys, flattenKeys(value, fullKey));
    } else {
      keys[fullKey] = value;
    }
  }
  return keys;
}

function loadLocale(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [i18n-audit] Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`❌ [i18n-audit] Erro de sintaxe JSON no arquivo: ${filePath}\n`, err.message);
    process.exit(1);
  }
}

function runAudit() {
  console.log('🌐 ========================================================');
  console.log('🌐 AUDITORIA DE PARIDADE E INTEGRIDADE i18n (PT / EN / ES)');
  console.log('🌐 ========================================================\n');

  const dicts = {
    pt: flattenKeys(loadLocale(FILES.pt)),
    en: flattenKeys(loadLocale(FILES.en)),
    es: flattenKeys(loadLocale(FILES.es)),
  };

  const allKeySet = new Set([
    ...Object.keys(dicts.pt),
    ...Object.keys(dicts.en),
    ...Object.keys(dicts.es),
  ]);

  const allKeys = Array.from(allKeySet).sort();
  console.log(`📦 Total de chaves únicas catalogadas: ${allKeys.length}`);
  console.log(`🇧🇷 Chaves em pt.json: ${Object.keys(dicts.pt).length}`);
  console.log(`🇺🇸 Chaves em en.json: ${Object.keys(dicts.en).length}`);
  console.log(`🇪🇸 Chaves em es.json: ${Object.keys(dicts.es).length}\n`);

  const errors = [];

  for (const key of allKeys) {
    const ptVal = dicts.pt[key];
    const enVal = dicts.en[key];
    const esVal = dicts.es[key];

    // 1. Check existence
    if (ptVal === undefined) {
      errors.push(`[MISSING_KEY] 🇧🇷 Chave ausente em pt.json: "${key}"`);
    }
    if (enVal === undefined) {
      errors.push(`[MISSING_KEY] 🇺🇸 Chave ausente em en.json: "${key}"`);
    }
    if (esVal === undefined) {
      errors.push(`[MISSING_KEY] 🇪🇸 Chave ausente em es.json: "${key}"`);
    }

    // 2. Check empty values
    if (typeof ptVal === 'string' && ptVal.trim() === '') {
      errors.push(`[EMPTY_VALUE] 🇧🇷 Valor vazio em pt.json: "${key}"`);
    }
    if (typeof enVal === 'string' && enVal.trim() === '') {
      errors.push(`[EMPTY_VALUE] 🇺🇸 Valor vazio em en.json: "${key}"`);
    }
    if (typeof esVal === 'string' && esVal.trim() === '') {
      errors.push(`[EMPTY_VALUE] 🇪🇸 Valor vazio em es.json: "${key}"`);
    }
  }

  if (errors.length > 0) {
    console.error(`❌ FALHA NA AUDITORIA: Foram encontradas ${errors.length} inconsistências linguísticas:\n`);
    errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    console.error('\n🚫 O build e os PRs estão bloqueados até que 100% da paridade seja restabelecida.');
    process.exit(1);
  }

  console.log('✅ SUCESSO: 100% de paridade e integridade confirmadas entre Português, Inglês e Espanhol!');
  console.log('✨ Nenhuma chave ausente ou vazia detectada nos dicionários.\n');
  process.exit(0);
}

runAudit();
