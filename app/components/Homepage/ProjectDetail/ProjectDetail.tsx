"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Project } from "@/data/projects";
import styles from "./ProjectDetail.module.css";

type Props = {
  project: Project;
};

export default function ProjectDetail({ project }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeModal = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + project.gallery.length) % project.gallery.length
    );
  }, [project.gallery.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i + 1) % project.gallery.length
    );
  }, [project.gallery.length]);

  // Keyboard navigation — Esc / arrows
  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeModal, showPrev, showNext]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/" className={styles.backLink}>
          <FaArrowLeft size={12} />
          Back to Home
        </Link>

        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.eyebrow}>{project.category}</span>
          <h1 className={styles.title}>{project.title}</h1>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Client</span>
              <span className={styles.metaValue}>{project.client}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Year</span>
              <span className={styles.metaValue}>{project.year}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Services</span>
              <span className={styles.metaValue}>{project.services.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className={styles.coverWrap}>
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className={styles.coverImage}
          />
        </div>

        {/* Description */}
        <div className={styles.descriptionWrap}>
          <h2 className={styles.sectionHeading}>About the Project</h2>
          <p className={styles.description}>{project.description}</p>
        </div>

        {/* Gallery */}
        <div className={styles.galleryHeader}>
          <h2 className={styles.sectionHeading}>Gallery</h2>
          <span className={styles.galleryHint}>Click any image to view full size</span>
        </div>

        <div className={styles.gallery}>
          {project.gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              className={styles.galleryCard}
              onClick={() => setActiveIndex(i)}
              aria-label={`Open image ${i + 1} of ${project.gallery.length}`}
            >
              <Image
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                className={styles.galleryImage}
              />
              <span className={`${styles.corner} ${styles.cornerTL}`} />
              <span className={`${styles.corner} ${styles.cornerTR}`} />
              <span className={`${styles.corner} ${styles.cornerBL}`} />
              <span className={`${styles.corner} ${styles.cornerBR}`} />
              <span className={styles.galleryOverlay} />
              <span className={styles.galleryIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Modal / Lightbox ---------- */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>

              <button
                type="button"
                className={`${styles.modalNav} ${styles.modalNavPrev}`}
                onClick={showPrev}
                aria-label="Previous image"
              >
                <FaChevronLeft size={16} />
              </button>

              <div className={styles.modalImageWrap}>
                <Image
                  src={project.gallery[activeIndex]}
                  alt={`${project.title} screenshot ${activeIndex + 1}`}
                  fill
                  sizes="90vw"
                  className={styles.modalImage}
                />
              </div>

              <button
                type="button"
                className={`${styles.modalNav} ${styles.modalNavNext}`}
                onClick={showNext}
                aria-label="Next image"
              >
                <FaChevronRight size={16} />
              </button>

              <span className={styles.modalCounter}>
                {activeIndex + 1} / {project.gallery.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}