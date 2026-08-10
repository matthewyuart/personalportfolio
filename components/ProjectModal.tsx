"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// The card that gets pulled up over the page: backdrop blurs in, the card
// slides up (pure CSS via @starting-style, so no JS timing is involved),
// X / Esc / clicking the backdrop closes it, and the expand button toggles
// a full-screen reading mode.
//
// The controls live on the frame AROUND the scrolling card, so they sit in
// its true corners no matter what the card's padding or scrollbar does.
export default function ProjectModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [full, setFull] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; // lock page scroll
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const close = useCallback(() => {
    setClosing(true); // play the exit transition first
    setTimeout(() => {
      // came from the grid → back; direct load → home
      if (window.history.length > 1) router.back();
      else router.push("/");
    }, 200);
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className={`pmodal${closing ? " closing" : ""}${full ? " full" : ""}`}
      onPointerDown={(e) => {
        if (!frameRef.current?.contains(e.target as Node)) close();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="pmodal-frame" ref={frameRef}>
        {/* the rounded card CLIPS the inner scroller, so the scrollbar can
            never paint past the corners (a scroller's own scrollbar is not
            clipped by its border-radius) */}
        <div className="pmodal-card">
          <div className="pmodal-scroll">{children}</div>
        </div>
        <div className="pmodal-bar">
          <button className="pmodal-btn pmodal-x" onClick={close} aria-label="close">
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="pmodal-btn pmodal-expand"
            onClick={() => setFull((f) => !f)}
            aria-label={full ? "exit full screen" : "full screen"}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
              {full ? (
                <path d="M6.5 2v4.5H2M9.5 14V9.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M2 6.5V2h4.5M14 9.5V14H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
