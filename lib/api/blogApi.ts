// lib/api/blogApi.ts
// Client-only debug utility. Server Components ka fetch browser Network tab
// me kabhi nahi dikhta (wo server process me hota hai) — agar tumhe browser
// DevTools > Network tab me actual request/response dekhna hai (headers,
// status, payload), to isko kisi bhi "use client" component/page me use karo.
//
// Usage example (temporary debug page):
//   "use client";
//   import { useEffect, useState } from "react";
//   import { debugFetchPublishedBlogs } from "@/lib/api/blogApi";
//
//   export default function DebugPage() {
//     const [data, setData] = useState(null);
//     useEffect(() => { debugFetchPublishedBlogs().then(setData); }, []);
//     return <pre>{JSON.stringify(data, null, 2)}</pre>;
//   }

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000/api";

export const CLIENT_BASE_URL = RAW_BASE.replace(/\/api\/?$/, "");

async function clientFetch<T = any>(path: string): Promise<T> {
  const url = `${RAW_BASE}${path}`;
  console.log("[blogApi][client] requesting:", url);

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
  });

  console.log("[blogApi][client] status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("[blogApi][client] error body:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  const json = await res.json();
  console.log("[blogApi][client] response:", json);
  return json;
}

export async function debugFetchPublishedBlogs() {
  const json = await clientFetch("/blogs");
  return json.data;
}

export async function debugFetchBlogBySlug(slug: string) {
  const json = await clientFetch(`/blogs/slug/${slug}`);
  return json.data;
}

/** Quick sanity check: is NEXT_PUBLIC_API_URL sahi set hai ya nahi */
export function debugPrintConfig() {
  console.log("[blogApi] NEXT_PUBLIC_API_URL env:", process.env.NEXT_PUBLIC_API_URL);
  console.log("[blogApi] Resolved RAW_BASE:", RAW_BASE);
  console.log("[blogApi] Resolved BASE_URL (for images):", CLIENT_BASE_URL);
}