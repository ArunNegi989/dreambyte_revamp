"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Testimonialslider.module.css";

export interface CardTestimonial {
  id: string;
  handle: string;
  rating: number;
  content: string;
  date: string;
}

interface TestimonialCardsProps {
  testimonials?: CardTestimonial[];
  visibleCount?: number; // how many cards show at once (default 3)
  intervalMs?: number; // how often the window advances
}

const HANDLES = [
  "the_sleepy_reader", "emmaonbooks", "pageswithtea", "quietbookcorner",
  "inkstained_soul", "novel_nights", "chapterandverse", "thepagechaser",
  "bookishbex", "storiedshelf", "readsbyrhea", "marginalia_notes",
  "wornoutpaperbacks", "thelitloft", "coffeeandclauses", "afterhoursreads",
  "thumbedpages", "silentchapters", "bindingsandbrews", "novelnomad",
];

const CONTENTS = [
  "A story that lingers long after the last page. Not loud, but deeply impactful.",
  "One of those books you keep thinking about. Worth the read 👍",
  "A thoughtful and well-paced read that stays with you.",
  "Couldn't put it down — finished it in a single weekend.",
  "The kind of writing that makes you slow down on purpose.",
  "Beautifully written, quietly devastating in the best way.",
  "A slow burn that pays off completely by the final chapter.",
  "Surprisingly funny for how much it made me think.",
];

const ACCENTS = ["indianred", "slateblue", "seagreen", "#c98a2c", "#3a7ca5", "#a4508b"];
const TILTS = [-4, 2, -5, 3, -3, 4];

const DEFAULT_TESTIMONIALS: CardTestimonial[] = HANDLES.map((handle, i) => ({
  id: handle,
  handle: `@${handle}`,
  rating: 5,
  content: CONTENTS[i % CONTENTS.length],
  date: new Date(2024, i % 12, (i % 27) + 1).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
}));

function Stars({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-label={`${rounded} out of 5 stars`}>
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </span>
  );
}

const TestimonialCards: React.FC<TestimonialCardsProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  visibleCount = 3,
  intervalMs = 3200,
}) => {
  // startIndex marks where the visible window begins in the (looping) list.
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [exitingId, setExitingId] = useState<string | null>(null);
  const total = testimonials.length;

  // The window of testimonials currently on screen, wrapping around the end.
  const visible = useMemo(() => {
    return Array.from({ length: Math.min(visibleCount, total) }, (_, i) => {
      const idx = (startIndex + i) % total;
      return { ...testimonials[idx], _slot: i, _key: `${testimonials[idx].id}-${startIndex}-${i}` };
    });
  }, [startIndex, testimonials, total, visibleCount]);

  const advance = () => {
    if (total <= visibleCount) return;
    const leavingId = testimonials[startIndex % total]?.id ?? null;
    setExitingId(leavingId);
    // let the exit animation play, then shift the window and bring in the next card
    window.setTimeout(() => {
      setStartIndex((prev) => (prev + 1) % total);
      setExitingId(null);
    }, 350);
  };

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  useEffect(() => {
    if (!intervalMs || isPaused || total <= visibleCount) return;
    const id = window.setInterval(() => advanceRef.current(), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, isPaused, total, visibleCount]);

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {visible.map((t, i) => {
        const isExiting = t.id === exitingId && i === 0;
        return (
          <div
            className={`${styles.cardWrapper} ${
              isExiting ? styles.cardExiting : styles.cardEntering
            }`}
            key={t._key}
            style={{
              ["--accent" as any]: ACCENTS[(startIndex + i) % ACCENTS.length],
              ["--tilt" as any]: `${TILTS[(startIndex + i) % TILTS.length]}deg`,
            }}
          >
            <div className={styles.card}>
              <div className={styles.account}>
                <span className={styles.ratingStars}>
                  <Stars rating={t.rating} />
                </span>
                <span>{t.handle}</span>
              </div>
              <div className={styles.content}>{t.content}</div>
              <div className={styles.date}>{t.date}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TestimonialCards;