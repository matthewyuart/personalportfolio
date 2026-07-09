import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import CardFan from "@/components/CardFan";
import { projects, treehacksCards } from "@/content/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Matthew Yu` : "Matthew Yu" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="page">
      <SiteNav active="work" />

      <Link href="/#projects" className="back">
        ← all projects
      </Link>

      <div className="proj-head">
        <h1>{p.title}</h1>
        <p className="meta">
          {p.year} · {p.tag}
        </p>
      </div>

      {p.slug === "treehacks" && <CardFan back={treehacksCards.back} faces={treehacksCards.faces} />}

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
