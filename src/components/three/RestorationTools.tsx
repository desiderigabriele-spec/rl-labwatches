"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LAYERS, type WatchState } from "./WatchModel";
import { PHASES, during, phase } from "./restoration-timeline";

/**
 * Gli attrezzi del banco di Roberto, nella sequenza di restauro:
 *  - pennello: pulisce il fondello e poi il quadrante (lo sporco sparisce dove passa)
 *  - oliatore: una goccia d'olio su ogni rubino del movimento
 *  - pulitrice con disco di cotone: lucida la lunetta e il fianco della cassa che girano sotto il disco
 * Sono nello stesso spazio dell'orologio, quindi seguono rotazioni, zoom ed esplosione.
 */

const lerp = THREE.MathUtils.lerp;
const ss = THREE.MathUtils.smoothstep;
/** posizione dello sporco spazzato (stessa formula del modello) */
const edge = (p: number) => lerp(-0.08, 1.08, p);
const zOf = (k: keyof typeof LAYERS, explode: number) => LAYERS[k][0] + LAYERS[k][1] * explode;

/** rubini del movimento lato ponti, in coordinate dell'orologio (misurati sulla texture) */
const JEWELS: [number, number][] = [
  [0.526, -0.142],
  [0.33, -0.33],
  [0.126, -0.452],
  [0.023, 0.046],
  [-0.495, 0.046],
];
const WHEEL_R = 0.58;
const SPARKS = 56;

function Brush({ mats }: { mats: Record<string, THREE.Material> }) {
  // costruito lungo +Y con la punta delle setole nell'origine
  return (
    <group>
      <mesh position={[0, 0.1, 0]} material={mats.bristle}>
        <cylinderGeometry args={[0.085, 0.055, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.26, 0]} material={mats.steel}>
        <cylinderGeometry args={[0.07, 0.088, 0.13, 24]} />
      </mesh>
      <mesh position={[0, 0.82, 0]} material={mats.wood}>
        <cylinderGeometry args={[0.04, 0.066, 1.0, 20]} />
      </mesh>
    </group>
  );
}

