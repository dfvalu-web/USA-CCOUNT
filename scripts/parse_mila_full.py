import os
import zipfile
import xml.etree.ElementTree as ET
import glob
import json
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

mila_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'mila')
files = glob.glob(os.path.join(mila_dir, '*.xlsx'))

full_dossier = {}

def parse_xlsx(file_path):
    file_name = os.path.basename(file_path)
    print(f"\n=======================================================")
    print(f"PARSING: {file_name}")
    print(f"=======================================================")
    
    with zipfile.ZipFile(file_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text_elems = si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                shared_strings.append("".join([t.text or "" for t in text_elems]))
        
        sheet_files = [f for f in z.namelist() if f.startswith('xl/worksheets/sheet') and f.endswith('.xml')]
        sheets_data = {}
        for sfile in sheet_files:
            tree = ET.fromstring(z.read(sfile))
            rows = tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
            all_rows = []
            for row in rows:
                row_data = []
                for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    val = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    t = c.attrib.get('t')
                    if val is not None and val.text:
                        if t == 's':
                            idx = int(val.text)
                            row_data.append(shared_strings[idx] if idx < len(shared_strings) else val.text)
                        else:
                            row_data.append(val.text)
                    else:
                        row_data.append("")
                all_rows.append(row_data)
            sheets_data[sfile] = all_rows
            print(f"Sheet {sfile}: {len(all_rows)} rows parsed.")
            
            # Print sample rows safely
            for idx, r in enumerate(all_rows[:15]):
                print(f"  R{idx+1}: {r}")
            if len(all_rows) > 15:
                print(f"  ... [Total {len(all_rows)} rows]")
                for idx, r in enumerate(all_rows[-5:], start=len(all_rows)-4):
                    print(f"  R{idx}: {r}")
                    
        full_dossier[file_name] = sheets_data

for f in sorted(files):
    parse_xlsx(f)

output_json = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mila_parsed_dossier.json')
with open(output_json, 'w', encoding='utf-8') as jf:
    json.dump(full_dossier, jf, indent=2, ensure_ascii=False)

print(f"\n[OK] Full dossier saved to {output_json}")
