import json
import os
import sys
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/mila_parsed_dossier.json', 'r', encoding='utf-8') as f:
    dossier = json.load(f)

journal_rows = dossier.get('Journal.xlsx', {}).get('xl/worksheets/sheet1.xml', [])

# Map transactions to P&L vs Balance Sheet categories
yearly_pnl = defaultdict(lambda: {
    'revenue': 0.0,
    'cogs_subcontractors': 0.0,
    'cogs_supplies': 0.0,
    'gross_profit': 0.0,
    'payroll_wages': 0.0,
    'payroll_taxes': 0.0,
    'advertising': 0.0,
    'vehicle_expenses': 0.0,
    'legal_accounting': 0.0,
    'insurance': 0.0,
    'software_it': 0.0,
    'rent_facilities': 0.0,
    'bank_merchant_fees': 0.0,
    'other_expenses': 0.0,
    'total_opex': 0.0,
    'net_income': 0.0,
    'draws_distributions': 0.0,
    'uncategorized': 0.0,
    'bank_balances': defaultdict(float),
    'accounts_breakdown': defaultdict(float)
})

current_date = ""
for r in journal_rows[4:]:
    if not r: continue
    date_val = r[0] if len(r) > 0 else ""
    if date_val and '/' in date_val:
        current_date = date_val
    
    debit_str = r[6] if len(r) > 6 else ""
    credit_str = r[7] if len(r) > 7 else ""
    acct = r[5] if len(r) > 5 else ""
    name = r[3] if len(r) > 3 else ""
    memo = r[4] if len(r) > 4 else ""

    if current_date and '/' in current_date:
        parts = current_date.split('/')
        if len(parts) == 3:
            try:
                year = int(parts[2])
                if year < 100: year += 2000
                
                debit = float(debit_str) if debit_str and debit_str.replace('.', '', 1).replace('-', '', 1).isdigit() else 0.0
                credit = float(credit_str) if credit_str and credit_str.replace('.', '', 1).replace('-', '', 1).isdigit() else 0.0
                net = debit - credit
                
                clean_acct = acct.lower().replace('\u2120', '').strip()
                yearly_pnl[year]['accounts_breakdown'][acct] += net
                
                # Categorization
                if any(x in clean_acct for x in ['sales', 'cleaning services', 'maintenance services', 'housecall pro tips', 'income']):
                    # Revenue accounts normally have credit balance
                    yearly_pnl[year]['revenue'] += (credit - debit)
                elif 'subcontractor' in clean_acct:
                    yearly_pnl[year]['cogs_subcontractors'] += (debit - credit)
                elif 'supplies' in clean_acct:
                    yearly_pnl[year]['cogs_supplies'] += (debit - credit)
                elif 'payroll wage' in clean_acct or 'wages' in clean_acct:
                    yearly_pnl[year]['payroll_wages'] += (debit - credit)
                elif 'payroll tax' in clean_acct or 'employer tax' in clean_acct:
                    yearly_pnl[year]['payroll_taxes'] += (debit - credit)
                elif 'advertising' in clean_acct or 'marketing' in clean_acct:
                    yearly_pnl[year]['advertising'] += (debit - credit)
                elif 'vehicle' in clean_acct or 'auto' in clean_acct or 'gas' in clean_acct:
                    yearly_pnl[year]['vehicle_expenses'] += (debit - credit)
                elif 'legal' in clean_acct or 'accounting' in clean_acct or 'cpa' in clean_acct:
                    yearly_pnl[year]['legal_accounting'] += (debit - credit)
                elif 'insurance' in clean_acct:
                    yearly_pnl[year]['insurance'] += (debit - credit)
                elif 'software' in clean_acct or 'app' in clean_acct or 'subscription' in clean_acct:
                    yearly_pnl[year]['software_it'] += (debit - credit)
                elif 'rent' in clean_acct or 'lease' in clean_acct:
                    yearly_pnl[year]['rent_facilities'] += (debit - credit)
                elif 'bank charge' in clean_acct or 'merchant fee' in clean_acct or 'quickbooks payments' in clean_acct or 'finance charge' in clean_acct:
                    yearly_pnl[year]['bank_merchant_fees'] += (debit - credit)
                elif 'draw' in clean_acct or 'distribution' in clean_acct or 'owner' in clean_acct or 'personal' in clean_acct:
                    yearly_pnl[year]['draws_distributions'] += (debit - credit)
                elif 'uncategorized' in clean_acct or 'ask my accountant' in clean_acct:
                    yearly_pnl[year]['uncategorized'] += (debit - credit)
                elif any(x in clean_acct for x in ['checking', 'money market', 'cash', 'signify', 'bank']):
                    yearly_pnl[year]['bank_balances'][acct] += (debit - credit)
                else:
                    if 'expense' in clean_acct or 'fee' in clean_acct or 'cost' in clean_acct:
                        yearly_pnl[year]['other_expenses'] += (debit - credit)
            except Exception as e:
                pass

