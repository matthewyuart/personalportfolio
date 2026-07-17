"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SketchPage } from "@/content/content";

// Sketchbook page-turn: each PNG is one full spread. Turning forward folds
// the right half over the center spine (3D rotateY); its back face reveals
// the left half of the next spread, while the next spread's right half sits
// beneath. Turning back mirrors the fold from the left. It loops at either
// end. Flips are interruptible — a tap mid-turn finalizes the current fold
// and immediately starts the next, so every tap registers.
type Flip = {
  id: number;
  dir: "next" | "prev";
  from: number;
  to: number;
  dur?: number; // riffle only: seconds for this turn
  bell?: number; // riffle only: 0..1 speed curve (drives the motion blur tier)
};

function Half({
  page,
  side,
  q,
  sync,
}: {
  page: SketchPage;
  side: "left" | "right";
  q?: number;
  sync?: boolean;
}) {
  return (
    <Image
      src={page.src}
      alt=""
      width={page.w}
      height={page.h}
      sizes="(max-width: 920px) 94vw, 860px"
      quality={q}
      // mobile: paint in the same frame as mount/src-swap (the bitmaps are
      // pre-decoded, so this never actually blocks)
      decoding={sync ? "sync" : undefined}
      draggable={false}
      className={`sb-half-img ${side}`}
    />
  );
}

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden>
    <polyline
      points={dir === "left" ? "11,3 3,22 11,41" : "3,3 11,22 3,41"}
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Sketchbook({ pages }: { pages: SketchPage[] }) {
  const [current, setCurrent] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const idRef = useRef(0);
  const len = pages.length;

  // opening sequence: riffle fast through the whole book, land on Taipei
  const home = Math.max(
    pages.findIndex((p) => p.src.endsWith("/taipei.png")),
    0
  );
  const [intro, setIntro] = useState(false);
  const introRef = useRef(false);

  // ---- separate mobile path (desktop renders exactly as before) ----
  // On phones: half-quality image variants (much smaller files), a
  // persistent copy of the current spread UNDER the flip layers (a remount
  // paint-gap can then never flash bare background), and a two-phase commit
  // so the end of a turn never clips. `ready` gates the preloads until the
  // device is known, so only ONE set of variants is ever fetched.
  const [mobile, setMobile] = useState(false);
  const mobileRef = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const m = matchMedia("(max-width: 640px), (pointer: coarse)").matches;
    mobileRef.current = m;
    setMobile(m);
    setReady(true);
  }, []);
  const q = mobile ? 50 : undefined; // next/image default (75) on desktop

  // riffle sequence: one full loop around the book plus the run-in to the
  // home spread, easing in, whirring through the middle, easing out to land
  const seqRef = useRef<{ from: number; to: number; dur: number; bell: number }[]>([]);
  const seqIdx = useRef(0);
  const buildSeq = () => {
    const total = len + home; // 0 → … → 0 (full loop) → … → home
    return Array.from({ length: total }, (_, s) => {
      const t = total <= 1 ? 1 : s / (total - 1);
      const bell = Math.sin(Math.PI * t); // 0 at the ends, 1 in the middle
      return { from: s % len, to: (s + 1) % len, dur: 0.2 - 0.15 * bell, bell };
    });
  };

  // the DOM preload stack (below) mounts every spread once `ready` fixes the
  // quality tier. Decode them all, then run the opening riffle — capped so a
  // slow asset never strands the intro.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const go = () => {
      if (cancelled) return;
      // phones skip the riffle: on cellular the spreads may not have decoded
      // yet, so the intro would flip through blank pages. Open on home.
      if (mobileRef.current || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCurrent(home);
        return;
      }
      introRef.current = true;
      setIntro(true);
      seqRef.current = buildSeq();
      seqIdx.current = 0;
      idRef.current += 1;
      setFlip({ id: idRef.current, dir: "next", ...seqRef.current[0] });
    };
    const decodeAll = () =>
      Promise.allSettled(
        [...document.querySelectorAll<HTMLImageElement>(".sb-preload img, .sb-stack img")].map(
          (im) => im.decode?.().catch(() => {})
        )
      );
    // let the freshly-mounted preloads issue their requests first
    const kick = setTimeout(() => {
      Promise.race([decodeAll(), new Promise((r) => (t = setTimeout(r, 1500)))]).then(() =>
        setTimeout(go, 200)
      );
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(t);
      clearTimeout(kick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const step = (dir: "next" | "prev") => {
    // a real tap takes over from the opening riffle
    if (introRef.current) {
      introRef.current = false;
      setIntro(false);
    }
    // if a fold is already running, snap it done and turn from where it landed
    const base = flip ? flip.to : current;
    if (flip) setCurrent(flip.to);
    const to = dir === "next" ? (base + 1) % len : (base - 1 + len) % len;
    idRef.current += 1;
    setFlip({ id: idRef.current, dir, from: base, to });
  };
  const next = () => step("next");
  const prev = () => step("prev");

  // arrow keys page the book from anywhere (skip while typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      step(e.key === "ArrowRight" ? "next" : "prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const label = pages[flip ? flip.to : current].title;

  // motion-blur tier for the current riffle turn (maps to an SVG h-blur)
  const bell = intro && flip ? flip.bell ?? 0 : 0;
  const blurTier = bell > 0.6 ? " b2" : bell > 0.25 ? " b1" : "";

  return (
    <div
      className={`sb-wrap${intro ? ` intro${blurTier}` : ""}`}
      style={
        intro && flip
          ? ({ "--riffle-dur": `${flip.dur ?? 0.16}s` } as React.CSSProperties)
          : undefined
      }
    >
      {/* horizontal-only gaussians = directional motion blur for the riffle */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="sb-mblur-1">
          <feGaussianBlur stdDeviation="5 0" />
        </filter>
        <filter id="sb-mblur-2">
          <feGaussianBlur stdDeviation="14 0" />
        </filter>
      </svg>
      <div className="sb-stage">
        <button className="sb-arrow left" onClick={prev} aria-label="previous page">
          <Chevron dir="left" />
        </button>

        <div className="sb-book" style={{ aspectRatio: `${pages[0].w} / ${pages[0].h}` }}>
          {/* mobile: ALL spreads stay mounted, decoded and stacked under the
              flip layers; the current one is shown with a visibility toggle.
              No src swap ever happens, so no frame can paint a stale bitmap
              (Safari lags async on srcset swaps even with decoding=sync).
              Desktop renders exactly as it always did: one spread, idle only. */}
          {mobile ? (
            <div className="sb-full sb-stack">
              {pages.map((p, i) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={i === current ? p.title : ""}
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 920px) 94vw, 860px"
                  quality={q}
                  decoding="sync"
                  draggable={false}
                  priority
                  style={{ visibility: i === current ? "visible" : "hidden" }}
                />
              ))}
            </div>
          ) : (
            !flip && (
              <div className="sb-full">
                <Image
                  src={pages[current].src}
                  alt={pages[current].title}
                  width={pages[current].w}
                  height={pages[current].h}
                  sizes="(max-width: 920px) 94vw, 860px"
                  draggable={false}
                  priority={current < 2}
                />
              </div>
            )
          )}
          {flip && (
            // keyed by flip id so the CSS animations restart on every turn,
            // even when a turn interrupts the previous one
            <div style={{ display: "contents" }} key={flip.id}>
              {/* static halves: the old page's half stays until the flap has
                  nearly landed, the new page's half fades in beneath it */}
              <div className={`sb-half left ${flip.dir === "next" ? "sb-out" : "sb-in"}`}>
                <Half page={pages[flip.dir === "next" ? flip.from : flip.to]} side="left" q={q} sync={mobile} />
              </div>
              <div className={`sb-half right ${flip.dir === "next" ? "sb-in" : "sb-out"}`}>
                <Half page={pages[flip.dir === "next" ? flip.to : flip.from]} side="right" q={q} sync={mobile} />
              </div>
              <div
                className={`sb-flap ${flip.dir}`}
                onAnimationEnd={(e) => {
                  if (e.target !== e.currentTarget) return;
                  setCurrent(flip.to);
                  // during the opening riffle, chain straight into the next
                  // fast flip until the sequence lands on the home spread
                  if (introRef.current && seqIdx.current + 1 < seqRef.current.length) {
                    seqIdx.current += 1;
                    idRef.current += 1;
                    setFlip({ id: idRef.current, dir: "next", ...seqRef.current[seqIdx.current] });
                    return;
                  }
                  if (introRef.current) {
                    introRef.current = false;
                    setIntro(false);
                  }
                  if (mobileRef.current) {
                    // two-phase commit (mobile only): the base underneath
                    // just swapped to the landed page; hold the finished
                    // flip layers over it for a beat so the swap paints
                    // covered, then remove them over identical pixels
                    const fid = flip.id;
                    setTimeout(() => setFlip((f) => (f && f.id === fid ? null : f)), 90);
                    return;
                  }
                  setFlip((f) => (f && f.id === flip.id ? null : f));
                }}
              >
                <div className="sb-face front">
                  <Half page={pages[flip.from]} side={flip.dir === "next" ? "right" : "left"} q={q} sync={mobile} />
                </div>
                <div className="sb-face back">
                  <Half page={pages[flip.to]} side={flip.dir === "next" ? "left" : "right"} q={q} sync={mobile} />
                </div>
              </div>
            </div>
          )}

          {/* preload EVERY spread up front (priority) with the same sizes as
              the flip halves — mounted once `ready` fixes the quality tier,
              so exactly ONE set of variants is fetched and cached. On mobile
              the visible base stack above already does this job. */}
          {ready && !mobile && (
            <div className="sb-preload" aria-hidden>
              {pages.map((p) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt=""
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 920px) 94vw, 860px"
                  quality={q}
                  priority
                />
              ))}
            </div>
          )}

          {/* tap zones: left third = back, rest = forward */}
          <button className="sb-zone sb-prev" onClick={prev} aria-label="previous page" />
          <button className="sb-zone sb-next" onClick={next} aria-label="next page" />
        </div>

        <button className="sb-arrow right" onClick={next} aria-label="next page">
          <Chevron dir="right" />
        </button>
      </div>
      {/* crossfade: the outgoing title fades out while the new one fades in */}
      <div className="sb-captions">
        {flip && (
          <p className="sb-caption cap-out" key={`out-${flip.id}`}>
            {pages[flip.from].title}
          </p>
        )}
        <p className="sb-caption" key={label}>
          {label}
        </p>
      </div>
    </div>
  );
}
