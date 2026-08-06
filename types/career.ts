export type Dept = "Engineering" | "Marketing" | "Sales" | "Design";

export interface Career {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  dept: Dept;
  type: string; // e.g. "Full-time", "Internship"
  location: string;
  date: string; // display string, e.g. "Aug 2026"
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerFormValues {
  slug: string;
  title: string;
  tagline: string;
  dept: Dept;
  type: string;
  location: string;
  date: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  isActive: boolean;
}