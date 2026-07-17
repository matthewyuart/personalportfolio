"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icons";
import { site, sections, about } from "@/content/content";

// Shared sticky header: name left; nav + social links right. "work" opens a
// CSS-only dropdown (hover on desktop, tap/focus on touch) jumping to the
// home sections. Section jumps scroll WITHOUT leaving a #hash in the URL —
// a lingering hash makes the browser re-anchor on every reload/HMR, which
// read as the page "randomly scrolling down".
export default function SiteNav({ active }: { active?: "work" | "studio" | "inspiration" }) {
  const pathname = usePathname();

  const jump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return; // from /play etc. let the browser navigate
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "/");
    e.currentTarget.blur(); // close the focus-within dropdown
  };

  return (
    <header className="top">
      <Link href="/" className="name">
        {site.name}
      </Link>
      <nav>
        <div className="menu">
          <a href="/#about" onClick={jump("about")} aria-current={active === "work" ? "page" : undefined}>
            {site.nav.work} ▾
          </a>
          <div className="dropdown">
            {sections.map((s) => (
              <a key={s.id} href={`/#${s.id}`} onClick={jump(s.id)}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <Link href="/studio" aria-current={active === "studio" ? "page" : undefined}>
          {site.nav.studio}
        </Link>
        <Link href="/inspiration" aria-current={active === "inspiration" ? "page" : undefined}>
          {site.nav.inspiration}
        </Link>
        <div className="top-socials">
          {about.socials.map((b) => (
            <a
              key={b.type}
              href={b.href}
              target={b.type === "email" ? undefined : "_blank"}
              rel="noreferrer"
              className="icon-btn"
              aria-label={b.label}
            >
              <Icon type={b.type} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
