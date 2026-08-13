"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import styles from "./Projects.module.css";
import { PROJECTS } from "@/data/projects";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* Four L-shaped corner brackets — a camera-viewfinder motif that nods
   to Dream Byte's photography/videography work, revealed on hover. */
function ViewfinderCorners() {
  return (
    <>
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />
    </>
  );
}

export default function Projects() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>our work</span>
          <h2 className={styles.heading}>Latest Projects</h2>
          <span className={styles.swipeHint}>Swipe to explore →</span>
        </div>

        <div className={styles.grid}>
          {PROJECTS.map((project, i) => {
            const href = `/work/${project.slug}`;

            return (
              <motion.div
                key={project.slug}
                className={`${styles.card} ${i === 0 ? styles.cardFeatured : ""}`}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
              >
                <Link href={href} className={styles.imageWrap}>
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, (max-width: 1280px) 45vw, 30vw"
                    className={styles.image}
                  />
                  <div className={styles.overlay} />
                  <ViewfinderCorners />

                  <span className={styles.category}>{project.category}</span>
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className={styles.body}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <Link href={href} className={styles.readMore}>
                    Read More
                    <FaArrowRight size={11} className={styles.readMoreIcon} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={styles.moreWrap}>
          <Link href="/portfolio" className={styles.moreBtn}>
            View More
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}