function Oiler({ mats }: { mats: Record<string, THREE.Material> }) {
  return (
    <group>
      <mesh position={[0, 0.14, 0]} material={mats.steel}>
        <cylinderGeometry args={[0.009, 0.003, 0.28, 12]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={mats.steel}>
        <cylinderGeometry args={[0.03, 0.012, 0.06, 16]} />
      </mesh>
      <mesh position={[0, 0.78, 0]} material={mats.handle}>
        <cylinderGeometry args={[0.038, 0.034, 0.9, 20]} />
      </mesh>
    </group>
  );
}

export default function RestorationTools({ state, progress }: { state: React.RefObject<WatchState>; progress: React.RefObject<number> }) {
  const brush = useRef<THREE.Group>(null);
  const oiler = useRef<THREE.Group>(null);
  const oilerY = useRef(0);
  const drops = useRef<(THREE.Mesh | null)[]>([]);
  const wheel = useRef<THREE.Group>(null);
  const buff = useRef<THREE.Group>(null);
  const sparks = useRef<THREE.Points>(null);
  const glow = useRef<THREE.PointLight>(null);

  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: "#d9d9dc", metalness: 1, roughness: 0.25 }),
      bristle: new THREE.MeshStandardMaterial({ color: "#efe6d2", roughness: 0.9 }),
      wood: new THREE.MeshStandardMaterial({ color: "#5a3a22", roughness: 0.55 }),
      handle: new THREE.MeshStandardMaterial({ color: "#00452a", roughness: 0.4, metalness: 0.3 }),
      cotton: new THREE.MeshStandardMaterial({ color: "#f3eee3", roughness: 1 }),
      cottonEdge: new THREE.MeshStandardMaterial({ color: "#e4d9c2", roughness: 1 }),
      motor: new THREE.MeshStandardMaterial({ color: "#2f3833", roughness: 0.45, metalness: 0.6 }),
      oil: new THREE.MeshStandardMaterial({ color: "#e0a83a", emissive: "#a8661a", emissiveIntensity: 0.6, roughness: 0.05, metalness: 0.1, transparent: true }),
    }),
    []
  );

  const sparkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3));
    // direzioni casuali ma fisse per ogni scintilla
    const seeds = new Float32Array(SPARKS * 3);
    let s = 11;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < seeds.length; i++) seeds[i] = rnd();
    g.userData.seeds = seeds;
    return g;
  }, []);

  // pose della pulitrice: sulla lunetta (asse radiale) e sul fianco della cassa (asse lungo z)
  const poses = useMemo(
    () => ({
      bezelQ: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2)),
      caseQ: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
    }),
    []
  );

  useFrame((st, delta) => {
    const v = progress.current;
    const ex = state.current.explode;
    const t = st.clock.elapsedTime;

    // ---------- pennello: fondello, poi quadrante ----------
    if (brush.current) {
      const onBack = during(v, PHASES.back);
      const onDial = during(v, PHASES.dial);
      const show = Math.max(onBack, onDial);
      brush.current.visible = show > 0.01;
      if (show > 0.01) {
        const useBack = onBack >= onDial;
        const p = phase(v, useBack ? PHASES.back : PHASES.dial);
        const u = THREE.MathUtils.clamp(edge(p), 0, 1);
        const zig = Math.sin(p * Math.PI * 7) * 0.6 * Math.sin(Math.PI * Math.min(1, u * 1.1));
        // il fondello è girato: la sua coordinata u cresce verso -x
        const x = useBack ? -(2 * u - 1) * 0.95 : (2 * u - 1) * 0.95;
        const face = useBack ? zOf("back", ex) - 0.05 : zOf("dial", ex) + 0.015;
        const lift = (1 - show) * 0.6;
        brush.current.position.set(x, zig, face + (useBack ? -lift : lift));
        brush.current.rotation.set((useBack ? -1 : 1) * (Math.PI / 2 - 0.62), 0, Math.sin(t * 9) * 0.05);
        brush.current.scale.setScalar(0.6 + 0.4 * show);
      }
    }

    // ---------- oliatore: una goccia su ogni rubino ----------
    const pm = phase(v, PHASES.movement);
    const xe = -(2 * edge(pm) - 1) * 0.98;
    if (oiler.current) {
      const show = during(v, PHASES.movement);
      oiler.current.visible = show > 0.01;
      if (show > 0.01) {
        let near = JEWELS[0];
        for (const j of JEWELS) if (Math.abs(j[0] - xe) < Math.abs(near[0] - xe)) near = j;
        oilerY.current = THREE.MathUtils.damp(oilerY.current, near[1], 10, delta);
        const dip = Math.exp(-(((xe - near[0]) / 0.05) ** 2));
        const face = zOf("movement", ex) - 0.062;
        oiler.current.position.set(THREE.MathUtils.clamp(xe, -0.8, 0.8), oilerY.current, face - 0.01 - 0.14 * (1 - dip) - (1 - show) * 0.5);
        oiler.current.rotation.set(-(Math.PI / 2 - 0.5), 0, 0.15);
      }
    }
    const dropFade = 1 - ss(v, PHASES.backOut[0], PHASES.backOut[1]);
    drops.current.forEach((d, i) => {
      if (!d) return;
      const done = v > PHASES.movement[0] && xe < JEWELS[i][0] - 0.02;
      const k = done ? dropFade : 0;
      d.visible = k > 0.01;
      d.position.set(JEWELS[i][0], JEWELS[i][1], zOf("movement", ex) - 0.068);
      d.scale.setScalar(k);
    });

    // ---------- pulitrice: lunetta e cassa che girano sotto il disco ----------
    const onBezel = during(v, PHASES.bezel);
    const onCase = during(v, PHASES.case);
    const transfer = ss(v, PHASES.bezel[1] - 0.005, PHASES.case[0] + 0.005);
    const showWheel = Math.max(onBezel, onCase, Math.min(1, transfer * (1 - transfer) * 4));
    const pb = phase(v, PHASES.bezel);
    const pc = phase(v, PHASES.case);
    state.current.spin = { bezel: pb * Math.PI * 2, case: pc * Math.PI * 2 };

    const zBezel = zOf("bezel", ex) + 0.03;
    const zCase = zOf("case", ex) - 0.05;
    const bezelContact = new THREE.Vector3(1.135, 0, zBezel);
    const caseContact = new THREE.Vector3(1.2, 0, zCase);
    const away = 1 - showWheel;
    if (wheel.current) {
      wheel.current.visible = showWheel > 0.01;
      const cB = bezelContact.clone().add(new THREE.Vector3(0.25 * away, 0, WHEEL_R + away * 0.8));
      const cC = caseContact.clone().add(new THREE.Vector3(WHEEL_R + away * 0.8, 0, 0));
      wheel.current.position.copy(cB.lerp(cC, transfer));
      wheel.current.quaternion.copy(poses.bezelQ).slerp(poses.caseQ, transfer);
    }
    if (buff.current && showWheel > 0.01) buff.current.rotation.y += delta * 28;

    // scintille e polvere di lucidatura dal punto di contatto
    const working = Math.max(onBezel * (pb > 0 && pb < 1 ? 1 : 0), onCase * (pc > 0 && pc < 1 ? 1 : 0));
    if (sparks.current) {
      sparks.current.visible = working > 0.05;
      if (working > 0.05) {
        const onB = onBezel >= onCase;
        const c = onB ? bezelContact : caseContact;
        const normal = onB ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
        const tangent = new THREE.Vector3(0, -1, 0);
        const pos = sparkGeo.attributes.position as THREE.BufferAttribute;
        const seeds = sparkGeo.userData.seeds as Float32Array;
        for (let i = 0; i < SPARKS; i++) {
          const life = (t * 1.8 + i / SPARKS) % 1;
          const age = life * 0.45;
          const a = seeds[i * 3], b = seeds[i * 3 + 1], cc = seeds[i * 3 + 2];
          const vx = tangent.x * (1.6 + a * 1.4) + normal.x * (0.3 + b * 0.8) + (cc - 0.5) * 0.9;
          const vy = tangent.y * (1.6 + a * 1.4) + normal.y * (0.3 + b * 0.8);
          const vz = tangent.z * (1.6 + a * 1.4) + normal.z * (0.3 + b * 0.8) + (a - 0.5) * 0.9;
          pos.setXYZ(i, c.x + vx * age, c.y + vy * age - 2.2 * age * age, c.z + vz * age);
        }
        pos.needsUpdate = true;
        (sparks.current.material as THREE.PointsMaterial).opacity = working;
      }
    }
    if (glow.current) {
      const onB = onBezel >= onCase;
      glow.current.position.copy(onB ? bezelContact : caseContact);
      glow.current.intensity = working * (2.5 + Math.sin(t * 40) * 0.8);
    }
  });

  return (
    <group>
      <group ref={brush} visible={false}>
        <Brush mats={mats} />
      </group>

      <group ref={oiler} visible={false}>
        <Oiler mats={mats} />
      </group>
      {JEWELS.map((_, i) => (
        <mesh
          key={i}
          visible={false}
          ref={(el) => {
            drops.current[i] = el;
          }}
          material={mats.oil}
        >
          <sphereGeometry args={[0.024, 16, 12]} />
        </mesh>
      ))}

      {/* pulitrice: disco di cotone a strati, mozzo, albero e motore */}
      <group ref={wheel} visible={false}>
        <group ref={buff}>
          {Array.from({ length: 7 }, (_, i) => (
            <mesh key={i} position={[0, (i - 3) * 0.032, 0]} material={i % 2 ? mats.cottonEdge : mats.cotton}>
              <cylinderGeometry args={[WHEEL_R - (i % 2) * 0.012, WHEEL_R - (i % 2) * 0.012, 0.03, 48]} />
            </mesh>
          ))}
          <mesh material={mats.steel}>
            <cylinderGeometry args={[0.14, 0.14, 0.27, 24]} />
          </mesh>
        </group>
        <mesh position={[0, 0.7, 0]} material={mats.steel}>
          <cylinderGeometry args={[0.035, 0.035, 1.2, 12]} />
        </mesh>
        <mesh position={[0, 1.55, 0]} material={mats.motor}>
          <cylinderGeometry args={[0.3, 0.3, 0.75, 32]} />
        </mesh>
      </group>
      <points ref={sparks} geometry={sparkGeo} visible={false}>
        <pointsMaterial color="#d4a948" size={0.035} transparent depthWrite={false} sizeAttenuation />
      </points>
      <pointLight ref={glow} color="#ffe2a8" intensity={0} distance={2.5} />
    </group>
  );
}
