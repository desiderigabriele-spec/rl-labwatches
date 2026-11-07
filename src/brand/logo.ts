/**
 * Logo Roberto Landi · Lab Watches — geometria ridisegnata fedelmente dall'immagine originale
 * (misurata sul file raster 1254×1254: le coordinate sono nello stesso sistema).
 * Usata sia dal componente React <Logo /> sia dallo script che genera i file in /public/brand.
 * Non modificare composizione, testi o colori senza approvazione.
 */
import { LAB_WATCHES, ROBERTO_LANDI } from "./logo-text.ts";

export type Role = "arc" | "word" | "gold" | "goldHi" | "goldLo" | "sub";
export type Shape = { d: string; role: Role; evenodd?: boolean };

/** Perno delle lancette */
export const PIVOT = { x: 628, y: 607 } as const;
/** Angoli delle lancette nel logo (gradi, 0 = ore 12) */
export const HAND_START = { hour: -53.6, minute: 51.6 } as const;

export const VIEWBOX = {
  full: "97 278 1061 584",
  icon: "275 278 700 373",
} as const;

const f = (n: number) => Math.round(n * 100) / 100;

/** Indice smussato tra due punti, spessore w: due facce (chiara verso l'alto/sinistra, scura dall'altra parte) */
function bar(x1: number, y1: number, x2: number, y2: number, w: number): Shape[] {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  let nx = (-dy / len) * (w / 2), ny = (dx / len) * (w / 2);
  if (nx + ny > 0) [nx, ny] = [-nx, -ny]; // la faccia "n" è quella in alto a sinistra (luce)
  const side = (sx: number, sy: number) =>
    `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}L${f(x2 + sx)} ${f(y2 + sy)}L${f(x1 + sx)} ${f(y1 + sy)}Z`;
  return [
    { d: side(nx, ny), role: "goldHi" },
    { d: side(-nx, -ny), role: "goldLo" },
  ];
}

/** Lancetta sfaccettata che punta verso l'alto dal perno: [faccia chiara, faccia scura].
 *  La base finisce sotto l'anello del perno, così il foro centrale resta vuoto. */
function hand(length: number, halfWidth: number): [string, string] {
  const { x, y } = PIVOT;
  const tip = `${x} ${y - length}`;
  const wide = y - 27, base = y - 14;
  return [`M${tip}L${x - halfWidth} ${wide}L${x} ${base}Z`, `M${tip}L${x + halfWidth} ${wide}L${x} ${base}Z`];
}

// Arco a mezzaluna: più spesso in alto (≈15), sottile alle estremità
const ARC = "M295 631A330 330 0 1 1 955 631L954 631A329.2 329.2 0 0 0 296 631Z";

