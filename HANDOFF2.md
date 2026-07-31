# HANDOFF2 — matthewyu.dev (Living Portfolio)

Personal portfolio for Matthew Yu (Stanford '29 — designer / engineer / artist).
**LIVE on matthewyu.dev** via Vercel. Completely redesigned from the first handoff;
focuses on the sketchbook as the hero element with extensive mobile optimization.

Latest commit: `6d0f55c` — Mobile base: stacked spreads with visibility toggle (kills double-tap flash)

---

## 1. CURRENT STATE & ARCHITECTURE

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · CSS 3D transforms ·
self-hosted Futura · one global stylesheet. Static generation (15 routes). ~130KB
total payload on mobile (all 9 sketchbook spreads at q50).

**Routes**
- `/` — full-page hero with sketchbook flip, about (bio + headshot), projects list + art/photography as "ongoing" rows
- `/work/[slug]` — 7 project details + `/work/art` + `/work/photography` (galleries)
- `/play/{oscillon,hypercycles,cultcube}` — standalone experiments (static in public/)
- `/inspiration` — single full-bleed image with cursor spotlight effect (dark mode)

**Key Components**
- `components/Sketchbook.tsx` — **3D page-turn hero**. Desktop: riffle intro → Taipei, two fading static halves + rotating flap (true 3D rotateY), q75 images. Mobile: opens directly on Taipei (no riffle), all 9 spreads stacked + decoded under flip layers, page changes toggle CSS visibility (zero src swaps, no flash possible). Hardcoded mobile detection: `(max-width: 640px), (pointer: coarse)`.
- `components/CardFan.tsx` — Treehacks playing cards in a parabolic fan; click to lift and flip (true 3D), click outside to return.
- `components/PolaroidStack.tsx` — Photography: collapsed stack → expanded scroll-snap gallery with center-weighting scale.
- `components/HeroDown.tsx` — Breathing double-chevron scroll cue (fades 15%↔75% on 2.6s loop) + smooth scroll to #about.
- `components/Spotlight.tsx` — Inspiration page cursor spotlight (260px radius, 0.55 opacity darken, fades in 1.1s).
- `content/content.ts` — **single source of truth**: site.name, about.bio w/ inline bold links, 7 projects, art/photography/sketchbook galleries, treehacks cards, experiments, socials, footer.
- `content/dims.json` — exact `[w,h]` for every image (auto-generated).

**Design System** (`app/globals.css`)
- Palette: `--paper #e6e9ed` (cool light gray), `--ink #1d1f22`, `--ink-soft` (55% opacity).
- Type: Futura 300 (display) / 400 (body). Letter-spacing tokens: `--track-caps` (0.24em), `--track-nav` (0.12em), `--track-display` (0.05em).
- 3D perspective: `perspective: 2600px` on `.sb-book`, `preserve-3d` on flip layers, `backface-visibility: hidden` on faces.
- Mobile base stack: all 9 spreads `position: absolute` stacked, current one visible via CSS `visibility: visible`.

**Build & Deployment**
- `npm run build` → 15 static pages, ~1.9s compile time.
- Vercel free tier, auto-deploys from main branch (set in dashboard).
- DNS: `matthewyu.dev` live (user owns domain).

---

## 2. THE SKETCHBOOK STORY (Core Feature)

**Desktop (Canonical Rendering)**
- Opens on Taipei spread via auto-riffle (plays through all 9 pages, bell-curve speed, lands home).
- Click arrows or tap zones (left 50% = back, right 50% = forward) to flip.
- Each page turn: two static fading halves (old one fades out 0.22s starting at 0.6s of turn, new one fades in beneath), plus a 3D rotating flap (`rotateY(0° → ±180°)`) that reveals the next page's half. No persistent base — the base unmounts during flips.
- Riffle interrupts smoothly: a second tap mid-turn lands the current flip, then starts a new one from there.
- Images: full-quality PNG (transparency needed), q75 equivalent via next/image.

**Mobile Path (Separate, Optimized)**
- Opens directly on Taipei (no riffle — spreads may not be decoded yet on cellular, would blank-flip).
- All 9 spreads pre-mounted in a stacked invisible base under the flip layers.
- Page changes toggle visibility only — **zero src swaps**, so Safari can never flash a stale bitmap.
- Synchronous image decoding (`decoding="sync"`) on flip layers (enforces same-frame repaint on src reassigns, though visibility toggle doesn't need it).
- Images: q50 (half-quality), ~132KB for the entire book.
- Flips are interruptible: two-phase commit (landed flip layers hold 90ms while base visibility swaps beneath, then layers unmount).

**Mobile Pain Points (Solved)**
1. Riffle with unloaded images → blank pages: fixed by skipping riffle entirely.
2. Double-tap flashing old page: root cause was Safari's async srcset repaint. Solved by removing src swaps — visibility toggle is a pure CSS layer op, so no decode latency exists.
3. 25MB memory for 9 spread copies: acceptable trade (paint reliability > memory on mobile).

---

## 3. WHAT'S WORKING GREAT

✓ **Desktop flip** — soft, elegant, no clipping, responsive to rapid taps.
✓ **Mobile optimization** — no flash on double-tap, ~130KB total payload.
✓ **Image handling** — next/image + dims.json keeps everything sharp + no layout shift.
✓ **Design polish** — Futura, cool gray, lots of air, headshot centered on bio.
✓ **3D card fan** — playing cards flip smoothly, veil doesn't overlap text.
✓ **Inspiration spotlight** — draws the eye, feels luxe.
✓ **Vercel deployment** — live, fast, AVIF/WebP automatic.

---

## 4. KEY FILES & STRUCTURE

```
app/
  layout.tsx                    — Futura self-hosting
  globals.css                   — **entire design system here**
  page.tsx                      — home (hero + about + projects + footer)
  work/[slug]/page.tsx          — project detail
  work/art/page.tsx             — art gallery
  work/photography/page.tsx     — photography (PolaroidStack)
  inspiration/page.tsx          — dark mode, Spotlight overlay

components/
  Sketchbook.tsx                — **the hero** (mobile + desktop paths)
  CardFan.tsx                   — treehacks playing cards
  PolaroidStack.tsx             — photography filmstrip → gallery
  HeroDown.tsx                  — breathing scroll cue
  Spotlight.tsx                 — cursor spotlight (inspiration only)
  SiteNav.tsx                   — header + dropdown
  Icons.tsx                     — inline SVGs

content/
  content.ts                    — **all copy + data** (edit here for everything)
  dims.json                     — exact image dimensions (auto-generated)

public/
  work/projects/<slug>/0N.jpg   — 7 projects × N images
  work/art/*                    — 10 art pieces
  work/sketchbook/*.png         — 9 transparent page images
  work/photography/*.jpg        — 9 polaroids
  play/oscillon/, ...           — static experiments
  headshot.jpg, collage.png, inspiration.jpg, footer.png
```

---

## 5. CONSTRAINTS & GOTCHAS

**Hard constraints**
- **Desktop flip is canonical** — never restructure the render tree (two halves + flap + instant commit). Mobile is a separate invisible path gated by media query; desktop must byte-match always.
- **Mobile: no src swaps** — visibility toggle only. If you need to change mobile's flip, use visibility, not src.
- **All copy in content.ts** — no hardcoded text in components.
- **Vercel free tier** — keep payloads small; image optimization is automatic but intentional (q50 for mobile, q75 for desktop).

**Real gotchas**
1. **Mobile flash was unsolvable via decoding sync** — Safari ignores it on srcset. The stacked-visibility approach is the fix.
2. **Preload churn on flip** — the preload list was filtering the current page on every turn, changing DOM → scroll anchoring chaos. Fixed by keeping preload stable (all pages, always).
3. **Riffle with unloaded images** — on slow 4G the intro would flip through blank spreads before they decoded. Solved by skipping riffle on mobile.
4. **Header fade band lighter on mobile** — frost was brightness(1.3) + tint. Fixed by using exact paper color + opaque gradient.
5. **Paper veil overlapping text** — card fan component was too low. Fixed by moving `bottom: 4%` → `bottom: 16%` and adjusting veil inset.

**To avoid breaking things**
- Never `npm run build` with dev server running (both use `.next`; build clobbers dev chunks).
- Before touching Sketchbook, read the memory note [[sketchbook-flip-canonical]].
- After adding images, regenerate dims.json: `node -e "const sips...[loop]..." > content/dims.json`.
- Test mobile and desktop separately (different code paths).

---

## 6. HOW TO EXTEND

**Add a new project**
1. Add entry to `projects` array in `content/content.ts` (slug, title, year, tag, body, images via `imgs(slug, N)`).
2. Drop images into `public/work/projects/[slug]/0N.jpg`.
3. Regenerate dims.json.
4. Done — SSG handles `/work/[slug]`.

**Edit copy**
- All visible strings in `content/content.ts`. Edit there, rebuild.

**Add images**
- Place in `public/work/...` or `public/[category]/...`.
- Regenerate dims.json (see git history for the sips loop; it auto-detects the tree).
- Update any gallery array in content.ts if needed.

**Change mobile thresholds**
- `(max-width: 640px), (pointer: coarse)` in Sketchbook.tsx + Spotlight.tsx.
- Media query on `.sb-book` in globals.css for arrow positioning, etc.

**Tweak 3D transforms**
- Sketchbook: `perspective: 2600px`, `rotateY(±180deg)`, `backface-visibility: hidden`.
- CardFan: `rotateY(±180deg)` on `.viewer-card`, same perspective.
- Play with `--rot`, `--tx`, `--ty` parabola vars in CardFan if fan shape changes.

---

## 7. DEPLOYMENT & DNS

**Vercel setup**
- Project is linked (dashboard).
- Auto-deploys main branch to https://matthewyu-[hash].vercel.app.
- Custom domain `matthewyu.dev` → Vercel's nameservers.
- No env vars needed (everything static).

**To redeploy**
- `git push origin main` (auto-triggers Vercel build).
- Or: `npx vercel deploy --prod --yes` (manual).

**CI note**
- No GitHub Actions. Vercel is the CI — builds on every push, serves prod on main only.

---

## 8. MEMORY / NEXT STEPS

See [sketchbook-flip-canonical](placeholder) memory for why the flip is locked to its current structure.

**Nothing urgent** — the site is live, mobile is solid, desktop feels great. Expansion points:
- Add more projects to `/work` (just edit content.ts + add media).
- Film embeds (YouTube/Vimeo `<iframe>`) in 1525 or other projects.
- New experiments in `/play`.
- More art/photography to the galleries (scroll is infinite-ready).

---

## 9. CONTACT & BACKUPS

**Matthew Yu**
- Email: mattyu@stanford.edu
- Portfolio live: https://matthewyu.dev
- GitHub: github.com/matthewyuart/personalportfolio (public, git-tracked)

**Media originals** (higher-res, if needed)
- `~/.Trash/portfolio-originals-*` (move-to-trash, not deleted permanently).
- Ask for re-scan if higher-res versions are needed for print/campaign use.

---

## 10. TL;DR

- **Live site**: https://matthewyu.dev
- **Hero**: 3D sketchbook flip (desktop riffle, mobile stacked-visibility)
- **Mobile**: q50 images, ~130KB total, no flash on rapid taps
- **Extending**: edit `content/content.ts` for copy; add images to `public/work/...`; regenerate dims.json
- **Deploy**: `git push origin main` (auto via Vercel)
- **Questions**: read git log (`git log --oneline`), check globals.css for design tokens, check memory for flip constraints
