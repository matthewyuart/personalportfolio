// ============================================================
// ALL site content lives in this one file.
// Case-study copy (body + study arrays) is written in Matthew's
// voice — real numbers and events only, never invent stats.
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
    { text: ". He has lectured for " },
    { text: "CS148: Introduction to Computer Graphics and Imaging", href: "https://web.stanford.edu/class/cs148/lectures.html" },
    { text: " at Stanford, and is a Figma Campus Leader this year. Through his creative work, he has reached an online audience of " },
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
  // case-study sections rendered after the intro — edit the writing here
  study?: { heading: string; body: string[] }[];
  links?: { label: string; href: string }[];
  // X post embedded in place of the hero image (video posts keep audio);
  // images[0] still supplies the home-card thumbnail
  tweet?: string;
  // home-card cover; falls back to images[0] when absent
  cover?: Pic;
  // shown in the opened card's meta grid
  stack?: string;
  // collaborators, shown as "With" in the meta grid
  team?: string;
};

const imgs = (slug: string, n: number) =>
  Array.from({ length: n }, (_, i) => pic(`/work/projects/${slug}/0${i + 1}.jpg`));

export const projects: Project[] = [
  {
    slug: "treehacks",
    title: "Treehacks Designs",
    year: "2025",
    tag: "branding design",
    stack: "Figma",
    team: "Grace Wang",
    cover: pic("/work/projects/treehacks/cover-relit.jpg"),
    body: [
      "My frosh fall, Grace Wang and I designed the entire brand for TreeHacks, Stanford's intercollegiate hackathon and one of the largest in the world, sponsored by Google, NVIDIA, Tesla, OpenAI, Perplexity, Anthropic, Asus, and Zoom.",
      "We drew basically everything a hacker touched that weekend: the key art, wallpapers and social graphics, tote bags, t-shirts, stickers, playing cards, phone wallets, PCB lanyards, venue signage, even the reserved-seat cards in the keynote hall.",
    ],
    study: [
      {
        heading: "It started with a night sky over the redwoods",
        body: [
          "The theme we landed on was a launch. A rocket climbing out of a silhouetted treeline into a sky full of stars and planets, Hoover Tower somewhere below. Once we had that image, every other decision got easier. A sticker, a stage slide, and a seat card all looked like the same universe because they all pulled from the same night sky.",
          "The logo got the same treatment. A rocket in a circular badge, redrawn until it held up at lanyard size.",
        ],
      },
      {
        heading: "Nothing survived its first draft",
        body: [
          "Our Figma pages are full of dead versions: rows of logo marks before the final one, wallpaper colorways side by side, five tote illustrations before the one that got printed, a full grid of sticker color tests. We pinned every version next to the last one so we could tell if it was getting better or just different.",
          "The playing cards took the longest. Twelve court cards, each jack, queen, and king its own illustration, plus a custom back. And you can't patch a printed deck. Once the card stock is ordered, that's it.",
        ],
      },
      {
        heading: "The merch had to outlive the weekend",
        body: [
          "The bar for every physical piece: would someone still use this after Sunday? A tote you actually carry to class, a deck you actually play with, stickers that end up on water bottles, phone wallets, and PCB lanyards that double as a hardware badge. Branding an event this size mostly means making a hundred small objects that keep advertising it months later.",
        ],
      },
      {
        heading: "Then the weekend arrived",
        body: [
          "Our track signage lined the entrance and the check-in tables ran under our balloons. At some point after midnight, a humanoid robot was fencing hackers with lightsabers in front of the building. The brand had to hold up in print, projection, daylight, and stage lighting, and it did.",
        ],
      },
      {
        heading: "Sam Altman spoke in front of our slide",
        body: [
          "The keynote was Sam Altman, interviewed on stage with our key art projected behind him. Same rocket and night sky from the stickers, scaled up to auditorium size. The reserved seats down front had our seat cards printed on them, one for Sam Altman, one for Garry Tan. He sat in a chair with our design on it. That was a weird thing to see.",
        ],
      },
      {
        heading: "Thank you, Rachel, Hannah, and Thijs",
        body: [
          "TreeHacks only happens because a small team spends a year making it happen. Rachel, Hannah, and Thijs, the co-directors my year, trusted two freshmen with the entire visual identity of the event and backed every weird idea we brought them. This project was as fun as it looks because of them.",
        ],
      },
    ],
    images: [
      pic("/work/projects/treehacks/01.jpg"),
      pic("/work/projects/treehacks/02.jpg"),
      pic("/work/projects/treehacks/03.jpg"),
      pic("/work/projects/treehacks/04.jpg"),
      pic("/work/projects/treehacks/tote.jpg"),
      pic("/work/projects/treehacks/signs.jpg"),
      pic("/work/projects/treehacks/keynote.jpg"),
      pic("/work/projects/treehacks/seats.jpg"),
      pic("/work/projects/treehacks/robot.jpg"),
      pic("/work/projects/treehacks/checkin.jpg"),
    ],
  },
  {
    slug: "ratestartups",
    title: "ratestartups.com",
    year: "2026",
    tag: "full-stack / systems design",
    stack: "Next.js · Supabase · Drizzle · Vercel",
    team: "Justin Huang",
    cover: pic("/work/projects/ratestartups/cover-2.jpg"),
    body: [
      "ratestartups is a head-to-head voting game for tech. Two companies, one question: who has more aura? Every vote feeds a live Elo leaderboard. There's no signup and nothing to solve; you land on the page and you're already playing.",
      "It went viral on its first weekend: over 1M edge requests and 117,000 votes in 72 hours, with no downtime.",
    ],
    study: [
      {
        heading: "What I woke up to on August 6",
        body: [
          "I checked the Vercel dashboard one morning and the traffic graph didn't look like a graph anymore. 423,629 requests in a single day, a vertical line where the usual flat one had been. No launch post, no announcement. People were just sharing it.",
          "That was the point, but it was still strange to watch. The game is built to spread: per-company share cards, embeddable live rank badges, voter taste profiles. Every hot take about the leaderboard comes with a link back.",
        ],
      },
      {
        heading: "Strangers were arguing about the leaderboard",
        body: [
          "Other people's screenshots were the giveaway. One tweet of the board, \"Tech companies rated by aura\", pulled 330.9K views on its own. The rankings became the content. People posted the board to complain, the complaints brought more voters, and the new votes changed the rankings again.",
        ],
      },
      {
        heading: "The traffic was the easy part",
        body: [
          "Over the peak 72 hours the site served more than a million edge requests and processed 117,000 votes with no downtime. The matchup endpoint alone absorbed hundreds of thousands of calls. Most of what made that survivable was decided before launch. The server deals every matchup, the next pair prefetches while you're still deciding, and everything cacheable lives at the edge. The cards swap instantly because the work happened before you clicked.",
        ],
      },
      {
        heading: "The real problem was manipulation",
        body: [
          "Popularity brought vote farming. Within a day someone was pushing a company to #1 with dozens of throwaway sessions from a single network. Catching it, reversing it, and making it unprofitable turned into the real design problem. Honestly the more interesting half of the project.",
          "The defense is layered, and it's silent on purpose. An attacker never sees an error; their votes just stop moving the board. Cloudflare Turnstile runs once per identity. During the spike it issued 10.77k challenges and passed the 71.89% of traffic it judged human, and almost nobody ever saw a checkbox. Behind that, bot detection and per-network sybil damping weigh every session, and votes are reputation-weighted. Hidden trial rounds void a bot's run before it ever touches the rankings.",
          "Underneath all of it, votes are an append-only ledger. If I find manipulation after the fact, I void it and replay the entire leaderboard from scratch. The rankings are always reconstructible. Two live incidents got caught, reversed, and patched this way without losing a single legitimate vote.",
        ],
      },
      {
        heading: "Every matchup is dealt exactly once",
        body: [
          "Matchups are dealt by the server and are single-use, so you can't replay a pair to farm it. Ratings move on Elo with provisional K-factors: new companies find their level fast, settled ones stay put. Three boards run in parallel: startups, venture firms, and a secret fruit poll.",
        ],
      },
      {
        heading: "The interface stays out of the way on purpose",
        body: [
          "Two cards, one question, nothing else on screen. Every system that keeps the board honest is invisible unless you go looking for it.",
          "Next.js, Postgres on Supabase, Drizzle, deployed on Vercel. Around 90 tests, CI on every push, and a nightly integrity cron that re-checks the ledger.",
        ],
      },
    ],
    images: [
      pic("/work/projects/ratestartups/01.jpg"),
      pic("/work/projects/ratestartups/02.jpg"),
      pic("/work/projects/ratestartups/wokeup.png"),
      pic("/work/projects/ratestartups/tweet.png"),
      pic("/work/projects/ratestartups/routes.png"),
      pic("/work/projects/ratestartups/turnstile.jpg"),
      pic("/work/projects/ratestartups/04.jpg"),
    ],
    links: [
      { label: "Live site", href: "https://ratestartups.com" },
    ],
  },
  {
    slug: "gesturewatcher",
    title: "GestureWatcher",
    year: "2026",
    tag: "interaction design",
    stack: "Vite · React 19 · TypeScript · MediaPipe",
    tweet: "https://twitter.com/matthewyuart/status/2087710669315706908",
    body: [
      "hts_01 is a synthesizer you play with your hands. Right hand plays melody, left hand plays chords, and an 8-bit drum machine keeps time. All of it runs from a webcam, entirely in the browser; the video never leaves your machine.",
      "Hand tracking stopped being exotic a while ago. MediaPipe runs 21 landmarks per hand at frame rate in a browser tab. What hasn't arrived is a reason to use it. Almost every hand-tracking demo is the same demo: you wave, a cursor moves, you poke a button, you close the tab. A mouse has detents, friction, and a surface. A hand in the air has none of them. The hard part isn't detecting a pinch; it's designing controls for a surface that doesn't exist.",
    ],
    study: [
      {
        heading: "I started with three demos and deleted all three",
        body: [
          "The first version was a gesture playground: a layout builder, a node-graph editor, and an Iron-Man-style HUD. It looked great in a screenshot. I played with it for a few minutes and deleted all three. Every one was the same interaction with a different skin: point your hand at a button and pinch. A mouse does that better, and nothing got more interesting the second time.",
          "An instrument was the right target because instruments assume you'll be bad at first. It's allowed to take practice.",
        ],
      },
      {
        heading: "Each dead end died of something specific",
        body: [
          "Vertical pitch sliders went first. Pitch on the Y axis meant holding an unsupported arm up in front of your face to play high notes. They became a horizontal ruler along the top that your hand reads like a keyboard.",
          "Pitch bend on sideways drift died the first time I played it seriously, because I couldn't tell whether I was out of tune or the app was. I deleted bend entirely and adopted a rule: the note on screen is exactly the note you hear. An instrument that can lie to you is worse than one that does less.",
          "The frosted-glass panels cost me more than anything else in the project: 25 of my 42 commits mention the glass. A drop-in library assumed Tailwind and painted ghost boxes over the UI. An SVG-filter approach died when the CSS minifier silently stripped it in production. What stuck is a 4-pass WebGL renderer: refraction, dispersion, fresnel, glare. To tune it I built a standalone glass lab with every parameter on a slider, because the app was the wrong place to judge a material.",
          "And one five-minute revert. MediaPipe's docs say the handedness labels assume a mirrored image, so I swapped them and felt clever. Then I raised my hands and melody was on the left. The docs were right about the API and wrong about my setup.",
        ],
      },
      {
        heading: "The hardest control to design has no surface at all",
        body: [
          "The main control: your left wrist angle sweeps the filter. Rotate your hand and the sound opens up. The naive version is one line of math, and it's unusable. Every problem with it comes from the hand floating in the air.",
          "There is no \"off\"; your hand is always at some angle. So straight up became a true neutral, with a deadzone where the sound sits exactly where the knob left it. The knob and the hand fight over one value, so the knob sets a base and your hand modulates around it. Wrist roll also turns knobs, so tilt re-arms only after passing back through neutral; whichever interaction consumes the signal owns it. And a hand hanging at rest sits exactly where the sign flips, so past 150° reads as a resting posture, not a playing one.",
          "One bug only showed up because I measured it. I'd smoothed the tilt with a rolling average, which is standard practice, but the gesture loop skips frames when a hand holds still, so a held 60° tilt settled at 0.216 instead of 0.770. Smoothing had to move out of the gesture layer and into the audio engine.",
        ],
      },
      {
        heading: "Four gestures carry the whole instrument",
        body: [
          "Chords live on your fingertips: touch thumb to index, middle, ring, or pinky for chord slots 1–4, with a floating staff card showing the actual notes. Melody is a keyboard drawn in the air: three fingers, three ways to play, with hand position along the top ruler picking the pitch. Chord voicings are editable per note on a two-octave keyboard, and the chord names itself back to you.",
          "Everything is also a mouse. Every control works with a pointer, which is how the app stays testable and how anyone without a camera can still play it.",
          "Raw landmarks jitter, so every cursor runs through One-Euro filtering, and pinch detection uses hysteresis so a drag never flickers apart mid-screen. Vite, React 19, TypeScript, @mediapipe/tasks-vision. Zero backend.",
        ],
      },
      {
        heading: "What I'd carry into any product",
        body: [
          "In gesture UI, test with your body, not the docs. Five seconds of raising my hands caught what re-reading never would have.",
          "A control that can lie is worse than a control that can't move. Pitch bend was expressive, but I stopped trusting the notes, so it went. And continuous input needs arbitration, not modes: when one signal serves two purposes, whichever interaction consumes it owns it. Nothing to toggle, nothing to remember.",
        ],
      },
    ],
    images: [
      pic("/work/projects/gesturewatcher/hero.jpg"),
      pic("/work/projects/gesturewatcher/02.jpg"),
      pic("/work/projects/gesturewatcher/hands.jpg"),
    ],
    links: [
      { label: "Live app", href: "https://gesturewatcher.vercel.app" },
      { label: "GitHub", href: "https://github.com/matthewyuart/gesturewatcher" },
    ],
  },
  {
    slug: "rem",
    title: "rem: figbuild 2026",
    year: "2026",
    tag: "speculative tool design",
    stack: "Figma Design · Figma Make · Figma Slides",
    team: "Alina Qian, Grace Wang, Tiffany Zhang",
    cover: pic("/work/projects/rem/cover.jpg"),
    body: [
      "rem is a speculative tool we designed at FigBuild 2026, built for people tired of missing their own lives. It's a smart contact lens that reads your body's signals (pupil dilation, gaze duration) and passively captures the moments it recognizes as emotionally meaningful, paired with an app that keeps them. You live, and rem keeps up.",
      "We used Figma Design to ideate and build the brand, Figma Make for the working prototype, and Figma Slides for the final presentation.",
    ],
    study: [
      {
        heading: "Taking a photo makes you remember it worse",
        body: [
          "We started from a well-documented effect: photographing something impairs your memory of it. Your brain outsources the remembering to the device and stops encoding the experience itself, which researchers call transactive memory. The studies we pinned to the wall put numbers on it: 91% of people rely on digital devices as an extension of their memory, and 78% of 13-to-17-year-olds check their phone at least hourly.",
          "So if the camera is making memory worse, what would a camera that asks nothing of you look like? Our framing for the weekend: how might we help people become more present by detecting moments of emotional significance as they happen?",
        ],
      },
      {
        heading: "We designed for three people we already knew",
        body: [
          "Jason, a college sophomore whose weeks pass in a blur and whose camera roll is full of photos with no emotional weight. Rebecca, 24, new to the workforce and to New York, missing her family through days that feel identical. Audrey, 22, an artist who never thinks to document quiet studio nights, then months later realizes those were the moments she misses most.",
          "All three needed the same thing: a way to keep what matters without stopping to capture it.",
        ],
      },
      {
        heading: "The lens reads your body, not the scene",
        body: [
          "rem is two devices. The lens watches for the physical signs that a moment matters: pupil dilation, prolonged gaze, laughter, noise spikes, changes in movement. It starts recording before you'd even think to reach for a phone. Onboarding is a calibration. The app asks you to look at a bright light, then at an object that matters to you, and tunes detection to your own biometrics.",
          "Every trigger is customizable from the app: sensitivity, recording preferences, and which signals you don't want tracked at all.",
        ],
      },
      {
        heading: "The app is a time capsule, not a camera roll",
        body: [
          "Captured moments live as floating orbs you scroll through by day, month, and year, each replayable with a tap. Over time rem finds the patterns: for Jason, that his most meaningful memories come from unplanned late-night conversations; for Audrey, that the process of creating is where she feels most fulfilled. That pattern is the actual product.",
        ],
      },
      {
        heading: "Privacy was the hardest wall",
        body: [
          "A device that records passively is uncomfortable, and we didn't want to trade privacy for novelty. So the safeguards are real features. Lenses pair one-to-one on biometrics, so only you can ever access your own footage. Recording pauses any time you want, privacy modes and per-trigger opt-outs live one tap deep, and faces in the background stay blurred. The lens also announces itself: a visual cue for others, plus two light haptic taps, almost like a small exhale, telling you it has started recording.",
          "We spent real time on where the product's responsibility ends and the user's begins. There's a liability page in the deck, and we didn't bury it.",
        ],
      },
      {
        heading: "The philosophy survived the weekend intact",
        body: [
          "What we're most proud of: from the first sketch to the final prototype, rem never asks anything of you in the moment. It's built around chronoception, the perception of time passing, a feeling most people have but can't name. And it takes that feeling seriously instead of gamifying it. It's a tool for a generation raised on social media and emerging AI, designed to hand the remembering back.",
        ],
      },
    ],
    images: [
      pic("/work/projects/rem/01.png"),
      pic("/work/projects/rem/02.png"),
      pic("/work/projects/rem/slide-06.jpg"),
      pic("/work/projects/rem/slide-09.jpg"),
      pic("/work/projects/rem/slide-24.jpg"),
      pic("/work/projects/rem/slide-29.jpg"),
      pic("/work/projects/rem/slide-37.jpg"),
      pic("/work/projects/rem/slide-42.jpg"),
    ],
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
    cover: pic("/work/projects/stanfordshirt/cover-2.jpg"),
    body: [
      "I won the design competition for the Stanford class of 2029 T-shirt.",
      "This project was selected by the Stanford Alumni Association to be the official t-shirt for the class of 2029. It was featured in our class photo, as well as given to every freshman during orientation.",
    ],
    images: imgs("stanfordshirt", 1),
  },
  {
    slug: "canopycoffee",
    title: "CanopyCoffee",
    year: "2024",
    tag: "architectural design",
    stack: "Revit",
    body: [
      "A coffee shop designed from scratch during my internship with VLK Architects: the full arc of a real commercial project compressed into one building. Site analysis, precedent research, concept sketches, schematic design in Revit, construction documents, and final renders, presented at the end to a panel of practicing architects.",
      "Alongside the design work I shadowed VLK's architects on active projects, which is where most of the workflow below actually came from.",
    ],
    study: [
      {
        heading: "In Texas, the sun makes the first decisions",
        body: [
          "Before any sketching I mapped the site: an aerial of the lot, the surrounding roads, and a sun-path study to work out where the light and heat would come from across the day. You can't ignore the sun in Texas. It decides where glass can go, where the patio survives summer, and which way the roof throws its shade.",
        ],
      },
      {
        heading: "The precedents were all about opening the box",
        body: [
          "The cafes I kept coming back to shared four moves: open outdoor seating, hole-cut roofs that let trees grow through, natural lighting, and glass exteriors. That became my brief: a coffee shop that reads as a canopy instead of a box, indoors and outdoors under one roof plane. It's also where the name comes from.",
        ],
      },
      {
        heading: "It started as a bubble diagram in a notebook",
        body: [
          "The first drawings are barely drawings: a bubble diagram sorting storage, kitchen, coffee bar, and pantry into rough adjacencies. Then three quick concept sketches testing how a long shed roof could stretch over both the interior and the patio. The tree came early, a real tree growing through a cut in the roof deck, and I kept it through every version.",
        ],
      },
      {
        heading: "Then it had to survive Revit",
        body: [
          "Schematic design is where the sketch gets real dimensions. I modeled the building in Revit: floor plans with real millwork and seating, a furniture plan, roof plan, and elevations from all four sides. The loose sketch lines turned into a colonnade grid, and the curved coffee bar became the thing the whole interior wraps around.",
        ],
      },
      {
        heading: "Then came the construction documents",
        body: [
          "The least glamorous part taught me the most: dimensioned plans, building sections, and detail sheets on VLK's title block. Drawing a section through your own building keeps you honest. The roof needs a structure, the bar needs clearances, and every line has to mean something a contractor could build.",
        ],
      },
      {
        heading: "Then I rendered it like it already existed",
        body: [
          "The final renders put you in the building: pulling into the parking lot at dusk, sitting under the pergola with the tree overhead, standing at the counter in the afternoon light. I presented the full set to a panel of professional architects at VLK, from site analysis through construction documents to the renders. There's a video walkthrough linked above.",
        ],
      },
    ],
    images: [
      pic("/work/projects/canopycoffee/01.jpg"),
      pic("/work/projects/canopycoffee/p25.jpg"),
      pic("/work/projects/canopycoffee/p03.jpg"),
      pic("/work/projects/canopycoffee/p04.jpg"),
      pic("/work/projects/canopycoffee/p06.jpg"),
      pic("/work/projects/canopycoffee/p09.jpg"),
      pic("/work/projects/canopycoffee/p13.jpg"),
      pic("/work/projects/canopycoffee/p17.jpg"),
      pic("/work/projects/canopycoffee/p19.jpg"),
      pic("/work/projects/canopycoffee/p22.jpg"),
    ],
    links: [
      { label: "Video walkthrough", href: "https://youtu.be/DuKw38ZW7Vk" },
    ],
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
export type PlayCard = { title: string; href: string; note: string; thumb: Pic; reel?: string };
export const playSections: { label: string; cards: PlayCard[] }[] = [
  {
    label: "Visual Explorations",
    cards: [
      { title: "Fashion Design", href: "/work/fashion-design", note: "2026 · fashion", thumb: pic("/work/fashionx/fashionx-03.jpg") },
      { title: "1525 (2025)", href: "/work/1525", note: "2025 · film", thumb: pic("/work/projects/1525/01.jpg") },
      { title: "Visual Art", href: "/work/art", note: "ongoing · mixed media", thumb: pic("/work/art/rainy-reflections.jpg") },
      { title: "Photography", href: "/work/photography", note: "ongoing · film + digital", thumb: pic("/work/photography/photo-01.jpg") },
    ],
  },
  {
    label: "Engineering",
    cards: [
      { title: "Low-cost AR Glasses", href: "/work/sightline", note: "2024 · hardware", thumb: pic("/work/projects/sightline/01.jpg") },
      { title: "Electronic nose system", href: "/work/enose", note: "2023 · research", thumb: pic("/work/projects/enose/01.jpg") },
      { title: "CultCube", href: "/play/cultcube", note: "a map of 250 films and their connections", thumb: pic("/play/thumbs/cultcube.jpg") },
      { title: "Hypercycles", href: "/play/hypercycles", note: "spirographs in motion", thumb: pic("/play/thumbs/hypercycles.jpg") },
    ],
  },
  {
    label: "Internet Artifacts",
    cards: [
      { title: "NGMI Archive", href: "https://ngmiarchive.com", note: "here's to the ngmi ones", thumb: pic("/play/thumbs/ngmiarchive.jpg") },
      { title: "ratestartups", href: "https://ratestartups.com", note: "who has more aura?", thumb: pic("/play/thumbs/ratestartups.jpg") },
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
  thumb: { src: "/play/thumbs/oscillon-2.jpg", w: 1536, h: 960 } as Pic,
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
export type Row = { href: string; title: string; year: string; tag: string; thumb: Pic; aspect?: number };
const rowOf = (slug: string, aspect?: number): Row => {
  const p = projects.find((x) => x.slug === slug)!;
  return {
    href: `/work/${p.slug}`,
    title: p.title,
    year: p.year,
    tag: p.tag,
    thumb: p.cover ?? p.images[0],
    aspect,
  };
};

// order matches Matthew's reference layout: two staggered columns,
// consistent width, height varies per tile. First four fill the left
// column, the rest the right. `aspect` overrides a tile's crop.
export const homeRows: Row[] = [
  rowOf("gesturewatcher", 2.0),
  rowOf("ratestartups", 2.0),
  rowOf("treehacks", 2.0),
  rowOf("canopycoffee"),
  rowOf("stanfordshirt"),
  rowOf("rem"),
  { ...oscillonRow, aspect: 1.6 }, // launches the app
];
