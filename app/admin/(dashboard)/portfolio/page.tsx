"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./portfolio.module.css";
import imgStyles from "./Imagepicker.module.css";

/* ══════════════════════════════════════════════════════════════
   TYPES — matches the Express /api/portfolio Mongoose model
══════════════════════════════════════════════════════════════ */
type MainCategory = "Web Development" | "Graphic Designing" | "Digital Marketing" | "Branding";

interface Project {
  _id: string;
  title: string;
  shortDesc: string;   // one-liner shown on the public card
  description: string; // fuller text shown inside the public modal
  images: string[];    // gallery — images[0] is treated as the cover
  category: MainCategory;
  subCategory: string;
  createdAt?: string;
  updatedAt?: string;
}

/** A single image inside the form — either an already-hosted URL
 *  (pasted, or kept from an existing project) or a freshly picked
 *  local File waiting to be uploaded. */
interface ImageItem {
  key: string;
  kind: "existing" | "file";
  url: string;   // display/preview URL either way
  file?: File;   // present only when kind === "file"
}

interface ToastItem {
  id: string;
  message: string;
  type: "error" | "success";
}

const CATEGORIES: MainCategory[] = [
  "Web Development",
  "Graphic Designing",
  "Digital Marketing",
  "Branding",
];

const SUBCATEGORY_MAP: Record<MainCategory, string[]> = {
  "Web Development": ["Ecommerce", "Corporate & Product Sites"],
  "Graphic Designing": ["Social Media Creatives", "Print & Packaging"],
  "Digital Marketing": ["SEO Campaigns", "Paid & Analytics"],
  Branding: ["Brand Identity", "Logo Design"],
};

const OTHER_VALUE = "__other__";

/* Pagination */
const ITEMS_PER_PAGE = 10;

/* ══════════════════════════════════════════════════════════════
   API — NEXT_PUBLIC_API_URL already includes /api
══════════════════════════════════════════════════════════════ */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const PORTFOLIO_API = `${API_BASE}/portfolio`;

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// backend "/uploads/xyz.jpg" jaisa relative path deta hai (static files),
// jo Express server ke origin se serve hota hai, Next.js app se nahi —
// isliye API_BASE se "/api" hata kar us origin ko prefix karna padta hai.
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function resolveImageUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) {
    return url; // already absolute, or a local file preview — use as-is
  }
  return `${API_ORIGIN}${url}`;
}

interface FormState {
  title: string;
  shortDesc: string;
  description: string;
  images: ImageItem[];
  category: MainCategory;
  subCategory: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  shortDesc: "",
  description: "",
  images: [],
  category: "Web Development",
  subCategory: SUBCATEGORY_MAP["Web Development"][0],
};

function makeKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function revokeFileUrls(images: ImageItem[]) {
  images.forEach((img) => {
    if (img.kind === "file") URL.revokeObjectURL(img.url);
  });
}

