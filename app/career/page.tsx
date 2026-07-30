'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Careerpage.module.css';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Dept = 'Engineering' | 'Marketing' | 'Sales' | 'Design';

interface Role {
  code: string;
  title: string;
  dept: Dept;
  tagline: string;
  date: string;
  type: string;
  location: string;
}

const ROLES: Role[] = [
  {
    code: 'DB-ENG-01',
    title: 'Full Stack Developer',
    dept: 'Engineering',
    tagline: 'From front-end to backend — own the stack.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Hybrid',
  },
  {
    code: 'DB-DES-01',
    title: 'Graphic Designer',
    dept: 'Design',
    tagline: 'Design visuals that inspire and connect.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Hybrid',
  },
  {
    code: 'DB-MKT-01',
    title: 'Social Media Executive',
    dept: 'Marketing',
    tagline: 'Drive engagement. Create impact. Be our voice online.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Hybrid',
  },
  {
    code: 'DB-MKT-02',
    title: 'Digital Marketing Executive — PPC Specialist',
    dept: 'Marketing',
    tagline: 'Turn clicks into customers.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Remote',
  },
  {
    code: 'DB-SAL-01',
    title: 'Tele Sales Executive',
    dept: 'Sales',
    tagline: 'Turn conversations into conversions.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Onsite',
  },
  {
    code: 'DB-SAL-02',
    title: 'Business Development Executive',
    dept: 'Sales',
    tagline: 'Driving growth, building partnerships, unlocking opportunity.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Hybrid',
  },
];

const DEPT_FILTERS: Array<Dept | 'All'> = ['All', 'Engineering', 'Marketing', 'Sales', 'Design'];

const WHY_US = [
  {
    title: 'Exciting Projects',
    body: 'Dive into real client builds — not sandbox work — with modern stacks and live stakes.',
    icon: 'rocket',
  },
  {
    title: 'Opportunities for Growth',
    body: 'Expand your skills and take your career to new heights, on a timeline you help set.',
    icon: 'growth',
  },
  {
    title: 'Team-Oriented Environment',
    body: 'Join a small, collaborative team that thrives on sharing ideas over guarding them.',
    icon: 'team',
  },
  {
    title: 'Meaningful Contributions',
    body: 'Work on projects whose outcome you can point to — and that actually ship.',
    icon: 'handshake',
  },
];

/* ------------------------------------------------------------------ */
/*  Icons (inline, no dependency)                                      */
/* ------------------------------------------------------------------ */

