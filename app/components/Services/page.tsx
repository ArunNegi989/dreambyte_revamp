"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

type Service = {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  description: string;
  accent: "orange" | "blue" | "teal" | "pink" | "amber" | "purple" | "green";
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

// Bento positions for each slot index (desktop, 4-column x 3-row grid).
// The featured card spans the full height so its full paragraph is readable.
// Mobile overrides these in CSS.
const POSITIONS = [
  { "--col": "1 / 3", "--row": "1 / 4" }, // featured — tall card, full paragraph
  { "--col": "3 / 4", "--row": "1 / 2" },
  { "--col": "4 / 5", "--row": "1 / 2" },
  { "--col": "3 / 4", "--row": "2 / 3" },
  { "--col": "4 / 5", "--row": "2 / 3" },
  { "--col": "3 / 4", "--row": "3 / 4" },
  { "--col": "4 / 5", "--row": "3 / 4" },
] as React.CSSProperties[];

export default function Services() {
  const [order, setOrder] = useState(SERVICES.map((s) => s.id));

  const orderedServices = order.map(
    (id) => SERVICES.find((s) => s.id === id)!
  );

  const bringToFront = (id: string) => {
    setOrder((prev) => [id, ...prev.filter((x) => x !== id)]);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>what we do</span>
          <h2 className={styles.heading}>our marketing services</h2>
        </div>

        <div className={styles.grid}>
          {orderedServices.map((service, index) => {
            const isFeatured = index === 0;
            const Icon = service.icon;

            return (
              <motion.button
                key={service.id}
                type="button"
                layout
                onClick={() => bringToFront(service.id)}
                className={`${styles.card} ${
                  isFeatured ? styles.featured : styles.normal
                }`}
                style={POSITIONS[index]}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  layout="position"
                  className={`${styles.iconWrap} ${styles[service.accent]}`}
                >
                  <Icon size={isFeatured ? 20 : 15} />
                </motion.span>

                <motion.h3 layout="position" className={styles.title}>
                  {service.title}
                </motion.h3>

                <motion.p layout="position" className={styles.description}>
                  {isFeatured ? service.description : service.shortDescription}
                </motion.p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}