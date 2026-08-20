import { Fragment } from "react";
import Image from "next/image";
import CardFan from "@/components/CardFan";
import TweetEmbed from "@/components/TweetEmbed";
import { treehacksCards, type Project } from "@/content/content";

// The case study itself — rendered inside the project card. Writing lives
// in content/content.ts (body + study arrays). Layout: title, meta columns,
// hero image, then sections split through the middle (label left, text
// right) with the remaining images between them.
export default function ProjectArticle({ p }: { p: Project }) {
  const [hero, ...rest] = p.images;
  const sections: { heading: string; body: string[]; list?: string[] }[] = [
    { heading: "Overview", body: p.body, list: p.list },
    ...(p.study ?? []),
  ];
  const leftover = rest.slice(sections.length);

  return (
    <article className="proj">
      <div className="proj-head">
        <h1>{p.title}</h1>
      </div>

      {/* meta columns: year / type / links */}
      <div className="proj-meta-grid">
        <div>
          <p className="k">Year</p>
          <p className="v">{p.year}</p>
        </div>
        <div>
          <p className="k">Type</p>
          <p className="v">{p.tag}</p>
        </div>
        {p.stack && (
          <div>
            <p className="k">Stack</p>
            <p className="v">{p.stack}</p>
          </div>
        )}
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

      {p.tweet ? (
        <TweetEmbed url={p.tweet} />
      ) : (
        hero && (
          <div className="proj-fig">
            <Image src={hero.src} alt={p.title} width={hero.w} height={hero.h} sizes="(max-width: 640px) 92vw, 800px" />
          </div>
        )
      )}

      {sections.map((s, i) => (
        <Fragment key={s.heading}>
          <section className="split">
            <h2 className="study-h">{s.heading}</h2>
            <div className="split-body">
              {s.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          {rest[i] && (
            <div className={rest[i].h > rest[i].w * 1.15 ? "proj-fig proj-fig--tall" : "proj-fig"}>
              <Image
                src={rest[i].src}
                alt={p.title}
                width={rest[i].w}
                height={rest[i].h}
                sizes="(max-width: 640px) 92vw, 800px"
              />
            </div>
          )}
        </Fragment>
      ))}

      {leftover.length > 0 && (
        <div className="proj-images">
          {leftover.map((img) => (
            <div key={img.src} className="ph">
              <Image src={img.src} alt={p.title} width={img.w} height={img.h} sizes="(max-width: 640px) 92vw, 640px" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
