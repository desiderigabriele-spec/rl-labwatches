# Roberto Landi — Lab Watches | Kit vettoriale

Ricostruzione vettoriale del JPEG fornito: scritte ricalcate in curve, quadrante e lancette ricostruiti geometricamente. L'effetto metallico è reinterpretato con gradienti: la trama fotografica del JPEG non è riprodotta pixel per pixel.

## Versioni
24 SVG: quattro composizioni, ciascuna in sei colori.
- completo: composizione del riferimento, con margini ritagliati per l'uso nel sito.
- orizzontale: simbolo a sinistra e scritte a destra, adatto all'header.
- simbolo: quadrante e lancette, senza scritte.
- wordmark: scritte e filetti, senza quadrante.

Colori: metallo (verde/oro sfumati), flat (verde/oro piatti), verde, nero, bianco, negativo (bianco/oro su fondo verde).
Tutti gli SVG sono trasparenti, tranne negativo che include il fondo verde.
PDF: sei versioni del logo completo. PREVIEW: PNG di consultazione.

## Animazione
Aprire WEB/demo.html nel browser: funziona anche senza server.
- Ingresso: rotazione e rallentamento delle lancette, con ritorno al riferimento.
- Ora attuale: ore e minuti indicano l'orario locale del dispositivo.
- Logo originale: ferma il movimento e ripristina la posa.
Con movimento ridotto, l'intro viene saltata e l'orario si mostra una sola volta.

Gli SVG statici non contengono script. Per animare, inserirli INLINE nel DOM: un normale tag img non permette di controllare i gruppi interni.
Gruppi: clock-face, hands, hour-hand, minute-hand, hand-pivot, wordmark, tagline.
Centro: x=628, y=607, nello spazio SVG originale. Nei formati orizzontali il gruppo esterno gestisce già la trasformazione: non cambiare il centro.
Le lancette sono disegnate nella posa originale: il controller calcola gli offset per l'orario reale. Non assumere che la posa iniziale sia verticale.

WEB/logo-animation.js: API animateLogo(svg, {mode:'intro'|'clock'|'static', duration:1800}). Restituisce intro(), live(), reset(), setTime(Date), destroy(). Chiamare destroy() quando il logo viene rimosso. Per più copie inline chiamare namespaceLogo(svg) prima del montaggio: prefissa i riferimenti a gradienti e maschere.
WEB/LogoRobertoLandi.jsx: esempio React pronto da adattare. Copiare lo SVG in public/assets e i due file JS/JSX nel progetto. Per Next.js aggiungere 'use client' all'inizio del componente. Non richiede librerie di animazione.

## Consegna a Claude Code
Leggere anche CLAUDE_CODE.md. SVG e PDF sono realmente vettoriali: nessuna immagine incorporata e nessun font necessario. SVG è il formato modificabile principale; non sono inclusi file proprietari AI/EPS.
