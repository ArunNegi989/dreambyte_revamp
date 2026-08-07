// lib/utils/blog.ts
import { Blog, BlogSection } from "@/types/blog";

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Rough reading time based on word count across text-bearing blocks */
export function calcReadTime(content: BlogSection[]): number {
  const WORDS_PER_MIN = 200;
  let words = 0;

  content.forEach((block) => {
    if (block.text) words += block.text.trim().split(/\s+/).filter(Boolean).length;
    if (block.listItems) {
      words += block.listItems.join(" ").trim().split(/\s+/).filter(Boolean).length;
    }
    if (block.tableRows) {
      words += block.tableRows.flat().join(" ").trim().split(/\s+/).filter(Boolean).length;
    }
  });

  return Math.max(1, Math.round(words / WORDS_PER_MIN));
}

export function getInitials(name: string): string {
  if (!name) return "DB";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Convert a YouTube/Vimeo watch/share URL into an embeddable iframe src */
export function getEmbedUrl(url: string): string {
  if (!url) return "";
  try {
    const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
  } catch {
    return url;
  }
}

/** Same-category posts, excluding current, newest first */
export function getRelatedBlogs(all: Blog[], current: Blog, limit = 3): Blog[] {
  return all
    .filter((b) => b._id !== current._id && b.category === current.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/** Most recent posts, excluding current */
export function getRecentBlogs(all: Blog[], currentId: string, limit = 4): Blog[] {
  return all
    .filter((b) => b._id !== currentId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}