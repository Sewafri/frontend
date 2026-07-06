import { GraduationCap, Clock, TrendingUp, Globe, Users, Shield } from "lucide-react";

const FOCUS_ITEMS = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with years of real-world experience. Every instructor is vetted for teaching excellence.",
    accent: "brand",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description:
      "Study at your own pace with lifetime access to all course materials. Learn anywhere, anytime, on any device.",
    accent: "amber",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    description:
      "95% of our graduates advance in their career within six months. Gain skills that employers are actively hiring for.",
    accent: "green",
  },
  {
    icon: Globe,
    title: "African Context",
    description:
      "Content designed for the African job market and ecosystem. Real-world projects that reflect local challenges and opportunities.",
    accent: "indigo",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a thriving community of learners and mentors. Collaborate on projects, share insights, and grow together.",
    accent: "purple",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description:
      "Earn blockchain-verified certificates that employers trust. Share them on LinkedIn and your professional portfolio.",
    accent: "brand",
  },
];

function FocusCard({
  icon: Icon,
  title,
  description,
  accent,
  index,
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  accent: string;
  index: number;
}) {
  const isTall = index === 0 || index === 5;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-surface-card p-6 shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 sm:p-7 ${
        isTall ? "sm:row-span-2" : ""
      }`}
    >
      {/* Accent bar */}
      <span
        className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${
          accent === "brand"
            ? "bg-brand-500"
            : accent === "amber"
              ? "bg-accent-amber"
              : accent === "green"
                ? "bg-accent-green"
                : accent === "indigo"
                  ? "bg-accent-indigo"
                  : "bg-accent-purple"
        }`}
      />

      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
          accent === "brand"
            ? "bg-brand-500/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-text-primary"
            : accent === "amber"
              ? "bg-accent-amber/10 text-accent-amber group-hover:bg-accent-amber group-hover:text-text-primary"
              : accent === "green"
                ? "bg-accent-green/10 text-accent-green group-hover:bg-accent-green group-hover:text-text-primary"
                : accent === "indigo"
                  ? "bg-accent-indigo/10 text-accent-indigo group-hover:bg-accent-indigo group-hover:text-text-primary"
                  : "bg-accent-purple/10 text-accent-purple group-hover:bg-accent-purple group-hover:text-text-primary"
        }`}
      >
        <Icon size={20} />
      </div>

      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </article>
  );
}

export default function FocusCards() {
  return (
    <section className="py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Why SewAfri?
        </h2>
        <p className="mt-3 text-base text-text-secondary">
          Everything you need to build a successful career
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        {FOCUS_ITEMS.map((item, i) => (
          <FocusCard key={item.title} {...item} index={i} />
        ))}
      </div>
    </section>
  );
}
