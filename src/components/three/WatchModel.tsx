"use client";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Orologio 3D costruito in codice, con movimento interno.
 * Lo stato (letto a ogni frame) controlla:
 *  - explode: 0 = montato, 1 = esploso nei suoi componenti
 *  - wear:    0 = come nuovo, 1 = usurato (graffi, sporco, vetro ingiallito)
 *  - run:     0 = fermo, 1 = in marcia
 */
export type WatchState = { explode: number; wear: number; run: number };

const lerp = THREE.MathUtils.lerp;

// ---------- texture procedurali ----------
function makeDirtTexture(seed: number, kind: "grime" | "patina") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);

  // macchie
  const spots = kind === "grime" ? 70 : 45;
  for (let i = 0; i < spots; i++) {
    const x = rnd() * 512, y = rnd() * 512, r = 6 + rnd() * (kind === "grime" ? 46 : 30);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const col = kind === "grime" ? `rgba(${60 + rnd() * 40},${45 + rnd() * 25},${25 + rnd() * 15},` : `rgba(${150 + rnd() * 40},${110 + rnd() * 30},${55 + rnd() * 20},`;
    grad.addColorStop(0, col + (0.55 + rnd() * 0.35) + ")");
    grad.addColorStop(1, col + "0)");
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // graffi
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
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function gearGeometry(r: number, teeth: number, depth = 0.022) {
  const shape = new THREE.Shape();
  const inner = r * 0.88;
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const pts: [number, number][] = [
      [a0, inner],
      [a0 + step * 0.2, r],
      [a0 + step * 0.5, r],
      [a0 + step * 0.7, inner],
    ];
    pts.forEach(([a, rr], j) => {
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (i === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  // finestre (razze)
  const windows = 4;
  for (let i = 0; i < windows; i++) {
    const a = (i / windows) * Math.PI * 2 + 0.25;
    const h = new THREE.Path();
    h.absarc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.22, 0, Math.PI * 2, false);
    shape.holes.push(h);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 6 });
  geo.translate(0, 0, -depth / 2);
  return geo;
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

// posizione Z montata e spostamento in vista esplosa
const LAYERS = {
  crystal: [0.25, 2.3],
  bezel: [0.19, 1.75],
  hands: [0.21, 1.25],
  dial: [0.18, 0.75],
  movement: [0, 0.15],
  case: [0, -0.65],
  back: [-0.18, -1.35],
} as const;

export default function WatchModel({
  state,
  realTime = false,
  strap = false,
}: {
  state: React.RefObject<WatchState>;
  realTime?: boolean;
  strap?: boolean;
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
  const balance = useRef<THREE.Group>(null);
  const gears = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef({ sec: 37, min: 8.6, hr: 10.14, t: 0 }); // ora "ferma" dell'orologio usurato

  const m = useMemo(() => {
    const grime = makeDirtTexture(7, "grime");
    const patina = makeDirtTexture(31, "patina");
    const overlay = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 });
    return {
      steel: spec("#d9d9dc", "#8c867b", 0.22, 0.7, 1),
      gold: spec("#bd923c", "#76643f", 0.28, 0.75, 1),
      applied: spec("#e2c473", "#8f7d55", 0.3, 0.7, 0.55, "#3a2d14", 0.6, 0),
      dial: spec("#00452a", "#33392b", 0.38, 0.85, 0.45), // verde del marchio
      plate: spec("#d8d5ce", "#6f6455", 0.32, 0.8, 0.9),
      bridge: spec("#e3e1dc", "#7a6f5f", 0.25, 0.8, 0.95),
      brass: spec("#d6b56b", "#6b5532", 0.3, 0.8, 1),
      screw: spec("#2c4f99", "#3b3a36", 0.3, 0.8, 0.9),
      ticks: spec("#b5b0a6", "#6d675d", 0.5, 0.8, 0.2),
      crystal: new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.12, roughness: 0, metalness: 0, clearcoat: 1, color: "#ffffff" }),
      grimeOverlay: overlay(grime),
      patinaOverlay: overlay(patina),
      jewel: new THREE.MeshStandardMaterial({ color: "#b3122a", emissive: "#5a0010", emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.2 }),
      leather: new THREE.MeshStandardMaterial({ color: "#2a1d14", roughness: 0.75 }),
    };
  }, []);

  const gearGeos = useMemo(
    () => [
      { geo: gearGeometry(0.34, 40), pos: [0.18, 0.22] as const, r: 0.34, mat: "brass" as const },
      { geo: gearGeometry(0.22, 26), pos: [0.66, -0.12] as const, r: 0.22, mat: "brass" as const },
      { geo: gearGeometry(0.17, 20), pos: [0.2, -0.36] as const, r: 0.17, mat: "steel" as const },
      { geo: gearGeometry(0.13, 16), pos: [-0.38, 0.5] as const, r: 0.13, mat: "brass" as const },
    ],
    []
  );

  const indices = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ a: (i / 12) * Math.PI * 2, main: i % 3 === 0 })), []);
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => (i / 60) * Math.PI * 2).filter((_, i) => i % 5 !== 0), []);

  useFrame((st, delta) => {
    const { explode, wear, run } = state.current;
    const dt = Math.min(delta, 0.05);

    // posizioni dei componenti
    (Object.keys(g) as (keyof typeof g)[]).forEach((k) => {
      const grp = g[k].current;
      if (grp) grp.position.z = LAYERS[k][0] + LAYERS[k][1] * explode;
    });

    // usura
    [m.steel, m.gold, m.applied, m.dial, m.plate, m.bridge, m.brass, m.screw, m.ticks].forEach((s) => applyWear(s, wear));
    m.grimeOverlay.opacity = wear;
    m.patinaOverlay.opacity = wear * 0.9;
    m.crystal.opacity = lerp(0.12, 0.6, wear);
    m.crystal.roughness = lerp(0, 0.55, wear);
    m.crystal.color.set("#ffffff").lerp(new THREE.Color("#b9a46b"), wear);

    // lancette
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

    // movimento: bilanciere e ruote
    c.t += dt * run;
    if (balance.current) balance.current.rotation.z = Math.sin(c.t * Math.PI * 2 * 2.5) * 1.8 * run;
    gears.current.forEach((gm, i) => {
      if (gm) gm.rotation.z += (i % 2 ? -1 : 1) * (dt * run * 0.9) / gearGeos[i].r * 0.1;
    });
    void st;
  });

  return (
    <group>
      {/* ---------------- CASSA ---------------- */}
      <group ref={g.case}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
          <cylinderGeometry args={[1.22, 1.18, 0.36, 96, 1, true]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.grimeOverlay}>
          <cylinderGeometry args={[1.225, 1.185, 0.36, 96, 1, true]} />
        </mesh>
        {/* fondo interno e battuta del vetro */}
        <mesh position={[0, 0, 0.17]} material={m.steel.mat}>
          <ringGeometry args={[1.05, 1.22, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.17]} rotation={[Math.PI, 0, 0]} material={m.steel.mat}>
          <ringGeometry args={[0.98, 1.18, 96]} />
        </mesh>
        {/* anse */}
        {[
          [0.38, 1.12],
          [-0.38, 1.12],
          [0.38, -1.12],
          [-0.38, -1.12],
        ].map(([x, y], i) => (
          <RoundedBox key={i} args={[0.16, 0.5, 0.2]} radius={0.05} position={[x, y, 0]} material={m.steel.mat} />
        ))}
        {/* corona */}
        <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.gold.mat}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 24]} />
        </mesh>
        {/* cinturino */}
        {strap &&
          [1, -1].map((dir) => (
            <group key={dir}>
              {Array.from({ length: 4 }, (_, i) => (
                <RoundedBox
                  key={i}
                  args={[0.92 - i * 0.03, 0.5, 0.14]}
                  radius={0.05}
                  position={[0, dir * (1.45 + i * 0.52), -0.06 - i * i * 0.05]}
                  rotation={[dir * -0.12 * i, 0, 0]}
                  material={m.leather}
                />
              ))}
            </group>
          ))}
      </group>

      {/* ---------------- FONDELLO ---------------- */}
      <group ref={g.back}>
        <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} material={m.steel.mat}>
          <cylinderGeometry args={[1.12, 1.1, 0.05, 96]} />
        </mesh>
        <mesh position={[0, 0, -0.046]} rotation={[Math.PI, 0, 0]} material={m.grimeOverlay}>
          <circleGeometry args={[1.1, 64]} />
        </mesh>
        <mesh position={[0, 0, -0.05]} material={m.gold.mat}>
          <torusGeometry args={[0.8, 0.012, 8, 96]} />
        </mesh>
      </group>

      {/* ---------------- MOVIMENTO ---------------- */}
      <group ref={g.movement}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.plate.mat}>
          <cylinderGeometry args={[0.98, 0.98, 0.12, 96]} />
        </mesh>
        <mesh position={[0, 0, 0.061]} material={m.grimeOverlay}>
          <circleGeometry args={[0.98, 64]} />
        </mesh>
        {/* ponti */}
        <RoundedBox args={[1.25, 0.3, 0.04]} radius={0.015} position={[0.1, 0.62, 0.08]} rotation={[0, 0, -0.25]} material={m.bridge.mat} />
        <RoundedBox args={[1.1, 0.26, 0.04]} radius={0.015} position={[0.35, -0.6, 0.08]} rotation={[0, 0, 0.35]} material={m.bridge.mat} />
        {/* ruote */}
        {gearGeos.map((gg, i) => (
          <group key={i} position={[gg.pos[0], gg.pos[1], 0.085]}>
            <mesh
              ref={(el) => {
                gears.current[i] = el;
              }}
              geometry={gg.geo}
              material={m[gg.mat].mat}
            />
            <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={m.jewel}>
              <cylinderGeometry args={[0.028, 0.028, 0.012, 16]} />
            </mesh>
          </group>
        ))}
        {/* bilanciere */}
        <group position={[-0.48, -0.32, 0.1]}>
          <group ref={balance}>
            <mesh material={m.brass.mat}>
              <torusGeometry args={[0.24, 0.022, 12, 64]} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} rotation={[0, 0, (i / 3) * Math.PI * 2]} position={[0, 0, 0]} material={m.brass.mat}>
                <boxGeometry args={[0.02, 0.48, 0.012]} />
              </mesh>
            ))}
          </group>
          <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={m.jewel}>
            <cylinderGeometry args={[0.03, 0.03, 0.012, 16]} />
          </mesh>
        </group>
        {/* viti azzurrate */}
        {[
          [-0.42, 0.72],
          [0.62, 0.48],
          [-0.2, -0.78],
          [0.85, -0.38],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.11]} rotation={[Math.PI / 2, 0, 0]} material={m.screw.mat}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          </mesh>
        ))}
      </group>

      {/* ---------------- QUADRANTE ---------------- */}
      <group ref={g.dial}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.dial.mat}>
          <cylinderGeometry args={[1.07, 1.07, 0.02, 96]} />
        </mesh>
        <mesh position={[0, 0, 0.0105]} material={m.patinaOverlay}>
          <circleGeometry args={[1.07, 64]} />
        </mesh>
        {indices.map(({ a, main }, i) => (
          <mesh key={i} position={[Math.sin(a) * 0.83, Math.cos(a) * 0.83, 0.02]} rotation={[0, 0, -a]} material={m.applied.mat}>
            <boxGeometry args={[main ? 0.07 : 0.045, main ? 0.22 : 0.15, 0.025]} />
          </mesh>
        ))}
        {ticks.map((a, i) => (
          <mesh key={i} position={[Math.sin(a) * 0.99, Math.cos(a) * 0.99, 0.015]} rotation={[0, 0, -a]} material={m.ticks.mat}>
            <boxGeometry args={[0.012, 0.05, 0.01]} />
          </mesh>
        ))}
      </group>

      {/* ---------------- LANCETTE ---------------- */}
      <group ref={g.hands}>
        {(
          [
            [hour, 0.5, 0.06, 0.005, m.applied.mat, 0.12],
            [minute, 0.78, 0.04, 0.015, m.applied.mat, 0.12],
            [second, 0.92, 0.014, 0.025, null, 0.22],
          ] as const
        ).map(([ref, len, w, z, mat, tail], i) => (
          <group key={i} ref={ref} position={[0, 0, z]}>
            <mesh position={[0, (len - tail) / 2, 0]} material={mat ?? undefined}>
              <boxGeometry args={[w, len + tail, 0.012]} />
              {!mat && <meshStandardMaterial color="#b8433a" metalness={0.5} roughness={0.35} />}
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]} material={m.gold.mat}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
        </mesh>
      </group>

      {/* ---------------- LUNETTA ---------------- */}
      <group ref={g.bezel}>
        <mesh material={m.gold.mat}>
          <torusGeometry args={[1.14, 0.075, 24, 120]} />
        </mesh>
        <mesh material={m.grimeOverlay}>
          <torusGeometry args={[1.14, 0.077, 24, 120]} />
        </mesh>
      </group>

      {/* ---------------- VETRO ---------------- */}
      <group ref={g.crystal}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.crystal}>
          <cylinderGeometry args={[1.08, 1.08, 0.03, 96]} />
        </mesh>
      </group>
    </group>
  );
}
