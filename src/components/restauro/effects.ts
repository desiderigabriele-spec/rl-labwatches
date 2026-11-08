/**
 * Effetti del "banco di restauro": su un canvas quadrato il pezzo usurato si pulisce dove passa l'attrezzo.
 * Ogni effetto disegna l'immagine pulita, sopra la versione usurata "bucata" dove il lavoro è già fatto,
 * e infine l'attrezzo. p = avanzamento del lavoro (0..1), t = tempo in secondi (bolle, scintille).
 */

export type Img = HTMLImageElement | null;
export type FxCtx = {
  g: CanvasRenderingContext2D;
  lg: CanvasRenderingContext2D;
  layer: HTMLCanvasElement;
  S: number;
  p: number;
  t: number;
  clean: Img;
  worn: Img;
  tools: { brush: Img };
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const TAU = Math.PI * 2;

/** disegna dentro il cerchio del pezzo */
function disc(g: CanvasRenderingContext2D, S: number, fn: () => void) {
  g.save();
  g.beginPath();
  g.arc(S / 2, S / 2, S / 2 - 2, 0, TAU);
  g.clip();
  fn();
  g.restore();
}

/** pulito sotto, usurato sopra con i "buchi" disegnati da mask */
function compose(c: FxCtx, mask: (lg: CanvasRenderingContext2D) => void, transform?: (g: CanvasRenderingContext2D) => void) {
  const { g, lg, layer, S, clean, worn } = c;
  lg.globalCompositeOperation = "source-over";
  lg.clearRect(0, 0, S, S);
  if (worn) lg.drawImage(worn, 0, 0, S, S);
  lg.globalCompositeOperation = "destination-out";
  mask(lg);
  lg.globalCompositeOperation = "source-over";
  disc(g, S, () => {
    g.save();
    transform?.(g);
    if (clean) g.drawImage(clean, 0, 0, S, S);
    g.drawImage(layer, 0, 0);
    g.restore();
  });
}

// ---------- attrezzi ----------
function drawBrush(g: CanvasRenderingContext2D, img: Img, x: number, y: number, ang: number, S: number) {
  if (!img) return;
  const h = S * 0.62, w = (h * img.width) / img.height;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = S * 0.025;
  g.shadowOffsetX = S * 0.018;
  g.shadowOffsetY = S * 0.03;
  g.drawImage(img, -w / 2, -h + S * 0.012, w, h);
  g.restore();
}

function drawSwab(g: CanvasRenderingContext2D, x: number, y: number, press: number, S: number) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath();
  g.ellipse(S * 0.03, S * 0.025, S * 0.045, S * 0.03, 0, 0, TAU);
  g.fill();
  g.rotate(-0.5);
  const stick = g.createLinearGradient(-S * 0.008, 0, S * 0.008, 0);
  stick.addColorStop(0, "#c9a877");
  stick.addColorStop(0.5, "#ecd3a6");
  stick.addColorStop(1, "#b8955f");
  g.fillStyle = stick;
  g.fillRect(-S * 0.008, -S * 0.42, S * 0.016, S * 0.4);
  const tip = g.createRadialGradient(-S * 0.01, -S * 0.02, 1, 0, 0, S * 0.045);
  tip.addColorStop(0, "#ffffff");
  tip.addColorStop(1, "#d8d2c4");
  g.fillStyle = tip;
  g.beginPath();
  g.ellipse(0, -S * 0.01, S * 0.032 * (1 + press * 0.15), S * 0.046, 0, 0, TAU);
  g.fill();
  g.restore();
}

function drawOiler(g: CanvasRenderingContext2D, x: number, y: number, S: number) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.6);
  g.strokeStyle = "#e9eaec";
  g.lineWidth = Math.max(1.5, S * 0.004);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(0, -S * 0.16);
  g.stroke();
  g.fillStyle = "#b9bcbf";
  g.fillRect(-S * 0.008, -S * 0.19, S * 0.016, S * 0.035);
  const h = g.createLinearGradient(-S * 0.02, 0, S * 0.02, 0);
  h.addColorStop(0, "#0a3a26");
  h.addColorStop(0.5, "#1c7a52");
  h.addColorStop(1, "#0a3a26");
  g.fillStyle = h;
  g.fillRect(-S * 0.02, -S * 0.52, S * 0.04, S * 0.33);
  g.restore();
}

