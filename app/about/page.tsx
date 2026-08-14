import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { site, about } from "@/content/content";

export const metadata: Metadata = { title: "About — Matthew Yu" };

// About: the bio (left) with the headshot centered beside it.
export default function AboutPage() {
  return (
    <main id="main" className="page">
      <SiteNav active="about" />

      <section className="about about-page">
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

      <SiteFooter />
    </main>
  );
}
