"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Pic } from "@/content/content";

// Photography: a straight horizontal stack of overlapping polaroids.
// Clicking a card spreads them into a full-bleed scroll-snap gallery that
// opens centered on THAT card; in the gallery, clicking any card scrolls
// it to the center, where it renders larger and on top of its neighbours.
export default function PolaroidStack({ photos }: { photos: Pic[] }) {
  // null = stacked; a number = gallery open, centered on that index
  const [open, setOpen] = useState<number | null>(null);
  // while the spread animation runs, scroll-snap is off — with every card
  // still transform-collapsed at the center, mandatory snap would otherwise
  // re-snap the rail back to the first card
  const [opening, setOpening] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const [scales, setScales] = useState<number[]>(() => photos.map(() => 1));

  // grow each card by how close it is to the rail's horizontal center
  const measure = () => {
    const rail = railRef.current;
    if (!rail) return;
    const mid = rail.getBoundingClientRect().left + rail.clientWidth / 2;
    const kids = [...rail.children] as HTMLElement[];
    setScales(
      kids.map((k) => {
        const r = k.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        return 1 + 0.24 * Math.max(0, 1 - d / (rail.clientWidth * 0.45));
      })
    );
  };

  const centerOn = (i: number, behavior: ScrollBehavior) => {
    const rail = railRef.current;
    const kid = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !kid) return;
    rail.scrollTo({
      left: kid.offsetLeft - (rail.clientWidth - kid.clientWidth) / 2,
      behavior,
    });
  };

  useEffect(() => {
    if (open === null) return;
    const rail = railRef.current;
    if (!rail) return;
    setOpening(true);
    centerOn(open, "instant" as ScrollBehavior); // open on the card that was clicked
    measure();
    const snapT = setTimeout(() => {
      setOpening(false);
      measure(); // settle the center emphasis once cards stop flying
    }, 500); // spread anim is 450ms
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(snapT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open !== null]);

  if (open === null) {
    const mid = (photos.length - 1) / 2;
    return (
      <div className="photo-stack">
        {photos.map((p, i) => (
          <button
            key={p.src}
            className="polaroid stack-card"
            style={
              {
                "--d": i - mid, // used by the gather animation
                transform: `translateX(calc(${i - mid} * var(--stack-step)))`,
                zIndex: i + 1,
              } as React.CSSProperties
            }
            onClick={() => setOpen(i)}
            aria-label={`open photo ${i + 1}`}
          >
            <Image src={p.src} alt="" width={p.w} height={p.h} sizes="240px" draggable={false} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="gallery">
      <button className="gallery-close" onClick={() => setOpen(null)}>
        stack ✕
      </button>
      <div className={`rail${opening ? " opening" : ""}`} ref={railRef}>
        {photos.map((p, i) => (
          <div
            key={p.src}
            className="polaroid rail-card"
            style={
              {
                "--d": i - open, // spread out from the card that was clicked
                transform: `scale(${scales[i] ?? 1})`,
                zIndex: Math.round((scales[i] ?? 1) * 100),
              } as React.CSSProperties
            }
            onClick={() => centerOn(i, "smooth")}
          >
            <Image
              src={p.src}
              alt="photograph"
              width={p.w}
              height={p.h}
              sizes="(max-width: 640px) 60vw, 320px"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
