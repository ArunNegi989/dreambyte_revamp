const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

export function getAssetUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}