"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import Watch from "./three/Watch";
import type { WatchState } from "./three/WatchModel";
import StudioLights from "./three/StudioLights";

const ss = THREE.MathUtils.smoothstep;
const lerp = THREE.MathUtils.lerp;

// Tempi della sequenza (0 = inizio sezione, 1 = fine)
export const T = {
  explodeIn: [0.14, 0.32],
  restore: [0.36, 0.58],
  explodeOut: [0.62, 0.8],
  start: [0.82, 0.9],
} as const;

function Sequence({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const state = useRef<WatchState>({ explode: 0, wear: 1, run: 0 });
  const p = useRef(0);

  useFrame((st, delta) => {
    // insegue lo scroll con un leggero smorzamento
    p.current = THREE.MathUtils.damp(p.current, progress.get(), 6, delta);
    const v = p.current;

    const explode = ss(v, T.explodeIn[0], T.explodeIn[1]) * (1 - ss(v, T.explodeOut[0], T.explodeOut[1]));
    const restore = ss(v, T.restore[0], T.restore[1]);
    state.current.explode = explode;
    state.current.wear = 1 - restore;
    state.current.run = ss(v, T.start[0], T.start[1]);

    if (root.current) {
      const t = st.clock.elapsedTime;
      root.current.rotation.y = lerp(-0.3, -1.05, explode) + Math.sin(t * 0.4) * 0.06 + st.pointer.x * 0.12;
      root.current.rotation.x = lerp(0.12, 0.38, explode) - st.pointer.y * 0.08;
      // in vista esplosa rimpicciolisce e sposta a destra, così tutti i pezzi restano nell'inquadratura
      const narrow = st.size.width / st.size.height < 1;
      root.current.scale.setScalar(lerp(narrow ? 0.85 : 1, narrow ? 0.58 : 0.8, explode));
      root.current.position.x = lerp(0, narrow ? 0.55 : 0.75, explode);
    }
    // riflesso di "lucidatura" che attraversa l'orologio durante il restauro
    if (sweep.current) {
      const k = ss(v, T.restore[0] - 0.02, T.restore[1] + 0.02);
      sweep.current.position.x = lerp(-5, 5, k);
      sweep.current.intensity = Math.sin(k * Math.PI) * 40;
    }
  });

  return (
    <>
      <pointLight ref={sweep} position={[-5, 1.5, 3]} intensity={0} color="#fff6df" distance={12} />
      <group ref={root}>
        <Watch state={state} />
      </group>
    </>
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
