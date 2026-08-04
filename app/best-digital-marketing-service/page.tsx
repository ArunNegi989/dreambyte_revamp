"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Digitalmarketingpage.module.css";

const MARKETING_TYPES = [
  {
    title: "Search Engine Optimization (SEO)",
    description:
      "As a professional SEO company in Dehradun we only trust in long term visibility rather than just quick ranking that doesn't last long. Our SEO process includes: keyword research, on-page SEO optimization, technical SEO, local SEO for businesses in Dehradun, high quality backlinks building.",
    image: "https://picsum.photos/seed/dbs-dm-seo/700/525",
  },
  {
    title: "Google Ads & Paid Marketing (PPC)",
    description:
      "For businesses that want faster visibility, we manage Google ads and paid campaigns with close attention to performance. Campaigns are regularly reviewed and adjusted to ensure spending stays efficient and focused on conversions.",
    image: "https://picsum.photos/seed/dbs-dm-ads/700/525",
  },
  {
    title: "Content Marketing & Branding",
    description:
      "Good content builds trust. We create website content, blogs, and marketing material that explains your services clearly, answers customer questions, and supports SEO without sounding forced or over-optimised.",
    image: "https://picsum.photos/seed/dbs-dm-content/700/525",
  },
  {
    title: "Social Media Marketing",
    description:
      "Social media works best when it feels authentic. We help businesses maintain a consistent presence on platforms like Facebook, Instagram, and LinkedIn by focusing on engagement, brand credibility, and clear messaging — rather than chasing meaningless numbers.",
    image: "https://picsum.photos/seed/dbs-dm-social/700/525",
  },
  {
    title: "Email Marketing",
    description:
      "One of the most cost-effective ways to reach customers. Send personalized emails to maintain relationships and nurture leads.",
    image: "https://picsum.photos/seed/dbs-dm-email/700/525",
  },
  {
    title: "Influencer Marketing",
    description:
      "Uses credible social media influencers to expand brand reach and increase engagement with your target audience.",
    image: "https://picsum.photos/seed/dbs-dm-influencer/700/525",
  },
];

const WHY_US = [
  {
    title: "Supporting Local Businesses Across Dehradun",
    description:
      "We work with businesses across Dehradun, including areas such as Rajpur Road, Clement Town, Patel Nagar, Vasant Vihar, Ballupur, Sahastradhara Road, Prem Nagar, Nehru Colony, Dharampur, and surrounding localities. Our local SEO strategies help businesses reach customers who are already searching nearby.",
  },
  {
    title: "Digital Marketing That Fits Your Budget",
    description:
      "Every business has different priorities and resources, that is why we offer flexible plans that you can work with accordingly based on your goals.",
  },
  {
    title: "Experienced Digital Marketing Team in Dehradun",
    description:
      "Our team stays updated with changes in search trends, ads platforms, and google updates. This allows them to make trending strategies and campaigns that are effective in the long run. If you want to improve your online visibility and attract more customers locally, Dream Byte Solutions can support you with clear and practical guidance.",
  },
];

const FAQS = [
  {
    question: "What services does a digital marketing company in Dehradun provide?",
    answer:
      "Services usually include SEO, social media marketing, Google Ads, website development, content creation, and local SEO.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "SEO is a gradual process — most businesses start seeing meaningful ranking improvements within 3-6 months, depending on competition and the current state of the website.",
  },
  {
    question: "Is digital marketing suitable for small businesses?",
    answer:
      "Yes, digital marketing is especially effective for small businesses since it lets you target the right local audience without the large spend traditional advertising needs.",
  },
  {
    question: "Which is the best digital marketing company in Dehradun?",
    answer:
      "We believe results speak for us — Dream Byte Solutions focuses on transparent reporting, honest communication, and strategies tailored specifically to Dehradun's local market.",
  },
  {
    question: "Can digital marketing attract local customers?",
    answer:
      "Yes, through local SEO, Google Business Profile optimization, and geo-targeted ads, digital marketing is one of the most effective ways to reach nearby customers actively searching for your services.",
  },
  {
    question: "How can I contact Dream Byte Solutions?",
    answer:
      "You can call us anytime at the number listed on this page, or reach out through our contact page and our team will get back to you shortly.",
  },
];

export default function DigitalMarketingPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Best <span className={styles.heroHighlight}>Digital Marketing</span> Service in
            Dehradun
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Best Digital Marketing Service in Dehradun</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.intro}>
            Dream Byte Solutions is a leading digital marketing company in Dehradun. We provide
            result driven and professional online marketing solutions to businesses of all sizes
            and kinds. In today&apos;s digital era, having a strong online presence is a must for
            the success of the business and we help you to achieve that by higher search ranking,
            increased website traffic and better customer engagement. Now if you are searching
            for reliable digital marketing services in Dehradun, look no further because we
            deliver customized strategies that align with your personal brand.
          </p>

          {/* Types of Digital Marketing */}
          <div className={styles.headerRow}>
            <h2 className={styles.blockHeading}>Types of Digital Marketing</h2>
            <p className={styles.blockSubheading}>
              Businesses can select proper digital marketing strategies by understanding the
              multiple available options.
            </p>
          </div>
          <MarketingGrid />

          {/* Boost your brand */}
          <div className={styles.headerRow}>
            <h2 className={styles.blockHeading}>
              Boost Your Brand&apos;s Online Presence with Dream Byte Solutions
            </h2>
          </div>
          <p className={styles.paragraph}>
            <strong>Dream Byte Solutions</strong> specializes in result-oriented SEO, WhatsApp,
            and Email Marketing in Dehradun and develops specific digital solutions that can
            increase visibility, customer interactions, conversions, and ROI. We specialize in
            creating dynamic digital marketing strategies designed to boost your brand&apos;s
            visibility and online success. From targeted SEO to innovative social media
            campaigns, our approach ensures your business reaches the right audience at the right
            time.
          </p>

          {/* Why Us */}
          <div className={styles.headerRow}>
            <h2 className={styles.blockHeading}>Why Do Businesses in Dehradun Work With Us?</h2>
            <p className={styles.blockSubheading}>
              Choosing a digital marketing partner is an important decision. Businesses choose
              Dream Byte Solutions because we offer clear and personalised digital marketing
              strategies, transparent pricing and honest communication, a strong understanding of
              local business, ongoing support and direct collaboration, and up to date trend
              tracking.
            </p>
          </div>
          <div className={styles.whyUsList}>
            {WHY_US.map((item) => (
              <div className={styles.whyUsItem} key={item.title}>
                <h4 className={styles.whyUsTitle}>{item.title}</h4>
                <p className={styles.whyUsDesc}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>FAQ&apos;s</h3>
          </div>
          <FaqAccordion />
        </main>

        {/* ---------- Sidebar: reused common component ---------- */}
        <div className={styles.sidebarCol}>
          <ServicesSidebar currentService="Digital Marketing" />
        </div>
      </div>
    </div>
  );
}

function MarketingGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? MARKETING_TYPES[activeIndex] : null;

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
        {MARKETING_TYPES.map((item, i) => (
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