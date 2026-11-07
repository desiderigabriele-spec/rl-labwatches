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
  /** dettagli aggiuntivi mostrati nella scheda, es. ["Cassa", "Acciaio, 40 mm"] */
  details?: [string, string][];
  sold?: boolean;
};

/** Percorsi dei fotogrammi della vista a 360° */
export const spinFrames = (p: Product) =>
  p.spin ? Array.from({ length: p.spin.frames }, (_, i) => `${p.spin!.dir}/${String(i + 1).padStart(3, "0")}.${p.spin!.ext ?? "jpg"}`) : [];

export const products: Product[] = [
  {
    // DEMO della vista a 360° (fotogrammi generati dal modello 3D del sito): da rimuovere con gli orologi reali
    slug: "esempio-vista-360",
    name: "Dimostrazione vista a 360°",
    brand: "Esempio",
    ref: "Ref. 0000",
    year: "—",
    price: null,
    condition: "Esempio",
    description: "Esempio della vista a 360°: trascina l'orologio per ruotarlo. Con le foto reali, scattate su un piatto girevole, ogni orologio in vendita si potrà guardare da ogni lato.",
    spin: { dir: "/orologi/esempio-vista-360/360", frames: 36 },
    details: [["Fotogrammi", "36 (uno ogni 10°)"]],
  },
  {
    slug: "esempio-subacqueo-anni-70",
    name: "Subacqueo automatico",
    brand: "Esempio",
    ref: "Ref. 0000",
    year: "Anni '70",
    price: null,
    condition: "Revisionato in laboratorio",
    description: "Prodotto di esempio: sostituire con un orologio reale del catalogo.",
  },
  {
    slug: "esempio-cronografo-manuale",
    name: "Cronografo a carica manuale",
    brand: "Esempio",
    ref: "Ref. 0000",
    year: "Anni '60",
    price: 4800,
    condition: "Restaurato, movimento originale",
    description: "Prodotto di esempio: sostituire con un orologio reale del catalogo.",
  },
  {
    slug: "esempio-solo-tempo-oro",
    name: "Solo tempo in oro",
    brand: "Esempio",
    ref: "Ref. 0000",
    year: "Anni '50",
    price: 2900,
    condition: "Ottime condizioni",
    description: "Prodotto di esempio: sostituire con un orologio reale del catalogo.",
  },
];

export const SHOP_READY = false; // metti true quando il catalogo contiene orologi reali

export const formatPrice = (p: number | null) =>
  p === null
    ? "Prezzo su richiesta"
    : new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p);
