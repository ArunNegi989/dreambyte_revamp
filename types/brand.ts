export type BrandRow = "rowOne" | "rowTwo";

export interface Brand {
  _id: string;
  name: string;
  alt: string;
  logo: string; // full URL returned by backend (Cloudinary etc.)
  row: BrandRow;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandFormValues {
  name: string;
  alt: string;
  row: BrandRow;
  order: number;
  isActive: boolean;
  logoFile: File | null; // new file selected by user (optional on edit)
}