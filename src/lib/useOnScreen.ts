"use client";
import { useEffect, useState } from "react";

/** true quando l'elemento è (quasi) visibile: serve a fermare le scene 3D fuori schermo */
export default function useOnScreen(ref: React.RefObject<Element | null>, rootMargin = "0px") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return on;
}
