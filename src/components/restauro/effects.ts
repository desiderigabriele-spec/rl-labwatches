/**
 * Effetti del "banco di restauro": su un canvas quadrato il pezzo usurato si pulisce dove passa l'attrezzo.
 * Ogni effetto disegna l'immagine pulita, sopra la versione usurata "bucata" dove il lavoro è già fatto,
 * e infine l'attrezzo. p = avanzamento del lavoro (0..1), t = tempo in secondi (bolle, scintille).
 */

export type Img = HTMLImageElement | null;
/** attrezzi fotografati dai modelli 3D (public/models/attrezzi) */
export type Tools = { brush: Img; oiler: Img; pegwood: Img; polisher: Img; disc: Img; file: Img; tweezers: Img };
export type FxCtx = {
  g: CanvasRenderingContext2D;
  lg: CanvasRenderingContext2D;
  layer: HTMLCanvasElement;
  S: number;
  p: number;
  t: number;
  clean: Img;
  worn: Img;
  tools: Tools;
  /** fotogrammi di un lavoro in più fasi (sbreccatura) */
  frames?: Img[];
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
/** attrezzo con la punta in basso al centro dell'immagine, appoggiato in (x, y) */
function drawTool(g: CanvasRenderingContext2D, img: Img, x: number, y: number, ang: number, h: number, S: number) {
  if (!img) return;
  const w = (h * img.width) / img.height;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = S * 0.025;
  g.shadowOffsetX = S * 0.018;
  g.shadowOffsetY = S * 0.03;
  g.drawImage(img, -w / 2, -h + S * 0.006, w, h);
  g.restore();
}
/** pulitrice vista di lato: il disco di cotone a sinistra tocca il punto (x, y), il motore esce a destra */
function drawPolisher(g: CanvasRenderingContext2D, img: Img, x: number, y: number, h: number, t: number, S: number) {
  if (!img) return;
  const w = (h * img.width) / img.height;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = S * 0.03;
  g.shadowOffsetX = S * 0.02;
  g.shadowOffsetY = S * 0.035;
  // vibrazione leggerissima del motore acceso
  g.drawImage(img, x, y - h / 2 + Math.sin(t * 90) * S * 0.0012, w, h);
  g.restore();
}
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
  // prima lo smontaggio con le pinzette, poi il bagno a ultrasuoni
  const w = clamp((p - 0.2) / 0.52);
  for (let i = 0; i < N * N; i++) img.data[i * 4 + 3] = clamp((w * 1.25 - 0.1 - f[i]) / 0.06) * 255;
  mc.putImageData(img, 0, 0);
  compose(c, (lg) => lg.drawImage(maskCanvas!, 0, 0, S, S));

  // smontaggio: le pinzette scendono su una vite e la portano via, prima del lavaggio
  const tw = clamp(p / 0.2);
  if (tw > 0 && tw < 1 && c.tools.tweezers) {
    const tx = S * 0.75, ty = S * 0.47;
    const k = Math.sin(Math.PI * tw); // scende, stringe, risale
    const lift = (1 - k) * S * 0.25;
    g.save();
    // acciaio un po' più scuro, così le pinzette si staccano dal movimento grigio
    g.filter = "brightness(0.62) contrast(1.4)";
    drawTool(g, c.tools.tweezers, tx + lift * 0.6, ty - lift, -0.6, S * 0.9, S);
    g.restore();
    if (tw > 0.5) {
      // la vite sollevata tra le punte
      g.fillStyle = "#3d4a6b";
      g.beginPath();
      g.arc(tx + lift * 0.6, ty - lift - S * 0.004, S * 0.013, 0, TAU);
      g.fill();
    }
  }
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
      const ox = S / 2 + ((px + (jx - px) * k) * S) / 2, oy = S / 2 + ((py + (jy - py) * k) * S) / 2;
      if (c.tools.oiler) drawTool(g, c.tools.oiler, ox, oy, -0.45, S * 0.6, S);
      else drawOiler(g, ox, oy, S);
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
    const press = Math.abs(Math.sin((f - n) * Math.PI));
    if (c.tools.pegwood) drawTool(g, c.tools.pegwood, x * S, y * S - (1 - press) * S * 0.012, -0.5, S * 0.62, S);
    else drawSwab(g, x * S, y * S, press, S);
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
    if (c.tools.polisher) drawPolisher(g, c.tools.polisher, S * 0.9, S * 0.5, S * 0.4, t, S);
    else drawWheel(g, S * 0.93, S * 0.5, S * 0.12, S * 0.36, t, S);
    sparks(g, S * 0.9, S * 0.6, -0.4, 0.6, t, S, 3);
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
    const disc = c.tools.disc;
    if (disc) {
      const h = S * 0.98, w = (h * disc.width) / disc.height;
      g.save();
      g.shadowColor = "rgba(0,0,0,0.35)";
      g.shadowBlur = S * 0.03;
      g.shadowOffsetX = S * 0.02;
      g.drawImage(disc, x * S - w / 2, S * 0.01 + Math.sin(t * 90) * S * 0.0012, w, h);
      g.restore();
    } else drawWheel(g, x * S, S * 0.5, S * 0.14, S * 0.98, t, S);
    sparks(g, x * S + S * 0.05, S * 0.62, 0.7, 0.3, t, S, 9);
  }
}

