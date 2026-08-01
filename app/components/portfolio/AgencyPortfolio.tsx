"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./AgencyPortfolio.module.css";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */
type MainCategory = "Web Development" | "Graphic Designing" | "Digital Marketing" | "Branding";

interface Project {
  id: string;
  title: string;
  shortDesc: string;   // one-liner shown on the card
  description: string; // fuller text shown inside the modal
  images: string[];    // gallery — powers the modal slider
  category: MainCategory;
  subCategory: string;
}

const FILTERS: ("All" | MainCategory)[] = [
  "All",
  "Web Development",
  "Graphic Designing",
  "Digital Marketing",
  "Branding",
];

/* ══════════════════════════════════════════════════════════════
   PLACEHOLDER IMAGES — swap for real client screenshots later.
══════════════════════════════════════════════════════════════ */
const IMG = [
  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571677246347-5040036b95cc?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553484771-047a44eee27b?q=80&w=1400&auto=format&fit=crop",
];

function gallery(...idx: number[]) {
  return idx.map((i) => IMG[i % IMG.length]);
}

const PROJECTS: Project[] = [
  // ── Web Development / Ecommerce ──
  {
    id: "wd-ec-1",
    title: "Balaji Furniture",
    shortDesc: "A luxurious fusion of comfort and connectivity.",
    description:
      "A full ecommerce build for a Dehradun furniture brand — product catalogue, cart, and checkout tuned for mobile-first shopping. Every collection page was designed to feel like a showroom, not a spreadsheet.",
    images: gallery(0, 5, 3),
    category: "Web Development",
    subCategory: "Ecommerce",
  },
  {
    id: "wd-ec-2",
    title: "Erika Henna Herbal",
    shortDesc: "Rooted in tradition, built for modern shopping.",
    description:
      "Storefront rebuild for a natural henna manufacturer — category filters, bulk order flow, and a faster checkout that cut cart drop-off significantly within the first month of launch.",
    images: gallery(1, 4, 7),
    category: "Web Development",
    subCategory: "Ecommerce",
  },
  {
    id: "wd-ec-3",
    title: "Shiva Tears",
    shortDesc: "Where every stone tells a certified story.",
    description:
      "Gemstone and rudraksha marketplace with certificate uploads per product and a trust-first product detail layout, built to reassure first-time spiritual shoppers.",
    images: gallery(2, 6, 9),
    category: "Web Development",
    subCategory: "Ecommerce",
  },
  {
    id: "wd-ec-4",
    title: "5Rivers Chicago",
    shortDesc: "Fresh arrivals, delivered every single week.",
    description:
      "A snacks-and-groceries marketplace built for weekly new arrivals — fast search, saved carts, and a clean mobile grid that keeps repeat shoppers moving quickly.",
    images: gallery(3, 8, 0),
    category: "Web Development",
    subCategory: "Ecommerce",
  },

  // ── Web Development / Corporate & Product Sites ──
  {
    id: "wd-corp-1",
    title: "Wellstone Homes",
    shortDesc: "A portfolio that speaks before you scroll.",
    description:
      "Corporate site for an interior design studio — portfolio-led homepage with project case-study pages that let the work do most of the talking.",
    images: gallery(4, 9, 1),
    category: "Web Development",
    subCategory: "Corporate & Product Sites",
  },
  {
    id: "wd-corp-2",
    title: "Rangoli Décor",
    shortDesc: "A dealer network, made easy to navigate.",
    description:
      "Brand site with a product lookbook, dealer locator, and a lightweight admin panel that lets the client's own team manage listings without developer help.",
    images: gallery(5, 10, 2),
    category: "Web Development",
    subCategory: "Corporate & Product Sites",
  },
  {
    id: "wd-corp-3",
    title: "Style That Speaks",
    shortDesc: "One hero product, zero distractions.",
    description:
      "Furniture brand microsite built around a single hero product line, optimised for speed and clarity from the very first scroll.",
    images: gallery(6, 11, 3),
    category: "Web Development",
    subCategory: "Corporate & Product Sites",
  },

  // ── Digital Marketing / SEO Campaigns ──
  {
    id: "dm-seo-1",
    title: "AYM Yoga School",
    shortDesc: "Ranking a Rishikesh school, worldwide.",
    description:
      "A 12-month organic growth programme for a Rishikesh yoga school — technical audit, content clusters, and local search optimisation that brought steady, compounding traffic.",
    images: gallery(7, 0, 4),
    category: "Digital Marketing",
    subCategory: "SEO Campaigns",
  },
  {
    id: "dm-seo-2",
    title: "Yakka Puka Café Group",
    shortDesc: "Five outlets, one search strategy.",
    description:
      "Local SEO and Google Business Profile overhaul across five outlets, rebuilding review velocity and map-pack visibility city by city.",
    images: gallery(8, 1, 5),
    category: "Digital Marketing",
    subCategory: "SEO Campaigns",
  },

  // ── Digital Marketing / Paid & Analytics ──
  {
    id: "dm-ads-1",
    title: "5Rivers — Performance Ads",
    shortDesc: "Lower cost per lead, at higher scale.",
    description:
      "Google & Meta ad restructure that cut cost-per-lead while scaling monthly spend for a growing ecommerce brand — rebuilt from the funnel up.",
    images: gallery(9, 2, 6),
    category: "Digital Marketing",
    subCategory: "Paid & Analytics",
  },
  {
    id: "dm-ads-2",
    title: "Shiva Tears — Funnel Rebuild",
    shortDesc: "A funnel built to earn trust, then convert.",
    description:
      "Rebuilt the acquisition funnel end to end — landing pages, retargeting sequences, and a monthly performance dashboard the client actually reads.",
    images: gallery(10, 3, 7),
    category: "Digital Marketing",
    subCategory: "Paid & Analytics",
  },

  // ── Graphic Designing / Social Creatives ──
  {
    id: "gd-social-1",
    title: "Erika Henna — Seasonal Campaign",
    shortDesc: "A full festive season, frame by frame.",
    description:
      "A complete festive-season content calendar — static and motion creatives designed as a single cohesive story across the feed.",
    images: gallery(11, 4, 8),
    category: "Graphic Designing",
    subCategory: "Social Media Creatives",
  },
  {
    id: "gd-social-2",
    title: "Balaji Furniture — Product Drops",
    shortDesc: "Every launch, on-brand from frame one.",
    description:
      "Launch creative sets for new furniture collections, built around a consistent grid and typography system that scales with every new drop.",
    images: gallery(0, 5, 9),
    category: "Graphic Designing",
    subCategory: "Social Media Creatives",
  },

  // ── Graphic Designing / Print & Packaging ──
  {
    id: "gd-print-1",
    title: "Mamta Gold — Packaging Refresh",
    shortDesc: "Shelf-ready, across fourteen SKUs.",
    description:
      "Full packaging redesign for a spice and tea brand — shelf-ready artwork designed to stand out without shouting.",
    images: gallery(1, 6, 10),
    category: "Graphic Designing",
    subCategory: "Print & Packaging",
  },
  {
    id: "gd-print-2",
    title: "Shiva Tears — Certificate & Box Design",
    shortDesc: "Unboxing that reinforces the promise.",
    description:
      "Authenticity certificate layout and unboxing packaging designed to reinforce the brand's trust positioning from the very first touch.",
    images: gallery(2, 7, 11),
    category: "Graphic Designing",
    subCategory: "Print & Packaging",
  },

  // ── Branding / Identity ──
  {
    id: "br-id-1",
    title: "5Rivers Chicago",
    shortDesc: "An identity built from a blank page.",
    description:
      "Full identity system from scratch — logomark, colour system, and packaging language for a brand-new snacks marketplace.",
    images: gallery(3, 8, 0),
    category: "Branding",
    subCategory: "Brand Identity",
  },
  {
    id: "br-id-2",
    title: "Wellstone Homes",
    shortDesc: "A quiet identity, built to last.",
    description:
      "A quiet, materials-led identity for an interior studio — logomark, stationery, and signage guidelines that age well.",
    images: gallery(4, 9, 1),
    category: "Branding",
    subCategory: "Brand Identity",
  },

  // ── Branding / Logo Design ──
  {
    id: "br-logo-1",
    title: "Rangoli Décor",
    shortDesc: "One motif, a hundred applications.",
    description:
      "A geometric logomark built around a repeatable motif, designed to work from favicon size all the way up to storefront signage.",
    images: gallery(5, 10, 2),
    category: "Branding",
    subCategory: "Logo Design",
  },
  {
    id: "br-logo-2",
    title: "Yakka Puka",
    shortDesc: "Friendly on a cup, sharp on a sign.",
    description:
      "A friendly, hand-tuned wordmark and icon pairing for a growing café chain, built to reproduce well at every size it's printed on.",
    images: gallery(6, 11, 3),
    category: "Branding",
    subCategory: "Logo Design",
  },
];

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 3H3v6M15 3h6v6M21 15v6h-6M3 15v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   SCROLL-REVEAL CARD
══════════════════════════════════════════════════════════════ */
function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.revealWrap} ${visible ? styles.revealVisible : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROJECT CARD — image-first, minimal text, tilt on hover
══════════════════════════════════════════════════════════════ */
function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt following the cursor — desktop only, disabled on touch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tiltX", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--tiltY", `${(x * 6).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--tiltX", "0deg");
    el.style.setProperty("--tiltY", "0deg");
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <button
        className={styles.cardImgWrap}
        onClick={() => onOpen(project)}
        aria-label={`Open ${project.title} gallery`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.images[0]} alt={project.title} className={styles.cardImg} loading="lazy" />
        <div className={styles.cardImgOverlay} />
        <span className={styles.cardExpandBadge}>
          <ExpandIcon />
        </span>
      </button>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDesc}>{project.shortDesc}</p>
        <button className={styles.readMoreBtn} onClick={() => onOpen(project)}>
          Read More <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROJECT MODAL — big image slider + short description
══════════════════════════════════════════════════════════════ */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % project.images.length),
    [project.images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + project.images.length) % project.images.length),
    [project.images.length]
  );

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, next, prev]);

  // Lock body scroll while modal is open (position-fixed technique avoids layout jump)
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    if (delta < -50) next();
    touchStartX.current = null;
  };

  return (
    <div
      className={`${styles.modalBackdrop} ${closing ? styles.modalBackdropOut : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modalBox} ${closing ? styles.modalBoxOut : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={handleClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className={styles.modalScroll}>
          {/* Slider */}
          <div
            className={styles.sliderWrap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {project.images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} className={styles.sliderImg} />
              ))}
            </div>

            {project.images.length > 1 && (
              <>
                <button className={`${styles.sliderNav} ${styles.sliderNavLeft}`} onClick={prev} aria-label="Previous image">
                  <ChevronIcon dir="left" />
                </button>
                <button className={`${styles.sliderNav} ${styles.sliderNavRight}`} onClick={next} aria-label="Next image">
                  <ChevronIcon dir="right" />
                </button>
                <div className={styles.sliderDots}>
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.sliderDot} ${i === index ? styles.sliderDotActive : ""}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div className={styles.modalBody}>
            <span className={styles.modalEyebrow}>{project.subCategory}</span>
            <h3 className={styles.modalTitle}>{project.title}</h3>
            <p className={styles.modalDesc}>{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function AgencyPortfolio() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const grouped = useMemo(() => {
    const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);
    const map = new Map<string, Project[]>();
    filtered.forEach((p) => {
      const key = `${p.category} — ${p.subCategory}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([key, projects]) => ({
      label: active === "All" ? key : projects[0].subCategory,
      projects,
    }));
  }, [active]);

  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Selected Work</span>
          <h1 className={styles.heroTitle}>Our Portfolio</h1>
          <p className={styles.heroTagline}>Crafting creative solutions for every project</p>
        </div>
      </section>

      {/* ---------- Sticky filter bar ---------- */}
      <div className={styles.filterBarSticky}>
        <div className={styles.filterBar}>
          <div
            className={styles.filterIndicator}
            style={{ left: indicator.left, width: indicator.width }}
            aria-hidden="true"
          />
          {FILTERS.map((f) => (
            <button
              key={f}
              ref={(el) => { tabRefs.current[f] = el; }}
              className={`${styles.filterBtn} ${active === f ? styles.filterBtnActive : ""}`}
              onClick={() => setActive(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Grouped project sections ---------- */}
      <div className={styles.container} key={active}>
        {grouped.map((group, gi) => (
          <section key={group.label} className={styles.categoryBlock}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>{group.label}</h2>
              <span className={styles.categoryCount}>{group.projects.length} projects</span>
            </div>
            <div className={styles.grid}>
              {group.projects.map((project, i) => (
                <RevealCard key={project.id} delay={(gi * 2 + i) * 60}>
                  <ProjectCard project={project} onOpen={setOpenProject} />
                </RevealCard>
              ))}
            </div>
          </section>
        ))}

        {grouped.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </div>
  );
}