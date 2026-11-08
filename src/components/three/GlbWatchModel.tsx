"use client";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { WatchState } from "./WatchModel";

/**
 * Orologio 3D da file GLB (il modello del modellatore), con lo stesso comportamento del modello a codice:
 *  - explode: i pezzi si separano lungo l'asse dell'orologio, riconosciuti dal nome (vedi docs/modello-3d.md)
 *  - wear:    la versione "usurata" (secondo file, stessi pezzi e stessi nomi) sfuma su quella "nuova"
 *  - run / realTime: le lancette girano (ora reale nella home)
 */

const DRACO = "/draco/";
/** diametro della cassa nella scena: uguale al modello a codice, così luci e inquadrature restano valide */
const CASE_DIAMETER = 2.44;

/** strato di ogni pezzo nella vista esplosa (spostamento in unità della scena, verso il vetro = positivo) */
const LAYERS: [RegExp, number][] = [
  [/^vetro/i, 2.3],
  [/^lunetta/i, 1.75],
  [/^lancett/i, 1.25],
  [/^(quadrante|indic)/i, 0.75],
  [/^(movimento|platina|pont|ruota|bilanciere|rotore|spirale|rubin)/i, 0.15],
  [/^fondello/i, -1.35],
  [/^(cassa|corona|ans[ae]|cinturino|bracciale|maglia|fibbia)/i, -0.65],
];
const HANDS = { hour: /^lancetta_ore/i, minute: /^lancetta_minuti/i, second: /^lancetta_secondi/i };
const SPINNERS = /^(ruota|rotore)/i;
const BALANCE = /^bilanciere/i;

type Part = { obj: THREE.Object3D; base: THREE.Vector3; dir: THREE.Vector3; offset: number };

function layerOf(name: string) {
  for (const [re, off] of LAYERS) if (re.test(name)) return off;
  return null;
}

/** sovrappone a ogni pezzo nuovo il suo gemello usurato (stesso nome), che poi sfuma con `wear` */
function attachWorn(fresh: THREE.Object3D, worn: THREE.Object3D | undefined) {
  const overlays: THREE.Material[] = [];
  if (!worn) return overlays;
  const byName = new Map<string, THREE.Mesh>();
  worn.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o.name) byName.set(o.name, o as THREE.Mesh);
  });
  const meshes: THREE.Mesh[] = [];
  fresh.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  for (const m of meshes) {
    const w = byName.get(m.name);
    if (!w) continue;
    const mats = (Array.isArray(w.material) ? w.material : [w.material]).map((mat) => {
      const c = mat.clone();
      c.transparent = true;
      c.depthWrite = false;
      c.polygonOffset = true;
      c.polygonOffsetFactor = -1;
      c.polygonOffsetUnits = -1;
      c.userData.baseOpacity = mat.opacity ?? 1;
      overlays.push(c);
      return c;
    });
    const twin = new THREE.Mesh(w.geometry, Array.isArray(w.material) ? mats : mats[0]);
    twin.name = `${m.name}__usurato`;
    twin.renderOrder = 1;
    m.add(twin); // segue il pezzo nuovo in ogni movimento (esplosione, lancette, ruote)
  }
  return overlays;
}

