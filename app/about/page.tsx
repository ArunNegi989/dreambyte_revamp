"use client";

import { JSX, useState, type FormEvent } from "react";
import styles from "./Aboutus.module.css";
import aboutusimage from "@/public/assets/images/about-us-main-section-webp.webp"
import Image from "next/image";
/* ------------------------------------------------------------------ */
/*  Data — content is unchanged from the original site, just re-shaped */
/*  into typed structures so it's easy to edit later.                  */
/* ------------------------------------------------------------------ */

interface Stat {
  value: string;
  label: string;
  /** relative peak height (0–100) used to draw the ridge chart */
  peak: number;
}

const STATS: Stat[] = [
  { value: "200+", label: "Projects Completed", peak: 58 },
  { value: "25", label: "Team Members", peak: 34 },
  { value: "2+", label: "Years Experience", peak: 26 },
  { value: "175+", label: "Happy Clients", peak: 50 },
];

interface TrustBadge {
  label: string;
  sub: string;
  icon: JSX.Element;
}

/* NOTE: replace label/sub with your actual certifications / recognitions.
   Icons kept generic (checkmark / shield / star) so no external logo assets
   are needed — swap for real badge images if you have them. */
const TRUST_BADGES: TrustBadge[] = [
  {
    label: "ISO Certified",
    sub: "Process & Quality",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    label: "Top Rated Agency",
    sub: "Client Reviews",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z" />
      </svg>
    ),
  },
  {
    label: "#StartupIndia",
    sub: "Recognised Startup",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17l6-6 4 4 8-8M21 4h-5v5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Lalit Kushwaha",
    role: "Founder & CEO",
    bio: "A visionary leader with a true passion for technology, Lalit founded Dream Byte Solutions to transform complex tech challenges into straightforward, impactful solutions. With a wealth of expertise in digital innovation, he drives the company's mission to achieve excellence and foster growth for every client.",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Pooja Sakta",
    role: "Co-Founder",
    bio: "Bringing a collaborative spirit and a sharp strategic mind, Pooja is instrumental in guiding the company's vision. She ensures that every solution is not only technically robust but also perfectly aligned with client needs, establishing Dream Byte Solutions as a reliable partner for digital success.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop",
  },
];

interface ExpertiseItem {
  title: string;
  desc: string;
  href: string;
  icon: JSX.Element;
}

const ICON_PROPS = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const EXPERTISE: ExpertiseItem[] = [
  {
    title: "Web Development",
    desc: "Fast, scalable sites and web apps built to convert visitors into clients.",
    href: "/services/web-development",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" />
      </svg>
    ),
  },
  {
    title: "Graphic Designing",
    desc: "Visual identity, print, and social creatives that make brands stick.",
    href: "/services/graphic-designing",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 2l1.6 4.9L18.5 8l-4 3.1L15.8 16 12 13l-3.8 3 1.3-4.9-4-3.1 4.9-1.1z" />
      </svg>
    ),
  },
  {
    title: "Digital Marketing",
    desc: "Data-led campaigns across search, social, and influencer channels.",
    href: "/services/digital-marketing",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 17l6-6 4 4 8-8M21 4h-5v5" />
      </svg>
    ),
  },
  {
    title: "Branding",
    desc: "Strategy, voice, and visuals unified into one lasting brand story.",
    href: "/services/branding",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.2L3.2 9.59A2 2 0 003.83 11l9.58 9.59a2 2 0 002.82 0l4.36-4.36a2 2 0 000-2.82z" />
        <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];



