import * as THREE from "three";

/**
 * Tempi della sezione "Il restauro" (0 = inizio della sezione, 1 = fine dello scroll).
 * Usati dalla scena 3D, dagli attrezzi e dai testi dei passaggi: cambiarli qui li sposta ovunque.
 */
export const PHASES = {
  explodeIn: [0.08, 0.2],
  /** l'orologio si gira e mostra il retro */
  backIn: [0.13, 0.22],
  backOut: [0.42, 0.48],
  /** pennello sul fondello */
  back: [0.24, 0.31],
  /** oliatore sul movimento */
  movement: [0.32, 0.41],
  /** pennello sul quadrante */
  dial: [0.49, 0.58],
  /** pulitrice sulla lunetta, poi sulla cassa */
  bezel: [0.59, 0.645],
  case: [0.655, 0.72],
  crystal: [0.7, 0.74],
  explodeOut: [0.76, 0.86],
  start: [0.88, 0.94],
} as const;

export type Phase = readonly [number, number];

/** avanzamento lineare 0..1 dentro una fase */
export const phase = (v: number, [a, b]: Phase) => THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);

/** 1 mentre la fase è in corso, con ingresso e uscita morbidi */
export const during = (v: number, [a, b]: Phase, pad = 0.025) =>
  THREE.MathUtils.smoothstep(v, a - pad, a + pad * 0.4) * (1 - THREE.MathUtils.smoothstep(v, b - pad * 0.4, b + pad));
