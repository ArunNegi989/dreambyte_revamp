export type PortfolioCategory =
  | "Web Development"
  | "Graphic Designing"
  | "Digital Marketing"
  | "Branding";

export interface PortfolioProject {
  _id: string;
  title: string;
  shortDesc: string;
  description: string;
  images: string[];
  category: PortfolioCategory;
  subCategory: string;
  createdAt?: string;
  updatedAt?: string;
}