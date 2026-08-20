"use client";

import { useEffect, useRef } from "react";

// A looping screen recording that honors prefers-reduced-motion: when the
// user asks for less motion, the video pauses on its poster frame instead
// of autoplaying (the global CSS rule can't reach <video autoplay>).
export default function Reel({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React doesn't serialize `muted` into SSR HTML, so mobile Chrome sees
    // an unmuted autoplay video in the initial markup and blocks playback.
    // Force the property + attribute, then (re)try play once data arrives.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (m.matches) {
        v.pause();
        v.removeAttribute("autoplay");
        v.currentTime = 0;
      } else {
        v.play().catch(() => {});
      }
    };
    apply();
    v.addEventListener("loadeddata", apply);
    m.addEventListener("change", apply);
    return () => {
      v.removeEventListener("loadeddata", apply);
      m.removeEventListener("change", apply);
    };
  }, []);

  return <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline aria-hidden />;
}
