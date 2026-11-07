"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Rolex Cosmograph Daytona ref. 6239 "Paul Newman" costruito in codice, con movimento interno.
 * Quadrante, fondello, corona e i due lati del movimento (Valjoux 72 / calibro 722) sono texture
 * in public/models/daytona-6239; la scala tachimetrica della lunetta è disegnata al volo.
 * Le proporzioni di cassa, anse e vetro seguono le viste di profilo.
 *
 * Lo stato (letto a ogni frame) controlla:
 *  - explode: 0 = montato, 1 = esploso nei suoi componenti
 *  - wear:    0 = come nuovo, 1 = usurato (graffi, macchie, luminescente ingiallito, vetro opaco)
 *  - run:     0 = fermo, 1 = in marcia
 */
export type WatchPart = "movement" | "back" | "dial" | "bezel" | "case" | "crystal";
export type WatchState = {
  explode: number;
  wear: number;
  run: number;
  /** restauro pezzo per pezzo (0 = usurato, 1 = restaurato): lo sporco viene "spazzato via" da sinistra a destra
   *  (o lungo la circonferenza per la cassa), seguendo l'attrezzo. Se manca, vale `wear` per tutto l'orologio. */
  restored?: Partial<Record<WatchPart, number>>;
  /** pezzi appoggiati di lato sul banco mentre si lavora sugli altri (spostamento x, y) */
  aside?: Partial<Record<"crystal" | "bezel" | "hands" | "dial" | "movement" | "case" | "back", [number, number]>>;
  /** rotazione di cassa e lunetta sotto la pulitrice (radianti) */
  spin?: { case?: number; bezel?: number };
};

const lerp = THREE.MathUtils.lerp;
const TEX = "/models/daytona-6239/";

// ---------- misure (unità della scena: diametro cassa 2.44 = 37 mm) ----------
const CASE_R = 1.2;
/** cassa da z = CASE_BOTTOM a z = CASE_TOP */
const CASE_TOP = 0.2;
const CASE_BOTTOM = -0.3;
const BEZEL_IN = 1.05;
const BEZEL_OUT = 1.22;
const DIAL_R = 1.0;
/** posizioni misurate sulla texture del quadrante, in raggi del quadrante */
const PIVOT: [number, number] = [0, 0.027];
const SUB = {
  seconds: [-0.542, 0.0225], // ore 9: piccoli secondi
  minutes: [0.54, 0.0225], // ore 3: totalizzatore 30 minuti
  hours: [0, -0.495], // ore 6: totalizzatore 12 ore
} as const;
const SUB_R = 0.3;

