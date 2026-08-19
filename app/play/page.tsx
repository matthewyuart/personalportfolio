import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reel from "@/components/Reel";
import { playSections } from "@/content/content";

export const metadata: Metadata = { title: "Play — Matthew Yu" };

// Play, in three categories: visual explorations, engineering, and the
// internet artifacts. Static apps live under /public/play and open
// directly; external sites open in a new tab.
export default function PlayPage() {
  return (
    <main id="main" className="page">
      <SiteNav active="play" />

      {playSections.map((s) => (
        <section key={s.label} className="play-section">
          <h2 className="section-label">{s.label}</h2>
          <div className="play-list">
            {s.cards.map((c) => {
              const external = c.href.startsWith("http");
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="play-card"
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  <div className="thumb" style={{ aspectRatio: `${c.thumb.w} / ${c.thumb.h}` }}>
                    {c.reel ? (
                      <Reel src={c.reel} poster={c.thumb.src} />
                    ) : (
                      <Image
                        src={c.thumb.src}
                        alt={c.title}
                        fill
                        quality={60}
                        sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 520px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <div className="cap">
                      <span className="t">{c.title}</span>
                      <span className="n">{c.note}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <SiteFooter />
    </main>
  );
}
