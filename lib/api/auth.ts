import { AdminUser } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function checkRegisterStatus(): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth/register/status`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ adminExists: boolean }>(res);
  return data.adminExists;
}

export async function registerAdmin(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ user: AdminUser }>(res);
  return data.user;
}

export async function loginAdmin(payload: {
  email: string;
  password: string;
}): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<{ user: AdminUser }>(res);
  return data.user;
}

export async function logoutAdmin(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  await handleResponse(res);
}

export async function fetchMe(): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ user: AdminUser }>(res);
  return data.user;
}