"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Pic } from "@/content/content";

// Treehacks playing cards: a wide, shallow fan. Click a card to lift it out
// and view it large; click the large card to flip to the back design; click
// anywhere else to slide it back into the deck.
type Face = Pic & { title: string };

export default function CardFan({ back, faces }: { back: Pic; faces: Face[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const mid = (faces.length - 1) / 2;

  const pick = (i: number) => {
    setActive(i);
    setFlipped(false);
  };

  // clicking anywhere but the big card returns it to the deck
  useEffect(() => {
    if (active === null) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.(".viewer-card")) setActive(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  return (
    <div className={`card-fan${active !== null ? " viewing" : ""}`}>
      {faces.map((c, i) => (
        <button
          key={c.src}
          className="cfan-card"
          style={
            {
              "--rot": `${(i - mid) * 2.8}deg`,
              "--tx": `${(i - mid)}`,
              "--ty": `${(i - mid) ** 2}`, /* unitless parabola; CSS scales it */
              zIndex: i + 1,
              visibility: active === i ? "hidden" : undefined,
            } as React.CSSProperties
          }
          onClick={() => pick(i)}
          aria-label={`view ${c.title}`}
        >
          <Image src={c.src} alt={c.title} width={c.w} height={c.h} sizes="180px" draggable={false} />
        </button>
      ))}

      {active !== null && (
        <div className="card-viewer">
          <p className="viewer-caption">{faces[active].title} · tap to flip</p>
          {/* the pop-in animation lives on this wrapper — an animation on the
              rotating element itself would flatten its 3D and break the flip */}
          <div className="viewer-pop">
            <button
              className={`viewer-card${flipped ? " flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label={flipped ? "flip to front" : "flip to back"}
            >
              <span className="viewer-face front">
                <Image
                  src={faces[active].src}
                  alt={faces[active].title}
                  width={faces[active].w}
                  height={faces[active].h}
                  sizes="300px"
                  draggable={false}
                />
              </span>
              <span className="viewer-face back">
                <Image src={back.src} alt="card back" width={back.w} height={back.h} sizes="300px" draggable={false} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
