# Logo Roberto Landi · Lab Watches

Il logo del sito è ridisegnato fedelmente dall'immagine originale fornita dal cliente
(misure prese sul file raster 1254×1254, stesse coordinate).

- Geometria e colori: `src/brand/logo.ts`
- Testi convertiti in tracciati (Montserrat SemiBold): `src/brand/logo-text.ts` (generato)
- File SVG pronti all'uso: `public/brand/logo_*.svg` e `public/brand/icona_*.svg`
  (varianti: principale, scuro, bianco, nero, verde, oro)
- Favicon: `src/app/icon.svg`

Per rigenerare tutti i file dopo una modifica a `src/brand/logo.ts`:

```bash
node scripts/build-logo.mts
```

Le lancette ruotano intorno al perno (628, 607). Nel componente `<Logo live />` segnano l'ora reale
(aggiornata ogni minuto, non animate di continuo) e rispettano "riduci movimento".

