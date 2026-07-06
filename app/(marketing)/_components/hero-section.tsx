import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pt-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent-amber/10 blur-[100px]" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs font-medium text-brand-500">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Empowering African talent worldwide
        </div>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
          Learn skills that
          <span className="text-brand-500"> matter.</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary">
          Courses taught by industry experts, designed for African learners.
          Master in-demand skills, earn certificates, and advance your career
          — all at your own pace.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3 text-sm font-semibold text-text-primary dark:text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98]"
          >
            Browse Courses
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-default bg-surface-card px-7 py-3 text-sm font-semibold text-text-primary shadow-sm transition-all hover:bg-surface-card-hover active:scale-[0.98]"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
          {[
            { value: "10,000+", label: "Active Students", icon: Users },
            { value: "500+", label: "Courses", icon: BookOpen },
            { value: "95%", label: "Career Rate", icon: Award },
            { value: "4.8", label: "Avg Rating", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <stat.icon size={18} className="text-brand-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-tertiary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
