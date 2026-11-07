// Servizi del laboratorio. Testi provvisori: sostituire con quelli del vecchio sito.
export type Service = { slug: string; title: string; summary: string; details: string[] };

export const services: Service[] = [
  {
    slug: "revisione",
    title: "Revisione completa",
    summary:
      "Smontaggio integrale del movimento, pulizia, lubrificazione e regolazione per riportarlo alle specifiche di fabbrica.",
    details: ["Smontaggio e pulizia a ultrasuoni", "Lubrificazione con oli specifici", "Regolazione su più posizioni", "Test di marcia e impermeabilità"],
  },
  {
    slug: "restauro",
    title: "Restauro d'epoca",
    summary:
      "Recupero di orologi vintage nel rispetto dell'originalità: quadranti, lancette, casse e movimenti storici.",
    details: ["Valutazione dell'originalità", "Ricerca ricambi d'epoca", "Restauro conservativo della cassa", "Documentazione fotografica del lavoro"],
  },
  {
    slug: "riparazione",
    title: "Riparazione",
    summary:
      "Diagnosi e intervento su guasti, sostituzione di componenti, vetri, corone e guarnizioni.",
    details: ["Sostituzione vetro zaffiro e minerale", "Corone, tubi e guarnizioni", "Riparazione cronografi e complicazioni", "Sostituzione batterie al quarzo"],
  },
  {
    slug: "lucidatura",
    title: "Lucidatura e finiture",
    summary:
      "Ripristino di cassa e bracciale alternando satinature e lucidature, preservando linee e spigoli originali.",
    details: ["Satinatura e lucidatura a specchio", "Ripristino spigoli e smussi", "Pulizia profonda del bracciale", "Trattamento a ultrasuoni"],
  },
];
