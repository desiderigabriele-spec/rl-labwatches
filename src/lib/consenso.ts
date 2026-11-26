/** Chiave della scelta sui cookie nel browser ("si" | "no"). Modulo semplice: lo usano sia il layout (server) sia il banner. */
export const CONSENT_KEY = "rl-consenso";

/**
 * Script per <head>: a chi ha già scelto mette data-consenso su <html> prima del primo disegno,
 * così il banner (già presente nell'HTML) non compare nemmeno per un attimo.
 */
export const CONSENT_HEAD = `try{if(localStorage.getItem("${CONSENT_KEY}"))document.documentElement.setAttribute("data-consenso","")}catch(e){}`;
