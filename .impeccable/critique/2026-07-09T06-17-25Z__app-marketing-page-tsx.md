---
target: app/(marketing)/page.tsx
total_score: 13
p0_count: 1
p1_count: 3
p2_count: 2
timestamp: 2026-07-09T06-17-25Z
slug: app-marketing-page-tsx
---
# Design Critique: SewAfri Landing Page Hero

**Method:** dual-agent (A: ses_0ba7c9a92ffeV7VtuAfiO5Os4Q · B: ses_0ba7c8bc3ffemtO6g2B3T4wUz3)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Staggered animations signal loading but no CTA preview/feedback |
| 2 | Match System / Real World | 2/4 | "Blockchain-verified" is jargon; card metaphor works |
| 3 | User Control and Freedom | 3/4 | Two clear CTA paths, no traps |
| 4 | Consistency and Standards | 1/4 | Gradients, shadows, green palette violate DESIGN.md |
| 5 | Error Prevention | N/A | No user input |
| 6 | Recognition Rather Than Recall | 3/4 | Certificate card visual helps, but doesn't look like a real cert |
| 7 | Flexibility and Efficiency | N/A | Linear single-purpose section |
| 8 | Aesthetic and Minimalist Design | 2/4 | Decorative gradients + shadows violate "Clean Slate" |
| 9 | Error Recovery | N/A | No errors |
| 10 | Help and Documentation | N/A | No docs |
| **Total** | | **13/24** | **Acceptable** |

## Anti-Patterns Verdict

**AI Slop Risk: MODERATE-HIGH (5/7 indicators)**

Pill badge with icon above headline, hero-metric template (left-text-right-visual with social proof strip), decorative SVG geometry, rotated card, multi-layer "designer" shadow. The combination reads as AI-generated. However, the underline swoosh on "travel" and the diamond shape that intentionally frames the card are genuine craft details that break the pattern.

**Deterministic scan:** CLI detector returned empty — no hardcoded color hexes, no obvious structural issues. Code quality is clean at the syntax level; the problems are design-system compliance, not bugs.

**Browser visualization:** Not available (code-review only).

## Overall Impression

Strong bones undermined by over-decoration. The headline ("Skills that travel with you") and the social proof placement are excellent. The diamond SVG framing the card shows intentional composition. But the gradients, multi-layer shadow, and decorative geometry fight the "Clean Slate" direction. The hero would be stronger with less.

## Priority Issues

### P0: DESIGN.md vs globals.css color mismatch
- **Location:** DESIGN.md:5 / AGENTS.md vs globals.css:37
- **Why:** "Blue #2563eb" is specified in two governing documents; the implementation uses green. Every decision hereafter is contradictory until resolved.
- **Fix:** Update DESIGN.md and AGENTS.md to reflect the ADIU green palette, or revert the CSS.

### P1: Hero background clipped by parent max-w-6xl
- **Location:** page.tsx:12
- **Why:** The SVG background (1440px viewBox) is constrained to 1152px max-width. On desktop monitors the geometric shapes appear cut off.
- **Fix:** Move HeroGeometric outside the constrained wrapper, or use negative margin + overflow.

### P1: Floating card violates three design-system rules
- **Location:** hero-geometric.tsx:160-163
- **Why:** Multi-layer shadow on a resting card, `bg-gradient` on cert preview, `bg-gradient` on avatars. Shadow, gradients, and resting-card elevation are all explicitly prohibited.
- **Fix:** Remove box-shadow, replace gradients with solid color fills.

### P1: Reduced-motion pattern is incomplete
- **Location:** hero-geometric.tsx:156
- **Why:** `animate={{ rotate: -2 }}` is not gated by the `anim()` helper. Rotate will execute even with `prefers-reduced-motion: reduce`.
- **Fix:** Gate the rotate animation: `animate={anim({ rotate: -2 })}`.

### P2: Badge text contrast fails WCAG AA
- **Location:** hero-geometric.tsx:67
- **Why:** `text-accent-500` (#68a22e) on `bg-accent-50` (#f0f9ea) = 2.86:1. Fails both normal and large text thresholds.
- **Fix:** Darken badge text to accent-600 (#4f7f1d, 6.37:1) or use neutral-800 text.

### P2: Two competing focal points in the hero
- **Location:** hero-geometric.tsx:55
- **Why:** 1:1 grid with text and card entering within 250ms of each other. No clear primary scan path.
- **Fix:** Delay the card entrance by 1s+, or reduce its visual weight.

### P3: Certificate preview doesn't look like a certificate
- **Location:** hero-geometric.tsx:176-194
- **Why:** Green gradient panel + grid pattern does not trigger the "certificate" mental model. No borders, seals, signatures.
- **Fix:** Redesign as a literal document visual with seal, recipient name, verification marks.

## Persona Red Flags

**Jordan (First-Timer):** Hits "Blockchain-verified" before anything else. No idea what blockchain means in this context. May bounce at step one. The pill badge should use simpler language.

**Sam (Accessibility):** Badge text at 2.86:1 is unreadable. The decorative avatar circles lack aria-hidden. H3 skip (no H2 on page). The tertiary text #9ca3af on white (2.54:1) also fails.

**Riley (Stress Tester):** Will notice the CSS rotation on the card and question whether it's a bug. The parent max-width clipping is a visible defect on wide screens.

## Minor Observations
- Avatar circles use decorative gradients (a violation) with no semantic content
- `100vh` should be `100dvh` for mobile Safari
- `active:scale-[0.97]` on buttons is not reduced-motion gated
- H3 in card skips heading level (no preceding H2 on page)
- Tertiary text (#9ca3af on white) already fails AA systemically in globals.css:180

## Questions to Consider
- "What would this hero look like with no decorative SVG shapes at all?"
- "If the card must float, could a single border + one shadow layer do the work of four?"
- "Is the blockchain jargon necessary in the first UI element, or could it earn its explanation later?"
