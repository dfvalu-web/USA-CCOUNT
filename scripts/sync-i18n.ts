import fs from 'fs';
import path from 'path';
import { AutoTranslator } from '../src/lib/i18n/auto-translator';

function syncI18n() {
  const localesDir = path.join(__dirname, '..', 'src', 'locales');
  const enPath = path.join(localesDir, 'en.json');
  const ptPath = path.join(localesDir, 'pt.json');
  const esPath = path.join(localesDir, 'es.json');

  console.log('🌐 Starting Automatic i18n Dictionary Synchronization...');

  const enDict = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const ptDict = fs.existsSync(ptPath) ? JSON.parse(fs.readFileSync(ptPath, 'utf-8')) : {};
  const esDict = fs.existsSync(esPath) ? JSON.parse(fs.readFileSync(esPath, 'utf-8')) : {};

  // Synchronize Portuguese
  const updatedPt = AutoTranslator.syncObject(enDict, ptDict, 'pt');
  fs.writeFileSync(ptPath, JSON.stringify(updatedPt, null, 2) + '\n', 'utf-8');
  console.log('✅ Portuguese (pt.json) synchronized and auto-translated.');

  // Synchronize Spanish
  const updatedEs = AutoTranslator.syncObject(enDict, esDict, 'es');
  fs.writeFileSync(esPath, JSON.stringify(updatedEs, null, 2) + '\n', 'utf-8');
  console.log('✅ Spanish (es.json) synchronized and auto-translated.');

  console.log('🎉 i18n synchronization complete! 100% dictionary coverage achieved.');
}

syncI18n();
