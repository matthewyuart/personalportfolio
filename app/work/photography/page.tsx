import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import PolaroidStack from "@/components/PolaroidStack";
import { photography } from "@/content/content";

export const metadata: Metadata = { title: "Photography — Matthew Yu" };

// Ongoing category: the polaroid stack as its own project page.
export default function PhotographyPage() {
  return (
    <main className="page">
      <SiteNav active="work" />

      <Link href="/#projects" className="back">
        ← all projects
      </Link>

      <div className="proj-head">
        <h1>Photography</h1>
        <p className="meta">ongoing · film + digital</p>
      </div>

      <PolaroidStack photos={photography} />
    </main>
  );
}
