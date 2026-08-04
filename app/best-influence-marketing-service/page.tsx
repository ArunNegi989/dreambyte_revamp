"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Influencemarketingpage.module.css";

const SERVICES = [
  {
    title: "Influencer Identification & Collaboration",
    description:
      "We find niche-specific influencers whose followers align with your target audience.",
    image: "https://picsum.photos/seed/dbs-im-identify/700/525",
  },
  {
    title: "Campaign Strategy & Execution",
    description:
      "From concept to content, we handle everything to ensure maximum reach and ROI.",
    image: "https://picsum.photos/seed/dbs-im-strategy/700/525",
  },
  {
    title: "Content Creation & Management",
    description:
      "Engaging posts, reels, and stories that fit your brand voice and influencer's style.",
    image: "https://picsum.photos/seed/dbs-im-content/700/525",
  },
  {
    title: "Performance Tracking & Analytics",
    description:
      "Real-time insights to measure engagement, reach, and conversion results.",
    image: "https://picsum.photos/seed/dbs-im-analytics/700/525",
  },
  {
    title: "Multi-Platform Coverage",
    description:
      "Instagram, YouTube, Facebook, X (Twitter), and more — wherever your audience lives online.",
    image: "https://picsum.photos/seed/dbs-im-platforms/700/525",
  },
  {
    title: "Brand Ambassador Programs",
    description:
      "Develop long-term influencer partnerships that continuously promote your brand, create loyalty, and drive consistent growth.",
    image: "https://picsum.photos/seed/dbs-im-ambassador/700/525",
  },
];

const FAQS = [
  {
    question: "Why Dream Byte Solutions for Influence Marketing?",
    answer: [
      {
        label: "Access to the Best Influencers: ",
        text:
          "We work with the most diverse pool of top influencers in Dehradun and other places, ensuring your brand gets the attention it deserves. From Instagram trendsetters and YouTube creators to niche bloggers and TikTok stars, we have connections with influencers who align perfectly with your brand's values and target audience.",
      },
      {
        label: "Tailored Campaigns for Maximum Impact: ",
        text:
          "Every brand is unique, and so are its marketing needs. Our expert team designs bespoke influence marketing campaigns that resonate with your audience and amplify your message.",
      },
      {
        label: "Comprehensive Brand Promotion: ",
        text:
          "Whether you are launching a new product, increasing awareness, or driving sales, our influence marketing strategies focus on measurable results. We ensure that your brand gets featured in engaging content that drives conversions and fosters loyalty.",
      },
      {
        label: "Seamless Execution: ",
        text:
          "From finding the right influencers to monitoring contracts, content development and performance monitoring, we will keep all of that for your account.",
      },
      {
        label: "Data-Driven: ",
        text:
          "We are all about extracting value from insights. On-going monitoring of campaign performance provides an opportunity to refine those strategies in pursuit of generating the best possible outcome from invested dollars.",
      },
    ],
  },
  {
    question: "How We Make a Difference?",
    answer: [
      {
        label: "",
        text:
          "We combine local market knowledge with a genuine influencer network, so campaigns feel authentic rather than forced. Every partnership is chosen for fit first, reach second, which keeps engagement and trust high across the content we help create.",
      },
    ],
  },
  {
    question: "Why We Are the Best Influence Marketing Company in Dehradun?",
    answer: [
      {
        label: "",
        text:
          "We understand the Dehradun market and its influencer ecosystem closely, pair that with transparent reporting and clear communication, and stay hands-on through every stage of a campaign — from outreach to final performance review.",
      },
    ],
  },
];

export default function InfluenceMarketingPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroHighlight}>Influence Marketing</span>
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Influence Marketing</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <blockquote className={styles.quote}>
            &quot;The digital age has already influenced the marketing world for brands to
            connect with target audiences. Dream Byte Solution Pvt. Ltd. is here as the best
            influence marketing company in Dehradun which is helping businesses use their ability
            for brand promotion and visibility unmatched through top influencers.&quot;
          </blockquote>

          <h2 className={styles.sectionHeading}>
            Dream Byte Solutions Pvt. Ltd.&ndash;influencer marketing company
          </h2>

          <p className={styles.paragraph}>
            At Dream Byte Solutions, we specialize in crafting exceptional influence marketing
            campaigns tailored to your unique vision. Our team manages every aspect of the
            process, from influencer discovery and campaign planning to content coordination and
            execution. We focus on ensuring each detail aligns with your goals, delivering a
            seamless and engaging experience for both your brand and your audience.
          </p>

          <h3 className={styles.subHeading}>What is Influence Marketing?</h3>
          <p className={styles.paragraph}>
            Influence marketing is partnering with the most popular personalities: social media
            influencers, bloggers, and content creators who have a very loyal following. They
            become trusted voices to promote your brand authentically to your audience and drive
            real engagement.
          </p>

          {/* Services */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Influence Marketing Services</h3>
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
          <ServicesSidebar currentService="Influence Marketing" />
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
                {faq.answer.map((block, idx) => (
                  <p key={idx} className={styles.faqAnswerLine}>
                    {block.label && <strong className={styles.faqAnswerLabel}>{block.label}</strong>}
                    {block.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}