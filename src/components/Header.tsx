"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import { nav, site } from "@/data/site";

// Centro del cerchio da cui si apre il menu "a iride" (la posizione dell'icona del menu)
const ORIGIN = "calc(100% - 2.25rem) 2.75rem";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // tono del fondo sotto l'intestazione: su fondo scuro logo chiaro, su fondo chiaro logo verde e oro
  const [dark, setDark] = useState(false);
  const [everDark, setEverDark] = useState(false);
  const [noVeil, setNoVeil] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const cache = new WeakMap<Element, number>();
    // luminosità del primo fondo pieno sotto il punto (null = trasparente)
    const lum = (el: Element) => {
      if (cache.has(el)) return cache.get(el)!;
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      let v = -1;
      if (m && (m.length < 4 || Number(m[3]) > 0.6)) v = (0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2]) / 255;
      cache.set(el, v);
      return v;
    };
    let raf = 0;
    const check = () => {
      raf = 0;
      const h = ref.current;
      if (!h) return;
      const y = h.getBoundingClientRect().height / 2;
      let tone = -1;
      for (const el of document.elementsFromPoint(Math.min(40, window.innerWidth / 4), y)) {
        if (h.contains(el)) continue;
        for (let n: Element | null = el; n && tone < 0; n = n.parentElement) tone = lum(n);
        if (tone >= 0) break;
      }
      const d = tone >= 0 && tone < 0.35;
      setDark(d);
      // sotto l'intestazione c'è una scena ferma (es. il restauro): niente sfocatura, coprirebbe le scritte
      setNoVeil(document.elementsFromPoint(Math.min(40, window.innerWidth / 4), y).some((el) => !h.contains(el) && !!el.closest("[data-no-veil]")));
      if (d) setEverDark(true);
    };
    // elementsFromPoint costa: mentre scorri al massimo ogni 120 ms, più un controllo quando ti fermi
    let lastCheck = 0;
    let tail = 0;
    const run = () => {
      lastCheck = performance.now();
      if (!raf) raf = requestAnimationFrame(check);
    };
    const queue = () => {
      window.clearTimeout(tail);
      if (performance.now() - lastCheck > 120) run();
      tail = window.setTimeout(run, 140);
    };
    run();
    const late = [120, 600, 1200, 2500, 4200].map((t) => window.setTimeout(queue, t)); // dopo il cambio pagina e l'intro
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(tail);
      late.forEach(clearTimeout);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [pathname]);

  // con il menu aperto la pagina sotto non scorre; Esc lo chiude
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string, also: readonly string[] = []) =>
    href === "/" ? pathname === "/" : [href, ...also].some((h) => pathname.startsWith(h));

  return (
    <>
    {/* Niente fascia dietro l'intestazione: quello che le scorre sotto si sfoca sempre di più verso l'alto, così logo e
        menu restano puliti e in evidenza. Più strati di sfocatura crescente, ognuno sfumato (vedi .veil in globals.css).
        Sta fuori dall'intestazione e senza view-transition-name: altrimenti la sfocatura non vedrebbe la pagina sotto. */}
    <div aria-hidden className={`veil ${dark ? "veil-dark" : ""} ${scrolled && !open && !noVeil ? "veil-on" : ""}`}>
      <i />
      <i />
      <i />
      <i />
    </div>
    <header
      ref={ref}
      // ferma durante lo scorrimento tra le pagine (vedi globals.css)
      style={{ viewTransitionName: "site-header" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-8 ${scrolled ? "h-16" : "h-20 sm:h-28"}`}>
        <Link href="/" aria-label="Roberto Landi Lab Watches – Home" className={`relative transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : ""}`}>
          <Logo version="RL-orizzontale-metallo" animate="hover" priority className={`transition-[height,opacity] duration-500 ${scrolled ? "h-9 sm:h-10" : "h-11 sm:h-14"} ${dark ? "opacity-0" : ""}`} />
          {everDark && (
            <Logo version="RL-orizzontale-negativo" className={`!absolute left-0 top-0 transition-[height,opacity] duration-500 ${scrolled ? "h-9 sm:h-10" : "h-11 sm:h-14"} ${dark ? "" : "opacity-0"}`} />
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex xl:gap-11" aria-label="Menu principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[0.72rem] uppercase tracking-[0.2em] transition-colors duration-500 ${
                isActive(item.href, item.also) ? (dark ? "text-gold-3" : "text-gold") : dark ? "text-cream/80 hover:text-cream" : "text-fg/75 hover:text-fg"
              }`}
            >
              {item.label}
              {isActive(item.href, item.also) && <motion.span layoutId="nav-underline" className={`absolute -bottom-2 left-0 right-0 h-px ${dark ? "bg-gold-3" : "bg-gold"}`} />}
            </Link>
          ))}
          <Link href="/preventivo" className="btn btn-solid !px-4 !py-2.5 !text-[0.7rem]">Preventivo</Link>
        </nav>

        <button
          className="relative -mr-2 flex h-12 w-12 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={open ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 transition-all duration-500 ${open ? "translate-y-[3.5px] rotate-45 bg-cream" : dark ? "bg-cream" : "bg-fg"}`} />
          <span className={`block h-px self-end transition-all duration-500 ${open ? "mr-3 w-6 -translate-y-[3.5px] -rotate-45 bg-cream" : `mr-3 w-4 ${dark ? "bg-cream" : "bg-fg"}`}`} />
        </button>
      </div>

      {/* Menu da telefono: si apre "a iride" dall'icona, come un otturatore o un fondello che si svita */}
      <motion.nav
        id="menu-mobile"
        aria-label="Menu"
        aria-hidden={!open}
        initial={false}
        animate={{ clipPath: open ? `circle(150% at ${ORIGIN})` : `circle(0% at ${ORIGIN})` }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className={`guilloche fixed inset-0 flex flex-col bg-green-2 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-24 text-cream lg:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <ul className="flex flex-1 flex-col justify-center gap-1">
          {nav.map((item, i) => (
            <motion.li
              key={item.href}
              initial={false}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ delay: open ? 0.25 + i * 0.05 : 0, duration: 0.45 }}
            >
              <Link href={item.href} tabIndex={open ? 0 : -1} className={`block py-1.5 font-display text-4xl ${isActive(item.href, item.also) ? "text-gold-3" : "text-cream"}`}>
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        {/* le pagine secondarie, piccole: marche e domande frequenti */}
        <motion.p initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.5 : 0 }} className="mb-6 flex gap-6 text-sm uppercase tracking-[0.2em] text-cream/70">
          <Link href="/marche" tabIndex={open ? 0 : -1} className="hover:text-gold-3">Marche</Link>
          <Link href="/faq" tabIndex={open ? 0 : -1} className="hover:text-gold-3">FAQ</Link>
        </motion.p>
        <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.55 : 0 }} className="space-y-4 border-t border-cream/15 pt-6">
          <Link href="/preventivo" tabIndex={open ? 0 : -1} className="btn w-full justify-center !border-gold-3 !bg-gold-3 !text-green-2">Richiedi un preventivo</Link>
          <p className="tag-mono text-center text-xs text-cream/60">{site.address.street} · {site.address.city}</p>
        </motion.div>
      </motion.nav>
    </header>
    </>
  );
}
