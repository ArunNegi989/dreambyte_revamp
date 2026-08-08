import { PortfolioProject } from "@/types/portfolio";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ success: boolean; count: number; data: PortfolioProject[] }>(res);
  return data.data;
}

export async function fetchPortfolioProjectById(id: string): Promise<PortfolioProject> {
  const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ success: boolean; data: PortfolioProject }>(res);
  return data.data;
}

export async function deletePortfolioProject(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/portfolio/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
}