function drawDrop(g: CanvasRenderingContext2D, x: number, y: number, k: number, S: number) {
  if (k <= 0) return;
  const r = S * 0.016 * k;
  const d = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  d.addColorStop(0, "rgba(255,240,200,0.95)");
  d.addColorStop(0.5, "rgba(226,170,60,0.85)");
  d.addColorStop(1, "rgba(160,100,20,0.6)");
  g.fillStyle = d;
  g.beginPath();
  g.arc(x, y, r, 0, TAU);
  g.fill();
}

/** disco di cotone della pulitrice visto di taglio, con le pieghe che scorrono */
function drawWheel(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number, S: number) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath();
  g.roundRect(-w / 2 + S * 0.015, -h / 2 + S * 0.02, w, h, w * 0.45);
  g.fill();
  const c = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  c.addColorStop(0, "#cfc6b2");
  c.addColorStop(0.5, "#fbf7ee");
  c.addColorStop(1, "#c7bda8");
  g.fillStyle = c;
  g.beginPath();
  g.roundRect(-w / 2, -h / 2, w, h, w * 0.45);
  g.fill();
  g.save();
  g.clip();
  g.strokeStyle = "rgba(120,104,80,0.35)";
  g.lineWidth = Math.max(1, S * 0.003);
  const step = h / 9, off = (t * 900) % step;
  for (let yy = -h / 2 - step + off; yy < h / 2 + step; yy += step) {
    g.beginPath();
    g.moveTo(-w / 2, yy);
    g.quadraticCurveTo(0, yy + step * 0.5, w / 2, yy);
    g.stroke();
  }
  g.restore();
  g.restore();
}

function sparks(g: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number, t: number, S: number, seed: number) {
  for (let i = 0; i < 46; i++) {
    const r1 = Math.abs(Math.sin(i * 12.9898 + seed) * 43758.5453) % 1;
    const r2 = Math.abs(Math.sin(i * 78.233 + seed) * 12543.123) % 1;
    const life = (t * 1.6 + i / 46) % 1;
    const sp = S * (0.25 + r1 * 0.35);
    const px = x + (dx * sp + (r2 - 0.5) * S * 0.25) * life;
    const py = y + (dy * sp + (r1 - 0.5) * S * 0.12) * life + S * 0.25 * life * life;
    g.fillStyle = `rgba(${(200 + r2 * 40) | 0},${(150 + r1 * 50) | 0},70,${1 - life})`;
    g.fillRect(px, py, S * 0.004 + r1 * S * 0.004, S * 0.004 + r2 * S * 0.003);
  }
}

// ---------- 1. movimento lato ponti: vasca a ultrasuoni, poi olio sui rubini ----------
const N = 160;
let field: Float32Array | null = null;
function noiseField() {
  if (field) return field;
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out = new Float32Array(N * N);
  ([[4, 0.55], [9, 0.3], [21, 0.15]] as const).forEach(([gs, w]) => {
    const a = new Float32Array((gs + 1) * (gs + 1)).map(() => rnd());
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const fx = (x / N) * gs, fy = (y / N) * gs, ix = fx | 0, iy = fy | 0, tx = ease(fx - ix), ty = ease(fy - iy);
        const v00 = a[iy * (gs + 1) + ix], v10 = a[iy * (gs + 1) + ix + 1], v01 = a[(iy + 1) * (gs + 1) + ix], v11 = a[(iy + 1) * (gs + 1) + ix + 1];
        out[y * N + x] += w * ((v00 * (1 - tx) + v10 * tx) * (1 - ty) + (v01 * (1 - tx) + v11 * tx) * ty);
      }
  });
  return (field = out);
}
let maskCanvas: HTMLCanvasElement | null = null;
const JEWELS: [number, number][] = [
  [-0.537, 0.145],
  [-0.337, 0.337],
  [-0.128, 0.462],
  [-0.023, -0.047],
  [0.505, -0.047],
];
export function wash(c: FxCtx) {
  const { g, S, p, t } = c;
  const f = noiseField();
  if (!maskCanvas) {
    maskCanvas = document.createElement("canvas");
    maskCanvas.width = maskCanvas.height = N;
  }
  const mc = maskCanvas.getContext("2d")!;
  const img = mc.createImageData(N, N);
  const w = clamp(p / 0.7);
  for (let i = 0; i < N * N; i++) img.data[i * 4 + 3] = clamp((w * 1.25 - 0.1 - f[i]) / 0.06) * 255;
  mc.putImageData(img, 0, 0);
  compose(c, (lg) => lg.drawImage(maskCanvas!, 0, 0, S, S));

  const bath = w > 0 && w < 1 ? Math.sin(Math.PI * w) : 0;
  if (bath > 0)
    disc(g, S, () => {
      g.fillStyle = `rgba(120,170,190,${0.1 * bath})`;
      g.fillRect(0, 0, S, S);
      for (let i = 0; i < 90; i++) {
        const r1 = Math.abs(Math.sin(i * 91.3) * 4375.85) % 1, r2 = Math.abs(Math.sin(i * 17.7) * 9123.1) % 1;
        const life = (t * (0.25 + r2 * 0.35) + r1) % 1;
        const x = S * (0.08 + r1 * 0.84) + Math.sin(t * 3 + i) * S * 0.01, y = S * (1.02 - life * 1.1), r = S * (0.004 + r2 * 0.012);
        g.strokeStyle = `rgba(240,248,252,${0.7 * bath * (1 - life * 0.5)})`;
        g.lineWidth = Math.max(1, S * 0.002);
        g.beginPath();
        g.arc(x, y, r, 0, TAU);
        g.stroke();
      }
    });

  const o = clamp((p - 0.76) / 0.22);
  if (o > 0) {
    const n = JEWELS.length, cur = Math.min(n - 1, Math.floor(o * n));
    JEWELS.forEach(([jx, jy], i) => drawDrop(g, S / 2 + (jx * S) / 2, S / 2 + (jy * S) / 2, clamp(o * n - i), S));
    if (o < 1) {
      const [jx, jy] = JEWELS[cur], [px, py] = JEWELS[Math.max(0, cur - 1)], k = ease(clamp((o * n - cur) * 2.2));
      drawOiler(g, S / 2 + ((px + (jx - px) * k) * S) / 2, S / 2 + ((py + (jy - py) * k) * S) / 2, S);
    }
  }
}