// ---------- texture disegnate al volo ----------
function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function makeDirtTexture(seed: number, kind: "grime" | "patina") {
  return canvasTexture(512, (g) => {
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const spots = kind === "grime" ? 70 : 55;
    for (let i = 0; i < spots; i++) {
      const x = rnd() * 512, y = rnd() * 512, r = 6 + rnd() * (kind === "grime" ? 46 : 26);
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      const col = kind === "grime" ? `rgba(${60 + rnd() * 40},${45 + rnd() * 25},${25 + rnd() * 15},` : `rgba(${150 + rnd() * 40},${110 + rnd() * 30},${55 + rnd() * 20},`;
      grad.addColorStop(0, col + (0.45 + rnd() * 0.35) + ")");
      grad.addColorStop(1, col + "0)");
      g.fillStyle = grad;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    if (kind === "grime") {
      for (let i = 0; i < 160; i++) {
        const x = rnd() * 512, y = rnd() * 512, len = 10 + rnd() * 70, a = rnd() * Math.PI;
        g.strokeStyle = `rgba(235,230,215,${0.25 + rnd() * 0.45})`;
        g.lineWidth = 0.5 + rnd() * 1.2;
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        g.stroke();
      }
    }
  });
}

/** Scala tachimetrica incisa della lunetta, vista dall'alto (angolo 0 = ore 12, in senso orario) */
function makeBezelTexture() {
  const S = 1024, c = S / 2, k = c / BEZEL_OUT;
  const rIn = BEZEL_IN * k;
  const pos = (a: number, r: number) => [c + Math.sin(a) * r, c - Math.cos(a) * r] as const;
  const angleOf = (v: number) => (((3600 / v) % 60) / 60) * Math.PI * 2;

  return canvasTexture(S, (g) => {
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, S, S);
    g.fillStyle = g.strokeStyle = "#141414";
    g.lineCap = "round";

    const tick = (v: number, len: number, w: number) => {
      const a = angleOf(v);
      const [x0, y0] = pos(a, rIn + 6);
      const [x1, y1] = pos(a, rIn + 6 + len);
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
    };
    for (let v = 60; v <= 100; v++) tick(v, 9, 2);
    for (let v = 100; v <= 200; v += 5) tick(v, 11, 2.4);
    for (let v = 50; v < 60; v++) tick(v, 9, 2);

    // numeri (diritti, come sull'originale) con il punto di riferimento
    const nums = [200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (const v of nums) {
      const a = angleOf(v);
      const [dx, dy] = pos(a, rIn + 13);
      g.beginPath();
      g.arc(dx, dy, 3.4, 0, Math.PI * 2);
      g.fill();
      const [x, y] = pos(a, rIn + 40);
      g.save();
      g.translate(x, y);
      g.scale(0.78, 1);
      g.font = "500 30px 'Helvetica Neue', Arial, sans-serif";
      g.fillText(String(v), 0, 0);
      g.restore();
    }

    // "UNITS PER / HOUR" lungo l'arco, a ore 3
    const arcText = (text: string, r: number, center: number, px: number) => {
      g.font = `600 ${px}px 'Helvetica Neue', Arial, sans-serif`;
      const widths = [...text].map((ch) => g.measureText(ch).width * 0.82);
      const total = widths.reduce((a, b) => a + b, 0);
      let a = center - total / 2 / r;
      [...text].forEach((ch, i) => {
        const mid = a + widths[i] / 2 / r;
        const [x, y] = pos(mid, r);
        g.save();
        g.translate(x, y);
        g.rotate(mid);
        g.scale(0.82, 1);
        g.fillText(ch, 0, 0);
        g.restore();
        a += widths[i] / r;
      });
    };
    arcText("UNITS PER", rIn + 46, Math.PI / 2, 22);
    arcText("HOUR", rIn + 22, Math.PI / 2 + 0.02, 22);
  });
}

/** carica una texture e la applica al materiale quando è pronta (fino ad allora resta il colore pieno) */
function loadInto(mat: THREE.MeshStandardMaterial, file: string, emissive = false) {
  new THREE.TextureLoader().load(TEX + file, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    mat.map = t;
    if (emissive) mat.emissiveMap = t;
    mat.needsUpdate = true;
  });
}

/** Lunetta inclinata: anello con il bordo interno più alto, UV planari per la scala */
function bezelGeometry() {
  const geo = new THREE.RingGeometry(BEZEL_IN, BEZEL_OUT, 160, 2);
  const p = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const r = Math.hypot(x, y);
    p.setZ(i, ((BEZEL_OUT - r) / (BEZEL_OUT - BEZEL_IN)) * 0.06);
    uv.setXY(i, x / (2 * BEZEL_OUT) + 0.5, y / (2 * BEZEL_OUT) + 0.5);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Vetro bombato in plexiglas (calotta sferica) */
function crystalGeometry(radius: number, height: number) {
  const R = (radius * radius + height * height) / (2 * height);
  const geo = new THREE.SphereGeometry(R, 96, 12, 0, Math.PI * 2, 0, Math.asin(radius / R));
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0, height - R);
  return geo;
}

/**
 * Ansa vista di profilo (dal lato corona): larga alla radice, si assottiglia e piega verso il polso.
 * Disegnata nel piano (distanza dal centro, altezza) ed estrusa lungo x.
 */
