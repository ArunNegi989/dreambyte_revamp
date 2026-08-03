"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaHotel,
  FaGraduationCap,
  FaHeartbeat,
  FaShoppingCart,
  FaHome,
  FaPlane,
} from "react-icons/fa";
import styles from "./Industries.module.css";

type Industry = {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
};

const INDUSTRIES: Industry[] = [
  {
    id: "hotels-resorts",
    title: "Hotels & Resorts",
    description:
      "Help hotels and resorts attract more guests, increase bookings, and create memorable experiences with digital marketing and professionally designed websites.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    icon: FaHotel,
  },
  {
    id: "education",
    title: "Education",
    description:
      "Assist schools, colleges, and online courses in reaching more students, promoting programs, and building a strong online presence.",
    image:
      "https://images.unsplash.com/photo-1758270704925-fa59d93119c1?auto=format&fit=crop&w=1200&q=80",
    icon: FaGraduationCap,
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description:
      "Support hospitals, clinics, and healthcare providers in connecting with patients and showcasing services through digital marketing.",
    image:
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=80",
    icon: FaHeartbeat,
  },
  {
    id: "e-commerce",
    title: "E-Commerce",
    description:
      "Help online stores drive sales, increase traffic, and grow brand visibility with targeted marketing strategies.",
    image:
      "https://images.unsplash.com/photo-1758351507026-71ad3645cb43?auto=format&fit=crop&w=1200&q=80",
    icon: FaShoppingCart,
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description:
      "Enable real estate businesses to showcase properties, attract buyers, and strengthen market presence.",
    image:
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80",
    icon: FaHome,
  },
  {
    id: "travel-tourism",
    title: "Travel & Tourism",
    description:
      "Help travel agencies attract more travelers, increase bookings, and grow brand online with digital marketing.",
    image:
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80",
    icon: FaPlane,
  },
];

export default function Industries() {
  const [activeId, setActiveId] = useState<string>(INDUSTRIES[0].id);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>Industries we serve</span>
          <h2 className={styles.heading}>Smart marketing for every industry</h2>
          <p className={styles.subheading}>
            Six sectors, one playbook: understand the audience, then build the site and
            campaigns that reach them.
          </p>
        </div>

        <div className={styles.row} role="tablist" aria-label="Industries we serve">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            const isActive = industry.id === activeId;
            return (
              <button
                key={industry.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${industry.id}`}
                className={`${styles.card} ${isActive ? styles.active : ""}`}
                onClick={() => setActiveId(industry.id)}
                onFocus={() => setActiveId(industry.id)}
              >
                <div className={styles.imageWrap}>
                  <Image
                    src={industry.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.overlay} />

                <div className={styles.label} id={`panel-${industry.id}`}>
                  <span className={styles.icon}>
                    <Icon size={18} />
                  </span>
                  <h3 className={styles.title}>{industry.title}</h3>
                  <p className={styles.description}>{industry.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}