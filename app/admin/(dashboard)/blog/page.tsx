"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Blog.module.css";
import { Blog, BlogListItem, BlogStatus } from "@/types/blog";
import {
  getAllBlogsAdmin,
  updateBlogStatus,
  deleteBlog,
  resolveImage,
} from "@/lib/api/blogs";

function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

function normalise(raw: Blog): BlogListItem {
  return {
    id: raw._id,
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? "",
    date: raw.date
      ? new Date(raw.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "",
    author: raw.author ?? "",
    category: raw.category ?? "",
    image: resolveImage(raw.coverImage),
    tags: raw.tags ?? [],
    sectionCount: Array.isArray(raw.content) ? raw.content.length : 0,
    status: raw.status === "Published" ? "Published" : "Draft",
  };
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { isMobile, isTablet, width } = useBreakpoint();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBlogsAdmin();
        setBlogs(data.map(normalise));
      } catch (err) {
        console.error("Fetch blogs error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const toggleStatus = async (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog || togglingId) return;

    const newStatus: BlogStatus = blog.status === "Published" ? "Draft" : "Published";

    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    setTogglingId(id);

    try {
      await updateBlogStatus(id, newStatus);
    } catch (err) {
      console.error("Toggle status error:", err);
      setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status: blog.status } : b)));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setIsDeleting(true);
      await deleteBlog(deleteModal);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteModal));
      setDeleteModal(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const Status = ({ b }: { b: BlogListItem }) => (
    <button
      className={`${styles.statusBadge} ${
        b.status === "Published" ? styles.statusPublished : styles.statusDraft
      }`}
      onClick={() => toggleStatus(b.id)}
      disabled={togglingId === b.id}
      title="Click to toggle status"
    >
      <span className={styles.statusDot} />
      {togglingId === b.id ? "…" : b.status}
    </button>
  );

  const Actions = ({ b }: { b: BlogListItem }) => (
    <div className={styles.actionBtns}>
      <Link href={`/admin/blog/${b.id}`} className={styles.editBtn}>
        <span>✎</span>
        <span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(b.id)}>
        <span>✕</span>
        <span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <p className={styles.successText}>Loading blog posts…</p>
        </div>
      </div>
    );
  }

  const MobileCards = () => (
    <div className={styles.cardList}>
      {blogs.map((b) => (
        <div key={b.id} className={styles.card}>
          {b.image ? (
            <img
              src={b.image}
              alt={b.title}
              className={styles.cardImg}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className={styles.cardImgEmpty}>🖼</div>
          )}
          <div className={styles.cardBody}>
            <p className={styles.blogTitle}>{b.title}</p>
            <p className={styles.blogExcerpt}>{b.excerpt}</p>
            <div className={styles.cardMeta}>
              <span className={styles.categoryChip}>{b.category}</span>
              <span className={styles.sectionCountBadge}>📄 {b.sectionCount} blocks</span>
              <Status b={b} />
            </div>
            <p className={styles.blogMeta}>
              {b.date}
              {b.author ? ` · ${b.author}` : ""}
            </p>
          </div>
          <div className={styles.cardFooter}>
            <Actions b={b} />
          </div>
        </div>
      ))}
    </div>
  );

  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Cover</th>
            <th>Title</th>
            <th style={{ width: 110 }}>Category</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id} className={styles.row}>
              <td className={styles.tdCenter}>
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.title}
                    className={styles.blogThumb}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.blogThumbEmpty}>🖼</div>
                )}
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td>
                <span className={styles.categoryChip}>{b.category}</span>
              </td>
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Cover</th>
            <th>Title / Excerpt</th>
            <th style={{ width: 150 }}>Category</th>
            {width >= 1024 && <th style={{ width: 120 }}>Author</th>}
            {width >= 1024 && <th style={{ width: 100 }}>Date</th>}
            {width >= 1024 && <th style={{ width: 90 }}>Blocks</th>}
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id} className={styles.row}>
              <td className={styles.tdCenter}>
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.title}
                    className={styles.blogThumb}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.blogThumbEmpty}>🖼</div>
                )}
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td>
                <span className={styles.categoryChip}>{b.category}</span>
              </td>
              {width >= 1024 && (
                <td>
                  <p className={styles.blogMeta}>{b.author || "—"}</p>
                </td>
              )}
              {width >= 1024 && (
                <td>
                  <p className={styles.blogMeta}>{b.date}</p>
                </td>
              )}
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <span className={styles.sectionCountBadge}>📄 {b.sectionCount}</span>
                </td>
              )}
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSubtitle}>
            Manage all blog articles — click status to toggle Published / Draft
          </p>
        </div>
        <Link href="/admin/blog/add-new" className={styles.addBtn}>
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>New Blog Post</span>
        </Link>
      </div>

   

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {!isLoading && blogs.length === 0 && (
        <div className={styles.empty}>
        
          <p>No blog posts found. Write your first post.</p>
        </div>
      )}

      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => !isDeleting && setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          
            <h3 className={styles.modalTitle}>Delete Blog Post?</h3>
            <p className={styles.modalText}>
              This will permanently remove the post and all its content. This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteModal(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}