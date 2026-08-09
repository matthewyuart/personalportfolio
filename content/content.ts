// ============================================================
// ALL site content lives in this one file.
// Project copy is verbatim from matthewyu.dev — do not paraphrase.
// ============================================================
import rawDims from "./dims.json";

const dims = rawDims as unknown as Record<string, [number, number]>;

export type Pic = { src: string; w: number; h: number };
export const pic = (src: string): Pic => {
  const d = dims[src] ?? [1200, 1600];
  return { src, w: d[0], h: d[1] };
};

// ---------- site chrome (every visible string is editable here) ----------
export const site = {
  name: "Matthew Yu",
  footer: "© Matthew Yu 2026",
  nav: { work: "work", play: "play", inspiration: "inspiration" },
  labels: {
    projects: "Projects",
    art: "Art",
    sketchbook: "Sketchbook",
    photography: "Photography",
    experiments: "Experiments",
  },
};

// ---------- about ----------
export const about = {
  eyebrow: "DESIGNER / ENGINEER / ARTIST / STUDENT @ STANFORD",
  headshot: pic("/headshot.jpg"),
  // paragraph segments; segments with href render as bolded links
  bio: [
    { text: "Matthew Yu is currently a CS and Design student at Stanford. His work spans technology, design, and storytelling, and he combines these skills to create projects and media that have been featured by " },
    { text: "i-D magazine", href: "https://www.instagram.com/p/DZHyVkMCP73/?img_index=3" },
    { text: ", the MET Museum, KAWS, NASA Artemis, International Society of Automation, and the National Foundation for Advancement in the Arts. He was also selected as one of " },
    { text: "20 U.S. Presidential Scholars in the Arts in 2025", href: "https://youngarts.org/press-releases/youngarts-announces-the-2025-u-s-presidential-scholars-in-the-arts/" },
    { text: ". Through his creative work, he has reached an online audience of " },
    { text: "50k+ and 45M+ views", href: "https://www.instagram.com/matthewyuart/" },
    { text: "." },
  ] as { text: string; href?: string }[],
  socials: [
    { type: "instagram", label: "Instagram", href: "https://www.instagram.com/matthewyuart/" },
    { type: "x", label: "X", href: "https://x.com/matthewyuart" },
    { type: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/matthew-yu2029/" },
    { type: "email", label: "Email", href: "mailto:mattyu@stanford.edu" },
  ] as { type: "instagram" | "x" | "linkedin" | "email"; label: string; href: string }[],
};

// ---------- projects (order matches the original site) ----------
export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  body: string[];
  list?: string[];
  images: Pic[];
  demo?: string; // live app URL — embedded on the page, always shows the latest deploy
  demoStyle?: "phone" | "wide"; // phone frame (default) or full-width browser frame
  demoAllow?: string; // iframe permissions (e.g. camera for gesturewatcher)
  links?: { label: string; href: string }[];
};

const imgs = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => pic(`/work/projects/${slug}/0${i + 1}.jpg`));

