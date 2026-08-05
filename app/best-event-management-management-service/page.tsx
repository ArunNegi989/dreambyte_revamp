"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSidebar from "@/app/components/common/ServicesSidebar/ServicesSidebar";
import styles from "./Eventmanagementpage.module.css";

const SERVICES = [
  {
    title: "Corporate Events",
    bullets: [
      "Organizing effective seminars, conferences, and workshops.",
      "Facilitating product launches through unique themes and faultless implementation.",
      "Organizing award ceremonies, yearly meetings, and team-building getaways with style and efficiency.",
    ],
    image: "https://picsum.photos/seed/dbs-em-corporate/700/525",
  },
  {
    title: "Weddings & Social Events",
    bullets: [
      "Designing beautiful weddings, including traditional, destination, and theme weddings.",
      "Organizing pre-wedding shoots, sangeet parties, mehndi ceremonies, and receptions.",
      "Plan elegant social occasions, ranging from anniversary parties to family reunions.",
    ],
    image: "https://picsum.photos/seed/dbs-em-wedding/700/525",
  },
  {
    title: "Celebrations and Parties",
    bullets: [
      "Curating creative birthday parties ranging from children's themes to milestone birthdays.",
      "Organizing lively festivals and holiday-themed events.",
      "Plan a lavish New Year's Eve and cocktail party.",
    ],
    image: "https://picsum.photos/seed/dbs-em-parties/700/525",
  },
  {
    title: "Conferences and Exhibitions",
    bullets: [
      "We provide cutting-edge solutions for business and trade exhibits.",
      "We provide cutting-edge audiovisual installations for flawless presentations.",
      "Providing a professional environment to encourage collaboration and networking.",
    ],
    image: "https://picsum.photos/seed/dbs-em-conference/700/525",
  },
  {
    title: "Luxury & Exclusive Events",
    bullets: [
      "Curating elegant private gatherings, VIP parties, and luxury retreats with a touch of sophistication.",
      "Managing high-end events with complete privacy, style, and flawless attention to detail.",
      "Delivering bespoke experiences tailored to reflect your taste, personality, and vision.",
    ],
    image: "https://picsum.photos/seed/dbs-em-luxury/700/525",
  },
  {
    title: "Cultural & Entertainment Events",
    bullets: [
      "Organizing music concerts, fashion shows, and cultural festivals with seamless coordination.",
      "Managing celebrity appearances, live performances, and stage productions.",
      "Creating unforgettable entertainment experiences that captivate audiences.",
    ],
    image: "https://picsum.photos/seed/dbs-em-cultural/700/525",
  },
];

const FAQS = [
  {
    question: "What makes us the best event management company in Dehradun?",
    answer: [
      {
        label: "Creative Excellence: ",
        text: "Our staff lives on creativity and inspiration. We create events with unique concepts tailored to your style, brand, or occasion.",
      },
      {
        label: "Comprehensive Planning: ",
        text: "We think that the details of every event determine its success. From selecting the ideal site to matching the smallest decorative elements, our planning is meticulous and exact.",
      },
      {
        label: "Professional expertise: ",
        text: "Our experienced professionals excel at managing events of all sizes and complexities, ensuring that everything works smoothly and efficiently.",
      },
      {
        label: "Customer-centric Approach: ",
        text: "Your satisfaction is our top priority. We listen to your ideas, combine them with our skills, and transform them into amazing reality.",
      },
      {
        label: "Cutting-edge technology: ",
        text: "We use creative sound, lighting, and graphical effects technology to enhance the atmosphere and engagement at your event.",
      },
      {
        label: "Sustainability Focus: ",
        text: "We are dedicated to sustainable practices and want to include eco-friendly solutions into our events at all times.",
      },
    ],
  },
  {
    question: "Looking for a Partner Who Understands Your Event Vision?",
    answer: [
      {
        label: "",
        text:
          "We start every project by listening — to your goals, your guests, and the feeling you want people to walk away with. From the first planning call to the final wrap-up, our team stays hands-on so nothing about your event is left to chance.",
      },
    ],
  },
];

export default function EventManagementPage() {
  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroHighlight}>Event Management</span>
          </h1>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className={styles.crumbSep}>›</span>
            <Link href="/services">Services</Link>
            <span className={styles.crumbSep}>›</span>
            <span className={styles.crumbCurrent}>Event Management</span>
          </nav>
        </div>
      </section>

      {/* ---------- Body: content + sidebar ---------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <blockquote className={styles.quote}>
            &quot;Dream Byte Solution Pvt. Ltd. enhances event planning through reliability,
            innovation, and a well-thought schedule, so that every event we work on is an
            experience to remember. Being the top event management company in Dehradun, we handle
            each stage of the assignment from planning to execution with unparalleled competence
            and attention.&quot;
          </blockquote>

          <h2 className={styles.sectionHeading}>
            &quot;Elevate Every Occasion with Dream Byte Solution Pvt. Ltd.&quot;
          </h2>

          <p className={styles.paragraph}>
            Transforming the frequency into memories that will last. We offer a perfect and
            gorgeous experience whether it&apos;s a high-stakes business event, an expensive
            wedding, a little get-together, or a big conference. We think it&apos;s important to
            go above and beyond and create memorable events.
          </p>

          {/* Services */}
          <div className={styles.headerRow}>
            <h3 className={styles.blockHeading}>Our Signature Event Services</h3>
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
          <ServicesSidebar currentService="Event Management" />
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
              <ul className={styles.processBulletList}>
                {item.bullets.map((b, idx) => (
                  <li key={idx} className={styles.processBulletItem}>
                    {b}
                  </li>
                ))}
              </ul>
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
              <ul className={styles.modalBulletList}>
                {active.bullets.map((b, idx) => (
                  <li key={idx} className={styles.modalBulletItem}>
                    {b}
                  </li>
                ))}
              </ul>
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