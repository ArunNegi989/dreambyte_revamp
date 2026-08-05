"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./TrustedBrands.module.css";
import { fetchBrands } from "@/lib/api/brands";
import { getAssetUrl } from "@/lib/getAssetUrl";
import { Brand as ApiBrand } from "@/types/brand";

interface DisplayBrand {
  name: string;
  logo: string;
}

function MarqueeRow({
  brands,
  direction,
}: {
  brands: DisplayBrand[];
  direction: "left" | "right";
}) {
  if (brands.length === 0) return null;

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
              unoptimized
              priority={idx < brands.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustedBrands() {
  const [rowOneBrands, setRowOneBrands] = useState<DisplayBrand[]>([]);
  const [rowTwoBrands, setRowTwoBrands] = useState<DisplayBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    setLoading(true);
    try {
      const data: ApiBrand[] = await fetchBrands();

      // sirf active brands dikhane hain website pe
      const active = data.filter((b) => b.isActive);

      const toDisplay = (b: ApiBrand): DisplayBrand => ({
        name: b.name,
        logo: getAssetUrl(b.logo),
      });

      const rowOne = active
        .filter((b) => b.row === "rowOne")
        .sort((a, b) => a.order - b.order)
        .map(toDisplay);

      const rowTwo = active
        .filter((b) => b.row === "rowTwo")
        .sort((a, b) => a.order - b.order)
        .map(toDisplay);

      setRowOneBrands(rowOne);
      setRowTwoBrands(rowTwo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  // koi bhi active brand na ho to section hi hide kar do
  if (!loading && !error && rowOneBrands.length === 0 && rowTwoBrands.length === 0) {
    return null;
  }

  return (
    <section className={styles.wrapper} aria-label="Trusted by leading brands">
      <div className={styles.topLine} aria-hidden="true" />
      <div className={styles.glowOrb} aria-hidden="true" />

      <div className={styles.header}>
        <span className={styles.eyebrow}>Client Success</span>
        <h2 className={styles.title}>
          Trusted by <span className={styles.highlight}>World Leading Brands</span>
        </h2>
       
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#888", padding: "2rem 0" }}>
          Loading brands...
        </p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "#ff6b6b", padding: "2rem 0" }}>{error}</p>
      ) : (
        <div className={styles.marqueeContainer}>
          <div className={styles.fadeLeft} aria-hidden="true" />
          <div className={styles.fadeRight} aria-hidden="true" />

          <MarqueeRow brands={rowOneBrands} direction="left" />
          <MarqueeRow brands={rowTwoBrands} direction="right" />
        </div>
      )}
    </section>
  );
}