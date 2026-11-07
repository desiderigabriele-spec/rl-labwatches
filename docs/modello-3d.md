# Modello 3D su misura – brief e istruzioni

Il sito è già pronto a usare un modello 3D professionale al posto dell'orologio costruito a codice:
basta copiare i file e impostarli in `src/data/model3d.ts`. Il caricamento è stato collaudato con
un modello di prova esportato nello stesso formato (apertura, sequenza del restauro, esplosione,
passaggio da usurato a nuovo, lancette).

## Brief per il modellatore

```
MODELLO 3D – OROLOGIO "RL LAB WATCHES" PER SITO WEB

Consegna:    DUE file GLB (glTF 2.0) con compressione Draco + file sorgente .blend
               rl-watch.glb          materiali "nuovo" (finiture perfette)
               rl-watch-usurato.glb  STESSI pezzi, STESSI nomi e STESSI UV,
                                     materiali "usurato": graffi, opacità, patina sul
                                     quadrante, vetro ingiallito, sporco negli angoli
Peso:        massimo 150.000 triangoli e 6 MB per file
Texture:     PBR 2K (colore, metallo/rugosità, normal), in WebP o KTX2
Unità:       millimetri; origine al centro del quadrante,
             quadrante verso +Z, ore 12 verso +Y

Pezzi separati, con questi nomi (servono alla vista esplosa e alle animazioni):
  vetro · lunetta · cassa · corona · fondello · quadrante · indici
  lancetta_ore · lancetta_minuti · lancetta_secondi   (perno sul centro, ruotano su Z)
  movimento: platina · ponti · ruota_1, ruota_2, …   (ogni ruota con perno sul suo asse)
             bilanciere (perno sul suo asse) · rotore
  cinturino (oppure bracciale, con maglie separate se possibile)
  Le lancette, nella posizione di consegna, indicano le 12:00:00.

Aspetto:     cassa 40 mm in acciaio, lunetta e lancette oro,
             quadrante verde (#00452a) con logo RL Lab Watches a ore 12
             (logo in SVG fornito: public/brand/RL-simbolo-flat.svg). Nessun marchio di terzi.
Riferimenti: foto e misure di un orologio del laboratorio
             (fronte, retro, profilo, fondello aperto, movimento).
```

## Come inserirlo nel sito

1. Copia i due file in `public/models/` (es. `rl-watch.glb` e `rl-watch-usurato.glb`).
2. In `src/data/model3d.ts` imposta:
   ```ts
   export const WATCH_MODEL = { url: "/models/rl-watch.glb", wornUrl: "/models/rl-watch-usurato.glb" };
   ```
3. Pubblica. L'orologio nuovo compare nell'apertura della home e nella sequenza del restauro.

### Come vengono usati i nomi dei pezzi

| Pezzo (inizio del nome) | Nella vista esplosa |
| --- | --- |
| `vetro` | il più lontano, davanti |
| `lunetta` | davanti |
| `lancett…` | davanti al quadrante |
| `quadrante`, `indic…` | al centro |
| `movimento`, `platina`, `ponti`, `ruota…`, `bilanciere`, `rotore` | resta quasi fermo |
| `cassa`, `corona`, `cinturino`, `bracciale` | dietro |
| `fondello` | il più lontano, dietro |

Le `ruota…` e il `rotore` girano quando l'orologio "riparte"; il `bilanciere` oscilla.
La dimensione viene adattata in automatico: la cassa occupa lo stesso spazio del modello attuale.
