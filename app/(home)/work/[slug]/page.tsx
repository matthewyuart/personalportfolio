import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectModal from "@/components/ProjectModal";
import ProjectArticle from "@/components/ProjectArticle";
import { projects, playProjects } from "@/content/content";

const all = () => [...projects, ...playProjects];

export function generateStaticParams() {
  return all().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = all().find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Matthew Yu` : "Matthew Yu" };
}

// Renders as a card over the home layout (which stays mounted beneath).
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = all().find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <ProjectModal>
      <ProjectArticle p={p} />
    </ProjectModal>
  );
}
