const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function submitApplication(payload: {
  name: string;
  email: string;
  phone: string;
  message: string;
  slug: string;
  jobTitle: string;
  resume: File;
}): Promise<void> {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("email", payload.email);
  fd.append("phone", payload.phone);
  fd.append("message", payload.message);
  fd.append("slug", payload.slug);
  fd.append("jobTitle", payload.jobTitle);
  fd.append("resume", payload.resume);

  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Failed to submit application");
  }
}