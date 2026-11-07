// Catalogo degli orologi in vendita. PRODOTTI DI ESEMPIO: sostituirli con quelli reali.
// Finché ci sono solo esempi, la pagina non viene indicizzata da Google (vedi SHOP_READY).
export type Product = {
  slug: string;
  name: string;
  brand: string;
  ref: string;
  year: string;
  price: number | null; // null = prezzo su richiesta
  condition: string;
  description: string;
  /** foto di copertina (anteprima nella lista), es. "/orologi/rolex-5513/cover.jpg" */
  image?: string;
  /** altre foto della galleria */
  photos?: string[];
  /** vista a 360°: cartella con i fotogrammi 001.jpg, 002.jpg, … e il loro numero */
  spin?: { dir: string; frames: number; ext?: "jpg" | "webp" };
  /** in evidenza nella sezione "Il pezzo del mese" in home (uno solo) */
  featured?: boolean;
  /** due righe sulla storia del pezzo, per "Il pezzo del mese" */
  story?: string;
  /** colore del bagliore in vetrina (di solito il colore del quadrante), es. "#1f8a5a" */
  accent?: string;
  /** dettagli aggiuntivi mostrati nella scheda, es. ["Cassa", "Acciaio, 40 mm"] */
  details?: [string, string][];
  sold?: boolean;
};

/** Percorsi dei fotogrammi della vista a 360° */
export const spinFrames = (p: Product) =>
  p.spin ? Array.from({ length: p.spin.frames }, (_, i) => `${p.spin!.dir}/${String(i + 1).padStart(3, "0")}.${p.spin!.ext ?? "jpg"}`) : [];

// OROLOGI DIMOSTRATIVI (renderizzati dal modello 3D del sito, cartelle public/orologi/esempio-*):
// da sostituire con i pezzi reali usando scripts/aggiungi-orologio.mjs (vedi README).
export const products: Product[] = [
  {
    slug: "esempio-smeraldo",
    featured: true,
    story: "Un quadrante verde profondo che cambia tono con la luce, incorniciato da una lunetta in oro. Revisionato e lucidato nel mio laboratorio: pronto per una nuova storia al polso.",
    name: "Smeraldo",
    brand: "Esempio",
    ref: "RL-0401",
    year: "2019",
    price: null,
    condition: "Esempio",
    description: "Quadrante verde smeraldo, lunetta oro, cinturino in pelle testa di moro. Orologio dimostrativo: verrà sostituito dai pezzi reali in vendita.",
    spin: { dir: "/orologi/esempio-smeraldo/360", frames: 18, ext: "webp" },
    accent: "#1f9a62",
    details: [["Quadrante","Verde smeraldo"],["Movimento","Automatico"],["Cassa","40 mm, acciaio"],["Lunetta","Oro"],["Impermeabilità","100 m"],["Cinturino","Pelle testa di moro"],["Corredo","Scatola e garanzia"],["Garanzia del laboratorio","12 mesi"]],
  },
  {
    slug: "esempio-blu-notte",
    name: "Blu notte",
    brand: "Esempio",
    ref: "RL-0402",
    year: "2021",
    price: null,
    condition: "Esempio",
    description: "Quadrante blu notte e bracciale in acciaio: il classico sportivo, elegante a ogni ora. Orologio dimostrativo: verrà sostituito dai pezzi reali in vendita.",
    spin: { dir: "/orologi/esempio-blu-notte/360", frames: 18, ext: "webp" },
    accent: "#3d74e0",
    details: [["Quadrante","Blu notte"],["Movimento","Automatico"],["Cassa","40 mm, acciaio"],["Impermeabilità","100 m"],["Bracciale","Acciaio"],["Corredo","Solo orologio"],["Garanzia del laboratorio","12 mesi"]],
  },
  {
    slug: "esempio-ossidiana",
    name: "Ossidiana",
    brand: "Esempio",
    ref: "RL-0403",
    year: "1978",
    price: null,
    condition: "Esempio",
    description: "Quadrante nero profondo e cassa in acciaio, con indici chiari per la massima leggibilità. Orologio dimostrativo: verrà sostituito dai pezzi reali in vendita.",
    spin: { dir: "/orologi/esempio-ossidiana/360", frames: 18, ext: "webp" },
    accent: "#d9dde3",
    details: [["Quadrante","Nero"],["Movimento","Carica manuale"],["Cassa","38 mm, acciaio"],["Impermeabilità","50 m"],["Cinturino","Pelle nera"],["Corredo","Scatola"],["Garanzia del laboratorio","12 mesi"]],
  },
  {
    slug: "esempio-avorio",
    name: "Avorio",
    brand: "Esempio",
    ref: "RL-0404",
    year: "1965",
    price: null,
    condition: "Esempio",
    description: "Quadrante avorio con indici oro: la sobrietà di un solo tempo d'altri tempi. Orologio dimostrativo: verrà sostituito dai pezzi reali in vendita.",
    spin: { dir: "/orologi/esempio-avorio/360", frames: 18, ext: "webp" },
    accent: "#f0d9a2",
    details: [["Quadrante","Avorio"],["Movimento","Carica manuale"],["Cassa","36 mm, acciaio e oro"],["Impermeabilità","30 m"],["Cinturino","Pelle marrone"],["Corredo","Solo orologio"],["Garanzia del laboratorio","12 mesi"]],
  },
  {
    slug: "esempio-bordeaux",
    name: "Bordeaux",
    brand: "Esempio",
    ref: "RL-0405",
    year: "2016",
    price: null,
    condition: "Esempio",
    description: "Quadrante bordeaux e finiture oro, per chi ama un dettaglio di carattere. Orologio dimostrativo: verrà sostituito dai pezzi reali in vendita.",
    spin: { dir: "/orologi/esempio-bordeaux/360", frames: 18, ext: "webp" },
    accent: "#d2405a",
    details: [["Quadrante","Bordeaux"],["Movimento","Automatico"],["Cassa","39 mm, acciaio"],["Lunetta","Oro"],["Impermeabilità","100 m"],["Cinturino","Pelle"],["Corredo","Scatola e garanzia"],["Garanzia del laboratorio","12 mesi"]],
  },
];

export const SHOP_READY = false; // metti true quando il catalogo contiene orologi reali

export const formatPrice = (p: number | null) =>
  p === null
    ? "Prezzo su richiesta"
    : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);
