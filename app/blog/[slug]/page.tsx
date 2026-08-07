// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import SingleBlogPost from "@/app/components/SingleBlogPost/index";
import { getBlogBySlug, getPublishedBlogs, resolveImage } from "@/lib/api/blogs";
import { getRelatedBlogs, getRecentBlogs } from "@/lib/utils/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static params ab build time pe backend se — agar backend build ke waqt down
// ho to bhi build fail na ho, isliye try/catch ke saath empty array fallback
export async function generateStaticParams() {
  try {
    const blogs = await getPublishedBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const post = await getBlogBySlug(slug);
    return {
      title: post.metaTitle || `${post.title} | Dream Byte Solutions Blog`,
      description: post.metaDescription || post.excerpt,
      keywords: post.metaKeywords,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [resolveImage(post.coverImage)],
      },
    };
  } catch {
    return {};
  }
}

// Naye posts turant reflect hone chahiye — force-dynamic
export const dynamic = "force-dynamic";

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    return notFound();
  }

  let allBlogs: Awaited<ReturnType<typeof getPublishedBlogs>> = [];
  try {
    allBlogs = await getPublishedBlogs();
  } catch (err) {
    console.error("Failed to load blogs for related/recent:", err);
  }

  const relatedPosts = getRelatedBlogs(allBlogs, post, 3);
  const recentPosts = getRecentBlogs(allBlogs, post._id, 4);

  const sorted = [...allBlogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const currentIndex = sorted.findIndex((p) => p._id === post._id);
  const prevPost = currentIndex > 0 ? sorted[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : undefined;

  return (
    <SingleBlogPost
      post={post}
      relatedPosts={relatedPosts}
      recentPosts={recentPosts}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
}