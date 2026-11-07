"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Foto che scorre più lentamente del resto della pagina (parallasse) */
export default function ParallaxImage({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  strength = 10,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-[-12%]">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      </motion.div>
    </div>
  );
}
