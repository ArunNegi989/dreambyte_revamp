"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Herobanner.module.css";
import heroimage from "@/public/assets/images/dreambytesolution3.webp"
import shape1 from "@/public/assets/images/shape1.webp";
import shape2 from "@/public/assets/images/shape2.webp";
import shape3 from "@/public/assets/images/shape3.webp";
import shape4 from "@/public/assets/images/shape4.webp";
import bubbleArrow from "@/public/assets/images/Polygon-arrow.svg";
import loopArrow from "@/public/assets/images/arrow-main.webp";
import flowerIcon from "@/public/assets/images/flower.webp";
import ClientLogo1 from  "@/public/assets/images/logioiss-01.png";
import ClientLogo2 from  "@/public/assets/images/logioiss-03.png";
import ClientLogo3 from  "@/public/assets/images/logioiss-02.png";
import ClientLogo4 from  "@/public/assets/images/logioiss-04.png";

interface ClientLogo {
  src: string;
  alt: string;
}

interface HeroBannerProps {
  /** Business-partner / team member ka photo */
  personImageSrc?: string;
  /** 4 neon/floating shape images — real site: shape1.webp..shape4.webp */
  neonShapes?: [string, string, string, string];
  /** Speech-bubble ke pass wala chota triangle/arrow svg (Polygon-arrow.svg) */
  bubbleArrowSrc?: string;
  /** Person aur worked-box ke beech wala decorative loop arrow (arrow-main.webp) */
  loopArrowSrc?: string;
  /** Right rail quote ke pass rotating flower icon (flower.webp) */
  flowerIconSrc?: string;
  /** "Worked with more than 50 People" card ke chote client logos */
  clientLogos?: ClientLogo[];
  /** Scroll-down click par kis section ke id pe jana hai (real site: "section-two") */
  nextSectionId?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

const defaultLogos: ClientLogo[] = [
  { src: ClientLogo1.src, alt: "balaji" },
  { src: ClientLogo2.src, alt: "trya" },
  { src: ClientLogo3.src, alt: "erika" },
  { src: ClientLogo4.src, alt: "cosmic journey" },
];

const HeroBanner: React.FC<HeroBannerProps> = ({
  personImageSrc = heroimage.src,
  neonShapes = [
    shape1.src,
    shape2.src,
    shape3.src,
    shape4.src,
  ],
  bubbleArrowSrc = bubbleArrow.src,
  loopArrowSrc = loopArrow.src,
  flowerIconSrc = flowerIcon.src,
  clientLogos = defaultLogos,
  nextSectionId = "section-two",
  socialLinks = {
    instagram: "https://www.instagram.com/dreambytesolutions.in/",
    facebook: "https://www.facebook.com/people/Dream-Byte-solutions/61555552858656/",
    linkedin: "https://www.linkedin.com/company/dream-byte-solutions-pvt-ltd/",
    whatsapp: "https://api.whatsapp.com/send/?phone=%2B918279720490",
  },
}) => {
  // ---- Mouse-parallax for the speech bubble + worked-with card only.
  //      The neon shapes float continuously via their own CSS animation and
  //      are intentionally NOT touched by mouse movement anymore. ----
  const parallaxScopeRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const workedBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = parallaxScopeRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Speech bubble sits over the face, so it gets a stronger push; worked-box (with the
      // loop-arrow nested inside it) moves a touch less.
      if (bubbleRef.current) {
        bubbleRef.current.style.transform = `translate(${x * 42}px, ${y * 42}px)`;
      }
      if (workedBoxRef.current) {
        workedBoxRef.current.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
      }
    };

    const handleLeave = () => {
      if (bubbleRef.current) bubbleRef.current.style.transform = "translate(0, 0)";
      if (workedBoxRef.current) workedBoxRef.current.style.transform = "translate(0, 0)";
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);
    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className={styles.sectionMain} id="main">
      <div className={styles.sectionMainSub}>
        {/* ---------------- Left media rail ---------------- */}
        <div className={styles.mediaMain}>
          <span className={styles.mediaLine} aria-hidden="true" />

          <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.socialCircle}>
            <svg viewBox="0 0 32 32" className={styles.socialIcon}>
              <path fill="none" stroke="white" strokeWidth="2" d="M22 3H10c-3.86 0-7 3.14-7 7v12c0 3.86 3.14 7 7 7h12c3.86 0 7-3.14 7-7V10c0-3.86-3.14-7-7-7z" />
              <circle fill="none" stroke="white" strokeWidth="2" cx="16" cy="16" r="6" />
              <circle fill="white" cx="24" cy="9.5" r="1.5" />
            </svg>
          </a>

          <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={styles.socialCircle}>
            <svg viewBox="0 0 32 32" className={styles.socialIcon}>
              <path fill="none" stroke="white" strokeWidth="2" d="M22 3H10c-3.86 0-7 3.14-7 7v12c0 3.86 3.14 7 7 7h12c3.86 0 7-3.14 7-7V10c0-3.86-3.14-7-7-7z" />
              <path fill="none" stroke="white" strokeWidth="2" d="M13 11v3h-2v4h2v10h4V18h3l1-4h-4v-2c0-1.1.9-1 2-1h2V7h-3c-2.8 0-5 2.2-5 5z" />
            </svg>
          </a>

          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={styles.socialCircle}>
            <svg viewBox="0 0 24 24" fill="white" className={styles.socialIcon}>
              <path d="M23.245 24h-4.655c-.414 0-.75-.336-.75-.75v-7.312c0-2.232-.242-3.228-1.675-3.228-1.296 0-2.046.507-2.046 3.102v7.438c0 .414-.336.75-.75.75h-4.66c-.414 0-.75-.336-.75-.75v-15.022c0-.414.336-.75.75-.75h4.474c.414 0 .75.336.75.75v.12c.902-.709 2.155-1.247 3.729-1.247 5.618 0 6.338 4.22 6.338 7.896v8.252c0 .414-.336.75-.75.75zM5.787 24h-4.665c-.414 0-.75-.336-.75-.75v-15.021c0-.414.336-.75.75-.75h4.665c.414 0 .75.336.75.75v15.021c0 .414-.336.75-.75.75zM3.452 6.929c-1.904 0-3.452-1.56-3.452-3.477 0-1.903 1.548-3.452 3.452-3.452 1.903 0 3.451 1.549 3.451 3.452 0 1.917-1.549 3.477-3.451 3.477z" />
            </svg>
          </a>