// ---------- 2. movimento lato quadrante: passate di pennello ----------
const STROKES = (() => {
  const pts: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    const y = 0.1 + (r / 8) * 0.8, dir = r % 2 ? -1 : 1;
    for (let k = 0; k <= 24; k++) {
      const u = k / 24;
      pts.push([0.5 + dir * (u - 0.5) * 0.98, y + Math.sin(u * Math.PI * 3 + r) * 0.025]);
    }
  }
  return pts;
})();
export function brush(c: FxCtx) {
  const { g, S, p, t } = c;
  const n = Math.floor(p * (STROKES.length - 1));
  compose(c, (lg) => {
    lg.lineCap = lg.lineJoin = "round";
    ([[0.2, 0.3], [0.17, 0.5], [0.14, 1]] as const).forEach(([wd, a]) => {
      lg.strokeStyle = `rgba(0,0,0,${a})`;
      lg.lineWidth = S * wd;
      lg.beginPath();
      for (let i = 0; i <= n; i++) {
        const [x, y] = STROKES[i];
        if (i) lg.lineTo(x * S, y * S);
        else lg.moveTo(x * S, y * S);
      }
      lg.stroke();
    });
  });
  if (p > 0 && p < 1) {
    const [x, y] = STROKES[n], [x2, y2] = STROKES[Math.min(STROKES.length - 1, n + 1)];
    drawBrush(g, c.tools.brush, x * S, y * S, Math.atan2(y2 - y, x2 - x) * 0.25 + 0.35 + Math.sin(t * 14) * 0.04, S);
  }
}

