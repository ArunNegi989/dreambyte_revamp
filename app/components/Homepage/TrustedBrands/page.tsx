"use client";

import Image from "next/image";
import styles from "./TrustedBrands.module.css";
import brand1 from "@/public/assets/logos/1.png";
import brand2 from "@/public/assets/logos/2.png";
import brand3 from "@/public/assets/logos/3.png";
import brand4 from "@/public/assets/logos/4.png";
import brand5 from "@/public/assets/logos/5.png";
import brand6 from "@/public/assets/logos/6.png";
import brand7 from "@/public/assets/logos/7.png";
import brand8 from "@/public/assets/logos/8.png";
import brand9 from "@/public/assets/logos/9.png";
import brand10 from "@/public/assets/logos/10.png";
import brand11 from "@/public/assets/logos/11.png";
import brand12 from "@/public/assets/logos/3.png";
import brand13 from "@/public/assets/logos/1.png";
import brand14 from "@/public/assets/logos/2.png";
import brand15 from "@/public/assets/logos/3.png";

interface Brand {
  name: string;
  logo: string; // path from /public, e.g. "/brands/cosmic-journeys.png"
}

// 👉 Replace these logo paths with your actual images placed in /public/brands/
const rowOneBrands: Brand[] = [
  { name: "Cosmic Journeys", logo: brand1.src },
  { name: "Flair Pest Control", logo: brand2.src },
  { name: "RYSA", logo: brand3.src },
  { name: "SpaceAge Hiring Services", logo: brand4.src },
  { name: "Stock Emphasis", logo: brand5.src },
];

const rowTwoBrands: Brand[] = [
  { name: "TARYA Salon & Studio", logo: brand6.src },
  { name: "PahadiFresh India", logo: brand7.src },
  { name: "Happy Universal", logo: brand8.src },
  { name: "UAPI", logo: brand9.src },
  { name: "RYSA", logo: brand10.src },
];

function MarqueeRow({
  brands,
  direction,
}: {
  brands: Brand[];
  direction: "left" | "right";
}) {
  // duplicate the row so translateX(-50%) loops seamlessly
  const doubled = [...brands, ...brands];

  return (
    <div className={styles.row}>
      <div
        className={`${styles.track} ${
          direction === "left" ? styles.trackLeft : styles.trackRight
        }`}
      >
        {doubled.map((brand, idx) => (
          <div className={styles.logoCard} key={`${brand.name}-${idx}`}>
            <div className={styles.logoCardGlow} aria-hidden="true" />
            <Image
              src={brand.logo}
              alt={brand.name}
              width={140}
              height={56}
              className={styles.logoImg}
              priority={idx < brands.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBrands() {
  return (
    <section className={styles.wrapper} aria-label="Trusted by leading brands">
      <div className={styles.topLine} aria-hidden="true" />
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className={styles.header}>
        <span className={styles.eyebrow}>Client Success</span>
        <h2 className={styles.title}>
          Trusted by <span className={styles.highlight}>World Leading Brands</span>
        </h2>
        <p className={styles.subtitle}>
          Hover any logo to see it pop — two rows, opposite directions, endless loop.
        </p>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.fadeLeft} aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />

        <MarqueeRow brands={rowOneBrands} direction="left" />
        <MarqueeRow brands={rowTwoBrands} direction="right" />
      </div>
    </section>
  );
}