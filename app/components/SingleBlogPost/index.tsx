"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Singleblogpost.module.css";
import {
  type BlogPost,
  type ContentBlock,
  calcReadTime,
} from "@/data/blogPosts";

interface SingleBlogPostProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  recentPosts: BlogPost[];
  prevPost?: BlogPost;
  nextPost?: BlogPost;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* ---------------------------------------------------------------
   Fixed reading-progress rail — the page's signature element.
   Tracks scroll through the ARTICLE body specifically, not the
   whole page, so it reaches 100% right as the content ends.
--------------------------------------------------------------- */
function ReadingProgress({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);

  return (
    <div className={styles.progressRail} aria-hidden="true">
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ---------------------------------------------------------------
   Content block renderer
--------------------------------------------------------------- */
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  let paraCount = 0;
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const id = slugify(block.text);
            return (
              <h2 key={i} id={id} className={styles.h2}>
                <span className={styles.headingMark} />
                {block.text}
              </h2>
            );
          }
          case "paragraph": {
            paraCount += 1;
            const isFirst = paraCount === 1;
            return (
              <p
                key={i}
                className={`${styles.paragraph} ${isFirst ? styles.dropCap : ""}`}
              >
                {block.text}
              </p>
            );
          }
          case "list":
            return (
              <ul key={i} className={styles.list}>
                {block.items.map((item, j) => (
                  <li key={j} className={styles.listItem}>
                    <span className={styles.listBullet} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={i} className={styles.quote}>
                <span className={styles.quoteMark}>&ldquo;</span>
                <p className={styles.quoteText}>{block.text}</p>
                {block.author && (
                  <cite className={styles.quoteAuthor}>
                    <span className={styles.quoteLine} />
                    {block.author}
                  </cite>
                )}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className={styles.figure}>
                <div className={styles.figureImgWrap}>
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 860px) 100vw, 720px"
                    className={styles.figureImg}
                  />
                </div>
                {block.caption && (
                  <figcaption className={styles.figureCaption}>{block.caption}</figcaption>
                )}
              </figure>
            );
          case "callout":
            return (
              <div key={i} className={styles.callout}>
                <div className={styles.calloutBar} />
                <div className={styles.calloutBody}>
                  <span className={styles.calloutTitle}>{block.title || "Note"}</span>
                  <p className={styles.calloutText}>{block.text}</p>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default function SingleBlogPost({
  post,
  relatedPosts,
  recentPosts,
  prevPost,
  nextPost,
}: SingleBlogPostProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const headings = useMemo(
    () =>
      post.content
        .filter((b): b is Extract<ContentBlock, { type: "heading" }> => b.type === "heading")
        .map((b) => ({ id: slugify(b.text), text: b.text })),
    [post.content]
  );

  const readTime = useMemo(() => calcReadTime(post.content), [post.content]);

  // Scroll-synced active TOC entry
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const initials = post.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={styles.page}>
      <ReadingProgress targetRef={articleRef} />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span className={styles.breadSep}>/</span>
            <Link href="/blog" className={styles.breadLink}>Blog</Link>
            <span className={styles.breadSep}>/</span>
            <span className={styles.breadCurrent}>{post.category}</span>
          </nav>

          <span className={styles.categoryPill}>{post.category}</span>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>

          <div className={styles.metaRow}>
            <div className={styles.authorChip}>
              <span className={styles.authorAvatar}>{initials}</span>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{post.author}</span>
                <span className={styles.authorRole}>{post.authorRole}</span>
              </div>
            </div>
            <span className={styles.metaDivider} />
            <div className={styles.metaStat}>
              <span className={styles.metaLabel}>Published</span>
              <span className={styles.metaVal}>{post.displayDate}</span>
            </div>
            <div className={styles.metaStat}>
              <span className={styles.metaLabel}>Read time</span>
              <span className={styles.metaVal}>{readTime} min</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ===== Article ===== */}
          <article className={styles.article} ref={articleRef}>
            <div className={styles.content}>
              <ContentRenderer blocks={post.content} />
            </div>

            {/* Tags */}
            <div className={styles.tagsRow}>
              <span className={styles.tagsLabel}>Filed under</span>
              <div className={styles.tagsList}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag.replace(/\s+/g, "")}</span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className={styles.shareRow}>
              <span className={styles.shareLabel}>Share this article</span>
              <div className={styles.shareBtns}>
                <a
                  className={styles.shareBtn}
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                >
                  𝕏
                </a>
                <a
                  className={styles.shareBtn}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                >
                  in
                </a>
                <button className={styles.shareBtn} onClick={handleCopyLink} aria-label="Copy link">
                  {copied ? "✓" : "🔗"}
                </button>
              </div>
            </div>

            {/* Prev / Next */}
            {(prevPost || nextPost) && (
              <div className={styles.prevNextRow}>
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className={`${styles.prevNextCard} ${styles.prevCard}`}>
                    <span className={styles.prevNextLabel}>← Previous</span>
                    <span className={styles.prevNextTitle}>{prevPost.title}</span>
                  </Link>
                ) : <span />}
                {nextPost && (
                  <Link href={`/blog/${nextPost.slug}`} className={`${styles.prevNextCard} ${styles.nextCard}`}>
                    <span className={styles.prevNextLabel}>Next →</span>
                    <span className={styles.prevNextTitle}>{nextPost.title}</span>
                  </Link>
                )}
              </div>
            )}

            <div className={styles.backRow}>
              <Link href="/blog" className={styles.backBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to all articles
              </Link>
            </div>
          </article>

          {/* ===== Sidebar ===== */}
          <aside className={styles.sidebar}>
            {/* On This Page — signature TOC, synced with reading progress */}
            {headings.length > 0 && (
              <nav className={styles.tocCard} aria-label="Table of contents">
                <span className={styles.tocLabel}>On this page</span>
                <ul className={styles.tocList}>
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className={`${styles.tocLink} ${activeId === h.id ? styles.tocLinkActive : ""}`}
                      >
                        <span className={styles.tocDot} />
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Agency CTA */}
            <div className={styles.ctaCard}>
              <span className={styles.ctaEyebrow}>Dream Byte Solutions</span>
              <h3 className={styles.ctaTitle}>Need this done for your business?</h3>
              <p className={styles.ctaText}>
                We build the strategy, content, and websites behind stories like this one — for real clients, not case studies.
              </p>
              <Link href="/contact" className={styles.ctaBtn}>
                Enquire Now <span>→</span>
              </Link>
            </div>

            {/* Recent posts */}
            {recentPosts.length > 0 && (
              <div className={styles.sideWidget}>
                <div className={styles.sideWidgetHeader}>
                  <h3 className={styles.sideWidgetTitle}>Recent Articles</h3>
                  <Link href="/blog" className={styles.sideWidgetLink}>View all</Link>
                </div>
                <ul className={styles.recentList}>
                  {recentPosts.map((p) => (
                    <li key={p.id} className={styles.recentItem}>
                      <Link href={`/blog/${p.slug}`} className={styles.recentLink}>
                        <div className={styles.recentImgWrap}>
                          <Image src={p.image} alt={p.title} fill sizes="60px" className={styles.recentImg} />
                        </div>
                        <div className={styles.recentInfo}>
                          <span className={styles.recentCategory}>{p.category}</span>
                          <p className={styles.recentTitle}>{p.title}</p>
                          <span className={styles.recentDate}>{p.displayDate}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className={styles.sideWidget}>
                <div className={styles.sideWidgetHeader}>
                  <h3 className={styles.sideWidgetTitle}>In {post.category}</h3>
                </div>
                <ul className={styles.recentList}>
                  {relatedPosts.map((p) => (
                    <li key={p.id} className={styles.recentItem}>
                      <Link href={`/blog/${p.slug}`} className={styles.recentLink}>
                        <div className={styles.recentImgWrap}>
                          <Image src={p.image} alt={p.title} fill sizes="60px" className={styles.recentImg} />
                        </div>
                        <div className={styles.recentInfo}>
                          <p className={styles.recentTitle}>{p.title}</p>
                          <span className={styles.recentDate}>{p.displayDate}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Newsletter */}
            <div className={styles.newsletterCard}>
              <span className={styles.newsletterIcon}>✉</span>
              <h4 className={styles.newsletterTitle}>Get articles like this monthly</h4>
              <p className={styles.newsletterText}>
                No spam — just the strategies we&apos;re actually using for clients that month.
              </p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="you@company.com" className={styles.newsletterInput} />
                <button className={styles.newsletterBtn}>Subscribe</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}