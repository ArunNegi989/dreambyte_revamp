"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Pageloader.module.css";

const MIN_VISIBLE_MS = 1500; // loader stays visible at least this long on every navigation
const SAFETY_TIMEOUT_MS = 8000; // auto-hide if something goes wrong

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const shownAt = useRef<number>(0);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ---------------------------------------------------------- */
  /* 1) Show the loader the instant an internal link is clicked  */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const isInternal = href.startsWith("/") && !href.startsWith("//");
      const isSamePage = href === pathname;
      const opensNewTab =
        anchor.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || anchor.hasAttribute("download");

      if (!isInternal || isSamePage || opensNewTab) return;

      shownAt.current = Date.now();
      setLoading(true);

      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => setLoading(false), SAFETY_TIMEOUT_MS);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  /* ---------------------------------------------------------- */
  /* 2) Hide it once the new route has actually rendered          */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    if (!loading) return;

    const elapsed = Date.now() - shownAt.current;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

    const t = setTimeout(() => {
      setLoading(false);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    }, remaining);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading page">
      <img src="/loader.gif" alt="Loading" className={styles.gif} />
    </div>
  );
}