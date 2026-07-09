import Link from "next/link";
import Image from "next/image";
import SiteNav from "@/components/SiteNav";
import Sketchbook from "@/components/Sketchbook";
import HeroDown from "@/components/HeroDown";
import { site, about, projects, galleryRows, sketchbook, pic } from "@/content/content";

const footerImg = pic("/footer.png");

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

      {/* ---------- about (centered column) ---------- */}
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
      </section>

      {/* ---------- projects ---------- */}
      <section id="projects">
        <p className="section-label">{site.labels.projects}</p>
        <div className="rows">
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
          {/* ongoing categories: art & photography */}
          {galleryRows.map((g) => (
            <Link key={g.slug} href={`/work/${g.slug}`} className="row">
              <span className="year">{g.year}</span>
              <span className="title">{g.title}</span>
              <span className="blurb">{g.tag}</span>
              <span className="row-thumb" aria-hidden>
                <Image src={g.thumb.src} alt="" width={g.thumb.w} height={g.thumb.h} sizes="120px" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* full-bleed footer image (home only) */}
      <footer className="site-footer">
        <div className="site-footer-img">
          <Image
            src={footerImg.src}
            alt=""
            width={footerImg.w}
            height={footerImg.h}
            sizes="100vw"
          />
        </div>
        <p className="foot">{site.footer}</p>
      </footer>
    </main>
  );
}
