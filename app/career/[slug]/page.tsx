import { notFound } from 'next/navigation';
import JobDetail from '@/app/components/JobDetail/index';
import { Career } from '@/types/career';

// Static build ke time slugs generate nahi kar sakte kyunki data backend/DB se aata hai —
// isliye dynamic rendering use karenge.
export const dynamic = 'force-dynamic';

async function getCareer(slug: string): Promise<Career | null> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const res = await fetch(`${BASE_URL}/careers/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.career as Career;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return { title: 'Role not found — Dream Byte Solutions' };
  return {
    title: `${career.title} — Careers at Dream Byte Solutions`,
    description: career.tagline,
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    notFound();
  }

  return <JobDetail role={career!} />;
}