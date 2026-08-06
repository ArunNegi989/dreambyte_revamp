import { ContactMessage } from "@/types/contact";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }
  return data;
}

// Public — contact form submit
export async function submitContactForm(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
}

// Admin — fetch all messages
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${BASE_URL}/contact`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ messages: ContactMessage[] }>(res);
  return data.messages;
}

// Admin — mark as read
export async function markContactAsRead(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/contact/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  await handleResponse(res);
}

// Admin — delete
export async function deleteContactMessage(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/contact/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
}