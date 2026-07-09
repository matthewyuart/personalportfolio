"use client";

import { useEffect, useRef } from "react";

// A cursor spotlight: everything is darkened except a soft-edged circle that
// follows the pointer. Pure overlay — pointer-events off, so it never blocks
// interaction beneath. On touch (no fine pointer) it stays off.
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(pointer: fine)").matches) return;

    // fade the darkened spotlight in on load — starts at the viewport
    // center, then follows the pointer
    el.style.setProperty("--x", `${window.innerWidth / 2}px`);
    el.style.setProperty("--y", `${window.innerHeight / 2}px`);
    const fadeIn = requestAnimationFrame(() => (el.style.opacity = "1"));

    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fadeIn);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
    };
  }, []);

  return <div ref={ref} className="spotlight" aria-hidden />;
}
