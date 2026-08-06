"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiPlus, FiX } from "react-icons/fi";
import styles from "../Career.module.css";
import { Dept } from "@/types/career";
import { createCareer } from "@/lib/api/careers";

const DEPTS: Dept[] = ["Engineering", "Marketing", "Sales", "Design"];

export default function AddCareerPage() {
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [dept, setDept] = useState<Dept>("Engineering");
  const [type, setType] = useState("Full-time");
  const [location, setLocation] = useState("Dehradun, India");
  const [date, setDate] = useState("");
  const [overview, setOverview] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [qualifications, setQualifications] = useState<string[]>([""]);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  function updateListItem(
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    value: string
  ) {
    const next = [...list];
    next[index] = value;
    setList(next);
  }

  function addListItem(list: string[], setList: (v: string[]) => void) {
    setList([...list, ""]);
  }

  function removeListItem(list: string[], setList: (v: string[]) => void, index: number) {
    if (list.length === 1) {
      setList([""]);
      return;
    }
    setList(list.filter((_, i) => i !== index));
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    if (!tagline.trim()) newErrors.tagline = "Tagline is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!date.trim()) newErrors.date = "Posted date is required";
    if (!overview.trim()) newErrors.overview = "Overview is required";
    if (!responsibilities.some((r) => r.trim()))
      newErrors.responsibilities = "At least one responsibility is required";
    if (!qualifications.some((q) => q.trim()))
      newErrors.qualifications = "At least one qualification is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createCareer({
        slug,
        title,
        tagline,
        dept,
        type,
        location,
        date,
        overview,
        responsibilities: responsibilities.filter((r) => r.trim()),
        qualifications: qualifications.filter((q) => q.trim()),
        isActive,
      });
      setFeedback({ type: "success", message: "Role added successfully!" });
      setTimeout(() => router.push("/admin/career"), 900);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.backBtn} onClick={() => router.push("/admin/career")}>
        <FiArrowLeft /> Back to Careers
      </button>

      <div className={styles.card}>
        <h2 className={styles.heading}>Add New Role</h2>

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
          <div className={styles.field}>
            <label className={styles.label}>Role Title</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Slug (URL)</label>
            <input
              type="text"
              className={styles.input}
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="senior-frontend-developer"
            />
            <span className={styles.hint}>Auto-generated from title — used in /career/[slug]</span>
            {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tagline</label>
            <input
              type="text"
              className={styles.input}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short one-line summary of the role"
            />
            {errors.tagline && <span className={styles.errorText}>{errors.tagline}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <select className={styles.select} value={dept} onChange={(e) => setDept(e.target.value as Dept)}>
                {DEPTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Employment Type</label>
              <input
                type="text"
                className={styles.input}
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Full-time / Internship"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                className={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && <span className={styles.errorText}>{errors.location}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Posted Date</label>
              <input
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Aug 2026"
              />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Position Overview</label>
            <textarea
              className={styles.textarea}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe the role..."
            />
            {errors.overview && <span className={styles.errorText}>{errors.overview}</span>}
          </div>

          {/* Responsibilities */}
          <div className={styles.field}>
            <div className={styles.listFieldHeader}>
              <label className={styles.label}>Key Responsibilities</label>
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() => addListItem(responsibilities, setResponsibilities)}
              >
                <FiPlus /> Add
              </button>
            </div>
            {responsibilities.map((item, idx) => (
              <div key={idx} className={styles.listItemRow}>
                <input
                  type="text"
                  className={styles.listItemInput}
                  value={item}
                  onChange={(e) =>
                    updateListItem(responsibilities, setResponsibilities, idx, e.target.value)
                  }
                  placeholder={`Responsibility ${idx + 1}`}
                />
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() => removeListItem(responsibilities, setResponsibilities, idx)}
                >
                  <FiX />
                </button>
              </div>
            ))}
            {errors.responsibilities && (
              <span className={styles.errorText}>{errors.responsibilities}</span>
            )}
          </div>

          {/* Qualifications */}
          <div className={styles.field}>
            <div className={styles.listFieldHeader}>
              <label className={styles.label}>Qualifications & Experience</label>
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() => addListItem(qualifications, setQualifications)}
              >
                <FiPlus /> Add
              </button>
            </div>
            {qualifications.map((item, idx) => (
              <div key={idx} className={styles.listItemRow}>
                <input
                  type="text"
                  className={styles.listItemInput}
                  value={item}
                  onChange={(e) =>
                    updateListItem(qualifications, setQualifications, idx, e.target.value)
                  }
                  placeholder={`Qualification ${idx + 1}`}
                />
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() => removeListItem(qualifications, setQualifications, idx)}
                >
                  <FiX />
                </button>
              </div>
            ))}
            {errors.qualifications && (
              <span className={styles.errorText}>{errors.qualifications}</span>
            )}
          </div>

          <div className={styles.toggleField}>
            <label className={styles.toggleLabel}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <span className={styles.toggleTrack}>
                <span className={styles.toggleThumb} />
              </span>
              Active (visible on careers page)
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => router.push("/admin/career")}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Saving..." : <><FiCheck /> Add Role</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}