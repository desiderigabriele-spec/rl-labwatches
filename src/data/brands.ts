// Marche trattate più spesso (testi dal vecchio sito, rivisti).
// I loghi (in public/marche) sono quelli del vecchio sito, resi monocromatici; ratio = larghezza/altezza.
export const brands = [
  { name: "Rolex", logo: "/marche/rolex.png", ratio: 1.805, text: "Simbolo assoluto dell'alta orologeria, ogni Rolex richiede una cura e una precisione particolari. Dal Submariner al Daytona, il mio servizio si estende a tutti i modelli della Corona." },
  { name: "Patek Philippe", logo: "/marche/patek-philippe.png", ratio: 1.835, text: "Meccaniche sofisticate e un design senza tempo: un Patek Philippe richiede attenzione al dettaglio e una conoscenza tecnica profonda. La mia esperienza con questa Maison garantisce al tuo orologio il trattamento che merita." },
  { name: "Audemars Piguet", logo: "/marche/audemars-piguet.png", ratio: 4.715, text: "Audacia nel design e innovazione tecnica: le finiture di un Audemars Piguet richiedono un approccio specialistico. Curo ogni orologio della manifattura di Le Brassus nel pieno rispetto della sua unicità." },
  { name: "Cartier", logo: "/marche/cartier.png", ratio: 1.195, text: "Eleganza intramontabile e uno stile inconfondibile. Lavoro su tutti i modelli Cartier, perché ogni pezzo conservi intatto il suo fascino." },
  { name: "Tudor", logo: "/marche/tudor.png", ratio: 1.795, text: "Sorella di Rolex, con un grande patrimonio e una qualità eccellente. Tratto ogni Tudor con la stessa attenzione e la stessa precisione che dedico a un Rolex." },
  { name: "Omega", logo: "/marche/omega.png", ratio: 2.045, text: "Precisione e affidabilità che hanno fatto la storia dell'orologeria. Seguo tutti i modelli Omega, dal Seamaster allo Speedmaster, perché il tuo orologio mantenga prestazioni ottimali." },
] as const;
