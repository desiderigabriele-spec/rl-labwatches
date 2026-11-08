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
    text: "Smontato pezzo per pezzo, va nella vasca a ultrasuoni. Poi una goccia d'olio su ogni rubino.",
    clean: M + "movimento-ponti.webp",
    worn: M + "movimento-ponti-usurato.webp",
    fx: wash,
    label: "Movimento calibro 722, lato ponti, durante il lavaggio e la lubrificazione",
  },
  {
    verb: "PULIRE",
    title: "La platina",
    text: "La perlage e la firma ROLEX GENEVE si puliscono a mano, con un pennello morbido.",
    clean: M + "movimento-lato-quadrante.webp",
    worn: M + "movimento-lato-quadrante-usurato.webp",
    fx: brush,
    label: "Movimento lato quadrante pulito a pennello",
  },
  {
    verb: "SALVARE",
    title: "Il quadrante",
    text: "Un bastoncino con il cotone, appoggiato e sollevato: via lo sporco, intatti stampa e indici.",
    clean: M + "quadrante.webp",
    worn: M + "quadrante-usurato.webp",
    fx: swab,
    label: "Quadrante Paul Newman pulito a tamponi",
  },
  {
    verb: "RICOSTRUIRE",
    title: "Le sbreccature",
    text: "Lo spigolo scheggiato si ricostruisce con la saldatura laser, poi si lima e si lucida finché non si vede più.",
    frames: ["1-sbreccatura", "2-saldatura", "3-limatura", "4-lucidatura"].map((n) => `/models/sbreccatura/${n}.webp`),
    fx: chip,
    label: "Spigolo di un'ansa scheggiato, ricostruito, limato e lucidato",
  },
  {
    verb: "LUCIDARE",
    title: "Il fondello",
    text: "Gira contro il disco di cotone della pulitrice: via i graffi, l'incisione resta intatta.",
    clean: M + "fondello.webp",
    worn: M + "fondello-usurato.webp",
    fx: caseback,
    label: "Fondello inciso lucidato alla pulitrice",
  },
  {
    verb: "RIFINIRE",
    title: "La cassa",
    text: "Il disco porta via graffi e colpi e lascia l'acciaio a specchio, spigoli originali compresi.",
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
] as const;

const A = "/models/attrezzi/";
export const TOOLS = { brush: A + "pennello.png", oiler: A + "oliatore.png", pegwood: A + "pegwood.png", polisher: A + "pulitrice.png", disc: A + "disco.png", file: A + "lima.png", tweezers: A + "pinzette.png" };
export const DIAL_WORN = M + "quadrante-usurato.webp";
