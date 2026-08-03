"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import styles from "./Projects.module.css";

type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
};

/*
 * NOTE: These are themed stock placeholders (free-license Unsplash),
 * not screenshots of the actual live sites — erikahennaherbal.com etc.
 * are real client projects, so swap each `image` for a real screenshot
 * of the delivered site as soon as you have one, e.g.:
 *   image: "/projects/erika-henna-herbal.jpg"
 * (drop the file in /public/projects/ first).
 */
const PROJECTS: Project[] = [
  {
    id: "erika-henna-herbal",
    title: "Welcome to Erika Henna Herbal",
    category: "E-Commerce · Branding",
    image:
      "https://images.unsplash.com/photo-1611073761742-bce90ccd60ae?auto=format&fit=crop&w=1200&q=80",
    href: "/portfolio/erika-henna-herbal",
  },
  {
    id: "gauraaj",
    title: "Welcome to Gauraaj",
    category: "E-Commerce · Organic Foods",
    image:
      "https://images.unsplash.com/photo-1553787434-45e1d245bfbb?auto=format&fit=crop&w=1200&q=80",
    href: "/portfolio/gauraaj",
  },
  {
    id: "house-of-intimacy",
    title: "Welcome to House Of Intimacy",
    category: "E-Commerce · Lifestyle",
    image:
      "https://images.unsplash.com/photo-1602952706017-f3cc19eb98af?auto=format&fit=crop&w=1200&q=80",
    href: "/portfolio/house-of-intimacy",
  },
];

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

/*
 * ONCE YOU HAVE REAL SCREENSHOTS: drop the files in /public/projects/ and
 * change each project's `image` above from the Unsplash URL to:
 *   `/projects/${project.id}.jpg`
 * No other changes needed — the <Image> below already points at `image`.
 */

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
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              className={`${styles.card} ${i === 0 ? styles.cardFeatured : ""}`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              whileHover={{ y: -6 }}
            >
              <Link href={project.href} className={styles.imageWrap}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, (max-width: 1280px) 45vw, 30vw"
                  className={styles.image}
                />
                <div className={styles.overlay} />
                <ViewfinderCorners />

                <span className={styles.category}>{project.category}</span>
                <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>

                <span className={styles.viewBtn}>
                  View Project
                  <FaArrowRight size={11} />
                </span>
              </Link>

              <div className={styles.body}>
                <h3 className={styles.title}>{project.title}</h3>
                <Link href={project.href} className={styles.readMore}>
                  Read More
                  <FaArrowRight size={11} className={styles.readMoreIcon} />
                </Link>
              </div>
            </motion.div>
          ))}
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