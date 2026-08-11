"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  // Free-license Unsplash photo (verified under the Unsplash License —
  // free for commercial use, no attribution required). Swap any of these
  // for your own photography whenever you have it; just keep using
  // full URLs (or move to /public and use "/images/...") consistently.
  image: string;
};

const SERVICES: Service[] = [
  {
    id: "web-development",
    icon: FaCode,
    title: "web development",
    accent: "blue",
    shortDescription: "fast, custom-built sites",
    description:
      "Experience the best of web development in dehradun with dream byte solutions. we build custom web and app solutions that are functional and user-friendly, helping you build a powerful online presence in today's hyper-connected world.From e-commerce platforms and government portals to CRM systems and dynamic agency websites, our team specializes in turning ideas into scalable, high-performance digital products. Backed by modern technologies and a design-first approach, we ensure every project we deliver is fast, secure, and built to grow with your business — because in Dehradun's evolving digital landscape, staying ahead means building smarter, not just faster.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "digital-marketing",
    icon: FaBullhorn,
    title: "digital marketing",
    accent: "orange",
    shortDescription: "seo, ppc and campaigns",
    description:
      "As a leading lead generation and seo team, we run targeted campaigns and optimize websites to boost search rankings, cutting through the noise to turn visitors into loyal, long-term customers.From keyword-driven content strategies to technical SEO audits and conversion-focused landing pages, we help brands rank higher, load faster, and convert better. Our data-backed approach means every campaign is measured, refined, and optimized for real ROI — because in Dehradun's competitive digital market, visibility isn't optional, it's essential.",
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "graphic-design",
    icon: FaPalette,
    title: "graphic design",
    accent: "pink",
    shortDescription: "brand visuals that stand out",
    description:
      "Our talented designers create stunning logos, branding, website visuals and marketing materials to make your business stand out, with designs built to enhance identity and drive real success.From minimalist logo concepts to complete brand identity systems, our design process blends creativity with strategy — ensuring every visual element, from color palette to typography, tells your brand's story consistently across platforms. Because great design isn't just about looking good, it's about building trust the moment someone sees your brand.",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "performance-marketing",
    icon: FaChartLine,
    title: "performance marketing",
    accent: "green",
    shortDescription: "data-driven roi",
    description:
      "We unlock the power of data-driven performance marketing, continuously analyzing and optimizing campaigns across search, social and display so every rupee spent brings a measurable return.From Google Ads and Meta campaigns to retargeting funnels and A/B tested creatives, we track every click, conversion, and rupee spent to refine strategy in real time. Because in performance marketing, guesswork isn't a strategy — data is, and we let the numbers guide every decision we make.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "photo-video",
    icon: FaCamera,
    title: "photography / videography",
    accent: "purple",
    shortDescription: "stories worth sharing",
    description:
      "using top-tier equipment, we capture moments with creativity and precision, crafting compelling visuals perfect for corporate events or personal projects that elevate your brand.From product shoots and corporate events to cinematic brand videos and social media reels, our team blends technical precision with a creative eye to capture visuals that actually connect. Because in a world where attention spans are shrinking, powerful imagery isn't just nice to have — it's what makes people stop scrolling and start noticing you.",
    image:
      "https://images.unsplash.com/photo-1635360381874-edd74cbd57f3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "event-management",
    icon: FaCalendarCheck,
    title: "event management",
    accent: "amber",
    shortDescription: "planned to perfection",
    description:
      "As one of dehradun's top event management teams, we handle every stage from planning to execution with reliability, innovation and precision, ensuring an unforgettable experience.From corporate conferences and product launches to weddings and brand activations, we manage every detail — vendors, logistics, décor, and timing — so you don't have to worry about a thing. Because a truly great event isn't just organized, it's experienced, and that's the difference our team brings to every occasion.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "influencer-marketing",
    icon: FaUsers,
    title: "influencer marketing",
    accent: "teal",
    shortDescription: "genuine reach, real results",
    description:
      "We help businesses boost brand promotion and visibility by connecting with trusted influencers, building genuine connections with your audience that translate into real, lasting results.From micro-influencers with niche, engaged audiences to established creators with wider reach, we match your brand with voices that align naturally with your values and target market. Because authentic recommendations from trusted creators build credibility that traditional ads simply can't — turning followers into customers and customers into advocates.",
    image:
      "https://images.unsplash.com/photo-1522204538344-922f76ecc041?auto=format&fit=crop&w=1200&q=80",
  },
];

// Solid + soft colors per accent, used for the active indicator, icon glow,
// background wash and the image frame — kept as JS values since they need
// to be applied dynamically (whichever service is currently selected).
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
                    <Icon size={15} />
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
                <div className={styles.panelText}>
                  <span
                    className={styles.panelIcon}
                    style={{ background: accent.soft, color: accent.solid }}
                  >
                    <ActiveIcon size={28} />
                  </span>

                  <span className={styles.panelIndex}>
                    {pad(activeIndex + 1)} / {pad(SERVICES.length)}
                  </span>

                  <h3 className={styles.panelTitle}>{active.title}</h3>
                  <p className={styles.panelDescription}>{active.description}</p>
                </div>

                <div className={styles.panelImageWrap} style={{ boxShadow: `0 30px 60px -20px ${accent.soft}` }}>
                  <span
                    className={styles.panelImageFrame}
                    style={{ background: `linear-gradient(135deg, ${accent.solid}, transparent 60%)` }}
                  />
                  <div className={styles.panelImageInner}>
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 420px"
                      className={styles.panelImage}
                      priority={activeIndex === 0}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}