print("\n" + "="*80)
print("DEMONSTRAÇÃO DO RESULTADO HISTÓRICA RECONSTRUÍDA (2021 A 2026)")
print("="*80)

for yr in sorted(yearly_pnl.keys()):
    p = yearly_pnl[yr]
    cogs = p['cogs_subcontractors'] + p['cogs_supplies']
    gp = p['revenue'] - cogs
    opex = (p['payroll_wages'] + p['payroll_taxes'] + p['advertising'] + 
            p['vehicle_expenses'] + p['legal_accounting'] + p['insurance'] + 
            p['software_it'] + p['rent_facilities'] + p['bank_merchant_fees'] + 
            p['other_expenses'] + p['uncategorized'])
    net = gp - opex
    
    print(f"\n====================================")
    print(f"📊 EXERCÍCIO FISCAL: {yr}")
    print(f"====================================")
    print(f" (+) Receita Bruta de Serviços:          ${p['revenue']:>12,.2f}")
    print(f" (-) Custos Diretos (COGS):              ${cogs:>12,.2f}")
    print(f"     • Subcontratados / Terceiros (1099): ${p['cogs_subcontractors']:>12,.2f}")
    print(f"     • Insumos & Produtos de Limpeza:     ${p['cogs_supplies']:>12,.2f}")
    print(f" (=) Lucro Bruto (Gross Profit):         ${gp:>12,.2f}  (Margem: {(gp/p['revenue']*100 if p['revenue']>0 else 0):.1f}%)")
    print(f" (-) Despesas Operacionais (OPEX):       ${opex:>12,.2f}")
    print(f"     • Folha de Pagamento (W-2 Wages):   ${p['payroll_wages']:>12,.2f}")
    print(f"     • Encargos da Folha (Payroll Tax):  ${p['payroll_taxes']:>12,.2f}")
    print(f"     • Veículos, Combustível & Manut.:   ${p['vehicle_expenses']:>12,.2f}")
    print(f"     • Marketing, Ads & Google/FB:       ${p['advertising']:>12,.2f}")
    print(f"     • Honorários Jurídicos / Contábeis: ${p['legal_accounting']:>12,.2f}")
    print(f"     • Seguros Comerciais (General Liab):${p['insurance']:>12,.2f}")
    print(f"     • Softwares, Housecall Pro & Cloud: ${p['software_it']:>12,.2f}")
    print(f"     • Aluguel & Espaço Operacional:     ${p['rent_facilities']:>12,.2f}")
    print(f"     • Tarifas Bancárias & Stripe/QBO:   ${p['bank_merchant_fees']:>12,.2f}")
    print(f"     • Despesas Não Categorizadas:       ${p['uncategorized']:>12,.2f}")
    print(f"     • Outras Despesas Gerais & Admin:   ${p['other_expenses']:>12,.2f}")
    print(f"----------------------------------------------------")
    print(f" (=) LUCRO LÍQUIDO US GAAP (Net Income): ${net:>12,.2f}  (Margem: {(net/p['revenue']*100 if p['revenue']>0 else 0):.1f}%)")
    print(f" (i) Retiradas dos Sócios (Draws):       ${p['draws_distributions']:>12,.2f}")
