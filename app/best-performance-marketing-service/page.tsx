"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Performancemarketingpage.module.css";

const SERVICES = [
  {
    title: "Goal-Oriented Campaigns",
    description:
      "We design advertising and marketing campaigns with clear, measurable goals. Whether your aim is growing website visitors, generating leads, or boosting online sales, our campaigns are built to deliver tangible results.",
    image: "https://picsum.photos/seed/dbs-pm-goals/700/525",
  },
  {
    title: "Targeted Advertising",
    description:
      "Using precise audience segmentation, we make sure your ads reach the individuals who are most likely to engage with your brand. This ensures every advertising rupee is spent accurately, maximising your reach and conversions.",
    image: "https://picsum.photos/seed/dbs-pm-targeted/700/525",
  },
  {
    title: "Real-time Tracking and Optimisation",
    description:
      "We are constantly monitoring your campaigns and adjusting in real time. By analysing regular performance data, we can quickly improve campaigns and ensure better results and a high ROI.",
    image: "https://picsum.photos/seed/dbs-pm-tracking/700/525",
  },
  {
    title: "Result and Analysis",
    description:
      "We focus on major performance indicators such as ROI, cost per acquisition, conversion frequency and click-through rates. This way, you always know how your marketing campaigns are doing and can make informed decisions.",
    image: "https://picsum.photos/seed/dbs-pm-results/700/525",
  },
  {
    title: "Multi-Channel Strategy",
    description:
      "We leverage multiple digital platforms — including Google Ads, Meta, YouTube, and LinkedIn — to create an integrated approach that maximizes visibility. By diversifying your ad placements, we help your brand connect with audiences across every stage of the buyer journey.",
    image: "https://picsum.photos/seed/dbs-pm-multichannel/700/525",
  },
  {
    title: "Conversion Rate Optimization (CRO)",
    description:
      "Our team analyses user behaviour, landing page performance, and ad engagement to identify what drives action. Through A/B testing, creative refinement, and funnel optimization, we ensure that every click has a higher chance of turning into a customer.",
    image: "https://picsum.photos/seed/dbs-pm-cro/700/525",
  },
];

const FAQS = [
  {
    question: "Looking for a Complete Performance Marketing Solution?",
    intro: "As a full-service performance marketing company, we offer a wide range of online marketing services including:",
    bullets: [
      {
        label: "Search Engine Optimisation (SEO): ",
        text: "Boost your website's visibility and rank higher on Google.",
      },
      {
        label: "Pay-Per-Click (PPC) Advertising: ",
        text: "Targeted ads to reach potential customers instantly.",
      },
      {
        label: "Social Media Marketing (SMM): ",
        text: "Build engagement and brand loyalty on social platforms.",
      },
      {
        label: "Email Marketing & Automation: ",
        text: "Reach your audience directly with personalised campaigns.",
      },
    ],
  },
  {
    question: "Why Choose Dream Byte Solutions?",
    intro:
      "We pair data-backed strategy with hands-on campaign management, so every rupee of ad spend is working toward a measurable outcome rather than just impressions.",
    bullets: [
      {
        label: "Transparent Reporting: ",
        text: "You always know exactly how your campaigns are performing and where your budget is going.",
      },
      {
        label: "Dedicated Account Support: ",
        text: "A dedicated team stays close to your campaigns, making adjustments as market conditions and results change.",
      },
      {
        label: "Local + Platform Expertise: ",
        text: "We combine an understanding of the Dehradun market with hands-on experience across Google, Meta, and other major ad platforms.",
      },
    ],
  },
];

export default function PerformanceMarketingPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroHighlight}>Performance Marketing</span>
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Performance Marketing</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.intro}>
            Our performance marketing services focus on driving measurable results and maximizing
            your return on investment. We implement data-driven strategies across various
            channels—such as search, social media, and display advertising—to attract and convert
            your target audience. By continuously analyzing and optimizing campaigns, we ensure
            your marketing budget is spent effectively to achieve your business goals and deliver
            tangible, quantifiable outcomes.
          </p>

          <h2 className={styles.sectionHeading}>
            Grow Your Business with Dream Byte Solutions &ndash; Leading Performance Marketing
            Company
          </h2>

          <p className={styles.paragraph}>
            At Dream Byte Solutions, we&apos;re one of the best performance marketing companies
            in Dehradun. Our task is easy: to assist corporations by handing over the best
            results through fact-based advertising techniques. Whether you want to generate more
            leads, boost sales, or power-centred visitors, we create campaigns that convey real
            business growth and an excessive Return On Investment (ROI).
          </p>
          <p className={styles.paragraph}>
            We recognise that every business is particular, and so are its advertising goals.
            That&apos;s why we take the time to understand your business, target audience, and
            goals before building a method. From planning to execution, we work intently with you
            at each step, making sure your campaigns are effective, keen, and result-oriented.
          </p>

          {/* Services */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Performance Marketing Services</h3>
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
          <ServicesSidebar currentService="Performance Marketing" />
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
            <div
              className={styles.faqAnswerWrap}
              style={{ maxHeight: isOpen ? "900px" : "0px" }}
            >
              <div className={styles.faqAnswer}>
                <p className={styles.faqAnswerIntro}>{faq.intro}</p>
                <ul className={styles.faqBulletList}>
                  {faq.bullets.map((b, idx) => (
                    <li key={idx} className={styles.faqBulletItem}>
                      <strong className={styles.faqAnswerLabel}>{b.label}</strong>
                      {b.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}