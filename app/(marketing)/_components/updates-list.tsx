import Link from "next/link";
import { UPDATES } from "@/constants/landing";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function UpdatesList() {
  return (
    <section className="py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">
            Latest updates
          </h2>
          <p className="mt-3 text-base text-text-secondary">
            News, features, and stories from the SewAfri community
          </p>
        </div>
        <Link
          href="/blog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600 sm:flex"
        >
          View all posts
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="grid gap-4">
        {UPDATES.map((update, i) => (
          <Link
            key={update.id}
            href={update.href}
            className={`group grid items-start gap-4 rounded-2xl bg-surface-card p-6 shadow-sm ring-1 ring-border-subtle transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:items-center ${
              i === 0 ? "ring-brand-500/20" : ""
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-[11px] font-semibold text-text-tertiary">
                  {update.category}
                </span>
                <span className="text-xs text-text-tertiary">{update.date}</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-brand-500 transition-colors">
                {update.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
                {update.excerpt}
              </p>
            </div>
            <ArrowUpRight
              size={18}
              className="text-text-tertiary transition-all group-hover:text-brand-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
        >
          View all posts
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
