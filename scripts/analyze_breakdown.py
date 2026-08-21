import json
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/i18n_scan_report.json', encoding='utf-8') as f:
    data = json.load(f)

hardcoded = data['hardcoded_sample']
print(f"Total Hardcoded Instances in Scan Sample: {len(hardcoded)}")

by_file = defaultdict(list)
for h in hardcoded:
    by_file[h['file']].append(h)

for f, items in sorted(by_file.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\n=======================================================")
    print(f"File: {f} (Count: {len(items)})")
    print(f"=======================================================")
    for item in items[:12]:
        print(f"  Line {item['line']:3d}: [{item['type']}] \"{item['text']}\"")
    if len(items) > 12:
        print(f"  ... and {len(items)-12} more occurrences")
