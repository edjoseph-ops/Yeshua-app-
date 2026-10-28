#!/usr/bin/env python3
"""
Convertit un texte biblique vers le format de Yeshua : data/bibles/<ID>.json

Formats d'entrée (détectés automatiquement) :
  .json  « scrollmapper » : {"books":[{"name":..,"chapters":[{"chapter":1,"verses":[{"verse":1,"text":".."}]}]}]}
  .xml   « beblia »       : <bible><testament><book number="1"><chapter number="1"><verse number="1">..</verse>
  .csv                    : livre(1-66), chapitre, verset, texte

Utilisation :
  python3 tools/import_bible.py LSG  chemin/vers/FrenchBible.xml
  python3 tools/import_bible.py KJV  chemin/vers/KJV.json "King James Version"

Les 66 livres doivent être dans l'ordre canonique protestant (Genèse → Apocalypse).
N'importez que des textes du domaine public ou pour lesquels vous avez une licence.
"""
import csv, json, os, sys
import xml.etree.ElementTree as ET

# chapitres attendus par livre (1189 au total)
CH = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
      28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22]

def finish(raw):
    """raw[b][c] = {numéro_verset: texte}  ->  {b: {c: [textes]}} (trous = "")"""
    out = {}
    for b, chs in raw.items():
        for c, vs in chs.items():
            if 0 in vs and vs[0].strip():          # titre de psaume rangé au verset 0
                vs[1] = (vs[0].strip() + " " + vs.get(1, "")).strip()
            top = max([k for k in vs if k > 0] or [0])
            out.setdefault(str(b), {})[str(c)] = [" ".join(vs.get(i, "").split()) for i in range(1, top + 1)]
    return out

def from_json(path):
    d = json.load(open(path, encoding="utf-8"))
    raw = {}
    for i, bk in enumerate(d["books"][:66], start=1):
        for ch in bk["chapters"]:
            for v in ch["verses"]:
                t = v["text"]
                raw.setdefault(i, {}).setdefault(int(ch["chapter"]), {})
                n = int(v["verse"])
                raw[i][int(ch["chapter"])][n] = (raw[i][int(ch["chapter"])].get(n, "") + " " + t).strip()
    return raw, d.get("translation", "")

def from_xml(path):
    root = ET.parse(path).getroot()
    raw = {}
    for bk in root.iter("book"):
        b = int(bk.get("number"))
        if b > 66: continue
        for ch in bk.iter("chapter"):
            c = int(ch.get("number"))
            for v in ch.iter("verse"):
                n = int(v.get("number")); t = "".join(v.itertext())
                raw.setdefault(b, {}).setdefault(c, {})
                raw[b][c][n] = (raw[b][c].get(n, "") + " " + t).strip()
    return raw, root.get("translation", "")

def from_csv(path):
    raw = {}
    with open(path, encoding="utf-8", newline="") as f:
        for row in csv.reader(f):
            try: b, c, v, t = int(row[0]), int(row[1]), int(row[2]), row[3]
            except (ValueError, IndexError): continue
            raw.setdefault(b, {}).setdefault(c, {})[v] = t.strip()
    return raw, ""

def report(books):
    nv = sum(1 for b in books.values() for c in b.values() for t in c if t)
    missing = [(b, c) for b in range(1, 67) for c in range(1, CH[b-1] + 1) if not any(books.get(str(b), {}).get(str(c), []))]
    return nv, missing

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    vid, src = sys.argv[1].upper(), sys.argv[2]
    ext = os.path.splitext(src)[1].lower()
    raw, title = (from_xml if ext == ".xml" else from_csv if ext == ".csv" else from_json)(src)
    books = finish(raw)
    nv, missing = report(books)
    dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "bibles", vid + ".json")
    # un fichier par livre (data/bibles/ID/N.json) : l'application ne charge que le livre lu (peu de mémoire)
    ddir = os.path.join(os.path.dirname(dest), vid); os.makedirs(ddir, exist_ok=True)
    for b, chs in books.items():
        json.dump(chs, open(os.path.join(ddir, str(b) + ".json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    idx = os.path.join(os.path.dirname(dest), "index.json")   # liste des versions installées
    try: ids = json.load(open(idx, encoding="utf-8"))
    except Exception: ids = []
    json.dump(sorted(set(ids + [vid])), open(idx, "w", encoding="utf-8"))
    print(f"{vid}: {len(books)} livres, {nv} versets non vides, {len(missing)} chapitres vides/absents -> {os.path.normpath(ddir)}")
    if missing:
        print("  chapitres manquants (livre,chapitre) :", missing[:12], "..." if len(missing) > 12 else "")
    if len(books) != 66 or nv < 30000:
        print("  Attention : ce texte ne ressemble pas à une Bible complète (≈ 31 100 versets).")

if __name__ == "__main__":
    main()
