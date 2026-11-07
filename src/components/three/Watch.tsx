"use client";
import { Suspense } from "react";
import WatchModel, { type WatchState } from "./WatchModel";
import GlbWatchModel from "./GlbWatchModel";
import { WATCH_MODEL } from "@/data/model3d";

/** Sceglie l'orologio da mostrare: il modello GLB se presente, altrimenti il Daytona costruito in codice */
export default function Watch(props: { state: React.RefObject<WatchState>; realTime?: boolean }) {
  if (!WATCH_MODEL) return <WatchModel {...props} />;
  return (
    <Suspense fallback={<WatchModel {...props} />}>
      <GlbWatchModel url={WATCH_MODEL.url} wornUrl={WATCH_MODEL.wornUrl} state={props.state} realTime={props.realTime} />
    </Suspense>
  );
}
