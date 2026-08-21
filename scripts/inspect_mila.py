import os
import zipfile
import xml.etree.ElementTree as ET
import glob

mila_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'mila')
files = glob.glob(os.path.join(mila_dir, '*.xlsx'))

print(f"Found {len(files)} files in {mila_dir}:")

def parse_xlsx(file_path):
    print(f"\n=======================================================")
    print(f"FILE: {os.path.basename(file_path)} ({os.path.getsize(file_path)} bytes)")
    print(f"=======================================================")
    
    with zipfile.ZipFile(file_path, 'r') as z:
        # Get shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text_elems = si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                shared_strings.append("".join([t.text or "" for t in text_elems]))
        
        # Get sheet1
        sheet_files = [f for f in z.namelist() if f.startswith('xl/worksheets/sheet') and f.endswith('.xml')]
        for sfile in sheet_files:
            print(f"--- Sheet: {sfile} ---")
            tree = ET.fromstring(z.read(sfile))
            rows = tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
            print(f"Total rows: {len(rows)}")
            
            for row_idx, row in enumerate(rows[:30]): # Show first 30 rows
                row_data = []
                for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    val = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    t = c.attrib.get('t')
                    if val is not None and val.text:
                        if t == 's': # shared string
                            idx = int(val.text)
                            row_data.append(shared_strings[idx] if idx < len(shared_strings) else val.text)
                        else:
                            row_data.append(val.text)
                    else:
                        row_data.append("")
                print(f"Row {row_idx+1}: {row_data}")
            
            if len(rows) > 30:
                print(f"... [{len(rows) - 30} more rows]")
                # Print last 5 rows
                print("Last 5 rows:")
                for row_idx, row in enumerate(rows[-5:], start=len(rows)-4):
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
                    print(f"Row {row_idx}: {row_data}")

for f in sorted(files):
    parse_xlsx(f)