function Icon({ name }: { name: string }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none' };
  switch (name) {
    case 'rocket':
      return (
        <svg {...common}>
          <path d="M12 2c2.5 2 4 5.2 4 8.5 0 1.6-.4 3-1 4.3l-3-1-3 1c-.6-1.3-1-2.7-1-4.3C8 7.2 9.5 4 12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <circle cx="12" cy="9" r="1.4" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M9 15.5 7 20l2.5-1.2M15 15.5 17 20l-2.5-1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'growth':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M7 15l3.5-4 3 2.5L19 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 7H19v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'team':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="17" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M4 19c.6-3.2 2.6-5 5-5s4.4 1.8 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M14.5 14.2c1.9.3 3.2 1.7 3.7 4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    case 'handshake':
      return (
        <svg {...common}>
          <path d="M3 12l3.5-3.5a2 2 0 0 1 2.8 0L11 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12l-3.5-3.5a2 2 0 0 0-2.8 0L13 10l1.8 1.8a1.3 1.3 0 0 1 0 1.9l-.4.4a1.3 1.3 0 0 1-1.9 0L11 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 12.5 10 14a1.4 1.4 0 0 0 2 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Scroll-reveal wrapper                                              */
/* ------------------------------------------------------------------ */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function CareerPage() {
  const [activeFilter, setActiveFilter] = useState<Dept | 'All'>('All');

  const deptCount = useMemo(() => new Set(ROLES.map((r) => r.dept)).size, []);

  const filteredRoles = useMemo(
    () => (activeFilter === 'All' ? ROLES : ROLES.filter((r) => r.dept === activeFilter)),
    [activeFilter]
  );

  const scrollToRoles = () => {
    document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.page}>
      {/* ---------------- HERO ---------------- */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <span className={`${styles.floatShape} ${styles.floatShapeOne}`} aria-hidden="true">{'{ }'}</span>
        <span className={`${styles.floatShape} ${styles.floatShapeTwo}`} aria-hidden="true">{'</>'}</span>
        <span className={`${styles.floatShape} ${styles.floatShapeThree}`} aria-hidden="true">{'#'}</span>

        <div className={styles.heroContent}>
          <Reveal>
            <p className={styles.eyebrow}>DreamByte · Careers</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className={styles.heroTitle}>
              Code your <span className={styles.heroAccent}>next chapter.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className={styles.heroSub}>
              We&rsquo;re a small studio of builders, designers and closers shipping real products for
              real clients — not a portfolio of buzzwords. If you&rsquo;d rather ship something true
              than chase a title, you&rsquo;ll fit right in.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={scrollToRoles}>
                View open roles
                <span className={styles.btnArrow}>↓</span>
              </button>
              <a className={styles.ghostBtn} href="mailto:careers@dreambyte.in">
                Or just say hi
              </a>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <dl className={styles.heroStats}>
              <div className={styles.heroStat}>
                <dt>{String(ROLES.length).padStart(2, '0')}</dt>
                <dd>Open roles</dd>
              </div>
              <div className={styles.heroStat}>
                <dt>{String(deptCount).padStart(2, '0')}</dt>
                <dd>Teams hiring</dd>
              </div>
              <div className={styles.heroStat}>
                <dt>~</dt>
                <dd>Hybrid &amp; remote</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------- OPEN ROLES ---------------- */}
      <section id="open-roles" className={styles.rolesSection}>
        <Reveal className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>// Open positions</p>
          <h2 className={styles.sectionTitle}>Find where you fit.</h2>
          <p className={styles.sectionSub}>
            Every role below is live right now. Filter by team, or scan the full list.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className={styles.filterRow} role="tablist" aria-label="Filter roles by department">
            {DEPT_FILTERS.map((dept) => (
              <button
                key={dept}
                role="tab"
                aria-selected={activeFilter === dept}
                className={`${styles.filterChip} ${activeFilter === dept ? styles.filterChipActive : ''}`}
                onClick={() => setActiveFilter(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </Reveal>

        <div className={styles.rolesGrid}>
          {filteredRoles.map((role, i) => (
            <Reveal delay={(i % 3) * 90} key={role.code}>
              <article className={`${styles.roleCard} ${styles[`dept${role.dept}`]}`}>
                <div className={styles.roleCardTop}>
                  <span className={styles.roleCode}>{role.code}</span>
                  <span className={styles.roleDept}>{role.dept}</span>
                </div>

                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleTagline}>{role.tagline}</p>

                <div className={styles.roleMeta}>
                  <span>{role.type}</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{role.location}</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{role.date}</span>
                </div>

                <a className={styles.applyBtn} href={`mailto:careers@dreambyte.in?subject=Application: ${encodeURIComponent(role.title)}`}>
                  Apply now
                  <span className={styles.btnArrow}>→</span>
                </a>

                <span className={styles.cornerTL} aria-hidden="true" />
                <span className={styles.cornerBR} aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className={styles.whySection}>
        <Reveal className={styles.sectionHead}>
          <p className={styles.sectionEyebrow}>// Why DreamByte</p>
          <h2 className={styles.sectionTitle}>Why choose us</h2>
        </Reveal>

        <div className={styles.whyGrid}>
          {WHY_US.map((item, i) => (
            <Reveal delay={i * 90} key={item.title}>
              <div className={styles.whyCard}>
                <span className={styles.whyIcon}>
                  <Icon name={item.icon} />
                </span>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyBody}>{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className={styles.ctaSection}>
        <Reveal>
          <div className={styles.ctaCard}>
            <div>
              <p className={styles.sectionEyebrow}>// Don&rsquo;t see your role?</p>
              <h2 className={styles.ctaTitle}>Send us your resume anyway.</h2>
              <p className={styles.sectionSub}>
                We keep every good profile on file. If something opens up that fits, you&rsquo;ll hear
                from us first.
              </p>
            </div>
            <a className={styles.primaryBtn} href="mailto:careers@dreambyte.in?subject=General%20Application">
              Email careers@dreambyte.in
              <span className={styles.btnArrow}>→</span>
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}