/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AboutUs() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: wire this up to your API route / Express endpoint
    console.log("Quote request:", form);
    setStatus("sent");
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <main className={styles.page}>
      {/* ---------------------------------------------------------- */}
      {/* HERO                                                        */}
      {/* ---------------------------------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop"
            alt=""
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            About
          </span>
          <h1 className={styles.heroTitle}>
            Dream Byte <span className={styles.heroTitleAccent}>Solutions</span>
          </h1>
          <p className={styles.heroTagline}>
            Rooted in Uttarakhand. Built for every business ready to climb higher.
          </p>

          <div className={styles.heroActions}>
            <a href="/dream-byte-solutions.pdf" download className={styles.btnGhost}>
              Download PDF
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#quote" className={styles.btnSolid}>
              Contact Us
            </a>
          </div>
        </div>

       
      </section>

      {/* ---------------------------------------------------------- */}
      {/* OUR STORY — new split layout (visual left, copy right)      */}
      {/* ---------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyVisual}>
              <div className={styles.storyVisualGlow} aria-hidden="true" />
              {/* Replace this image with a custom illustration / product shot
                  whenever you have one — keeps the same rounded frame. */}
              <Image
                src={aboutusimage.src}
                width={aboutusimage.width}
                height={aboutusimage.height}
                alt="Dream Byte Solutions team at work"
                className={styles.storyImg}
              />
            </div>

            <div className={styles.storyContent}>
              <span className={styles.storyEyebrow}>The Story</span>
              <h2 className={styles.storyHeading}>About Us</h2>
              <p className={styles.storyText}>
                Dream byte Solutions is home for job seekers of Uttarakhand and partner of each and every
                business in their journey of growth. As a Marketing Agency our focus is to provide 360
                degree angle of solutions for a business as every business owner deserve a best partner who
                can help them grown without any second thought of need of anything else. Dream Byte
                Solutions is providing multiple services like Graphic designing, Social media management,
                Ads making, digital marketing, influencer marketing, performance marketing, photography and
                videography, event management, print media, and more.
              </p>

              <div className={styles.trustRow}>
                {TRUST_BADGES.map((b) => (
                  <div className={styles.trustBadge} key={b.label}>
                    <span className={styles.trustIcon}>{b.icon}</span>
                    <span className={styles.trustText}>
                      <strong>{b.label}</strong>
                      <span>{b.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ridge stat chart — the numbers, drawn as a mountain skyline */}
          <div className={styles.statsWrap}>
            <svg
              className={styles.statsSvg}
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                className={styles.statsLine}
                points={STATS.map(
                  (s, i) => `${(i / (STATS.length - 1)) * 1000},${200 - s.peak * 2.6}`
                ).join(" ")}
              />
            </svg>
            <div className={styles.statsRow}>
              {STATS.map((s) => (
                <div className={styles.statCard} key={s.label}>
                  <strong className={styles.statValue}>{s.value}</strong>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* MANAGEMENT                                                  */}
      {/* ---------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Management</h2>

          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`${styles.teamRow} ${i % 2 === 1 ? styles.teamRowReverse : ""}`}
            >
              <div className={styles.teamPhotoWrap}>
                <img src={member.photo} alt={member.name} className={styles.teamPhoto} />
              </div>
              <div className={styles.teamInfo}>
                <span className={styles.teamRole}>{member.role}</span>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* MISSION & VISION                                            */}
      {/* ---------------------------------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Mission &amp; Vision</h2>
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <span className={styles.mvIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <h3>Our Mission</h3>
              <p>
                At Dream Byte Solutions, we&rsquo;re all about making technology easier to navigate. Our
                mission is to provide innovative, dependable, and customized digital solutions that empower
                businesses and turn challenges into opportunities.
              </p>
            </div>
            <div className={styles.mvCard}>
              <span className={styles.mvIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <h3>Our Vision</h3>
              <p>
                We aspire to be a trusted global technology partner, recognized for our commitment to
                innovation, excellence, and putting customers first. Our vision is to create a future where
                businesses of all sizes confidently harness the power of technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* EXPERTISE                                                   */}
      {/* ---------------------------------------------------------- */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Expertise</h2>

          <div className={styles.expertiseGrid}>
            <div className={styles.expertiseCards}>
              {EXPERTISE.map((item) => (
                <div className={styles.expertiseCard} key={item.title}>
                  <span className={styles.expertiseIcon}>{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <a href={item.href} className={styles.expertiseLink}>
                    View More Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            <div className={styles.expertiseCopy}>
              <h3 className={styles.expertiseHeadline}>Your One Stop Creative Partner</h3>
              <p>
                We help brands to make their presence with our services designed to make you the best
                organization. We offer everything from graphic design and web development to successful
                online marketing that generates results! Our influence marketing aligns your business with
                the appropriate audience, and our performance marketing ensures that every campaign
                generates results. We also offer the best photography and videography in order to capture
                your best memories. Our people ensure that every event is perfect and unforgettable when we
                talk about event management.
              </p>
              <p>
                Dream Byte does more than just create&mdash;we increase your brand&rsquo;s visibility! We
                use imagination, strategy, and technology to turn your imagination into reality. For
                startups that wish to leave their footprint and brands that want to increase their online
                presence, we provide the best solutions that accelerate growth. We work towards building
                lasting success through impactful stories, beautiful visuals, and performance-based
                marketing. At Dream Byte, your imagination is our mission&mdash;transforming dreams into
                realities and imagination into influence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* WHY DREAM BYTE — added value strip                          */}
      {/* ---------------------------------------------------------- */}
      <section className={styles.whyStrip}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyItem}>
              <span className={styles.whyNum}>360°</span>
              <p>Full-circle solutions under one roof</p>
            </div>
            <div className={styles.whyItem}>
              <span className={styles.whyNum}>UK</span>
              <p>Local roots, Uttarakhand-first thinking</p>
            </div>
            <div className={styles.whyItem}>
              <span className={styles.whyNum}>E2E</span>
              <p>Strategy to execution, end to end</p>
            </div>
            <div className={styles.whyItem}>
              <span className={styles.whyNum}>1:1</span>
              <p>A dedicated partner, not just a vendor</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* GET A FREE QUOTE                                            */}
      {/* ---------------------------------------------------------- */}
      <section className={styles.quoteSection} id="quote">
       
        <div className={styles.container}>
          <div className={styles.quoteCard}>
            <div className={styles.quoteHeader}>
              <h2>Get a Free Quote</h2>
              <p>Tell us about your business — we&rsquo;ll get back within one working day.</p>
            </div>

            <form className={styles.quoteForm} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="phone">Phone No</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Type here..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className={styles.sendBtn}>
                {status === "sent" ? "Sent ✓" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}