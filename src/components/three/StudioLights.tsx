"use client";
import { Environment, Lightformer } from "@react-three/drei";

// Luci da studio fotografico generate localmente (nessun file HDR esterno)
export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <Environment resolution={256}>
        {/* fondo grigio chiaro: l'acciaio riflette uno studio luminoso invece del nero */}
        <color attach="background" args={["#9a9a9a"]} />
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 1.5, 1]} />
        <Lightformer intensity={1.4} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={1.2} color="#f1e2bd" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={0.8} position={[0, -4, 1]} scale={[8, 1, 1]} />
      </Environment>
    </>
  );
}
