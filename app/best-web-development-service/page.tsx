"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Webdevelopmentpage.module.css";

const PROCESS_STEPS = [
  {
    title: "Custom Website Development",
    description: "Tailored solutions designed to fulfil your business goals.",
    image: "https://picsum.photos/seed/dbs-web-custom/700/525",
  },
  {
    title: "E-Commerce Development",
    description: "Build secure, high-performing, and user-friendly online stores.",
    image: "https://picsum.photos/seed/dbs-web-ecom/700/525",
  },
  {
    title: "Responsive Web Design",
    description: "Mobile-friendly websites that look perfect on all devices.",
    image: "https://picsum.photos/seed/dbs-web-responsive/700/525",
  },
  {
    title: "Website Redesign & Optimization",
    description: "Revamp outdated websites with modern layouts and improved performance.",
    image: "https://picsum.photos/seed/dbs-web-redesign/700/525",
  },
  {
    title: "Landing Page Design",
    description: "High-converting landing pages built for campaigns, ads, and lead generation.",
    image: "https://picsum.photos/seed/dbs-web-landing/700/525",
  },
  {
    title: "Maintenance & Support",
    description: "Regular updates, bug fixes, and technical support for smooth website performance.",
    image: "https://picsum.photos/seed/dbs-web-support/700/525",
  },
  {
    title: "Portfolio & Business Websites",
    description: "Elegant websites that showcase your brand, services, or personal portfolio.",
    image: "https://picsum.photos/seed/dbs-web-portfolio/700/525",
  },
  {
    title: "CMS Development (WordPress / Shopify / Wix)",
    description: "Flexible and easy-to-manage websites built on popular platforms.",
    image: "https://picsum.photos/seed/dbs-web-cms/700/525",
  },
  {
    title: "Web Hosting & Domain Setup",
    description: "Complete assistance in purchasing, configuring, and managing hosting and domain services.",
    image: "https://picsum.photos/seed/dbs-web-hosting/700/525",
  },
];

const FAQS = [
  {
    question: "What types of websites do you develop?",
    answer:
      "We develop all kinds of websites including business websites, eCommerce stores, portfolio sites, blogs, and custom web applications. Our team can provide a customized solution to meet your objectives, whether you require a basic landing page or a fully functional online platform.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Timelines depend on the scope, a simple business website usually takes 1-2 weeks, while custom e-commerce or web app builds can take 4-6 weeks. We'll give you a clear timeline after understanding your requirements.",
  },
  {
    question: "Will my website be mobile-friendly and SEO-optimized?",
    answer:
      "Yes, every website we build is fully responsive across devices and follows on-page SEO best practices from the ground up, including clean code, fast load times, and proper meta structure.",
  },
];

export default function WebDevelopmentPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Website Development <span className={styles.heroHighlight}>in Dehradun</span>
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Website Development in Dehradun</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.intro}>
            <strong>Experience the</strong> best of website development in Dehradun with Dream
            Byte Solutions. You can rely on Dream Byte Solutions to build amazing digital
            experiences for you. A powerful online presence is no more a luxury but a need in
            today&apos;s hyper-connected world. Being the top website development company in
            Dehradun makes us at Dream Byte Solutions Pvt. Ltd.
          </p>

          <h2 className={styles.sectionHeading}>
            Elevate Your Online Presence with Dream Byte Solutions
          </h2>

          <p className={styles.paragraph}>
            At Dream Byte Solutions, we don&apos;t just build websites—we create virtual
            experiences that help businesses grow. As a main website development company in
            Dehradun, our team of skilled and innovative developers combines years of experience
            with fresh thoughts to supply cutting-edge, results-driven websites. We realise that
            each enterprise is unique, and so are its digital needs.
          </p>
          <p className={styles.paragraph}>
            That&apos;s why, as a leading web development company in Dehradun, we take time to
            understand your brand, goals, and target audience before creating a website that
            truly reflects your vision and expertise. From the preliminary idea to the final
            launch, our team of professional website developers in Dehradun works carefully with
            you to make certain whole satisfaction, delivering custom website development and
            responsive website design that engages users and drives results.
          </p>

          {/* Process */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Website Development Services</h3>
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
          <ServicesSidebar currentService="Web Development" />
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