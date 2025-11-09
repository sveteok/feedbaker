export type UserPlaceholder = {
  provider: string;
  provider_id: string;
  name: string;
  email: string;
  is_admin: boolean;
  picture?: string | undefined;
  created_on: string;
  updated_on: string;
};

export type SitePlaceholder = {
  name: string;
  url: string | null;
  description: string | null;
  created_on: string;
  updated_on: string;
};

export type FeedbackPlaceholder = {
  site_id: string;
  author: string;
  body: string;
  public: boolean;
  created_on: string;
  updated_on: string;
  comment?: string;
};

const now = new Date();
const iso = (daysAgo: number) =>
  new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const randomDate = (daysBack = 90) => iso(Math.floor(Math.random() * daysBack));

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

// const pick = <T>(arr: readonly T[]): T | undefined => {
//   if (arr.length === 0) return undefined;
//   return arr[Math.floor(Math.random() * arr.length)];
// };

//
// USERS
//
export const usersDataOld: UserPlaceholder[] = [
  {
    provider: "google",
    provider_id: "google_001",
    name: "Alice Johnson",
    email: "alice@example.com",
    is_admin: true,
    picture: "https://i.pravatar.cc/150?img=1",
    created_on: iso(30),
    updated_on: iso(10),
  },
  {
    provider: "google",
    provider_id: "google_002",
    name: "Bob Smith",
    email: "bob@example.com",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=2",
    created_on: iso(25),
    updated_on: iso(5),
  },
  {
    provider: "github",
    provider_id: "github_003",
    name: "Charlie Brown",
    email: "charlie@example.com",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=3",
    created_on: iso(20),
    updated_on: iso(2),
  },
  {
    provider: "google",
    provider_id: "google_004",
    name: "Dana White",
    email: "dana@example.com",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=4",
    created_on: iso(15),
    updated_on: iso(1),
  },
];

//
// SITES
//
export const sitesDataOld: SitePlaceholder[] = [
  {
    name: "Feedbaker Docs",
    url: "https://docs.feedbaker.io",
    description: "Documentation and guides for Feedbaker users.",
    created_on: iso(20),
    updated_on: iso(5),
  },
  {
    name: "TechThreads Blog",
    url: "https://techthreads.blog",
    description: "A developer blog about TypeScript and modern web tooling.",
    created_on: iso(18),
    updated_on: iso(4),
  },
  {
    name: "PixelCraft Portfolio",
    url: "https://pixelcraft.design",
    description: "Design agency portfolio showcasing digital products.",
    created_on: iso(15),
    updated_on: iso(2),
  },
  {
    name: "NodeWizards Forum",
    url: "https://forum.nodewizards.dev",
    description: "Community forum for backend developers.",
    created_on: iso(10),
    updated_on: iso(1),
  },
];

//
// FEEDBACK
//
export const feedbackDataOld: FeedbackPlaceholder[] = [
  {
    site_id: "", // replaced at runtime by your seed script
    author: "jane.doe@example.com",
    body: "Loved the clean documentation and clear examples!",
    public: true,
    created_on: iso(5),
    updated_on: iso(3),
    comment: "Very intuitive structure!",
  },
  {
    site_id: "",
    author: "mike@example.com",
    body: "Would appreciate more dark mode options.",
    public: true,
    created_on: iso(8),
    updated_on: iso(6),
  },
  {
    site_id: "",
    author: "lisa@example.com",
    body: "Found a few typos in the setup guide, otherwise great!",
    public: true,
    created_on: iso(10),
    updated_on: iso(9),
    comment: "Can help proofread if needed.",
  },
  {
    site_id: "",
    author: "dev.guru@example.com",
    body: "The feedback widget integration was seamless — 10/10!",
    public: true,
    created_on: iso(4),
    updated_on: iso(2),
  },
];
export const usersData: UserPlaceholder[] = [
  {
    provider: "google",
    provider_id: "google_001",
    name: "Alice Johnson",
    email: "alice@feedbaker.dev",
    is_admin: true,
    picture: "https://i.pravatar.cc/150?img=1",
    created_on: iso(60),
    updated_on: iso(2),
  },
  {
    provider: "google",
    provider_id: "google_002",
    name: "Bob Smith",
    email: "bob@feedbaker.dev",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=2",
    created_on: iso(55),
    updated_on: iso(5),
  },
  {
    provider: "github",
    provider_id: "github_003",
    name: "Charlie Nguyen",
    email: "charlie@feedbaker.dev",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=3",
    created_on: iso(50),
    updated_on: iso(4),
  },
  {
    provider: "google",
    provider_id: "google_004",
    name: "Dana White",
    email: "dana@feedbaker.dev",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=4",
    created_on: iso(45),
    updated_on: iso(1),
  },
  {
    provider: "github",
    provider_id: "github_005",
    name: "Ethan Patel",
    email: "ethan@feedbaker.dev",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=5",
    created_on: iso(40),
    updated_on: iso(3),
  },
  {
    provider: "google",
    provider_id: "google_006",
    name: "Fiona García",
    email: "fiona@feedbaker.dev",
    is_admin: false,
    picture: "https://i.pravatar.cc/150?img=6",
    created_on: iso(30),
    updated_on: iso(2),
  },
];

