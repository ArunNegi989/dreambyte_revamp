// app/blog/BlogPageClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./blog.module.css";

export interface BlogListPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  displayDate: string;
}

const EXPLORE_TOPICS = [
  "SEO", "PPC", "Branding", "Social Media", "Web Design",
  "AI Tools", "Content", "Analytics", "E-commerce", "Startups",
];

const PAGE_SIZE = 6;

export default function BlogPageClient({ posts }: { posts: BlogListPost[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Categories ab real data se derive honge, hardcoded list nahi
  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category))).filter(Boolean);
    return ["All", ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [posts, searchTerm, activeCategory, sortOrder]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, activeCategory, sortOrder]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;
  const canShowLess = visibleCount > PAGE_SIZE;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
  };

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    document.getElementById("blog-grid-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const latestThree = useMemo(
    () =>
      [...posts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
    [posts]
  );

  return (
    <div className={styles.page}>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Latest Blogs</h1>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span className={styles.breadcrumbSep}>›</span>
            <span>Blog</span>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ===== Main content ===== */}
          <main className={styles.main}>
            <span id="blog-grid-top" />

            <div className={styles.controlsBar}>
              <div className={styles.searchBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.sortGroup}>
                <button
                  className={`${styles.sortBtn} ${sortOrder === "newest" ? styles.sortBtnActive : ""}`}
                  onClick={() => setSortOrder("newest")}
                >
                  Newest
                </button>
                <button
                  className={`${styles.sortBtn} ${sortOrder === "oldest" ? styles.sortBtnActive : ""}`}
                  onClick={() => setSortOrder("oldest")}
                >
                  Oldest
                </button>
              </div>
            </div>

            <div className={styles.categoryRow}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryPillActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {visiblePosts.length > 0 ? (
              <>
                <div className={styles.blogGrid}>
                  {visiblePosts.map((post) => (
                    <article key={post.id} className={styles.blogCard}>
                      <div className={styles.cardImageWrap}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className={styles.cardImage}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className={styles.cardDate}>{post.displayDate}</span>
                        <span className={styles.cardCategory}>{post.category}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{post.title}</h3>
                        <p className={styles.cardExcerpt}>{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                          READ MORE
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {(hasMore || canShowLess) && (
                  <div className={styles.paginationBar}>
                    <span className={styles.paginationCount}>
                      Showing {visiblePosts.length} of {filteredPosts.length} articles
                    </span>
                    <div className={styles.paginationBtns}>
                      {hasMore && (
                        <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                          READ MORE
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 5v14M5 12l7 7 7-7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      {canShowLess && (
                        <button className={styles.showLessBtn} onClick={handleShowLess}>
                          SHOW LESS
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 19V5M5 12l7-7 7 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🕉</span>
                <p>No articles yet. Check back soon.</p>
              </div>
            )}
          </main>

          {/* ===== Sidebar ===== */}
          <aside className={styles.sidebar}>
            <div className={styles.featuredCard}>
              <span className={styles.featuredEyebrow}>Featured Program</span>
              <h3 className={styles.featuredTitle}>
                Grow Your Business <em>Online</em>
              </h3>
              <p className={styles.featuredDesc}>
                Full-stack digital marketing &amp; web development services from
                Dream Byte Solutions, Dehradun.
              </p>

              <div className={styles.featuredList}>
                <div className={styles.featuredItem}>SEO &amp; PPC</div>
                <div className={styles.featuredItem}>Social Media Marketing</div>
                <div className={styles.featuredItem}>Website Development</div>
              </div>

              <Link href="/contact" className={styles.enquireBtn}>
                ENQUIRE NOW <span>→</span>
              </Link>
            </div>

            {latestThree.length > 0 && (
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarHeader}>
                  <span>🗞</span> Latest Articles
                </div>
                <div className={styles.sidebarBody}>
                  {latestThree.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className={styles.miniPost}>
                      <div className={styles.miniImageWrap}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className={styles.miniImage}
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className={styles.miniTitle}>{post.title}</p>
                        <span className={styles.miniDate}>{post.displayDate}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.sidebarSection}>
              <div className={styles.sidebarHeader}>
                <span>🔎</span> Explore Topics
              </div>
              <div className={styles.sidebarBody}>
                <div className={styles.topicTags}>
                  {EXPLORE_TOPICS.map((topic) => (
                    <button key={topic} className={styles.topicTag}>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}