// ---------- sbreccatura: saldatura laser, limatura, lucidatura (4 foto sovrapposte) ----------
/** centro della sbreccatura nelle foto, in frazione del lato */
const CHIP = { x: 0.53, y: 0.435, r: 0.075 };
/** disegna la foto f su ctx, ritagliata da una maschera (lg/layer fanno da appoggio) */
function frameThrough(c: FxCtx, ctx: CanvasRenderingContext2D, f: Img, mask: (lg: CanvasRenderingContext2D) => void) {
  const { lg, layer, S } = c;
  if (!f) return;
  lg.globalCompositeOperation = "source-over";
  lg.clearRect(0, 0, S, S);
  mask(lg);
  lg.globalCompositeOperation = "source-in";
  lg.drawImage(f, 0, 0, S, S);
  lg.globalCompositeOperation = "source-over";
  ctx.drawImage(layer, 0, 0);
}
function softCircle(lg: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const gr = lg.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, "rgba(0,0,0,1)");
  gr.addColorStop(0.7, "rgba(0,0,0,1)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  lg.fillStyle = gr;
  lg.fillRect(x - r, y - r, 2 * r, 2 * r);
}
/** colore del fondo della sezione: il bianco delle foto diventa questo e i bordi sfumano nella pagina */
const PAPER = "#f3f0ea";
let chipCanvas: HTMLCanvasElement | null = null;

