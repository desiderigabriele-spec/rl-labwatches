/**
 * Da che parte entra la pagina nuova, perché ogni cambio di pagina dica dove ci si trova.
 *
 * - Destra/sinistra = le voci del menu, nel loro ordine (Home, Servizi, Marche, Orologi, Chi sono, FAQ,
 *   Contatti, Preventivo): andando verso una voce più a destra la pagina entra da destra, come la
 *   sottolineatura dorata che si sposta nel menu.
 * - Sotto/sopra = dentro una sezione, entrare nei dettagli e uscirne: più in profondità (Orologi → marca →
 *   orologio) la pagina sale dal basso, tornando su scende dall'alto.
 * - Pagine allo stesso livello (una marca e l'altra): di lato, nell'ordine della vetrina.
 * - Pagine legali: i loro link sono nel piè di pagina, quindi salgono dal basso e tornando scendono.
 * Tornare indietro col browser fa sempre il movimento inverso dell'andata, perché la direzione dipende
 * solo dalle due pagine.
 */
import { brands } from "@/data/brands";
import { legalNav, nav } from "@/data/site";

export type NavDir = "next" | "prev" | "deeper" | "up" | "fade" | "none";

const sections = [...nav.map((n) => n.href), "/preventivo"];
const legal = [...legalNav.map((n) => n.href), "/spedizioni-e-consegna", "/note-legali"];

type Place = { section: number; depth: number; order: number };

function place(path: string): Place {
  const p = path.replace(/\/+$/, "") || "/";
  const li = legal.indexOf(p);
  if (li >= 0) return { section: sections.length, depth: 1, order: li };
  if (p.startsWith("/shop/marca/")) {
    const slug = p.split("/")[3];
    return { section: sections.indexOf("/shop"), depth: 1, order: Math.max(0, brands.findIndex((b) => b.slug === slug)) };
  }
  if (p.startsWith("/shop/")) return { section: sections.indexOf("/shop"), depth: 2, order: -1 };
  const si = sections.findIndex((s) => s !== "/" && (p === s || p.startsWith(s + "/")));
  if (si >= 0) return { section: si, depth: p === sections[si] ? 0 : 1, order: -1 };
  return { section: 0, depth: p === "/" ? 0 : 1, order: -1 };
}

export function navDirection(from: string, to: string): NavDir {
  if (from === to) return "none";
  const a = place(from);
  const b = place(to);
  const isLegal = (x: Place) => x.section === sections.length;
  // verso le pagine del piè di pagina e ritorno: dal basso / dall'alto
  if (isLegal(a) !== isLegal(b)) return isLegal(b) ? "deeper" : "up";
  if (a.section !== b.section) return b.section > a.section ? "next" : "prev";
  if (a.depth !== b.depth) return b.depth > a.depth ? "deeper" : "up";
  if (a.order >= 0 && b.order >= 0 && a.order !== b.order) return b.order > a.order ? "next" : "prev";
  return "fade";
}
