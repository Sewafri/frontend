import type { Feature, Course, Category, Stat, Testimonial, TrustedBy } from "@/types/landing";

export const FEATURES: Feature[] = [
  {
    icon: "graduation-cap",
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with years of real-world experience. Every instructor is vetted for teaching excellence.",
  },
  {
    icon: "clock",
    title: "Flexible Learning",
    description:
      "Study at your own pace with lifetime access to all course materials. Learn anywhere, anytime, on any device.",
  },
  {
    icon: "trending-up",
    title: "Career Outcomes",
    description:
      "95% of our graduates advance in their career within six months. Gain skills that employers are actively hiring for.",
  },
];

export const TRUSTED_BY: TrustedBy[] = [
  { name: "Google", src: "/logos/google.svg" },
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "Amazon", src: "/logos/amazon.svg" },
  { name: "Stripe", src: "/logos/stripe.svg" },
  { name: "Notion", src: "/logos/notion.svg" },
  { name: "Figma", src: "/logos/figma.svg" },
];

export const FEATURED_COURSES: Course[] = [
  {
    id: "1",
    title: "Web Development Bootcamp",
    slug: "web-dev-bootcamp",
    description: "Become a full-stack developer. Covers React, Node.js, TypeScript, and databases.",
    thumbnail: "/courses/web-dev.svg",
    category: "Web Development",
    instructor: { name: "Dr. Sarah Chen" },
    rating: 4.9,
    reviewCount: 2300,
    duration: "24h",
    price: 49,
    currency: "$",
    studentsCount: 12400,
    featured: true,
  },
  {
    id: "2",
    title: "Data Science Fundamentals",
    slug: "data-science-fundamentals",
    description: "Master Python, statistics, machine learning, and data visualization.",
    thumbnail: "/courses/data-science.svg",
    category: "Data Science",
    instructor: { name: "Prof. James Wilson", avatar: "" },
    rating: 4.8,
    reviewCount: 1800,
    duration: "18h",
    price: 39,
    currency: "$",
    studentsCount: 8900,
    featured: true,
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    description: "Design beautiful interfaces. Learn Figma, user research, prototyping, and design systems.",
    thumbnail: "/courses/design.svg",
    category: "Design",
    instructor: { name: "Lisa Chen", avatar: "" },
    rating: 4.9,
    reviewCount: 3100,
    duration: "12h",
    price: 29,
    currency: "$",
    studentsCount: 15600,
    featured: true,
  },
];

export const COURSES: Course[] = [
  ...FEATURED_COURSES,
  {
    id: "4",
    title: "Advanced React Patterns",
    slug: "advanced-react-patterns",
    description: "Compound components, render props, hooks deep-dive, and state management.",
    thumbnail: "/courses/react.svg",
    category: "Web Development",
    instructor: { name: "Dr. Sarah Chen" },
    rating: 4.7,
    reviewCount: 1200,
    duration: "8h",
    price: 29,
    currency: "$",
    studentsCount: 5600,
    featured: false,
  },
  {
    id: "5",
    title: "Machine Learning A-Z",
    slug: "machine-learning-a-z",
    description: "From linear regression to neural networks. Hands-on with real datasets.",
    thumbnail: "/courses/ml.svg",
    category: "Data Science",
    instructor: { name: "Prof. James Wilson", avatar: "" },
    rating: 4.8,
    reviewCount: 2100,
    duration: "30h",
    price: 59,
    currency: "$",
    studentsCount: 10200,
    featured: false,
  },
  {
    id: "6",
    title: "Figma for Developers",
    slug: "figma-for-developers",
    description: "Bridge the gap between design and code. Learn to read and implement any design file.",
    thumbnail: "/courses/figma.svg",
    category: "Design",
    instructor: { name: "Lisa Chen", avatar: "" },
    rating: 4.6,
    reviewCount: 980,
    duration: "6h",
    price: 19,
    currency: "$",
    studentsCount: 4300,
    featured: false,
  },
  {
    id: "7",
    title: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "Docker, Kubernetes, AWS, CI/CD pipelines, and infrastructure as code.",
    thumbnail: "/courses/devops.svg",
    category: "Web Development",
    instructor: { name: "Alex Rivera", avatar: "" },
    rating: 4.7,
    reviewCount: 1500,
    duration: "20h",
    price: 44,
    currency: "$",
    studentsCount: 7200,
    featured: false,
  },
  {
    id: "8",
    title: "Python for Everybody",
    slug: "python-for-everybody",
    description: "The most beginner-friendly Python course. From zero to building real applications.",
    thumbnail: "/courses/python.svg",
    category: "Data Science",
    instructor: { name: "Prof. James Wilson", avatar: "" },
    rating: 4.9,
    reviewCount: 4200,
    duration: "14h",
    price: 34,
    currency: "$",
    studentsCount: 28000,
    featured: false,
  },
  {
    id: "9",
    title: "Mobile App Design",
    slug: "mobile-app-design",
    description: "Design iOS and Android apps. Master mobile patterns, gestures, and platform guidelines.",
    thumbnail: "/courses/mobile.svg",
    category: "Design",
    instructor: { name: "Lisa Chen", avatar: "" },
    rating: 4.8,
    reviewCount: 860,
    duration: "10h",
    price: 24,
    currency: "$",
    studentsCount: 3900,
    featured: false,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "This course completely changed my career trajectory. I went from a support role to a full-stack developer in 4 months.",
    name: "Alex K.",
    role: "Software Engineer",
    company: "Google",
  },
  {
    quote:
      "The projects were incredibly real-world. I built things I could actually show in interviews, not just toy examples.",
    name: "Maria G.",
    role: "Product Manager",
    company: "Stripe",
  },
  {
    quote:
      "I loved the flexibility. Being able to learn at my own pace while working full-time made all the difference.",
    name: "James T.",
    role: "Data Analyst",
    company: "Amazon",
  },
  {
    quote:
      "The instructors genuinely care about your progress. The mentorship aspect sets this platform apart.",
    name: "Priya S.",
    role: "UX Designer",
    company: "Figma",
  },
];

export const STATS: Stat[] = [
  { value: "10,000+", label: "Active Students" },
  { value: "500+", label: "Expert-Led Courses" },
  { value: "95%", label: "Career Advancement Rate" },
  { value: "4.8", label: "Average Course Rating" },
];

export const CATEGORIES: Category[] = [
  { label: "All", value: "all" },
  { label: "Web Development", value: "Web Development" },
  { label: "Data Science", value: "Data Science" },
  { label: "Design", value: "Design" },
  { label: "Business", value: "Business" },
];

export const ITEMS_PER_PAGE = 6;
