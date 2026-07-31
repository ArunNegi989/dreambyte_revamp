"use client";

import Link from "next/link";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./dashboard.module.css";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with real API calls to your Express backend    */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Unread Messages", value: "4", trend: "+2 today", icon: "mail" as const },
  { label: "Open Positions", value: "3", trend: "1 closing soon", icon: "briefcase" as const },
  { label: "Blog Posts", value: "18", trend: "2 drafts", icon: "file" as const },
  { label: "Portfolio Projects", value: "27", trend: "+3 this month", icon: "images" as const },
];

const RECENT_MESSAGES = [
  { name: "Prachi Pant", subject: "Website redesign enquiry", time: "2h ago", unread: true },
  { name: "Vikas Manral", subject: "SEO package pricing", time: "5h ago", unread: true },
  { name: "Manish Rathore", subject: "Portfolio collaboration", time: "1d ago", unread: false },
  { name: "Jyoti Pandey", subject: "Social media management", time: "2d ago", unread: false },
];

const RECENT_POSTS = [
  { title: "Top 10 SEO Trends for Dehradun Businesses in 2026", status: "Published", date: "Jul 24" },
  { title: "Why Every Startup Needs a Performance Marketing Plan", status: "Draft", date: "Jul 20" },
  { title: "Behind the Scenes: Erika Henna Herbal Rebrand", status: "Published", date: "Jul 12" },
];

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
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className={ui.pageTitle}>Dashboard</h1>
      <p className={ui.pageSubtitle}>Overview of your website activity</p>

      <div className={ui.statGrid}>
        {STATS.map((s) => (
          <div className={ui.statCard} key={s.label}>
            <div>
              <span>{s.label}</span>
              <strong>{s.value}</strong>
              <div className={styles.trend}>{s.trend}</div>
            </div>
            <span className={ui.statIcon}>{ICONS[s.icon]}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={ui.panel}>
          <div className={ui.panelHead}>
            <h3>Recent Messages</h3>
            <Link href="/admin/contact" className={ui.panelLink}>
              View all
            </Link>
          </div>
          <ul className={styles.list}>
            {RECENT_MESSAGES.map((m) => (
              <li key={m.subject} className={styles.listRow}>
                <span className={`${styles.dot} ${m.unread ? styles.dotUnread : ""}`} />
                <div className={styles.listMain}>
                  <strong>{m.name}</strong>
                  <span>{m.subject}</span>
                </div>
                <span className={styles.listTime}>{m.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.panel}>
          <div className={ui.panelHead}>
            <h3>Recent Blog Posts</h3>
            <Link href="/admin/blog" className={ui.panelLink}>
              View all
            </Link>
          </div>
          <ul className={styles.list}>
            {RECENT_POSTS.map((p) => (
              <li key={p.title} className={styles.listRow}>
                <div className={styles.listMain}>
                  <strong>{p.title}</strong>
                  <span
                    className={`${ui.badge} ${p.status === "Published" ? ui.badgeGreen : ui.badgeMuted}`}
                  >
                    <span className={ui.badgeDot} />
                    {p.status}
                  </span>
                </div>
                <span className={styles.listTime}>{p.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}