export function chip(c: FxCtx) {
  const { g, S, p, t } = c;
  const [f0, f1, f2, f3] = c.frames ?? [];
  if (!f0) return;
  const cx = CHIP.x * S, cy = CHIP.y * S;
  const weld = clamp((p - 0.12) / 0.33), file = clamp((p - 0.5) / 0.22), polish = clamp((p - 0.76) / 0.24);

  // 1. le foto, una sopra l'altra, su un foglio a parte
  if (!chipCanvas) chipCanvas = document.createElement("canvas");
  if (chipCanvas.width !== S) chipCanvas.width = chipCanvas.height = S;
  const o = chipCanvas.getContext("2d")!;
  o.globalCompositeOperation = "source-over";
  o.clearRect(0, 0, S, S);
  o.drawImage(f0, 0, 0, S, S);
  if (weld > 0) frameThrough(c, o, f1, (lg) => softCircle(lg, cx, cy, S * CHIP.r * 1.6 * ease(weld)));
  if (file > 0) frameThrough(c, o, f2, (lg) => softCircle(lg, cx, cy, S * CHIP.r * 2.2 * ease(file)));
  const px = (ease(polish) * 1.3 - 0.15) * S;
  if (polish > 0)
    frameThrough(c, o, f3, (lg) => {
      const gr = lg.createLinearGradient(px - S * 0.12, 0, px + S * 0.02, 0);
      gr.addColorStop(0, "rgba(0,0,0,1)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      lg.fillStyle = gr;
      lg.fillRect(0, 0, S, S);
    });

  // 2. fondo della pagina + foto in "moltiplica" (il bianco sparisce), poi bordi sfumati in cerchio
  g.save();
  g.fillStyle = PAPER;
  g.fillRect(0, 0, S, S);
  g.globalCompositeOperation = "multiply";
  g.drawImage(chipCanvas, 0, 0);
  g.globalCompositeOperation = "destination-in";
  const fade = g.createRadialGradient(S / 2, S / 2, S * 0.34, S / 2, S / 2, S * 0.5);
  fade.addColorStop(0, "rgba(0,0,0,1)");
  fade.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = fade;
  g.fillRect(0, 0, S, S);
  g.restore();

  // 3. sopra: riflesso della lucidatura, luce del laser, lima, polvere, segno
  if (polish > 0 && polish < 1) {
    g.save();
    g.beginPath();
    g.arc(S / 2, S / 2, S * 0.46, 0, TAU);
    g.clip();
    const sh = g.createLinearGradient(px - S * 0.08, 0, px + S * 0.08, 0);
    sh.addColorStop(0, "rgba(255,255,255,0)");
    sh.addColorStop(0.5, "rgba(255,255,255,0.5)");
    sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh;
    g.fillRect(0, 0, S, S);
    g.restore();
  }
  // luce del laser e scintille sul punto di saldatura
  if (weld > 0 && weld < 1) {
    const fx = cx + Math.cos(t * 9) * S * 0.025, fy = cy + Math.sin(t * 13) * S * 0.02;
    const fl = g.createRadialGradient(fx, fy, 0, fx, fy, S * 0.14);
    fl.addColorStop(0, "rgba(255,255,255,0.95)");
    fl.addColorStop(0.18, "rgba(200,225,255,0.7)");
    fl.addColorStop(1, "rgba(160,200,255,0)");
    g.fillStyle = fl;
    g.fillRect(fx - S * 0.15, fy - S * 0.15, S * 0.3, S * 0.3);
    sparks(g, fx, fy, 0.2, -0.9, t, S, 5);
  }
  // lima che va avanti e indietro lungo lo spigolo, sopra la riparazione
  if (file > 0 && file < 1 && c.tools.file) {
    const d = Math.sin(t * 7) * S * 0.04;
    const ang = 0.78; // lama allineata allo spigolo dell'ansa
    const ux = Math.sin(ang), uy = -Math.cos(ang);
    // la punta sta prima della sbreccatura, così la lama ci passa sopra
    drawTool(g, c.tools.file, cx - ux * S * 0.2 + ux * d, cy - uy * S * 0.2 + uy * d, ang, S * 0.75, S);
  }
  // polvere di metallo mentre si lima
  if (file > 0 && file < 1) {
    for (let i = 0; i < 30; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9 + 7) * 4375.5) % 1, life = (t * 1.2 + i / 30) % 1;
      g.fillStyle = `rgba(90,92,96,${(1 - life) * 0.8})`;
      g.fillRect(cx + (r1 - 0.5) * S * 0.18 + Math.sin(t * 8) * S * 0.03, cy + life * S * 0.22, S * 0.003, S * 0.003);
    }
  }
  // all'inizio la sbreccatura viene segnata
  const mark = p < 0.13 ? Math.min(1, p / 0.04) : 0;
  if (mark > 0) {
    g.strokeStyle = `rgba(184,50,31,${mark})`;
    g.lineWidth = S * 0.004;
    g.setLineDash([S * 0.012, S * 0.008]);
    g.beginPath();
    g.arc(cx, cy, S * CHIP.r * 1.5, 0, TAU);
    g.stroke();
    g.setLineDash([]);
  }
}
