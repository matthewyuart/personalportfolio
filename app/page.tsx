import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Sketchbook from "@/components/Sketchbook";
import HeroDown from "@/components/HeroDown";
import { site, about, projects, oscillonRow, sketchbook } from "@/content/content";

// One page: hero sketchbook → about → projects → art → photography.
export default function Home() {
  return (
    <main className="page home">
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
        <p className="section-label">{site.labels.projects}</p>
        <div className="rows">
          {/* oscillon: newest project; the row opens the app itself */}
          <Link href={oscillonRow.href} className="row">
            <span className="year">{oscillonRow.year}</span>
            <span className="title">{oscillonRow.title}</span>
            <span className="blurb">{oscillonRow.tag}</span>
            <span className="row-thumb" aria-hidden>
              <Image
                src={oscillonRow.thumb.src}
                alt=""
                width={oscillonRow.thumb.w}
                height={oscillonRow.thumb.h}
                sizes="120px"
              />
            </span>
          </Link>
          {projects.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="row">
              <span className="year">{p.year}</span>
              <span className="title">{p.title}</span>
              <span className="blurb">{p.tag}</span>
              <span className="row-thumb" aria-hidden>
                <Image
                  src={p.images[0].src}
                  alt=""
                  width={p.images[0].w}
                  height={p.images[0].h}
                  sizes="120px"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="foot">{site.footer}</footer>
    </main>
  );
}
