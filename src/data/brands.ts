// Marche trattate più spesso (testi dal vecchio sito, rivisti).
// I loghi (in public/marche) sono quelli del vecchio sito, resi monocromatici; ratio = larghezza/altezza.
// icon = il modello più famoso della marca, mostrato in vetrina sul cofanetto.
// vetrina = foto (sfondo trasparente) dell'orologio nel cofanetto originale, preparata con scripts/vetrina.mjs
//   alla stessa scala per tutte le marche; finché manca, la vetrina disegna un cofanetto con il logo della marca.
export const brands = [
  { slug: "rolex", name: "Rolex", logo: "/marche/rolex.png", ratio: 1.805, icon: "Submariner", accent: "#2f9a6a", vetrina: "/vetrina/rolex.webp", text: "Simbolo assoluto dell'alta orologeria, ogni Rolex richiede una cura e una precisione particolari. Dal Submariner al Daytona, il mio servizio si estende a tutti i modelli della Corona." },
  { slug: "patek-philippe", name: "Patek Philippe", logo: "/marche/patek-philippe.png", ratio: 1.835, icon: "Nautilus", accent: "#4f78b8", vetrina: "/vetrina/patek-philippe.webp", text: "Meccaniche sofisticate e un design senza tempo: un Patek Philippe richiede attenzione al dettaglio e una conoscenza tecnica profonda. La mia esperienza con questa Maison garantisce al tuo orologio il trattamento che merita." },
  { slug: "audemars-piguet", name: "Audemars Piguet", logo: "/marche/audemars-piguet.png", ratio: 4.715, icon: "Royal Oak", accent: "#3456a0", vetrina: "", text: "Audacia nel design e innovazione tecnica: le finiture di un Audemars Piguet richiedono un approccio specialistico. Curo ogni orologio della manifattura di Le Brassus nel pieno rispetto della sua unicità." },
  { slug: "cartier", name: "Cartier", logo: "/marche/cartier.png", ratio: 1.195, icon: "Tank", accent: "#e0b56a", vetrina: "", text: "Eleganza intramontabile e uno stile inconfondibile. Lavoro su tutti i modelli Cartier, perché ogni pezzo conservi intatto il suo fascino." },
  { slug: "tudor", name: "Tudor", logo: "/marche/tudor.png", ratio: 1.795, icon: "Black Bay", accent: "#b83a48", vetrina: "", text: "Sorella di Rolex, con un grande patrimonio e una qualità eccellente. Tratto ogni Tudor con la stessa attenzione e la stessa precisione che dedico a un Rolex." },
  { slug: "omega", name: "Omega", logo: "/marche/omega.png", ratio: 2.045, icon: "Speedmaster", accent: "#cfd5de", vetrina: "", text: "Precisione e affidabilità che hanno fatto la storia dell'orologeria. Seguo tutti i modelli Omega, dal Seamaster allo Speedmaster, perché il tuo orologio mantenga prestazioni ottimali." },
] as const;

export type Brand = (typeof brands)[number];
export const brandBySlug = (slug: string | null | undefined) => brands.find((b) => b.slug === slug);
