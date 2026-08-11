"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import styles from "./Testimonialslider.module.css";

export interface CardTestimonial {
  id: string;
  handle: string;
  designation: string;
  rating: number;
  content: string;
  date: string;
}

interface TestimonialSliderProps {
  testimonials?: CardTestimonial[];
  intervalMs?: number;
}

const PEOPLE = [
  "Rahul Mehra",
  "Sakshi Bisht",
  "Priya Nair",
  "Nitin Sharma",
  "Megha Rawat",
  "Varun Kapoor",
  "Ananya Josh",
  "Mohit Negi",
  "Ishita Verma",
  "Deepak Bisht",
  "Priya Arora",
  "Kai Sato",
];

const CONTENTS = [
  "Dream Byte Solutions did an excellent job with our website. The team understood our requirements, suggested useful improvements, and delivered a clean and professional website. Everything from the design to the overall user experience was handled very well. Really happy with their work!",
  "Working with Dream Byte Solutions has been a great experience. Their team is creative, responsive, and always ready to understand what the client actually needs. They helped us improve our online presence and made our brand look much more professional. Highly recommended!",
  "Dream Byte Solutions helped us take our digital presence to the next level. Their SEO and digital marketing strategies brought better visibility and more enquiries for our business. The team regularly shared updates and explained everything clearly. Very professional and result-focused team.",
  "I am really impressed with the team at Dream Byte Solutions. From website development to digital marketing, they handled everything smoothly and professionally. They were patient with our requirements and made sure every detail was properly taken care of. Definitely a reliable team for digital solutions.",
  "We were looking for a team that could manage our website and online marketing together, and Dream Byte Solutions was the right choice. Their work has helped us build a stronger online presence and connect with more customers. The team is supportive, creative, and easy to work with. Great experience overall!",
  "Our online presence improved significantly after working with Dream Byte Solutions. Their team helped us with social media, content, and digital marketing in a very organized way. The quality of the creatives and communication was impressive. I would definitely recommend them to businesses looking to grow online.",
  "Dream Byte Solutions has done a great job with our SEO. They worked on our website step by step and helped improve our visibility on Google. We started getting more relevant visitors and enquiries after their work. A knowledgeable and dependable team!",
  "The creativity and professionalism of Dream Byte Solutions really stood out to us. They understood our brand and created digital content that matched our vision perfectly. The team was always open to feedback and quick with revisions. Very satisfied with the overall experience.",
];

const DEFAULT_TESTIMONIALS: CardTestimonial[] = PEOPLE.map((name, i) => ({
  id: name.toLowerCase().replace(/\s+/g, "-"),
  handle: `${name.replace(/\s+/g, " ")}`,
  designation: "",
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
    <span className={styles.stars} aria-label={`${rounded} out of 5 stars`}>
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </span>
  );
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  intervalMs = 5000,
}) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;
  const current = testimonials[active];

  const goTo = (dir: 1 | -1) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + total) % total);
  };

  const goToIndex = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
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
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <p className={styles.eyebrow}>Client Testimonials</p>
        <h2 className={styles.heading}>What our clients say</h2>

        <div className={styles.cardArea}>
          <button
            type="button"
            aria-label="Previous testimonial"
            className={`${styles.arrowButton} ${styles.arrowLeft}`}
            onClick={() => goTo(-1)}
          >
            <FaChevronLeft size={14} />
          </button>

          <div className={styles.cardViewport}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                className={styles.card}
                custom={direction}
                initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <FaQuoteLeft className={styles.quoteIcon} aria-hidden="true" />

                <p className={styles.quote}>
                  {words.map((word, i) => (
                    <motion.span
                      key={`${current.id}-${i}`}
                      className={styles.word}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.06 + i * 0.012 }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </p>

                <div className={styles.divider} />

                <div className={styles.meta}>
                  <div className={styles.avatarInitial} aria-hidden="true">
                    {current.handle.replace("@", "").charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.metaText}>
                    <h3 className={styles.handle}>{current.handle}</h3>
                    {current.designation && (
                      <p className={styles.designation}>{current.designation}</p>
                    )}
                  </div>
                  <div className={styles.metaRight}>
                    <Stars rating={current.rating} />
                    <span className={styles.date}>{current.date}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            className={`${styles.arrowButton} ${styles.arrowRight}`}
            onClick={() => goTo(1)}
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        <div className={styles.dots}>
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => goToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;