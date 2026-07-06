export const BRAND = {
  name: "SewAfri",
  tagline: "Learn Without Limits",
  description:
    "A modern learning management platform connecting African talent with world-class education.",
  url: "https://sewafri.com",
  copyright: `© ${new Date().getFullYear()} SewAfri. All rights reserved.`,
} as const;

export const META = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Access 500+ expert-led courses. Learn at your pace, anywhere, anytime. Join 10,000+ students advancing their careers.",
} as const;
