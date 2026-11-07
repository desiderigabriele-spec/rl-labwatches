"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import Watch from "./three/Watch";
import { LAYERS, type WatchState } from "./three/WatchModel";
import StudioLights from "./three/StudioLights";
import RestorationTools from "./three/RestorationTools";
import { PHASES, during, phase } from "./three/restoration-timeline";

const ss = THREE.MathUtils.smoothstep;
const lerp = THREE.MathUtils.lerp;
const z1 = (k: keyof typeof LAYERS) => LAYERS[k][0] + LAYERS[k][1]; // posizione a orologio esploso

/** su cosa si avvicina la telecamera in ogni fase (z del pezzo a orologio esploso) */
const FOCUS = [
  { phase: PHASES.back, z: z1("back") },
  { phase: PHASES.movement, z: z1("movement") },
  { phase: PHASES.dial, z: z1("dial") },
  { phase: PHASES.bezel, z: z1("bezel") },
  { phase: PHASES.case, z: z1("case") },
] as const;

function Sequence({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null);
  const state = useRef<WatchState>({ explode: 0, wear: 1, run: 0, restored: {} });
  const p = useRef(0);
  const tmp = useRef(new THREE.Vector3());

  useFrame((st, delta) => {
    // insegue lo scroll con un leggero smorzamento
    p.current = THREE.MathUtils.damp(p.current, progress.get(), 6, delta);
    const v = p.current;

    const explode = ss(v, PHASES.explodeIn[0], PHASES.explodeIn[1]) * (1 - ss(v, PHASES.explodeOut[0], PHASES.explodeOut[1]));
    state.current.explode = explode;
    state.current.run = ss(v, PHASES.start[0], PHASES.start[1]);
    state.current.restored = {
      back: phase(v, PHASES.back),
      movement: phase(v, PHASES.movement),
      dial: phase(v, PHASES.dial),
      bezel: phase(v, PHASES.bezel),
      case: phase(v, PHASES.case),
      crystal: phase(v, PHASES.crystal),
    };

    // i pezzi che coprirebbero il lavoro vengono appoggiati di lato e poi rimontati
    const remount = 1 - ss(v, PHASES.explodeOut[0] - 0.02, PHASES.explodeOut[0] + 0.05);
    const backAside = ss(v, PHASES.back[1], PHASES.movement[0] + 0.005) * remount;
    const frontAside = ss(v, PHASES.backOut[0], PHASES.dial[0] - 0.01) * remount;
    const bezelBack = ss(v, PHASES.dial[1], PHASES.bezel[0]);
    state.current.aside = {
      back: [backAside * 6.5, backAside * 0.6],
      crystal: [frontAside * -6.5, frontAside * 1.2],
      hands: [frontAside * -6.5, frontAside * -1.2],
      bezel: [frontAside * (1 - bezelBack) * -6.5, 0],
    };

    if (!root.current) return;
    const t = st.clock.elapsedTime;
    const narrow = st.size.width / st.size.height < 1;

    // giro sul retro per fondello e movimento, poi di nuovo davanti
    const back = ss(v, PHASES.backIn[0], PHASES.backIn[1]) * (1 - ss(v, PHASES.backOut[0], PHASES.backOut[1]));
    // la telecamera si avvicina al pezzo su cui si lavora
    let wSum = 0, zSum = 0;
    const w = FOCUS.map((f) => during(v, f.phase, 0.03));
    FOCUS.forEach((f, i) => {
      wSum += w[i];
      zSum += w[i] * f.z;
    });
    const focus = Math.min(1, wSum);
    const fz = wSum > 0 ? zSum / wSum : 0;
    const front = w[2] + w[3]; // quadrante e lunetta: un po' più di fronte
    const rear = w[0] + w[1]; // fondello e movimento: più dritti da dietro

    root.current.rotation.y = lerp(-0.3, -1.05, explode) - back * 1.3 - rear * 0.35 + front * 0.55 + Math.sin(t * 0.4) * 0.05 + st.pointer.x * 0.1;
    root.current.rotation.x = lerp(0.12, 0.38, explode) - front * 0.12 - st.pointer.y * 0.06;

    const baseScale = lerp(narrow ? 0.85 : 1, narrow ? 0.58 : 0.8, explode);
    const scale = lerp(baseScale, narrow ? 0.95 : 1.25, focus);
    const basePos = new THREE.Vector3(lerp(0, narrow ? 0.55 : 0.75, explode), 0, 0);
    // posizione che porta il pezzo inquadrato al centro
    const focusPos = tmp.current.set(0, 0, fz).applyEuler(root.current.rotation).multiplyScalar(-scale);
    focusPos.y += narrow ? 0.15 : 0.1;
    const target = basePos.lerp(focusPos, focus);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, target.x, 5, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, target.y, 5, delta);
    root.current.position.z = THREE.MathUtils.damp(root.current.position.z, target.z, 5, delta);
    root.current.scale.setScalar(THREE.MathUtils.damp(root.current.scale.x, scale, 5, delta));
  });

  return (
    <group ref={root}>
      <Watch state={state} />
      <RestorationTools state={state} progress={p} />
    </group>
  );
}

export default function RestorationScene({ progress, active = true }: { progress: MotionValue<number>; active?: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 7.4], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <StudioLights />
      <Sequence progress={progress} />
      <ContactShadows position={[0, -2.1, 0]} opacity={0.3} scale={9} blur={2.8} far={4} />
    </Canvas>
  );
}
