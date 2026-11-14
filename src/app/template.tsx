"use client";
import { motion } from "motion/react";
import { zoomPending } from "@/lib/zoomEntrance";

// Transizione tra le pagine
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // entrando nella marca dalla vetrina la pagina è già sotto lo zoom: niente dissolvenza
      initial={zoomPending() ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