function lugGeometry(width: number) {
  const s = new THREE.Shape();
  s.moveTo(0.8, CASE_TOP);
  s.lineTo(1.02, CASE_TOP - 0.005);
  s.quadraticCurveTo(1.36, CASE_TOP - 0.03, 1.56, -0.13);
  s.quadraticCurveTo(1.61, -0.27, 1.52, -0.36);
  s.quadraticCurveTo(1.3, -0.33, 1.02, CASE_BOTTOM + 0.02);
  s.lineTo(0.8, CASE_BOTTOM + 0.02);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: width - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 16 });
  geo.translate(0, 0, -(width - 0.04) / 2);
  // (profilo x, profilo y, estrusione) → (x, y, z) della scena = (estrusione, profilo x, profilo y)
  geo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
  // si stringe verso la punta, come nella vista frontale
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = THREE.MathUtils.clamp((p.getY(i) - 1.0) / 0.6, 0, 1);
    p.setX(i, p.getX(i) * (1 - 0.3 * k));
  }
  geo.computeVertexNormals();
  return geo;
}

/** Punta a freccia della lancetta del cronografo */
function arrowGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.032, 0);
  s.lineTo(0.032, 0);
  s.lineTo(0, 0.085);
  s.closePath();
  return new THREE.ShapeGeometry(s);
}

// ---------- materiali con stato "nuovo" e "usurato" ----------
type MatSpec = { mat: THREE.MeshStandardMaterial; newC: THREE.Color; oldC: THREE.Color; newR: number; oldR: number; newE?: number; oldE?: number };

function spec(newColor: string, oldColor: string, newR: number, oldR: number, metalness: number, emissive?: string, newE = 0, oldE = 0): MatSpec {
  const mat = new THREE.MeshStandardMaterial({ color: newColor, metalness, roughness: newR });
  if (emissive) mat.emissive = new THREE.Color(emissive);
  return { mat, newC: new THREE.Color(newColor), oldC: new THREE.Color(oldColor), newR, oldR, newE, oldE };
}

function applyWear(s: MatSpec, w: number) {
  s.mat.color.copy(s.newC).lerp(s.oldC, w);
  s.mat.roughness = lerp(s.newR, s.oldR, w);
  if (s.newE !== undefined) s.mat.emissiveIntensity = lerp(s.newE, s.oldE ?? 0, w);
}

/**
 * Strato di sporco che si può "spazzare via" seguendo l'attrezzo, con un bordo morbido e irregolare.
 *  - mode "linear":   sparisce da un lato all'altro (pennello, oliatore)
 *  - mode "ring":     anello con UV planari che gira sotto la pulitrice: sparisce l'arco già passato
 *                     dal punto di contatto (angolo 0 = ore 3)
 *  - mode "cylinder": come "ring", per il fianco cilindrico della cassa
 */
