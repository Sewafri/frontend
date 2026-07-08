---
name: SewAfri
description: African edtech platform — courses, dashboards, platform management
colors:
  primary: "#2563eb"
  accent-50: "#eff6ff"
  accent-100: "#dbeafe"
  accent-200: "#bfdbfe"
  accent-300: "#93c5fd"
  accent-400: "#60a5fa"
  accent-500: "#2563eb"
  accent-600: "#1d4ed8"
  accent-700: "#1e40af"
  accent-800: "#1e3a8a"
  accent-900: "#172554"
  neutral-50: "#f9fafb"
  neutral-100: "#f3f4f6"
  neutral-200: "#e5e7eb"
  neutral-300: "#d1d5db"
  neutral-400: "#9ca3af"
  neutral-500: "#6b7280"
  neutral-600: "#4b5563"
  neutral-700: "#374151"
  neutral-800: "#1f2937"
  neutral-900: "#111827"
  neutral-950: "#030712"
  surface-card: "#ffffff"
  surface: "#f9fafb"
  surface-sunken: "#f3f4f6"
  surface-overlay: "rgba(0,0,0,0.04)"
  text-primary: "#111827"
  text-secondary: "#6b7280"
  text-tertiary: "#9ca3af"
  text-disabled: "#d1d5db"
  border-default: "#e5e7eb"
  border-subtle: "#f3f4f6"
  border-strong: "#d1d5db"
  accent-green: "#16a34a"
  accent-red: "#dc2626"
  accent-amber: "#d97706"
  dark-surface-card: "#1f2937"
  dark-surface: "#111827"
  dark-surface-sunken: "#0f172a"
  dark-text-primary: "#f9fafb"
  dark-text-secondary: "#9ca3af"
  dark-text-tertiary: "#6b7280"
  dark-border-default: "#374151"
typography:
  family: "Geist, sans-serif"
  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
  display:
    fontSize: "clamp(2rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading:
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontWeight: 500
    fontSize: "0.875rem"
    lineHeight: 1.25
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
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
    backgroundColor: "{colors.accent-600}"
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
  card-bordered:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
---

# Design System: SewAfri

## 1. Overview

**Design Direction: "Clean Slate"**

Purposeful emptiness. Every element on screen earns its place through utility, not decoration. The interface breathes — generous whitespace, restrained use of the single accent color, and a typographic hierarchy that guides the eye without visual noise.

This direction rejects decorative warmth, tonal gradients, and expressive color in favor of clarity, precision, and trust. The platform feels like a well-edited document: nothing extraneous, everything intentional.

**Key Characteristics:**
- Single sans-serif typeface (Geist) for everything — hierarchy from size/weight/spacing only
- One accent color (blue) used sparingly — CTAs, links, active states
- Flat or near-flat surfaces — depth from borders and whitespace, not shadows
- Generous, deliberate spacing — uncluttered layouts
- Minimal motion — fades and transitions only when serving a purpose

## 2. Colors

The palette is restrained: mostly neutral with one blue accent. Light mode is clean white; dark mode is deep slate. No warm tones, no gradients, no glow effects.

