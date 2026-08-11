"use client";

import Image from "next/image";
import styles from "./WhyUs.module.css";
import image1 from "@/public/assets/images/homeboy.png";
import image2 from "@/public/assets/images/homegirl.png"

interface Section {
  badgeTitle: string;
  badgeSubtitle: string;
  heading?: string;
  description: string;
  bullets?: string[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean; // image on right instead of left
}

const sections: Section[] = [
  {
    badgeTitle: "Where Your Imagination",
    badgeSubtitle: "is our innovation",
    description:
      "Welcome to Dream Byte Solutions Pvt. Ltd., the best digital marketing agency in Dehradun. We keep our work simple, clear, and effective. Our motive is to make customers happy by providing them with the best quality services. We have a friendly and skilled team that uses new ideas and latest tools, to help your businesses grow. From SEO and PPC to social media and website development, we have everything your company is looking for. By understanding your goals, we create the best strategy to achieve real results. Together, we can grow and achieve our goal online.Dream Byte Solutions,top digital marketing agency in Dehradun, Uttarakhand.",
    imageSrc:
      image1.src,
    imageAlt: "Creative digital marketing strategist",
    reverse: false,
  },
  {
    badgeTitle: "Why we are The Best",
    badgeSubtitle: "Digital Marketing Agency in Dehradun?",
    description:
      "Being the best digital marketing agency in Dehradun, we enable businesses and brands to reach out to the right audience, both online and offline. That's why we are considered the best digital marketing and website designing Agency in Dehradun. We are here to assist you in growing. Connect with us and let's develop your brand together with the support of the top digital marketing agency in Dehradun, Uttarakhand.",
    bullets: [
      "Reach the right people at the right time.",
      "Build a website that speaks for your Business.",
      "Appear on Google while it matters most.",
      "Connect together with your target audience on social media.",
    ],
    imageSrc:
      image2.src,
    imageAlt: "Digital marketing strategist with tablet",
    reverse: true,
  },
];

function TrophyBadge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className={styles.badgePill}>
      <span className={styles.badgeIcon}>
        <svg viewBox="0 0 24 24" width="35" height="35" fill="none">
          <path
            d="M8 4h8v3a4 4 0 0 1-8 0V4Z"
            stroke="#f2a13e"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M6 5H4a2 2 0 0 0 2 4M18 5h2a2 2 0 0 1-2 4"
            stroke="#f2a13e"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M10 11v2m4-2v2" stroke="#f2a13e" strokeWidth="1.4" />
          <path
            d="M8 17c0-1.2 1.8-2 4-2s4 .8 4 2v1H8v-1Z"
            stroke="#f2a13e"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.badgeText}>
        <b>{title}</b>
        <br />
        {subtitle}
      </span>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.blobTop} aria-hidden="true" />
      <div className={styles.blobBottom} aria-hidden="true" />

      {sections.map((s, i) => (
        <div
          key={i}
          className={`${styles.row} ${s.reverse ? styles.rowReverse : ""}`}
        >
          <div className={styles.imageCol}>
            <div className={styles.imageGlow} />
            <Image
              src={s.imageSrc}
              alt={s.imageAlt}
              width={520}
              height={620}
              className={styles.characterImg}
              priority={i === 0}
            />
          </div>

          <div className={styles.textCol}>
            <TrophyBadge title={s.badgeTitle} subtitle={s.badgeSubtitle} />

            <p className={styles.description}>{s.description}</p>

            {s.bullets && (
              <div className={styles.bulletsBlock}>
                <p className={styles.bulletsHeading}>We Help You:</p>
                <ul className={styles.bulletsList}>
                  {s.bullets.map((b, idx) => (
                    <li key={idx} className={styles.bulletItem}>
                      <span className={styles.bulletDot} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className={styles.exploreBtn}>
              EXPLORE ME
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={styles.btnArrow}
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}