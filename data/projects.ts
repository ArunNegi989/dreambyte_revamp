export type Project = {
  slug: string;
  title: string;
  category: string;
  client: string;
  year: string;
  services: string[];
  description: string;
  coverImage: string;
  gallery: string[];
};

/*
 * Placeholder Unsplash images — inhe apne real screenshots se replace karo:
 *   /projects/erika-henna-herbal/1.jpg, 2.jpg, ...
 * public/projects/<slug>/ folder me daal dena.
 */
export const PROJECTS: Project[] = [
  {
    slug: "erika-henna-herbal",
    title: "Welcome to Erika Henna Herbal",
    category: "E-Commerce · Branding",
    client: "Erika Henna Herbal",
    year: "2025",
    services: ["Next.js Development", "UI/UX Design", "E-Commerce Setup"],
    description:
      "Erika Henna Herbal ke liye humne ek full-fledged e-commerce platform banaya jo unki organic henna aur herbal product line ko showcase karta hai. Clean product catalog, fast checkout flow, aur mobile-first design ke saath brand ki natural aesthetic ko digitally translate kiya gaya.",
    coverImage:
      "https://images.unsplash.com/photo-1611073761742-bce90ccd60ae?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611073761742-bce90ccd60ae?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    slug: "gauraaj",
    title: "Welcome to Gauraaj",
    category: "E-Commerce · Organic Foods",
    client: "Gauraaj",
    year: "2025",
    services: ["Next.js Development", "Product Catalog", "Payment Integration"],
    description:
      "Gauraaj organic foods brand ke liye ek modern e-commerce store develop kiya, jisme dynamic product filtering, subscription-style ordering, aur smooth checkout experience diya gaya — takki customers ko farm-fresh products browse karna aasan lage.",
    coverImage:
      "https://images.unsplash.com/photo-1553787434-45e1d245bfbb?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553787434-45e1d245bfbb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    slug: "house-of-intimacy",
    title: "Welcome to House Of Intimacy",
    category: "E-Commerce · Lifestyle",
    client: "House Of Intimacy",
    year: "2025",
    services: ["Next.js Development", "Custom UI", "Secure Checkout"],
    description:
      "House Of Intimacy ke liye ek discreet aur elegant lifestyle e-commerce platform banaya, jisme privacy-focused UX, secure payment flow, aur premium product presentation par khaas focus rakha gaya.",
    coverImage:
      "https://images.unsplash.com/photo-1602952706017-f3cc19eb98af?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602952706017-f3cc19eb98af?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}