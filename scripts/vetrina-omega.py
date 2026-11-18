"""Omega Speedmaster Moonwatch: cofanetto senza lancette su fondo trasparente, ravvicinata, lancette ritagliate.

Le lancette generate a parte venivano ad ago, diverse da quelle vere: qui ore, minuti e cronografo sono ritagliati
dalla ravvicinata CON le lancette, confrontandola con quella SENZA (stessa foto, le lancette sono la differenza).
Ore e minuti vengono raddrizzati sulle 12; il cronografo resta fermo sulle 12 e va sopra (sprite "fermo").

Uso (dalla cartella del progetto): python3 scripts/vetrina-omega.py
poi: node scripts/vetrina.mjs /tmp/omega-trasparente.png omega 6.15 513,925,99.3
"""
import numpy as np
from PIL import Image
from scipy import ndimage as nd

OUT = 512
PIV = (507.0, 697.0)   # perno sulla ravvicinata
R = 340.0              # raggio di riferimento sulla ravvicinata (nel cofanetto 99,3 px: scala 0,292 misurata)
ANG = {"ore": 304.1, "minuti": 53.2}   # angolo delle lancette nella foto (gradi in senso orario dalle 12)
PUB = "public/vetrina/"
V = "VETRINA/omega"

# 1. cofanetto: tolgo il bianco e l'ombra grigia collegati al bordo
a = np.asarray(Image.open(V + "-senza-lancette.webp").convert("RGB")).astype(float)
mn, mx = a.min(2), a.max(2)
bgish = (mn > 168) & (mx - mn < 14)
lab, _ = nd.label(bgish)
ids = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
inside = ~np.isin(lab, list(ids))
inside = nd.binary_opening(inside, iterations=1)
lab2, n2 = nd.label(inside)
inside = nd.binary_fill_holes(lab2 == np.argmax(nd.sum(inside, lab2, range(1, n2 + 1))) + 1)
alpha = np.clip((nd.gaussian_filter(inside.astype(float), 0.8) - 0.15) / 0.7, 0, 1)
Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8), "RGBA").save("/tmp/omega-trasparente.png")

# 2. ravvicinata senza lancette centrali
Image.open(V + "-vicino-senza-lancette.webp").convert("RGB").save(PUB + "omega-vicino.webp", quality=88, method=6)

# 3. lancette: differenza tra le due ravvicinate (lancette chiare sul quadrante nero)
A = np.asarray(Image.open(V + "-vicino.webp").convert("RGB")).astype(float)
C = np.asarray(Image.open(V + "-vicino-senza-lancette.webp").convert("RGB")).astype(float)
px, py = PIV
yy, xx = np.mgrid[: A.shape[0], : A.shape[1]]
r = np.hypot(xx - px, yy - py)
ang = np.degrees(np.arctan2(xx - px, -(yy - py))) % 360
al = np.clip((A.mean(2) - C.mean(2) - 12) / 110, 0, 1) * (r < 345)
al = nd.median_filter(al, 3)
al[al < 0.06] = 0
col = np.clip(C + (A - C) / np.clip(al, 0.05, 1)[..., None], 0, 255)

def sprite(mask, rot, name):
    m = nd.gaussian_filter(mask.astype(float), 0.6)
    img = Image.fromarray(np.dstack([col, al * m * 255]).astype(np.uint8), "RGBA")
    box = (int(round(px - R)), int(round(py - R)), int(round(px + R)), int(round(py + R)))
    sq = img.crop(box).rotate(rot, resample=Image.BICUBIC).resize((OUT, OUT), Image.LANCZOS)
    sq.save(PUB + f"omega-{name}.webp", quality=92, alpha_quality=95, method=6)
    print(name)

dx = np.abs(xx - px)
crono = ((dx < 17) & ((ang < 8) | (ang > 352) | ((ang > 172) & (ang < 188)))) | (r < 30)
for name in ("ore", "minuti"):
    a0 = ANG[name]
    d = (ang - a0 + 180) % 360 - 180
    sprite((np.abs(d) < 14) & (r > 22) & ~crono, a0, name)   # rotate() gira in senso antiorario: torna sulle 12
sprite(crono, 0, "crono")
print("vicino", {"x": round(px / 1024 * 100, 2), "y": round(py / 1536 * 100, 2), "r": round(R / 1024 * 100, 2)})
