import os
import re
import json

def audit_i18n():
    # 1. Parity Audit
    with open('src/locales/en.json', encoding='utf-8') as f:
        en = json.load(f)
    with open('src/locales/pt.json', encoding='utf-8') as f:
        pt = json.load(f)
    with open('src/locales/es.json', encoding='utf-8') as f:
        es = json.load(f)

    def get_all_keys(d, prefix=''):
        keys = {}
        for k, v in d.items():
            full = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(get_all_keys(v, full))
            else:
                keys[full] = v
        return keys

    en_dict = get_all_keys(en)
    pt_dict = get_all_keys(pt)
    es_dict = get_all_keys(es)

    all_keys = sorted(list(set(en_dict.keys()) | set(pt_dict.keys()) | set(es_dict.keys())))

    discrepancies = []
    for k in all_keys:
        en_val = en_dict.get(k)
        pt_val = pt_dict.get(k)
        es_val = es_dict.get(k)
        
        status = []
        if en_val is None or en_val == "":
            status.append("MISSING_EN")
        if pt_val is None or pt_val == "":
            status.append("MISSING_PT")
        if es_val is None or es_val == "":
            status.append("MISSING_ES")
            
        discrepancies.append({
            "key": k,
            "en": en_val,
            "pt": pt_val,
            "es": es_val,
            "status": status if status else ["OK"]
        })

    # 2. Hardcoded scan in source
    hardcoded = []
    
    # Financial reports specific files
    financial_report_files = [
        'src/components/accounting/BalanceSheetView.tsx',
        'src/components/accounting/IncomeStatementView.tsx',
        'src/components/accounting/GeneralLedgerView.tsx',
        'src/components/accounting/TrialBalanceTable.tsx',
        'src/components/accounting/JournalEntriesView.tsx',
        'src/components/accounting/PrintReportHeader.tsx',
        'src/lib/accounting/financial-statements.ts',
        'src/components/layout/Sidebar.tsx',
        'src/components/layout/Header.tsx',
        'src/components/dashboard/ExecutiveCockpit.tsx',
        'src/components/tax/TaxComplianceView.tsx',
        'src/components/tax/CpaTaxBinderView.tsx',
        'src/components/tax/YearEndTaxFormsView.tsx',
        'src/components/tax/StateFranchiseTaxView.tsx',
        'src/components/accounting/SmartReconciliationHub.tsx',
        'src/components/auth/LoginView.tsx',
        'src/components/auth/RegisterView.tsx',
        'src/components/landing/LandingHeader.tsx',
        'src/components/landing/HeroSection.tsx',
        'src/components/landing/InteractiveLedgerTeaser.tsx',
        'src/components/landing/FeatureGrid.tsx',
        'src/components/landing/PricingSection.tsx',
        'src/components/landing/TrustSecuritySection.tsx',
        'src/components/landing/LandingFooter.tsx'
    ]

    for rel_path in financial_report_files:
        full_path = os.path.normpath(rel_path)
        if not os.path.exists(full_path):
            continue
        with open(full_path, encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            
        for line_num, line in enumerate(lines, 1):
            clean = line.strip()
            if clean.startswith('//') or clean.startswith('/*') or clean.startswith('*'):
                continue
                
            # Detect raw strings in JSX
            # e.g., <span>Texto</span> or CardTitle or buttons
            matches = re.findall(r'>([^<>{}\n]+)<', line)
            for m in matches:
                txt = m.strip()
                if len(txt) > 2 and not txt.isdigit() and not re.match(r'^[0-9\.\,\$\s\-\+\/\%\:\(\)\#\•\✓\—\→\➔\•]+$', txt):
                    if not txt.startswith('&') and not txt.startswith('jwt_'):
                        hardcoded.append({
                            "file": rel_path,
                            "line": line_num,
                            "text": txt,
                            "type": "JSX_CONTENT"
                        })
                        
            # Detect string literals in attributes (title="", label="", description="", placeholder="", reportTitle="", etc.)
            attr_matches = re.findall(r'(?:title|description|label|placeholder|header|reportTitle|reportSubtitle|badge)\s*=\s*["\']([^"\']{3,})["\']', line)
            for txt in attr_matches:
                if not txt.startswith('/') and not txt.startswith('http') and not txt.startswith('text-') and not txt.startswith('bg-'):
                    hardcoded.append({
                        "file": rel_path,
                        "line": line_num,
                        "text": txt,
                        "type": "ATTR_LITERAL"
                    })

    # Summary
    print(f"=== I18N DEEP SCAN RESULTS ===")
    print(f"Dictionary Keys: {len(all_keys)}")
    missing_count = sum(1 for d in discrepancies if d['status'] != ['OK'])
    print(f"Dictionary Key Missing/Empty: {missing_count}")
    print(f"Hardcoded occurrences in key components: {len(hardcoded)}")

    # Save detailed JSON for analysis
    with open('scripts/i18n_scan_report.json', 'w', encoding='utf-8') as out:
        json.dump({
            "discrepancies": discrepancies,
            "hardcoded_count": len(hardcoded),
            "hardcoded_sample": hardcoded
        }, out, indent=2, ensure_ascii=False)

    print("Saved report to scripts/i18n_scan_report.json")

if __name__ == '__main__':
    audit_i18n()
