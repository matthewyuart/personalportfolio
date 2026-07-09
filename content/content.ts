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
  footer: "© Matthew Yu",
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
  // paragraph segments; segments with href render as bolded links
  bio: [
    { text: "Matthew Yu is currently an engineering student at Stanford. His work spans technology, design, and storytelling, and he combines these skills to create projects and media that have been featured by " },
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
};

const imgs = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => pic(`/work/projects/${slug}/0${i + 1}.jpg`));

export const projects: Project[] = [
  {
    slug: "fashion-design",
    title: "Fashion Design",
    year: "2026",
    tag: "fashion",
    body: ["Designs that I made for Stanford FashionX Runway Show"],
    images: imgs("fashionx", 5),
  },
  {
    slug: "treehacks",
    title: "Treehacks Designs",
    year: "2025",
    tag: "branding",
    body: [
      "During my frosh fall, I designed an extensive collection of custom merchandise and online advertisements for one of the largest Hackathons in the world: Treehacks at Stanford University.",
      "I was a designer alongside Grace Wang for Stanford's largest intercollegiate Hackathon sponsored by Google, NVIDIA, Tesla, OpenAI, Perplexity, Anthropic, Asus, Zoom etc. We created the entire branding of the event, making merch such as custom tote bags, stickers, t-shirts, playing cards, phone wallets, and PCB lanyards.",
    ],
    images: imgs("treehacks", 7),
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
    slug: "canopycoffee",
    title: "CanopyCoffee",
    year: "2023",
    tag: "architecture",
    body: [
      "A cafe designed from scratch in Revit for VLK Architecture",
      "Designed a coffee shop from scratch in Revit, complete space planning, construction documents, and 3D rendering. Presented final project to panel of professional architects. Shadowed architects on real-world projects, improving design skills and understanding workflows in commercial architecture environments.",
    ],
    images: imgs("canopycoffee", 1),
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

// ---------- play ----------
export const experiments = [
  { title: "Oscillon", href: "/play/oscillon", note: "electron-beam patterns, pure math", thumb: "/play/thumbs/oscillon.png" },
  { title: "Hypercycles", href: "/play/hypercycles", note: "spirographs in motion", thumb: "/play/thumbs/hypercycles.png" },
  { title: "CultCube", href: "/play/cultcube", note: "a map of 250 films and their connections", thumb: "/play/thumbs/cultcube.png" },
];

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

// art & photography live in the projects list as ongoing categories
export const galleryRows = [
  { slug: "art", title: "Art", year: "ongoing", tag: "mixed media", thumb: art[0] },
  { slug: "photography", title: "Photography", year: "ongoing", tag: "film + digital", thumb: photography[0] },
];

// sections the "work" dropdown jumps to
export const sections = [
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
];
