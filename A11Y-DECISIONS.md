# A11Y Decisions Log (Pattern Memory)

> **Purpose:** cross-turn memory of choices between **equally conformant alternatives**. Two implementations can both pass `A11Y.md` and axe and still diverge (different `role`, focus pattern, announcement wording) — twenty compliant modals, zero coherence. This file prevents that.

## Rules for the AI

1. **Record only what is not derivable** from `A11Y.md` rules or from the code itself. Landmarks, headings, and alt presence are machine-verifiable — they do **NOT** belong here.
2. **Index by pattern, never by screen.** ✅ *"Destructive confirmation modal → `alertdialog`"* · ❌ *"The dispute modal does X"*.
3. **One line per decision:** pattern → choice → short why.
4. **Read before building:** before generating any interactive component, check this log and reuse the recorded pattern (see *Component Reuse* in the AI Behavior Contract).
5. **Never fork silently:** if a new requirement contradicts a recorded decision, ask the user — do not create a parallel variant.
6. **Stay lean:** tens of lines, not hundreds. This file shares the context budget with Lazy Loading; if it grows past ~40 entries, consolidate.
7. **Versioned, never gitignored:** this is *shared* memory — across turns, agents and developers. A local-only copy per developer forks the patterns and defeats the file's entire purpose.

## Decisions

<!-- Append entries below. Format: - **Pattern** → choice — why. (date) -->

- **Redundant pointer-only target over full keyboard equivalent** → `tabIndex={-1}` + `aria-hidden="true"` on the oversized tap zones (sketchbook page halves); keyboard path is the labeled arrow buttons + document-level arrow-key paging — a focus ring around half the viewport aids no one and SC 2.1.1 is met by the equivalent controls. (2026-08-03)
- **Focus indicator** → single global `:focus-visible` rule (2px `--ink` ring, 3px offset) instead of per-component rings — one focus language site-wide; never `outline: none`. (2026-08-03)
- **Reduced motion** → one blanket `@media (prefers-reduced-motion: reduce)` collapsing all animations/transitions to 0.01ms rather than per-animation opt-outs — `animationend` still fires, so the sketchbook's flip state machine commits pages instantly instead of breaking. (2026-08-03)
- **Decorative repeated images in interactive rows** → `alt=""` + `aria-hidden` wrapper on row thumbnails; the row's visible title is the accessible name. (2026-08-03)
- **Live app embeds** → every `<iframe>` carries a human `title` ("{project} — live"); camera-needing embeds declare `allow="camera"` and the embedded app provides its own no-camera fallback. (2026-08-03)
