import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="rounded-2xl border border-accent-600 bg-accent-500 px-8 py-16 text-center sm:px-16">
        <h2 className="text-3xl font-bold tracking-tight text-text-on-accent sm:text-4xl">
          First course starts in under 2 minutes
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-text-on-accent/85">
          No onboarding flow, no credit card, no &ldquo;talk to sales.&rdquo;
          Pick a course and start learning — free, right now.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-7 py-3 text-sm font-semibold text-accent-700 transition-all hover:bg-white/90"
          >
            Create Free Account
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-text-on-accent transition-all hover:bg-white/10"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
