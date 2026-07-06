import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="relative overflow-hidden rounded-2xl bg-brand-500 px-8 py-16 text-center shadow-xl shadow-brand-500/20 sm:px-16"><div className="pointer-events-none absolute inset-0 bg-black/15" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-[40px]" />

        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start learning today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-white/95">
            Join thousands of African learners advancing their careers.
            Your journey starts here.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-brand-700 shadow-lg transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
