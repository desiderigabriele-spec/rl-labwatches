Integra nel sito il logo Roberto Landi contenuto in questo kit.

1. Usa SVG/RL-completo-metallo.svg per la composizione originale o SVG/RL-orizzontale-metallo.svg per l'header. Su fondo scuro usa la versione negativa o bianca.
2. Conserva forme, lettere e proporzioni. Le scritte sono già in tracciati: non sostituirle con font e non ridisegnare il logo.
3. Per animare, monta l'SVG inline e usa WEB/logo-animation.js; per React parti da WEB/LogoRobertoLandi.jsx. Evita di inserire uno script dentro il file SVG.
4. All'ingresso muovi solo hour-hand e minute-hand, rallenta e ferma nella posa originale. Usa il controller già incluso: origine 628 607 nelle coordinate locali, rotazione tramite attributo transform SVG. Non ruotare quadrante o scritte.
5. Opzionalmente usa mode='clock' per l'ora locale. Mantieni il rispetto di prefers-reduced-motion, il cleanup e gli ID univoci forniti dal controller.
6. Controlla desktop e mobile, con altezza automatica, senza tagliare il viewBox. Se mostri più copie inline, usa namespaceLogo su ogni copia prima del montaggio.
7. WEB/demo.html mostra il risultato atteso ed è autonoma. Verifica che il logo originale torni identico dopo l'animazione e che ore e minuti si aggiornino correttamente.
