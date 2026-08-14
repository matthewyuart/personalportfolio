"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
  }
}

// Official X embed (video posts keep their audio). widgets.js is injected
// once and re-scanned on mount, so the embed hydrates even though the
// project modal mounts long after page load.
export default function TweetEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scan = () => window.twttr?.widgets?.load(ref.current ?? undefined);
    if (window.twttr) {
      scan();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://platform.twitter.com/widgets.js"]'
    );
    if (existing) {
      existing.addEventListener("load", scan);
      return () => existing.removeEventListener("load", scan);
    }
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = scan;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="proj-embed" ref={ref}>
      <blockquote className="twitter-tweet" data-dnt="true" data-media-max-width="560">
        <a href={url}>{url}</a>
      </blockquote>
    </div>
  );
}