//
// --- SITES (10 long-form entries)
//
export const sitesData: SitePlaceholder[] = [
  {
    name: "Feedbaker Docs",
    url: "https://docs.feedbaker.io",
    description:
      "The official documentation hub for Feedbaker, with detailed integration guides, code snippets, and advanced configuration options for developers.",
    created_on: iso(40),
    updated_on: iso(5),
  },
  {
    name: "TechThreads Blog",
    url: "https://techthreads.blog",
    description:
      "A modern tech publication exploring the art of software engineering. The site integrates Feedbaker for direct reader engagement.",
    created_on: iso(38),
    updated_on: iso(6),
  },
  {
    name: "PixelCraft Portfolio",
    url: "https://pixelcraft.design",
    description:
      "A design agency showcasing interactive prototypes, brand guidelines, and motion experiments. Feedback helps them refine client experiences.",
    created_on: iso(35),
    updated_on: iso(8),
  },
  {
    name: "NodeWizards Forum",
    url: "https://forum.nodewizards.dev",
    description:
      "A community forum for Node.js developers sharing code, best practices, and deployment tips. Feedbaker collects sentiment on posts and tutorials.",
    created_on: iso(33),
    updated_on: iso(5),
  },
  {
    name: "Studio Aurora",
    url: "https://studioaurora.io",
    description:
      "Creative studio specializing in web storytelling and interactive campaigns. They use feedback data to optimize narrative engagement.",
    created_on: iso(30),
    updated_on: iso(4),
  },
  {
    name: "StackBench",
    url: "https://stackbench.dev",
    description:
      "Framework benchmarking tool comparing performance across full-stack frameworks. Feedback influences upcoming test categories.",
    created_on: iso(28),
    updated_on: iso(7),
  },
  {
    name: "Orbit Learning",
    url: "https://orbitlearning.org",
    description:
      "Online education platform offering AI and web development courses. Student feedback drives curriculum improvements.",
    created_on: iso(26),
    updated_on: iso(3),
  },
  {
    name: "DailyMix News",
    url: "https://dailymix.news",
    description:
      "Tech journalism platform with daily coverage of startups and product releases. Reader feedback shapes editorial direction.",
    created_on: iso(23),
    updated_on: iso(2),
  },
  {
    name: "CodeCrumbs",
    url: "https://codecrumbs.dev",
    description:
      "Educational hub with debugging guides and interactive learning paths. Every article ends with a short feedback prompt.",
    created_on: iso(20),
    updated_on: iso(2),
  },
  {
    name: "EcoTrack",
    url: "https://ecotrack.app",
    description:
      "A sustainability analytics app helping organizations monitor their carbon footprint. Feedback drives feature priorities.",
    created_on: iso(18),
    updated_on: iso(1),
  },
];

//
// --- FEEDBACK (200 entries, 50% with replies from admins/owners)
//
const sampleBodies = [
  "Love how intuitive the interface feels!",
  "The loading time could be improved slightly.",
  "Would be nice to have dark mode by default.",
  "Documentation is clear and very helpful.",
  "I ran into a minor bug when editing comments.",
  "Could you add export functionality?",
  "The dashboard analytics are top-notch.",
  "Really appreciate the accessibility focus.",
  "Mobile version feels a bit cramped.",
  "Smooth setup experience overall!",
  "Integration with Google was seamless.",
  "I'd love to see more UI customization options.",
  "Animations feel snappy and pleasant.",
  "The onboarding flow could be shorter.",
  "The support team was super responsive!",
];

const sampleReplies = [
  "Thanks for the kind words! We’re working on it.",
  "Dark mode improvements are on our roadmap!",
  "We appreciate your feedback — bug will be fixed soon.",
  "That’s a great idea. We’ll add it to our backlog.",
  "Thanks! Our docs team will review your suggestion.",
  "We’re optimizing load performance this week.",
  "Glad you noticed! Accessibility is a top priority.",
  "Appreciate it — we’ll explore layout improvements.",
  "Export tools are coming in the next release.",
  "Thank you for testing! Keep the feedback coming.",
];

export const feedbackData: FeedbackPlaceholder[] = Array.from(
  { length: 200 },
  (_, i): FeedbackPlaceholder => {
    const body = pick(sampleBodies); // guaranteed string
    const hasReply = Math.random() < 0.5;
    const comment = hasReply ? pick(sampleReplies) : "";

    return {
      site_id: "",
      author: `user${i + 1}@example.com`,
      body,
      public: true,
      created_on: randomDate(),
      updated_on: randomDate(),
      comment,
    };
  }
);
