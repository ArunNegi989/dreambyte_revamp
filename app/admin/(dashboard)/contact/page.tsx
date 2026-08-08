"use client";

import { useEffect, useMemo, useState } from "react";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./contact.module.css";
import { ContactMessage } from "@/types/contact";
import { fetchContactMessages, markContactAsRead, deleteContactMessage } from "@/lib/api/contact";

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

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // ---- pagination state (applies to the message list panel) ----
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const data = await fetchContactMessages();
      setMessages(data);
      if (data.length > 0) setActiveId(data[0]._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(
    () =>
      messages.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.message.toLowerCase().includes(query.toLowerCase())
      ),
    [messages, query]
  );

  /* ---------- pagination derived state ---------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // search badalte hi page 1 par wapas
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // delete ke baad agar current page khali ho jaye to pichle valid page par le jao
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
  }

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const active = messages.find((m) => m._id === activeId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  async function openMessage(id: string) {
    setActiveId(id);
    const target = messages.find((m) => m._id === id);
    if (target && !target.read) {
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
      try {
        await markContactAsRead(id);
      } catch {
        // revert on failure
        setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: false } : m)));
      }
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;
    const prevMessages = messages;
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (activeId === id) setActiveId(null);
    try {
      await deleteContactMessage(id);
    } catch (err) {
      setMessages(prevMessages); // revert on failure
      setError(err instanceof Error ? err.message : "Failed to delete message");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Contact Messages</h1>
      <p className={ui.pageSubtitle}>Enquiries submitted from the website</p>

      {error && <div style={{ color: "#ff6b6b", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}

      <div className={ui.pageHeadRow}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className={`${ui.badge} ${ui.badgeAmber}`}>
          <span className={ui.badgeDot} />
          {unreadCount} Unread
        </span>
      </div>

      {loading ? (
        <div className={ui.emptyState}>Loading messages...</div>
      ) : (
        <div className={styles.inbox}>
          <div className={`${ui.panel} ${styles.listPanel}`}>
            <ul className={styles.msgList}>
              {paginated.map((m) => (
                <li
                  key={m._id}
                  className={`${styles.msgRow} ${activeId === m._id ? styles.msgRowActive : ""}`}
                  onClick={() => openMessage(m._id)}
                >
                  <span className={`${styles.unreadDot} ${!m.read ? styles.unreadDotOn : ""}`} />
                  <div className={styles.msgMain}>
                    <div className={styles.msgTop}>
                      <strong>{m.name}</strong>
                      <span className={styles.msgTime}>{formatDate(m.createdAt).split(",")[0]}</span>
                    </div>
                    <p>{m.message}</p>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && <div className={ui.emptyState}>No messages found.</div>}
            </ul>

            {/* ---------- Pagination (list panel only) ---------- */}
            {filtered.length > 0 && (
              <div className={styles.paginationWrap}>
                <span className={styles.paginationRange}>
                  {rangeStart}–{rangeEnd} of {filtered.length}
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
          </div>

          <div className={`${ui.panel} ${styles.detailPanel}`}>
            {active ? (
              <>
                <div className={styles.detailHead}>
                  <div>
                    <h2>{active.name}</h2>
                    <p className={styles.detailMeta}>
                      <a href={`mailto:${active.email}`}>{active.email}</a>
                      {active.phone && (
                        <>
                          {" "}
                          &middot; <a href={`tel:${active.phone.replace(/\s/g, "")}`}>{active.phone}</a>
                        </>
                      )}
                    </p>
                  </div>
                  <button className={ui.iconBtn} onClick={() => handleDelete(active._id)} aria-label="Delete">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                    </svg>
                  </button>
                </div>
                <p className={styles.detailDate}>{formatDate(active.createdAt)}</p>
                {active.subject && (
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{active.subject}</p>
                )}
                <p className={styles.detailBody}>{active.message}</p>
                <a href={`mailto:${active.email}`} className={ui.btnPrimary}>
                  Reply by Email
                </a>
              </>
            ) : (
              <div className={ui.emptyState}>Select a message to view details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}