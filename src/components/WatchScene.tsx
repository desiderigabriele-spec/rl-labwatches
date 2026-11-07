"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useRef } from "react";
import useOnScreen from "@/lib/useOnScreen";
import * as THREE from "three";
import Watch from "./three/Watch";
import type { WatchState } from "./three/WatchModel";
import StudioLights from "./three/StudioLights";

// Orologio della home: nuovo, con l'ora reale, segue il puntatore.
function HeroWatch({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const state = useRef<WatchState>({ explode: 0, wear: 0, run: 1 });

  useFrame((st, delta) => {
    if (!root.current) return;
    const idle = reducedMotion ? 0 : Math.sin(st.clock.elapsedTime * 0.35) * 0.25;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, -0.35 + st.pointer.x * 0.5 + idle, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0.18 - st.pointer.y * 0.35, 3, delta);
  });

  return (
    <group ref={root} rotation={[0.18, -0.35, 0]} scale={1.08}>
      <Watch state={state} realTime />
    </group>
  );
}

export default function WatchScene() {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const box = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(box);
  return (
    <div ref={box} className="h-full w-full">
    <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <StudioLights />
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.5}>
        <HeroWatch reducedMotion={reducedMotion} />
      </Float>
      <ContactShadows position={[0, -2.2, 0]} opacity={0.35} scale={8} blur={2.6} far={4} />
    </Canvas>
    </div>
  );
}
