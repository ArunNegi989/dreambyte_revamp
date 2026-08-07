// lib/api/blogs.ts
// Self-contained — creates its own axios instance so this file has no
// dependency on an unresolved "@/lib/api" module. If your project already
// has a shared axios instance elsewhere (with auth interceptors etc.),
// swap the `axios.create(...)` block below for an import of that instance
// instead — everything else in this file stays the same.

import axios from "axios";
import {
  Blog,
  BlogFormValues,
  BlogFormFiles,
  BlogSection,
  BlogStatus,
} from "@/types/blog";

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000/api";

// Origin without the trailing /api — used to resolve relative /uploads/... paths
export const BASE_URL = RAW_BASE.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: RAW_BASE,
  withCredentials: true, // sends the auth cookie used by protect/isAdmin middleware
});

export default api;

// ---------- Helpers ----------

/** Resolve a possibly-relative /uploads/... path to an absolute URL */
export function resolveImage(src?: string): string {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("blob:")) return src;
  return `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

/** Strip the absolute base URL back off before saving (edit page pattern) */
export function relativizeImage(src: string): string {
  return src.replace(BASE_URL, "");
}

/**
 * Builds the multipart FormData for create/update, matching the
 * cleanContent logic used in the admin add-new / edit pages:
 * - block.images with a matching File get isFile:true + pushed into contentImages
 * - block.images without a File keep their src (relativized if editing)
 * - every other block type only sends the fields relevant to it
 */
export function buildBlogFormData(
  values: BlogFormValues,
  files: BlogFormFiles = {},
  opts: { relativizeExistingImages?: boolean } = {}
): FormData {
  const fd = new FormData();

  fd.append("title", values.title);
  fd.append("slug", values.slug);
  fd.append("excerpt", values.excerpt);
  fd.append("date", values.date);
  fd.append("author", values.author);
  if (values.authorRole !== undefined) fd.append("authorRole", values.authorRole);
  fd.append("category", values.category);
  fd.append("tags", JSON.stringify(values.tags));
  fd.append("status", values.status);

  fd.append("metaTitle", values.metaTitle || values.title);
  fd.append("metaDescription", values.metaDescription || values.excerpt);
  fd.append("metaKeywords", JSON.stringify(values.metaKeywords));

  if (files.coverImageFile) {
    fd.append("coverImage", files.coverImageFile);
  }

  const contentImages: File[] = [];
  const contentImageFiles = files.contentImageFiles ?? {};

  const cleanContent = values.content.map((block: BlogSection) => {
    if (block.type === "images") {
      return {
        type: block.type,
        imageLayout: block.imageLayout,
        images: block.images?.map((img) => {
          const file = contentImageFiles[img.id];
          if (file) {
            contentImages.push(file);
            return { isFile: true, caption: img.caption, altText: img.altText };
          }
          const src = opts.relativizeExistingImages ? relativizeImage(img.src) : img.src;
          return { src, caption: img.caption, altText: img.altText };
        }),
      };
    }
    if (block.type === "list") {
      return { type: block.type, listType: block.listType, listItems: block.listItems };
    }
    if (block.type === "quote") {
      return { type: block.type, text: block.text, quoteAuthor: block.quoteAuthor };
    }
    if (block.type === "code") {
      return { type: block.type, text: block.text, codeLanguage: block.codeLanguage };
    }
    if (block.type === "video") {
      return { type: block.type, videoUrl: block.videoUrl, videoCaption: block.videoCaption };
    }
    if (block.type === "table") {
      return { type: block.type, tableHeaders: block.tableHeaders, tableRows: block.tableRows };
    }
    if (block.type === "callout") {
      return {
        type: block.type,
        text: block.text,
        calloutVariant: block.calloutVariant,
        calloutTitle: block.calloutTitle,
      };
    }
    if (block.type === "spacer") {
      return { type: block.type, spacerHeight: block.spacerHeight };
    }
    return { type: block.type, text: block.text };
  });

  fd.append("content", JSON.stringify(cleanContent));
  contentImages.forEach((file) => fd.append("contentImages", file));

  return fd;
}

// ---------- Reads ----------

/** Admin — all blogs (Draft + Published). GET /blogs/get-all */
export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const res = await api.get("/blogs/get-all");
  return res.data.data;
}

/** Public — Published only. GET /blogs */
export async function getPublishedBlogs(): Promise<Blog[]> {
  const res = await api.get("/blogs");
  return res.data.data;
}

/** Admin — single blog by id. GET /blogs/get-single/:id */
export async function getSingleBlog(id: string): Promise<Blog> {
  const res = await api.get(`/blogs/get-single/${id}`);
  return res.data.data;
}

/** Public — single published blog by slug. GET /blogs/slug/:slug */
export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await api.get(`/blogs/slug/${slug}`);
  return res.data.data;
}

// ---------- Writes ----------

/** POST /blogs/create */
export async function createBlog(
  values: BlogFormValues,
  files: BlogFormFiles = {}
): Promise<Blog> {
  const fd = buildBlogFormData(values, files);
  const res = await api.post("/blogs/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

/** PUT /blogs/update/:id */
export async function updateBlog(
  id: string,
  values: BlogFormValues,
  files: BlogFormFiles = {}
): Promise<Blog> {
  const fd = buildBlogFormData(values, files, { relativizeExistingImages: true });
  const res = await api.put(`/blogs/update/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

/** Quick status toggle used on the list page. PUT /blogs/update/:id */
export async function updateBlogStatus(id: string, status: BlogStatus): Promise<Blog> {
  const res = await api.put(`/blogs/update/${id}`, { status });
  return res.data.data;
}

/** DELETE /blogs/delete/:id */
export async function deleteBlog(id: string): Promise<void> {
  await api.delete(`/blogs/delete/${id}`);
}