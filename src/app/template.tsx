"use client";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Cambio di pagina a scorrimento: il browser fotografa la pagina che esce e quella che entra e le fa
 * scorrere con la scheda grafica (View Transitions). La direzione è su <html data-nav> (NavDirection),
 * i movimenti sono in globals.css. La chiave sul percorso fa uscire ed entrare la pagina a ogni cambio,
 * anche dentro la stessa sezione (es. da una marca all'altra).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
