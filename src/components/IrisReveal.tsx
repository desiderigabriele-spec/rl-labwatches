"use client";
import { motion } from "motion/react";

/**
 * "Il fondello che si apre": l'immagine si scopre da un cerchio centrale mentre
 * una ghiera dentata ruota e si allarga, come quando si svita il fondello di un orologio.
 */
export default function IrisReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial="closed"
      whileInView="open"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      <motion.div
        variants={{ closed: { clipPath: "circle(0% at 50% 50%)" }, open: { clipPath: "circle(75% at 50% 50%)" } }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      {/* ghiera del fondello */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square rounded-full border-[6px] border-dashed border-gold-2/80"
        style={{ x: "-50%", y: "-50%" }}
        variants={{ closed: { width: "22%", rotate: 0, opacity: 1 }, open: { width: "150%", rotate: -110, opacity: 0 } }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.9, delay: 0.35 } }}
      />
    </motion.div>
  );
}
