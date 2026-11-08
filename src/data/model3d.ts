/**
 * Modello 3D dell'orologio.
 * Quando arriva il file del modellatore (vedi docs/modello-3d.md):
 *   1. copia i file in public/models/ (es. rl-watch.glb e rl-watch-usurato.glb)
 *   2. imposta qui i percorsi
 * Finché `WATCH_MODEL` è null il sito usa l'orologio costruito a codice.
 */
export const WATCH_MODEL: { url: string; wornUrl?: string } | null = { url: "/models/daytona-6239/daytona-6239.glb" };
