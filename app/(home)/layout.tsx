import Link from "next/link";
import Image from "next/image";
import { readdirSync } from "fs";
import { join } from "path";
import SiteNav from "@/components/SiteNav";
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

        {/* ---------- projects: full-bleed grid of screen recordings ---------- */}
        <section id="projects">
          <h2 className="section-label">{site.labels.projects}</h2>
          <div className="work-grid">
            {homeRows.map((r) => {
              const reel = reelFor(r.href);
              return (
                <Link key={r.href} href={r.href} className="work-card" scroll={false}>
                  <span className="shot">
                    {reel ? (
                      <video src={reel} poster={r.thumb.src} autoPlay muted loop playsInline aria-hidden />
                    ) : (
                      <Image
                        src={r.thumb.src}
                        alt=""
                        fill
                        quality={60}
                        sizes="(max-width: 640px) 92vw, (max-width: 1200px) 46vw, 560px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </span>
                  <span className="cap">
                    <span className="t">{r.title}</span>
                    <span className="n">
                      {r.year} · {r.tag}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="foot">{site.footer}</footer>
      </main>

      {/* a project card, when one is open */}
      {children}
    </>
  );
}
