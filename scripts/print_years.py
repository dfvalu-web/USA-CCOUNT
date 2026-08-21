import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/mila_forensic_summary.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Company: {data['company']}")
print("\nYear by Year Summary:")
for yr, val in sorted(data['years'].items()):
    print(f"Year {yr}: {val['date_min']} to {val['date_max']} | Lines: {val['tx_count']} | Debits: ${val['total_debits']:,.2f} | Credits: ${val['total_credits']:,.2f}")
