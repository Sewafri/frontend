import { GraduationCap, Clock, TrendingUp, Globe, Users, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with years of real-world experience. Every instructor is vetted for teaching excellence.",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description:
      "Study at your own pace with lifetime access to all course materials. Learn anywhere, anytime, on any device.",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    description:
      "95% of our graduates advance in their career within six months. Gain skills that employers are actively hiring for.",
  },
  {
    icon: Globe,
    title: "African Context",
    description:
      "Content designed for the African job market and ecosystem. Real-world projects that reflect local challenges and opportunities.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a thriving community of learners and mentors. Collaborate on projects, share insights, and grow together.",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description:
      "Earn blockchain-verified certificates that employers trust. Share them on LinkedIn and your professional portfolio.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Why choose SewAfri?
        </h2>
        <p className="mt-3 text-base text-text-secondary">
          Everything you need to build a successful career
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="group rounded-xl bg-surface-card p-6 shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500 transition-all duration-200 group-hover:bg-brand-500 group-hover:text-text-primary">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
