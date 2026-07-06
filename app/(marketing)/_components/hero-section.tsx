import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="py-24">
      <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
        Learn skills that matter
      </h1>
      <p className="mt-3 max-w-xl text-base text-text-secondary">
        Courses taught by industry experts. Designed for African learners.
      </p>
      <div className="mt-8">
        <Link
          href="/courses"
          className="inline-flex items-center rounded-lg bg-brand-orange px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-orange/90"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
}
