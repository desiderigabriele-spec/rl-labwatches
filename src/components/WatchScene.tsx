"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Orologio 3D costruito in codice (nessun modello esterno da scaricare).
// Le lancette segnano l'ora reale; l'orologio segue il puntatore.

const STEEL = { color: "#d9d9dc", metalness: 1, roughness: 0.22 } as const;
const GOLD = { color: "#c8a96a", metalness: 1, roughness: 0.28 } as const;
// Indici e lancette: meno metallici, così restano leggibili anche frontalmente
const APPLIED = { color: "#e4cf9f", metalness: 0.55, roughness: 0.3, emissive: "#3a2d14", emissiveIntensity: 0.6 } as const;

function Hand({
  length,
  width,
  z,
  color,
  handRef,
  tail = 0.12,
}: {
  length: number;
  width: number;
  z: number;
  color: string;
  handRef: React.RefObject<THREE.Group | null>;
  tail?: number;
}) {
  return (
    <group ref={handRef} position={[0, 0, z]}>
      <mesh position={[0, (length - tail) / 2, 0]}>
        <boxGeometry args={[width, length + tail, 0.012]} />
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.3} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Watch({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);

  const indices = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return { a, main: i % 3 === 0 };
      }),
    []
  );
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => (i / 60) * Math.PI * 2), []);

  useFrame((state, delta) => {
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;

    if (root.current) {
      const t = state.clock.elapsedTime;
      const idle = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.25;
      const targetY = -0.35 + state.pointer.x * 0.5 + idle;
      const targetX = 0.18 - state.pointer.y * 0.35;
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetY, 3, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetX, 3, delta);
    }
  });

  return (
    <group ref={root} rotation={[0.18, -0.35, 0]} scale={1.05}>
      {/* Cinturino */}
      {[1, -1].map((dir) => (
        <group key={dir}>
          {Array.from({ length: 4 }, (_, i) => (
            <RoundedBox
              key={i}
              args={[0.92 - i * 0.03, 0.5, 0.14]}
              radius={0.05}
              position={[0, dir * (1.45 + i * 0.52), -0.06 - i * i * 0.05]}
              rotation={[dir * -0.12 * i, 0, 0]}
            >
              <meshStandardMaterial color="#2a1d14" roughness={0.75} />
            </RoundedBox>
          ))}
        </group>
      ))}

      {/* Anse */}
      {[
        [0.38, 1.12],
        [-0.38, 1.12],
        [0.38, -1.12],
        [-0.38, -1.12],
      ].map(([x, y], i) => (
        <RoundedBox key={i} args={[0.16, 0.5, 0.2]} radius={0.05} position={[x, y, 0]}>
          <meshStandardMaterial {...STEEL} />
        </RoundedBox>
      ))}

      {/* Cassa */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.18, 0.36, 96]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>

      {/* Lunetta */}
      <mesh position={[0, 0, 0.19]}>
        <torusGeometry args={[1.14, 0.075, 24, 120]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>

      {/* Corona */}
      <mesh position={[1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 24]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>

      {/* Quadrante */}
      <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.07, 1.07, 0.02, 96]} />
        <meshStandardMaterial color="#0f1013" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* Indici delle ore */}
      {indices.map(({ a, main }, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.83, Math.cos(a) * 0.83, 0.2]} rotation={[0, 0, -a]}>
          <boxGeometry args={[main ? 0.07 : 0.045, main ? 0.22 : 0.15, 0.025]} />
          <meshStandardMaterial {...APPLIED} />
        </mesh>
      ))}

      {/* Minuteria */}
      {ticks.map((a, i) =>
        i % 5 === 0 ? null : (
          <mesh key={i} position={[Math.sin(a) * 0.99, Math.cos(a) * 0.99, 0.195]} rotation={[0, 0, -a]}>
            <boxGeometry args={[0.012, 0.05, 0.01]} />
            <meshStandardMaterial color="#b5b0a6" />
          </mesh>
        )
      )}

      {/* Lancette */}
      <Hand handRef={hour} length={0.5} width={0.06} z={0.215} color="#e4cf9f" />
      <Hand handRef={minute} length={0.78} width={0.04} z={0.225} color="#e4cf9f" />
      <Hand handRef={second} length={0.92} width={0.014} z={0.235} color="#b8433a" tail={0.22} />
      <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>

      {/* Vetro */}
      <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.08, 1.08, 0.03, 96]} />
        <meshPhysicalMaterial transparent opacity={0.12} roughness={0} metalness={0} clearcoat={1} color="#ffffff" />
      </mesh>
    </group>
  );
}

export default function WatchScene() {
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.5}>
        <Watch reducedMotion={reducedMotion} />
      </Float>
      <ContactShadows position={[0, -2.6, 0]} opacity={0.45} scale={8} blur={2.6} far={4} />
      {/* Ambiente di riflessi generato localmente, senza file HDR esterni */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer intensity={1.4} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={1.2} color="#e4cf9f" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={0.6} position={[0, -4, 1]} scale={[8, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
