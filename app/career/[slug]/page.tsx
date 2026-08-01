import { notFound } from 'next/navigation';
import { ROLES, getRoleBySlug } from '@/data/roles';
import JobDetail from '@/app/components/JobDetail/index';

// Pre-renders one static page per role slug at build time.
export function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) return { title: 'Role not found — Dream Byte Solutions' };
  return {
    title: `${role.title} — Careers at Dream Byte Solutions`,
    description: role.tagline,
  };
}

// Next.js 15+: `params` is a Promise and must be awaited before use.
export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRoleBySlug(slug);

  if (!role) {
    notFound();
  }

  return <JobDetail role={role!} />;
}