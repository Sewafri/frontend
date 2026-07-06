import { TESTIMONIALS } from "@/constants/landing";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          What our students say
        </h2>
        <p className="mt-3 text-base text-text-secondary">
          Thousands of learners have transformed their careers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="relative rounded-xl bg-surface-card p-6 shadow-sm ring-1 ring-border-subtle"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-accent-amber text-accent-amber"
                />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-text-secondary">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-3 border-t border-border-subtle pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-xs font-semibold text-brand-500">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-tertiary">
                  {t.role} at {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
