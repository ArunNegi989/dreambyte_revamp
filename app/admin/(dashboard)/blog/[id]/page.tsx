"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Blog.module.css";
import {
  BlogSection,
  BlogImage,
  ImageLayout,
  ListType,
  CalloutVariant,
  BlogFormValues,
  BlogFormErrors,
} from "@/types/blog";
import { getSingleBlog, updateBlog, resolveImage } from "@/lib/api/blogs";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

let idCounter = 0;
const uid = () => `blk-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;

const TYPE_LABELS: Record<BlogSection["type"], string> = {
  heading: "H2 Heading", subheading: "H3 Subheading", paragraph: "Paragraph",
  images: "Image Block", divider: "Divider", list: "List", quote: "Blockquote",
  code: "Code Block", video: "Video Embed", table: "Table", callout: "Callout",
  spacer: "Spacer", html: "Raw HTML",
};

const TYPE_ICONS: Record<BlogSection["type"], string> = {
  heading: "H2", subheading: "H3", paragraph: "¶", images: "🖼", divider: "—",
  list: "≡", quote: "❝", code: "</>", video: "▶", table: "⊞", callout: "💡",
  spacer: "↕", html: "<>",
};

const LAYOUT_LABELS: Record<ImageLayout, string> = { single: "Single", "two-col": "2 Col", "three-col": "3 Col", wide: "Wide" };
const CALLOUT_VARIANTS: CalloutVariant[] = ["info", "tip", "success", "warning", "danger"];
const CALLOUT_ICONS: Record<CalloutVariant, string> = { info: "ℹ️", tip: "💡", success: "✅", warning: "⚠️", danger: "🚨" };

const CATEGORY_OPTIONS = [
  "Digital Marketing", "SEO", "Social Media", "Web Development", "AI", "Branding",
  "Yoga Teacher Training", "Yoga", "Ayurveda", "Yoga Retreats", "Lifestyle", "Health",
  "Meditation", "Philosophy", "Nutrition",
];

const CODE_LANGUAGES = ["plaintext", "javascript", "typescript", "python", "html", "css", "json", "bash", "sql", "php", "java", "go", "rust"];

const BLOCK_GROUPS = [
  { label: "Text", types: ["heading", "subheading", "paragraph", "list", "quote"] as BlogSection["type"][] },
  { label: "Media", types: ["images", "video"] as BlogSection["type"][] },
  { label: "Advanced", types: ["table", "callout", "code", "html", "divider", "spacer"] as BlogSection["type"][] },
];

const joditConfig = {
  readonly: false, height: 320, toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "strikethrough", "|",
    "font", "fontsize", "paragraph", "|",
    "brush", "superscript", "subscript", "|",
    "align", "|", "link", "unlink", "|", "undo", "redo",
  ],
  style: { fontFamily: "inherit", fontSize: "15px" },
  placeholder: "Start writing paragraph content…",
};

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const coverFileRef = useRef<HTMLInputElement>(null);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<"published" | "draft" | null>(null);
  const [errors, setErrors] = useState<BlogFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const coverFile = useRef<File | null>(null);
  const imageFiles = useRef<Record<string, File>>({});
  const imageFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const blockDragIdx = useRef<number | null>(null);

  const [form, setForm] = useState<BlogFormValues>({
    title: "", slug: "", excerpt: "", date: "", author: "", authorRole: "", category: "",
    coverImage: "", tags: [], content: [],
    metaTitle: "", metaDescription: "", metaKeywords: [],
    status: "Draft",
  });

  const [metaKeywordInput, setMetaKeywordInput] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const raw = await getSingleBlog(id);

        const normalisedContent: BlogSection[] = (raw.content || []).map((block: any) => ({
          id: uid(),
          type: block.type,
          text: block.text,
          listType: block.listType,
          listItems: block.listItems,
          quoteAuthor: block.quoteAuthor,
          codeLanguage: block.codeLanguage,
          videoUrl: block.videoUrl,
          videoCaption: block.videoCaption,
          tableHeaders: block.tableHeaders,
          tableRows: block.tableRows,
          calloutVariant: block.calloutVariant,
          calloutTitle: block.calloutTitle,
          spacerHeight: block.spacerHeight,
          imageLayout: block.imageLayout,
          images: Array.isArray(block.images)
            ? block.images.map((img: any) => ({
                id: uid(),
                src: resolveImage(img.src),
                caption: img.caption || "",
                altText: img.altText || "",
              }))
            : undefined,
        }));

        setForm({
          title: raw.title ?? "",
          slug: raw.slug ?? "",
          excerpt: raw.excerpt ?? "",
          date: raw.date ? new Date(raw.date).toISOString().slice(0, 10) : "",
          author: raw.author ?? "",
          authorRole: raw.authorRole ?? "",
          category: raw.category ?? "",
          coverImage: resolveImage(raw.coverImage),
          tags: raw.tags ?? [],
          content: normalisedContent,
          metaTitle: raw.metaTitle ?? "",
          metaDescription: raw.metaDescription ?? "",
          metaKeywords: raw.metaKeywords ?? [],
          status: raw.status ?? "Draft",
        });
      } catch (err: any) {
        setLoadError(err?.response?.data?.message || err?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const addMetaKeyword = (val: string) => {
    const k = val.trim();
    if (!k || form.metaKeywords.includes(k)) return;
    setForm((p) => ({ ...p, metaKeywords: [...p.metaKeywords, k] }));
  };
  const removeMetaKeyword = (k: string) =>
    setForm((p) => ({ ...p, metaKeywords: p.metaKeywords.filter((x) => x !== k) }));

  const set = <K extends keyof BlogFormValues>(key: K, val: BlogFormValues[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key as keyof BlogFormErrors]: undefined }));
  };

  const addTag = (val: string) => {
    const t = val.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((p) => ({ ...p, tags: [...p.tags, t] }));
  };
  const removeTag = (t: string) =>
    setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    coverFile.current = f;
    set("coverImage", URL.createObjectURL(f));
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCoverDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    coverFile.current = f;
    set("coverImage", URL.createObjectURL(f));
  };

  const handleCoverUrl = () => {
    const url = coverUrlInput.trim();
    if (!url) return;
    coverFile.current = null;
    set("coverImage", url);
    setCoverUrlInput("");
  };

  const addBlock = (type: BlogSection["type"]) => {
    const newBlock: BlogSection = {
      id: uid(),
      type,
      ...(type === "images" ? { images: [{ id: uid(), src: "", caption: "", altText: "" }], imageLayout: "single" as ImageLayout } : {}),
      ...(type !== "images" && type !== "divider" && type !== "spacer" ? { text: "" } : {}),
      ...(type === "list" ? { listType: "unordered" as ListType, listItems: [""] } : {}),
      ...(type === "quote" ? { quoteAuthor: "" } : {}),
      ...(type === "code" ? { codeLanguage: "plaintext" } : {}),
      ...(type === "callout" ? { calloutVariant: "info" as CalloutVariant, calloutTitle: "" } : {}),
      ...(type === "spacer" ? { spacerHeight: 40 } : {}),
      ...(type === "table" ? { tableHeaders: ["Column 1", "Column 2", "Column 3"], tableRows: [["", "", ""]] } : {}),
      ...(type === "video" ? { videoUrl: "", videoCaption: "" } : {}),
    };
    setForm((p) => ({ ...p, content: [...p.content, newBlock] }));
    setErrors((p) => ({ ...p, content: undefined }));
  };

  const updateBlock = (idx: number, partial: Partial<BlogSection>) =>
    setForm((p) => {
      const arr = [...p.content];
      arr[idx] = { ...arr[idx], ...partial };
      return { ...p, content: arr };
    });

  const removeBlock = (idx: number) =>
    setForm((p) => ({ ...p, content: p.content.filter((_, i) => i !== idx) }));

  const updateListItem = (blockIdx: number, itemIdx: number, val: string) => {
    const items = [...(form.content[blockIdx].listItems ?? [])];
    items[itemIdx] = val;
    updateBlock(blockIdx, { listItems: items });
  };
  const addListItem = (blockIdx: number) => {
    updateBlock(blockIdx, { listItems: [...(form.content[blockIdx].listItems ?? []), ""] });
  };
  const removeListItem = (blockIdx: number, itemIdx: number) => {
    const items = (form.content[blockIdx].listItems ?? []).filter((_, i) => i !== itemIdx);
    updateBlock(blockIdx, { listItems: items });
  };

  const addTableRow = (blockIdx: number) => {
    const cols = form.content[blockIdx].tableHeaders?.length ?? 3;
    updateBlock(blockIdx, {
      tableRows: [...(form.content[blockIdx].tableRows ?? []), Array(cols).fill("")],
    });
  };
  const removeTableRow = (blockIdx: number, rowIdx: number) => {
    const rows = (form.content[blockIdx].tableRows ?? []).filter((_, i) => i !== rowIdx);
    updateBlock(blockIdx, { tableRows: rows });
  };
  const updateTableCell = (blockIdx: number, rowIdx: number, colIdx: number, val: string) => {
    const rows = (form.content[blockIdx].tableRows ?? []).map((r) => [...r]);
    rows[rowIdx][colIdx] = val;
    updateBlock(blockIdx, { tableRows: rows });
  };
  const updateTableHeader = (blockIdx: number, colIdx: number, val: string) => {
    const headers = [...(form.content[blockIdx].tableHeaders ?? [])];
    headers[colIdx] = val;
    updateBlock(blockIdx, { tableHeaders: headers });
  };
  const addTableCol = (blockIdx: number) => {
    const headers = [...(form.content[blockIdx].tableHeaders ?? []), `Column ${(form.content[blockIdx].tableHeaders?.length ?? 0) + 1}`];
    const rows = (form.content[blockIdx].tableRows ?? []).map((r) => [...r, ""]);
    updateBlock(blockIdx, { tableHeaders: headers, tableRows: rows });
  };
  const removeTableCol = (blockIdx: number, colIdx: number) => {
    const headers = (form.content[blockIdx].tableHeaders ?? []).filter((_, i) => i !== colIdx);
    const rows = (form.content[blockIdx].tableRows ?? []).map((r) => r.filter((_, i) => i !== colIdx));
    updateBlock(blockIdx, { tableHeaders: headers, tableRows: rows });
  };

  const addImageItem = (blockIdx: number) =>
    updateBlock(blockIdx, {
      images: [...(form.content[blockIdx].images ?? []), { id: uid(), src: "", caption: "", altText: "" }],
    });

  const updateImageItem = (blockIdx: number, imgId: string, partial: Partial<BlogImage>) => {
    const imgs = [...(form.content[blockIdx].images ?? [])];
    const i = imgs.findIndex((img) => img.id === imgId);
    imgs[i] = { ...imgs[i], ...partial };
    updateBlock(blockIdx, { images: imgs });
  };

  const removeImageItem = (blockIdx: number, imgId: string) => {
    delete imageFiles.current[imgId];
    const imgs = (form.content[blockIdx].images ?? []).filter((img) => img.id !== imgId);
    updateBlock(blockIdx, { images: imgs });
  };

  const handleImageFile = (blockIdx: number, imgId: string, file: File) => {
    imageFiles.current[imgId] = file;
    const url = URL.createObjectURL(file);
    const imgs = [...(form.content[blockIdx].images ?? [])];
    const i = imgs.findIndex((x) => x.id === imgId);
    imgs[i] = { ...imgs[i], src: url };
    updateBlock(blockIdx, { images: imgs });
  };

  const handleBlockDragStart = (i: number) => { blockDragIdx.current = i; };
  const handleBlockDragEnter = (i: number) => {
    if (blockDragIdx.current === null || blockDragIdx.current === i) return;
    const arr = [...form.content];
    const [moved] = arr.splice(blockDragIdx.current, 1);
    arr.splice(i, 0, moved);
    blockDragIdx.current = i;
    setForm((p) => ({ ...p, content: arr }));
  };

  const validate = (): boolean => {
    const e: BlogFormErrors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!form.date.trim()) e.date = "Date is required";
    if (!form.category) e.category = "Category is required";
    if (!form.coverImage.trim()) e.coverImage = "Cover image is required";
    if (form.content.length === 0) e.content = "Add at least one content block";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validate()) return;
    try {
      setIsSubmitting(true);

      const payload: BlogFormValues = {
        ...form,
        status: asDraft ? "Draft" : "Published",
      };

      await updateBlog(id, payload, {
        coverImageFile: coverFile.current,
        contentImageFiles: imageFiles.current,
      });

      setSubmitted(asDraft ? "draft" : "published");
      setTimeout(() => router.push("/admin/blog"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
       
          <p className={styles.successText}>Loading blog post…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.formPage}>
        <div className={styles.formCard}>
          <p className={styles.errorMsg}>⚠ {loadError}</p>
          <Link href="/admin/dashboard/blog" className={styles.cancelBtn}>← Back to Blogs</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
        
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>{submitted === "draft" ? "Saved as Draft!" : "Blog Updated!"}</h2>
          <p className={styles.successText}>Redirecting to blog list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>

      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/blog" className={styles.breadcrumbLink}>Blogs</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Post</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Edit Blog Post</h1>
          <p className={styles.pageSubtitle}>Update meta, cover image, and content blocks</p>
        </div>
      </div>

     

      <div className={styles.formCard}>

        {/* 1. META INFORMATION */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Blog Meta</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Title<span className={styles.required}>*</span></label>
            <div className={`${styles.inputWrap} ${errors.title ? styles.inputError : ""} ${form.title && !errors.title ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} value={form.title} maxLength={200}
                onChange={(e) => set("title", e.target.value)} />
              <span className={styles.charCount}>{form.title.length}/200</span>
            </div>
            {errors.title && <p className={styles.errorMsg}>⚠ {errors.title}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>URL Slug<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Change carefully — old links will break</p>
            <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.slug ? styles.inputError : ""} ${form.slug && !errors.slug ? styles.inputSuccess : ""}`}
              style={{ display: "flex", alignItems: "center" }}>
              <span style={{ padding: "0 0.75rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#a07840", borderRight: "1px solid #e8d5b5", whiteSpace: "nowrap", flexShrink: 0 }}>/blog/</span>
              <input type="text" className={styles.input} style={{ paddingLeft: "0.75rem" }}
                value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Excerpt<span className={styles.required}>*</span></label>
            <div className={`${styles.inputWrap} ${errors.excerpt ? styles.inputError : ""} ${form.excerpt && !errors.excerpt ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} value={form.excerpt} maxLength={300} rows={3}
                onChange={(e) => set("excerpt", e.target.value)} />
              <span className={styles.charCount}>{form.excerpt.length}/300</span>
            </div>
            {errors.excerpt && <p className={styles.errorMsg}>⚠ {errors.excerpt}</p>}
          </div>

          <div className={styles.threeCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Date<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.date ? styles.inputError : ""} ${form.date ? styles.inputSuccess : ""}`}>
                <input type="date" className={styles.input} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              {errors.date && <p className={styles.errorMsg}>⚠ {errors.date}</p>}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Author</label>
              <div className={`${styles.inputWrap} ${form.author ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} value={form.author} maxLength={80} onChange={(e) => set("author", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}><span className={styles.labelIcon}>✦</span>Category<span className={styles.required}>*</span></label>
              <div className={`${styles.inputWrap} ${errors.category ? styles.inputError : ""} ${form.category ? styles.inputSuccess : ""}`} style={{ position: "relative" }}>
                <select className={styles.input} style={{ cursor: "pointer", appearance: "none", paddingRight: "2rem" }}
                  value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">— Select —</option>
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
              {errors.category && <p className={styles.errorMsg}>⚠ {errors.category}</p>}
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Tags</label>
            <div className={styles.tagsRow}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagChip}>
                  {t}
                  <button type="button" className={styles.tagRemove} onClick={() => removeTag(t)}>✕</button>
                </span>
              ))}
              <input
                type="text" className={styles.tagInput}
                placeholder={form.tags.length === 0 ? "Yoga, Rishikesh, Health…" : "Add tag…"}
                value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); setTagInput(""); }
                  if (e.key === "Backspace" && !tagInput && form.tags.length > 0) removeTag(form.tags[form.tags.length - 1]);
                }}
                onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(""); } }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* 2. COVER IMAGE */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Cover Image</h3>
          </div>

          {errors.coverImage && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.coverImage}</p>}

          <div className={styles.coverImgArea}>
            <div className={styles.coverPreviewBox}>
              {form.coverImage
                ? <>
                    <img src={form.coverImage} alt="Cover" className={styles.coverPreviewImg} />
                    <div className={styles.coverOverlay}>
                      <button type="button" className={styles.removeImgBtn} onClick={() => {
                        coverFile.current = null;
                        set("coverImage", "");
                      }}>✕</button>
                    </div>
                  </>
                : <div className={styles.coverPreviewEmpty}>
                    <span className={styles.coverPreviewIcon}>🖼</span>
                    16:9 cover image
                  </div>
              }
            </div>

            <div className={styles.coverControls}>
              <div
                className={`${styles.uploadZone} ${isCoverDragOver ? styles.uploadZoneDragOver : ""}`}
                onClick={() => coverFileRef.current?.click()}
                onDrop={handleCoverDrop}
                onDragOver={(e) => { e.preventDefault(); setIsCoverDragOver(true); }}
                onDragLeave={() => setIsCoverDragOver(false)}
              >
                <span className={styles.uploadIcon}>📁</span>
                <p className={styles.uploadText}>Click or drag & drop to replace</p>
                <p className={styles.uploadSubText}>JPG · PNG · WEBP</p>
                <input ref={coverFileRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleCoverFile} />
              </div>
              <div className={styles.urlRow}>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input}
                    placeholder="Or paste cover image URL"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCoverUrl(); }} />
                </div>
                <button type="button" className={styles.addUrlBtn} onClick={handleCoverUrl}>Use URL</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* 3. CONTENT BUILDER */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Content Blocks</h3>
            <span className={styles.sectionBadge}>{form.content.length} blocks · drag to reorder</span>
          </div>

          {errors.content && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.content}</p>}

          <div className={styles.contentBuilder}>
            {form.content.map((block, idx) => (
              <div
                key={block.id}
                className={`${styles.blockCard}`}
                draggable
                onDragStart={() => handleBlockDragStart(idx)}
                onDragEnter={() => handleBlockDragEnter(idx)}
                onDragEnd={() => { blockDragIdx.current = null; }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={styles.blockCardHeader}>
                  <span className={styles.blockDragHandle}>⠿</span>
                  <span className={styles.blockNum}>{idx + 1}</span>
                  <span className={`${styles.blockTypeBadge} ${styles[`blockType${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`] ?? ""}`}>
                    <span style={{ marginRight: "0.3em" }}>{TYPE_ICONS[block.type]}</span>
                    {TYPE_LABELS[block.type]}
                  </span>
                  <button type="button" className={styles.blockRemoveBtn} onClick={() => removeBlock(idx)}>✕</button>
                </div>

                <div className={styles.blockCardBody}>

                  {(block.type === "heading" || block.type === "subheading") && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <input
                        type="text" className={styles.input}
                        value={block.text ?? ""} maxLength={200}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })}
                      />
                      <span className={styles.charCount}>{(block.text ?? "").length}/200</span>
                    </div>
                  )}

                  {block.type === "paragraph" && (
                    <div className={styles.joditWrap}>
                      <JoditEditor
                        value={block.text ?? ""}
                        config={joditConfig}
                        onBlur={(newContent) => updateBlock(idx, { text: newContent })}
                      />
                    </div>
                  )}

                  {block.type === "list" && (
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        {(["unordered", "ordered"] as ListType[]).map((lt) => (
                          <button key={lt} type="button"
                            className={`${styles.layoutBtn} ${block.listType === lt ? styles.layoutBtnActive : ""}`}
                            onClick={() => updateBlock(idx, { listType: lt })}>
                            {lt === "unordered" ? "• Bullet List" : "1. Numbered List"}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {(block.listItems ?? []).map((item, itemIdx) => (
                          <div key={itemIdx} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                            <span style={{ color: "#a07840", fontFamily: "serif", minWidth: "1.2rem", textAlign: "center" }}>
                              {block.listType === "ordered" ? `${itemIdx + 1}.` : "•"}
                            </span>
                            <div className={styles.inputWrap} style={{ flex: 1 }}>
                              <input type="text" className={styles.input}
                                value={item}
                                onChange={(e) => updateListItem(idx, itemIdx, e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addListItem(idx); } }}
                              />
                            </div>
                            <button type="button" className={styles.imageSubRemove}
                              onClick={() => removeListItem(idx, itemIdx)}
                              disabled={(block.listItems ?? []).length <= 1}>✕</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className={styles.addImageBtn} style={{ marginTop: "0.6rem" }} onClick={() => addListItem(idx)}>+ Add Item</button>
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div className={styles.inputWrap}>
                        <textarea className={`${styles.input} ${styles.textarea}`}
                          style={{ minHeight: "5rem", fontStyle: "italic", fontSize: "1.05rem" }}
                          value={block.text ?? ""} rows={3}
                          onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                      </div>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input}
                          placeholder="— Author name (optional)"
                          value={block.quoteAuthor ?? ""} maxLength={100}
                          onChange={(e) => updateBlock(idx, { quoteAuthor: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {block.type === "code" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        <label className={styles.imageSubLabel} style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Language:</label>
                        <div className={styles.inputWrap} style={{ maxWidth: "180px" }}>
                          <select className={styles.input} style={{ cursor: "pointer" }}
                            value={block.codeLanguage ?? "plaintext"}
                            onChange={(e) => updateBlock(idx, { codeLanguage: e.target.value })}>
                            {CODE_LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className={styles.inputWrap}>
                        <textarea className={`${styles.input} ${styles.textarea}`}
                          style={{ minHeight: "8rem", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.03)" }}
                          value={block.text ?? ""} rows={8} spellCheck={false}
                          onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {block.type === "video" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input}
                          value={block.videoUrl ?? ""}
                          onChange={(e) => updateBlock(idx, { videoUrl: e.target.value })} />
                      </div>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input}
                          placeholder="Video caption (optional)"
                          value={block.videoCaption ?? ""} maxLength={200}
                          onChange={(e) => updateBlock(idx, { videoCaption: e.target.value })} />
                      </div>
                      {block.videoUrl && (
                        <div style={{ marginTop: "0.4rem", borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
                          <iframe
                            src={block.videoUrl
                              .replace("watch?v=", "embed/")
                              .replace("youtu.be/", "www.youtube.com/embed/")
                              .replace("vimeo.com/", "player.vimeo.com/video/")}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            allowFullScreen title="video preview" />
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === "table" && (
                    <div>
                      <div style={{ overflowX: "auto", marginBottom: "0.6rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                          <thead>
                            <tr>
                              {(block.tableHeaders ?? []).map((header, colIdx) => (
                                <th key={colIdx} style={{ padding: "0.3rem", border: "1px solid #e8d5b5", background: "rgba(224,123,0,0.06)" }}>
                                  <input type="text" className={styles.input}
                                    style={{ padding: "0.25rem 0.4rem", fontWeight: 600, fontSize: "0.82rem", textAlign: "center" }}
                                    value={header} placeholder={`Col ${colIdx + 1}`}
                                    onChange={(e) => updateTableHeader(idx, colIdx, e.target.value)} />
                                </th>
                              ))}
                              <th style={{ padding: "0.3rem", width: "2rem" }}>
                                <button type="button" title="Remove column"
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#c85a5a", fontSize: "0.75rem" }}
                                  onClick={() => removeTableCol(idx, (block.tableHeaders?.length ?? 1) - 1)}>✕col</button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(block.tableRows ?? []).map((row, rowIdx) => (
                              <tr key={rowIdx}>
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx} style={{ padding: "0.3rem", border: "1px solid #e8d5b5" }}>
                                    <input type="text" className={styles.input}
                                      style={{ padding: "0.25rem 0.4rem", fontSize: "0.82rem" }}
                                      value={cell} placeholder="—"
                                      onChange={(e) => updateTableCell(idx, rowIdx, colIdx, e.target.value)} />
                                  </td>
                                ))}
                                <td style={{ padding: "0.3rem", width: "2rem", textAlign: "center" }}>
                                  <button type="button"
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#c85a5a", fontSize: "0.75rem" }}
                                    onClick={() => removeTableRow(idx, rowIdx)}
                                    disabled={(block.tableRows?.length ?? 1) <= 1}>✕</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button type="button" className={styles.addImageBtn} onClick={() => addTableRow(idx)}>+ Add Row</button>
                        <button type="button" className={styles.addImageBtn} onClick={() => addTableCol(idx)}>+ Add Column</button>
                      </div>
                    </div>
                  )}

                  {block.type === "callout" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {CALLOUT_VARIANTS.map((v) => (
                          <button key={v} type="button"
                            className={`${styles.layoutBtn} ${block.calloutVariant === v ? styles.layoutBtnActive : ""}`}
                            onClick={() => updateBlock(idx, { calloutVariant: v })}>
                            {CALLOUT_ICONS[v]} {v.charAt(0).toUpperCase() + v.slice(1)}
                          </button>
                        ))}
                      </div>
                      <div className={styles.inputWrap}>
                        <input type="text" className={styles.input}
                          value={block.calloutTitle ?? ""} maxLength={100}
                          onChange={(e) => updateBlock(idx, { calloutTitle: e.target.value })} />
                      </div>
                      <div className={styles.inputWrap}>
                        <textarea className={`${styles.input} ${styles.textarea}`} style={{ minHeight: "5rem" }}
                          value={block.text ?? ""} rows={3}
                          onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {block.type === "spacer" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <label className={styles.imageSubLabel} style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Height (px):</label>
                      <input type="range" min={10} max={200} step={10}
                        value={block.spacerHeight ?? 40}
                        onChange={(e) => updateBlock(idx, { spacerHeight: Number(e.target.value) })}
                        style={{ flex: 1 }} />
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#a07840", fontSize: "0.9rem", minWidth: "3rem" }}>
                        {block.spacerHeight ?? 40}px
                      </span>
                    </div>
                  )}

                  {block.type === "html" && (
                    <div className={styles.inputWrap} style={{ marginBottom: 0 }}>
                      <textarea className={`${styles.input} ${styles.textarea}`}
                        style={{ minHeight: "8rem", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: "0.85rem", backgroundColor: "rgba(0,0,0,0.03)" }}
                        value={block.text ?? ""} rows={6} spellCheck={false}
                        onChange={(e) => updateBlock(idx, { text: e.target.value })} />
                    </div>
                  )}

                  {block.type === "divider" && (
                    <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.88rem", color: "#a07840", fontStyle: "italic", padding: "0.3rem 0" }}>
                    A visual separator will be rendered here
                    </div>
                  )}

                  {block.type === "images" && (
                    <>
                      <div className={styles.layoutSelector}>
                        {(Object.keys(LAYOUT_LABELS) as ImageLayout[]).map((lay) => (
                          <button key={lay} type="button"
                            className={`${styles.layoutBtn} ${block.imageLayout === lay ? styles.layoutBtnActive : ""}`}
                            onClick={() => updateBlock(idx, { imageLayout: lay })}>
                            {LAYOUT_LABELS[lay]}
                          </button>
                        ))}
                      </div>

                      <div className={styles.imageSubList}>
                        {(block.images ?? []).map((img) => (
                          <div key={img.id} className={styles.imageSubItem}>
                            {img.src
                              ? <img src={img.src} alt={img.caption || "img"} className={styles.imageSubThumb}
                                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                              : <div className={styles.imageSubThumbEmpty}>🖼</div>
                            }

                            <div className={styles.imageSubFields}>
                              <div>
                                <p className={styles.imageSubLabel}>Image URL or Upload</p>
                                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                  <div className={styles.inputWrap} style={{ flex: 1 }}>
                                    <input type="text" className={styles.input}
                                      value={img.tempUrlInput ?? img.src}
                                      onChange={(e) => updateImageItem(idx, img.id, { tempUrlInput: e.target.value })}
                                      onBlur={(e) => {
                                        const url = e.target.value.trim();
                                        if (url) updateImageItem(idx, img.id, { src: url, tempUrlInput: undefined });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          const url = (e.target as HTMLInputElement).value.trim();
                                          if (url) updateImageItem(idx, img.id, { src: url, tempUrlInput: undefined });
                                        }
                                      }} />
                                  </div>
                                  <button type="button"
                                    style={{ padding: "0.45rem 0.65rem", border: "1.5px dashed rgba(224,123,0,0.35)", borderRadius: "6px", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: "#a07840", whiteSpace: "nowrap" }}
                                    onClick={() => imageFileRefs.current[img.id]?.click()}>📁</button>
                                  <input
                                    ref={(el) => { imageFileRefs.current[img.id] = el; }}
                                    type="file" accept="image/*" style={{ display: "none" }}
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleImageFile(idx, img.id, f);
                                      if (e.target) e.target.value = "";
                                    }} />
                                </div>
                              </div>

                              <div>
                                <p className={styles.imageSubLabel}>Alt Text (SEO)</p>
                                <div className={styles.inputWrap}>
                                  <input type="text" className={styles.input}
                                    value={img.altText ?? ""} maxLength={150}
                                    onChange={(e) => updateImageItem(idx, img.id, { altText: e.target.value })} />
                                </div>
                              </div>

                              <div>
                                <p className={styles.imageSubLabel}>Caption</p>
                                <div className={styles.inputWrap}>
                                  <input type="text" className={styles.input}
                                    value={img.caption} maxLength={200}
                                    onChange={(e) => updateImageItem(idx, img.id, { caption: e.target.value })} />
                                  <span className={styles.charCount} style={{ top: "50%", transform: "translateY(-50%)", bottom: "auto" }}>{img.caption.length}/200</span>
                                </div>
                              </div>
                            </div>

                            <button type="button" className={styles.imageSubRemove}
                              onClick={() => removeImageItem(idx, img.id)}
                              disabled={(block.images ?? []).length <= 1}>✕</button>
                          </div>
                        ))}
                      </div>

                      <button type="button" className={styles.addImageBtn} onClick={() => addImageItem(idx)}>+ Add Image</button>
                    </>
                  )}

                </div>
              </div>
            ))}

            <div className={styles.addBlockRow} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.6rem" }}>
              {BLOCK_GROUPS.map((group) => (
                <div key={group.label} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.4rem", width: "100%" }}>
                  <span className={styles.addBlockLabel} style={{ minWidth: "4.5rem", fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "#b08850" }}>
                    {group.label}:
                  </span>
                  {group.types.map((t) => (
                    <button key={t} type="button" className={styles.addBlockBtn} onClick={() => addBlock(t)}>
                      <span style={{ marginRight: "0.3em" }}>{TYPE_ICONS[t]}</span>
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* 4. SEO SETTINGS */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>SEO Settings</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Meta Title</label>
            <div className={styles.inputWrap}>
              <input type="text" className={styles.input}
                placeholder={form.title} value={form.metaTitle} maxLength={70}
                onChange={(e) => set("metaTitle", e.target.value)} />
              <span className={styles.charCount}>{form.metaTitle.length}/70</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Meta Description</label>
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                placeholder={form.excerpt} value={form.metaDescription} maxLength={160} rows={2}
                onChange={(e) => set("metaDescription", e.target.value)} />
              <span className={styles.charCount}>{form.metaDescription.length}/160</span>
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Meta Keywords</label>
            <div className={styles.tagsRow}>
              {form.metaKeywords.map((k) => (
                <span key={k} className={styles.tagChip}>
                  {k}
                  <button type="button" className={styles.tagRemove} onClick={() => removeMetaKeyword(k)}>✕</button>
                </span>
              ))}
              <input
                type="text" className={styles.tagInput}
                placeholder={form.metaKeywords.length === 0 ? "yoga teacher training, rishikesh..." : "Add keyword…"}
                value={metaKeywordInput} onChange={(e) => setMetaKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addMetaKeyword(metaKeywordInput); setMetaKeywordInput(""); }
                  if (e.key === "Backspace" && !metaKeywordInput && form.metaKeywords.length > 0) removeMetaKeyword(form.metaKeywords[form.metaKeywords.length - 1]);
                }}
                onBlur={() => { if (metaKeywordInput.trim()) { addMetaKeyword(metaKeywordInput); setMetaKeywordInput(""); } }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/blog" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button" className={styles.draftBtn}
            onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            Save as Draft
          </button>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Update Post</>}
          </button>
        </div>

      </div>
    </div>
  );
}