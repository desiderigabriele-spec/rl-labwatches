"use client";
import dynamic from "next/dynamic";

// Carica la scena 3D solo nel browser, dopo il contenuto principale
const WatchScene = dynamic(() => import("./WatchScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-56 w-56 animate-pulse rounded-full border border-gold/30" />
    </div>
  ),
});

export default WatchScene;