export const projects: Project[] = [
  {
    slug: "treehacks",
    title: "Treehacks Designs",
    year: "2025",
    tag: "branding design",
    body: [
      "During my frosh fall, I designed an extensive collection of custom merchandise and online advertisements for one of the largest Hackathons in the world: Treehacks at Stanford University.",
      "I was a designer alongside Grace Wang for Stanford's largest intercollegiate Hackathon sponsored by Google, NVIDIA, Tesla, OpenAI, Perplexity, Anthropic, Asus, Zoom etc. We created the entire branding of the event, making merch such as custom tote bags, stickers, t-shirts, playing cards, phone wallets, and PCB lanyards.",
    ],
    images: imgs("treehacks", 7),
  },
  {
    slug: "ratestartups",
    title: "ratestartups.com",
    year: "2026",
    tag: "full-stack / systems design",
    body: [
      "ratestartups is a head-to-head voting game for tech: two companies, one question — who has more aura? Every vote feeds a live Elo leaderboard. No signup, no login screen, nothing to solve; you land on the page and you're already playing.",
      "It went viral on its first weekend — over 1M edge requests and 117,000 votes processed in 72 hours, with no downtime.",
      "Popularity brought manipulation. Within a day someone was farming votes: dozens of throwaway sessions from a single network pushing one company to #1. Catching it, reversing it, and making it structurally unprofitable became the real design problem, and the more interesting half of the project.",
      "The defense is layered and deliberately silent — an attacker never sees an error, their votes simply stop moving the board. Because votes are an append-only ledger, manipulation found after the fact can be voided and the entire leaderboard replayed from scratch, so the rankings are always reconstructible.",
    ],
    list: [
      "Live Elo across three boards (startups, venture firms, and a secret fruit poll) — server-dealt single-use matchups, provisional K-factors, prefetched pairs for instant card swaps",
      "Invisible anti-abuse: Cloudflare Turnstile once per identity, bot detection, per-network sybil damping, reputation-weighted votes, and hidden trial rounds that quietly void a bot's session",
      "Append-only vote ledger with full-replay recompute — two live manipulation incidents caught, reversed, and patched without losing a legitimate vote",
      "Built to spread: per-company share cards, embeddable live rank badges, voter taste profiles",
      "Next.js, Postgres/Supabase, Drizzle, Vercel — ~90 tests, CI, and a nightly integrity cron",
    ],
    images: [pic("/work/projects/ratestartups/01.jpg")],
    demo: "https://ratestartups.com",
    demoStyle: "wide",
    links: [
      { label: "Live site", href: "https://ratestartups.com" },
    ],
  },
  {
    // copy is verbatim from the project's README
    slug: "gesturewatcher",
    title: "GestureWatcher",
    year: "2026",
    tag: "interaction design",
    body: [
      "Build things visually with your hands. GestureWatcher turns your webcam into an input device: it tracks your hands in real time (MediaPipe Hand Landmarker, fully in-browser — no video ever leaves your machine) and turns pinches, points, and palms into a cursor you can build with.",
    ],
    list: [
      "Layout — air-drag wireframe UI blocks (navbar, hero, cards…) from a shelf onto a canvas to sketch a page layout",
      "Nodes — a flow/system-diagram editor — pinch-drag nodes, pinch a port and release on another node to wire them up",
      "Jarvis — an Iron-Man style HUD — hover to target, pinch to press toggles and mission buttons, drag the radar around",
    ],
    images: [pic("/work/projects/gesturewatcher/01.jpg")],
    demo: "https://gesturewatcher.vercel.app",
    demoStyle: "wide",
    demoAllow: "camera",
    links: [
      { label: "Live app", href: "https://gesturewatcher.vercel.app" },
      { label: "GitHub", href: "https://github.com/matthewyuart/gesturewatcher" },
    ],
  },
  {
    // copy is verbatim from the team's Devpost submission (FigBuild 2026)
    slug: "rem",
    title: "rem: figbuild 2026",
    year: "2026",
    tag: "speculative tool design",
    body: [
      "Built for people tired of missing their own lives, rem is a contact lens interface that reads interoceptive biometric signals triggering passive capture at moments of genuine emotional salience.",
      "There's a well-documented phenomenon where the act of taking a photo actually impairs your memory of the thing you photographed. Your brain outsources the remembering on technology and stops encoding the experience itself. We started there — if the camera is making memory worse, what would a camera that didn't ask anything of you actually look like? Moreover, how might we reclaim our memories without compromising living in the present?",
      "rem is a speculative tool built for people who are tired of missing their own lives and consists of two key devices: an app and a pair of lens. The lens are a touchpoint which automatically record the moments your body recognizes as meaningful based on physical cues like pupil dilation or gaze duration — before your brain has time to reach for a phone. Following a gentle and personalized onboarding phase based on biometric data, it pairs seamlessly with an app that organizes and replays those memories for you based on identified patterns. You live, and rem keeps up.",
      "We used Figma Design to ideate and create moodboards to craft a cohesive brand identity, Figma Make to build a prototype, and Figma Slides to compile our work into one coherent presentation.",
      "Privacy was the hardest wall we kept running into. A device that records passively is admittedly uncomfortable at face value, and we were afraid of breaching privacy for the sake of novelty. We had to think carefully about thoughtful tradeoffs, where the product's responsibility ends and the user's begins, and how to account for these risks. With a thoughtful interaction model as our top priority, we made sure that rem implemented many layers of preferences and customization based on each individual user's boundaries and comfort.",
      "We are most proud that our product's entire philosophy stayed intact from the first idea to the final version. We were really deliberate about making sure rem never asks anything of you in the moment, and still captures the feeling of time passing (chronoception, as we denote in our presentation) most people have but don't have language for. We are proud of creating something deeply relevant to our own experiences, and tackling all the privacy considerations that came with this concept head-on. Situated in the current sociocultural climate, rem is forward-facing and seeks to coexist with a growing generation of 'digital natives' raised in an uncertain environment built on social media and emerging AI tools that are overwhelming at times.",
    ],
    images: [pic("/work/projects/rem/01.png"), pic("/work/projects/rem/02.png")],
    demo: "https://spill-verify-25039844.figma.site/",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/rem-for-the-moments-that-don-t-wait" },
      { label: "Live prototype", href: "https://spill-verify-25039844.figma.site/" },
      { label: "GitHub", href: "https://github.com/alinaq07/Remapp" },
      { label: "Figma", href: "https://www.figma.com/make/V2vFMYCXGmfs1IsKxHpwOs/rem" },
    ],
  },
  {
    slug: "stanfordshirt",
    title: "2029 Stanford T-Shirt",
    year: "2025",
    tag: "graphic design",
    body: [
      "I won the design competition for the Stanford class of 2029 T-shirt.",
      "This project was selected by the Stanford Alumni Association to be the official t-shirt for the class of 2029. It was featured in our class photo, as well as given to every freshman during orientation.",
    ],
    images: imgs("stanfordshirt", 1),
  },
  {
    slug: "canopycoffee",
    title: "CanopyCoffee",
    year: "2023",
    tag: "architectural design",
    body: [
      "A cafe designed from scratch in Revit for VLK Architecture",
      "Designed a coffee shop from scratch in Revit, complete space planning, construction documents, and 3D rendering. Presented final project to panel of professional architects. Shadowed architects on real-world projects, improving design skills and understanding workflows in commercial architecture environments.",
    ],
    images: imgs("canopycoffee", 1),
  },
];

