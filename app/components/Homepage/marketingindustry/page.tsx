"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaGraduationCap,
  FaHeartbeat,
  FaShoppingCart,
  FaHome,
  FaPlane,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./Industries.module.css";

type Accent = "orange" | "blue" | "pink" | "green" | "purple" | "teal";

type Industry = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  accent: Accent;
};

const INDUSTRIES: Industry[] = [
  {
    id: "hotels-resorts",
    title: "Hotels & Resorts",
    description:
      "Help hotels and resorts attract more guests, increase bookings, and create memorable experiences with digital marketing and professionally designed websites.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    icon: FaHotel,
    accent: "orange",
  },
  {
    id: "education",
    title: "Education",
    description:
      "Assist schools, colleges, and online courses in reaching more students, promoting programs, and building a strong online presence.",
    image:
      "https://images.unsplash.com/photo-1758270704925-fa59d93119c1?auto=format&fit=crop&w=1200&q=80",
    icon: FaGraduationCap,
    accent: "blue",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description:
      "Support hospitals, clinics, and healthcare providers in connecting with patients and showcasing services through digital marketing.",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=80",
    icon: FaHeartbeat,
    accent: "pink",
  },
  {
    id: "e-commerce",
    title: "E-Commerce",
    description:
      "Help online stores drive sales, increase traffic, and grow brand visibility with targeted marketing strategies.",
    image:
      "https://images.unsplash.com/photo-1758351507026-71ad3645cb43?auto=format&fit=crop&w=1200&q=80",
    icon: FaShoppingCart,
    accent: "green",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description:
      "Enable real estate businesses to showcase properties, attract buyers, and strengthen market presence.",
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80",
    icon: FaHome,
    accent: "purple",
  },
  {
    id: "travel-tourism",
    title: "Travel & Tourism",
    description:
      "Help travel agencies attract more travelers, increase bookings, and grow brand online with digital marketing.",
    image:
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80",
    icon: FaPlane,
    accent: "teal",
  },
];

const ACCENT: Record<Accent, { solid: string; soft: string; gradA: string; gradB: string }> = {
  orange: { solid: "#ff9d6b", soft: "rgba(255, 122, 69, 0.16)", gradA: "#ffb37a", gradB: "#ff7a45" },
  blue: { solid: "#7fb4ff", soft: "rgba(66, 148, 255, 0.16)", gradA: "#8fc2ff", gradB: "#4c7dff" },
  pink: { solid: "#ed93b1", soft: "rgba(212, 83, 126, 0.18)", gradA: "#f2a8c2", gradB: "#d4537e" },
  green: { solid: "#8fd18a", soft: "rgba(61, 220, 151, 0.16)", gradA: "#a3e0a0", gradB: "#3ddc97" },
  purple: { solid: "#b9a7f5", soft: "rgba(153, 122, 238, 0.18)", gradA: "#c7b8f7", gradB: "#8f75e8" },
  teal: { solid: "#6bd6d1", soft: "rgba(45, 200, 194, 0.16)", gradA: "#82e0dc", gradB: "#22b8b0" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Industries() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>industries we serve</span>
          <h2 className={styles.heading}>Smart Marketing For Every Industry</h2>
          <p className={styles.subheading}>
            Six sectors, one playbook: understand the audience, then build the site and campaigns that reach them.
          </p>
        </div>

        <div className={styles.grid}>
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            const c = ACCENT[industry.accent];
            return (
              <motion.div
                key={industry.id}
                className={styles.card}
                style={{ ["--accent" as string]: c.solid, ["--accent-soft" as string]: c.soft }}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <div className={styles.imageWrap}>
                  <div className={styles.imageInner}>
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                  <span
                    className={styles.iconBadge}
                    style={{ background: `linear-gradient(135deg, ${c.gradA}, ${c.gradB})` }}
                  >
                    <Icon size={18} />
                  </span>
                </div>

                <div className={styles.body}>
                  <h3 className={styles.title}>{industry.title}</h3>
                  <p className={styles.description}>{industry.description}</p>

                  <span className={styles.exploreLink}>
                    Explore
                    <FaArrowRight size={12} className={styles.exploreArrow} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}