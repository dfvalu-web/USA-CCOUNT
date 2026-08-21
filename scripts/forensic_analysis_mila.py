import os
import json
import sys
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

dossier_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mila_parsed_dossier.json')
with open(dossier_path, 'r', encoding='utf-8') as f:
    dossier = json.load(f)

journal_rows = dossier.get('Journal.xlsx', {}).get('xl/worksheets/sheet1.xml', [])
gl_rows = dossier.get('General_ledger.xlsx', {}).get('xl/worksheets/sheet1.xml', [])
customers_rows = dossier.get('Customers.xlsx', {}).get('xl/worksheets/sheet1.xml', [])
employees_rows = dossier.get('Employees.xlsx', {}).get('xl/worksheets/sheet1.xml', [])
vendors_rows = dossier.get('Vendors.xlsx', {}).get('xl/worksheets/sheet1.xml', [])

print(f"Loaded {len(journal_rows)} journal rows, {len(gl_rows)} GL rows.")

# 1. Analyze Journal entries by Year
yearly_summary = defaultdict(lambda: {
    'total_debits': 0.0,
    'total_credits': 0.0,
    'tx_count': 0,
    'accounts': defaultdict(float),
    'tx_types': defaultdict(int),
    'date_min': None,
    'date_max': None
})

current_date = ""
for r in journal_rows[4:]: # skip headers
    if not r: continue
    date_val = r[0] if len(r) > 0 else ""
    if date_val and '/' in date_val:
        current_date = date_val
    
    debit_str = r[6] if len(r) > 6 else ""
    credit_str = r[7] if len(r) > 7 else ""
    acct = r[5] if len(r) > 5 else ""
    tx_type = r[1] if len(r) > 1 else ""

    if current_date and '/' in current_date:
        parts = current_date.split('/')
        if len(parts) == 3:
            try:
                year = int(parts[2])
                if year < 100:
                    year += 2000
                
                debit = float(debit_str) if debit_str and debit_str.replace('.', '', 1).replace('-', '', 1).isdigit() else 0.0
                credit = float(credit_str) if credit_str and credit_str.replace('.', '', 1).replace('-', '', 1).isdigit() else 0.0
                
                yearly_summary[year]['total_debits'] += debit
                yearly_summary[year]['total_credits'] += credit
                yearly_summary[year]['tx_count'] += 1
                if tx_type:
                    yearly_summary[year]['tx_types'][tx_type] += 1
                if acct:
                    # Clean account name
                    clean_acct = acct.replace('\u2120', 'SM')
                    yearly_summary[year]['accounts'][clean_acct] += (debit - credit)
                
                # dates
                if yearly_summary[year]['date_min'] is None or current_date < yearly_summary[year]['date_min']:
                    yearly_summary[year]['date_min'] = current_date
                if yearly_summary[year]['date_max'] is None or current_date > yearly_summary[year]['date_max']:
                    yearly_summary[year]['date_max'] = current_date
            except Exception as e:
                pass

print("\n=======================================================")
print("YEARLY TRANSACTION BREAKDOWN IN QUICKBOOKS (Milla Maid Services LLC)")
print("=======================================================")
for yr in sorted(yearly_summary.keys()):
    data = yearly_summary[yr]
    print(f"\n--- ANO: {yr} ---")
    print(f"  Período: {data['date_min']} até {data['date_max']}")
    print(f"  Total Linhas de Lançamento: {data['tx_count']}")
    print(f"  Total Débitos: ${data['total_debits']:,.2f}")
    print(f"  Total Créditos: ${data['total_credits']:,.2f}")
    print(f"  Discrepância / Variância: ${abs(data['total_debits'] - data['total_credits']):,.2f}")
    print(f"  Tipos de Transações: {dict(data['tx_types'])}")
    top_accts = sorted(data['accounts'].items(), key=lambda x: abs(x[1]), reverse=True)[:5]
    print(f"  Top Contas Movimentadas: {top_accts}")

print("\n=======================================================")
print("CUSTOMERS, EMPLOYEES & VENDORS AUDIT")
print("=======================================================")
print(f"Total Clientes Cadastrados: {len(customers_rows)}")
print(f"Total Colaboradores (W-2): {len(employees_rows)}")
print(f"Total Fornecedores / Prestadores (1099/Vendors): {len(vendors_rows)}")

# Output to JSON summary as well
summary_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mila_forensic_summary.json')
with open(summary_json, 'w', encoding='utf-8') as f:
    json.dump({
        'company': 'Milla Maid Services LLC',
        'years': {str(k): {
            'total_debits': v['total_debits'],
            'total_credits': v['total_credits'],
            'tx_count': v['tx_count'],
            'tx_types': dict(v['tx_types']),
            'date_min': v['date_min'],
            'date_max': v['date_max'],
            'top_accounts': sorted(v['accounts'].items(), key=lambda x: abs(x[1]), reverse=True)[:10]
        } for k, v in yearly_summary.items()}
    }, f, indent=2, ensure_ascii=False)

print(f"\nSaved summary to {summary_json}")