// ---------- 3. quadrante: tamponi dal centro verso il bordo ----------
const DABS = Array.from({ length: 110 }, (_, i) => {
  const a = i * 2.39996, r = Math.sqrt(i / 110) * 0.47;
  return [0.5 + Math.cos(a) * r, 0.5 + Math.sin(a) * r] as [number, number];
});
export function swab(c: FxCtx) {
  const { g, S, p } = c;
  const f = p * DABS.length, n = Math.floor(f);
  compose(c, (lg) => {
    DABS.forEach(([x, y], i) => {
      const k = clamp(f - i);
      if (k <= 0) return;
      const gr = lg.createRadialGradient(x * S, y * S, 0, x * S, y * S, S * 0.085);
      gr.addColorStop(0, `rgba(0,0,0,${k})`);
      gr.addColorStop(0.55, `rgba(0,0,0,${k * 0.9})`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      lg.fillStyle = gr;
      lg.fillRect(x * S - S * 0.09, y * S - S * 0.09, S * 0.18, S * 0.18);
    });
  });
  if (p > 0 && p < 1) {
    const [x, y] = DABS[Math.min(DABS.length - 1, n)];
    drawSwab(g, x * S, y * S, Math.abs(Math.sin((f - n) * Math.PI)), S);
  }
}

// ---------- 4. fondello che gira contro la pulitrice (contatto a ore 3) ----------
export function caseback(c: FxCtx) {
  const { g, S, p, t } = c;
  const th = ease(p) * TAU;
  compose(
    c,
    (lg) => {
      lg.save();
      lg.translate(S / 2, S / 2);
      ([[0.06, 0.35], [0.03, 0.6], [0, 1]] as const).forEach(([soft, a]) => {
        lg.fillStyle = `rgba(0,0,0,${a})`;
        lg.beginPath();
        lg.moveTo(0, 0);
        lg.arc(0, 0, S, -th - soft, soft);
        lg.closePath();
        lg.fill();
      });
      lg.restore();
    },
    (gg) => {
      gg.translate(S / 2, S / 2);
      gg.rotate(th);
      gg.translate(-S / 2, -S / 2);
    }
  );
  if (p > 0 && p < 1) {
    drawWheel(g, S * 0.93, S * 0.5, S * 0.12, S * 0.36, t, S);
    sparks(g, S * 0.88, S * 0.6, -0.4, 0.6, t, S, 3);
  }
}

// ---------- 5. acciaio della cassa: da graffiato a specchio ----------
let mirror: HTMLCanvasElement | null = null;
function mirrorSteel() {
  if (mirror) return mirror;
  mirror = document.createElement("canvas");
  mirror.width = mirror.height = 920;
  const m = mirror.getContext("2d")!, S = 920;
  const gr = m.createLinearGradient(0, 0, 0, S);
  ([[0, "#7c8085"], [0.18, "#eef0f2"], [0.32, "#a7abb0"], [0.5, "#5d6166"], [0.62, "#d9dcdf"], [0.78, "#fbfcfd"], [0.9, "#9a9ea3"], [1, "#6c7075"]] as const).forEach(([o, col]) => gr.addColorStop(o, col));
  m.fillStyle = gr;
  m.fillRect(0, 0, S, S);
  m.globalAlpha = 0.05;
  m.strokeStyle = "#ffffff";
  for (let y = 0; y < S; y += 3) {
    m.beginPath();
    m.moveTo(0, y);
    m.lineTo(S, y + Math.sin(y) * 2);
    m.stroke();
  }
  return mirror;
}
export function steel(c: FxCtx) {
  const { g, lg, layer, S, p, t, worn } = c;
  const x = ease(p) * 1.16 - 0.08;
  lg.globalCompositeOperation = "source-over";
  lg.clearRect(0, 0, S, S);
  if (worn) {
    lg.drawImage(worn, 0, 0, S, S);
    lg.fillStyle = "rgba(40,30,15,0.12)";
    lg.fillRect(0, 0, S, S);
  }
  lg.globalCompositeOperation = "destination-out";
  const gr = lg.createLinearGradient(x * S - S * 0.06, 0, x * S + S * 0.02, 0);
  gr.addColorStop(0, "rgba(0,0,0,1)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  lg.fillStyle = gr;
  lg.fillRect(0, 0, S, S);
  lg.globalCompositeOperation = "source-over";
  g.save();
  g.beginPath();
  g.roundRect(S * 0.04, S * 0.04, S * 0.92, S * 0.92, S * 0.06);
  g.clip();
  g.drawImage(mirrorSteel(), 0, 0, S, S);
  g.drawImage(layer, 0, 0);
  if (p > 0 && p < 1) {
    const fl = g.createRadialGradient(x * S, S / 2, 0, x * S, S / 2, S * 0.3);
    fl.addColorStop(0, "rgba(255,230,180,0.28)");
    fl.addColorStop(1, "rgba(255,230,180,0)");
    g.fillStyle = fl;
    g.fillRect(0, 0, S, S);
  }
  g.restore();
  if (p > 0 && p < 1) {
    drawWheel(g, x * S, S * 0.5, S * 0.14, S * 0.98, t, S);
    sparks(g, x * S + S * 0.05, S * 0.62, 0.7, 0.3, t, S, 9);
  }
}

// ---------- sbreccatura: riporto di materiale, limatura, lucidatura ----------
type ChipGeo = { S: number; bite: [number, number][]; scratches: number[][]; beads: number[][] };
let chipGeo: ChipGeo | null = null;
function chipGeometry(S: number): ChipGeo {
  if (chipGeo && chipGeo.S === S) return chipGeo;
  const W = S, H = S * 0.62, EDGE = H * 0.36, bx0 = W * 0.33, bx1 = W * 0.67;
  let rs = 5;
  const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
  const bite: [number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    bite.push([bx0 + (bx1 - bx0) * u, EDGE + Math.sin(Math.PI * u) ** 0.8 * H * 0.15 * (1 + 0.18 * Math.sin(u * 23) + 0.1 * Math.sin(u * 61))]);
  }
  const scratches = Array.from({ length: 140 }, () => {
    const x = rnd() * W, y = EDGE + rnd() * (H - EDGE), a = rnd() * Math.PI, l = (20 + rnd() * 120) * (S / 1200);
    return [x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, 0.2 + rnd() * 0.5];
  });
  const beads = Array.from({ length: 70 }, (_, i) => [bx0 + (bx1 - bx0) * (i / 69) + (rnd() - 0.5) * S * 0.012, EDGE - H * 0.03 + rnd() * H * 0.12, S * (0.008 + rnd() * 0.008)]);
  return (chipGeo = { S, bite, scratches, beads });
}
export function chip(c: FxCtx) {
  const { g, S, p, t } = c;
  const W = S, H = S * 0.62, EDGE = H * 0.36, bx0 = W * 0.33, bx1 = W * 0.67;
  const { bite, scratches, beads } = chipGeometry(S);
  const weld = clamp((p - 0.15) / 0.38), file = clamp((p - 0.56) / 0.22), polish = clamp((p - 0.8) / 0.2);
  g.save();
  g.translate(0, S * 0.19);
  g.beginPath();
  g.roundRect(0, 0, W, H, S * 0.03);
  g.clip();
  g.fillStyle = "#e9e5dc";
  g.fillRect(0, 0, W, H);
  // corpo d'acciaio dell'ansa, con i graffi finché non è lucidato
  const gr = g.createLinearGradient(0, EDGE, 0, H);
  gr.addColorStop(0, "#f4f5f6");
  gr.addColorStop(0.08, "#9ea3a8");
  gr.addColorStop(0.35, "#dfe2e4");
  gr.addColorStop(0.6, "#7f8489");
  gr.addColorStop(1, "#c9ccd0");
  g.fillStyle = gr;
  g.fillRect(0, EDGE, W, H - EDGE);
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = S * 0.003;
  g.beginPath();
  g.moveTo(0, EDGE + 1.5);
  g.lineTo(W, EDGE + 1.5);
  g.stroke();
  const sa = 1 - polish;
  if (sa > 0)
    scratches.forEach(([x0, y0, x1, y1, a]) => {
      g.strokeStyle = `rgba(70,70,72,${a * 0.5 * sa})`;
      g.lineWidth = 1.2;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
      g.strokeStyle = `rgba(255,255,255,${a * 0.6 * sa})`;
      g.beginPath();
      g.moveTo(x0, y0 + 1.5);
      g.lineTo(x1, y1 + 1.5);
      g.stroke();
    });
  const bitePath = () => {
    g.beginPath();
    g.moveTo(bite[0][0], EDGE - 2);
    bite.forEach(([x, y]) => g.lineTo(x, y));
    g.lineTo(bite[bite.length - 1][0], EDGE - 2);
    g.closePath();
  };
  if (weld < 1) {
    g.save();
    bitePath();
    g.clip();
    g.fillStyle = "#e9e5dc";
    g.fillRect(0, 0, W, H);
    g.restore();
    g.strokeStyle = "#5b5f63";
    g.lineWidth = S * 0.0035;
    g.beginPath();
    bite.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  }
  const front = bx0 - S * 0.017 + (bx1 - bx0 + S * 0.034) * weld;
  const over = H * 0.045 * (1 - ease(file));
  if (weld > 0) {
    g.save();
    g.beginPath();
    g.rect(0, 0, front, H);
    g.clip();
    g.beginPath();
    g.moveTo(bx0 - 10, EDGE);
    g.quadraticCurveTo((bx0 + bx1) / 2, EDGE - over * 2, bx1 + 10, EDGE);
    bite.slice().reverse().forEach(([x, y]) => g.lineTo(x, y));
    g.closePath();
    g.clip();
    const mg = g.createLinearGradient(0, EDGE - over, 0, EDGE + H * 0.16);
    mg.addColorStop(0, `rgb(${168 + 76 * polish},${166 + 79 * polish},${160 + 86 * polish})`);
    mg.addColorStop(1, `rgb(${120 + 100 * polish},${118 + 102 * polish},${114 + 108 * polish})`);
    g.fillStyle = mg;
    g.fillRect(0, 0, W, H);
    const ba = (1 - file) * 0.6;
    if (ba > 0)
      beads.forEach(([x, y, r]) => {
        const bg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
        bg.addColorStop(0, `rgba(240,240,236,${ba})`);
        bg.addColorStop(1, `rgba(90,88,84,${ba})`);
        g.fillStyle = bg;
        g.beginPath();
        g.arc(x, y, r, 0, TAU);
        g.fill();
      });
    if (file > 0 && polish < 1) {
      g.strokeStyle = `rgba(255,255,255,${0.35 * (1 - polish)})`;
      g.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const y = EDGE - over + i * S * 0.0035;
        g.beginPath();
        g.moveTo(bx0 - 20, y);
        g.lineTo(bx1 + 20, y + 6);
        g.stroke();
      }
    }
    g.restore();
  }
  // luce del laser e scintille sul fronte di saldatura
  if (weld > 0 && weld < 1) {
    const fy = EDGE + H * 0.04 + Math.sin(t * 30) * H * 0.02;
    const fl = g.createRadialGradient(front, fy, 0, front, fy, H * 0.22);
    fl.addColorStop(0, "rgba(255,255,255,0.95)");
    fl.addColorStop(0.15, "rgba(200,225,255,0.75)");
    fl.addColorStop(1, "rgba(160,200,255,0)");
    g.fillStyle = fl;
    g.fillRect(front - H * 0.25, fy - H * 0.25, H * 0.5, H * 0.5);
    for (let i = 0; i < 26; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9 + 3) * 4375.5) % 1, life = (t * 2.2 + i / 26) % 1;
      const a = -Math.PI / 2 + (r1 - 0.5) * 2.4, d = life * H * (0.12 + r1 * 0.15);
      g.fillStyle = `rgba(255,${(180 + r1 * 60) | 0},90,${1 - life})`;
      g.fillRect(front + Math.cos(a) * d, fy + Math.sin(a) * d + life * life * 30, S * 0.003, S * 0.003);
    }
  }
  // lima
  if (file > 0 && file < 1) {
    const fx = (bx0 + bx1) / 2 + Math.sin(t * 7) * (bx1 - bx0) * 0.45, fy = EDGE - over - S * 0.014;
    g.save();
    g.translate(fx, fy);
    g.rotate(-0.04);
    const fw = W * 0.3, fh = S * 0.027;
    g.fillStyle = "rgba(0,0,0,0.2)";
    g.fillRect(-fw + 8, -fh * 0.6, fw * 2, fh * 1.1);
    const fgr = g.createLinearGradient(0, -fh, 0, fh * 0.3);
    fgr.addColorStop(0, "#9aa0a5");
    fgr.addColorStop(0.5, "#5d6267");
    fgr.addColorStop(1, "#3c4044");
    g.fillStyle = fgr;
    g.fillRect(-fw, -fh, fw * 2, fh * 1.3);
    g.strokeStyle = "rgba(255,255,255,0.18)";
    g.lineWidth = 1;
    for (let x = -fw; x < fw; x += S * 0.006) {
      g.beginPath();
      g.moveTo(x, -fh);
      g.lineTo(x + S * 0.008, fh * 0.3);
      g.stroke();
    }
    g.restore();
  }
  // lucidatura: riflesso che attraversa il pezzo
  if (polish > 0 && polish < 1) {
    const sx = -W * 0.2 + W * 1.4 * polish;
    const sh = g.createLinearGradient(sx - S * 0.1, 0, sx + S * 0.1, 0);
    sh.addColorStop(0, "rgba(255,255,255,0)");
    sh.addColorStop(0.5, "rgba(255,255,255,0.75)");
    sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh;
    g.fillRect(0, EDGE, W, H - EDGE);
  }
  // segno rosso sulla sbreccatura all'inizio
  const mark = p < 0.16 ? Math.min(1, p / 0.05) : 0;
  if (mark > 0) {
    g.strokeStyle = `rgba(184,50,31,${mark})`;
    g.lineWidth = S * 0.004;
    g.setLineDash([S * 0.012, S * 0.008]);
    g.beginPath();
    g.ellipse((bx0 + bx1) / 2, EDGE + H * 0.05, (bx1 - bx0) * 0.68, H * 0.18, 0, 0, TAU);
    g.stroke();
    g.setLineDash([]);
  }
  g.restore();
}
