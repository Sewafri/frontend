import { GraduationCap, Clock, TrendingUp, Globe, Users, Shield } from "lucide-react";

const FOCUS_ITEMS = [
  {
    icon: GraduationCap,
    title: "Expert Instructors",
    description:
      "Working professionals from African tech companies who build curriculum around the problems they actually solve — not textbook theory.",
    layout: "horizontal",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description:
      "Every course includes offline-capable materials and mobile-friendly lessons. Learn on the bus, during lunch, or late at night — no reliable connection required.",
    layout: "horizontal",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    description:
      "95% of graduates advance within six months. Not a stat we made up — we track and publish it because it is the only number that matters.",
    layout: "vertical",
  },
  {
    icon: Globe,
    title: "African Context",
    description:
      "Projects built around African markets, challenges, and opportunities. You are not learning to build for Silicon Valley — you are learning to build for Lagos, Nairobi, and Accra.",
    layout: "vertical",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Direct access to instructors and peers through discussion threads and direct messaging. Learning alone is harder than it needs to be.",
    layout: "stat",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description:
      "Each certificate anchored on-chain so employers can verify it independently. Shareable on LinkedIn, your portfolio, or your CV.",
    layout: "stat",
  },
];

export default function FocusCards() {
  return (
    <section className="py-24">
      <div className="mb-14">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">
          Six ways SewAfri is different
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FOCUS_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.layout === "horizontal") {
            return (
              <article
                key={item.title}
                className="col-span-1 flex gap-5 rounded-xl border border-border-default bg-surface-card p-6 transition-colors hover:border-border-strong sm:p-7"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-default text-text-secondary">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          }

          if (item.layout === "stat") {
            return (
              <article
                key={item.title}
                className="rounded-xl border border-border-default bg-surface-sunken p-6 sm:p-7"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-text-secondary">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </article>
            );
          }

          return (
            <article
              key={item.title}
              className="rounded-xl border border-border-default bg-surface-card p-6 transition-colors hover:border-border-strong sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-border-default text-text-secondary">
                <Icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
