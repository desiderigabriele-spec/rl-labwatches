"""Tudor Black Bay 41 (79230R): cofanetto senza lancette su fondo trasparente, ravvicinata, lancette alla scala della ravvicinata.

Uso (dalla cartella del progetto): python3 scripts/vetrina-audemars-piguet.py
poi: node scripts/vetrina.mjs /tmp/tudor-trasparente.png tudor 6.44 511,760,87.0
Le misure (perno, raggio, lunghezze delle lancette) sono prese sulle foto in VETRINA/.
"""
import numpy as np
from PIL import Image
from scipy import ndimage as nd

OUT = 512                 # lato delle immagini delle lancette (= 2R)
PIV = (511.0, 711.0)      # perno sulla ravvicinata
R = 265.0                 # raggio del quadrante nero sulla ravvicinata (nel cofanetto 87 px, scala 0,3283 misurata)
LEN = {"ore": 192.0, "minuti": 266.0, "secondi": 262.0}   # misurate sulla ravvicinata con le lancette
HAND = {"ore": (262.6, 934.3, 449), "minuti": (627.1, 936.0, 117), "secondi": (987.7, 935.8, 86)}  # perno x, y, punta y nella foto delle lancette
COLS = {"ore": (0, 450), "minuti": (450, 800), "secondi": (800, 1254)}
PUB = "public/vetrina/"
V = "VETRINA/tudor"

# 1. cofanetto: tolgo il bianco e l'ombra grigia collegati al bordo, con un bordo morbido
a = np.asarray(Image.open(V + "-senza-lancette.webp").convert("RGB")).astype(float)
mn, mx = a.min(2), a.max(2)
bgish = (mn > 168) & (mx - mn < 14)
lab, _ = nd.label(bgish)
ids = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
bg = np.isin(lab, list(ids))
bg = nd.binary_closing(bg, iterations=1) | bg
inside = ~bg
inside = nd.binary_opening(inside, iterations=1)
# il cofanetto è un unico pezzo: tengo il componente più grande
lab2, n2 = nd.label(inside)
k = np.argmax(nd.sum(inside, lab2, range(1, n2 + 1))) + 1
inside = lab2 == k
inside = nd.binary_fill_holes(inside)
alpha = nd.gaussian_filter(inside.astype(float), 0.8)
alpha = np.clip((alpha - 0.15) / 0.7, 0, 1)
img = Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8), "RGBA")
img.save("/tmp/tudor-trasparente.png")
ys, xs = np.where(inside)
print("cofanetto", xs.min(), xs.max(), ys.min(), ys.max())

# 2. ravvicinata senza lancette (così com'è)
Image.open(V + "-vicino-senza-lancette.webp").convert("RGB").save(PUB + "tudor-vicino.webp", quality=88, method=6)

# 3. lancette: sfondo bianco collegato al bordo e fori del perno trasparenti, perno al centro, scala della ravvicinata
h = np.asarray(Image.open(V + "-lancette.webp").convert("RGB")).astype(float)
wh = h.min(2) >= 232
lab, _ = nd.label(wh)
seeds = [lab[0, 0]] + [lab[int(round(y)), int(round(x))] for (x, y, _) in HAND.values()]
bg = np.isin(lab, [s for s in seeds if s])
near = nd.binary_dilation(bg, iterations=2) & ~bg
al = np.where(bg, 0.0, 1.0)
soft = np.clip((255 - h.min(2)) / 50.0, 0, 1)
al[near] = soft[near]
c = np.clip((h - 255 * (1 - np.clip(al, 1e-3, 1)[..., None])) / np.clip(al, 1e-3, 1)[..., None], 0, 255)
# le lancette generate sono in acciaio, quelle del Black Bay in foto sono dorate: l'acciaio (grigio) diventa oro,
# il luminescente color crema resta com'è
sat = c.max(2) - c.min(2)
steel = sat < 22
lum = c.mean(2, keepdims=True) / 255.0
gold = np.clip(lum * np.array([255, 205, 120]) * 1.08 + (lum ** 6) * np.array([40, 40, 60]), 0, 255)
c = np.where(steel[..., None], gold, c)
hands = Image.fromarray(np.dstack([c, al * 255]).astype(np.uint8), "RGBA")
for name, (cx, cy, tip) in HAND.items():
    L = cy - tip
    k = LEN[name] / L * OUT / (2 * R)
    S = 2 * int(max(hands.size))
    canvas = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ox, x1 = COLS[name]
    half = hands.crop((ox, 0, x1, 1254))
    canvas.paste(half, (int(round(S / 2 - (cx - ox))), int(round(S / 2 - cy))))
    size = int(round(S * k))
    canvas = canvas.resize((size, size), Image.LANCZOS)
    m = size / 2
    out = canvas.crop((int(round(m - OUT / 2)), int(round(m - OUT / 2)), int(round(m - OUT / 2)) + OUT, int(round(m - OUT / 2)) + OUT))
    out.save(PUB + f"tudor-{name}.webp", quality=92, alpha_quality=95, method=6)
    print(name, "scala", round(k, 4))
print("vicino", {"x": round(PIV[0] / 1024 * 100, 2), "y": round(PIV[1] / 1536 * 100, 2), "r": round(R / 1024 * 100, 2)})
