"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./Testimonialslider.module.css";

export interface CardTestimonial {
  id: string;
  handle: string;
  designation: string;
  rating: number;
  content: string;
  date: string;
  avatar: string;
}

interface TestimonialSliderProps {
  testimonials?: CardTestimonial[];
  intervalMs?: number;
}

const PEOPLE = [
  { name: "Ava Reyes", photo: "1627161683077-e34782c24d81" },
  { name: "Liam Carter", photo: "1560250097-0b93528c311a" },
  { name: "Priya Nair", photo: "1573496359142-b8d87734a5a2" },
  { name: "Noah Bennett", photo: "1629425733761-caae3b5f2e50" },
  { name: "Sofia Marin", photo: "1573497019940-1c28c88b4f3e" },
  { name: "Ethan Cole", photo: "1519085360753-af0119f7cbe7" },
  { name: "Maya Fischer", photo: "1699899657680-421c2c2d5064" },
  { name: "Owen Brooks", photo: "1500648767791-00dcc994a43e" },
  { name: "Isla Thorne", photo: "1611432579699-484f7990b127" },
  { name: "Leo Nakamura", photo: "1595211877493-41a4e5f236b3" },
  { name: "Ruby Solano", photo: "1573496358961-3c82861ab8f4" },
  { name: "Kai Sato", photo: "1507003211169-0a1dd7228f2d" },
];



const CONTENTS = [
  "A story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful. story that lingers long after the last page. Not loud, but deeply impactful.",
  "One of those books you keep thinking about. Worth the read.",
  "A thoughtful and well-paced read that stays with you.",
  "Couldn't put it down — finished it in a single weekend.",
  "The kind of writing that makes you slow down on purpose.",
  "Beautifully written, quietly devastating in the best way.",
  "A slow burn that pays off completely by the final chapter.",
  "Surprisingly funny for how much it made me think.",
];

const DEFAULT_TESTIMONIALS: CardTestimonial[] = PEOPLE.map((person, i) => ({
  id: person.name.toLowerCase().replace(/\s+/g, "-"),
  handle: `@${person.name.toLowerCase().replace(/\s+/g, "")}`,
  designation: "",
  rating: 5,
  content: CONTENTS[i % CONTENTS.length],
  date: new Date(2024, i % 12, (i % 27) + 1).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  avatar: `https://images.unsplash.com/photo-${person.photo}?auto=format&fit=crop&w=800&q=80`,
}));

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={styles.stars} aria-label={`${rounded} out of 5 stars`}>
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </span>
  );
}

function getOffset(index: number, active: number, total: number) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  intervalMs = 5000,
}) => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;
  const current = testimonials[active];

  const goTo = (direction: 1 | -1) => {
    setActive((prev) => (prev + direction + total) % total);
  };

  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  useEffect(() => {
    if (!intervalMs || isPaused || total <= 1) return;
    const id = window.setInterval(() => goToRef.current(1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, isPaused, total]);

  const words = useMemo(() => current.content.split(" "), [current.content]);

  return (
    <section
      className={styles.wrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.grid}>
        <div className={styles.imageStack}>
          {testimonials.map((t, i) => {
            const offset = getOffset(i, active, total);
            if (Math.abs(offset) > 2) return null;

            const isActive = offset === 0;
            const style: React.CSSProperties = {
              zIndex: total - Math.abs(offset),
              opacity: isActive ? 1 : 0.55,
              transform: isActive
                ? "translate(0%, 0%) rotateY(0deg) scale(1)"
                : `translate(${offset > 0 ? "18%" : "-18%"}, -14%) rotateY(${
                    offset > 0 ? -15 : 15
                  }deg) scale(0.88)`,
            };

            return (
              <div key={t.id} className={styles.imageFrame} style={style}>
                <Image
                  src={t.avatar}
                  alt={t.handle}
                  fill
                  sizes="(max-width: 768px) 60vw, 22rem"
                  className={styles.image}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className={styles.meta}>
                <div>
                  <h3 className={styles.handle}>{current.handle}</h3>
                  <p className={styles.designation}>{current.designation}</p>
                </div>
                <div className={styles.metaRight}>
                  <Stars rating={current.rating} />
                  <span className={styles.date}>{current.date}</span>
                </div>
              </div>

              <p className={styles.quote}>
                {words.map((word, i) => (
                  <motion.span
                    key={`${current.id}-${i}`}
                    className={styles.word}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.08 + i * 0.02 }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className={styles.arrowButtons}>
            <button
              type="button"
              aria-label="Previous testimonial"
              className={styles.arrowButton}
              onClick={() => goTo(-1)}
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className={styles.arrowButton}
              onClick={() => goTo(1)}
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;