### Primary
- **Blue** (#2563eb): The sole accent. Used for primary buttons, links, active navigation states, and key data highlights. Never decorative.

### Neutral
- **White** (#ffffff): Default surface background.
- **Gray-50** (#f9fafb): Sunken surfaces, secondary backgrounds.
- **Gray-100** (#f3f4f6): Inset panels, hover states.
- **Gray-200** (#e5e7eb): Default borders, dividers.
- **Gray-400** (#9ca3af): Tertiary text, placeholders.
- **Gray-500** (#6b7280): Secondary text.
- **Gray-900** (#111827): Primary text.

### Surface (Light Mode)
- **White** (#ffffff): Cards, sidebar, raised elements.
- **Gray-50** (#f9fafb): Default application surface.
- **Gray-100** (#f3f4f6): Sunken areas.

### Surface (Dark Mode)
- **Gray-800** (#1f2937): Cards, sidebar, raised elements.
- **Gray-900** (#111827): Default dark surface.
- **Slate-900** (#0f172a): Sunken areas.

### Accent
- **Green** (#16a34a), **Red** (#dc2626), **Amber** (#d97706): Semantic accents for status indicators only.

### Named Rules
**The Single-Accent Rule.** Blue may appear on CTAs, links, active nav items, and data highlights only — never as decoration. If blue is used for visual flair, it is a misuse.

**The Flat-Surface Rule.** Cards and containers are distinguished by subtle borders, not shadows. Only modals and dropdowns may carry shadows. No glow effects, no gradients.

## 3. Typography

**Font:** Geist (variable weight, 400–700)

**Character:** A single clean sans-serif carries everything — headings, body, labels. No second typeface. Hierarchy comes entirely from size, weight, and spacing: large bold for hero text, medium semibold for headings, regular for body, small medium for labels.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 4vw, 2.75rem)`, 1.15): Hero headlines on the landing page and major section titles.
- **Headline** (Semibold 600, `clamp(1.25rem, 3vw, 1.875rem)`, 1.25): Page titles (`h1`), dashboard headers.
- **Title** (Medium 500, `1rem–1.25rem`, 1.4): Card titles, section headings.
- **Body** (Regular 400, `0.875rem–1rem`, 1.6): Paragraphs, descriptions, body content.
- **Label** (Medium 500, `0.75rem–0.875rem`, 1.25): Button text, input labels, metadata, stats.

### Named Rules
**The Single-Font Rule.** Geist is the only typeface. Never introduce a second font for headings or decoration. Hierarchy is a matter of size and weight, not family change.

## 4. Elevation

Depth is conveyed through borders and deliberate whitespace, not shadows. Cards sit flush against their container with a subtle border (`1px solid #e5e7eb`) as the primary differentiator. Shadows are reserved strictly for floating UI: modals, dropdowns, and tooltips.

### Shadow Vocabulary
- **Subtle Edge** (`0 1px 2px rgb(0 0 0 / 0.05)`): Cards at rest (optional, only when border alone is insufficient).
- **Modal Elevation** (`0 10px 15px -3px rgb(0 0 0 / 0.1)`): Modals, dialogs, dropdown menus.
- **Hover Lift** (`0 1px 3px rgb(0 0 0 / 0.1)`): Interactive elements on hover.

### Named Rules
**The Border-Not-Shadow Rule.** Cards and panels use borders for separation. Shadows are reserved for floating UI only. Never apply a shadow to a resting card.

## 5. Components

### Buttons
- **Shape:** Rounded corners (0.75rem / 12px). Padding varies by size.
- **Primary** (Blue `#2563eb`, white text): The single call-to-action per view. Hover shifts to `#1d4ed8`.
- **Outline** (border + transparent background): Secondary actions. Border uses `border-default`. Hover fills with `bg-surface-sunken`.
- **Ghost:** Tertiary actions. Text at `text-secondary`, hover adds a muted background.
- **Destructive** (Red tinted): Background is `destructive/10`, text is `destructive`.

### Cards / Containers
- **Corner Style:** Rounded (1rem / 16px).
- **Background:** White (`#ffffff`) with a subtle `1px` border (`#e5e7eb`). Variants:
  - *Default:* Border at rest, no shadow.
  - *Bordered:* Slightly stronger border (`#d1d5db`), no shadow — used for emphasis.
- **Internal Padding:** 1.5rem (24px).
- **Edge Case — Drop Zones:** Dashed border variant with transparent background.

### Inputs / Fields
- **Style:** Clean, minimal. Transparent background, `border-default` stroke. Rounded corners (0.5rem / 8px).
- **Focus:** Blue ring (3px at 50% opacity).
- **Disabled:** 50% opacity.
- **Error:** Red border + red ring. `aria-invalid` state.

### Navigation (Sidebar)
- **Style:** Vertical nav rail, default expanded (14rem / 224px), collapsible to icon-only.
- **Active State:** Blue accent background-tint + left indicator bar.
- **Typography:** 14px medium weight. Secondary at rest, foreground on hover/active.
- **Mobile:** Sheet overlay with backdrop.

### Stat Cards
- **Style:** Minimal. Icon + value + label. Icon uses accent color. No glow, no decorative orbs.

### Course Cards
- **Style:** Thumbnail-top layout with category pill. Content area: title (14px, semibold), description (12px), metadata row, price row.
- **Interaction:** Whole card link. Subtle border shift on hover.

## 6. Do's and Don'ts

### Do:
- **Do** use blue (`#2563eb`) sparingly — CTAs, links, active nav items, key data highlights only.
- **Do** rely on borders and whitespace for visual separation — cards sit flush with a `1px` border.
- **Do** vary content but keep card structure consistent — one card style, expressed through content alone.
- **Do** use white backgrounds in light mode, slate-gray backgrounds in dark mode.
- **Do** use Geist for everything — headings, body, labels. One typeface.
- **Do** provide hover and focus-visible feedback on every interactive element.

### Don't:
- **Don't** use blue decoratively — no blue icons, blue backgrounds, or blue flourishes.
- **Don't** create gradients, glow effects, or decorative shadows.
- **Don't** use a second typeface or any decorative font.
- **Don't** use warm tones, orange, or any color outside the neutral + blue palette.
- **Don't** animate decoratively — fades for state changes only.
- **Don't** use heavy box-shadows on resting elements.
