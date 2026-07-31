"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPalette,
  FaCode,
  FaBullhorn,
  FaChartLine,
  FaCamera,
  FaCalendarCheck,
  FaUsers,
} from "react-icons/fa";
import styles from "./Services.module.css";

type Accent = "orange" | "blue" | "teal" | "pink" | "amber" | "purple" | "green";

type Service = {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  description: string;
  accent: Accent;
};

const SERVICES: Service[] = [
  {
    id: "web-development",
    icon: FaCode,
    title: "web development",
    accent: "blue",
    shortDescription: "fast, custom-built sites",
    description:
      "experience the best of web development in dehradun with dream byte solutions. we build custom web and app solutions that are functional and user-friendly, helping you build a powerful online presence in today's hyper-connected world.",
  },
  {
    id: "digital-marketing",
    icon: FaBullhorn,
    title: "digital marketing",
    accent: "orange",
    shortDescription: "seo, ppc and campaigns",
    description:
      "as a leading lead generation and seo team, we run targeted campaigns and optimize websites to boost search rankings, cutting through the noise to turn visitors into loyal, long-term customers.",
  },
  {
    id: "graphic-design",
    icon: FaPalette,
    title: "graphic design",
    accent: "pink",
    shortDescription: "brand visuals that stand out",
    description:
      "our talented designers create stunning logos, branding, website visuals and marketing materials to make your business stand out, with designs built to enhance identity and drive real success.",
  },
  {
    id: "performance-marketing",
    icon: FaChartLine,
    title: "performance marketing",
    accent: "green",
    shortDescription: "data-driven roi",
    description:
      "we unlock the power of data-driven performance marketing, continuously analyzing and optimizing campaigns across search, social and display so every rupee spent brings a measurable return.",
  },
  {
    id: "photo-video",
    icon: FaCamera,
    title: "photography / videography",
    accent: "purple",
    shortDescription: "stories worth sharing",
    description:
      "using top-tier equipment, we capture moments with creativity and precision, crafting compelling visuals perfect for corporate events or personal projects that elevate your brand.",
  },
  {
    id: "event-management",
    icon: FaCalendarCheck,
    title: "event management",
    accent: "amber",
    shortDescription: "planned to perfection",
    description:
      "as one of dehradun's top event management teams, we handle every stage from planning to execution with reliability, innovation and precision, ensuring an unforgettable experience.",
  },
  {
    id: "influencer-marketing",
    icon: FaUsers,
    title: "influencer marketing",
    accent: "teal",
    shortDescription: "genuine reach, real results",
    description:
      "we help businesses boost brand promotion and visibility by connecting with trusted influencers, building genuine connections with your audience that translate into real, lasting results.",
  },
];

// Solid + soft colors per accent, used for the active indicator, icon glow
// and background wash — kept as JS values since they need to be applied
// dynamically (whichever service is currently selected).
const ACCENT: Record<Accent, { solid: string; soft: string }> = {
  orange: { solid: "#ff9d6b", soft: "rgba(255, 122, 69, 0.16)" },
  blue: { solid: "#7fb4ff", soft: "rgba(66, 148, 255, 0.16)" },
  teal: { solid: "#5dcaa5", soft: "rgba(29, 158, 117, 0.18)" },
  pink: { solid: "#ed93b1", soft: "rgba(212, 83, 126, 0.18)" },
  amber: { solid: "#f6bb5c", soft: "rgba(239, 159, 39, 0.18)" },
  purple: { solid: "#afa9ec", soft: "rgba(127, 119, 221, 0.18)" },
  green: { solid: "#97c459", soft: "rgba(99, 153, 34, 0.18)" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const activeIndex = SERVICES.findIndex((s) => s.id === activeId);
  const active = SERVICES[activeIndex];
  const ActiveIcon = active.icon;
  const accent = ACCENT[active.accent];

  // Auto-advance to the next service every 4 seconds. The timer restarts
  // whenever activeId changes — including a manual click — so clicking
  // an item just gives it a fresh 4 seconds before it moves on.
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % SERVICES.length;
      setActiveId(SERVICES[nextIndex].id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>what we do</span>
          <h2 className={styles.heading}>our marketing services</h2>
        </div>

        <div className={styles.layout}>
          {/* ---------- Index list ---------- */}
          <div className={styles.list} role="tablist">
            {SERVICES.map((service, i) => {
              const isActive = service.id === activeId;
              const Icon = service.icon;
              const c = ACCENT[service.accent];

              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(service.id)}
                  className={`${styles.listItem} ${isActive ? styles.listItemActive : ""}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeBar"
                      className={styles.activeBar}
                      style={{ background: c.solid }}
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    />
                  )}
                  <span className={styles.listNum}>{pad(i + 1)}</span>
                  <span
                    className={styles.listIcon}
                    style={{
                      color: isActive ? c.solid : undefined,
                      background: isActive ? c.soft : undefined,
                    }}
                  >
                    <Icon size={14} />
                  </span>
                  <span className={styles.listTitle}>{service.title}</span>
                </button>
              );
            })}
          </div>

          {/* ---------- Detail panel ---------- */}
          <div className={styles.panel}>
            <div
              className={styles.glow}
              style={{ background: `radial-gradient(circle, ${accent.soft}, transparent 70%)` }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={styles.panelInner}
              >
                <span
                  className={styles.panelIcon}
                  style={{ background: accent.soft, color: accent.solid }}
                >
                  <ActiveIcon size={26} />
                </span>

                <span className={styles.panelIndex}>
                  {pad(activeIndex + 1)} / {pad(SERVICES.length)}
                </span>

                <h3 className={styles.panelTitle}>{active.title}</h3>
                <p className={styles.panelDescription}>{active.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}