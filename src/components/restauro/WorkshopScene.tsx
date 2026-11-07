"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import Watch from "../three/Watch";
import type { WatchState } from "../three/WatchModel";
import StudioLights from "../three/StudioLights";
import { FINAL_START } from "./chapters";

/** Il Daytona 3D della sezione restauro: usurato quando arriva, restaurato e in marcia alla fine */
function Daytona({ progress }: { progress: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null);
  const state = useRef<WatchState>({ explode: 0, wear: 1, run: 0 });
  useFrame((st, delta) => {
    const v = progress.get();
    state.current.wear = v < 0.5 ? 1 : 0;
    state.current.run = THREE.MathUtils.smoothstep(v, FINAL_START, FINAL_START + 0.06);
    if (!root.current) return;
    const idle = Math.sin(st.clock.elapsedTime * 0.35) * 0.2;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.35 + idle + st.pointer.x * 0.35, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.15 - st.pointer.y * 0.25, 3, delta);
  });
  return (
    <group ref={root}>
      <Watch state={state} />
    </group>
  );
}

export default function WorkshopScene({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  return (
    <Canvas frameloop={active ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6.6], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <StudioLights />
      <Daytona progress={progress} />
      <ContactShadows position={[0, -2.1, 0]} opacity={0.3} scale={9} blur={2.8} far={4} />
    </Canvas>
  );
}
