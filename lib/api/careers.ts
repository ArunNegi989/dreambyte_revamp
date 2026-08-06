import { Career, CareerFormValues } from "@/types/career";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

// Admin list ke liye — active + inactive dono roles laata hai
export async function fetchCareers(): Promise<Career[]> {
  const res = await fetch(`${BASE_URL}/careers?all=true`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ careers: Career[] }>(res);
  return data.careers;
}

export async function fetchCareerById(id: string): Promise<Career> {
  const res = await fetch(`${BASE_URL}/careers/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ career: Career }>(res);
  return data.career;
}

// Public job-detail page ke liye (slug-based, sirf active roles)
export async function fetchCareerBySlug(slug: string): Promise<Career> {
  const res = await fetch(`${BASE_URL}/careers/slug/${slug}`, {
    cache: "no-store",
  });
  const data = await handleResponse<{ career: Career }>(res);
  return data.career;
}

export async function createCareer(values: CareerFormValues): Promise<Career> {
  const res = await fetch(`${BASE_URL}/careers`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await handleResponse<{ career: Career }>(res);
  return data.career;
}

export async function updateCareer(id: string, values: CareerFormValues): Promise<Career> {
  const res = await fetch(`${BASE_URL}/careers/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = await handleResponse<{ career: Career }>(res);
  return data.career;
}

export async function deleteCareer(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/careers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
}

// existing imports/functions ke sath ye add karo:

// Public career page ke liye — sirf active roles
export async function fetchActiveCareers(): Promise<Career[]> {
  const res = await fetch(`${BASE_URL}/careers`, {
    cache: "no-store",
  });
  const data = await handleResponse<{ careers: Career[] }>(res);
  return data.careers;
}