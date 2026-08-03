import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CardFan from "@/components/CardFan";
import { projects, playProjects, treehacksCards } from "@/content/content";

export function generateStaticParams() {
  return [...projects, ...playProjects].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = [...projects, ...playProjects].find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Matthew Yu` : "Matthew Yu" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // design projects and play projects share this route but page within
  // their own group and link back to their own section
  const inWork = projects.some((x) => x.slug === slug);
  const group = inWork ? projects : playProjects;
  const i = group.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const p = group[i];
  const prev = group[(i - 1 + group.length) % group.length];
  const next = group[(i + 1) % group.length];

  return (
    <main id="main" className="page">
      <SiteNav active={inWork ? "work" : "play"} />

      <Link href={inWork ? "/#projects" : "/play"} className="back">
        {inWork ? "← all projects" : "← play"}
      </Link>

      <div className="proj-head">
        <h1>{p.title}</h1>
        <p className="meta">
          {p.year} · {p.tag}
        </p>
      </div>

      {p.slug === "treehacks" && <CardFan back={treehacksCards.back} faces={treehacksCards.faces} />}

      {/* live deployment embedded in place — always shows the latest version */}
      {p.demo &&
        (p.demoStyle === "wide" ? (
          <div className="demo-wide">
            <iframe
              src={p.demo}
              title={`${p.title} — live`}
              loading="lazy"
              allow={p.demoAllow}
            />
          </div>
        ) : (
          <div className="demo-phone">
            <iframe src={p.demo} title={`${p.title} — live prototype`} loading="lazy" />
          </div>
        ))}

      <div className="proj-body">
        {p.body.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
        {p.list && (
          <ul>
            {p.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {p.links && (
          <p className="proj-links">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </p>
        )}
      </div>

      <div className="proj-images">
        {p.images.map((img) => (
          <div key={img.src} className="ph">
            <Image
              src={img.src}
              alt={p.title}
              width={img.w}
              height={img.h}
              sizes="(max-width: 640px) 92vw, 640px"
            />
          </div>
        ))}
      </div>

      <div className="pager">
        <Link href={`/work/${prev.slug}`}>← {prev.title}</Link>
        <Link href={`/work/${next.slug}`}>{next.title} →</Link>
      </div>
    </main>
  );
}
