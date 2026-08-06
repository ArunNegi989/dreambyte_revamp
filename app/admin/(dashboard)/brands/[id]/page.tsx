"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiUploadCloud, FiX, FiArrowLeft, FiCheck } from "react-icons/fi";
import styles from "../brands.module.css";
import { BrandRow } from "@/types/brand";
import { fetchBrandById, updateBrand } from "@/lib/api/brands";
import { getAssetUrl } from "@/lib/getAssetUrl";

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [row, setRow] = useState<BrandRow>("rowOne");
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBrandById(id)
      .then((brand) => {
        setName(brand.name);
        setAlt(brand.alt);
        setRow(brand.row);
        setOrder(brand.order);
        setIsActive(brand.isActive);
        setExistingLogo(brand.logo); // raw relative path DB ke liye rakh lo
        setPreviewUrl(getAssetUrl(brand.logo)); // display ke liye full URL
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Failed to load brand")
      )
      .finally(() => setLoading(false));
  }, [id]);

  function handleFileSelect(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, logo: "Please select a valid image file" }));
      return;
    }
    setErrors((prev) => ({ ...prev, logo: "" }));
    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  function removeLogo() {
    setLogoFile(null);
    setPreviewUrl(getAssetUrl(existingLogo)); // remove pe wapas existing logo (full URL) dikhao
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Brand name is required";
    if (!alt.trim()) newErrors.alt = "Alt text is required";
    if (!order || order < 1) newErrors.order = "Order must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await updateBrand(id, { name, alt, row, order, isActive, logoFile });
      setFeedback({ type: "success", message: "Brand updated successfully!" });
      setTimeout(() => router.push("/admin/brands"), 900);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className={styles.stateText}>Loading brand...</p>;
  }

  if (loadError) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.errorText}>{loadError}</p>
        <button className={styles.cancelBtn} onClick={() => router.push("/admin/brands")}>
          Back to Brands
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => router.push("/admin/brands")}
      >
        <FiArrowLeft /> Back to Brands
      </button>

      <div className={styles.card}>
        <h2 className={styles.heading}>Edit Brand</h2>

        {feedback && (
          <div
            className={`${styles.feedback} ${
              feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Logo upload */}
          <div className={styles.field}>
            <label className={styles.label}>Brand Logo</label>
            <div
              className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className={styles.previewBox}>
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    width={140}
                    height={70}
                    className={styles.previewImg}
                    unoptimized
                  />
                  {logoFile && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLogo();
                      }}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ) : (
                <div className={styles.dropzoneEmpty}>
                  <FiUploadCloud className={styles.uploadIcon} />
                  <p>Drag & drop logo here, or click to browse</p>
                  <span>Leave unchanged to keep existing logo</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              />
            </div>
            {errors.logo && <span className={styles.errorText}>{errors.logo}</span>}
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>Brand Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cosmic Journeys"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Alt text */}
          <div className={styles.field}>
            <label className={styles.label}>Image Alt Text</label>
            <input
              type="text"
              className={styles.input}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Descriptive alt text for accessibility & SEO"
            />
            {errors.alt && <span className={styles.errorText}>{errors.alt}</span>}
          </div>

          <div className={styles.row}>
            {/* Row select */}
            <div className={styles.field}>
              <label className={styles.label}>Marquee Row</label>
              <select
                className={styles.input}
                value={row}
                onChange={(e) => setRow(e.target.value as BrandRow)}
              >
                <option value="rowOne">Row One (left)</option>
                <option value="rowTwo">Row Two (right)</option>
              </select>
            </div>

            {/* Order */}
            <div className={styles.field}>
              <label className={styles.label}>Display Order</label>
              <input
                type="number"
                min={1}
                className={styles.input}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
              {errors.order && <span className={styles.errorText}>{errors.order}</span>}
            </div>
          </div>

          {/* Active toggle */}
          <div className={styles.toggleField}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              Active (visible on website)
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => router.push("/admin/brands")}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Saving..." : <><FiCheck /> Update Brand</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}