"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ServicesSidebar.module.css";

export interface SidebarService {
  name: string;
  href: string;
}

interface ServicesSidebarProps {
  /** Full list of services to show in the "More Services" card */
  services?: SidebarService[];
  /**
   * Name of the service this page belongs to.
   * - Used as the starting point for the rotating "Looking for ___ Service?" CTA
   * - Automatically excluded from the "More Services" list (no point linking to the page you're already on)
   */
  currentService: string;
  /** Phone number shown + dialed on click. Include country code. */
  phone?: string;
  /** Optional heading override for the list card */
  heading?: string;
  /** Milliseconds between CTA rotations. Set to 0 to disable rotation and keep it static on currentService. */
  rotateInterval?: number;
}

const DEFAULT_SERVICES: SidebarService[] = [
  { name: "Graphic Designing", href: "/services/graphic-designing" },
  { name: "Web Development", href: "/services/web-development" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Performance Marketing", href: "/services/performance-marketing" },
  { name: "Photography / Videography", href: "/services/photography-videography" },
  { name: "Event Management", href: "/services/event-management" },
  { name: "Influence Marketing", href: "/services/influence-marketing" },
];

export default function ServicesSidebar({
  services = DEFAULT_SERVICES,
  currentService,
  phone = "+91 8279720490",
  heading = "More Services",
  rotateInterval = 4500,
}: ServicesSidebarProps) {
  const list = services.filter((s) => s.name !== currentService);
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  // CTA rotates through every service name (starting with the current page's
  // service), fading out/in on each change. Shared across all service pages
  // since this component is reused everywhere.
  const rotation = [currentService, ...list.map((s) => s.name)];
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setRotationIndex(0);
    setIsVisible(true);
  }, [currentService]);

  useEffect(() => {
    if (!rotateInterval || rotation.length <= 1) return;

    const fadeOutTimer = setInterval(() => {
      setIsVisible(false);
    }, rotateInterval);

    return () => clearInterval(fadeOutTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotateInterval, rotation.length]);

  useEffect(() => {
    if (isVisible) return;

    // once faded out, swap the word then fade back in
    const swapTimer = setTimeout(() => {
      setRotationIndex((prev) => (prev + 1) % rotation.length);
      setIsVisible(true);
    }, 250);

    return () => clearTimeout(swapTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const highlightedService = rotation[rotationIndex] ?? currentService;

  return (
    <aside className={styles.sidebar}>
      {/* More Services */}
      <div className={styles.card}>
        <h3 className={styles.heading}>{heading}</h3>
        <ul className={styles.list}>
          {list.map((service, i) => (
            <li key={service.href} className={styles.listItem}>
              <Link
                href={service.href}
                className={styles.link}
                style={{ "--hue": HUES[i % HUES.length] } as React.CSSProperties}
              >
                <span>{service.name}</span>
                <svg
                  className={styles.arrow}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11L11 3M11 3H4.5M11 3V9.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className={styles.ctaCard}>
        <div className={styles.iconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.1 21 3 13.9 3 5c0-.6.4-1 1-1h3.8c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className={styles.ctaText}>
          Looking for
          <br />
          <span
            className={`${styles.ctaHighlight} ${isVisible ? styles.ctaHighlightVisible : ""}`}
          >
            {highlightedService}
          </span>
          <br />
          Service?
        </p>

        <span className={styles.callLabel}>Call Anytime</span>

        <a href={telHref} className={styles.callButton}>
          {phone}
        </a>
      </div>
    </aside>
  );
}

// Rotating accent colors for the service links — mirrors the multi-color
// treatment from the live site, but driven by a fixed palette instead of
// hardcoded per-link colors so any list of any length still looks right.
const HUES = [172, 142, 200, 330, 45, 172, 330];