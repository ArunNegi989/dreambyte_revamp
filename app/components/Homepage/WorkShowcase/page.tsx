"use client";

import React, { useEffect, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import styles from "./WorkShowcase.module.css";
import videothumbnail1 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 152908.png";
import videothumbnail2 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 152945.png"
import videothumbnail3 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 153005.png"
import videothumbnail4 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 153029.png"


interface ReelVideo {
  id: string;
  videoSrc: string;
   poster: StaticImageData;
}

// Swap videoSrc with your own vertical (9:16) client reels.
const DEFAULT_REELS: ReelVideo[] = [
  {
    id: "r1",
    videoSrc:
      "/videos/studio_bts.webm",
    poster: videothumbnail1,
  },
  {
    id: "r2",
    videoSrc:
      "/videos/trycone_foot_cream_shoot.webm",
    poster: videothumbnail2,
  },
  {
    id: "r3",
    videoSrc:
      "/videos/UTTARAKHAND_WEDDING_AWARDS.webm",
    poster: videothumbnail3,
  },
  {
    id: "r4",
    videoSrc:
      "/videos/ERIKA+LUXE+4+AUG.webm",
    poster: videothumbnail4,
  },
];

interface ReelsShowcaseProps {
  heading?: string;
  subheading?: string;
  reels?: ReelVideo[];
}

const ReelsShowcase: React.FC<ReelsShowcaseProps> = ({
  heading = "Watch The Work",
  subheading = "Real client builds, straight up. Tap any reel to play with sound.",
  reels = DEFAULT_REELS,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const previewRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const isOpen = activeIndex !== null;
  const activeReel = isOpen ? reels[activeIndex as number] : null;

  useEffect(() => {
    Object.values(previewRefs.current).forEach((v) => {
      v?.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    Object.values(previewRefs.current).forEach((v) => {
      if (!v) return;
      if (isOpen) {
        v.pause();
      } else {
        v.play().catch(() => {});
      }
    });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && modalVideoRef.current) {
      const v = modalVideoRef.current;
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    }
  }, [activeIndex, isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeIndex]);

  const goNext = () => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % reels.length
    );
  };

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + reels.length) % reels.length
    );
  };

  return (
    <section className={styles.section}>
      <span className={`${styles.glow} ${styles.glow1}`} aria-hidden="true" />
      <span className={`${styles.glow} ${styles.glow2}`} aria-hidden="true" />

      <div className={styles.headingRow}>
        <span className={styles.tag}>
          <span className={styles.tagDot} />
          Client Reels
        </span>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subheading}>{subheading}</p>
      </div>

      

      <div className={styles.grid}>
        {reels.map((reel, i) => (
          <button
            key={reel.id}
            className={styles.reelCard}
            data-index={i % 2 === 0 ? "even" : "odd"}
            style={{ animationDelay: `${i * 0.1}s` }}
            onClick={() => setActiveIndex(i)}
            aria-label="Play reel with sound"
          >
            <span className={styles.reelInner}>
              <video
                ref={(el) => {
                  previewRefs.current[reel.id] = el;
                }}
                className={styles.previewVideo}
                src={reel.videoSrc}
                 poster={reel.poster.src}
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              />
              <span className={styles.reelOverlay} />
              
              <span className={styles.playCircle}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            
            </span>
          </button>
        ))}
      </div>

      {isOpen && activeReel && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveIndex(null)}
        >
          <button
            className={styles.closeBtn}
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className={`${styles.modalNav} ${styles.modalNavLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous reel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.modalGlowBorder} aria-hidden="true" />
            <video
              ref={modalVideoRef}
              className={styles.modalVideo}
              controls
              autoPlay
              loop
               poster={activeReel.poster.src}
            >
              <source src={activeReel.videoSrc} type="video/mp4" />
            </video>
          </div>

          <button
            className={`${styles.modalNav} ${styles.modalNavRight}`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next reel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default ReelsShowcase;