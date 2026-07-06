import { STATS } from "@/constants/landing";
import { Users, BookOpen, TrendingUp, Star } from "lucide-react";

const STAT_ICONS = [Users, BookOpen, TrendingUp, Star];

export default function StatBlock() {
  return (
    <section className="py-20">
      <div className="relative overflow-hidden rounded-2xl bg-surface-sunken px-8 py-16 ring-1 ring-border-default sm:px-16">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,theme(colors.brand.500/6),transparent_60%)]" />

        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest text-text-tertiary">
            By the numbers
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                    <Icon size={18} />
                  </div>
                  <p className="text-4xl font-bold leading-none tracking-tight text-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-tertiary">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
