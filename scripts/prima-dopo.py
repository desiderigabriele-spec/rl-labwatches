"""
Prima e dopo per la home: da una foto con le due immagini affiancate ricava due quadrati da sovrapporre.

  python3 -I scripts/prima-dopo.py <foto> <cartella_uscita> <nome> [--top N] [--sep X]

- --top N   taglia N pixel in alto (per esempio la fascia con le scritte PRIMA / DOPO)
- --sep X   colonna del separatore (altrimenti la cerca da sola vicino al centro)
Se le due foto sono dello stesso punto di vista, il "dopo" viene allineato sul "prima"
(punti in comune + trasformazione); se le inquadrature sono troppo diverse le ritaglia
soltanto con lo stesso formato, centrate.
"""
import argparse
import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("name")
ap.add_argument("--top", type=int, default=0)
ap.add_argument("--sep", type=int, default=None)
a = ap.parse_args()

img = cv2.imread(a.src, cv2.IMREAD_COLOR)
img = img[a.top :]
h, w = img.shape[:2]
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
if a.sep is None:
    lo, hi = int(w * 0.4), int(w * 0.6)
    # il separatore è una colonna quasi uniforme (bianca o nera)
    a.sep = lo + int(np.argmin([np.std(g[:, x]) for x in range(lo, hi)]))
gap = 4
A, B = img[:, : a.sep - gap], img[:, a.sep + gap :]
mw = min(A.shape[1], B.shape[1])
A, B = A[:, :mw], B[:, :mw]

ga, gb = cv2.cvtColor(A, cv2.COLOR_BGR2GRAY), cv2.cvtColor(B, cv2.COLOR_BGR2GRAY)
sift = cv2.SIFT_create(6000)
ka, da = sift.detectAndCompute(ga, None)
kb, db = sift.detectAndCompute(gb, None)
M, n_in = None, 0
if da is not None and db is not None and len(ka) > 20 and len(kb) > 20:
    good = [x for x, y in cv2.BFMatcher().knnMatch(db, da, k=2) if x.distance < 0.72 * y.distance]
    if len(good) >= 12:
        pb = np.float32([kb[m.queryIdx].pt for m in good])
        pa = np.float32([ka[m.trainIdx].pt for m in good])
        # trasformazione "simile" (spostamento, rotazione, scala): niente deformazioni strane
        M, inl = cv2.estimateAffinePartial2D(pb, pa, method=cv2.RANSAC, ransacReprojThreshold=5.0)
        n_in = int(inl.sum()) if inl is not None else 0
aligned = False
if M is not None and n_in >= 40:
    s = float(np.hypot(M[0, 0], M[1, 0]))
    rot = float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
    if 0.7 < s < 1.4 and abs(rot) < 20:
        B = cv2.warpAffine(B, M, (mw, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        aligned = True
print(f"{a.name}: separatore x={a.sep}  punti coerenti={n_in}  allineata={'sì' if aligned else 'no, solo ritaglio'}")

side = min(mw, h)
x0, y0 = (mw - side) // 2, (h - side) // 2
for tag, im in (("prima", A), ("dopo", B)):
    crop = cv2.resize(im[y0 : y0 + side, x0 : x0 + side], (900, 900), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f"{a.out}/{a.name}-{tag}.webp", crop, [cv2.IMWRITE_WEBP_QUALITY, 86])
