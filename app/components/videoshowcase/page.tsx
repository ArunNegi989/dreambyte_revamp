"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ReelsShowcase.module.css";

export type Reel = {
  id: string;
  src: string;
  poster?: string;
  title?: string;
  visitUrl?: string;
  visitLabel?: string;
};

// Default demo data (Google's public sample videos) so this section
// works out of the box as a standalone page component — replace with
// your real reels whenever they're ready.
const defaultReels: Reel[] = [
  {
    id: "1",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
    visitUrl: "https://peach.blender.org/",
    visitLabel: "Visit",
  },
  {
    id: "2",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Elephants Dream",
    visitUrl: "https://orange.blender.org/",
    visitLabel: "Visit",
  },
  {
    id: "3",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
    visitUrl: "https://www.google.com",
    visitLabel: "Visit",
  },
  {
    id: "4",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    title: "For Bigger Joyrides",
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
            aria-label={reel.title ? `Play ${reel.title}` : "Play reel"}
          >
            <video
              ref={(el) => {
                cardVideoRefs.current[reel.id] = el;
              }}
              className={styles.cardVideo}
              src={reel.src}
              poster={reel.poster}
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

            {reel.title && (
              <span className={styles.cardTitle}>{reel.title}</span>
            )}
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
                poster={activeReel.poster}
                loop
                playsInline
                controls
              />
            </div>

            {activeReel.title && (
              <p className={styles.modalTitle}>{activeReel.title}</p>
            )}

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