import Link from "next/link";
import { UPDATES } from "@/constants/landing";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function UpdatesList() {
  return (
    <section className="py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary text-balance">
            Latest updates
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-accent-500 transition-colors hover:text-accent-600 sm:flex"
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
            className={`group grid items-start gap-4 rounded-2xl border border-border-default bg-surface-card p-6 transition-colors hover:border-border-strong sm:grid-cols-[1fr_auto] sm:items-center ${
              i === 0 ? "border-accent-500" : ""
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs font-semibold text-text-tertiary">
                  {update.category}
                </span>
                <span className="text-xs text-text-tertiary">{update.date}</span>
              </div>
              <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-500 transition-colors">
                {update.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
                {update.excerpt}
              </p>
            </div>
            <ArrowUpRight
              size={18}
              className="text-text-tertiary transition-all group-hover:text-accent-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-500 transition-colors hover:text-accent-600"
        >
          View all posts
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