function useWatchScene(url: string, wornUrl?: string) {
  const fresh = useGLTF(url, DRACO);
  // stesso numero di hook a ogni render: se manca la versione usurata, ricarico la stessa (già in cache)
  const worn = useGLTF(wornUrl ?? url, DRACO);
  return useMemo(() => {
    const scene = fresh.scene.clone(true);
    const overlays = attachWorn(scene, wornUrl ? worn.scene : undefined);

    // vetro: il materiale "a trasmissione" del GLB rende il quadrante lattiginoso; uso un vetro trasparente leggero
    const glass = new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.08, roughness: 0, metalness: 0, clearcoat: 1, clearcoatRoughness: 0, depthWrite: false });
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && /^vetro/i.test(o.name)) {
        (o as THREE.Mesh).material = glass;
        o.renderOrder = 2;
      }
    });

    // scala: la cassa (o tutto l'orologio) deve avere il diametro del modello a codice
    const caseObj = scene.getObjectByProperty("name", scene.children.find((c) => /^cassa/i.test(c.name))?.name ?? "") ?? scene;
    const size = new THREE.Box3().setFromObject(caseObj).getSize(new THREE.Vector3());
    const scale = CASE_DIAMETER / Math.max(size.x, size.y, 1e-6);

    // pezzi della vista esplosa: il primo antenato con un nome riconosciuto
    const parts: Part[] = [];
    scene.traverse((o) => {
      const off = layerOf(o.name);
      if (off === null) return;
      let p = o.parent;
      while (p && p !== scene) {
        if (layerOf(p.name) !== null) return;
        p = p.parent;
      }
      // direzione "+Z della scena" espressa nello spazio del genitore
      const parentInv = new THREE.Matrix4();
      o.parent!.updateWorldMatrix(true, false);
      parentInv.copy(o.parent!.matrixWorld).invert();
      const dir = new THREE.Vector3(0, 0, 1).transformDirection(parentInv);
      const unitsPerParent = 1 / o.parent!.getWorldScale(new THREE.Vector3()).z;
      parts.push({ obj: o, base: o.position.clone(), dir, offset: (off / scale) * unitsPerParent });
    });

    const find = (re: RegExp) => {
      let f: THREE.Object3D | undefined;
      scene.traverse((o) => {
        if (!f && re.test(o.name)) f = o;
      });
      return f;
    };
    const hands = { hour: find(HANDS.hour), minute: find(HANDS.minute), second: find(HANDS.second) };
    const handBase = { hour: hands.hour?.rotation.z ?? 0, minute: hands.minute?.rotation.z ?? 0, second: hands.second?.rotation.z ?? 0 };
    const spinners: THREE.Object3D[] = [];
    scene.traverse((o) => SPINNERS.test(o.name) && spinners.push(o));
    const balance = find(BALANCE);
    return { scene, scale, parts, hands, handBase, spinners, balance, balanceBase: balance?.rotation.z ?? 0, overlays };
  }, [fresh, worn, wornUrl]);
}

export default function GlbWatchModel({
  url,
  wornUrl,
  state,
  realTime = false,
}: {
  url: string;
  wornUrl?: string;
  state: React.RefObject<WatchState>;
  realTime?: boolean;
}) {
  const w = useWatchScene(url, wornUrl);
  const clock = useRef({ sec: 37, min: 8.6, hr: 10.14, t: 0 });

  useFrame((_, delta) => {
    const { explode, wear, run } = state.current;
    const dt = Math.min(delta, 0.05);

    for (const p of w.parts) p.obj.position.copy(p.base).addScaledVector(p.dir, p.offset * explode);

    for (const m of w.overlays) {
      m.opacity = wear * (m.userData.baseOpacity as number);
      m.visible = wear > 0.01;
    }

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
    if (w.hands.second) w.hands.second.rotation.z = w.handBase.second - (c.sec / 60) * Math.PI * 2;
    if (w.hands.minute) w.hands.minute.rotation.z = w.handBase.minute - (c.min / 60) * Math.PI * 2;
    if (w.hands.hour) w.hands.hour.rotation.z = w.handBase.hour - (c.hr / 12) * Math.PI * 2;

    c.t += dt * run;
    w.spinners.forEach((o, i) => (o.rotation.z += (i % 2 ? -1 : 1) * dt * run * 0.6));
    if (w.balance) w.balance.rotation.z = w.balanceBase + Math.sin(c.t * Math.PI * 2 * 2.5) * 1.8 * run;
  });

  return (
    <group scale={w.scale}>
      <primitive object={w.scene} />
    </group>
  );
}
