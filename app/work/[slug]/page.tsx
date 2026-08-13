import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import ProjectDetail from "@/app/components/Homepage/ProjectDetail/ProjectDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

// Build-time static params — sabhi project pages pre-render honge
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Dream Byte Solutions`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}