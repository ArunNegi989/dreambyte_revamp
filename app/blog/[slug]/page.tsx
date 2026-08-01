// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import SingleBlogPost from "@/app/components/SingleBlogPost/index";
import {
  BLOG_POSTS,
  getPostBySlug,
  getRelatedPosts,
  getRecentPosts,
} from "@/data/blogPosts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render every post at build time since the data is static.
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Dream Byte Solutions Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const relatedPosts = getRelatedPosts(post, 3);
  const recentPosts = getRecentPosts(post.id, 4);

  const currentIndex = BLOG_POSTS.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : undefined;

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