          <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={styles.socialCircle}>
            <svg viewBox="0 0 24 24" fill="white" className={styles.socialIcon}>
              <path d="M22,6.55a12.61,12.61,0,0,0-.1-1.29,4.29,4.29,0,0,0-.37-1.08,3.66,3.66,0,0,0-.71-1,3.91,3.91,0,0,0-1-.71,4.28,4.28,0,0,0-1.08-.36A10.21,10.21,0,0,0,17.46,2H6.55a12.61,12.61,0,0,0-1.29.1,4.29,4.29,0,0,0-1.08.37,3.66,3.66,0,0,0-1,.71,3.91,3.91,0,0,0-.71,1,4.28,4.28,0,0,0-.36,1.08A10.21,10.21,0,0,0,2,6.54v9.92a12.61,12.61,0,0,0,.1,1.29,4.29,4.29,0,0,0,.37,1.08,3.66,3.66,0,0,0,.71,1,3.91,3.91,0,0,0,1,.71,4.28,4.28,0,0,0,1.08.36A10.21,10.21,0,0,0,6.54,22H17.45a12.61,12.61,0,0,0,1.29-.1,4.29,4.29,0,0,0,1.08-.37,3.66,3.66,0,0,0,1-.71,3.91,3.91,0,0,0,.71-1,4.28,4.28,0,0,0,.36-1.08,10.21,10.21,0,0,0,.1-1.29V6.55ZM12.23,19a7.12,7.12,0,0,1-3.43-.9L5,19.1l1-3.72a7.11,7.11,0,0,1-1-3.58A7.18,7.18,0,1,1,12.23,19Z" />
            </svg>
          </a>

          <span className={styles.mediaLine} aria-hidden="true" />
        </div>

        {/* ---------------- Center content ---------------- */}
        <div className={styles.container2} ref={parallaxScopeRef}>
          <p className={styles.mainText}>
            Welcome to <span className={styles.wave}>👋</span>
          </p>

          <h2 className={styles.heroHeading}>
            <span className={styles.gradientText}>Dream Byte</span> Solutions
          </h2>
          <h1 className={styles.heroPara}>Best Digital Marketing Agency in Dehradun</h1>

          {/* Floating neon shapes — continuous CSS float only, no mouse interaction */}
          <div className={styles.floatingNeon} aria-hidden="true">
            {neonShapes.map((src, i) => (
              <div key={i} className={`${styles.neonWrap} ${styles[`neonWrap${i + 1}`]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className={styles.neon} />
              </div>
            ))}
          </div>

          <div className={styles.homeGirlImgMain}>
            <div className={styles.positionRelative}>
              {/* Speech bubble */}
              <div className={styles.jessicaBiogiMain} ref={bubbleRef}>
                <div className={styles.jessicaBiogiInner}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.jessicaBiogiSvg} src={bubbleArrowSrc} alt="" />
                  <p className={styles.jessicaBiogi}>&ldquo;Hello, Business Partners&rdquo;</p>
                </div>
              </div>

              {/* Person */}
              <div className={styles.homeGirlWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.homeGirlImg}
                  src={personImageSrc}
                  width={600}
                  height={600}
                  alt="Best website development in Dehradun"
                  title="Best website development in Dehradun"
                  loading="lazy"
                />
              </div>

              {/* Worked-with-clients card (loop-arrow now nested inside so it travels with the card) */}
              <div className={styles.workedBox} ref={workedBoxRef}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.arrowMain} src={loopArrowSrc} alt="" aria-hidden="true" />
                <p className={styles.workedMore}>Worked with more than 50 People</p>
                <div className={styles.clientImgMain}>
                  {clientLogos.map((logo, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.alt}
                      className={`${styles.clientImg} ${styles[`clientImg${i + 1}`]}`}
                    />
                  ))}
                  <p className={`${styles.workedMore} ${styles.workedMore2}`}>50+ Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Right stats rail ---------------- */}
        <div className={styles.sectionMainRightContain}>
          <div className={styles.statsSub}>
            <p className={styles.totalProject}>200+</p>
            <p className={styles.projectCompleted}>PROJECTS COMPLETED</p>
          </div>

          <div className={styles.flowerBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.flower} src={flowerIconSrc} alt="" aria-hidden="true" />
            <h2 className={styles.freelance}>&ldquo;Where Your Imagination is our innovation.&rdquo;</h2>
          </div>

          <div className={styles.mouseScrollBox}>
            <a href={`#${nextSectionId}`} className={styles.mouseMain}>
              <div className={styles.mouse}>
                <svg
                  className={styles.mouseArrowDown}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="40"
                  viewBox="0 0 24 40"
                  fill="none"
                >
                  <path d="M12 5L12 35" stroke="#FFDB59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 31L12 35" stroke="#FFDB59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 31L12 35" stroke="#FFDB59" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.scrollDown}>SCROLL DOWN</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;