// data/blogPosts.ts
// Static blog data for Dream Byte Solutions — used by both the blog listing
// page and the single-post page at /blog/[slug]. Swap this out for a CMS /
// API call later without touching the components — they only need
// getPostBySlug / getRelatedPosts / getRecentPosts to keep working.

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "callout"; title?: string; text: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string; // ISO
  displayDate: string;
  author: string;
  authorRole: string;
  tags: string[];
  content: ContentBlock[];
}

export const CATEGORIES = [
  "All",
  "Digital Marketing",
  "SEO",
  "Social Media",
  "Web Development",
  "AI",
  "Branding",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "traditional-vs-digital-marketing",
    title: "Traditional Marketing Vs Digital Marketing: What's Best For Your Business?",
    excerpt:
      "Explore the hidden risks of traditional marketing and why digital-first strategies are winning in 2026.",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1600&auto=format&fit=crop",
    category: "Digital Marketing",
    date: "2026-07-28",
    displayDate: "28 Jul 2026",
    author: "Priya Sharma",
    authorRole: "Content Strategist",
    tags: ["Marketing Strategy", "ROI", "Small Business"],
    content: [
      {
        type: "paragraph",
        text:
          "Every business owner eventually faces the same question: where should the next marketing rupee go? A few years ago the answer was split evenly between a newspaper insert and a hoarding on the highway. Today, that split has tilted hard toward screens — and the reasons go far beyond \"digital is trendy.\"",
      },
      { type: "heading", text: "The measurement problem" },
      {
        type: "paragraph",
        text:
          "Traditional channels — print, radio, banners — sell you reach, not results. You can estimate how many people drove past a hoarding, but you can't tell how many of them remembered your number, let alone called it. Digital campaigns flip this completely: every click, scroll, and form fill is logged, timestamped, and attributable.",
      },
      {
        type: "list",
        items: [
          "Cost per lead is visible in real time, not estimated after the campaign ends",
          "Targeting can be narrowed to a pin code, an age bracket, or even a past website visitor",
          "Creative can be swapped mid-campaign the moment something underperforms",
          "Budgets scale up or down in hours, not the weeks it takes to renegotiate a print booking",
        ],
      },
      {
        type: "quote",
        text:
          "We didn't abandon traditional media because it stopped working — we moved because we could finally see what was and wasn't working.",
        author: "Priya Sharma, Dream Byte Solutions",
      },
      { type: "heading", text: "Where traditional still earns its place" },
      {
        type: "paragraph",
        text:
          "This isn't a eulogy for print or radio. Local trust-building, festive-season brand recall, and certain B2B audiences still respond well to a physical presence. The smartest budgets in 2026 aren't 100% digital — they're digital-first, with traditional spends reserved for the moments they genuinely outperform a screen.",
      },
      {
        type: "callout",
        title: "Our take",
        text:
          "If you're starting from zero, put 70–80% of your first-year budget into digital channels you can measure, and keep a small traditional line item for local credibility. Adjust the ratio once you have three months of real data.",
      },
    ],
  },
  {
    id: "2",
    slug: "google-ads-vs-seo",
    title: "Google Ads Vs SEO: Which Is Better For Your Business Goals?",
    excerpt:
      "A head-to-head comparison to help you decide where to invest your marketing budget first.",
    image:
      "https://images.unsplash.com/photo-1571677246347-5040036b95cc?q=80&w=1600&auto=format&fit=crop",
    category: "SEO",
    date: "2026-02-05",
    displayDate: "05 Feb 2026",
    author: "Rohit Malhotra",
    authorRole: "SEO Lead",
    tags: ["SEO", "Google Ads", "PPC"],
    content: [
      {
        type: "paragraph",
        text:
          "This question comes up in almost every discovery call: should we run ads or invest in SEO first? The honest answer is that they solve different problems, on different timelines, for different amounts of money — and most businesses eventually need both.",
      },
      { type: "heading", text: "Speed vs. compounding" },
      {
        type: "paragraph",
        text:
          "Google Ads gets you to the top of the results page the same day you launch. SEO, on the other hand, is closer to planting an orchard — the first fruit takes months, but once ranked, an article can keep bringing in traffic for years without further ad spend.",
      },
      {
        type: "list",
        items: [
          "Ads: pay per click, results stop the moment the budget runs out",
          "SEO: front-loaded effort, but traffic keeps arriving after the work is done",
          "Ads: ideal for a launch, a sale, or testing which offer converts",
          "SEO: ideal for durable authority in a category you plan to compete in long-term",
        ],
      },
      { type: "heading", text: "Trust signals differ too" },
      {
        type: "paragraph",
        text:
          "Users have grown ad-blind for certain queries, especially informational ones, and instinctively scroll past sponsored results to the organic list. For high-consideration purchases — a yoga teacher training course, a home renovation — organic rankings often carry more implicit trust than a paid slot.",
      },
      {
        type: "quote",
        text:
          "Ads buy you attention. SEO earns you belief. Most funnels need a bit of both, in that order.",
        author: "Rohit Malhotra, Dream Byte Solutions",
      },
      {
        type: "callout",
        title: "A simple starting rule",
        text:
          "If cash flow is tight and you need leads this month, start with a tightly-targeted Ads campaign. Use the keyword and conversion data it generates to prioritise which SEO content to write first — the two channels make each other smarter.",
      },
    ],
  },
  {
    id: "3",
    slug: "seo-in-2026",
    title: "SEO In 2026: What Still Works And What Doesn't",
    excerpt: "Algorithms have changed a lot — here's what actually moves rankings today.",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1600&auto=format&fit=crop",
    category: "SEO",
    date: "2026-01-08",
    displayDate: "08 Jan 2026",
    author: "Rohit Malhotra",
    authorRole: "SEO Lead",
    tags: ["SEO", "Algorithm Updates", "Content"],
    content: [
      {
        type: "paragraph",
        text:
          "Every January, half the marketing internet publishes a \"SEO trends this year\" post, and most of it is recycled advice with a new date stamped on top. Here's what we're actually seeing move rankings for our clients right now — and what quietly stopped mattering a while ago.",
      },
      { type: "heading", text: "Still working" },
      {
        type: "list",
        items: [
          "Genuinely original insight — data, opinions, or experience competitors can't copy-paste",
          "Fast, stable pages, especially on mobile connections that aren't fibre-fast",
          "Clear topical structure — a hub page linking out to focused subtopic pages",
          "Answering the actual question in the first two sentences, not after three paragraphs of preamble",
        ],
      },
      { type: "heading", text: "Quietly stopped working" },
      {
        type: "paragraph",
        text:
          "Keyword-stuffed filler content, thin \"listicle\" roundups with no first-hand insight, and link exchanges from irrelevant directories are all easier for modern ranking systems to spot — and discount — than they were a few years back. Volume alone no longer compensates for shallow content.",
      },
      {
        type: "callout",
        title: "The uncomfortable truth",
        text:
          "The teams winning in search right now simply write better, more specific content than their competitors and back it with a technically sound site. There isn't a shortcut left worth chasing.",
      },
      {
        type: "quote",
        text:
          "Every algorithm update is really just search engines getting better at agreeing with what a careful human editor would have said all along.",
        author: "Rohit Malhotra, Dream Byte Solutions",
      },
    ],
  },
  {
    id: "4",
    slug: "increase-organic-traffic",
    title: "How To Increase Organic Traffic To Your Website",
    excerpt:
      "Proven strategies — keyword research, on-page SEO, and link building explained simply.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    category: "SEO",
    date: "2026-01-02",
    displayDate: "02 Jan 2026",
    author: "Rohit Malhotra",
    authorRole: "SEO Lead",
    tags: ["SEO", "Organic Traffic", "Content Strategy"],
    content: [
      {
        type: "paragraph",
        text:
          "Organic traffic feels slow until it isn't. Most sites see nothing for the first couple of months, then a compounding curve kicks in once enough pages start ranking together. Here's the sequence we follow with new clients.",
      },
      { type: "heading", text: "1. Start with intent, not volume" },
      {
        type: "paragraph",
        text:
          "A keyword with 200 searches a month and clear buying intent will usually outperform one with 5,000 searches and no commercial purpose. Before writing anything, ask what the person searching actually wants to do next.",
      },
      { type: "heading", text: "2. Fix on-page basics before chasing backlinks" },
      {
        type: "list",
        items: [
          "One clear H1 per page that matches what the page is actually about",
          "Descriptive title tags and meta descriptions written for humans, not stuffed with repeats",
          "Internal links from older, established pages pointing to newer ones",
          "Images compressed and given real alt text, not \"image1.jpg\"",
        ],
      },
      { type: "heading", text: "3. Earn links by being worth linking to" },
      {
        type: "paragraph",
        text:
          "Original research, useful tools, and genuinely helpful guides attract links naturally. Cold outreach works far better when you're pointing someone to something worth citing, rather than asking for a favour.",
      },
      {
        type: "callout",
        text:
          "Track rankings monthly, not daily — search results fluctuate constantly and short-term noise will only distract you from the actual trend line.",
      },
    ],
  },
  {
    id: "5",
    slug: "ai-in-digital-marketing",
    title: "AI In Digital Marketing – The Ultimate Guide",
    excerpt:
      "How brands are using AI tools to automate campaigns and personalize customer experience.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
    category: "AI",
    date: "2025-12-08",
    displayDate: "08 Dec 2025",
    author: "Aditya Negi",
    authorRole: "AI & Automation Specialist",
    tags: ["AI", "Automation", "Personalization"],
    content: [
      {
        type: "paragraph",
        text:
          "AI in marketing stopped being a buzzword the moment it started saving real hours on real campaigns. The teams getting genuine value aren't chasing every new tool — they're using a small set of them consistently, for specific, well-defined jobs.",
      },
      { type: "heading", text: "Where AI is earning its keep" },
      {
        type: "list",
        items: [
          "First-draft ad copy and email variants, refined by a human before anything ships",
          "Segmenting audiences based on behaviour patterns too subtle to spot manually",
          "Summarising campaign performance so weekly reporting takes minutes, not hours",
          "Flagging anomalies in spend or conversion rate before they become expensive mistakes",
        ],
      },
      { type: "heading", text: "Where it still falls short" },
      {
        type: "paragraph",
        text:
          "Brand voice, cultural nuance, and genuinely original strategy still need a person in the loop. AI-generated content that skips human review tends to read as generic — competent, but forgettable, which is the opposite of what a brand needs.",
      },
      {
        type: "quote",
        text:
          "Treat AI like a very fast junior teammate: brilliant at drafts and grunt work, not yet ready to make the final call alone.",
        author: "Aditya Negi, Dream Byte Solutions",
      },
      {
        type: "callout",
        title: "Getting started",
        text:
          "Pick one repetitive task — ad variant generation, report summaries, or FAQ drafting — and automate that first. Expand only once the workflow is genuinely saving time without adding review overhead.",
      },
    ],
  },
  {
    id: "6",
    slug: "advantages-of-wordpress",
    title: "Advantages Of A WordPress Website",
    excerpt: "Why WordPress remains one of the most flexible platforms for growing businesses.",
    image:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
    category: "Web Development",
    date: "2025-12-05",
    displayDate: "05 Dec 2025",
    author: "Karan Thapa",
    authorRole: "Web Developer",
    tags: ["WordPress", "CMS", "Website Strategy"],
    content: [
      {
        type: "paragraph",
        text:
          "WordPress powers a huge share of the web for a simple reason: it removes the developer bottleneck from everyday content updates, without forcing a business into a rigid, one-size-fits-all template.",
      },
      { type: "heading", text: "What actually makes it worth choosing" },
      {
        type: "list",
        items: [
          "A plugin ecosystem covering nearly every common business need, from bookings to SEO",
          "A content editor non-technical teams can use without filing a support ticket",
          "A large developer community, meaning support and documentation rarely dry up",
          "Straightforward hosting portability — you're never locked to one vendor",
        ],
      },
      { type: "heading", text: "The trade-offs to plan for" },
      {
        type: "paragraph",
        text:
          "Flexibility comes with a maintenance responsibility: plugins need updates, and a poorly chosen theme can slow a site down. A WordPress site built and maintained with discipline performs beautifully; one left unmanaged accumulates technical debt quickly.",
      },
      {
        type: "callout",
        text:
          "For content-heavy marketing sites with a small team managing updates, WordPress is usually still the pragmatic choice. For highly custom, interaction-heavy products, a framework like Next.js may serve better — more on that comparison in another post.",
      },
    ],
  },
  {
    id: "7",
    slug: "instagram-marketing-tips",
    title: "10 Instagram Marketing Tips To Grow Your Brand In 2026",
    excerpt:
      "Reels, carousels, and stories — the exact posting strategy that drives real engagement.",
    image:
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=1600&auto=format&fit=crop",
    category: "Social Media",
    date: "2025-11-20",
    displayDate: "20 Nov 2025",
    author: "Ananya Bisht",
    authorRole: "Social Media Manager",
    tags: ["Instagram", "Reels", "Social Media"],
    content: [
      {
        type: "paragraph",
        text:
          "Instagram's algorithm rewards consistency and format variety over raw follower count. A small account posting deliberately can outperform a large, inactive one within a few weeks. Here's the playbook we run for clients.",
      },
      { type: "heading", text: "The format mix that works" },
      {
        type: "list",
        items: [
          "Reels for reach — short, hook-first, captioned for sound-off viewing",
          "Carousels for saves and shares — practical, step-by-step, or list-based content",
          "Stories for daily presence — polls, behind-the-scenes, quick updates",
          "A handful of static grid posts for brand identity and profile-visit conversions",
        ],
      },
      { type: "heading", text: "Hook in the first second" },
      {
        type: "paragraph",
        text:
          "The single biggest lever for Reels performance is the first frame and first line of caption. If it doesn't create curiosity or promise a clear payoff immediately, most viewers scroll past before the algorithm even registers a watch.",
      },
      {
        type: "quote",
        text:
          "Post less often but plan every post around one clear reason someone would stop scrolling — that beats a daily post with no angle.",
        author: "Ananya Bisht, Dream Byte Solutions",
      },
      {
        type: "callout",
        title: "Quick win",
        text:
          "Repurpose your best-performing carousel topic into a Reel, and your best Reel topic into a carousel. Different formats reach different segments of the same audience.",
      },
    ],
  },
  {
    id: "8",
    slug: "branding-basics-startups",
    title: "Branding Basics Every Startup Should Know",
    excerpt: "From logo to voice — building a brand identity that customers remember.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop",
    category: "Branding",
    date: "2025-11-05",
    displayDate: "05 Nov 2025",
    author: "Neha Rawat",
    authorRole: "Brand Designer",
    tags: ["Branding", "Identity Design", "Startups"],
    content: [
      {
        type: "paragraph",
        text:
          "Founders often treat branding as \"the logo step\" — something to tick off before launch. In reality, a logo is the smallest visible part of a much larger system that decides whether people remember, trust, and recommend you.",
      },
      { type: "heading", text: "The pieces that actually build recognition" },
      {
        type: "list",
        items: [
          "A consistent colour and type system used everywhere, not just on the homepage",
          "A voice — the specific way your brand writes, whether formal, playful, or direct",
          "A one-line positioning statement everyone on the team can repeat identically",
          "Visual consistency across every touchpoint: website, invoices, social, packaging",
        ],
      },
      { type: "heading", text: "Consistency beats cleverness" },
      {
        type: "paragraph",
        text:
          "A modest identity applied consistently for a year will out-recall a brilliant one that changes every quarter. Recognition is built through repetition, not novelty — resist the urge to redesign every time you get bored of your own brand.",
      },
      {
        type: "quote",
        text:
          "Your brand isn't your logo. It's the feeling someone gets the third time they interact with you, once the novelty has worn off.",
        author: "Neha Rawat, Dream Byte Solutions",
      },
    ],
  },
  {
    id: "9",
    slug: "nextjs-vs-wordpress",
    title: "Next.js Vs WordPress: Which Should You Choose In 2026?",
    excerpt: "Performance, SEO, and scalability compared for modern business websites.",
    image:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=1600&auto=format&fit=crop",
    category: "Web Development",
    date: "2025-10-18",
    displayDate: "18 Oct 2025",
    author: "Karan Thapa",
    authorRole: "Web Developer",
    tags: ["Next.js", "WordPress", "Web Performance"],
    content: [
      {
        type: "paragraph",
        text:
          "This comparison comes up in almost every new website project, and the honest answer depends less on which is \"better\" and more on who will maintain the site day to day, and what it needs to do.",
      },
      { type: "heading", text: "Choose WordPress when" },
      {
        type: "list",
        items: [
          "Non-technical staff will be publishing content regularly",
          "The site is primarily content and forms, not custom interactive features",
          "You need a large plugin ecosystem for bookings, membership, or e-commerce fast",
        ],
      },
      { type: "heading", text: "Choose Next.js when" },
      {
        type: "list",
        items: [
          "Performance and Core Web Vitals are a competitive priority",
          "The product needs custom, app-like interactions beyond typical page templates",
          "You want full control over rendering strategy — static, server, or hybrid",
        ],
      },
      {
        type: "callout",
        title: "Our honest recommendation",
        text:
          "For a marketing site with a small content team, WordPress remains the faster, cheaper path. For a product-driven business where speed and custom UX are the differentiator, Next.js pays for itself quickly.",
      },
    ],
  },
  {
    id: "10",
    slug: "ppc-campaign-mistakes",
    title: "5 Common PPC Campaign Mistakes That Waste Your Budget",
    excerpt: "Avoid these Google Ads errors that quietly drain your marketing spend.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
    category: "Digital Marketing",
    date: "2025-10-02",
    displayDate: "02 Oct 2025",
    author: "Priya Sharma",
    authorRole: "Content Strategist",
    tags: ["PPC", "Google Ads", "Budget Optimization"],
    content: [
      {
        type: "paragraph",
        text:
          "We regularly audit ad accounts before taking them over, and the same five mistakes show up again and again — quietly burning budget without anyone noticing until the monthly bill lands.",
      },
      {
        type: "list",
        items: [
          "Broad match keywords with no negative keyword list, catching irrelevant searches",
          "Sending every click to the homepage instead of a landing page built for that offer",
          "Never revisiting search term reports, so wasted spend repeats month after month",
          "Running every campaign on the same bidding strategy regardless of its goal",
          "Testing creative for a few days and calling it a loss before it has enough data",
        ],
      },
      { type: "heading", text: "The fix is usually cheaper than the mistake" },
      {
        type: "paragraph",
        text:
          "None of these require a bigger budget to fix — just a weekly habit of reviewing search terms, matching landing pages to intent, and giving each test enough time to reach statistical relevance before judging it.",
      },
      {
        type: "quote",
        text:
          "Most \"Google Ads doesn't work for us\" stories we hear are really \"we never looked at the search term report\" stories.",
        author: "Priya Sharma, Dream Byte Solutions",
      },
    ],
  },
  {
    id: "11",
    slug: "chatgpt-content-marketing",
    title: "Using AI Chatbots For Content Marketing — A Practical Guide",
    excerpt:
      "How to use AI tools responsibly to speed up content creation without losing quality.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    category: "AI",
    date: "2025-09-14",
    displayDate: "14 Sep 2025",
    author: "Aditya Negi",
    authorRole: "AI & Automation Specialist",
    tags: ["AI", "Content Marketing", "Productivity"],
    content: [
      {
        type: "paragraph",
        text:
          "AI chatbots are genuinely useful for content marketing — but only when treated as a drafting assistant, not a replacement for editorial judgement. Here's the workflow that keeps quality high while saving real time.",
      },
      { type: "heading", text: "A workflow that keeps quality high" },
      {
        type: "list",
        items: [
          "Brief the tool with real audience context, not just a topic",
          "Generate multiple angles, then pick the strongest — don't publish the first draft",
          "Fact-check every specific claim, statistic, or quote before it goes live",
          "Rewrite the opening and closing in your own voice; that's where sameness shows most",
        ],
      },
      { type: "heading", text: "What to never automate fully" },
      {
        type: "paragraph",
        text:
          "Anything involving legal claims, medical advice, or specific client results needs a human expert's review, every time. Speed is worthless if it costs credibility.",
      },
      {
        type: "callout",
        title: "Reality check",
        text:
          "Readers can usually tell the difference between AI-assisted content that was edited with care and content that wasn't. The edit is where the value gets added — don't skip it.",
      },
    ],
  },
  {
    id: "12",
    slug: "local-seo-guide",
    title: "Local SEO Guide: Rank Higher In Your City's Search Results",
    excerpt:
      "Google Business Profile optimization tips for local businesses in Dehradun and beyond.",
    image:
      "https://images.unsplash.com/photo-1553484771-047a44eee27b?q=80&w=1600&auto=format&fit=crop",
    category: "SEO",
    date: "2025-08-30",
    displayDate: "30 Aug 2025",
    author: "Rohit Malhotra",
    authorRole: "SEO Lead",
    tags: ["Local SEO", "Google Business Profile", "Maps"],
    content: [
      {
        type: "paragraph",
        text:
          "For any business with a physical location or a defined service area, local search results — the map pack and \"near me\" queries — often drive more revenue than the standard organic results below them.",
      },
      { type: "heading", text: "Google Business Profile basics that matter most" },
      {
        type: "list",
        items: [
          "A complete, accurate profile — category, hours, service area, and photos kept current",
          "Consistent name, address, and phone number across every directory listing online",
          "Genuine, recent reviews, responded to promptly whether positive or negative",
          "Regular posts and updated photos, which signal an actively managed profile",
        ],
      },
      { type: "heading", text: "Content that supports local rankings" },
      {
        type: "paragraph",
        text:
          "Location-specific landing pages, genuinely local case studies, and mentions in local press or community sites all reinforce relevance for a specific city or neighbourhood far more than generic national content.",
      },
      {
        type: "quote",
        text:
          "Local SEO rewards businesses that actually behave like part of the neighbourhood — not just ones that mention the city name in a meta tag.",
        author: "Rohit Malhotra, Dream Byte Solutions",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (p) => p.category === post.category && p.id !== post.id
  ).slice(0, limit);
}

export function getRecentPosts(excludeId: string, limit = 4): BlogPost[] {
  return [...BLOG_POSTS]
    .filter((p) => p.id !== excludeId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function calcReadTime(content: ContentBlock[]): number {
  const words = content
    .map((b) => {
      if (b.type === "paragraph" || b.type === "heading" || b.type === "quote" || b.type === "callout")
        return b.text;
      if (b.type === "list") return b.items.join(" ");
      return "";
    })
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}