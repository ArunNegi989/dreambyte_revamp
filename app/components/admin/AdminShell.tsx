"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./AdminShell.module.css";

/* ------------------------------------------------------------------ */
/*  Icons — inline SVG, no external icon package required              */
/* ------------------------------------------------------------------ */

const iconProps = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icons = {
  grid: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  briefcase: (
    <svg {...iconProps}>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M2.5 12.5h19" />
    </svg>
  ),
  fileText: (
    <svg {...iconProps}>
      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  ),
  mail: (
    <svg {...iconProps}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6l9 7 9-7" />
    </svg>
  ),
  images: (
    <svg {...iconProps}>
      <rect x="2.5" y="4" width="14" height="14" rx="2" />
      <circle cx="7.5" cy="9" r="1.4" fill="currentColor" stroke="none" />
      <path d="M4 15l4-4 3 3 4-5 4.5 6" />
      <path d="M8 20h11a2 2 0 002-2V7" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Nav config                                                          */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Icons.grid },
  { label: "Brands", href: "/admin/brands", icon: Icons.briefcase },
  { label: "Blog", href: "/admin/blog", icon: Icons.fileText },
  { label: "Portfolio", href: "/admin/portfolio", icon: Icons.images },
  { label: "Career", href: "/admin/career", icon: Icons.briefcase },
  { label: "Contact Messages", href: "/admin/contact", icon: Icons.mail},
];

/* ------------------------------------------------------------------ */
/*  Helper — build initials from a name (e.g. "Lalit Kushwaha" -> "LK") */
/* ------------------------------------------------------------------ */

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

/* ------------------------------------------------------------------ */
/*  Shell — sidebar + content only, no header/topbar, no footer         */
/* ------------------------------------------------------------------ */

export default function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      // even if the API call fails, don't trap the user on the dashboard —
      // still send them to login so they can re-authenticate
      console.error("Logout request failed:", err);
    } finally {
      setLoggingOut(false);
      router.push("/admin/login");
    }
  }

  return (
    <div className={styles.shell}>
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Floating toggle — only relevant on mobile/tablet where the sidebar is a drawer */}
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? Icons.close : Icons.menu}
      </button>

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoMark}>DB</span>
          <span className={styles.logoText}>
            <strong>Dream Byte</strong>
            <span>Admin Panel</span>
          </span>
        </div>

        <nav className={styles.navScroll}>
          <div className={styles.navGroupLabel}>Menu</div>
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {item.label}
                {!!item.badge && <span className={styles.navBadge}>{item.badge}</span>}
              </Link>
            );
          })}

          <div className={styles.navGroupLabel}>Website</div>
          <a
            href="https://dreambytesolution.com"
            target="_blank"
            rel="noreferrer"
            className={styles.navItem}
          >
            {Icons.external}
            View Live Site
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userChip}>
            <span className={styles.userAvatar}>{getInitials(user?.name)}</span>
            <span className={styles.userMeta}>
              <strong>{user?.name ?? "Admin"}</strong>
              <span>{user?.email ?? ""}</span>
            </span>
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {Icons.logout}
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}