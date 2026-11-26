# Audit SEO: rl-labwatches.it

Data: 26/11/2026 · Stato: **Fase 1 (audit) e Fase 2 (piano) completate, in attesa di approvazione**

## Contesto

| | |
|---|---|
| Business | Roberto Landi Lab Watches: orologiaio artigiano. Restauro, revisione e riparazione di orologi di lusso, più compravendita (vetrina online da gennaio 2027). Laboratorio a Pistoia, spedizione assicurata in tutta Italia. |
| Dominio | https://www.rl-labwatches.it (rl-labwatches.it → 301 → www) |
| NAP | Roberto Landi Lab Watches · Via Padre Giovanni Antonelli, 69 · 51100 Pistoia (PT) · +39 328 772 5925 |
| Hosting | Vercel (Next.js 16, App Router). DNS ancora su Wix: i nameserver Vercel non sono passati. |
| Keyword proposte | Primarie: "orologiaio Pistoia", "riparazione orologi Pistoia", "restauro orologi di lusso". Di marca: "riparazione Rolex Pistoia", "revisione Rolex", "assistenza Patek Philippe / Omega". Compravendita (da gennaio): "orologi di lusso usati Pistoia", "compravendita Rolex Pistoia". |

> Le keyword sono una proposta ragionata, non misurata: da qui non posso leggere i volumi di ricerca. Dopo 4–6 settimane di Search Console si vedono le query vere e si correggono.

---

## Fase 1: audit

### 1. Stack e rendering ✅
Next.js 16 con rendering sul server: ogni pagina è HTML statico pre-generato. Con `curl` l'HTML grezzo contiene già testo, title, meta, canonical e JSON-LD. **Non è una SPA**, quindi il problema "div#root vuoto" non c'è.

C'è però una cosa simile, ed è il problema di velocità più grosso (vedi A1). Il componente `Reveal` fa comparire i blocchi in animazione e nell'HTML li scrive con `style="opacity:0"`. Il testo è nell'HTML e Google lo legge, ma **resta invisibile finché non arriva il JavaScript**. Per questo il contenuto principale compare a 4–5 s su telefono.

### 2. Pagine

Misurato sulla build di produzione (`next start`), HTML grezzo.

