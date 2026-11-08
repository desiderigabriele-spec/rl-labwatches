import { brush, caseback, chip, steel, swab, wash, type FxCtx } from "./effects";

/**
 * La sezione "Il restauro" in tempi di scroll (0 = inizio sezione, 1 = fine):
 * la scheda d'ingresso con i difetti, sei lavori al banco (ognuno con il suo verbo), il Daytona 3D che riparte.
 */
export const INTAKE_END = 0.13;
export const CH_START = 0.14;
export const CH_LEN = 0.12;
export const FINAL_START = 0.875;

/** avanzamento del lavoro dentro un capitolo: il pezzo appare, si lavora, resta un attimo finito */
export const workOf = (local: number) => Math.min(1, Math.max(0, (local - 0.12) / 0.72));

const M = "/models/daytona-6239/";

export type Chapter = { verb: string; title: string; text: string; clean?: string; worn?: string; frames?: string[]; fx: (c: FxCtx) => void; label: string };

export const CHAPTERS: Chapter[] = [
  {
    verb: "LAVARE",
    title: "Il movimento",
    text: "Smontato pezzo per pezzo, passa nella vasca a ultrasuoni che scioglie olio seccato e ossido. Poi, rubino per rubino, una goccia d'olio.",
    clean: M + "movimento-ponti.webp",
    worn: M + "movimento-ponti-usurato.webp",
    fx: wash,
    label: "Movimento calibro 722, lato ponti, durante il lavaggio e la lubrificazione",
  },
  {
    verb: "PULIRE",
    title: "La platina",
    text: "Il lato del quadrante, con la perlage e la firma ROLEX GENEVE, si pulisce a mano con un pennello morbido.",
    clean: M + "movimento-lato-quadrante.webp",
    worn: M + "movimento-lato-quadrante-usurato.webp",
    fx: brush,
    label: "Movimento lato quadrante pulito a pennello",
  },
  {
    verb: "SALVARE",
    title: "Il quadrante",
    text: "La parte più preziosa: un tampone di cotone appena inumidito, appoggiato e sollevato. Via lo sporco, intatti stampa e indici.",
    clean: M + "quadrante.webp",
    worn: M + "quadrante-usurato.webp",
    fx: swab,
    label: "Quadrante Paul Newman pulito a tamponi",
  },
  {
    verb: "RICOSTRUIRE",
    title: "Le sbreccature",
    text: "Lo spigolo scheggiato di un'ansa o della lunetta si ricostruisce con la saldatura laser: il metallo riportato si lima alla forma originale e si lucida finché la riparazione non si vede più.",
    frames: ["1-sbreccatura", "2-saldatura", "3-limatura", "4-lucidatura"].map((n) => `/models/sbreccatura/${n}.webp`),
    fx: chip,
    label: "Spigolo di un'ansa scheggiato, ricostruito, limato e lucidato",
  },
  {
    verb: "LUCIDARE",
    title: "Il fondello",
    text: "Gira contro il disco di cotone della pulitrice: i graffi spariscono giro dopo giro, l'incisione DRIVE CAREFULLY ME resta intatta.",
    clean: M + "fondello.webp",
    worn: M + "fondello-usurato.webp",
    fx: caseback,
    label: "Fondello inciso lucidato alla pulitrice",
  },
  {
    verb: "RIFINIRE",
    title: "La cassa",
    text: "Il disco porta via graffi e colpi, poi la lucidatura a specchio, rispettando gli spigoli originali.",
    worn: M + "acciaio-usurato.webp",
    fx: steel,
    label: "Acciaio della cassa lucidato a specchio",
  },
];

/** difetti segnati sul quadrante all'arrivo (posizione in % sulla foto) */
export const DEFECTS = [
  { x: 73, y: 15, text: "Luminescente degli indici ossidato" },
  { x: 27, y: 33, text: "Macchie di umidità sul quadrante" },
  { x: 11, y: 72, text: "Ossido sulla fascia esterna" },
  { x: 62, y: 83, text: "Contatori sbiaditi" },
  { x: 50, y: 10, text: "Coroncina applicata opaca" },
];

const A = "/models/attrezzi/";
export const TOOLS = { brush: A + "pennello.png", oiler: A + "oliatore.png", pegwood: A + "pegwood.png", polisher: A + "pulitrice.png", disc: A + "disco.png" };
export const DIAL_WORN = M + "quadrante-usurato.webp";
