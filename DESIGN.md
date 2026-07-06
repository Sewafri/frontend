---
name: SewAfri
description: African edtech platform — courses, dashboards, platform management
colors:
  primary: "#ff7000"
  brand-50: "#fff7ed"
  brand-100: "#ffedd5"
  brand-200: "#ffd4a8"
  brand-300: "#ffb374"
  brand-400: "#ff8c3a"
  brand-500: "#ff7000"
  brand-600: "#e05a00"
  brand-700: "#b84400"
  brand-800: "#933500"
  brand-900: "#7a2b00"
  neutral-50: "#fafaf9"
  neutral-100: "#f5f5f4"
  neutral-200: "#e7e5e4"
  neutral-300: "#d6d3d1"
  neutral-400: "#a8a29e"
  neutral-500: "#78716c"
  neutral-600: "#57534e"
  neutral-700: "#44403c"
  neutral-800: "#292524"
  neutral-900: "#1c1917"
  surface-raised: "#ffffff"
  surface-card: "#ffffff"
  surface: "#faf8f5"
  surface-sunken: "#f0ede8"
  surface-overlay: "rgba(0,0,0,0.04)"
  text-primary: "#1c1917"
  text-secondary: "#78716c"
  text-tertiary: "#a8a29e"
  text-disabled: "#d6d3d1"
  border-default: "#e5e0d8"
  border-subtle: "#ede9e3"
  border-strong: "#d4cdc3"
  accent-blue: "#3b82f6"
  accent-green: "#22c55e"
  accent-red: "#ef4444"
  accent-amber: "#f59e0b"
  accent-purple: "#a855f7"
  dark-surface-raised: "#1e1b18"
  dark-surface-card: "#1a1816"
  dark-surface: "#151311"
  dark-surface-sunken: "#0f0d0b"
  dark-text-primary: "#fafaf9"
  dark-text-secondary: "#a8a29e"
  dark-text-tertiary: "#78716c"
  dark-border-default: "#2c2824"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Space Grotesk, sans-serif"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Geist, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "Geist, sans-serif"
    fontWeight: 500
    fontSize: "0.875rem"
    lineHeight: 1.25
    letterSpacing: "0"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
  3xl: "1.5rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-600}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  card-default:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  card-interactive:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  card-elevated:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 0.625rem"
---

# Design System: SewAfri

## 1. Overview

**Creative North Star: "The Baobab Canopy"**

Rooted, sheltering, and generous — like the iconic African baobab that serves as a village gathering place, SewAfri's design provides shade for learning, growth, and connection. The interface is warm without being saccharine, confident without being loud. Every surface feels deliberately placed by a human designer who respects the learner's time and attention.

The system explicitly rejects the generic corporate edtech aesthetic (sterile blues, rigid card grids, dense table UIs) and the telltale signs of AI-generated design (identical cards, templated gradients, stale symmetry). Instead, it favors varied card styles, intentional asymmetry across page layouts, and a warm tonal hierarchy that guides the eye without shouting.

**Key Characteristics:**
- Warm tonal layering over heavy shadows
- Generous, deliberate spacing — no clutter
- Rounded corners on cards gently curved (12–16px)
- Orange brand accent used with restraint (≤10% of any given screen)
- Responsive micro-interactions that feel tactile, not gratuitous
- Dark mode with warm undertones, not pure gray

## 2. Colors

The palette is anchored by a warm orange that evokes African sunsets, terracotta, and spice markets. Neutrals lean warm (stone, clay, sand), never cool or sterile. Light mode is cream-warm; dark mode is espresso-warm.

