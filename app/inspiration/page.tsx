import Image from "next/image";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Spotlight from "@/components/Spotlight";
import { inspiration } from "@/content/content";

export const metadata: Metadata = { title: "Inspiration — Matthew Yu" };

// A single full-bleed image. That's the whole page, on purpose.
export default function InspirationPage() {
  return (
    <main className="page dark">
      <SiteNav active="inspiration" />
      <div className="inspo">
        <Image
          src={inspiration.src}
          alt="inspiration"
          width={inspiration.w}
          height={inspiration.h}
          sizes="100vw"
          priority
        />
      </div>
      <Spotlight />
    </main>
  );
}
