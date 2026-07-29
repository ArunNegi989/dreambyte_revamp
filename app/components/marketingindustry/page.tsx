"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaGraduationCap,
  FaHeartbeat,
  FaShoppingCart,
  FaHome,
  FaPlane,
  FaArrowRight,
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
    image: "/industries/hotels-resorts.jpg",
    icon: FaHotel,
  },
  {
    id: "education",
    title: "Education",
    description:
      "Assist schools, colleges, and online courses in reaching more students, promoting programs, and building a strong online presence.",
    image: "/industries/education.jpg",
    icon: FaGraduationCap,
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description:
      "Support hospitals, clinics, and healthcare providers in connecting with patients and showcasing services through digital marketing.",
    image: "/industries/healthcare.jpg",
    icon: FaHeartbeat,
  },
  {
    id: "e-commerce",
    title: "E-Commerce",
    description:
      "Help online stores drive sales, increase traffic, and grow brand visibility with targeted marketing strategies.",
    image: "/industries/e-commerce.jpg",
    icon: FaShoppingCart,
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description:
      "Enable real estate businesses to showcase properties, attract buyers, and strengthen market presence.",
    image: "/industries/real-estate.jpg",
    icon: FaHome,
  },
  {
    id: "travel-tourism",
    title: "Travel & Tourism",
    description:
      "Help travel agencies attract more travelers, increase bookings, and grow brand online with digital marketing.",
    image: "/industries/travel-tourism.jpg",
    icon: FaPlane,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function Industries() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <span className={styles.eyebrow}>industries we serve</span>
          <h2 className={styles.heading}>Smart Marketing For Every Industry</h2>
        </div>

        <div className={styles.grid}>
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.id}
                className={styles.card}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
              >
                <div className={styles.imageWrap}>
                  <div className={styles.imageInner}>
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                  <span className={styles.iconBadge}>
                    <Icon size={16} />
                  </span>
                </div>

                <div className={styles.body}>
                  <h3 className={styles.title}>{industry.title}</h3>
                  <p className={styles.description}>{industry.description}</p>
                
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}