"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Photographyvideographypage.module.css";

const SERVICES = [
  {
    title: "Event Photography & Videography",
    description:
      "Capture weddings, birthdays, corporate events, and special occasions with professional quality.",
    image: "https://picsum.photos/seed/dbs-pv-event/700/525",
  },
  {
    title: "Product & Commercial Shoots",
    description:
      "High-quality photos and videos that make your products stand out for ads, catalogs, and e-commerce.",
    image: "https://picsum.photos/seed/dbs-pv-product/700/525",
  },
  {
    title: "Fashion & Portfolio Shoots",
    description:
      "Creative photoshoots for models, influencers, and personal branding.",
    image: "https://picsum.photos/seed/dbs-pv-fashion/700/525",
  },
  {
    title: "Real Estate & Interior Shoots",
    description:
      "Showcase properties, hotels, and interiors with stunning visuals and drone shots.",
    image: "https://picsum.photos/seed/dbs-pv-realestate/700/525",
  },
  {
    title: "Corporate Photography & Videography",
    description:
      "Professional shoots for company profiles, team portraits, conferences, and promotional content.",
    image: "https://picsum.photos/seed/dbs-pv-corporate/700/525",
  },
  {
    title: "Maternity & Baby Shoots",
    description:
      "Capture beautiful memories of motherhood and early childhood with artistic photography.",
    image: "https://picsum.photos/seed/dbs-pv-maternity/700/525",
  },
];

const FAQS = [
  {
    question: "What types of photography and videography services do you offer?",
    answer:
      "Our services include a variety of professional photography and video services, including production of social media content, event coverage, corporate photography, product photography, brand videos, and promotional films. Whatever the shoot may be, our team captures every moment with precision and creativity.",
  },
  {
    question: "Do you provide both indoor and outdoor shoots?",
    answer:
      "Yes, our team is equipped to handle both indoor studio setups and outdoor location shoots. Whether it's a controlled studio environment or a live event outdoors, we adapt our lighting and equipment to get the best results for your shoot.",
  },
];

export default function PhotographyVideographyPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroHighlight}>Photography and Videography</span>
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Photography and Videography</span>
          </nav>
          <p className={styles.heroIntro}>
            Our photography and videography service are the ones that capture the essence of
            your moments as creatively and precisely as possible. Dream Byte Solutions is the
            best Photo Studio in Dehradun and it is trusted by leading brands of Uttarakhand as we
            ensure that each frame is taken with perfection by combining our creativity and
            experience. Using top quality equipment and innovative techniques, we deliver visually
            stunning content that elevates your brand or special moments.
          </p>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <h2 className={styles.sectionHeading}>
            &quot;Capture Your Story with the best Photo Studio | Dream Byte Solutions&quot;
          </h2>

          <p className={styles.paragraph}>
            &quot;At <strong>Dream Byte Solutions</strong>, we capture moments that tell a story
            through our professional photography and videography services. Whether it is events,
            branding, ad shoot or personal project, we concentrate on the production of
            aesthetically appealing and impactful content. Our team will ensure every process from
            pre-production planning up to final edits will be done precisely. We make each shot
            cinematic, creative and effective. Partner with us and let us bring your vision to
            life through our creative photography and videography services for better
            visibility.&quot;
          </p>
          <p className={styles.paragraph}>
            When it comes to capturing moments with perfection, Dream Byte Solutions Pvt. Ltd.
            stands out as we have the best photographers in Dehradun. Whether you&apos;re looking
            for professional corporate photography, content creation, event shoots, ad films or a
            product photography, our team of experts is dedicated to delivering exceptional
            results that reflect your brand&apos;s vision and story. We offer a variety of
            photography and videography services, and our team combine creativity with technical
            knowledge to consistently deliver picture-perfect results.
          </p>

          {/* Services */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Photography And Videography Services</h3>
          </div>
          <ServicesGrid />

          {/* FAQ */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>FAQ&apos;s</h3>
          </div>
          <FaqAccordion />
        </main>

        {/* ---------- Sidebar: reused common component ---------- */}
        <div className={styles.sidebarCol}>
          <ServicesSidebar currentService="Photography / Videography" />
        </div>
      </div>
    </div>
  );
}

function ServicesGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? SERVICES[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <>
      <div className={styles.processGrid}>
        {SERVICES.map((item, i) => (
          <button
            type="button"
            className={styles.processCard}
            key={item.title}
            onClick={() => setActiveIndex(i)}
          >
            <div className={styles.processImageWrap}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.processImage}
                loading="lazy"
              />
              <span className={styles.processZoomHint}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className={styles.processBody}>
              <span className={styles.processNumber}>{String(i + 1).padStart(2, "0")}</span>
              <h4 className={styles.processTitle}>{item.title}</h4>
              <p className={styles.processDesc}>{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M2 2L16 16M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className={styles.modalImageWrap}>
              <img src={active.image} alt={active.title} className={styles.modalImage} />
            </div>

            <div className={styles.modalInfo}>
              <span className={styles.processNumber}>
                {String(activeIndex! + 1).padStart(2, "0")}
              </span>
              <h4 className={styles.modalTitle}>{active.title}</h4>
              <p className={styles.modalDesc}>{active.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.faqList}>
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={styles.faqItem} key={faq.question}>
            <button
              type="button"
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={isOpen ? styles.faqQuestionOpen : ""}>{faq.question}</span>
              <span className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ""}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 1V13M1 7H13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            <div className={styles.faqAnswerWrap} style={{ maxHeight: isOpen ? "300px" : "0px" }}>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}