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

/** Raw shape returned by the Express /api/portfolio endpoint. */
interface ApiProject {
  _id: string;
  title: string;
  shortDesc: string;
  description: string;
  images: string[];
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
   API — NEXT_PUBLIC_API_URL already includes /api
══════════════════════════════════════════════════════════════ */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const PORTFOLIO_API = `${API_BASE}/portfolio`;

// backend "/uploads/xyz.jpg" jaisa relative path deta hai (static files),
// jo Express server ke origin se serve hota hai, Next.js app se nahi —
// isliye API_BASE se "/api" hata kar us origin ko prefix karna padta hai.
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function resolveImageUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("blob:") || url.startsWith("data:")) {
    return url; // already absolute
  }
  return `${API_ORIGIN}${url}`;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function mapApiProject(p: ApiProject): Project {
  return {
    id: p._id,
    title: p.title,
    shortDesc: p.shortDesc,
    description: p.description,
    images: p.images.map(resolveImageUrl),
    category: p.category,
    subCategory: p.subCategory,
  };
}

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
  const hasMultiple = project.images.length > 1;

  // Seamless loop ke liye: last image ka clone shuru mai, first image ka clone end mai
  const slides = useMemo(
    () =>
      hasMultiple
        ? [project.images[project.images.length - 1], ...project.images, project.images[0]]
        : project.images,
    [project.images, hasMultiple]
  );

  // index=1 se start (kyunki 0 pe clone hai), real images 1..length ke beech hain
  const [index, setIndex] = useState(hasMultiple ? 1 : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [closing, setClosing] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    setWithTransition(true);
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    setWithTransition(true);
    setIndex((i) => i - 1);
  }, []);

  // Jab clone pe pahunchein, transition khatam hone ke baad bina animation ke asli slide pe snap karo
  const handleTransitionEnd = useCallback(() => {
    if (!hasMultiple) return;
    if (index === slides.length - 1) {
      // last clone (= first image) par pahunch gaye -> asli first (index 1) pe snap
      setWithTransition(false);
      setIndex(1);
    } else if (index === 0) {
      // first clone (= last image) par pahunch gaye -> asli last pe snap
      setWithTransition(false);
      setIndex(slides.length - 2);
    }
  }, [index, slides.length, hasMultiple]);

  // withTransition false karne ke agle frame mai wapas true kar do taaki next animation chale
  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

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

  // Dots ke liye asli (0-indexed) image number nikalna
  const realIndex = hasMultiple
    ? (index - 1 + project.images.length) % project.images.length
    : 0;

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
          <div
            className={styles.sliderWrap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.sliderTrack}
              style={{
                transform: `translateX(-${index * 100}%)`,
                transition: withTransition ? "transform 0.4s ease" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} className={styles.sliderImg} />
              ))}
            </div>

            {hasMultiple && (
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
                      className={`${styles.sliderDot} ${i === realIndex ? styles.sliderDotActive : ""}`}
                      onClick={() => {
                        setWithTransition(true);
                        setIndex(i + 1);
                      }}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  /* ---------- fetch: GET /api/portfolio ---------- */
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(PORTFOLIO_API);
        const data = await parseJsonSafe(res);
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Portfolio load nahi ho paaya.");
        }
        if (!ignore) {
          setProjects((data.data as ApiProject[]).map(mapApiProject));
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Kuch galat ho gaya, dobara try karo.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator, projects]);

  const grouped = useMemo(() => {
    const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
    const map = new Map<string, Project[]>();
    filtered.forEach((p) => {
      const key = `${p.category} — ${p.subCategory}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([key, group]) => ({
      label: active === "All" ? key : group[0].subCategory,
      projects: group,
    }));
  }, [active, projects]);

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
        {loading && (
          <div className={styles.emptyState}>
            <p>Loading portfolio...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.emptyState}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
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
          </>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </div>
  );
}