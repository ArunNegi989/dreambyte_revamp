"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./dashboard.module.css";

import { fetchContactMessages } from "@/lib/api/contact";
import { fetchCareers } from "@/lib/api/careers";
import { getAllBlogsAdmin } from "@/lib/api/blogs";
import { fetchPortfolioProjects } from "@/lib/api/portfolio";
import { fetchBrands } from "@/lib/api/brands";

import { ContactMessage } from "@/types/contact";
import { Career } from "@/types/career";
import { Blog } from "@/types/blog";
import { PortfolioProject } from "@/types/portfolio";
import { Brand } from "@/types/brand";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
const ICONS = {
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6l9 7 9-7" />
    </svg>
  ),
  briefcase: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M2.5 12.5h19" />
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  images: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2.5" y="4" width="14" height="14" rx="2" />
      <path d="M4 15l4-4 3 3 4-5 4.5 6" />
    </svg>
  ),
  brands: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Small date helpers                                                 */
/* ------------------------------------------------------------------ */
function timeAgo(dateStr?: string) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  if (Number.isNaN(diffMs)) return "";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatShortDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminDashboardPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);
  const [panelErrors, setPanelErrors] = useState<{
    messages?: string;
    careers?: string;
    blogs?: string;
    portfolio?: string;
    brands?: string;
  }>({});

  /* ---------- fetch everything in parallel; partial failures ok ---------- */
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      const [messagesRes, careersRes, blogsRes, portfolioRes, brandsRes] = await Promise.allSettled([
        fetchContactMessages(),
        fetchCareers(),
        getAllBlogsAdmin(),
        fetchPortfolioProjects(),
        fetchBrands(),
      ]);

      if (ignore) return;

      const errs: typeof panelErrors = {};

      if (messagesRes.status === "fulfilled") setMessages(messagesRes.value);
      else errs.messages = "Messages load nahi ho paaye.";

      if (careersRes.status === "fulfilled") setCareers(careersRes.value);
      else errs.careers = "Careers load nahi ho paaye.";

      if (blogsRes.status === "fulfilled") setBlogs(blogsRes.value);
      else errs.blogs = "Blog posts load nahi ho paaye.";

      if (portfolioRes.status === "fulfilled") setPortfolio(portfolioRes.value);
      else errs.portfolio = "Portfolio load nahi ho paaya.";

      if (brandsRes.status === "fulfilled") setBrands(brandsRes.value);
      else errs.brands = "Brands load nahi ho paaye.";

      setPanelErrors(errs);
      setLoading(false);
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------- derived stat cards ---------- */
  const stats = useMemo(() => {
    const unread = messages.filter((m) => !m.read).length;
    const activeCareers = careers.filter((c) => c.isActive).length;
    const drafts = blogs.filter((b) => b.status === "Draft").length;
    const categories = new Set(portfolio.map((p) => p.category)).size;
    const activeBrands = brands.filter((b) => b.isActive).length;

    return [
      {
        label: "Unread Messages",
        value: String(unread),
        trend: `${messages.length} total`,
        icon: "mail" as const,
      },
      {
        label: "Open Positions",
        value: String(activeCareers),
        trend: `${careers.length} total roles`,
        icon: "briefcase" as const,
      },
      {
        label: "Blog Posts",
        value: String(blogs.length),
        trend: `${drafts} drafts`,
        icon: "file" as const,
      },
      {
        label: "Portfolio Projects",
        value: String(portfolio.length),
        trend: `${categories} categories`,
        icon: "images" as const,
      },
      {
        label: "Brands",
        value: String(brands.length),
        trend: `${activeBrands} active`,
        icon: "brands" as const,
      },
    ];
  }, [messages, careers, blogs, portfolio, brands]);

  /* ---------- recent activity lists ---------- */
  const recentMessages = useMemo(
    () =>
      [...messages]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 4),
    [messages]
  );

  const recentPosts = useMemo(
    () =>
      [...blogs]
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt || 0).getTime() -
            new Date(a.date || a.createdAt || 0).getTime()
        )
        .slice(0, 3),
    [blogs]
  );

  return (
    <div>
      <h1 className={ui.pageTitle}>Dashboard</h1>
      <p className={ui.pageSubtitle}>Overview of your website activity</p>

      {/* ---------- Stat cards ---------- */}
      <div className={`${ui.statGrid} ${styles.statGridFive}`}>
        {stats.map((s) => (
          <div className={ui.statCard} key={s.label}>
            <div>
              <span>{s.label}</span>
              <strong>{loading ? "—" : s.value}</strong>
              <div className={styles.trend}>{loading ? "Loading..." : s.trend}</div>
            </div>
            <span className={ui.statIcon}>{ICONS[s.icon]}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* ---------- Recent Messages ---------- */}
        <div className={ui.panel}>
          <div className={ui.panelHead}>
            <h3>Recent Messages</h3>
            <Link href="/admin/contact" className={ui.panelLink}>
              View all
            </Link>
          </div>

          {loading ? (
            <div className={ui.emptyState}>Loading messages...</div>
          ) : panelErrors.messages ? (
            <div className={ui.emptyState}>{panelErrors.messages}</div>
          ) : recentMessages.length === 0 ? (
            <div className={ui.emptyState}>No messages yet.</div>
          ) : (
            <ul className={styles.list}>
              {recentMessages.map((m) => (
                <li key={m._id} className={styles.listRow}>
                  <span className={`${styles.dot} ${!m.read ? styles.dotUnread : ""}`} />
                  <div className={styles.listMain}>
                    <strong>{m.name}</strong>
                    <span>{m.subject}</span>
                  </div>
                  <span className={styles.listTime}>{timeAgo(m.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---------- Recent Blog Posts ---------- */}
        <div className={ui.panel}>
          <div className={ui.panelHead}>
            <h3>Recent Blog Posts</h3>
            <Link href="/admin/blog" className={ui.panelLink}>
              View all
            </Link>
          </div>

          {loading ? (
            <div className={ui.emptyState}>Loading posts...</div>
          ) : panelErrors.blogs ? (
            <div className={ui.emptyState}>{panelErrors.blogs}</div>
          ) : recentPosts.length === 0 ? (
            <div className={ui.emptyState}>No blog posts yet.</div>
          ) : (
            <ul className={styles.list}>
              {recentPosts.map((p) => (
                <li key={p._id} className={styles.listRow}>
                  <div className={styles.listMain}>
                    <strong>{p.title}</strong>
                    <span
                      className={`${ui.badge} ${
                        p.status === "Published" ? ui.badgeGreen : ui.badgeMuted
                      }`}
                    >
                      <span className={ui.badgeDot} />
                      {p.status}
                    </span>
                  </div>
                  <span className={styles.listTime}>{formatShortDate(p.date || p.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}