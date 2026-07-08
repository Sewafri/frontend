import { STATS } from "@/constants/landing";

export default function StatBlock() {
  return (
    <section className="py-14">
      <div className="rounded-2xl border border-border-default bg-surface-sunken px-8 py-12 sm:px-16 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold leading-none tracking-tighter text-text-primary">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-text-tertiary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