| URL | Title (car.) | Description (car.) | H1 (unico ✅ su tutte) | Indicizzabile | Parole | Img senza alt |
|---|---|---|---|---|---|---|
| / | Roberto Landi: Artigiano Orologi di Lusso a Pistoia \| RL Lab Watches (**68**) | 150 | "Restauro l'orologio che hai. Vendo quello che cerchi." | sì | 2507 | 0 (65 decorative con alt="") |
| /servizi | Restauro e riparazione orologi di lusso \| Roberto Landi (55) | 148 | "Ogni orologio lo apro io. E lo richiudo meglio di prima." | sì | 832 | 0 |
| /marche | Marche: Rolex, Patek Philippe, Audemars Piguet \| Roberto Landi (**62**) | 151 | "Ogni maison ha i suoi segreti. Li conosco a memoria." | sì | 479 | 0 |
| /chi-sono | Chi sono \| Roberto Landi, orologiaio a Pistoia (46) | 142 | "“Non mi limito a riparare: risveglio la bellezza…”" | sì | 366 | 0 |
| /contatti | Contatti: orologiaio a Pistoia \| Roberto Landi (46) | 142 | "Scrivimi, chiamami o passa in laboratorio." | sì | 283 | 0 |
| /preventivo | Richiedi un preventivo gratuito \| Roberto Landi (47) | 141 | "Raccontami il tuo orologio, ti dico io." | sì | 244 | 0 |
| /faq | FAQ riparazione orologi di lusso \| Roberto Landi (48) | 151 | "Le risposte che mi chiedono più spesso." | sì | 472 | 0 |
| /shop | Orologi di lusso selezionati e revisionati \| Roberto Landi (58) | **128** | "Orologi aperti, controllati e revisionati da me." | **no** (voluto fino all'apertura) | 395 | 0 |
| /shop/marca/[marca] ×6 | Orologi Rolex selezionati e revisionati \| Roberto Landi (55) | **126** | "Orologi Rolex in vendita" | **no** (voluto) | ~340 | 0 |
| /shop/[esempio] ×6 | Esempio Avorio \| Roberto Landi (30) | 144 | "Avorio" | **no** (voluto) | 282 | 0 |
| /spedizioni-e-consegna | Spedizioni e Consegna \| Roberto Landi (37) | 139 | "Spedizioni e Consegna" | sì | 440 | 0 |
| /privacy | Informativa sulla Privacy \| Roberto Landi (41) | 134 | "Informativa sulla Privacy" | sì | 1077 | 0 |
| /termini-di-servizio | Termini di Servizio \| Roberto Landi (35) | 126 | "Termini di Servizio" | sì | 559 | 0 |
| /cookie | Informativa sui Cookie \| Roberto Landi (38) | 139, **ma sbagliata** | "Informativa sui Cookie" | sì | 670 | 0 |
| /note-legali | Note legali \| Roberto Landi (27) | **87** | "Note legali" | sì | 554 | 0 |
| /404 | **title della home** | **description della home** | "Questa pagina si è fermata." | noindex ✅ | 202 | 0 |

**Note:**
- **Gli H1 sono frasi di stile, senza keyword né città.** Nessuno contiene "orologiaio", "riparazione" o "Pistoia". I title sono buoni, ma l'H1 è il secondo segnale più forte della pagina.
- **La description di /cookie è falsa.** Dice che il sito "non usa cookie di … statistiche", invece Google Analytics e Clarity ci sono, con consenso. Va corretta anche per ragioni legali.
- **Gerarchia dei titoli:** nessun salto di livello su tutte le pagine; ogni pagina ha un solo H1.
- **HTML semantico:** `header`, `nav`, `main` e `footer` ci sono ovunque, `article` dove serve.

### 3. Tecnico

| Controllo | Esito |
|---|---|
| robots.txt | ✅ `Allow: /` più il link alla sitemap. Nessun crawler AI bloccato. |
| sitemap.xml | ✅ 12 URL canoniche, tutte 200. Lo shop entra da solo quando ci sono orologi veri. ⚠️ `lastModified` è sempre "adesso", quindi a Google non dice niente. |
| http → https | ✅ 308, gestito da Vercel |
| non-www → www | ✅ 301. ⚠️ `http://rl-labwatches.it` fa due salti (http→https→www): impatto minimo. |
| Redirect dai vecchi URL Wix | ✅ 11 pagine in 301, verificate anche in produzione (/about-5 → /chi-sono) |
| Trailing slash | ✅ coerente: /servizi/ → 308 → /servizi |
| 404 personalizzata | ✅ stato 404 e noindex. ⚠️ title e description sono quelli della home. |
| Link interni | ✅ 27 link interni distinti, tutti 200. Nessun link rotto. |
| `lang="it"`, viewport, theme-color | ✅ |
| Favicon | ⚠️ c'è solo `icon.svg`. Mancano `apple-touch-icon` (iPhone, segnalibri) e il manifest. |
| Open Graph e Twitter card | ✅ su tutte le pagine, con og:image 1200×630. Un'unica immagine per tutto il sito. |
| Canonical | ✅ assoluti e corretti |
| Google Search Console | ❌ non verificato, nessuna sitemap inviata |

### 4. Performance (Lighthouse mobile, build locale)

| Pagina | Performance | SEO | Accessibilità | Best Practices | LCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|---|---|
| / | **54** | 100 | 96 | 93 | **4,7 s** | **2.180 ms** | 0 | 2,6 MB |
| /servizi | 82 | 100 | 88 | 96 | **4,8 s** | 70 ms | 0 | 650 KB |
| /chi-sono | 83 | 100 | 88 | 96 | **4,6 s** | 50 ms | 0 | 604 KB |
| /contatti | 87 | 100 | 96 | 96 | **4,1 s** | 60 ms | 0,002 | 520 KB |
| /faq | 85 | 100 | 100 | 96 | **4,3 s** | 90 ms | 0 | 522 KB |

Obiettivo Core Web Vitals: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1. **Il CLS va bene ovunque, l'LCP è fuori su tutte le pagine.**

Cause, misurate da Lighthouse:
1. **Il ritardo di rendering pesa per il 90% sull'LCP** delle pagine interne. L'H1 di /contatti, ad esempio, è pronto a 0,5 s ma resta a `opacity:0` fino a 4,1 s, quando il JavaScript lo anima. È colpa di `Reveal`.
2. **Home, ritratto di Roberto:** è l'elemento LCP e viene **precaricato due volte** (versione telefono e versione PC, entrambe `priority`), con 3,5 s solo di scaricamento.
3. **Home, 36 immagini precaricate** nell'`<head>`: tutte le foto della vetrina, che stanno più in basso, si contendono la banda con l'LCP. Nell'`<img>` manca `loading="lazy"`.
4. **Home, immagini troppo grandi** per lo schermo: modello Daytona e foto prima/dopo. Si risparmierebbero **1,3 MB** con `srcset`/`sizes`.
5. **Home, thread principale:** 4,8 s di "Style & Layout" e un task lungo da 2,4 s all'avvio, con 1.760 elementi nel DOM. Va indagato senza cambiare l'aspetto.
6. **Font:** ✅ self-hosted con next/font, `font-display: swap`, 5 preload. Sono tanti (Cormorant 4 pesi × 2 stili, Montserrat 4, Plex Mono 2): si può sfoltire.
7. **Script di terzi:** ✅ GA e Clarity partono solo dopo il consenso; la chat non carica nulla da fuori. Vercel Analytics è leggero.
8. **Formati:** quasi tutto WebP/SVG. Restano in PNG i loghi delle marche (−125 KB in WebP) e `grana.png`.

### 5. Dati strutturati

| Schema | Dove | Esito |
|---|---|---|
| LocalBusiness | tutte le pagine | ✅ valido: name, address, telephone, email, url, image, logo, orari, areaServed, sameAs (IG, FB), founder, catalogo servizi, P.IVA. ❌ mancano **geo** (coordinate), **hasMap**, la scheda Google in **sameAs** e **priceRange**. ⚠️ il tipo generico `LocalBusiness` va bene: schema.org non ha un tipo "orologiaio" e `JewelryStore` sarebbe impreciso. |
| WebSite | tutte | ✅ |
| BreadcrumbList | pagine interne | ✅ |
| FAQPage | /faq | ✅ domande visibili in pagina. Google ormai mostra i risultati FAQ quasi solo per siti istituzionali, ma lo schema aiuta comunque la ricerca AI. |
| Service | — | ❌ i servizi sono solo nel catalogo del LocalBusiness, non come `Service` su /servizi |
| Person (Roberto) | — | ❌ manca su /chi-sono |
| Recensioni/rating | — | ✅ assenti, giustamente: non vanno inventate |

JSON-LD sintatticamente valido su tutte le pagine: l'ho letto con un parser JSON.

### 6. Accessibilità che pesa sulla SEO
- **Contrasto:** l'oro `#86661f` sul fondo crema arriva a 4,03–4,41, sotto il minimo di 4,5. Riguarda sopratitoli, date e numeri. Anche il sottotitolo piccolo nel pulsante WhatsApp (4,32) e il testo della card WhatsApp in /contatti (4,01).
- **Liste:** su /servizi (i 4 passi) e /chi-sono (le tappe) l'animazione mette un `<div>` direttamente dentro `<ol>`, e gli screen reader non le riconoscono come liste.
- Alt, etichette dei moduli e testi dei link: ✅

### Problemi ordinati per impatto

| # | Impatto | Problema |
|---|---|---|
| 1 | **Alto** | LCP 4,1–4,8 s su tutte le pagine: contenuto nascosto da `Reveal` fino al JavaScript |
| 2 | **Alto** | H1 senza keyword né città; title della home troppo lungo (68) |
| 3 | **Alto** | Search Console non verificato, sitemap mai inviata |
| 4 | **Alto** | Home: Performance 54, LCP doppio, 36 preload, 1,3 MB di immagini sovradimensionate, 2,2 s di blocco |
| 5 | Medio | LocalBusiness senza geo, hasMap e link alla scheda Google |
| 6 | Medio | Description di /cookie falsa; description corte su shop, marche e note legali |
| 7 | Medio | Contrasto dell'oro sotto il minimo |
| 8 | Medio | Mancano Service su /servizi e Person su /chi-sono |
| 9 | Basso | apple-touch-icon e manifest; title della 404; `lastModified` della sitemap |
| 10 | Basso | Liste `ol` con `div` dentro; loghi in PNG; doppio salto http→https→www |

---

## Fase 2: piano

In ordine di impatto/sforzo. Un commit per area, ognuno annullabile da solo.

### A. Rendering e velocità (commit "performance") · impatto alto · sforzo medio
1. **`Reveal` senza attesa del JavaScript.** Il contenuto parte visibile e l'animazione d'ingresso la fa il CSS, che funziona anche senza JS e non usa JS durante lo scorrimento. L'aspetto resta uguale. Nell'hero niente animazione di attesa, così l'H1 c'è subito. Risolve anche le liste `ol`/`div`.
   File: `src/components/Reveal.tsx`, `src/app/globals.css`, poi `components/pages/Bits.tsx` e `app/chi-sono/page.tsx` per le liste.
2. **Home: un solo ritratto precaricato** (oggi due) e `sizes` corretti.
   File: `src/app/page.tsx`.
3. **Home: vetrina e immagini sotto la piega in `loading="lazy"`**, così i 36 preload diventano 2–3, e `srcset`/`sizes` su modello Daytona e prima/dopo (−1,3 MB).
   File: `Showcase.tsx` e i componenti della vetrina e del restauro.
4. **Home: indagine sui 2,2 s di blocco** (stili e layout) e correzione senza cambiare l'aspetto. Se una correzione toccasse la grafica, prima ti chiedo.
5. **Loghi delle marche in WebP.** Font: tolgo i pesi che non usa nessuno.

### B. Meta e contenuti (commit "meta") · impatto alto · sforzo basso, **i testi servono approvati**
Title ≤60 con il suffisso, description 140–160, keyword e città dentro. Per l'H1 ci sono due strade:
- **Opzione 1, consigliata: grafica identica.** Il sopratitolo piccolo che c'è già sopra ogni slogan diventa l'H1 con la keyword. Lo slogan grande resta com'è, ma come testo normale.
- **Opzione 2:** la keyword entra nello slogan grande, che cambia.

| Pagina | Title proposto | Description proposta | H1 proposto (opz. 1: nuovo sopratitolo) |
|---|---|---|---|
| / | Orologiaio a Pistoia: restauro orologi \| Roberto Landi (54) | Roberto Landi, orologiaio a Pistoia: revisione, restauro e riparazione di Rolex, Patek Philippe, Omega e altri marchi. Garanzia 12 mesi, preventivo gratis. (155) | Roberto Landi, orologiaio a Pistoia |
| /servizi | Riparazione e restauro orologi a Pistoia \| Roberto Landi (56) | Revisione del movimento, restauro di cassa e bracciale, vetro, impermeabilità e ricambi originali per orologi di lusso nel mio laboratorio di Pistoia. (150) | Riparazione e restauro di orologi di lusso a Pistoia |
| /marche | Riparazione Rolex, Patek e Omega a Pistoia \| Roberto Landi (58) | Riparazione e restauro di Rolex, Patek Philippe, Audemars Piguet, Cartier, Tudor e Omega a Pistoia, da orologiaio indipendente. Preventivo gratuito su foto. (156) | Riparazione di Rolex, Patek Philippe e grandi marche a Pistoia |
| /chi-sono | Chi sono: orologiaio artigiano a Pistoia \| Roberto Landi (56) | Roberto Landi, orologiaio artigiano a Pistoia: la bottega di famiglia, il Liceo Artistico, la passione per l'orologeria e un laboratorio per orologi di lusso. (158) | Roberto Landi, orologiaio artigiano a Pistoia |
| /contatti | Contatti e orari: orologiaio a Pistoia \| Roberto Landi (54) | Laboratorio in Via Padre Giovanni Antonelli 69 a Pistoia, aperto dal lunedì al venerdì 9–18. Chiama, scrivi su WhatsApp o mandami una foto dell'orologio. (153) | Contatti del laboratorio di orologeria a Pistoia |
| /preventivo | Preventivo gratuito riparazione orologio \| Roberto Landi (56) | Preventivo gratuito per riparare o restaurare il tuo orologio di lusso a Pistoia: tre passi, ti rispondo con intervento, tempi e costi prima di iniziare. (153) | Preventivo gratuito per riparare il tuo orologio |
| /faq | Domande frequenti: riparazione orologi \| Roberto Landi (54) | Tempi, costi, garanzia di 12 mesi, ricambi originali e spedizione: le risposte di Roberto Landi, orologiaio a Pistoia, sulla riparazione degli orologi. (151) | Domande frequenti su riparazione e restauro di orologi |
| /shop (noindex fino a gennaio) | Compravendita orologi di lusso a Pistoia \| Roberto Landi (56) | Orologi di lusso usati e d'epoca selezionati a Pistoia: ognuno aperto, controllato e revisionato in laboratorio prima della vendita, con garanzia scritta. (154) | Compravendita di orologi di lusso a Pistoia |
| /shop/marca/rolex (idem per le altre marche) | Rolex usati e revisionati a Pistoia \| Roberto Landi (51) | Rolex usati selezionati a Pistoia: ogni pezzo è aperto, revisionato e garantito 12 mesi. Cerchi un modello preciso? Te lo trovo e lo controllo io. (146) | Rolex usati e revisionati a Pistoia |
| /cookie | invariato | Cookie del sito di Roberto Landi Lab Watches: niente pubblicità né profilazione; statistiche (Google Analytics e Clarity) solo con il tuo consenso. (147) | invariato |
| /note-legali | invariato | Note legali del sito di Roberto Landi Lab Watches, laboratorio di orologeria a Pistoia: titolare, dati fiscali, marchi citati, diritti su testi e immagini. (155) | invariato |
| 404 | Pagina non trovata \| Roberto Landi | — | invariato |

I testi del corpo pagina non li tocco.

### C. Schema (commit "schema") · impatto medio · sforzo basso
- LocalBusiness: aggiungo `hasMap` e la scheda Google in `sameAs` (il link c'è già nel sito) e `geo` con le coordinate del laboratorio (**servono da te**, vedi sotto). `priceRange` solo se Roberto vuole indicare una fascia vera.
- `Service` per ogni servizio su /servizi, con `provider` → il LocalBusiness. Sono servizi visibili in pagina.
- `Person` per Roberto su /chi-sono.
- Recensioni o rating: non li aggiungo.

### D. Tecnico (commit "tecnico") · impatto medio/basso · sforzo basso
- Meta di verifica di **Google Search Console** nel `<head>` (proprietà "prefisso URL"). Funziona anche con il DNS ancora su Wix. **Mi serve il codice**, vedi la checklist.
- `apple-touch-icon` 180×180 e manifest, generati dal logo che c'è già.
- `lastModified` reale nella sitemap: data fissa per pagina, aggiornata quando la pagina cambia.
- Opzionale, utile alla ricerca AI: `llms.txt` con chi è Roberto, cosa fa, dove, contatti e link alle pagine. Solo fatti che sono già nel sito.

### E. Accessibilità (commit "accessibilità") · impatto medio · sforzo basso, **tocca un colore del marchio**
- L'oro dei testi piccoli passa da `#86661f` a circa `#7a5c1b`: un filo più scuro, contrasto 4,7–5,2 (minimo 4,5). Ti mando prima/dopo.
- Il sottotitolo nei pulsanti WhatsApp e il testo della card WhatsApp diventano un po' più chiari.

### F. Pagine nuove: **solo proposta, non le creo senza ok**
- **Pagine di marca indicizzabili** (/marche/rolex, /marche/patek-philippe…). Oggi il testo "Restauro e revisione Rolex" sta su /shop/marca/rolex, che è noindex. Una pagina "Riparazione Rolex a Pistoia" con contenuto vero può posizionarsi su ricerche come "riparazione Rolex Pistoia". **Serve materiale di Roberto per marca:** lavori tipici, problemi frequenti, 2–3 foto vere, tempi indicativi. Senza, sarebbero pagine sottili e non le consiglio.
- **Pagine per zona** (Firenze, Prato, Lucca…): **le sconsiglio.** Il laboratorio è uno e per le altre città il servizio è la spedizione, quindi sarebbero doorway page. Meglio una sola sezione "Da tutta Italia" (c'è già in /spedizioni-e-consegna) e la scheda Google ben curata.
- **Ricerca AI:** le FAQ sono già visibili. Se Roberto dà **prezzi indicativi veri** (es. "revisione Rolex da … €"), le risposte diventano molto più citabili. Senza prezzi veri non scrivo cifre.

### Cosa mi serve da te
1. **OK sul piano**, anche solo per alcune aree (A, B, C, D, E).
2. **Testi del punto B:** ok così, modifiche, e opzione 1 o 2 per l'H1.
3. **Orari:** il sito dice lun–ven 9–18. Nel codice c'è una nota: il vecchio sito aveva orari diversi in Contatti. Devono essere identici alla scheda Google.
4. **Coordinate del laboratorio:** su Google Maps, tasto destro sul punto esatto → copia i due numeri.
5. **Codice di verifica di Search Console** (proprietà "Prefisso URL" → metodo "Tag HTML" → mi incolli solo il `content="…"`).

---

## Checklist manuale (per te)
- [ ] **Google Search Console:** aggiungi la proprietà `https://www.rl-labwatches.it/` (prefisso URL), metodo Tag HTML, e mandami il codice. Dopo la pubblicazione premi "Verifica" e invia `https://www.rl-labwatches.it/sitemap.xml`.
- [ ] **Google Business Profile:** nome, indirizzo, telefono e orari **identici** al sito (vedi NAP sopra). Sito web: `https://www.rl-labwatches.it/`. Categoria: scegli la più precisa tra quelle che Google propone per "orologi" (es. servizio di riparazione orologi come principale, negozio di orologi come secondaria quando parte la compravendita).
- [ ] **Bing Webmaster Tools:** importa la proprietà da Search Console (un clic), poi invia la sitemap.
- [ ] **Nameserver su register.it:** ancora su Wix. Non disdire Wix Premium finché il DNS non è spostato.
