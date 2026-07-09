"use client";

// The quiet caret at the bottom of the hero — scrolls to About without
// leaving a #hash in the URL (a lingering hash re-anchors on reloads).
export default function HeroDown() {
  return (
    <button
      className="hero-down"
      aria-label="scroll to about"
      onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
    >
      <svg viewBox="0 0 44 14" width="34" height="11" fill="none" aria-hidden>
        <polyline
          points="3,3 22,11 41,3"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