// ---------- play: the non-design work (film, art, hardware, research) ----------
// detail pages stay at /work/[slug]; they list under /play and link back there
export const playProjects: Project[] = [
  {
    slug: "fashion-design",
    title: "Fashion Design",
    year: "2026",
    tag: "fashion",
    body: ["Designs that I made for Stanford FashionX Runway Show"],
    images: imgs("fashionx", 5),
  },
  {
    slug: "1525",
    title: "1525 (2025)",
    year: "2025",
    tag: "film",
    body: [
      "Recreated Albrecht Durer's 500 year old ray tracing technique",
      "1525, 2025 is a film about the past. It revisits Albrecht Durer's 1525 treatise Vnderweysung der Messung from the perspective of a contemporary student of the arts. It documents an attempt at understanding the geometric method of drawing a lute in perspective. Through the reenactment of the historical techniques, the artist seeks to deliberately look back and deeply analyze what we can learn from the past rather than looking to the future, in an era that is ever accelerating towards an unknowable technological future.",
      "The film is constructed to faithfully emulate Durer. The costumes and the apparatus were hand crafted by the artist and the final drawing is also made from scratch. The film as the final product emphasizes the importance of the process. It is remembering through the act of doing. By placing the modern student in the archaic setting, it questions what we lost, what we can learn, and what is useful to us from something that many would call obsolete. What are the benefits of understanding the antiquated? What knowledge have we lost in the pursuit of new knowledge?",
      "This project is most connected to Tiya Miles's “All That She Carried”. This work aims to preserve a specific instance of time, similarly to the sack. For this artwork, the process and the artistic practice is the object of commemoration. The viewer is invited to reflect on what they can gain from approaching processes in their lives in a slower manner rather than the modern efficiencies and conveniences that come with technology.",
    ],
    images: imgs("1525", 1),
  },
  {
    slug: "sightline",
    title: "Low-cost AR Glasses",
    year: "2024",
    tag: "hardware",
    body: [
      "SightLine is an HUD pinging system (inspired by online team video games) for first responders.",
      "Alongside Dawson Zhang and David Gong, our team's engineering goal was to develop a cost-effective and efficient pair of augmented reality (AR) glasses that delivers real-time overlays of critical information in a HUD, such as points of interest (POIs), distance/direction of POIs, and the status of equipment and personnel.",
      "SightLine’s novel ping system revolutionizes modern search and rescue operations by offering seamless real-time data transfer between first responders and support personnel. Upon implementation, SightLine will be able to:",
    ],
    list: [
      "Reduce communication barriers",
      "Improve coordination between teams",
      "Demarcate POIs such as hazards and individuals",
      "Increase overall operational efficiency through integrated heads-up display",
    ],
    images: imgs("sightline", 1),
  },
  {
    slug: "enose",
    title: "Electronic nose system",
    year: "2023",
    tag: "research",
    body: [
      "The development of artificial intelligence (AI) and electronic nose (eNose) offers a promising embedded system to replicate human olfactory functions. This project aimed to translate and join the numerical eNose signal array into a 2-dimensional image representation, thus allowing pre-trained CNN to discern the features present in odor signatures at an accuracy of over 90%.",
      "An image representation of the eNose multichannel sensor signals was successfully produced using mathematical toolkits available from Seaborn in a Jupyter Lab interface as well as in MATLAB. Transfer learning was successfully carried out using GoogLeNet, a pre-trained image classifier. The final training accuracy that the model achieved was 95.8%. The model successfully predicted unseen jasmine samples with a high prediction probability of 92.8±3.5% and oolong samples at 99.6±1.3% (95 percent confidence interval).",
      "The results of the testing dataset revealed a precision of 0.94, a recall of 1.0, and an F1-score of 0.97, indicating a highly accurate and reliable model. The data was also classified using traditional machine learning techniques such as Support Vector Machine (SVM), K-Nearest Neighbors (KNN), and Ensemble classification, which produced poor accuracies.",
    ],
    images: imgs("enose", 1),
  },
];