### Primary
- **Burnt Orange** (#ff7000 / oklch(0.65 0.18 45)): Primary accent for CTAs, active nav indicators, decorative glows, and emphasis elements. Used on ≤10% of any screen — its rarity is the point.

### Neutral
- **Warm Ivory** (#fafaf9): Lightest neutral for backgrounds and elevated cards.
- **Warm Sand** (#faf8f5): Default surface background in light mode.
- **Faded Clay** (#f0ede8): Sunken surfaces (footers, secondary backgrounds).
- **Warm Stone** (#78716c): Secondary text and muted foregrounds.
- **Charcoal** (#1c1917): Primary text — dark but never pure black, keeping the warm tone.

### Surface (Light Mode)
- **Pure White** (#ffffff): Raised surfaces, cards, modals, sidebar.
- **Warm Sand** (#faf8f5): Default application surface.
- **Faded Clay** (#f0ede8): Sunken areas — secondary backgrounds, inset panels.

### Surface (Dark Mode)
- **Deep Espresso** (#1e1b18): Raised surfaces, cards, sidebar.
- **Dark Earth** (#151311): Default dark surface.
- **Midnight Soil** (#0f0d0b): Sunken areas.

### Accent
- **Sky Blue** (#3b82f6), **Leaf Green** (#22c55e), **Ruby** (#ef4444), **Honey** (#f59e0b), **Amethyst** (#a855f7): Semantic accents for data visualization, status indicators, and role-colored dashboards (admin = ruby, instructor = leaf green, student = brand orange).

### Named Rules
**The Burnt Orange Rule.** The primary accent may not exceed 10% of any screen. Its rarity gives it power. CTAs, active nav indicators, and one decorative element per view — nothing more.

**The Warmth Rule.** No pure white, no pure black, no cool grays. Every neutral is tinted warm — toward cream in light mode, toward espresso in dark mode. If a gray could be mistaken for a corporate LMS gray, it is too cold.

## 3. Typography

**Display Font:** Space Grotesk (weight 500–700)
**Body Font:** Geist (variable weight)
**Label/Mono Font:** Geist Mono

**Character:** A geometric sans-serif (Space Grotesk) leads headings with confidence and warmth — its open apertures and generous spacing feel approachable, not technical. Geist, a clean humanist sans, carries the body with readability at small sizes. The pairing feels editorial but grounded: the headings have personality, the body gets out of the way.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3rem)`, 1.15): Hero headlines on the landing page and major section titles. Never used for body work.
- **Headline** (Semibold 600, `clamp(1.25rem, 3vw, 1.875rem)`, 1.25): Page titles (`h1`), dashboard headers.
- **Title** (Medium 500, `1rem–1.25rem`, 1.4): Card titles, section headings.
- **Body** (Regular 400, `0.875rem–1rem`, 1.6): Paragraphs, descriptions, body content. Max line length 70 characters.
- **Label** (Medium 500, `0.75rem–0.875rem`, 1.25): Button text, input labels, metadata, stats. Small but legible at any size.

### Named Rules
**The Heading Rule.** Space Grotesk is reserved for hierarchy. Never use it for paragraph body text. Geist handles all reading.

## 4. Elevation

Depth is conveyed through warm tonal layering rather than heavy box-shadows. A card sits one tone above its container; a raised surface (modal, sidebar) sits one tone above the card. Shadows are used as subtle accents — hover glows, not depth cues.

This "flat-but-warm" approach keeps the interface clean and readable while maintaining visual hierarchy. The lack of heavy shadows is a deliberate rejection of the Material Design aesthetic.

### Shadow Vocabulary
- **Subtle Edge** (`0 1px 2px rgb(0 0 0 / 0.05)`): Default shadow on cards at rest.
- **Hover Lift** (`0 4px 6px -1px rgb(0 0 0 / 0.08)`): Interactive cards and stat cards on hover. Paired with `-translate-y-0.5`.
- **Modal Elevation** (`0 20px 25px -5px rgb(0 0 0 / 0.1)`): Modals, dialogs, dropdown menus.
- **Brand Glow** (`0 0 20px rgb(255 112 0 / 0.15)`): Featured cards and accent elements — a soft orange halo that signals importance.

### Named Rules
**The No-Heavy-Shadow Rule.** Tonal layering carries hierarchy. Shadows are for hover feedback and modal separation only. Never use a shadow as the primary depth cue on a resting element.

## 5. Components

### Buttons
- **Shape:** Generously rounded corners (0.75rem / 12px). Padding varies by size: default is `h-8 px-2.5`.
- **Primary** (Burnt Orange `#ff7000`, white text): The single call-to-action per view. Hover shifts to Ember (`#e05a00`). Focus uses a ring matching the brand.
- **Outline** (border + transparent background): Secondary actions. Border uses `border-border-default`. Hover fills with `bg-muted`.
- **Ghost:** Tertiary actions. Text colored at `text-secondary`, hover adds a muted background.
- **Destructive** (Ruby tinted): Background is `destructive/10`, text is `destructive`. Hover doubles the background opacity.
- **Interaction:** 200ms transition, active state presses down 1px. Focus-visible ring is always present.

### Cards / Containers
- **Corner Style:** Gently curved (1rem / 16px). The default radius across all card variants.
- **Background:** Surface-card (`#ffffff` in light, `#1a1816` in dark). Variants:
  - *Default:* Subtle border + subtle shadow at rest.
  - *Interactive:* Same, but lifts on hover (`-translate-y-0.5`, `shadow-md`).
  - *Elevated:* Sits visually above background (`shadow-md`, no lift on hover).
  - *Bordered:* Dashed border, transparent background — used for placeholders and drop zones.
  - *Inset:* Sunken background (`surface-sunken`), no border or shadow — used for secondary info.
  - *Featured:* Brand glow, subtle gradient overlay — used for hero content and premium courses.
- **Internal Padding:** 1.5rem (24px).
- **Shadow Strategy:** Subtle edge at rest; hover lift for interactive variants; brand glow for featured.

### Inputs / Fields
- **Style:** Clean, minimal. Transparent background inside, `border-input` stroke. Rounded corners (0.5rem / 8px).
- **Focus:** Border shifts to brand orange (`ring`), 3px ring at 50% opacity.
- **Disabled:** 50% opacity, `bg-input/50` fill in light, `bg-input/80` in dark.
- **Error:** Red border + red ring. Clear `aria-invalid` state.

### Navigation (Sidebar)
- **Style:** Vertical nav rail, default expanded (14rem / 224px), collapsible to icon-only (3.5rem / 56px).
- **Active State:** Role-colored accent (brand orange for student, ruby for admin, green for instructor). Active item gets a 2px left indicator bar + tinted background (`{accent}/10`).
- **Typography:** 14px medium weight. Secondary color at rest, foreground on hover/active.
- **Mobile:** Non-expandable; only icon-only mode. Relies on the top navbar for label access.

### Stat Cards
- **Style:** Like interactive cards but with an accent-colored icon capsule. A decorative blur-orb appears on hover behind the icon.
- **Accent Mapping:** Brand orange / sky blue / leaf green / amethyst / honey — each drives the icon color, icon background tint, and hover glow hue.

### Course Cards
- **Style:** Thumbnail-top layout with category pill overlaid. Content area has title (14px, semibold), description (12px, 2-line clamp), metadata row (rating, students, duration), and a price row divided by a subtle border.
- **Interaction:** Whole card is a link. Lifts on hover with shadow + translate. Thumbnail image scales 105% on hover.

## 6. Do's and Don'ts

### Do:
- **Do** use Burnt Orange (`#ff7000`) sparingly — one CTA, one active indicator, one decorative element per screen. Its rarity is its power.
- **Do** lean on tonal layering for depth: card surfaces sit a tone above the page; raised elements sit a tone above cards. Let the warm surface hierarchy do the work.
- **Do** vary card styles across a page — mix default, interactive, and inset variants so no two sections look templated.
- **Do** use the warm, cream-based palette in light mode (never pure white backgrounds) and the espresso-based palette in dark mode (never pure black).
- **Do** use Space Grotesk for headings only. Body text is always Geist.
- **Do** provide hover and focus-visible feedback on every interactive element. A 200ms transition on transform and shadow is the standard.

### Don't:
- **Don't** use generic corporate edtech aesthetics — no sterile blues, rigid card grids, or dense table UIs that resemble Blackboard, Moodle, or Coursera.
- **Don't** create the "AI-generated" look — no identical cards in a row, no templated gradients, no stale symmetry that makes every section feel copy-pasted.
- **Don't** use heavy box-shadows as the primary depth cue. The tonal layering system carries hierarchy; shadows are for hover feedback only.
- **Don't** use cool or neutral grays. Every neutral must be warm-toned.
- **Don't** exceed the 10% Burnt Orange rule. If orange is everywhere, it is nowhere.
- **Don't** use pure black (`#000`) or pure white (`#fff`) anywhere in the interface.
- **Don't** animate gratuitously. Motion should confirm interaction (hover lift, focus ring), not decorate.
