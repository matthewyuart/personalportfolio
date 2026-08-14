# HANDOFF — matthewyu.dev

Design portfolio for Matthew Yu (Stanford '29 — designer / engineer / artist).
**LIVE at https://matthewyu.dev** · Vercel project `matthewyu-dev` · repo
`github.com/matthewyuart/personalportfolio` (public). This file supersedes
HANDOFF2.md.

Last state: commit after the "wide measure" pass — 2-up project grid + footer
on a shared 1080px line, Michelle-style footer, guideline (Emil/M3/HIG) pass.

---

## 1. WHAT THE SITE IS

**Stack:** Next.js 15 App Router · React 19 · TypeScript · one stylesheet
(`app/globals.css`) · self-hosted Futura (`app/fonts/futura-*.ttf`) · zero
CSS frameworks · fully static (19 routes).

**Routes**
- `/` — hero sketchbook + 2-up project grid + footer. **The home page IS
  `app/(home)/layout.tsx`** (Michelle Liu's pattern): project pages render as
  `children` OVER it, so home never unmounts.
- `/work/[slug]` — case-study **cards** over the blurred home (`(home)/work/[slug]`).
  X / Esc / backdrop-click close; expand button = full screen. Direct loads
  render home underneath.
- `/work/art`, `/work/photography` — gallery pages (masonry / polaroid stack).
  Art page carries the Exhibitions + Published CV lists.
- `/play` — three categories: Visual Explorations, Engineering, Internet
  Artifacts. Cards on the same 2-up wide measure as home.
- `/about` — bio + headshot. `/inspiration` — dark page, cursor spotlight.
- `/play/{oscillon,hypercycles,cultcube}` — static apps in `public/play/*`.

**Layout system**
- Text column: `.page` max-width 980px.
- **Wide measure `--wide`: min(1080px, viewport − gutters)** — the project
  grid, play grids, their section labels, and the footer all share it.
- Radius scale: 8 / 12 / 16 / 24 (+999 pills). Exceptions on purpose:
  polaroid 1px, sketchbook shadow 18px (physical props).
- Spacing: 4px scale in `--s-1..9`. Tracking: `--track-caps/nav/display`.
- Motion: `--ease-out-strong: cubic-bezier(0.23,1,0.32,1)` for entrances;
  press states scale 0.92–0.98 @160ms; hovers that move things are gated
  behind `(hover:hover) and (pointer:fine)`.

---

## 2. CONTENT — WHERE MATTHEW EDITS

**Everything lives in `content/content.ts`.**
- `projects[]` — the work list. Per project: `title, year, tag ("__ design")`,
  `body[]` (intro paragraphs), **`study[]` (case-study sections: {heading,
  body[]})**, `images[]` (first = hero, then one image between each section),
  `links[]`, optional `list[]`.
- `playSections[]` — the three play categories (cards may carry a `reel`).
- `artCV` — Exhibitions/Published lists on the art page.
- `about.bio` — segments; ones with `href` render as links.
- `site.footer` — the © line.

**Copy rules:** project descriptions are verbatim (Devpost/READMEs/Matthew's
own blurbs). New writing follows the anti-slop guide
(github.com/jalaalrd/anti-ai-slop-writing) in Matthew's voice — concrete,
varied sentence length, no invented numbers.

**Screen recordings are drop-in:** put `public/work/reels/<slug>.mp4` and the
matching home card plays it automatically (name = last URL segment; the map
is computed at build time in `(home)/layout.tsx`). Encode heavy sources:
`ffmpeg -i in.mov -an -vf "scale=960:-2,fps=30" -c:v libx264 -preset slow
-crf 27 -pix_fmt yuv420p -movflags +faststart out.mp4`. Raw originals get
archived to `~/Movies`. `<Reel>` pauses on the poster for reduced motion.

**Images:** drop into `public/work/...`, then regenerate `content/dims.json`
(sips loop — see git history of any "dims" commit). `pic("/path")` wires
dimensions in.

---

## 3. THE SKETCHBOOK (canonical — handle with care)

Memory note `sketchbook-flip-canonical` governs. Desktop flip render tree is
FROZEN: idle `.sb-full` ⇄ two fading halves + 3D flap, instant commit.
- Desktop: riffle intro (once per session — `sessionStorage sb-intro-done`),
  q75 images.
- Mobile (`max-width:640px` or coarse pointer): no riffle, q50 variants, all
  9 spreads stacked with visibility toggling (never src swaps — Safari
  flashes stale bitmaps), `decoding="sync"` on flip layers.
- Arrow keys page the book. Tap zones split 50/50 at the spine.
- After ANY Sketchbook edit, verify desktop DOM behavior is unchanged.

---

## 4. THE PROJECT CARD (modal) ARCHITECTURE

- `components/ProjectModal.tsx` — frame (`.pmodal-frame`) owns size +
  entrance (`@starting-style`, no JS timing); `.pmodal-card` is the rounded
  clipper (`overflow:hidden`); `.pmodal-scroll` inside it scrolls (this is
  what keeps the scrollbar inside the rounded corners — a scroller's own
  scrollbar ignores border-radius). Controls sit on the frame at 14px/14px,
  z-100 (above the treehacks fan viewer at 50).
- `components/ProjectArticle.tsx` — title, Year/Type/Links meta columns,
  hero figure, then sections split label-left/text-right with images
  threaded between; leftovers pool in a grid.
- Scroll is vertical-only with hard stops (`overscroll-behavior:none`).
- Fullscreen is a CSS class toggle; it animates (padding+width+radius) and
  respects safe-area insets.

Known gotchas discovered the hard way (don't re-learn these):
- `position: sticky` cannot be pulled above its containing block — negative
  margin-top gets silently clamped.
- The Browser-pane dev tool reports 0×0 viewports and freezes rAF/transitions
  when hidden: set an explicit viewport size before trusting any geometry,
  and verify visually via screenshots (they force a frame).

---

## 5. DEPLOY WORKFLOW (memory `deploy-workflow` governs)

- **Never push or prod-deploy without Matthew's explicit go-ahead.**
- Stage work: commit locally → `npx vercel deploy` (preview URL, behind his
  Vercel SSO) → he reviews → he says "push".
- `git push origin main` auto-builds prod. **Verify prod content actually
  changed after ~1–2 min** (fetch the page + grep the built CSS/HTML for the
  new rules — don't trust class names that existed before). If the domain
  doesn't move, it's pinned: `npx vercel promote <deployment-url> --yes`.
- To ship a prod commit while local-only work sits dirty in the tree:
  `git worktree add <tmp> <sha>`, copy `.vercel/` in, deploy from there.
- Matthew can self-serve copy edits: `git add -A && git commit -m "copy
  edits" && git push`.

Related deployments (each its own auto-deploying Vercel project):
gesturewatcher, startup-logos (Logo Drawer, currently off the site),
ratestartups.com, resonance (`resonance-chi-lilac.vercel.app`, pulled from
the site until it ships), takehome-freeroam + freeroam-mockups (removed from
site), hypercycles, plus `public/play/*` bundles served by this repo.
ratestartups has Vercel bot protection — headless recorders get challenged;
never bypass it (Matthew records that one himself).

---

## 6. GUIDELINE BASELINE (don't regress)

Audited + fixed against Emil Kowalski's skills repo, Material 3, Apple HIG:
- Press feedback on all pressables; no ungated transform hovers; entrances
  on `--ease-out-strong`; nothing enters below scale(0.92).
- Reduced motion = gentler not zero (0.2s route fade stays; reels pause).
- Mobile header: 28px visual icons with invisible ::after hit areas → 44px
  class. Safe-area insets on header + fullscreen card.
- AA contrast: `--ink-soft` = 0.68 alpha (5.5:1). Focus rings + skip link.
- Known accepted deviations: sketchbook flip 850ms (hero delight), card flip
  0.65s (playful), polaroid/book-shadow radii (physical props).

---

## 7. STATE AT HANDOFF

- Local HEAD includes (unpushed at time of writing — check `git status -sb`):
  Michelle-style footer everywhere, the guideline pass, nav order
  work/play/about/inspiration, 2-up grids + footer on the shared wide
  measure. Everything before that is live.
- `HANDOFF2.md` is historical; this file is current.
- Loose ends Matthew may pick up: case-study text passes in his own words
  (body/study arrays), a real reel for ratestartups' card if he wants motion
  there, resonance returns to work+play when it ships, OG image for social
  shares (still missing!), 1525 film embed.
