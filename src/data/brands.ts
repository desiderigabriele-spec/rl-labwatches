// Marche trattate più spesso (testi dal vecchio sito, rivisti).
// I loghi (in public/marche) sono quelli del vecchio sito, resi monocromatici; ratio = larghezza/altezza.
// vetrina = foto (sfondo trasparente) dell'orologio nel cofanetto originale, preparata con scripts/vetrina.mjs
//   alla stessa scala per tutte le marche; finché manca, la vetrina disegna un cofanetto con il logo della marca.
// dial = quadrante senza lancette nella foto (centro e raggio in % della foto, dati da scripts/vetrina.mjs):
//   sopra si disegnano le lancette che segnano l'ora reale; null = la foto ha già le sue lancette.
// vicino = foto ravvicinata dello stesso orologio (1024×1536, quadrante senza lancette; x, y, r come dial, in % della foto):
//   compare entrando nella sezione della marca, al posto dell'ingrandimento sfocato.
export const brands = [
  { slug: "rolex", name: "Rolex", logo: "/marche/rolex.png", ratio: 1.805, accent: "#2f9a6a", vetrina: "/vetrina/rolex.webp", dial: { x: 50.06, y: 69.71, r: 5.63, hands: "submariner", beats: 8, sprites: { ore: "/vetrina/rolex-ore.webp", minuti: "/vetrina/rolex-minuti.webp" } }, vicino: { src: "/vetrina/rolex-vicino.webp", x: 50.1, y: 42.19, r: 27.93 }, text: "Simbolo assoluto dell'alta orologeria, ogni Rolex richiede una cura e una precisione particolari. Dal Submariner al Daytona, il mio servizio si estende a tutti i modelli della Corona." },
  { slug: "patek-philippe", name: "Patek Philippe", logo: "/marche/patek-philippe.png", ratio: 1.835, accent: "#4f78b8", vetrina: "/vetrina/patek-philippe.webp", dial: { x: 49.88, y: 62.69, r: 5.28, hands: "nautilus", beats: 8, sprites: { ore: "/vetrina/patek-ore.webp", minuti: "/vetrina/patek-minuti.webp", secondi: "/vetrina/patek-secondi.webp" } }, vicino: { src: "/vetrina/patek-vicino.webp", x: 50.0, y: 42.9, r: 24.84 }, text: "Meccaniche sofisticate e un design senza tempo: un Patek Philippe richiede attenzione al dettaglio e una conoscenza tecnica profonda. La mia esperienza con questa Maison garantisce al tuo orologio il trattamento che merita." },
  { slug: "audemars-piguet", name: "Audemars Piguet", logo: "/marche/audemars-piguet.png", ratio: 4.715, accent: "#3456a0", vetrina: "", dial: null, vicino: null, text: "Audacia nel design e innovazione tecnica: le finiture di un Audemars Piguet richiedono un approccio specialistico. Curo ogni orologio della manifattura di Le Brassus nel pieno rispetto della sua unicità." },
  { slug: "cartier", name: "Cartier", logo: "/marche/cartier.png", ratio: 1.195, accent: "#e0b56a", vetrina: "", dial: null, vicino: null, text: "Eleganza intramontabile e uno stile inconfondibile. Lavoro su tutti i modelli Cartier, perché ogni pezzo conservi intatto il suo fascino." },
  { slug: "tudor", name: "Tudor", logo: "/marche/tudor.png", ratio: 1.795, accent: "#b83a48", vetrina: "", dial: null, vicino: null, text: "Sorella di Rolex, con un grande patrimonio e una qualità eccellente. Tratto ogni Tudor con la stessa attenzione e la stessa precisione che dedico a un Rolex." },
  { slug: "omega", name: "Omega", logo: "/marche/omega.png", ratio: 2.045, accent: "#cfd5de", vetrina: "", dial: null, vicino: null, text: "Precisione e affidabilità che hanno fatto la storia dell'orologeria. Seguo tutti i modelli Omega, dal Seamaster allo Speedmaster, perché il tuo orologio mantenga prestazioni ottimali." },
] as const;

export type Brand = (typeof brands)[number];
export const brandBySlug = (slug: string | null | undefined) => brands.find((b) => b.slug === slug);
