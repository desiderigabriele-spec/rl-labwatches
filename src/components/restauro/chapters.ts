import { brush, caseback, steel, swab, wash, type FxCtx } from "./effects";

/**
 * La sezione "Il restauro" in tempi di scroll (0 = inizio sezione, 1 = fine):
 * l'orologio 3D arriva usurato, poi cinque lavori al banco, poi il 3D restaurato che riparte.
 */
export const ARRIVE_END = 0.085;
export const CH_START = 0.1;
export const CH_LEN = 0.15;
export const FINAL_START = 0.865;

const M = "/models/daytona-6239/";

export type Chapter = { title: string; text: string; clean?: string; worn: string; fx: (c: FxCtx) => void; label: string };

export const CHAPTERS: Chapter[] = [
  {
    title: "Il movimento",
    text: "Smontato pezzo per pezzo, passa nella vasca a ultrasuoni che scioglie olio seccato e ossido. Poi, rubino per rubino, una goccia d'olio con l'oliatore.",
    clean: M + "movimento-ponti.webp",
    worn: M + "movimento-ponti-usurato.webp",
    fx: wash,
    label: "Movimento calibro 722, lato ponti, durante il lavaggio e la lubrificazione",
  },
  {
    title: "La platina",
    text: "Il lato del quadrante, con la perlage e la firma ROLEX GENEVE, si pulisce a mano con un pennello morbido.",
    clean: M + "movimento-lato-quadrante.webp",
    worn: M + "movimento-lato-quadrante-usurato.webp",
    fx: brush,
    label: "Movimento lato quadrante pulito a pennello",
  },
  {
    title: "Il quadrante",
    text: "La parte più preziosa: un tampone di cotone appena inumidito, appoggiato e sollevato. Via lo sporco, intatti stampa e indici.",
    clean: M + "quadrante.webp",
    worn: M + "quadrante-usurato.webp",
    fx: swab,
    label: "Quadrante Paul Newman pulito a tamponi",
  },
  {
    title: "Il fondello",
    text: "Gira contro il disco di cotone della pulitrice: i graffi spariscono giro dopo giro, l'incisione DRIVE CAREFULLY ME resta intatta.",
    clean: M + "fondello.webp",
    worn: M + "fondello-usurato.webp",
    fx: caseback,
    label: "Fondello inciso lucidato alla pulitrice",
  },
  {
    title: "La cassa",
    text: "Il disco porta via graffi e colpi, poi la lucidatura a specchio, rispettando gli spigoli originali.",
    worn: M + "acciaio-usurato.webp",
    fx: steel,
    label: "Acciaio della cassa lucidato a specchio",
  },
];

export const BRUSH = "/models/attrezzi/pennello.png";
