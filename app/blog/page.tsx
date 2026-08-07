// app/blog/page.tsx
import { getPublishedBlogs, resolveImage } from "@/lib/api/blogs";
import { formatDisplayDate } from "@/lib/utils/blog";
import BlogPageClient, { type BlogListPost } from "./BlogPageClient";

export const metadata = {
  title: "Blog | Dream Byte Solutions",
  description:
    "Latest digital marketing, SEO, and web development insights from Dream Byte Solutions.",
};

// Admin publish kabhi bhi kar sakta hai, isliye always fresh fetch
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: BlogListPost[] = [];

  try {
    const blogs = await getPublishedBlogs();
    posts = blogs.map((b) => ({
      id: b._id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      image: resolveImage(b.coverImage),
      category: b.category,
      date: b.date,
      displayDate: formatDisplayDate(b.date),
    }));
  } catch (err) {
    console.error("Failed to load blogs:", err);
    posts = [];
  }

  return <BlogPageClient posts={posts} />;
}