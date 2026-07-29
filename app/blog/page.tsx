"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./blog.module.css";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  displayDate: string;
}

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "SEO",
  "Social Media",
  "Web Development",
  "AI",
  "Branding",
];

const POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "traditional-vs-digital-marketing",
    title: "Traditional Marketing Vs Digital Marketing: What's Best For Your Business?",
    excerpt: "Explore the hidden risks of traditional marketing and why digital-first strategies are winning in 2026.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop",
    category: "Digital Marketing",
    date: "2026-07-28",
    displayDate: "28 Jul 2026",
  },
  {
    id: "2",
    slug: "google-ads-vs-seo",
    title: "Google Ads Vs SEO: Which Is Better For Your Business Goals?",
    excerpt: "A head-to-head comparison to help you decide where to invest your marketing budget first.",
    image: "https://images.unsplash.com/photo-1571677246347-5040036b95cc?q=80&w=800&auto=format&fit=crop",
    category: "SEO",
    date: "2026-02-05",
    displayDate: "05 Feb 2026",
  },
  {
    id: "3",
    slug: "seo-in-2026",
    title: "SEO In 2026: What Still Works And What Doesn't",
    excerpt: "Algorithms have changed a lot — here's what actually moves rankings today.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=800&auto=format&fit=crop",
    category: "SEO",
    date: "2026-01-08",
    displayDate: "08 Jan 2026",
  },
  {
    id: "4",
    slug: "increase-organic-traffic",
    title: "How To Increase Organic Traffic To Your Website",
    excerpt: "Proven strategies — keyword research, on-page SEO, and link building explained simply.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    category: "SEO",
    date: "2026-01-02",
    displayDate: "02 Jan 2026",
  },
  {
    id: "5",
    slug: "ai-in-digital-marketing",
    title: "AI In Digital Marketing – The Ultimate Guide",
    excerpt: "How brands are using AI tools to automate campaigns and personalize customer experience.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    category: "AI",
    date: "2025-12-08",
    displayDate: "08 Dec 2025",
  },
  {
    id: "6",
    slug: "advantages-of-wordpress",
    title: "Advantages Of A WordPress Website",
    excerpt: "Why WordPress remains one of the most flexible platforms for growing businesses.",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop",
    category: "Web Development",
    date: "2025-12-05",
    displayDate: "05 Dec 2025",
  },
  {
    id: "7",
    slug: "instagram-marketing-tips",
    title: "10 Instagram Marketing Tips To Grow Your Brand In 2026",
    excerpt: "Reels, carousels, and stories — the exact posting strategy that drives real engagement.",
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=800&auto=format&fit=crop",
    category: "Social Media",
    date: "2025-11-20",
    displayDate: "20 Nov 2025",
  },
  {
    id: "8",
    slug: "branding-basics-startups",
    title: "Branding Basics Every Startup Should Know",
    excerpt: "From logo to voice — building a brand identity that customers remember.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
    category: "Branding",
    date: "2025-11-05",
    displayDate: "05 Nov 2025",
  },
  {
    id: "9",
    slug: "nextjs-vs-wordpress",
    title: "Next.js Vs WordPress: Which Should You Choose In 2026?",
    excerpt: "Performance, SEO, and scalability compared for modern business websites.",
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=800&auto=format&fit=crop",
    category: "Web Development",
    date: "2025-10-18",
    displayDate: "18 Oct 2025",
  },
  {
    id: "10",
    slug: "ppc-campaign-mistakes",
    title: "5 Common PPC Campaign Mistakes That Waste Your Budget",
    excerpt: "Avoid these Google Ads errors that quietly drain your marketing spend.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
    category: "Digital Marketing",
    date: "2025-10-02",
    displayDate: "02 Oct 2025",
  },
  {
    id: "11",
    slug: "chatgpt-content-marketing",
    title: "Using AI Chatbots For Content Marketing — A Practical Guide",
    excerpt: "How to use AI tools responsibly to speed up content creation without losing quality.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    category: "AI",
    date: "2025-09-14",
    displayDate: "14 Sep 2025",
  },
  {
    id: "12",
    slug: "local-seo-guide",
    title: "Local SEO Guide: Rank Higher In Your City's Search Results",
    excerpt: "Google Business Profile optimization tips for local businesses in Dehradun and beyond.",
    image: "https://images.unsplash.com/photo-1553484771-047a44eee27b?q=80&w=800&auto=format&fit=crop",
    category: "SEO",
    date: "2025-08-30",
    displayDate: "30 Aug 2025",
  },
];

const EXPLORE_TOPICS = [
  "SEO", "PPC", "Branding", "Social Media", "Web Design",
  "AI Tools", "Content", "Analytics", "E-commerce", "Startups",
];

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredPosts = useMemo(() => {
    let result = [...POSTS];

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
  }, [searchTerm, activeCategory, sortOrder]);

  // Reset visible count whenever filters change, so a fresh filter starts at 6
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
    // smooth scroll back to top of grid
    document.getElementById("blog-grid-top")?.scrollIntoView({ behavior: "smooth" });
  };

  const latestThree = useMemo(
    () =>
      [...POSTS]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
    []
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

            {/* Search + sort */}
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

            {/* Category pills */}
            <div className={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryPillActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Blog grid */}
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

                {/* Load more / Show less controls */}
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

              <button className={styles.enquireBtn}>
                ENQUIRE NOW <span>→</span>
              </button>
            </div>

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