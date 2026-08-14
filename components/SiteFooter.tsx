import Link from "next/link";
import { site, about } from "@/content/content";

// Michelle-style footer: hairline rule, © line left, two link columns right
// (contact + site). Dark pages restyle automatically via the CSS variables.
export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <p className="site-foot-c">{site.footer}</p>
      <nav className="site-foot-cols" aria-label="footer">
        <div>
          {about.socials.map((s) => (
            <a
              key={s.type}
              href={s.href}
              target={s.type === "email" ? undefined : "_blank"}
              rel="noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div>
          <Link href="/">Home</Link>
          <a href="/#projects">Work</a>
          <Link href="/play">Play</Link>
          <Link href="/about">About</Link>
          <Link href="/inspiration">Inspiration</Link>
        </div>
      </nav>
    </footer>
  );
}
