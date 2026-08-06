"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiPlus, FiX } from "react-icons/fi";
import styles from "../../Career.module.css";
import { Dept } from "@/types/career";
import { fetchCareerById, updateCareer } from "@/lib/api/careers";

const DEPTS: Dept[] = ["Engineering", "Marketing", "Sales", "Design"];

export default function EditCareerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [dept, setDept] = useState<Dept>("Engineering");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
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

  useEffect(() => {
    if (!id) return;
    fetchCareerById(id)
      .then((career) => {
        setSlug(career.slug);
        setTitle(career.title);
        setTagline(career.tagline);
        setDept(career.dept);
        setType(career.type);
        setLocation(career.location);
        setDate(career.date);
        setOverview(career.overview);
        setResponsibilities(career.responsibilities.length ? career.responsibilities : [""]);
        setQualifications(career.qualifications.length ? career.qualifications : [""]);
        setIsActive(career.isActive);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load role"))
      .finally(() => setLoading(false));
  }, [id]);

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
      await updateCareer(id, {
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
      setFeedback({ type: "success", message: "Role updated successfully!" });
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

  if (loading) return <p className={styles.stateText}>Loading role...</p>;

  if (loadError) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.errorText}>{loadError}</p>
        <button className={styles.cancelBtn} onClick={() => router.push("/admin/career")}>
          Back to Careers
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.backBtn} onClick={() => router.push("/admin/career")}>
        <FiArrowLeft /> Back to Careers
      </button>

      <div className={styles.card}>
        <h2 className={styles.heading}>Edit Role</h2>

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
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Slug (URL)</label>
            <input
              type="text"
              className={styles.input}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span className={styles.hint}>Used in /career/[slug] — change carefully, old links will break</span>
            {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tagline</label>
            <input
              type="text"
              className={styles.input}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
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
              <input type="text" className={styles.input} value={type} onChange={(e) => setType(e.target.value)} />
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
              <input type="text" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
              {errors.date && <span className={styles.errorText}>{errors.date}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Position Overview</label>
            <textarea
              className={styles.textarea}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
            />
            {errors.overview && <span className={styles.errorText}>{errors.overview}</span>}
          </div>

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
              {submitting ? "Saving..." : <><FiCheck /> Update Role</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}