type WipeMode = "linear" | "ring" | "cylinder";
function wipeable(mat: THREE.MeshStandardMaterial, mode: WipeMode = "linear") {
  const wipe = { value: -1 };
  mat.userData.wipe = wipe;
  const m = mode === "linear" ? "0.0" : mode === "ring" ? "1.0" : "2.0";
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uWipe = wipe;
    sh.fragmentShader = "uniform float uWipe;\n" + sh.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
      float wipeMode = ${m};
      float wipeA = vMapUv.x;
      if (wipeMode > 0.5) {
        float phi = wipeMode > 1.5 ? 6.2831853 * vMapUv.x - 1.5707963 : atan(vMapUv.y - 0.5, vMapUv.x - 0.5);
        wipeA = fract(-phi / 6.2831853);
      }
      float wipeEdge = uWipe + (fract(sin((vMapUv.y + vMapUv.x) * 91.7) * 437.5) - 0.5) * 0.035;
      diffuseColor.a *= smoothstep(wipeEdge - 0.01, wipeEdge + 0.04, wipeA);`
    );
  };
  return mat;
}

// posizione Z montata e spostamento in vista esplosa
export const LAYERS = {
  crystal: [0.26, 2.3],
  bezel: [CASE_TOP, 1.75],
  hands: [0.19, 1.25],
  dial: [0.17, 0.75],
  movement: [-0.07, 0.15],
  case: [0, -0.65],
  back: [CASE_BOTTOM, -2.0],
} as const;

type HandRef = React.RefObject<THREE.Group | null>;

/** Lancetta a bastone in acciaio con inserto luminescente */
function BatonHand({ handRef, name, len, w, z, steel, lume }: { handRef: HandRef; name: string; len: number; w: number; z: number; steel: THREE.Material; lume: THREE.Material }) {
  return (
    <group ref={handRef} name={name} position={[0, 0, z]}>
      <mesh position={[0, (len - 0.1) / 2, 0]} material={steel}>
        <boxGeometry args={[w, len + 0.1, 0.012]} />
      </mesh>
      <mesh position={[0, len * 0.55, 0.0075]} material={lume}>
        <boxGeometry args={[w * 0.42, len * 0.62, 0.004]} />
      </mesh>
    </group>
  );
}

/** Lancetta bianca dei contatori */
function SubHand({ handRef, name, at, mat, hub }: { handRef?: HandRef; name: string; at: readonly [number, number]; mat: THREE.Material; hub: THREE.Material }) {
  return (
    <group position={[at[0] * DIAL_R, at[1] * DIAL_R, -0.01]}>
      <group ref={handRef} name={name}>
        <mesh position={[0, (SUB_R * 0.85 - 0.06) / 2, 0]} material={mat}>
          <boxGeometry args={[0.022, SUB_R * 0.85 + 0.06, 0.006]} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]} material={hub}>
        <cylinderGeometry args={[0.022, 0.022, 0.01, 20]} />
      </mesh>
    </group>
  );
}

export default function WatchModel({
  state,
  realTime = false,
}: {
  state: React.RefObject<WatchState>;
  realTime?: boolean;
}) {
  const g = {
    crystal: useRef<THREE.Group>(null),
    bezel: useRef<THREE.Group>(null),
    hands: useRef<THREE.Group>(null),
    dial: useRef<THREE.Group>(null),
    movement: useRef<THREE.Group>(null),
    case: useRef<THREE.Group>(null),
    back: useRef<THREE.Group>(null),
  };
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  const clock = useRef({ sec: 37, min: 8.6, hr: 10.14, t: 0 }); // ora "ferma" dell'orologio usurato

  const m = useMemo(() => {
    const overlay = (map: THREE.Texture, mode?: WipeMode) =>
      wipeable(new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 }), mode);
    const grime = makeDirtTexture(7, "grime");
    const light = makeDirtTexture(13, "patina");

    // il quadrante è anche leggermente emissivo, così la crema resta calda con qualsiasi luce
    const dial = spec("#ffffff", "#cdb98c", 0.6, 0.9, 0.05, "#ffffff", 0.32, 0.12);
    loadInto(dial.mat, "quadrante.webp", true);
    const caseback = spec("#ffffff", "#b3aa99", 0.3, 0.7, 0.75);
    loadInto(caseback.mat, "fondello.webp");
    const crownFace = spec("#ffffff", "#9a9182", 0.25, 0.7, 0.8);
    loadInto(crownFace.mat, "corona.webp");
    const mvDial = spec("#ffffff", "#b0a48c", 0.45, 0.85, 0.35);
    loadInto(mvDial.mat, "movimento-lato-quadrante.webp");
    const mvBridges = spec("#ffffff", "#b0a48c", 0.4, 0.85, 0.35);
    loadInto(mvBridges.mat, "movimento-ponti.webp");
    const bezel = spec("#ececef", "#8c867b", 0.3, 0.7, 1);
    bezel.mat.map = makeBezelTexture();

    return {
      steel: spec("#e6e6e9", "#8c867b", 0.22, 0.7, 1),
      brushed: spec("#dadadd", "#857f74", 0.38, 0.75, 1),
      bezel,
      dial,
      caseback,
      crownFace,
      mvDial,
      mvBridges,
      rehaut: spec("#1d1d1d", "#2a2620", 0.5, 0.8, 0.4),
      lume: spec("#f2ecdc", "#c9b077", 0.6, 0.85, 0, "#f2ecdc", 0.08, 0),
      subHand: spec("#f4f1ea", "#d2c49f", 0.4, 0.8, 0.1),
      chrono: spec("#202020", "#2b2823", 0.4, 0.8, 0.5),
      plate: spec("#c9c7c2", "#6f6455", 0.35, 0.8, 0.9),
      crystal: new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.1, roughness: 0, metalness: 0, clearcoat: 1, color: "#ffffff", depthWrite: false }),
      // sporco di ogni pezzo (materiali separati, così ognuno si pulisce per conto suo)
      caseGrime: overlay(grime, "cylinder"),
      bezelGrime: overlay(grime, "ring"),
      backGrime: overlay(light),
      mvGrime: overlay(light),
      dialPatina: overlay(makeDirtTexture(31, "patina")),
    };
  }, []);

  const geos = useMemo(
    () => ({
      bezel: bezelGeometry(),
      crystal: crystalGeometry(BEZEL_IN + 0.01, 0.18),
      arrow: arrowGeometry(),
      lug: lugGeometry(0.17),
    }),
    []
  );

  useFrame((_, delta) => {
    const { explode, wear, run } = state.current;
    const dt = Math.min(delta, 0.05);

    (Object.keys(g) as (keyof typeof g)[]).forEach((k) => {
      const grp = g[k].current;
      if (!grp) return;
      grp.position.z = LAYERS[k][0] + LAYERS[k][1] * explode;
      const off = state.current.aside?.[k];
      grp.position.x = off?.[0] ?? 0;
      grp.position.y = off?.[1] ?? 0;
    });

    // usura, pezzo per pezzo
    const restored = state.current.restored;
    const partWear = (p: WatchPart) => (restored?.[p] !== undefined ? 1 - restored[p]! : wear);
    const parts: [WatchPart, MatSpec[], THREE.MeshStandardMaterial[], number][] = [
      ["case", [m.steel, m.brushed, m.crownFace], [m.caseGrime], 1],
      ["bezel", [m.bezel], [m.bezelGrime], 1],
      ["back", [m.caseback], [m.backGrime], 0.6],
      ["movement", [m.mvDial, m.mvBridges, m.plate], [m.mvGrime], 0.6],
      ["dial", [m.dial, m.rehaut, m.lume, m.subHand, m.chrono], [m.dialPatina], 0.85],
    ];
    for (const [part, specs, overlays, strength] of parts) {
      const w = partWear(part);
      specs.forEach((s) => applyWear(s, w));
      for (const o of overlays) {
        const wipe = o.userData.wipe as { value: number };
        if (restored?.[part] !== undefined) {
          // lo sporco resta pieno e viene spazzato via dove passa l'attrezzo
          o.opacity = strength;
          wipe.value = lerp(-0.08, 1.08, restored[part]!);
        } else {
          o.opacity = w * strength;
          wipe.value = -1;
        }
      }
    }
    const cw = partWear("crystal");
    m.crystal.opacity = lerp(0.1, 0.4, cw);
    m.crystal.roughness = lerp(0, 0.55, cw);
    m.crystal.color.set("#ffffff").lerp(new THREE.Color("#b9a46b"), cw);
    if (g.case.current) g.case.current.rotation.z = state.current.spin?.case ?? 0;
    if (g.bezel.current) g.bezel.current.rotation.z = state.current.spin?.bezel ?? 0;

    // ore e minuti al centro, secondi nel contatore a ore 9
    const c = clock.current;
    if (realTime) {
      const now = new Date();
      c.sec = now.getSeconds() + now.getMilliseconds() / 1000;
      c.min = now.getMinutes() + c.sec / 60;
      c.hr = (now.getHours() % 12) + c.min / 60;
    } else if (run > 0) {
      c.sec += dt * run;
      c.min += (dt * run) / 60;
      c.hr += (dt * run) / 3600;
    }
    if (second.current) second.current.rotation.z = -(c.sec / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(c.min / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(c.hr / 12) * Math.PI * 2;

  });

  const radial = (deg: number, r: number) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r] as const;

  return (
    <group>
      {/* ---------------- CASSA ---------------- */}
      <group ref={g.case} name="cassa">
        <mesh position={[0, 0, (CASE_TOP + CASE_BOTTOM) / 2]} rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
          <cylinderGeometry args={[CASE_R, CASE_R - 0.05, CASE_TOP - CASE_BOTTOM, 128, 1, true]} />
        </mesh>
        <mesh position={[0, 0, (CASE_TOP + CASE_BOTTOM) / 2]} rotation={[Math.PI / 2, 0, 0]} material={m.caseGrime}>
          <cylinderGeometry args={[CASE_R + 0.005, CASE_R - 0.045, CASE_TOP - CASE_BOTTOM, 96, 1, true]} />
        </mesh>
        <mesh position={[0, 0, CASE_TOP - 0.005]} material={m.steel.mat}>
          <ringGeometry args={[1.0, CASE_R, 128]} />
        </mesh>
        <mesh position={[0, 0, CASE_BOTTOM + 0.005]} rotation={[Math.PI, 0, 0]} material={m.brushed.mat}>
          <ringGeometry args={[0.98, CASE_R - 0.05, 128]} />
        </mesh>
        {/* anse: profilo a banana preso dalla vista laterale */}
        {[
          [0.76, 1],
          [-0.76, 1],
          [0.76, -1],
          [-0.76, -1],
        ].map(([x, dir], i) => (
          <mesh key={i} geometry={geos.lug} position={[x, 0, 0]} scale={[1, dir, 1]} material={m.brushed.mat} />
        ))}
        {/* corona a ore 3, con la coroncina sulla testa */}
        <mesh position={[CASE_R + 0.04, 0, -0.04]} rotation={[0, 0, Math.PI / 2]} material={m.steel.mat}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 20]} />
        </mesh>
        <mesh position={[CASE_R + 0.15, 0, -0.04]} rotation={[0, 0, Math.PI / 2]} material={m.steel.mat}>
          <cylinderGeometry args={[0.13, 0.13, 0.17, 18]} />
        </mesh>
        <mesh position={[CASE_R + 0.236, 0, -0.04]} rotation={[0, Math.PI / 2, 0]} material={m.crownFace.mat}>
          <circleGeometry args={[0.125, 32]} />
        </mesh>
        {/* pulsanti a pompa a ore 2 e 4 */}
        {[28, -28].map((deg) => {
          const [x0, y0] = radial(deg, CASE_R + 0.04);
          const [x1, y1] = radial(deg, CASE_R + 0.17);
          const rot = ((deg - 90) * Math.PI) / 180;
          return (
            <group key={deg} position={[0, 0, -0.04]}>
              <mesh position={[x0, y0, 0]} rotation={[0, 0, rot]} material={m.steel.mat}>
                <cylinderGeometry args={[0.05, 0.05, 0.1, 20]} />
              </mesh>
              <mesh position={[x1, y1, 0]} rotation={[0, 0, rot]} material={m.steel.mat}>
                <cylinderGeometry args={[0.085, 0.085, 0.16, 28]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ---------------- FONDELLO con "DRIVE CAREFULLY ME" ---------------- */}
      <group ref={g.back} name="fondello">
        <mesh position={[0, 0, -0.022]} rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
          <cylinderGeometry args={[1.03, 1.01, 0.045, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.0455]} rotation={[0, Math.PI, 0]} material={m.caseback.mat}>
          <circleGeometry args={[1.01, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.046]} rotation={[0, Math.PI, 0]} material={m.backGrime}>
          <circleGeometry args={[1.01, 64]} />
        </mesh>
      </group>

      {/* ---------------- MOVIMENTO Valjoux 72 / calibro 722 ---------------- */}
      <group ref={g.movement} name="movimento">
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.plate.mat}>
          <cylinderGeometry args={[0.98, 0.98, 0.12, 96, 1, true]} />
        </mesh>
        {/* lato quadrante (verso il davanti) */}
        <mesh position={[0, 0, 0.06]} material={m.mvDial.mat}>
          <circleGeometry args={[0.98, 96]} />
        </mesh>
        <mesh position={[0, 0, 0.061]} material={m.mvGrime}>
          <circleGeometry args={[0.98, 64]} />
        </mesh>
        {/* lato ponti, con bilanciere e ruote (verso il fondello) */}
        <mesh position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]} material={m.mvBridges.mat}>
          <circleGeometry args={[0.98, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.061]} rotation={[0, Math.PI, 0]} material={m.mvGrime}>
          <circleGeometry args={[0.98, 64]} />
        </mesh>
      </group>

      {/* ---------------- QUADRANTE ---------------- */}
      <group ref={g.dial} name="quadrante">
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.plate.mat}>
          <cylinderGeometry args={[DIAL_R, DIAL_R, 0.02, 128]} />
        </mesh>
        <mesh position={[0, 0, 0.0105]} material={m.dial.mat}>
          <circleGeometry args={[DIAL_R, 128]} />
        </mesh>
        <mesh position={[0, 0, 0.011]} material={m.dialPatina}>
          <circleGeometry args={[DIAL_R, 64]} />
        </mesh>
        {/* réhaut: anello scuro tra quadrante e lunetta */}
        <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} material={m.rehaut.mat}>
          <cylinderGeometry args={[BEZEL_IN, DIAL_R, 0.07, 128, 1, true]} />
        </mesh>
      </group>

      {/* ---------------- LANCETTE ---------------- */}
      <group ref={g.hands} name="lancette">
        <SubHand handRef={second} name="lancetta_secondi" at={SUB.seconds} mat={m.subHand.mat} hub={m.steel.mat} />
        <SubHand name="lancetta_contaminuti" at={SUB.minutes} mat={m.subHand.mat} hub={m.steel.mat} />
        <SubHand name="lancetta_contaore" at={SUB.hours} mat={m.subHand.mat} hub={m.steel.mat} />
        <group position={[PIVOT[0], PIVOT[1], 0]}>
          <BatonHand handRef={hour} name="lancetta_ore" len={0.5} w={0.058} z={0} steel={m.steel.mat} lume={m.lume.mat} />
          <BatonHand handRef={minute} name="lancetta_minuti" len={0.84} w={0.046} z={0.016} steel={m.steel.mat} lume={m.lume.mat} />
          {/* lancetta del cronografo, ferma a ore 12 */}
          <group name="lancetta_cronografo" position={[0, 0, 0.032]}>
            <mesh position={[0, 0.36, 0]} material={m.chrono.mat}>
              <boxGeometry args={[0.012, 1.2, 0.005]} />
            </mesh>
            <mesh position={[0, 0.88, 0.003]} geometry={geos.arrow} material={m.lume.mat} />
            <mesh position={[0, -0.2, 0]} material={m.chrono.mat}>
              <boxGeometry args={[0.03, 0.09, 0.005]} />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.034]} rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
            <cylinderGeometry args={[0.035, 0.035, 0.016, 24]} />
          </mesh>
        </group>
      </group>

      {/* ---------------- LUNETTA TACHIMETRICA ---------------- */}
      <group ref={g.bezel} name="lunetta">
        <mesh geometry={geos.bezel} material={m.bezel.mat} />
        <mesh geometry={geos.bezel} material={m.bezelGrime} />
        <mesh position={[0, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
          <cylinderGeometry args={[BEZEL_OUT, BEZEL_OUT, 0.06, 128, 1, true]} />
        </mesh>
      </group>

      {/* ---------------- VETRO BOMBATO ---------------- */}
      <group ref={g.crystal} name="vetro">
        <mesh geometry={geos.crystal} material={m.crystal} />
        <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} material={m.crystal}>
          <cylinderGeometry args={[BEZEL_IN + 0.01, BEZEL_IN + 0.01, 0.04, 96, 1, true]} />
        </mesh>
      </group>
    </group>
  );
}