const ring = (r: number) => `M${PIVOT.x - r} ${PIVOT.y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

export const SYMBOL: Shape[] = [
  { d: ARC, role: "arc" },
  // indici: ore 12 (doppio), 11, 1, 10, 2, 9, 3
  ...bar(618, 346, 618, 404, 10.5),
  ...bar(635.5, 346, 635.5, 404, 10.5),
  ...bar(482, 382, 513, 434, 12),
  ...bar(772, 384, 741, 436, 12),
  ...bar(387, 473, 440, 510, 13),
  ...bar(865, 474, 812, 509, 13),
  ...bar(347, 601, 412, 601, 12.5),
  ...bar(841, 601.5, 906, 601.5, 13),
];

const [hourHi, hourLo] = hand(194, 8.5);
const [minHi, minLo] = hand(240, 7.5);
export const HOUR_HAND: Shape[] = [
  { d: hourHi, role: "goldHi" },
  { d: hourLo, role: "goldLo" },
];
export const MINUTE_HAND: Shape[] = [
  { d: minHi, role: "goldHi" },
  { d: minLo, role: "goldLo" },
];

/** Perno ad anello (centro trasparente) */
export const PIVOT_RING: Shape = { d: ring(22) + ring(12.5), role: "gold", evenodd: true };

export const WORDMARK: Shape[] = [
  { d: ROBERTO_LANDI, role: "word" },
  { d: LAB_WATCHES, role: "sub" },
  { d: "M151 825.5L273 823L273 828Z", role: "sub" },
  { d: "M1104 825.5L981 823L981 828Z", role: "sub" },
];

// ---------------- varianti di colore ----------------
export type Variant = "principale" | "scuro" | "bianco" | "nero" | "verde" | "oro";

type Grad = { x2: number; y2: number; stops: [string, number][] };

/** Gradienti metallici (oro) e verde, come nell'originale */
export const GRADIENTS: Record<Role, Grad> = {
  gold: { x2: 1, y2: 1, stops: [["#a47a2a", 0], ["#ecca78", 0.35], ["#c0923a", 0.6], ["#f2d690", 0.82], ["#a87d2a", 1]] },
  goldHi: { x2: 0, y2: 1, stops: [["#f3dc98", 0], ["#d4aa52", 0.55], ["#b68833", 1]] },
  goldLo: { x2: 0, y2: 1, stops: [["#c99d45", 0], ["#9b7126", 0.6], ["#7f5b1c", 1]] },
  sub: { x2: 1, y2: 0, stops: [["#a27a2b", 0], ["#d9b462", 0.5], ["#a27a2b", 1]] },
  arc: { x2: 0, y2: 1, stops: [["#0d5131", 0], ["#083f22", 0.55], ["#05331b", 1]] },
  word: { x2: 0, y2: 1, stops: [["#0c4d2e", 0], ["#083f22", 0.55], ["#05331b", 1]] },
};

export const BRAND = { green: "#083f22", greenDark: "#05301b", gold: "#c29a45", cream: "#f5f1e8" } as const;

export const VARIANTS: Record<Variant, { label: string; fill: Partial<Record<Role, string>>; color?: string; bg?: string }> = {
  // fill: ruoli a tinta piatta; gli altri usano i gradienti
  principale: { label: "verde e oro", fill: {} },
  scuro: { label: "su fondo verde", fill: { arc: BRAND.cream, word: BRAND.cream }, bg: BRAND.greenDark },
  bianco: { label: "bianco", fill: {}, color: "#ffffff" },
  nero: { label: "nero", fill: {}, color: "#171717" },
  verde: { label: "verde", fill: {}, color: BRAND.green },
  oro: { label: "oro", fill: {}, color: BRAND.gold },
};

/** Riempimento di un ruolo per una variante: colore piatto o riferimento al gradiente */
export function paint(variant: Variant, role: Role, gradId: (role: Role) => string): string {
  const v = VARIANTS[variant];
  return v.color ?? v.fill[role] ?? `url(#${gradId(role)})`;
}

/** SVG completo come stringa (per i file statici) */
export function logoSvg(variant: Variant, opts: { wordmark?: boolean; viewBox?: string; background?: boolean } = {}): string {
  const { wordmark = true, background = true } = opts;
  const viewBox = opts.viewBox ?? (wordmark ? VIEWBOX.full : VIEWBOX.icon);
  const gid = (r: Role) => `rl-${r}`;
  const v = VARIANTS[variant];
  const usesGrad = !v.color;
  const defs = usesGrad
    ? `<defs>${(Object.keys(GRADIENTS) as Role[])
        .map((r) => {
          const g = GRADIENTS[r];
          return `<linearGradient id="${gid(r)}" x1="0" y1="0" x2="${g.x2}" y2="${g.y2}">${g.stops.map(([c, o]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
        })
        .join("")}</defs>`
    : "";
  const path = (s: Shape, extra = "") =>
    `<path${extra} d="${s.d}" fill="${paint(variant, s.role, gid)}"${s.evenodd ? ' fill-rule="evenodd"' : ""}/>`;
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  const bg = background && v.bg ? `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${v.bg}"/>` : "";
  const r = (deg: number) => ` transform="rotate(${deg} ${PIVOT.x} ${PIVOT.y})"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="Roberto Landi Lab Watches">`,
    defs,
    bg,
    `<g id="symbol">${SYMBOL.map((s) => path(s)).join("")}`,
    `<g id="hour-hand"${r(HAND_START.hour)}>${HOUR_HAND.map((s) => path(s)).join("")}</g>`,
    `<g id="minute-hand"${r(HAND_START.minute)}>${MINUTE_HAND.map((s) => path(s)).join("")}</g>`,
    `${path(PIVOT_RING, ' id="pivot"')}</g>`,
    wordmark ? `<g id="wordmark">${WORDMARK.map((s) => path(s)).join("")}</g>` : "",
    `</svg>`,
  ].join("");
}
