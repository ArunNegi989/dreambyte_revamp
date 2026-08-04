"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Graphicdesigningpage.module.css";

const PROCESS_STEPS = [
  {
    title: "Logo Design",
    description: "Creative and memorable logos that represent your brand identity.",
    image: "https://picsum.photos/seed/dbs-logo/700/525",
  },
  {
    title: "Branding & Identity Kit",
    description: "Complete brand setup with color palette, typography, and style guide.",
    image: "https://picsum.photos/seed/dbs-branding/700/525",
  },
  {
    title: "Social Media Creatives",
    description: "Attractive posts, stories, and ad graphics designed for all platforms.",
    image: "https://picsum.photos/seed/dbs-social/700/525",
  },
  {
    title: "Advertisement Video Editing",
    description: "Professional ad videos for marketing campaigns and brand promotions.",
    image: "https://picsum.photos/seed/dbs-adedit/700/525",
  },
  {
    title: "Poster & Banner Design",
    description: "Stunning visuals for events, offers, and promotions.",
    image: "https://picsum.photos/seed/dbs-poster/700/525",
  },
  {
    title: "Brochure & Flyer Design",
    description: "Eye-catching marketing materials for print or digital distribution.",
    image: "https://picsum.photos/seed/dbs-brochure/700/525",
  },
  {
    title: "Product Showcase Videos",
    description: "Engaging videos that highlight product features and attract buyers.",
    image: "https://picsum.photos/seed/dbs-product/700/525",
  },
  {
    title: "2D & 3D Video Editing",
    description: "High-quality motion and animation videos that bring ideas to life.",
    image: "https://picsum.photos/seed/dbs-3d/700/525",
  },
  {
    title: "Website & App Graphics",
    description: "Modern and responsive UI/UX visuals for websites and mobile apps.",
    image: "https://picsum.photos/seed/dbs-uiux/700/525",
  },
];

const FAQS = [
  {
    question: "What types of graphic design services do you offer?",
    answer:
      "Our graphic design services are diverse such as designing a logo, branding and identity package, social media creatives, advertising video editing, poster and banner design, brochure and flyer design, product showcase video editing, 2D and 3D, and Website and App graphics.",
  },
  {
    question: "Why is professional graphic design important for my business?",
    answer:
      "Professional design builds trust, communicates your brand message clearly, and helps you stand out from competitors across every platform your customers see you on.",
  },
  {
    question: "Do you provide designs for both digital and print use?",
    answer:
      "Yes, we deliver print-ready files for brochures, flyers, and banners, along with fully optimized digital assets for websites, apps, and social media.",
  },
];

export default function GraphicDesigningPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Graphic Design <span className={styles.heroHighlight}>Company</span> In Dehradun
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Graphic Designing</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.intro}>
            At Dream Byte Solutions, we provide graphic design services that catch the eyes of
            your viewers. Being the best graphic design company in Dehradun, we are dedicated to
            transforming ordinary design into extraordinary brand experiences. We have a team of
            talented and professional designers who are committed to enhancing any design into a
            magnificent piece of artwork.
          </p>

          <h2 className={styles.sectionHeading}>
            Graphic Designer Dehradun – Creative &amp; Professional Design Services
          </h2>

          <p className={styles.paragraph}>
            We believe that great design goes beyond appearance, it&apos;s about functionality,
            clarity and impact. Our team crafts visuals that increase the reach of your brand and
            designs that ensure to communicate your brand&apos;s message effectively, and this is
            what makes us one of the best graphic design companies.
          </p>
          <p className={styles.paragraph}>
            We offer unique logos and branding assets to engage social media creatives, website
            banners, and marketing materials. We deliver complete graphic design services and
            ensure the complete transformation of your brand and page. A strong visual identity
            builds trust, and we help you achieve that with innovative, high-quality designs.
          </p>

          {/* Process */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Process for Creative Designs</h3>
          </div>
          <ProcessGrid />

          {/* FAQ */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>FAQ&apos;s</h3>
          </div>
          <FaqAccordion />
        </main>

        {/* ---------- Sidebar: reused common component ---------- */}
        <div className={styles.sidebarCol}>
          <ServicesSidebar currentService="Graphic Designing" />
        </div>
      </div>
    </div>
  );
}

function ProcessGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? PROCESS_STEPS[activeIndex] : null;

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
        {PROCESS_STEPS.map((step, i) => (
          <button
            type="button"
            className={styles.processCard}
            key={step.title}
            onClick={() => setActiveIndex(i)}
          >
            <div className={styles.processImageWrap}>
              <img
                src={step.image}
                alt={step.title}
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
              <h4 className={styles.processTitle}>{step.title}</h4>
              <p className={styles.processDesc}>{step.description}</p>
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
              <span>{faq.question}</span>
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