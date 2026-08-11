"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiPlus, FiAlertTriangle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./Career.module.css";
import { Career } from "@/types/career";
import { fetchCareers, deleteCareer } from "@/lib/api/careers";

const ITEMS_PER_PAGE = 10;

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

export default function CareerListPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---- pagination state ----
  const [currentPage, setCurrentPage] = useState(1);

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

  /* ---------- pagination derived state ---------- */
  const totalPages = Math.max(1, Math.ceil(careers.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return careers.slice(start, start + ITEMS_PER_PAGE);
  }, [careers, currentPage]);

  // delete ke baad agar current page khali ho jaye to pichle valid page par le jao
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const rangeStart = careers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, careers.length);

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
        <>
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
                {paginated.map((career) => (
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
                          href={`/admin/career/${career._id}`}
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

          {/* ---------- Pagination ---------- */}
          <div className={styles.paginationWrap}>
            <span className={styles.paginationRange}>
              Showing {rangeStart}–{rangeEnd} of {careers.length}
            </span>

            <nav className={styles.pagination} aria-label="Pagination">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FiChevronLeft />
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
                <FiChevronRight />
              </button>
            </nav>
          </div>
        </>
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