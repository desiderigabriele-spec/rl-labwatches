"use client";
import { Suspense } from "react";
import WatchModel, { type WatchLook, type WatchState } from "./WatchModel";
import GlbWatchModel from "./GlbWatchModel";
import { WATCH_MODEL } from "@/data/model3d";

/** Sceglie l'orologio da mostrare: il modello GLB del modellatore se presente, altrimenti quello a codice */
export default function Watch(props: { state: React.RefObject<WatchState>; realTime?: boolean; strap?: boolean; look?: WatchLook }) {
  if (!WATCH_MODEL) return <WatchModel {...props} />;
  return (
    <Suspense fallback={<WatchModel {...props} />}>
      <GlbWatchModel url={WATCH_MODEL.url} wornUrl={WATCH_MODEL.wornUrl} state={props.state} realTime={props.realTime} />
    </Suspense>
  );
}
