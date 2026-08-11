"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { StaticImageData } from "next/image";
import styles from "./ReelsShowcase.module.css";
import videothumbnail1 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 152908.png";
import videothumbnail2 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 152945.png"
import videothumbnail3 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 153005.png"
import videothumbnail4 from "@/public/assets/videothumbnail/Screenshot 2026-08-11 153029.png"
export type Reel = {
  id: string;
  src: string;
 poster: StaticImageData;
  visitUrl?: string;
  visitLabel?: string;
};

// Default demo data (Google's public sample videos) so this section
// works out of the box as a standalone page component — replace with
// your real reels whenever they're ready.
const defaultReels: Reel[] = [
  {
    id: "1",
    src: "/videos/studio_bts.webm",
    poster: videothumbnail1,
   
    visitUrl: "https://peach.blender.org/",
    visitLabel: "Visit",
  },
  {
    id: "2",
    src: "/videos/trycone_foot_cream_shoot.webm",
    poster: videothumbnail2,
    visitUrl: "https://orange.blender.org/",
    visitLabel: "Visit",
  },
  {
    id: "3",
    src: "/videos/UTTARAKHAND_WEDDING_AWARDS.webm",
    poster: videothumbnail3,
    visitUrl: "https://www.google.com",
    visitLabel: "Visit",
  },
  {
    id: "4",
    src: "/videos/ERIKA+LUXE+4+AUG.webm",
    poster: videothumbnail4,
    visitUrl: "https://www.google.com",
    visitLabel: "Visit",
  },
];

type ReelsShowcaseProps = {
  reels?: Reel[];
};

const ReelsShowcase = ({ reels = defaultReels }: ReelsShowcaseProps) => {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const cardVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Autoplay every card's video (muted) as soon as it mounts, and keep
  // it looping continuously — this is what makes the strip feel "alive".
  useEffect(() => {
    Object.values(cardVideoRefs.current).forEach((video) => {
      if (!video) return;
      video.muted = true;
      video.play().catch(() => {
        // Autoplay can be blocked before user interaction on some
        // browsers — that's fine, it'll start on first interaction.
      });
    });
  }, [reels]);

  const openModal = useCallback((reel: Reel) => {
    setActiveReel(reel);
    setIsClosing(false);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsClosing(true);
    window.setTimeout(() => {
      setActiveReel(null);
      setIsClosing(false);
      document.body.style.overflow = "";
    }, 200);
  }, []);

  // When the modal opens, unmute + play with sound
  useEffect(() => {
    if (!activeReel) return;
    const video = modalVideoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [activeReel]);

  // Close on Escape
  useEffect(() => {
    if (!activeReel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeReel, closeModal]);

  return (
    <>
      <div className={styles.grid}>
        {reels.map((reel) => (
          <button
            key={reel.id}
            type="button"
            className={styles.card}
            onClick={() => openModal(reel)}
           
          >
            <video
              ref={(el) => {
                cardVideoRefs.current[reel.id] = el;
              }}
              className={styles.cardVideo}
              src={reel.src}
             poster={reel.poster.src}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            />

            <div className={styles.cardOverlay} />

            <div className={styles.playBadge}>
              <svg viewBox="0 0 24 24" className={styles.playIcon} aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </div>

           
          </button>
        ))}
      </div>

      {activeReel && (
        <div
          className={`${styles.modalBackdrop} ${isClosing ? styles.modalBackdropClosing : ""}`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`${styles.modalContent} ${isClosing ? styles.modalContentClosing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className={styles.closeIcon} aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className={styles.modalVideoWrap}>
              <video
                ref={modalVideoRef}
                className={styles.modalVideo}
                src={activeReel.src}
                 poster={activeReel.poster.src}
                loop
                playsInline
                controls
              />
            </div>

          

            {activeReel.visitUrl && (
              <a
                href={activeReel.visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitButton}
              >
                {activeReel.visitLabel ?? "Visit"}
                <svg viewBox="0 0 24 24" className={styles.visitIcon} aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReelsShowcase;