import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PolaroidStack from "@/components/PolaroidStack";
import { photography } from "@/content/content";

export const metadata: Metadata = { title: "Photography — Matthew Yu" };

// Ongoing category: the polaroid stack as its own project page.
export default function PhotographyPage() {
  return (
    <main id="main" className="page">
      <SiteNav active="play" />

      <Link href="/play" className="back">
        ← play
      </Link>

      <div className="proj-head">
        <h1>Photography</h1>
        <p className="meta">ongoing · film + digital</p>
      </div>

      <PolaroidStack photos={photography} />

      <SiteFooter />
    </main>
  );
}
