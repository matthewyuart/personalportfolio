import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Sketchbook from "@/components/Sketchbook";
import HeroDown from "@/components/HeroDown";
import { site, about, homeRows, sketchbook } from "@/content/content";

// One page: hero sketchbook → about → projects → art → photography.
export default function Home() {
  return (
    <main id="main" className="page home">
      <SiteNav active="work" />

      {/* ---------- hero: fills the first screen; about starts below the fold ---------- */}
      <section id="sketchbook" className="hero">
        <p className="hero-kicker">{about.eyebrow}</p>
        <h1 className="hero-name">{site.name}</h1>
        <Sketchbook pages={sketchbook} />
        <HeroDown />
      </section>

      {/* ---------- about (bio left, small headshot right) ---------- */}
      <section id="about" className="about">
        <div className="about-text">
          <p className="bio">
            {about.bio.map((seg, i) =>
              seg.href ? (
                <a key={i} href={seg.href} target="_blank" rel="noreferrer" className="bio-link">
                  {seg.text}
                </a>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </p>
        </div>
        <div className="headshot">
          <Image
            src={about.headshot.src}
            alt={site.name}
            width={about.headshot.w}
            height={about.headshot.h}
            sizes="(max-width: 560px) 96px, 132px"
          />
        </div>
      </section>

      {/* ---------- projects ---------- */}
      <section id="projects">
        <h2 className="section-label">{site.labels.projects}</h2>
        {/* grid of cards — live projects loop a short screen recording,
            the rest hold a still */}
        <div className="work-grid">
          {homeRows.map((r) => (
            <Link key={r.href} href={r.href} className="work-card">
              <span className="shot">
                {r.reel ? (
                  <video src={r.reel} poster={r.thumb.src} autoPlay muted loop playsInline aria-hidden />
                ) : (
                  <Image
                    src={r.thumb.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 440px"
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
          ))}
        </div>
      </section>

      <footer className="foot">{site.footer}</footer>
    </main>
  );
}
