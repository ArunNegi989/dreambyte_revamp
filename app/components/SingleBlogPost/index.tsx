// app/components/SingleBlogPost/index.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Singleblogpost.module.css";
import { Blog, BlogSection } from "@/types/blog";
import { resolveImage } from "@/lib/api/blogs";
import { calcReadTime, getInitials, getEmbedUrl, slugify, formatDisplayDate } from "@/lib/utils/blog";

interface SingleBlogPostProps {
  post: Blog;
  relatedPosts: Blog[];
  recentPosts: Blog[];
  prevPost?: Blog;
  nextPost?: Blog;
}

/* ---------------------------------------------------------------
   Strip a plain-text field of stray HTML tags — used ONLY as a
   fallback safety net for heading/subheading (jo hamesha plain text
   hone chahiye, id/slug banane ke liye).
--------------------------------------------------------------- */
function stripTags(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

/* ---------------------------------------------------------------
   Fixed reading-progress rail
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
   Content block renderer — matches the real BlogSection union.
   NOTE: text/paragraph/quote/callout ka `text` field rich-text
   editor se aata hai aur already HTML string hota hai (e.g.
   "<p>Hello <strong>world</strong></p>") — isliye dangerouslySetInnerHTML
   use kar rahe hain, plain {block.text} nahi. Isse tags literally
   text ki tarah nahi dikhenge.
--------------------------------------------------------------- */
function ContentRenderer({ blocks }: { blocks: BlogSection[] }) {
  let paraCount = 0;

  return (
    <>
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const plainText = stripTags(block.text || "");
            const id = slugify(plainText);
            return (
              <h2 key={block.id} id={id} className={styles.h2}>
                <span className={styles.headingMark} />
                {plainText}
              </h2>
            );
          }

          case "subheading": {
            const plainText = stripTags(block.text || "");
            const id = slugify(plainText);
            return (
              <h3 key={block.id} id={id} className={styles.h3}>
                {plainText}
              </h3>
            );
          }

          case "paragraph": {
            paraCount += 1;
            const isFirst = paraCount === 1;
            return (
              <div
                key={block.id}
                className={`${styles.paragraph} ${isFirst ? styles.dropCap : ""}`}
                dangerouslySetInnerHTML={{ __html: block.text || "" }}
              />
            );
          }

          case "divider":
            return <hr key={block.id} className={styles.divider} />;

          case "list": {
            const Tag = block.listType === "ordered" ? "ol" : "ul";
            return (
              <Tag key={block.id} className={styles.list}>
                {(block.listItems || []).map((item, j) => (
                  <li key={j} className={styles.listItem}>
                    <span className={styles.listBullet} />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </Tag>
            );
          }

          case "quote":
            return (
              <blockquote key={block.id} className={styles.quote}>
                <span className={styles.quoteMark}>&ldquo;</span>
                <div
                  className={styles.quoteText}
                  dangerouslySetInnerHTML={{ __html: block.text || "" }}
                />
                {block.quoteAuthor && (
                  <cite className={styles.quoteAuthor}>
                    <span className={styles.quoteLine} />
                    {stripTags(block.quoteAuthor)}
                  </cite>
                )}
              </blockquote>
            );

          case "code":
            return (
              <div key={block.id} className={styles.codeBlock}>
                {block.codeLanguage && (
                  <span className={styles.codeLang}>{block.codeLanguage}</span>
                )}
                <pre className={styles.codePre}>
                  <code>{block.text}</code>
                </pre>
              </div>
            );

          case "video": {
            const embedUrl = getEmbedUrl(block.videoUrl || "");
            if (!embedUrl) return null;
            return (
              <figure key={block.id} className={styles.videoFigure}>
                <div className={styles.videoWrap}>
                  <iframe
                    src={embedUrl}
                    title={block.videoCaption || "Embedded video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={styles.videoIframe}
                  />
                </div>
                {block.videoCaption && (
                  <figcaption className={styles.figureCaption}>{block.videoCaption}</figcaption>
                )}
              </figure>
            );
          }

          case "table":
            return (
              <div key={block.id} className={styles.tableWrap}>
                <table className={styles.table}>
                  {block.tableHeaders && block.tableHeaders.length > 0 && (
                    <thead>
                      <tr>
                        {block.tableHeaders.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {(block.tableRows || []).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "callout": {
            const variant = block.calloutVariant || "info";
            return (
              <div key={block.id} className={`${styles.callout} ${styles[`callout_${variant}`] || ""}`}>
                <div className={styles.calloutBar} />
                <div className={styles.calloutBody}>
                  <span className={styles.calloutTitle}>{block.calloutTitle || "Note"}</span>
                  <div
                    className={styles.calloutText}
                    dangerouslySetInnerHTML={{ __html: block.text || "" }}
                  />
                </div>
              </div>
            );
          }

          case "spacer":
            return (
              <div
                key={block.id}
                aria-hidden="true"
                style={{ height: `${block.spacerHeight ?? 32}px` }}
              />
            );

          case "html":
            return (
              <div
                key={block.id}
                className={styles.htmlBlock}
                dangerouslySetInnerHTML={{ __html: block.text || "" }}
              />
            );

          case "images": {
            const images = block.images || [];
            if (images.length === 0) return null;
            const layoutClass =
              block.imageLayout === "two-col"
                ? styles.imagesTwoCol
                : block.imageLayout === "three-col"
                ? styles.imagesThreeCol
                : block.imageLayout === "wide"
                ? styles.imagesWide
                : styles.imagesSingle;

            return (
              <div key={block.id} className={`${styles.imagesGrid} ${layoutClass}`}>
                {images.map((img) => (
                  <figure key={img.id} className={styles.figure}>
                    <div className={styles.figureImgWrap}>
                      <Image
                        src={resolveImage(img.src)}
                        alt={img.altText || img.caption || ""}
                        fill
                        sizes="(max-width: 860px) 100vw, 720px"
                        className={styles.figureImg}
                      />
                    </div>
                    {img.caption && (
                      <figcaption className={styles.figureCaption}>{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            );
          }

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
        .filter((b) => b.type === "heading" && b.text)
        .map((b) => ({ id: slugify(stripTags(b.text || "")), text: stripTags(b.text || "") })),
    [post.content]
  );

  const readTime = useMemo(() => calcReadTime(post.content), [post.content]);
  const displayDate = useMemo(() => formatDisplayDate(post.date), [post.date]);

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

  const initials = getInitials(post.author);
  const coverImage = resolveImage(post.coverImage);

  return (
    <div className={styles.page}>
      <ReadingProgress targetRef={articleRef} />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          {coverImage && (
            <Image
              src={coverImage}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          )}
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
            {post.author && (
              <>
                <div className={styles.authorChip}>
                  <span className={styles.authorAvatar}>{initials}</span>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{post.author}</span>
                    {post.authorRole && (
                      <span className={styles.authorRole}>{post.authorRole}</span>
                    )}
                  </div>
                </div>
                <span className={styles.metaDivider} />
              </>
            )}
            <div className={styles.metaStat}>
              <span className={styles.metaLabel}>Published</span>
              <span className={styles.metaVal}>{displayDate}</span>
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

            {post.tags.length > 0 && (
              <div className={styles.tagsRow}>
                <span className={styles.tagsLabel}>Filed under</span>
                <div className={styles.tagsList}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>#{tag.replace(/\s+/g, "")}</span>
                  ))}
                </div>
              </div>
            )}

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

            {recentPosts.length > 0 && (
              <div className={styles.sideWidget}>
                <div className={styles.sideWidgetHeader}>
                  <h3 className={styles.sideWidgetTitle}>Recent Articles</h3>
                  <Link href="/blog" className={styles.sideWidgetLink}>View all</Link>
                </div>
                <ul className={styles.recentList}>
                  {recentPosts.map((p) => (
                    <li key={p._id} className={styles.recentItem}>
                      <Link href={`/blog/${p.slug}`} className={styles.recentLink}>
                        <div className={styles.recentImgWrap}>
                          <Image src={resolveImage(p.coverImage)} alt={p.title} fill sizes="60px" className={styles.recentImg} />
                        </div>
                        <div className={styles.recentInfo}>
                          <span className={styles.recentCategory}>{p.category}</span>
                          <p className={styles.recentTitle}>{p.title}</p>
                          <span className={styles.recentDate}>{formatDisplayDate(p.date)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className={styles.sideWidget}>
                <div className={styles.sideWidgetHeader}>
                  <h3 className={styles.sideWidgetTitle}>In {post.category}</h3>
                </div>
                <ul className={styles.recentList}>
                  {relatedPosts.map((p) => (
                    <li key={p._id} className={styles.recentItem}>
                      <Link href={`/blog/${p.slug}`} className={styles.recentLink}>
                        <div className={styles.recentImgWrap}>
                          <Image src={resolveImage(p.coverImage)} alt={p.title} fill sizes="60px" className={styles.recentImg} />
                        </div>
                        <div className={styles.recentInfo}>
                          <p className={styles.recentTitle}>{p.title}</p>
                          <span className={styles.recentDate}>{formatDisplayDate(p.date)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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