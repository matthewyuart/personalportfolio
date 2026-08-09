import Image from "next/image";
import CardFan from "@/components/CardFan";
import { treehacksCards, type Project } from "@/content/content";

// The case study itself — shared chrome-free article rendered inside the
// project card. Writing lives in content/content.ts (body + study arrays).
export default function ProjectArticle({ p }: { p: Project }) {
  return (
    <article className="proj">
      <div className="proj-head">
        <h1>{p.title}</h1>
      </div>

      {/* meta columns, Michelle-style: year / type / links */}
      <div className="proj-meta-grid">
        <div>
          <p className="k">Year</p>
          <p className="v">{p.year}</p>
        </div>
        <div>
          <p className="k">Type</p>
          <p className="v">{p.tag}</p>
        </div>
        {p.links && (
          <div>
            <p className="k">Links</p>
            <p className="v proj-links">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
            </p>
          </div>
        )}
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
        {p.study?.map((s) => (
          <section key={s.heading} className="study">
            <h2 className="study-h">{s.heading}</h2>
            {s.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </section>
        ))}
      </div>

      <div className="proj-images">
        {p.images.map((img) => (
          <div key={img.src} className="ph">
            <Image
              src={img.src}
              alt={p.title}
              width={img.w}
              height={img.h}
              sizes="(max-width: 640px) 92vw, 800px"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
