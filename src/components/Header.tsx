"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { nav } from "@/data/site";

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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-ink/85 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link href="/" aria-label="RL Lab Watches – Home">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[0.74rem] tracking-[0.24em] uppercase transition-colors ${
                isActive(item.href) ? "text-gold" : "text-ivory/75 hover:text-ivory"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <motion.span layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-px bg-gold" />
              )}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-6 bg-ivory transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`mt-1.5 block h-px w-6 bg-ivory transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-line"
          >
            <ul className="px-4 py-6 space-y-5">
              {nav.map((item, i) => (
                <motion.li key={item.href} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <Link href={item.href} className={`font-display text-3xl ${isActive(item.href) ? "text-gold" : "text-ivory"}`}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
