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
  image?: string; // percorso in /public, es. "/prodotti/rolex-5513.jpg"
  sold?: boolean;
};

export const products: Product[] = [
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
