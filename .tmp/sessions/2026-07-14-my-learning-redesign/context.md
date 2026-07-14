# Task Context: My Learning Page Redesign

Session ID: 2026-07-14-my-learning-redesign
Created: 2026-07-14
Status: in_progress

## Current Request
Redesign the "My Learning" student dashboard page using the brand's green+amber palette, following the template provided by the user. Add a streak heatmap, branded stat cards with animated counters, richer course rows with cover images/progress/actions, and a completed courses section. Keep all existing data fetching and enrollment logic intact.

## Context Files (Standards to Follow)
- globals.css — brand palette tokens (brand-green, brand-amber, etc.)
- AGENTS.md — design context (Clean Slate, African-first, etc.)

## Reference Files (Source Material to Look At)
- app/(student)/my-learning/page.tsx — existing page to rewrite
- types/db.ts — Enrollment and Course types
- lib/data/enrollments.ts — getMyEnrollments() data fetch
- components/ui/button.tsx — existing button component
- components/ui/badge.tsx — existing badge component
- components/companion/companion.tsx — companion for empty state

## External Docs Fetched
None needed — all data types are project-internal.

## Components
1. StreakHeatmap — GitHub-style activity grid (client-side simulated)
2. MyLearningPage — rewritten page with brand design

## Constraints
- Must preserve getMyEnrollments() data fetching
- Must preserve all Enrollment computation logic (active/completed/avg/total)
- Must preserve empty state with Companion mascot
- Must preserve links to /my-learning/[courseId]
- Must use brand-green (#0a7c42) + brand-amber (#f5a623) palette
- Must use Next.js Image for course cover images
- Must be responsive (mobile-first)
- Must follow existing component patterns (Button, Badge)

## Exit Criteria
- [ ] page.tsx rewritten with new design
- [ ] StreakHeatmap component created
- [ ] Build passes with no errors
- [ ] All existing functionality preserved
