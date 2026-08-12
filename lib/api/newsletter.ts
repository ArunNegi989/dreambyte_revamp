const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_BASE}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to subscribe.");
  }

  return data;
}