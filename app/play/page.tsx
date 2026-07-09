import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { site, experiments } from "@/content/content";

export const metadata: Metadata = { title: "Play — Matthew Yu" };

// Experiments index. Static apps live under /public/play and open directly;
// each carries its own "← play" back button.
export default function PlayPage() {
  return (
    <main className="page">
      <SiteNav active="play" />

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
