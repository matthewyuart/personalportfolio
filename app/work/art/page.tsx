import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { art, artCV } from "@/content/content";

export const metadata: Metadata = { title: "Visual Art — Matthew Yu" };

// Ongoing category: the art gallery, an ongoing category under projects.
export default function ArtPage() {
  return (
    <main id="main" className="page">
      <SiteNav active="play" />

      <Link href="/play" className="back">
        ← play
      </Link>

      <div className="proj-head">
        <h1>Visual Art</h1>
        <p className="meta">ongoing · mixed media</p>
      </div>

      <div className="masonry">
        {art.map((p) => (
          <div key={p.src} className="ph">
            <Image
              src={p.src}
              alt="art"
              width={p.w}
              height={p.h}
              quality={60}
              sizes="(max-width: 640px) 46vw, 300px"
            />
          </div>
        ))}
      </div>

      {/* ---------- CV ---------- */}
      <section className="cv">
        <h2 className="section-label">Exhibitions</h2>
        <div className="cv-rows">
          {artCV.exhibitions.map((e) => (
            <p key={e.year + e.text} className="cv-row">
              <span className="year">{e.year}</span>
              <span className="text">{e.text}</span>
            </p>
          ))}
        </div>

        <h2 className="section-label">Published</h2>
        <div className="cv-rows">
          {artCV.published.map((e) => (
            <p key={e.year + e.text} className="cv-row">
              <span className="year">{e.year}</span>
              <span className="text">{e.text}</span>
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
