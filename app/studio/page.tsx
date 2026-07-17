import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { site, studioRows, experiments } from "@/content/content";

export const metadata: Metadata = { title: "Studio — Matthew Yu" };

// The studio: art practice (fashion, film, galleries) + experiments.
// Detail pages stay at /work/[slug]; static apps live under /public/play
// and open directly, each carrying its own back button.
export default function StudioPage() {
  return (
    <main className="page">
      <SiteNav active="studio" />

      <p className="section-label">{site.labels.art}</p>
      <div className="play-list">
        {studioRows.map((g) => (
          <Link key={g.href} href={g.href} className="play-card">
            <div className="thumb">
              <Image
                src={g.thumb.src}
                alt={g.title}
                fill
                sizes="(max-width: 640px) 92vw, 300px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="cap">
              <span className="t">{g.title}</span>
              <span className="n">
                {g.year} · {g.tag}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="section-label">{site.labels.experiments}</p>
      <div className="play-list">
        {experiments.map((e) => (
          <Link key={e.title} href={e.href} className="play-card">
            <div className="thumb">
              <Image
                src={e.thumb}
                alt={e.title}
                fill
                sizes="(max-width: 640px) 92vw, 300px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="cap">
              <span className="t">{e.title}</span>
              <span className="n">{e.note}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
