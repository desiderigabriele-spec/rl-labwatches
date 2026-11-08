"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import ReadingBezel from "./ReadingBezel";
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

  // con il menu aperto la pagina sotto non scorre; Esc lo chiude
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        open ? "bg-transparent" : scrolled ? "border-b border-line bg-paper/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-8 ${scrolled ? "h-16" : "h-20 sm:h-28"}`}>
        <Link href="/" aria-label="Roberto Landi Lab Watches – Home" className={`transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : ""}`}>
          <Logo version="RL-orizzontale-metallo" animate="hover" className={`transition-[height] duration-500 ${scrolled ? "h-9 sm:h-10" : "h-11 sm:h-14"}`} />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Menu principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[0.72rem] uppercase tracking-[0.2em] transition-colors ${isActive(item.href) ? "text-gold" : "text-fg/75 hover:text-fg"}`}
            >
              {item.label}
              {isActive(item.href) && <motion.span layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-gold" />}
            </Link>
          ))}
          <Link href="/preventivo" className="btn btn-solid !px-4 !py-2.5 !text-[0.7rem]">Preventivo</Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
        {/* ghiera di lettura su telefono: qui non copre mai il testo */}
        <span className={`transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : ""}`}>
          <ReadingBezel variant="header" />
        </span>
        <button
          className="-mr-2 flex h-12 w-12 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label={open ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 transition-all duration-500 ${open ? "translate-y-[3.5px] rotate-45 bg-cream" : "bg-fg"}`} />
          <span className={`block h-px w-6 transition-all duration-500 ${open ? "-translate-y-[3.5px] -rotate-45 bg-cream" : "bg-fg"}`} />
        </button>
        </div>
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
              <Link href={item.href} tabIndex={open ? 0 : -1} className={`block py-1.5 font-display text-4xl ${isActive(item.href) ? "text-gold-3" : "text-cream"}`}>
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.55 : 0 }} className="space-y-4 border-t border-cream/15 pt-6">
          <Link href="/preventivo" tabIndex={open ? 0 : -1} className="btn w-full justify-center !border-gold-3 !bg-gold-3 !text-green-2">Richiedi un preventivo</Link>
          <p className="tag-mono text-center text-xs text-cream/60">{site.address.street} · {site.address.city}</p>
        </motion.div>
      </motion.nav>
    </header>
  );
}
