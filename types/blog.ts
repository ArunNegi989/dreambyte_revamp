// types/blog.ts
// Matches the actual Mongoose schema (models/Blog.js) + block-based content
// system used in add-new / edit blog admin pages.

export type SectionType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "images"
  | "divider"
  | "list"
  | "quote"
  | "code"
  | "video"
  | "table"
  | "callout"
  | "spacer"
  | "html";

export type ImageLayout = "single" | "two-col" | "three-col" | "wide";
export type ListType = "unordered" | "ordered";
export type CalloutVariant = "info" | "warning" | "success" | "tip" | "danger";
export type BlogStatus = "Draft" | "Published";

export interface BlogImage {
  id: string;
  src: string;
  caption: string;
  altText?: string;
  /** UI-only scratch field used while typing a URL, never sent to API */
  tempUrlInput?: string;
}

/**
 * One content block. Only the fields relevant to `type` are populated —
 * mirrors the shape saved by resolveContentImages() on the backend and by
 * the cleanContent mapping used in the admin forms.
 */
export interface BlogSection {
  id: string;
  type: SectionType;
  text?: string;
  listType?: ListType;
  listItems?: string[];
  quoteAuthor?: string;
  codeLanguage?: string;
  videoUrl?: string;
  videoCaption?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  calloutVariant?: CalloutVariant;
  calloutTitle?: string;
  spacerHeight?: number;
  images?: BlogImage[];
  imageLayout?: ImageLayout;
}

/**
 * Raw blog document as returned by the API (mirrors models/Blog.js).
 */
export interface Blog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date string
  author: string;
  authorRole: string;
  category: string;
  coverImage: string;
  tags: string[];
  content: BlogSection[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Normalised shape used by the blog list page table/cards.
 */
export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string; // pre-formatted display date
  author?: string;
  category: string;
  image: string; // resolved absolute URL
  tags?: string[];
  sectionCount: number;
  status: BlogStatus;
}

/**
 * Payload shape used when creating/updating a blog from the admin forms.
 */
export interface BlogFormValues {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole?: string;
  category: string;
  coverImage: string; // preview URL (blob: or resolved http URL)
  tags: string[];
  content: BlogSection[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  status: BlogStatus;
}

/** Extra data the form component tracks alongside BlogFormValues */
export interface BlogFormFiles {
  coverImageFile?: File | null;
  /** contentImageFiles keyed by BlogImage.id, matched up with block.images */
  contentImageFiles?: Record<string, File>;
}

export interface BlogFormErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  coverImage?: string;
  content?: string;
}