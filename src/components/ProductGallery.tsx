"use client";
import Image from "next/image";
import { useState } from "react";
import Viewer360 from "./Viewer360";
import Loupe from "./Loupe";
import { WatchPlaceholder } from "./ProductCard";

/** Galleria della scheda orologio: vista a 360° (se presente) + foto */
export default function ProductGallery({ name, frames, photos }: { name: string; frames: string[]; photos: string[] }) {
  const has360 = frames.length > 0;
  const [view, setView] = useState<number>(has360 ? -1 : 0); // -1 = vista 360°
  const thumbs = [...(has360 ? [-1] : []), ...photos.map((_, i) => i)];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-line bg-paper-2">
        {view === -1 && has360 ? (
          <Viewer360 frames={frames} alt={name} />
        ) : photos[view] ? (
          <Loupe src={photos[view]} className="h-full w-full">
            <Image src={photos[view]} alt={`${name} – foto ${view + 1}`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </Loupe>
        ) : (
          <div className="flex h-full items-center justify-center"><WatchPlaceholder /></div>
        )}
      </div>
      {thumbs.length > 1 && (
        <p className="tag-mono mt-4 text-xs text-mute">
          {String(thumbs.indexOf(view) + 1).padStart(2, "0")} / {String(thumbs.length).padStart(2, "0")} · {view === -1 ? "vista a 360°" : "galleria"}
        </p>
      )}
      {thumbs.length > 1 && (
        <ul className="mt-4 flex flex-wrap gap-3">
          {thumbs.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => setView(t)}
                aria-pressed={view === t}
                aria-label={t === -1 ? "Vista a 360°" : `Foto ${t + 1}`}
                className={`relative flex h-20 w-20 items-center justify-center overflow-hidden border bg-paper-2 transition-colors ${view === t ? "border-gold" : "border-line hover:border-gold/50"}`}
              >
                {t === -1 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={frames[0]} alt="" className="absolute inset-0 h-full w-full object-contain opacity-60" />
                    <span className="relative font-display text-lg text-fg">360°</span>
                  </>
                ) : (
                  <Image src={photos[t]} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