// ---------- galleries ----------
export const art: Pic[] = [
  pic("/work/art/737-lane-neihu.jpg"),
  pic("/work/art/from-fragments.jpg"),
  pic("/work/art/rainy-reflections.jpg"),
  ...Array.from({ length: 7 }, (_, i) => pic(`/work/art/art-0${i + 1}.jpg`)),
];

// Sketchbook spreads. `title` shows under each page and is fully editable here.
export type SketchPage = Pic & { title: string };
const sketch = (file: string, title: string): SketchPage => ({
  ...pic(`/work/sketchbook/${file}.png`),
  title,
});

export const sketchbook: SketchPage[] = [
  sketch("osaka castle", "Osaka Castle"),
  sketch("shibuya crossing", "Shibuya Crossing"),
  sketch("tokyo tower", "Tokyo Tower"),
  sketch("todai ji", "Tōdai-ji"),
  sketch("gion kyoto", "Gion, Kyoto"),
  sketch("kamakura", "Kamakura"),
  sketch("taipei", "Taipei"),
  sketch("abandoned car : taipei street", "Abandoned Car, Taipei Street"),
  sketch("stanford", "Stanford"),
];

export const photography: Pic[] = Array.from({ length: 9 }, (_, i) =>
  pic(`/work/photography/photo-0${i + 1}.jpg`)
);

