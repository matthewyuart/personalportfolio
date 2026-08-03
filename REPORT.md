# A11y Verification Report

This report compiles the compliance evidence for a given *Feature*, ensuring its development reached the "Certification Ready" definition.

> This report is a **versioned project record** — never add it to `.gitignore`. Evidence hidden from version control is not evidence: QA and leadership verify it before release, and audits read it after.

> **Marking legend (mandatory):**
> `[x]` verified, with the evidence described beside it · `[!]` verified and **failed** (fix it, or open an entry in `EXCEPTIONS.md`) · `[~]` partially verified, with what is missing written down · `[ ]` **not verified** — the reason MUST be written beside it.
> Marking `[x]` without reproducible evidence invalidates the whole report.

---

## 📌 Validation Context
- **Feature/Epic:** matthewyu.dev — sitewide PP Mori typeface migration, spacing-scale normalization, and accessibility pass (WCAG 2.2 AA / Standard profile)
- **Test Date:** 08/03/2026
- **Covers interface as of:** the "PP Mori + spacing scale + accessibility pass" commit on `main` (see git log)
- **Compliance Status:** ⚠️ CONDITIONAL — automated + keyboard + reflow evidence collected by the AI agent; screen-reader and zoom checkpoints below are marked for Matthew Yu to run in a real browser/AT

## 1. Technical Verification (Automated & Semantics)
- [x] **Axe-Core:** `@axe-core/playwright` (wcag2a, wcag2aa, wcag22aa tags) run on `/`, `/play`, `/work/rem`, `/work/gesturewatcher`, `/work/art`, `/inspiration` — **0 violations on every route's own DOM**. One `critical/button-name` finding is inside the embedded third-party rem prototype iframe (`spill-verify-25039844.figma.site`, Figma Make–generated code) — outside this repo's DOM; noted below.
- [x] **HTML Semantics:** all interactive endpoints are native `<button>`/`<a>` (grep-verified; no clickable divs). Sketchbook tap zones are real `<button>`s kept pointer-only by design (see A11Y-DECISIONS.md).
- [x] **Heading Hierarchy:** every page has one `h1` (hero name / project title); section labels are `h2` (`.section-label`); no skips (source-verified across `app/`).

## 2. Tab Order and Focus Management
- [x] **Focus Indicator:** global `:focus-visible` — 2px `--ink` (#1d1f22) ring, 3px offset, ~14:1 against paper; never suppressed anywhere (`grep outline` shows only the global rule). Skip link shows an inverted ring.
- [x] **Logical Navigation:** first Tab reveals the "skip to content" link (screenshot evidence); order continues name → nav → socials → page content, matching visual order (DOM order = visual order; no positive tabindex anywhere).
- [x] **Captured Focus (Modals/Overlays):** no modals exist. The card-fan viewer is inline content dismissed by outside click/second activation, and background stays interactive by design (not a dialog).

## 3. Behavior and Task Return
- [ ] **Screen Reader Test:** requires a human with VoiceOver — **Matthew Yu must run** (agent cannot truthfully claim SR output).
- [x] **Status Change (`aria-live`):** no async/dynamic status content exists (fully static site; no forms, toasts, or fetch states to announce).
- [x] **Form Filling:** no forms on the site.

## 4. Visual Perception and Comprehension
- [x] **Text & UI Contrast:** `--ink-soft` raised 0.55→0.68 alpha (≈5.5:1 on paper; was ~3.9:1); dark-mode ink-soft 0.6→0.72; body/bio ≥9:1; minimum font size raised 11px→12px sitewide (Standard-profile house rule).
- [x] **Redundancy:** no state is conveyed by color alone (nav current page = weight/color + `aria-current`; links underlined in body copy).
- [~] **Scale / Zoom:** reflow at 320 CSS px verified programmatically — `scrollWidth === 320`, no two-dimensional scrolling, content intact (SC 1.4.10). Browser 200% text-only zoom (SC 1.4.4) **needs a human pass — Matthew Yu**.

---
## 📝 Assessment Notes or Known Blockers

- **Note 1 (third-party embed):** the one Axe critical (`button-name`) lives inside the rem prototype iframe — Figma Make–generated markup served from `spill-verify-25039844.figma.site`. It is not addressable from this repo; fixing it means regenerating/editing the prototype itself. Tracked as embedded-content debt, not a portfolio DOM violation.
- **Note 2 (reduced motion):** a blanket `prefers-reduced-motion` rule collapses all animations to 0.01ms; the sketchbook's `animationend`-driven state machine still commits (pages change instantly). Riffle intro additionally skips entirely under the preference.
- **Note 3 (targets):** hit areas expanded — sketchbook arrows to ≥44px via padding, hero scroll cue to ≥44px, header icon buttons to a 41px box with ≥16px neighbor spacing (SC 2.5.8 satisfied; 44px house rule met everywhere except the compact mobile header icons, where spacing provides the exception).
