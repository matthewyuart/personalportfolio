import Link from "next/link";
import Image from "next/image";
import { readdirSync } from "fs";
import { join } from "path";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reel from "@/components/Reel";
import Sketchbook from "@/components/Sketchbook";
import HeroDown from "@/components/HeroDown";
import { site, about, homeRows, sketchbook } from "@/content/content";

// The home page IS this layout (Michelle Liu's pattern): project pages at
// /work/[slug] render as `children` — a card over the page — so the
// sketchbook and scroll position survive opening and closing a project.

// Any file public/work/reels/<name>.mp4 (name = last href segment) becomes
// that card's looping screen recording — computed at build time, so adding
// a recording is just dropping a file in.
const reelFiles = (() => {
  try {
    return new Set(readdirSync(join(process.cwd(), "public/work/reels")));
  } catch {
    return new Set<string>();
  }
})();
const reelFor = (href: string) => {
  const name = `${href.split("/").pop()}.mp4`;
  return reelFiles.has(name) ? `/work/reels/${name}` : undefined;
};

// one grid tile; `aspect` (when set) crops the cover to the reference layout
const workCard = (r: (typeof homeRows)[number]) => {
  const reel = reelFor(r.href);
  return (
    <Link key={r.href} href={r.href} className="work-card" scroll={false}>
      <span className="shot" style={{ aspectRatio: r.aspect ?? `${r.thumb.w} / ${r.thumb.h}` }}>
        {reel ? (
          <Reel src={reel} poster={r.thumb.src} />
        ) : (
          <Image
            src={r.thumb.src}
            alt=""
            fill
            quality={60}
            sizes="(max-width: 700px) 92vw, 760px"
            style={{ objectFit: "cover" }}
          />
        )}
        <span className="cap">
          <span className="t">{r.title}</span>
          <span className="n">
            {r.year} · {r.tag}
          </span>
        </span>
      </span>
    </Link>
  );
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" className="page home">
        <SiteNav active="work" />

        {/* ---------- hero: fills the first screen ---------- */}
        <section id="sketchbook" className="hero">
          <p className="hero-kicker">{about.eyebrow}</p>
          <h1 className="hero-name">{site.name}</h1>
          <Sketchbook pages={sketchbook} />
          <HeroDown />
        </section>

        {/* ---------- projects: two staggered columns + one wide card ---------- */}
        <section id="projects">
          <h2 className="section-label">{site.labels.projects}</h2>
          <div className="work-grid">
            <div className="wg-col">{homeRows.slice(0, 3).map(workCard)}</div>
            <div className="wg-col">{homeRows.slice(3, 6).map(workCard)}</div>
          </div>
          <div className="work-wide">{homeRows.slice(6).map(workCard)}</div>
        </section>

        <SiteFooter />
      </main>

      {/* a project card, when one is open */}
      {children}
    </>
  );
}