/** Builds a compact page-number list with ellipses, e.g.
 *  [1, '...', 4, 5, 6, '...', 12] — keeps first/last + a window around current. */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
  </svg>
);
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l2.9 6.26 6.9.6-5.2 4.6 1.6 6.74L12 17.9l-6.2 3.3 1.6-6.74-5.2-4.6 6.9-.6L12 3z" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SpinnerIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className={imgStyles.spin}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | MainCategory>("All");

  // ---- pagination state ----
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [customSub, setCustomSub] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- delete-confirm dialog + toast state ----
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; title: string } | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function pushToast(message: string, type: "error" | "success" = "error") {
    const id = makeKey();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  /* ---------- initial fetch: GET /api/portfolio ---------- */
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setPageError(null);
      try {
        const res = await fetch(PORTFOLIO_API);
        const data = await parseJsonSafe(res);
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Projects load nahi ho paaye.");
        }
        if (!ignore) setProjects(data.data as Project[]);
      } catch (err) {
        if (!ignore) {
          setPageError(err instanceof Error ? err.message : "Kuch galat ho gaya, dobara try karo.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------- client-side filtering (search + category) ---------- */
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
        return matchesQuery && matchesCategory;
      }),
    [projects, query, categoryFilter]
  );

  /* ---------- pagination derived state ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // search/category badalte hi page 1 par wapas
  useEffect(() => {
    setCurrentPage(1);
  }, [query, categoryFilter]);

  // agar delete ke baad current page khali ho jaye to pichle page par le jao
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    // list ke top par smooth scroll — lambi list mein page change ka feedback milta hai
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  /* ---------- modal open/close ---------- */
  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setCustomSub(false);
    setUrlInput("");
    setErrors(null);
    setModalOpen(true);
  }

  function openEditModal(p: Project) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      shortDesc: p.shortDesc,
      description: p.description,
      images: p.images.map((url) => ({ key: makeKey(), kind: "existing", url })),
      category: p.category,
      subCategory: p.subCategory,
    });
    setCustomSub(!SUBCATEGORY_MAP[p.category].includes(p.subCategory));
    setUrlInput("");
    setErrors(null);
    setModalOpen(true);
  }

  function closeModal() {
    revokeFileUrls(form.images); // free any local blob previews from memory
    setModalOpen(false);
  }

  /* ---------- text field handlers ---------- */
  function handleTextChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value as MainCategory;
    setForm((prev) => ({ ...prev, category, subCategory: SUBCATEGORY_MAP[category][0] }));
    setCustomSub(false);
  }

  function handleSubCategorySelect(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === OTHER_VALUE) {
      setCustomSub(true);
      setForm((prev) => ({ ...prev, subCategory: "" }));
    } else {
      setCustomSub(false);
      setForm((prev) => ({ ...prev, subCategory: val }));
    }
  }

  /* ---------- multi-image handling ---------- */
  function handleImageFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = Array.from(files).map((file) => ({
      key: makeKey(),
      kind: "file",
      url: URL.createObjectURL(file), // local preview only, actual upload happens on submit
      file,
    }));

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newItems] }));
    e.target.value = ""; // allow re-selecting the same file again later
  }

  function addImageUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { key: makeKey(), kind: "existing", url }],
    }));
    setUrlInput("");
  }

  function removeImage(idx: number) {
    setForm((prev) => {
      const target = prev.images[idx];
      if (target?.kind === "file") URL.revokeObjectURL(target.url);
      return { ...prev, images: prev.images.filter((_, i) => i !== idx) };
    });
  }

  function makeCover(idx: number) {
    setForm((prev) => {
      const imgs = [...prev.images];
      const [chosen] = imgs.splice(idx, 1);
      imgs.unshift(chosen);
      return { ...prev, images: imgs };
    });
  }

  function moveImage(idx: number, dir: -1 | 1) {
    setForm((prev) => {
      const imgs = [...prev.images];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= imgs.length) return prev;
      [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
      return { ...prev, images: imgs };
    });
  }

  /* ---------- submit: POST (add) / PUT (edit) /api/portfolio ---------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.shortDesc.trim() || !form.description.trim()) {
      setErrors("Title, short description aur description bharna zaroori hai.");
      return;
    }
    if (!form.subCategory.trim()) {
      setErrors("Sub-category select ya type karo.");
      return;
    }
    if (form.images.length === 0) {
      setErrors("Kam se kam ek image add karo.");
      return;
    }

    setErrors(null);
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("shortDesc", form.shortDesc.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category);
      fd.append("subCategory", form.subCategory.trim());

      // already-hosted URLs (pasted, or kept from an existing project) — order preserved
      const existingUrls = form.images.filter((img) => img.kind === "existing").map((img) => img.url);
      fd.append("existingImages", JSON.stringify(existingUrls));

      // freshly picked files — backend appends these after existingImages
      form.images
        .filter((img): img is ImageItem & { file: File } => img.kind === "file" && !!img.file)
        .forEach((img) => fd.append("images", img.file));

      const url = editingId ? `${PORTFOLIO_API}/${editingId}` : PORTFOLIO_API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const data = await parseJsonSafe(res);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Save nahi ho paaya, dobara try karo.");
      }

      const saved = data.data as Project;
      if (editingId) {
        setProjects((prev) => prev.map((p) => (p._id === editingId ? saved : p)));
        pushToast("Project update ho gaya.", "success");
      } else {
        setProjects((prev) => [saved, ...prev]);
        // naya project jis category mein bhi ho, turant dikhna chahiye —
        // isliye filter ko "All Categories" par reset kar do
        setCategoryFilter("All");
        setQuery("");
        setCurrentPage(1);
        pushToast("Naya project add ho gaya.", "success");
      }

      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Kuch galat ho gaya, dobara try karo.";
      setErrors(msg);
      pushToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- delete: DELETE /api/portfolio/:id ---------- */
  function requestDelete(p: Project) {
    setConfirmTarget({ id: p._id, title: p.title });
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    const id = confirmTarget.id;

    setDeletingId(id);
    try {
      const res = await fetch(`${PORTFOLIO_API}/${id}`, { method: "DELETE" });
      const data = await parseJsonSafe(res);
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Delete nahi ho paaya.");
      }
      setProjects((prev) => prev.filter((p) => p._id !== id));
      pushToast("Project delete ho gaya.", "success");
    } catch (err) {
      pushToast(err instanceof Error ? err.message : "Delete nahi ho paaya, dobara try karo.", "error");
    } finally {
      setDeletingId(null);
      setConfirmTarget(null);
    }
  }

  const subCategoryOptions = SUBCATEGORY_MAP[form.category];

  return (
    <div>
      {/* ---------- Header: search + category filter + add ---------- */}
      <div className={`${ui.pageHeadRow} ${imgStyles.headRow}`}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <select
          className={imgStyles.select}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as "All" | MainCategory)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button type="button" className={ui.btnPrimary} onClick={openAddModal}>
          + Add Project
        </button>
      </div>

      {/* ---------- List ---------- */}
      {loading ? (
        <div className={ui.emptyState}>Loading projects...</div>
      ) : pageError ? (
        <div className={ui.emptyState}>{pageError}</div>
      ) : (
        <>
          <div className={styles.grid}>
            {paginated.map((p) => (
              <div className={styles.card} key={p._id}>
                <div className={styles.thumb}>
                  <img src={resolveImageUrl(p.images[0])} alt={p.title} />
                  {p.images.length > 1 && (
                    <span className={imgStyles.countBadge}>+{p.images.length - 1}</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.category}>
                    {p.category} · {p.subCategory}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.shortDesc}</p>
                  <div className={styles.cardActions}>
                    <button className={ui.iconBtn} onClick={() => openEditModal(p)} aria-label="Edit">
                      <EditIcon />
                    </button>
                    <button
                      className={ui.iconBtn}
                      onClick={() => requestDelete(p)}
                      disabled={deletingId === p._id}
                      aria-label="Delete"
                    >
                      {deletingId === p._id ? <SpinnerIcon /> : <TrashIcon />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className={ui.emptyState}>No projects match your search.</div>}
          </div>

          {/* ---------- Pagination ---------- */}
          {filtered.length > 0 && (
            <div className={styles.paginationWrap}>
              <span className={styles.paginationRange}>
                Showing {rangeStart}–{rangeEnd} of {filtered.length}
              </span>

              <nav className={styles.pagination} aria-label="Pagination">
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon />
                </button>

                <div className={styles.pageNumbers}>
                  {pageNumbers.map((n, i) =>
                    n === "..." ? (
                      <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        className={`${styles.pageBtn} ${n === currentPage ? styles.pageBtnActive : ""}`}
                        onClick={() => goToPage(n)}
                        aria-current={n === currentPage ? "page" : undefined}
                      >
                        {n}
                      </button>
                    )
                  )}
                </div>

                <span className={styles.pageMobileLabel}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRightIcon />
                </button>
              </nav>
            </div>
          )}
        </>
      )}

      {/* ---------- Add / Edit Modal ---------- */}
      {modalOpen && (
        <div className={ui.modalOverlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHead}>
              <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
              <button className={ui.iconBtn} onClick={closeModal} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={ui.formGrid}>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="title">Project Title</label>
                  <input id="title" name="title" required value={form.title} onChange={handleTextChange} />
                </div>

                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="shortDesc">Short Description (card one-liner)</label>
                  <input
                    id="shortDesc"
                    name="shortDesc"
                    required
                    placeholder="e.g. Rooted in tradition, built for modern shopping."
                    value={form.shortDesc}
                    onChange={handleTextChange}
                  />
                </div>

                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="description">Full Description (shown in modal)</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleTextChange}
                  />
                </div>

                <div className={ui.field}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    className={`${imgStyles.select} ${imgStyles.selectFull}`}
                    value={form.category}
                    onChange={handleCategoryChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={ui.field}>
                  <label htmlFor="subCategory">Sub-category</label>
                  {!customSub ? (
                    <select
                      id="subCategory"
                      className={`${imgStyles.select} ${imgStyles.selectFull}`}
                      value={form.subCategory}
                      onChange={handleSubCategorySelect}
                    >
                      {subCategoryOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value={OTHER_VALUE}>Other (type manually)</option>
                    </select>
                  ) : (
                    <input
                      id="subCategory"
                      name="subCategory"
                      required
                      placeholder="Type sub-category"
                      value={form.subCategory}
                      onChange={handleTextChange}
                    />
                  )}
                </div>

                {/* ---------- Multi-image manager ---------- */}
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label>Project Images ({form.images.length})</label>

                  <div className={imgStyles.addRow}>
                    <button
                      type="button"
                      className={ui.btnGhost}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon /> Upload Images
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageFiles}
                    />

                    <span className={imgStyles.orText}>or</span>

                    <input
                      className={imgStyles.urlInput}
                      placeholder="Paste image URL"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                    />
                    <button type="button" className={ui.btnGhost} onClick={addImageUrl}>
                      Add URL
                    </button>
                  </div>

                  {form.images.length > 0 && (
                    <div className={imgStyles.previewGrid}>
                      {form.images.map((img, idx) => (
                        <div className={imgStyles.previewCard} key={img.key}>
                          <img src={resolveImageUrl(img.url)} alt={`Preview ${idx + 1}`} />
                          {idx === 0 && <span className={imgStyles.coverBadge}>Cover</span>}
                          {img.kind === "file" && <span className={imgStyles.newBadge}>New</span>}

                          <div className={imgStyles.previewActions}>
                            <button
                              type="button"
                              className={imgStyles.previewBtn}
                              onClick={() => makeCover(idx)}
                              aria-label="Set as cover"
                              title="Set as cover"
                            >
                              <StarIcon filled={idx === 0} />
                            </button>
                            <button
                              type="button"
                              className={imgStyles.previewBtn}
                              onClick={() => moveImage(idx, -1)}
                              disabled={idx === 0}
                              aria-label="Move left"
                              title="Move left"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              className={imgStyles.previewBtn}
                              onClick={() => moveImage(idx, 1)}
                              disabled={idx === form.images.length - 1}
                              aria-label="Move right"
                              title="Move right"
                            >
                              →
                            </button>
                            <button
                              type="button"
                              className={imgStyles.previewBtnDanger}
                              onClick={() => removeImage(idx)}
                              aria-label="Remove image"
                              title="Remove"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {errors && <p className={imgStyles.errorText}>{errors}</p>}

              <div className={ui.modalActions}>
                <button type="button" className={ui.btnGhost} onClick={closeModal} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className={ui.btnPrimary} disabled={submitting}>
                  {submitting ? (
                    <>
                      <SpinnerIcon /> Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Add Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Delete Confirm Dialog ---------- */}
      {confirmTarget && (
        <div
          className={styles.confirmOverlay}
          onClick={() => !deletingId && setConfirmTarget(null)}
        >
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmIconWrap}>
              <TrashIcon />
            </div>
            <h3 className={styles.confirmTitle}>Delete this project?</h3>
            <p className={styles.confirmMsg}>
              &ldquo;{confirmTarget.title}&rdquo; portfolio se hamesha ke liye remove ho jayega. Ye action undo nahi ho sakta.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => setConfirmTarget(null)}
                disabled={deletingId === confirmTarget.id}
              >
                Cancel
              </button>
              <button
                className={styles.confirmDelete}
                onClick={confirmDelete}
                disabled={deletingId === confirmTarget.id}
              >
                {deletingId === confirmTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Toasts ---------- */}
      <div className={styles.toastStack}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${t.type === "error" ? styles.toastError : styles.toastSuccess}`}
          >
            <span className={styles.toastIcon}>
              {t.type === "error" ? <AlertIcon /> : <CheckIcon />}
            </span>
            <span className={styles.toastMsg}>{t.message}</span>
            <button className={styles.toastClose} onClick={() => dismissToast(t.id)} aria-label="Dismiss">
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}