"""Render every exported PDF page for visual QA (pypdfium2 + Pillow)."""
from pathlib import Path
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image,ImageDraw
import json
root=Path(__file__).resolve().parents[1]
qa=root/'output/qa';qa.mkdir(exist_ok=True,parents=True)
mapping=json.loads((root/'lecture01-map.json').read_text())
for kind,expected in [('handout',len(mapping)),('steps',sum(s['clicks']+1 for s in mapping))]:
 path=root/f'output/pdf/lecture01-{kind}.pdf'
 doc=pdfium.PdfDocument(str(path));reader=PdfReader(path)
 assert len(doc)==expected,(kind,len(doc),expected)
 texts=[p.extract_text() for p in reader.pages]
 assert not any('$' in t for t in texts), f'{kind}: unrendered math delimiter in PDF'
 (qa/f'{kind}-text.txt').write_text('\n\n'.join(f'PAGE {i+1}\n{t}' for i,t in enumerate(texts)))
 for start in range(0,len(doc),12):
  sheet=Image.new('RGB',(1600,((min(12,len(doc)-start)+3)//4)*249),'#dbe2e8');draw=ImageDraw.Draw(sheet)
  for j,i in enumerate(range(start,min(start+12,len(doc)))):
   im=doc[i].render(scale=1.25).to_pil();im.thumbnail((396,223));x=j%4*400;y=j//4*249;sheet.paste(im,(x,y));draw.text((x+5,y+226),f'{kind} {i+1}',fill='black')
  sheet.save(qa/f'{kind}-contact-{start//12}.png')
 print(kind,len(doc),'pages')
