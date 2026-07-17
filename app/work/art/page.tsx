import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { art } from "@/content/content";

export const metadata: Metadata = { title: "Visual Art — Matthew Yu" };

// Ongoing category: the art gallery, listed under the studio's art section.
export default function ArtPage() {
  return (
    <main className="page">
      <SiteNav active="studio" />

      <Link href="/studio" className="back">
        ← studio
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
              sizes="(max-width: 640px) 46vw, 300px"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
