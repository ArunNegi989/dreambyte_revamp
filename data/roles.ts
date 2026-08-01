export type Dept = 'Engineering' | 'Marketing' | 'Sales' | 'Design';

export interface Role {
  slug: string;
  title: string;
  dept: Dept;
  tagline: string;
  date: string;
  type: string;
  location: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
}

export const ROLES: Role[] = [
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    dept: 'Engineering',
    tagline: 'From front-end to backend — own the stack.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The Full Stack Developer will design, build, and maintain web applications end-to-end — from database schema to polished UI — for client projects spanning e-commerce, government, wellness, and internal tooling.',
    responsibilities: [
      'Build and maintain full-stack features using React/Next.js on the front end and Node.js/Express on the back end.',
      'Design and optimize MongoDB schemas and queries for performance and scale.',
      'Translate Figma designs into responsive, accessible interfaces.',
      'Write clean, typed, well-documented code and take part in code reviews.',
      'Debug and resolve issues across the stack, including production and deployment environments.',
      'Integrate third-party APIs and services such as payments, auth, and cloud storage.',
    ],
    qualifications: [
      "Bachelor's degree in Computer Science, IT, or a related field (or equivalent practical experience).",
      '1–3 years of hands-on experience with the MERN stack (MongoDB, Express, React, Node.js).',
      'Working knowledge of TypeScript and Next.js is a strong plus.',
      'Comfortable with Git-based workflows and deploying to VPS/cloud environments.',
    ],
  },
  {
    slug: 'graphic-designer',
    title: 'Graphic Designer',
    dept: 'Design',
    tagline: 'Design visuals that inspire and connect.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The Graphic Designer will create visual assets across digital and print — from social creatives to brand collateral — keeping every client\u2019s identity consistent and eye-catching.',
    responsibilities: [
      'Design social media creatives, banners, brochures, and marketing collateral for multiple client brands.',
      'Maintain and evolve brand guidelines across projects.',
      'Collaborate with the marketing and social media team to align visuals with campaign goals.',
      'Prepare print-ready files and digital assets in the correct formats and specifications.',
      'Stay current with design trends and bring fresh visual ideas to the team.',
    ],
    qualifications: [
      "Bachelor's degree in Design, Fine Arts, or a related field.",
      '1–3 years of experience with Adobe Photoshop, Illustrator, and/or Figma.',
      'A strong portfolio demonstrating range across digital and print design.',
      'Basic understanding of motion graphics or video editing is a plus.',
    ],
  },
  {
    slug: 'social-media-executive',
    title: 'Social Media Executive',
    dept: 'Marketing',
    tagline: 'Drive engagement. Create impact. Be our voice online.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The Social Media Executive will be responsible for managing the company\u2019s presence across social media platforms, creating engaging content, running campaigns, and analyzing performance to strengthen brand visibility and customer engagement.',
    responsibilities: [
      'Develop, implement, and manage the company\u2019s social media strategy across platforms (Facebook, Instagram, LinkedIn, Twitter/X, YouTube, etc.).',
      'Create, curate, and publish engaging content — text, image, video, and stories.',
      'Monitor trends, competitor activity, and industry updates to enhance digital presence.',
      'Track analytics and prepare monthly performance reports with insights and recommendations.',
      'Respond to comments, messages, and queries in a timely and professional manner.',
      'Collaborate with the content, design, and photography teams to align social media efforts with overall brand strategy.',
      'Maintain brand consistency across all social channels.',
    ],
    qualifications: [
      "Bachelor's degree in Marketing, Communications, Digital Media, or a related field.",
      '1–3 years of proven experience in social media management/digital marketing.',
      'Certification in Digital Marketing / Social Media Marketing will be an added advantage.',
    ],
  },
  {
    slug: 'digital-marketing-executive-ppc',
    title: 'Digital Marketing Executive — PPC Specialist',
    dept: 'Marketing',
    tagline: 'Turn clicks into customers.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The PPC Specialist will plan, launch, and optimize paid campaigns across Google, Meta, and other ad platforms to drive measurable growth for client brands.',
    responsibilities: [
      'Plan, execute, and optimize PPC campaigns on Google Ads, Meta Ads, and other platforms.',
      'Conduct keyword research, audience targeting, and competitor analysis.',
      'Monitor budgets and bids, adjusting campaigns for maximum ROI.',
      'Prepare performance reports with actionable insights for clients and leadership.',
      'A/B test ad creatives, landing pages, and targeting strategies.',
    ],
    qualifications: [
      "Bachelor's degree in Marketing, Business, or a related field.",
      '1–3 years of hands-on PPC/performance marketing experience.',
      'Google Ads and/or Meta Blueprint certification is a strong plus.',
      'Comfortable working with analytics tools like Google Analytics and Ads Manager.',
    ],
  },
  {
    slug: 'tele-sales-executive',
    title: 'Tele Sales Executive',
    dept: 'Sales',
    tagline: 'Turn conversations into conversions.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The Tele Sales Executive will connect with prospective clients over calls, understand their needs, and convert conversations into confirmed business.',
    responsibilities: [
      'Make outbound calls to leads and prospects to introduce Dream Byte\u2019s services.',
      'Understand client requirements and pitch relevant solutions.',
      'Maintain accurate records of calls, leads, and follow-ups in the CRM.',
      'Meet daily/weekly call and conversion targets.',
      'Coordinate with the sales team to hand off qualified leads smoothly.',
    ],
    qualifications: [
      'Any graduate; prior tele-calling or sales experience preferred.',
      'Excellent verbal communication skills in Hindi and English.',
      'Comfortable with CRM tools and basic reporting.',
      'Target-driven mindset with strong follow-up discipline.',
    ],
  },
  {
    slug: 'business-development-executive',
    title: 'Business Development Executive',
    dept: 'Sales',
    tagline: 'Driving growth, building partnerships, unlocking opportunity.',
    date: '18 Nov 2025',
    type: 'Full-time',
    location: 'Dehradun',
    overview:
      'The Business Development Executive will identify new business opportunities, build client relationships, and drive partnerships that grow Dream Byte\u2019s footprint.',
    responsibilities: [
      'Identify and pursue new business opportunities across target industries.',
      'Build and maintain relationships with prospective and existing clients.',
      'Prepare proposals, presentations, and pitches tailored to client needs.',
      'Negotiate terms and close deals in coordination with leadership.',
      'Track pipeline and report on business development metrics.',
    ],
    qualifications: [
      "Bachelor's degree in Business, Marketing, or a related field.",
      '1–3 years of experience in business development, sales, or client servicing.',
      'Strong communication, negotiation, and relationship-building skills.',
      'Comfortable with CRM tools and structured pipeline tracking.',
    ],
  },
];

export function getRoleBySlug(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}