// ---------- play: three categories of cards ----------
export type PlayCard = { title: string; href: string; note: string; thumb: string; reel?: string };
export const playSections: { label: string; cards: PlayCard[] }[] = [
  {
    label: "Visual Explorations",
    cards: [
      { title: "Fashion Design", href: "/work/fashion-design", note: "2026 · fashion", thumb: "/work/projects/fashionx/01.jpg" },
      { title: "1525 (2025)", href: "/work/1525", note: "2025 · film", thumb: "/work/projects/1525/01.jpg" },
      { title: "Visual Art", href: "/work/art", note: "ongoing · mixed media", thumb: "/work/art/737-lane-neihu.jpg" },
      { title: "Photography", href: "/work/photography", note: "ongoing · film + digital", thumb: "/work/photography/photo-01.jpg" },
    ],
  },
  {
    label: "Engineering",
    cards: [
      { title: "Low-cost AR Glasses", href: "/work/sightline", note: "2024 · hardware", thumb: "/work/projects/sightline/01.jpg" },
      { title: "Electronic nose system", href: "/work/enose", note: "2023 · research", thumb: "/work/projects/enose/01.jpg" },
      { title: "CultCube", href: "/play/cultcube", note: "a map of 250 films and their connections", thumb: "/play/thumbs/cultcube.jpg" },
      { title: "Hypercycles", href: "/play/hypercycles", note: "spirographs in motion", thumb: "/play/thumbs/hypercycles.jpg" },
    ],
  },
  {
    label: "Internet Artifacts",
    cards: [
      { title: "NGMI Archive", href: "https://ngmiarchive.com", note: "here's to the ngmi ones", thumb: "/play/thumbs/ngmiarchive.jpg" },
      { title: "ratestartups", href: "https://ratestartups.com", note: "who has more aura?", thumb: "/play/thumbs/ratestartups.jpg" },
    ],
  },
];

// visual art CV — rendered on /work/art
export const artCV = {
  exhibitions: [
    { year: "2023", text: "Voice and Vision, Affirmation Arts, New York City, NY" },
    { year: "2023", text: "VASE State, San Marcos, TX" },
    { year: "2024", text: "National YoungArts Exhibition, YoungArts Gallery, Miami, FL" },
    { year: "2024", text: "Monumy Digital Auction, Paris, FR" },
    { year: "2025", text: "Pearl Fincher Museum of Fine Arts, Spring, TX" },
  ],
  published: [
    { year: "2022", text: "Spring Celebrating Art Anthology" },
    { year: "2023", text: "NASA Artemis, Nasamoonsnap" },
    { year: "2023", text: "Best Teen Art, Scholastic" },
    { year: "2024", text: "YoungArts Anthology + Catalogue" },
    { year: "2025", text: "Cover Page of YoungArts Winners Journal" },
    { year: "2025", text: "Woodlands Art Council Student Art Anthology Volume 3" },
  ],
};

// oscillon also sits in the projects list; its card launches the app directly
export const oscillonRow = {
  href: "/play/oscillon",
  title: "Oscillon",
  year: "2026",
  tag: "software design",
  thumb: { src: "/play/thumbs/oscillon.jpg", w: 2560, h: 1600 } as Pic,
};

// ---------- inspiration (single full-bleed image) ----------
export const inspiration = pic("/inspiration.jpg");

// ---------- treehacks playing cards (fan on the project page) ----------
const card = (file: string, title: string) => ({
  ...pic(`/work/projects/treehacks/cards/${file}.png`),
  title,
});

export const treehacksCards = {
  back: pic("/work/projects/treehacks/cards/back.png"),
  faces: [
    card("jack-spades", "Jack of Spades"),
    card("queen-spades", "Queen of Spades"),
    card("king-spades", "King of Spades"),
    card("jack-hearts", "Jack of Hearts"),
    card("queen-hearts", "Queen of Hearts"),
    card("king-hearts", "King of Hearts"),
    card("jack-clubs", "Jack of Clubs"),
    card("queen-clubs", "Queen of Clubs"),
    card("king-clubs", "King of Clubs"),
    card("jack-diamonds", "Jack of Diamonds"),
    card("queen-diamonds", "Queen of Diamonds"),
    card("king-diamonds", "King of Diamonds"),
  ],
};

// the home page is the DESIGN portfolio: rem, oscillon (opens its app
// directly), gesturewatcher, logo drawer, then the earlier design work.
// A card plays a screen recording whenever public/work/reels/<name>.mp4
// exists (name = last segment of href) — drop a file in, it appears.
export type Row = { href: string; title: string; year: string; tag: string; thumb: Pic };
const rowOf = (p: Project): Row => ({
  href: `/work/${p.slug}`,
  title: p.title,
  year: p.year,
  tag: p.tag,
  thumb: p.images[0],
});

export const homeRows: Row[] = [
  ...projects.map(rowOf), // treehacks → canopycoffee, in array order
  oscillonRow, // launches the app
];
