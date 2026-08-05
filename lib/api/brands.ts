import { Brand } from "@/types/brand";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch(`${BASE_URL}/brands`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ brands: Brand[] }>(res);
  return data.brands;
}

export async function fetchBrandById(id: string): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/brands/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await handleResponse<{ brand: Brand }>(res);
  return data.brand;
}

function buildFormData(values: {
  name: string;
  alt: string;
  row: string;
  order: number;
  isActive: boolean;
  logoFile: File | null;
}) {
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("alt", values.alt);
  fd.append("row", values.row);
  fd.append("order", String(values.order));
  fd.append("isActive", String(values.isActive));
  if (values.logoFile) {
    fd.append("logo", values.logoFile);
  }
  return fd;
}

export async function createBrand(values: {
  name: string;
  alt: string;
  row: string;
  order: number;
  isActive: boolean;
  logoFile: File | null;
}): Promise<Brand> {
  const fd = buildFormData(values);
  const res = await fetch(`${BASE_URL}/brands`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = await handleResponse<{ brand: Brand }>(res);
  return data.brand;
}

export async function updateBrand(
  id: string,
  values: {
    name: string;
    alt: string;
    row: string;
    order: number;
    isActive: boolean;
    logoFile: File | null;
  }
): Promise<Brand> {
  const fd = buildFormData(values);
  const res = await fetch(`${BASE_URL}/brands/${id}`, {
    method: "PUT",
    credentials: "include",
    body: fd,
  });
  const data = await handleResponse<{ brand: Brand }>(res);
  return data.brand;
}

export async function deleteBrand(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/brands/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse<{ message: string }>(res);
}