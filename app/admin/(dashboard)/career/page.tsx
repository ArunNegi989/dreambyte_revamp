"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiAlertTriangle } from "react-icons/fi";
import styles from "./Career.module.css";
import { Career } from "@/types/career";
import { fetchCareers, deleteCareer } from "@/lib/api/careers";

export default function CareerListPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCareers();
  }, []);

  async function loadCareers() {
    setLoading(true);
    try {
      const data = await fetchCareers();
      setCareers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load careers");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCareer(deleteTarget._id);
      setCareers((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete career");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Careers</h1>
          <p className={styles.subtitle}>Manage open roles shown on the careers page</p>
        </div>
        <Link href="/admin/career/add-new" className={styles.addBtn}>
          <FiPlus /> Add New Role
        </Link>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p className={styles.stateText}>Loading careers...</p>
      ) : careers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No roles added yet.</p>
          <Link href="/admin/career/add-new" className={styles.addBtn}>
            <FiPlus /> Add your first role
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Tagline</th>
                <th>Department</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career) => (
                <tr key={career._id}>
                  <td className={styles.titleCell}>{career.title}</td>
                  <td className={styles.taglineCell}>{career.tagline}</td>
                  <td>
                    <span className={styles.deptBadge}>{career.dept}</span>
                  </td>
                  <td>{career.type}</td>
                  <td>{career.location}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        career.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {career.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <Link
                        href={`/admin/career/edit/${career._id}`}
                        className={styles.iconBtn}
                        title="Edit role"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                        title="Delete role"
                        onClick={() => setDeleteTarget(career)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <FiAlertTriangle className={styles.modalIcon} />
            <h3 className={styles.modalTitle}>Delete Role?</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This cannot
              be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}