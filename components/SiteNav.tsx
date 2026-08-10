"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icons";
import { site, about } from "@/content/content";

// Shared fixed header: name left; nav + social links right. "work" scrolls
// to the projects grid WITHOUT leaving a #hash in the URL — a lingering
// hash makes the browser re-anchor on every reload/HMR, which read as the
// page "randomly scrolling down".
export default function SiteNav({
  active,
}: {
  active?: "work" | "about" | "play" | "inspiration";
}) {
  const pathname = usePathname();

  const jumpProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return; // from other routes let the browser navigate
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "/");
  };

  return (
    <header className="top">
      <Link href="/" className="name">
        {site.name}
      </Link>
      <nav>
        <a href="/#projects" onClick={jumpProjects} aria-current={active === "work" ? "page" : undefined}>
          {site.nav.work}
        </a>
        <Link href="/play" aria-current={active === "play" ? "page" : undefined}>
          {site.nav.play}
        </Link>
        <Link href="/about" aria-current={active === "about" ? "page" : undefined}>
          about
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
